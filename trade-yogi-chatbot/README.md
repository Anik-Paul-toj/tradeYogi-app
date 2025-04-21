# AI Chat Assistant

A modern chat interface built with Next.js 15 and deployed on Vercel. The application uses Genkit AI for natural language processing and provides a responsive, real-time chat experience.

## Live Demo

Visit the live application at: [Your Vercel URL]

## Features

- 🤖 AI-powered chat responses
- 💨 Fast and responsive UI with Next.js 15 and Turbopack
- 🎨 Modern design with Tailwind CSS
- 🔄 Real-time chat interactions
- 📱 Fully responsive layout
- ⌨️ Support for keyboard shortcuts
- 🎯 Error handling and loading states

## Tech Stack

- **Framework**: Next.js 15.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **AI Integration**: Genkit AI
- **Deployment**: Vercel
- **State Management**: React Hooks

## Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
GENKIT_API_KEY=your_api_key_here
```

## Deployment

This project is deployed on Vercel. The deployment process is automated through Vercel's GitHub integration.

To deploy your own version:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add your environment variables in the Vercel project settings
5. Deploy!

## Project Structure

```
chat/
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   └── chat-flow.ts    # AI chat implementation
│   │   └── ai-instance.ts      # AI configuration
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   └── app/
│       └── page.tsx            # Main chat interface
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues or have questions, please file an issue in the GitHub repository. 