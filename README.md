# 🚫 Bluesky Mass Block Tool

A robust Node.js script for security researchers and penetration testers to analyze follower relationships and test block functionality on Bluesky Social. This tool allows you to block all followers of a specified user with built-in rate limiting, error handling, and detailed logging.

## 📊 Live Statistics & Features

Watch your blocking progress in real-time with detailed statistics:

```
🚫 Blocked user: user.handle (did:plc:abcdefg...)
   👤 Display Name: John Doe
   📊 Progress: 1/150 (1%)

📊 Block Operation Statistics 📊
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Total Followers: 150
✅ Successful Blocks: 148
❌ Failed Blocks: 2
⏱️  Duration: 0h 2m 30s
⚡ Average Block Rate: 59 blocks/minute
✨ Success Rate: 99%
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🌟 Key Features

- **Real-time Progress**: Watch blocks happen live with usernames and DIDs
- **Detailed Statistics**: Track success rates, speed, and completion time
- **User-friendly Output**: Colorful console output with emojis and progress tracking
- **Rate Limiting**: Intelligent request throttling to prevent API abuse
- **Error Handling**: Comprehensive error catching and retry mechanisms
- **Pagination Support**: Handles large follower lists efficiently
- **Environment Configuration**: Secure credential management via dotenv

## 🛠️ Prerequisites

- Node.js (v14+ recommended)
- npm or yarn package manager
- Bluesky account
- Valid authorization for security testing

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/random-robbie/bluesky-block-bot.git
cd bluesky-block-bot
```

2. Install dependencies:
```bash
npm install @atproto/api dotenv pino pino-pretty chalk
```

3. Create a `.env` file in the project root:
```env
BLUESKY_USERNAME=your.username
BLUESKY_PASSWORD=your_password
```

## 🚀 Usage

Run the script with a target username:
```bash
node script.js target.username
```

## 🎨 Output Explanation

The tool provides rich, colorful output with various indicators:
- 🚫 Block operations
- 👤 User information
- 📊 Progress updates
- ✅ Successful operations
- ❌ Failed operations
- ⚠️ Warnings and retries
- 🎯 Target information

## 🔧 Configuration

Adjust these constants in the script for custom behavior:

```javascript
const RATE_LIMIT_DELAY = 1000  // Delay between requests (ms)
const MAX_RETRIES = 3          // Maximum retry attempts
```

## 📝 Logging

The tool uses both Pino for file logging and Chalk for beautiful console output:
- Structured log files for audit trails
- Colorful console output for real-time monitoring
- Detailed progress and statistics
- Error and warning highlighting

## 🔄 Error Handling

The script handles various error scenarios with visual indicators:
- ❌ Network connectivity issues
- ⚠️ API rate limiting
- ❌ Authentication failures
- ⚠️ Invalid usernames
- ❌ Failed block operations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 🐛 Bug Reports

Report bugs by opening an issue. Include:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Console output and logs

## 📜 License

MIT License - See LICENSE file for details

## ⚖️ Legal Disclaimer

This tool is provided for legitimate security research only. Users are responsible for:
- Obtaining proper authorization
- Complying with applicable laws
- Following responsible disclosure practices
- Adhering to Bluesky's Terms of Service

The author(s) assume no liability for misuse or damages arising from tool usage.

## 🔗 Related Projects

- [AT Protocol Documentation](https://atproto.com/docs)
- [Bluesky API Reference](https://github.com/bluesky-social/atproto)

## 🙋‍♂️ Support

For support:
1. Check existing issues
2. Review documentation
3. Open a new issue
4. Contact maintainers

## ✨ Acknowledgments

- AT Protocol team for API documentation
- Bluesky Social for platform access
- Community contributors

---
Made with ❤️ for the security research community
