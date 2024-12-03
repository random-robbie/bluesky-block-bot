// Required dependencies:
// npm install @atproto/api dotenv pino chalk
import { BskyAgent } from '@atproto/api'
import dotenv from 'dotenv'
import pino from 'pino'
import chalk from 'chalk'

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
    this.stats = {
      totalFollowers: 0,
      successfulBlocks: 0,
      failedBlocks: 0,
      startTime: null,
      endTime: null
    }
  }

  async initialize() {
    try {
      await this.agent.login({
        identifier: process.env.BLUESKY_USERNAME,
        password: process.env.BLUESKY_PASSWORD
      })
      console.log('🔐 Successfully logged into Bluesky')
    } catch (error) {
      logger.error('❌ Failed to login to Bluesky:', error)
      throw error
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  }

  async getProfile(username) {
    try {
      const profile = await this.agent.getProfile({ actor: username })
      return profile.data
    } catch (error) {
      logger.error(`❌ Failed to get profile for ${username}:`, error)
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
      logger.error(`❌ Failed to get followers:`, error)
      throw error
    }
  }

  async blockUser(follower, retryCount = 0) {
    try {
      await this.agent.mute(follower.did)
      this.stats.successfulBlocks++
      console.log(chalk.green(`🚫 Blocked user: ${follower.handle} (${follower.did})`))
      console.log(chalk.gray(`   👤 Display Name: ${follower.displayName || 'N/A'}`))
      console.log(chalk.gray(`   📊 Progress: ${this.stats.successfulBlocks}/${this.stats.totalFollowers} (${Math.round((this.stats.successfulBlocks/this.stats.totalFollowers)*100)}%)`))
      await this.sleep(RATE_LIMIT_DELAY)
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(chalk.yellow(`⚠️  Failed to block ${follower.handle}, retrying... (${retryCount + 1}/${MAX_RETRIES})`))
        await this.sleep(RATE_LIMIT_DELAY * 2)
        return this.blockUser(follower, retryCount + 1)
      }
      this.stats.failedBlocks++
      console.log(chalk.red(`❌ Failed to block ${follower.handle} after ${MAX_RETRIES} attempts:`, error))
      throw error
    }
  }

  printStats() {
    const duration = this.stats.endTime - this.stats.startTime
    console.log('\n📊 Block Operation Statistics 📊')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🎯 Total Followers: ${this.stats.totalFollowers}`)
    console.log(`✅ Successful Blocks: ${this.stats.successfulBlocks}`)
    console.log(`❌ Failed Blocks: ${this.stats.failedBlocks}`)
    console.log(`⏱️  Duration: ${this.formatDuration(duration)}`)
    console.log(`⚡ Average Block Rate: ${Math.round((this.stats.successfulBlocks / (duration/1000)) * 60)} blocks/minute`)
    console.log(`✨ Success Rate: ${Math.round((this.stats.successfulBlocks/this.stats.totalFollowers)*100)}%`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }

  async blockAllFollowers(username) {
    try {
      console.log(chalk.cyan(`🎯 Starting mass block for followers of ${username}`))
      this.stats.startTime = Date.now()
      
      // Get target user's profile
      const profile = await this.getProfile(username)
      
      // Get all followers
      const followers = await this.getFollowers(profile.did)
      this.stats.totalFollowers = followers.length
      console.log(chalk.cyan(`📝 Found ${followers.length} followers to block`))
      
      // Block each follower
      for (const follower of followers) {
        try {
          await this.blockUser(follower)
        } catch (error) {
          // Continue with next follower even if one fails
          continue
        }
      }
      
      this.stats.endTime = Date.now()
      this.printStats()
      console.log(chalk.green('✨ Mass block operation completed'))
    } catch (error) {
      console.log(chalk.red('❌ Mass block operation failed:', error))
      throw error
    }
  }
}

// Main execution
async function main() {
  const targetUsername = process.argv[2]
  
  if (!targetUsername) {
    console.log(chalk.red('❌ Please provide a target username as a command line argument'))
    process.exit(1)
  }
  
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.log(chalk.red('❌ Missing required environment variables'))
    process.exit(1)
  }
  
  const blocker = new BlueskyBlocker()
  
  try {
    await blocker.initialize()
    await blocker.blockAllFollowers(targetUsername)
  } catch (error) {
    console.log(chalk.red('❌ Script execution failed:', error))
    process.exit(1)
  }
}

main()
