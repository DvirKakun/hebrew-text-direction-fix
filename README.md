# 🔧 Hebrew Text Direction Fix for AI Chats

**Chrome Extension - Works on 8+ AI Chat Platforms**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Coming%20Soon-blue?style=for-the-badge&logo=googlechrome)](https://chrome.google.com/webstore)
[![GitHub release](https://github.com/DvirKakun/hebrew-text-direction-fix.git?style=for-the-badge)](https://github.com/DvirKakun/hebrew-text-direction-fix.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **תיקון אוטומטי לכיוון טקסט עברית-אנגלית בפלטפורמות AI**
>
> Automatic bidirectional text fix for Hebrew-English mixed content in AI chat platforms

---

## 🎯 What This Extension Does

Automatically fixes the display order of mixed Hebrew-English text in AI chat platforms. When you type text that mixes Hebrew and English, this extension intelligently detects the primary language and sets the correct text direction so everything displays in the proper order.

### ❌ **The Problem:**

When typing mixed Hebrew-English text in AI chats, words often appear in the wrong order:

```
❌ Wrong: "I like to eat בננה" → Words appear jumbled
❌ Wrong: "אני אוהב לאכול banana" → English word in wrong position
```

### ✅ **The Solution:**

This extension automatically fixes it:

```
✅ Correct: "I like to eat בננה" → Perfect LTR flow with Hebrew inline
✅ Correct: "אני אוהב לאכול banana" → Perfect RTL flow with English inline
```

## 🌐 Supported Platforms

This extension works automatically on these AI chat platforms:

### ✅ **Fully Supported:**

- **Claude.ai** - All Claude subdomains
- **ChatGPT** - chat.openai.com, chatgpt.com, and OpenAI sites
- **Google Gemini/Bard** - gemini.google.com, bard.google.com
- **Microsoft Copilot** - copilot.microsoft.com, Bing Chat
- **Perplexity.ai** - perplexity.ai
- **Character.ai** - character.ai
- **Poe.com** - poe.com
- **You.com** - you.com

_The extension activates automatically on these sites - no configuration needed!_

## ✨ Key Features

🎨 **Smart Language Detection** - Automatically detects primary language (Hebrew or English)  
⚡ **Real-Time Processing** - Fixes text as you type, instantly  
🔧 **Zero Configuration** - Install and forget - it just works  
🌐 **8+ Platforms** - Works on Claude, ChatGPT, Gemini, Copilot, and more  
📱 **Lightweight** - Minimal performance impact  
🛡️ **Privacy-First** - No data collection, works entirely offline  
🎯 **Smart Targeting** - Only activates on supported AI chat platforms

## 🧠 How It Works

The extension uses an intelligent algorithm to determine text direction:

1. **Scans your text** for Hebrew and English characters
2. **Finds the first strong directional character** to determine primary language
3. **Sets proper direction:**
   - Hebrew primary → Right-to-Left (RTL)
   - English primary → Left-to-Right (LTR)
4. **Applies CSS rules** for proper bidirectional text handling

## 📥 Installation

### 🏪 Method 1: Chrome Web Store (Recommended - Coming Soon)

Once approved, install with one click from the Chrome Web Store.

### 📦 Method 2: Manual Installation (Available Now)

1. **Download the extension:**

   - Download the latest release from [Releases](https://github.com/DvirKakun/hebrew-text-direction-fix.git)
   - Extract the ZIP file

2. **Install in Chrome:**

   ```
   1. Open Chrome → chrome://extensions
   2. Enable "Developer mode" (top-right toggle)
   3. Click "Load unpacked"
   4. Select the extracted folder
   5. Extension icon appears in toolbar
   ```

3. **Test it:**
   - Go to Claude.ai, ChatGPT, or any supported platform
   - Type: `אני אוהב ChatGPT כי זה helpful מאוד`
   - Text should display perfectly with correct RTL flow!

## 🧪 Test Examples

Try these examples on any supported platform:

### 📝 English Primary (LTR):

```
✅ "I like to eat בננה and drink קפה"
✅ "Learning עברית with ChatGPT is helpful"
✅ "Programming in JavaScript עם Hebrew comments"
```

### 📝 Hebrew Primary (RTL):

```
✅ "אני אוהב לאכול banana כל בוקר"
✅ "השימוש ב-ChatGPT זה amazing באמת"
✅ "אני מתכנת ב-JavaScript ו-Python"
✅ "הביטוי artificial intelligence פירושו בינה מלאכותית"
```

### 🔬 Edge Cases:

```
✅ Numbers: "יש לי 5 apples ו-3 oranges"
✅ Mixed greetings: "Hello שלום"
✅ URLs: "בקר באתר https://example.com לפרטים"
✅ Code: "הפונקציה console.log() מדפיסה טקסט"
```

## 🔒 Privacy & Security

- ✅ **Works entirely locally** - No external connections
- ✅ **No data collection** - Zero tracking or analytics
- ✅ **No permissions needed** - Only requires access to supported websites
- ✅ **Open source** - All code is visible and auditable
- ✅ **Safe** - Only modifies text display, nothing else

## 💻 Technical Details

### Implementation:

- **Language:** Pure JavaScript (no external dependencies)
- **Detection:** First-strong-character algorithm for primary language
- **CSS Properties:** `direction`, `unicode-bidi: plaintext`, `text-align`
- **Performance:** Processes text in microseconds with minimal CPU usage

### Browser Support:

| Browser    | Support | Notes          |
| ---------- | ------- | -------------- |
| ✅ Chrome  | Full    | Primary target |
| ✅ Edge    | Full    | Chromium-based |
| ⚠️ Firefox | TBD     | Future support |

## 🤝 Contributing

### 🐛 Found a Bug?

1. Open an issue with:
   - The website URL where it occurred
   - Example text that doesn't work correctly
   - Screenshot if possible

### 💡 Want to Add a New Site?

Request support for additional AI platforms by opening an issue!

### 🔧 Want to Contribute Code?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-site`
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

## 📖 Files in This Extension

```
hebrew-text-direction-fix/
├── manifest.json       # Extension configuration
├── content.js         # Main text processing logic
├── styles.css        # BiDi CSS rules
├── icons/           # Extension icons (16px, 48px, 128px)
└── README.md        # Documentation
```

## 🚀 Roadmap

### Version 1.1 (Planned):

- [ ] Firefox support
- [ ] Performance optimizations
- [ ] Additional platform support
- [ ] User settings/preferences

### Version 1.2 (Ideas):

- [ ] Manual direction toggle
- [ ] Support for additional RTL languages (Arabic, Persian)
- [ ] Visual direction indicator

## ❓ FAQ

**Q: Does this work on mobile Chrome?**  
A: Unfortunately, Chrome mobile doesn't support extensions. Consider Kiwi Browser on Android.

**Q: Will this slow down my browsing?**  
A: No! The extension only activates on AI chat sites and processes text in microseconds.

**Q: Can I add more websites?**  
A: Yes! Edit the `matches` array in `manifest.json` or request new sites via GitHub issues.

**Q: Is my data safe?**  
A: Absolutely! The extension only modifies how text is displayed - it doesn't send any data anywhere.

**Q: Why do I need this extension?**  
A: Browser default bidirectional text handling doesn't always work correctly for mixed Hebrew-English content. This extension provides intelligent, context-aware direction detection.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

**TL;DR:** Free to use, modify, and distribute. Just keep the license notice.

## 🙏 Acknowledgments

- Hebrew language community for testing and feedback
- AI chat platforms for building amazing tools
- Open source community for inspiration

## 📞 Support

- 📧 **Email:** dvireteui1@gmail.com

## 🏆 Show Your Support

If this extension helped you:

- ⭐ **Star this repository**
- 📢 **Share with friends**
- 🐛 **Report bugs to help improve it**
- 💡 **Suggest new features**

---

<div align="center">

**Made with ❤️ for Hebrew-English bilingual AI chat users**

Works automatically on Claude, ChatGPT, Gemini, Copilot, Perplexity, Character.ai, Poe, and You.com

[⬆ Back to Top](#-hebrew-text-direction-fix-for-ai-chats)

</div>
