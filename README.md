# 🚫 Bluesky Mass Block Tool

A robust Node.js script for security researchers and penetration testers to analyze follower relationships and test block functionality on Bluesky Social. This tool allows you to block all followers of a specified user with built-in rate limiting, error handling, and detailed logging.

## ⚠️ Important Notice

This tool is intended for legitimate security research and penetration testing purposes only. Always:
- Obtain proper authorization before testing
- Follow responsible disclosure practices
- Comply with Bluesky's Terms of Service
- Use rate limiting to avoid service disruption

## 🌟 Features

- **Rate Limiting**: Intelligent request throttling to prevent API abuse
- **Error Handling**: Comprehensive error catching and retry mechanisms
- **Pagination Support**: Handles large follower lists efficiently
- **Detailed Logging**: Structured logging with Pino for debugging and audit trails
- **Environment Configuration**: Secure credential management via dotenv
- **Retry Logic**: Automatic retry of failed operations with exponential backoff

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
npm install
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

Example output:
```
[2024-12-03T12:34:56.789Z] INFO: Successfully logged into Bluesky
[2024-12-03T12:34:57.123Z] INFO: Starting mass block for followers of target.username
[2024-12-03T12:34:57.456Z] INFO: Found 150 followers to block
[2024-12-03T12:34:58.789Z] INFO: Successfully blocked user: did:plc:abcdefg...
...
```

## 🔧 Configuration

Adjust these constants in the script for custom behavior:

```javascript
const RATE_LIMIT_DELAY = 1000  // Delay between requests (ms)
const MAX_RETRIES = 3          // Maximum retry attempts
```

## 📝 Logging

The tool uses Pino for structured logging with the following levels:
- `ERROR`: Critical failures requiring attention
- `WARN`: Non-critical issues and retry attempts
- `INFO`: Regular operation updates

Log files are generated in the project directory for audit purposes.

## 🔄 Error Handling

The script handles various error scenarios:
- Network connectivity issues
- API rate limiting
- Authentication failures
- Invalid usernames
- Failed block operations

Each error includes:
- Timestamp
- Error type
- Detailed message
- Retry attempt count (if applicable)

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
- Error messages and logs

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
