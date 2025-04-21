'use client';

import {useState} from 'react';
import {cn} from '@/lib/utils';
import {categorizeUser} from '@/lib/utils/categorize-user';
import {recommendStocks} from '@/lib/utils/recommend-stocks';

const questions = [
  {
    id: 1,
    question: 'What is your primary investment goal?',
    options: [
      { text: 'Preserve capital with minimal risk', value: 1, icon: '🛡️' },
      { text: 'Generate steady income', value: 2, icon: '💰' },
      { text: 'Balance growth and safety', value: 3, icon: '⚖️' },
      { text: 'Maximize long-term growth', value: 4, icon: '📈' }
    ]
  },
  {
    id: 2,
    question: 'How long do you plan to invest?',
    options: [
      { text: 'Less than 1 year', value: 1, icon: '⏱️' },
      { text: '1-3 years', value: 2, icon: '📅' },
      { text: '3-5 years', value: 3, icon: '📆' },
      { text: 'More than 5 years', value: 4, icon: '🗓️' }
    ]
  },
  {
    id: 3,
    question: 'How would you react to a 20% drop in your investment?',
    options: [
      { text: 'Sell immediately to prevent further losses', value: 1, icon: '😰' },
      { text: 'Sell some investments', value: 2, icon: '😟' },
      { text: 'Wait and see', value: 3, icon: '🤔' },
      { text: 'Buy more at lower prices', value: 4, icon: '😎' }
    ]
  },
  {
    id: 4,
    question: 'What is your investment experience level?',
    options: [
      { text: 'None', value: 1, icon: '🌱' },
      { text: 'Some knowledge', value: 2, icon: '📚' },
      { text: 'Good understanding', value: 3, icon: '🎓' },
      { text: 'Expert', value: 4, icon: '🏆' }
    ]
  },
  {
    id: 5,
    question: 'What percentage of your savings can you invest?',
    options: [
      { text: 'Less than 10%', value: 1, icon: '💵' },
      { text: '10-25%', value: 2, icon: '💶' },
      { text: '25-50%', value: 3, icon: '💷' },
      { text: 'More than 50%', value: 4, icon: '💸' }
    ]
  },
  {
    id: 6,
    question: 'How stable is your current income?',
    options: [
      { text: 'Very unstable', value: 1, icon: '📉' },
      { text: 'Somewhat stable', value: 2, icon: '↔️' },
      { text: 'Stable', value: 3, icon: '📊' },
      { text: 'Very stable', value: 4, icon: '📈' }
    ]
  },
  {
    id: 7,
    question: 'What is your risk tolerance?',
    options: [
      { text: 'Very low', value: 1, icon: '🐢' },
      { text: 'Low', value: 2, icon: '🦔' },
      { text: 'Medium', value: 3, icon: '🦊' },
      { text: 'High', value: 4, icon: '🐯' }
    ]
  },
  {
    id: 8,
    question: 'How often do you plan to monitor your investments?',
    options: [
      { text: 'Daily', value: 4, icon: '⏰' },
      { text: 'Weekly', value: 3, icon: '📅' },
      { text: 'Monthly', value: 2, icon: '📆' },
      { text: 'Yearly', value: 1, icon: '🗓️' }
    ]
  },
  {
    id: 9,
    question: 'What is your preferred investment style?',
    options: [
      { text: 'Very conservative', value: 1, icon: '🏰' },
      { text: 'Somewhat conservative', value: 2, icon: '🏠' },
      { text: 'Somewhat aggressive', value: 3, icon: '🚀' },
      { text: 'Very aggressive', value: 4, icon: '🎯' }
    ]
  },
  {
    id: 10,
    question: 'How do you prefer to diversify your investments?',
    options: [
      { text: 'Mainly low-risk assets', value: 1, icon: '🏦' },
      { text: 'Mix of low and medium risk', value: 2, icon: '🔄' },
      { text: 'Mix of medium and high risk', value: 3, icon: '📊' },
      { text: 'Mainly high-risk assets', value: 4, icon: '📈' }
    ]
  }
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showStart, setShowStart] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<{ticker: string; status: string}[] | null>(null);

  const handleStart = () => {
    setShowStart(false);
  };

  const handleAnswer = async (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      const category = categorizeUser(newAnswers);
      setCategory(category);
      const recs = await recommendStocks(category);
      setRecommendations(recs);
    }
  };

  const getProgressWidth = () => {
    return `${((currentQuestion + 1) / questions.length) * 100}%`;
  };

  const handleOptionClick = (value: number) => {
    setTimeout(() => {
      handleAnswer(value);
    }, 150);
  };

  if (showStart) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 fade-in">
        <div className="text-center mb-10">
          <h1 className="page-title">What type of investor are you?</h1>
          <p className="page-subtitle">
            Answer 10 questions to discover your investment profile
          </p>
        </div>
        <button
          onClick={handleStart}
          className="list-item w-full p-6 text-left group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                Start Investment Profile Quiz
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Takes about 2 minutes to complete
              </div>
            </div>
          </div>
        </button>
        <p className="text-xs text-center text-muted-foreground/80 mt-10">
          It's AI based prediction, not final. Invest at your own risk.
        </p>
      </div>
    );
  }

  if (category && recommendations) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 slide-up">
        <div className="text-center mb-8">
          <h1 className="page-title">Your Investment Profile</h1>
          <p className="page-subtitle">Based on your answers</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="inline-block text-4xl mb-4">
              {category === 'Conservative' ? '🛡️' :
               category === 'Moderate' ? '⚖️' :
               category === 'Aggressive' ? '🚀' : '🎯'}
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">{category}</h2>
            <p className="text-muted-foreground">
              {category === 'Conservative' ? 'You prefer stable, low-risk investments' :
               category === 'Moderate' ? 'You balance risk and potential returns' :
               category === 'Aggressive' ? 'You seek high returns and can tolerate risk' :
               'You have a unique investment approach'}
            </p>
          </div>
          
          <div className="border-t border-border/50 pt-6">
            <h3 className="font-medium mb-4 text-center">Recommended Companies</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 
                  transition-all duration-300 group relative overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">
                          {rec.ticker.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary 
                        transition-colors">
                          {rec.ticker}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category === 'Conservative' ? 'Low volatility' :
                           category === 'Moderate' ? 'Balanced risk' :
                           'Growth potential'}
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <button
            onClick={() => {
              setShowStart(true);
              setCurrentQuestion(0);
              setAnswers([]);
              setCategory(null);
              setRecommendations(null);
            }}
            className="w-full p-4 bg-white/50 rounded-xl text-center text-primary 
            hover:bg-white/80 hover:text-primary/80 transition-all duration-300"
          >
            Start Over
          </button>
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground/80 px-8">
              It's an AI based financial advice.
            </p>
            <p className="text-[10px] text-muted-foreground/60 px-8">
              Past performance does not guarantee future results.
              Please consult with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-12 fade-in">
      <div className="mb-8">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: getProgressWidth() }}
          />
        </div>
        <div className="mt-2 text-sm text-muted-foreground text-center">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {questions[currentQuestion].question}
        </h2>
      </div>
      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option.value)}
            className="list-item w-full p-5 text-left"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl select-none">{option.icon}</span>
              <div className="font-medium text-foreground">
                {option.text}
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground/80 mt-8">
        It's an AI based financial advice.
      </p>
    </div>
  );
}
