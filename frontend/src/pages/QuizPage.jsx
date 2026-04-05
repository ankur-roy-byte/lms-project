import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, Award } from 'lucide-react';
import * as quizApi from '../api/quizApi';
import QuizBox from '../components/QuizBox';
import { useToast } from '../components/Toast';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await quizApi.getQuizDetails(quizId);
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
        if (quizData.timeLimit) {
          setTimeLeft(quizData.timeLimit * 60);
        }
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
        error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, error]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      // Prepare answers for submission
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] || null,
      }));

      const response = await quizApi.submitQuiz(quizId, formattedAnswers);
      setResult(response);
      success('Quiz submitted successfully!');
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (result) {
    const isPassed = result.score >= (quiz?.passingScore || 60);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isPassed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Award className={`w-8 h-8 ${isPassed ? 'text-green-600' : 'text-red-600'}`} />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {isPassed ? 'Passed!' : 'Not Passed'}
          </h2>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <p className="text-gray-600 mb-2">Your Score</p>
            <p className="text-4xl font-bold text-gray-900">{result.score}%</p>
            <p className="text-sm text-gray-600 mt-2">
              Passing Score: {quiz?.passingScore || 60}%
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Correct Answers:</span>
              <span className="font-bold text-green-600">{result.correctAnswers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-bold text-gray-900">{result.totalQuestions}</span>
            </div>
          </div>

          <div className="space-y-3">
            {isPassed && (
              <>
                <p className="text-green-600 font-medium">Course completed successfully!</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full btn-primary"
                >
                  Back to Dashboard
                </button>
              </>
            )}
            {!isPassed && (
              <>
                <p className="text-gray-600">Please review the course material and try again.</p>
                <button
                  onClick={() => {
                    setResult(null);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                  }}
                  className="w-full btn-primary"
                >
                  Retake Quiz
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          {timeLeft !== null && (
            <div className={`text-lg font-bold ${timeLeft <= 300 ? 'text-red-600' : 'text-gray-900'}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((currentQuestionIndex / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <>
            <QuizBox
              question={currentQuestion}
              selectedAnswer={selectedAnswers[currentQuestion.id]}
              onSelectAnswer={handleSelectAnswer}
            />

            {/* Navigation & Submit */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="flex items-center gap-2 btn-primary disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 btn-primary"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Question Indicator */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    idx === currentQuestionIndex
                      ? 'bg-primary-600 text-white'
                      : selectedAnswers[q.id]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
