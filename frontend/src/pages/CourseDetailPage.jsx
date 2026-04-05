import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Play, CheckCircle, Award } from 'lucide-react';
import * as courseApi from '../api/courseApi';
import * as enrollmentApi from '../api/enrollmentApi';
import * as paymentApi from '../api/paymentApi';
import * as certificateApi from '../api/certificateApi';
import VideoPlayer from '../components/VideoPlayer';
import ProgressBar from '../components/ProgressBar';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, lessonsData] = await Promise.all([
          courseApi.getCourse(id),
          courseApi.getLessons(id),
        ]);

        setCourse(courseData);
        setLessons(lessonsData || []);

        if (lessonsData && lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
        }

        // Check if user is enrolled
        if (user) {
          const enrollments = await enrollmentApi.getMyEnrollments();
          const enrolled = enrollments.some((e) => e.courseId === id);
          setIsEnrolled(enrolled);

          if (enrolled) {
            const progressData = await enrollmentApi.getCourseProgress(id);
            setProgress(progressData.progressPercentage || 0);
            setCompletedLessons(progressData.completedLessons || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user, error]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setProcessingPayment(true);

      if (course.price === 0 || !course.price) {
        // Free course - direct enrollment
        await enrollmentApi.enroll(id);
        setIsEnrolled(true);
        success('Enrolled successfully!');
      } else {
        // Paid course - initiate Razorpay
        const orderResponse = await paymentApi.createOrder(id);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
          amount: orderResponse.amount,
          currency: orderResponse.currency,
          order_id: orderResponse.orderId,
          handler: async (response) => {
            try {
              const verifyResponse = await paymentApi.verifyPayment({
                orderId: orderResponse.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                await enrollmentApi.enroll(id);
                setIsEnrolled(true);
                success('Payment successful! You are now enrolled.');
              }
            } catch (err) {
              error('Payment verification failed');
              console.error(err);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      error('Failed to enroll in course');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      const enrollment = await enrollmentApi.getMyEnrollments();
      const currentEnrollment = enrollment.find((e) => e.courseId === id);

      if (currentEnrollment) {
        await enrollmentApi.markLessonComplete(currentEnrollment.id, lessonId);
        setCompletedLessons([...completedLessons, lessonId]);
        success('Lesson marked as complete!');

        // Refresh progress
        const progressData = await enrollmentApi.getCourseProgress(id);
        setProgress(progressData.progressPercentage || 0);
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
      error('Failed to update progress');
    }
  };

  const handleGetCertificate = async () => {
    try {
      const certificate = await certificateApi.generateCertificate(id);
      success('Certificate generated! Check your certificates page.');
      navigate('/certificates');
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      error('Failed to generate certificate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Hero */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-primary-100 mb-4">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.enrollmentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-300" />
                    <span>{course.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Instructor:</span> {course.instructorName}
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6 h-fit">
                <div className="text-3xl font-bold mb-4">
                  {course.price === 0 || !course.price ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <>₹{course.price}</>
                  )}
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={processingPayment}
                  className="w-full btn-primary mb-3 disabled:opacity-50"
                >
                  {processingPayment ? 'Processing...' : 'Enroll Now'}
                </button>
                <button className="w-full btn-outline">
                  Share Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Content */}
      {isEnrolled && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
              {progress === 100 && (
                <button
                  onClick={handleGetCertificate}
                  className="flex items-center gap-2 btn-primary"
                >
                  <Award className="w-4 h-4" />
                  Get Certificate
                </button>
              )}
            </div>
            <ProgressBar percentage={progress} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentLesson && (
                <>
                  <VideoPlayer youtubeUrl={currentLesson.videoUrl} title={currentLesson.title} />

                  <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-6">{currentLesson.description}</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5" />
                        <span>{currentLesson.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedLessons.includes(currentLesson.id) ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 font-medium">Completed</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                            <span className="text-gray-600">Not completed</span>
                          </>
                        )}
                      </div>
                    </div>

                    {!completedLessons.includes(currentLesson.id) && (
                      <button
                        onClick={() => handleMarkComplete(currentLesson.id)}
                        className="btn-primary"
                      >
                        Mark as Complete
                      </button>
                    )}

                    {currentLesson.quizUrl && (
                      <div className="mt-6">
                        <button
                          onClick={() => navigate(`/quiz/${currentLesson.quizId}`)}
                          className="btn-outline flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Take Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              lessons={lessons}
              currentLessonId={currentLesson?.id}
              onSelectLesson={setCurrentLesson}
              completedLessons={completedLessons}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
