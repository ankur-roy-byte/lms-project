import React from 'react';

const QuizBox = ({ question, selectedAnswer, onSelectAnswer }) => {
  if (!question) {
    return <div className="text-text-muted">Loading question...</div>;
  }

  const options = [
    { id: 'A', text: question.optionA },
    { id: 'B', text: question.optionB },
    { id: 'C', text: question.optionC },
    { id: 'D', text: question.optionD },
  ].filter((opt) => opt.text);

  return (
    <div className="bg-brand-surface border border-white/[0.08] rounded-xl p-8">
      {/* Question Counter */}
      <div className="text-sm font-medium text-accent mb-4 font-syne">
        Question {question.questionNumber || 1}
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04] ${
              selectedAnswer === option.id
                ? 'border-accent bg-accent/[0.08]'
                : 'border-white/[0.08] bg-transparent'
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onSelectAnswer(option.id)}
              className="w-4 h-4 text-accent cursor-pointer accent-amber-500"
            />
            <span className="ml-4 font-medium text-text-primary text-base">
              {option.id}. {option.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizBox;
