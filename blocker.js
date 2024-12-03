// Required dependencies:
// npm install @atproto/api dotenv pino
import { BskyAgent } from '@atproto/api'
import dotenv from 'dotenv'
import pino from 'pino'

// Load environment variables
dotenv.config()

// Setup logging
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  }
})

// Configuration
const RATE_LIMIT_DELAY = 1000 // 1 second delay between requests
const MAX_RETRIES = 3

class BlueskyBlocker {
  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    })
  }

  async initialize() {
    try {
      await this.agent.login({
        identifier: process.env.BLUESKY_USERNAME,
        password: process.env.BLUESKY_PASSWORD
      })
      logger.info('Successfully logged into Bluesky')
    } catch (error) {
      logger.error('Failed to login to Bluesky:', error)
      throw error
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getProfile(username) {
    try {
      const profile = await this.agent.getProfile({ actor: username })
      return profile.data
    } catch (error) {
      logger.error(`Failed to get profile for ${username}:`, error)
      throw error
    }
  }

  async getFollowers(did, cursor = null, followers = []) {
    try {
      const response = await this.agent.getFollowers({ actor: did, limit: 100, cursor })
      
      followers.push(...response.data.followers)
      
      // Handle pagination
      if (response.data.cursor) {
        await this.sleep(RATE_LIMIT_DELAY)
        return this.getFollowers(did, response.data.cursor, followers)
      }
      
      return followers
    } catch (error) {
      logger.error(`Failed to get followers:`, error)
      throw error
    }
  }

  async blockUser(did, retryCount = 0) {
    try {
      await this.agent.mute(did)
      logger.info(`Successfully blocked user: ${did}`)
      await this.sleep(RATE_LIMIT_DELAY)
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        logger.warn(`Failed to block ${did}, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
        await this.sleep(RATE_LIMIT_DELAY * 2)
        return this.blockUser(did, retryCount + 1)
      }
      logger.error(`Failed to block ${did} after ${MAX_RETRIES} attempts:`, error)
      throw error
    }
  }

  async blockAllFollowers(username) {
    try {
      logger.info(`Starting mass block for followers of ${username}`)
      
      // Get target user's profile
      const profile = await this.getProfile(username)
      
      // Get all followers
      const followers = await this.getFollowers(profile.did)
      logger.info(`Found ${followers.length} followers to block`)
      
      // Block each follower
      for (const follower of followers) {
        try {
          await this.blockUser(follower.did)
        } catch (error) {
          logger.error(`Failed to block follower ${follower.did}:`, error)
          // Continue with next follower even if one fails
          continue
        }
      }
      
      logger.info('Mass block operation completed')
    } catch (error) {
      logger.error('Mass block operation failed:', error)
      throw error
    }
  }
}

// Main execution
async function main() {
  const targetUsername = process.argv[2]
  
  if (!targetUsername) {
    logger.error('Please provide a target username as a command line argument')
    process.exit(1)
  }
  
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    logger.error('Missing required environment variables')
    process.exit(1)
  }
  
  const blocker = new BlueskyBlocker()
  
  try {
    await blocker.initialize()
    await blocker.blockAllFollowers(targetUsername)
  } catch (error) {
    logger.error('Script execution failed:', error)
    process.exit(1)
  }
}

main()
