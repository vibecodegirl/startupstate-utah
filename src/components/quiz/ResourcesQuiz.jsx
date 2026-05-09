import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quizSteps = [
  {
    question: "What stage is your business?",
    options: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'],
    key: 'stage',
  },
  {
    question: "What sector are you in?",
    options: ['AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Other'],
    key: 'sector',
  },
  {
    question: "What's your main challenge right now?",
    options: ['Finding capital', 'Building a team', 'Mentorship & guidance', 'Networking & partnerships', 'Legal & compliance'],
    key: 'challenge',
  },
];

export default function ResourcesQuiz({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [quizSteps[step].key]: value }));
  };

  const handleNext = () => {
    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentQuestion = quizSteps[step];
  const isAnswered = answers[currentQuestion.key];

  return (
    <div className="bg-white rounded-2xl border border-border p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs font-semibold text-primary">PERSONALIZE YOUR SEARCH</div>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / quizSteps.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{step + 1} of {quizSteps.length}</span>
        </div>
      </div>

      <h2 className="font-manrope font-bold text-2xl text-foreground mb-6">{currentQuestion.question}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {currentQuestion.options.map(option => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
              answers[currentQuestion.key] === option
                ? 'border-primary bg-green-pale text-primary'
                : 'border-border bg-white text-foreground hover:border-primary/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Skip quiz
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-2">
            <ChevronLeft size={16} /> Back
          </Button>
          <Button onClick={handleNext} disabled={!isAnswered} className="gap-2 bg-primary hover:bg-green-dark text-white">
            {step === quizSteps.length - 1 ? (
              <>
                <CheckCircle size={16} /> Done
              </>
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}