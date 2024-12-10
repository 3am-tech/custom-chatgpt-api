# Custom ChatGPT API Application

A modern, customizable chat application built with Node.js and the OpenAI GPT API. This application provides a clean, intuitive interface for interacting with ChatGPT, featuring real-time typing animations, response copying, and customizable settings.

![Custom ChatGPT Interface](https://your-screenshot-url.png)

## Features

- 🤖 Real-time interaction with ChatGPT API
- ✨ Modern, responsive user interface
- ⚡ Live typing animation effect
- 📋 One-click response copying
- ⚙️ Customizable settings via sidebar
- 💾 Persistent user preferences
- 📝 Multi-line input support
- 🔄 Context-aware conversations

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (comes with Node.js)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatgpt-api-js.git
   cd chatgpt-api-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
chatgpt-api-js/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server and API handling
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## Features in Detail

### 1. Chat Interface
- Clean, modern design
- Real-time message updates
- Automatic scrolling
- Multi-line input support

### 2. Typing Animation
- Realistic typing effect for responses
- Customizable animation speed
- Toggle animation on/off
- Persistent animation preferences

### 3. Response Management
- Copy responses with one click
- Visual feedback for copied text
- Preserved message formatting
- Context-aware conversations

### 4. Settings Sidebar
- Easy access to preferences
- Toggle typing animation
- Expandable for future settings
- Clean, organized layout

## API Integration

The application uses the OpenAI GPT-3.5 Turbo model by default. It includes features like:
- Chunked response handling for longer messages
- Context preservation for continuous conversations
- Error handling and retry logic
- Rate limiting consideration

## Customization

### Modifying Response Length
The application is configured to handle longer responses by chunking them. You can adjust the `maxAttempts` and `max_tokens` in `server.js`:

```javascript
const maxAttempts = 5; // Number of chunks
max_tokens: 1000      // Tokens per chunk
```

### Adjusting Typing Speed
Modify the typing animation speed in `script.js`:

```javascript
const typingSpeed = 10; // Milliseconds per character
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the ChatGPT API
- The Node.js community for excellent tools and libraries
- Contributors who help improve this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by [Your Name]
