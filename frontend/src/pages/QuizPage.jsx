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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

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
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="spinner"></div>
      </div>
    );
  }

  if (result) {
    const isPassed = result.score >= (quiz?.passingScore || 60);

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="bg-brand-surface border border-white/[0.08] rounded-2xl p-8 max-w-md w-full text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isPassed ? 'bg-success/[0.15]' : 'bg-red-500/[0.15]'
          }`}>
            <Award className={`w-8 h-8 ${isPassed ? 'text-success' : 'text-red-400'}`} />
          </div>

          <h2 className={`text-3xl font-bold font-syne mb-2 ${isPassed ? 'text-success' : 'text-red-400'}`}>
            {isPassed ? 'Passed!' : 'Not Passed'}
          </h2>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 my-6">
            <p className="text-text-muted mb-2">Your Score</p>
            <p className="text-4xl font-bold text-white font-syne">{result.score}%</p>
            <p className="text-sm text-text-muted mt-2">
              Passing Score: {quiz?.passingScore || 60}%
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Correct Answers:</span>
              <span className="font-bold text-success">{result.correctAnswers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total Questions:</span>
              <span className="font-bold text-white">{result.totalQuestions}</span>
            </div>
          </div>

          <div className="space-y-3">
            {isPassed && (
              <>
                <p className="text-success font-medium">Course completed successfully!</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-accent hover:bg-accent-hover text-brand-bg font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Back to Dashboard
                </button>
              </>
            )}
            {!isPassed && (
              <>
                <p className="text-text-muted">Please review the course material and try again.</p>
                <button
                  onClick={() => {
                    setResult(null);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                  }}
                  className="w-full bg-accent hover:bg-accent-hover text-brand-bg font-semibold py-3 rounded-xl transition-colors text-sm"
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
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-surface border-b border-white/[0.08] py-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-syne">{quiz?.title}</h1>
            <p className="text-sm text-text-muted mt-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          {timeLeft !== null && (
            <div className={`text-lg font-bold font-syne ${timeLeft <= 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-muted">Progress</span>
            <span className="text-sm font-medium text-accent font-syne">
              {Math.round((currentQuestionIndex / questions.length) * 100)}%
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill transition-all duration-300"
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
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-white/[0.04] text-text-muted cursor-not-allowed'
                    : 'bg-white/[0.06] text-white hover:bg-white/[0.1]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-bg font-semibold px-6 py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-bg font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
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
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                    idx === currentQuestionIndex
                      ? 'bg-accent text-brand-bg'
                      : selectedAnswers[q.id]
                        ? 'bg-success/[0.15] text-success hover:bg-success/[0.25]'
                        : 'bg-white/[0.04] text-text-muted hover:bg-white/[0.08]'
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
