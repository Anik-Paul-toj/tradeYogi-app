# Trade Yogi - AI-Powered Trading Assistant

Trade Yogi is a smart AI-powered trading assistant that helps users make informed investment decisions through personalized insights, real-time market analysis, and automated stock reports.

## Features

### 📊 Personalized Trade Insights Dashboard
- Real-time market analysis
- Trend detection
- Stock suggestions based on user behavior
- Interactive charts and visualizations

### 🤖 AI-Powered Trading Chatbot
- Natural language processing for trading queries
- Real-time market insights
- Personalized recommendations
- Technical analysis explanations

### 📈 Automated Stock Report Generator
- Daily and on-demand reports
- Key metrics tracking (price, volume, RSI, MACD)
- Visual trend analysis
- Human-readable summaries

## Tech Stack

- **Frontend**: React Native/Expo
- **AI Integration**: Google Gemini API
- **Data Visualization**: React Native Chart Kit, Victory Native
- **State Management**: React Query
- **UI Components**: React Native Paper

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trade-yogi.git
cd trade-yogi
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
trade-yogi/
├── app/                    # Main application screens
│   ├── _layout.tsx        # Root layout configuration
│   ├── index.tsx          # Main dashboard
│   ├── chat.tsx           # AI Chatbot screen
│   └── reports.tsx        # Stock Reports screen
├── components/            # Reusable components
│   ├── AIChatbot.tsx     # AI Chatbot component
│   └── StockReportGenerator.tsx  # Report generator component
├── constants/            # App constants and configurations
├── hooks/               # Custom React hooks
└── assets/             # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [Google Gemini](https://ai.google.dev/)
- [React Native](https://reactnative.dev/)
- [React Query](https://tanstack.com/query/latest)
