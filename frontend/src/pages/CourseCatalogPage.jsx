import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import * as courseApi from '../api/courseApi';
import CourseCard from '../components/CourseCard';
import { useToast } from '../components/Toast';
import { BRAND } from '../data/constants';

const CourseCatalogPage = () => {
  const { error } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['AI & Productivity', 'Research', 'Knowledge Management', 'Building', 'Career'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseApi.getCourses(
          currentPage,
          searchTerm,
          selectedCategory
        );
        setCourses(response.courses || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, currentPage]);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-surface border-b border-white/[0.08] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white font-syne mb-2">Explore Programs</h1>
          <p className="text-text-muted">{BRAND.tagline}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-text-muted" />
            <h3 className="font-semibold text-white text-sm">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSelectedCategory('');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === ''
                  ? 'bg-accent text-brand-bg'
                  : 'bg-white/[0.04] text-text-secondary border border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent text-brand-bg'
                    : 'bg-white/[0.04] text-text-secondary border border-white/[0.08] hover:bg-white/[0.08]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="spinner"></div>
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    currentPage === 1
                      ? 'bg-white/[0.04] text-text-muted cursor-not-allowed'
                      : 'bg-accent text-brand-bg hover:bg-accent-hover'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm ${
                          pageNum === currentPage
                            ? 'bg-accent text-brand-bg'
                            : 'bg-white/[0.04] text-text-secondary hover:bg-white/[0.08]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    currentPage === totalPages
                      ? 'bg-white/[0.04] text-text-muted cursor-not-allowed'
                      : 'bg-accent text-brand-bg hover:bg-accent-hover'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">No courses found</p>
            <p className="text-text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogPage;
