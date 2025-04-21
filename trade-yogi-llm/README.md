# Firebase Studio

# Trade Yogi LLM

A modern web application built with Next.js that provides trading insights and analysis using LLM technology.

## Features

- Real-time trading insights
- AI-powered analysis
- Modern and responsive user interface
- Secure authentication
- Real-time data processing

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Authentication**: Firebase
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account
- Environment variables set up

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trade-yogi-llm.git
cd trade-yogi-llm
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your environment variables:
```env

```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

This project is optimized for deployment on Vercel. To deploy your own instance:

1. Push your code to a GitHub repository

2. Visit [Vercel](https://vercel.com) and sign in with GitHub

3. Click on "New Project" and import your repository

4. Configure your project:
   - Framework Preset: Next.js
   - Build and Output Settings: Leave as default
   - Environment Variables: Add all your Firebase configuration variables

5. Click "Deploy"

Your application will be automatically built and deployed. Vercel will provide you with a production URL where your app is accessible.

### Automatic Deployments

Vercel automatically deploys:
- Every push to the main branch (production)
- Every pull request (preview deployment)

## Development

The project follows a feature-based directory structure:
```
trade-yogi-llm/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/             # Utility functions and libraries
├── public/          # Static assets
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
