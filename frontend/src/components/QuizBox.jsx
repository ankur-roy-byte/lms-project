import React from 'react';

const QuizBox = ({ question, selectedAnswer, onSelectAnswer }) => {
  if (!question) {
    return <div className="text-gray-500">Loading question...</div>;
  }

  const options = [
    { id: 'A', text: question.optionA },
    { id: 'B', text: question.optionB },
    { id: 'C', text: question.optionC },
    { id: 'D', text: question.optionD },
  ].filter((opt) => opt.text);

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Question Counter */}
      <div className="text-sm font-medium text-primary-600 mb-4">
        Question {question.questionNumber || 1}
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
            style={{
              borderColor:
                selectedAnswer === option.id ? '#4f46e5' : '#e5e7eb',
              backgroundColor:
                selectedAnswer === option.id ? '#f5f3ff' : 'transparent',
            }}
          >
            <input
              type="radio"
              name="answer"
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onSelectAnswer(option.id)}
              className="w-4 h-4 text-primary-600 cursor-pointer"
            />
            <span className="ml-4 font-medium text-gray-900 text-base">
              {option.id}. {option.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizBox;
