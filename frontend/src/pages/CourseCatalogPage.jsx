import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import * as courseApi from '../api/courseApi';
import CourseCard from '../components/CourseCard';
import { useToast } from '../components/Toast';
import { BRAND } from '../data/constants';

const CATEGORY_EMOJIS = {
  'AI & Productivity': '🤖',
  'Research': '🔬',
  'Knowledge Management': '🧠',
  'Building': '⚙️',
  'Career': '🚀',
};

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
      {/* Hero Bar */}
      <div className="bg-brand-surface border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-2 font-syne">
                {BRAND.shortName} · Learning Hub
              </p>
              <h1 className="text-3xl font-extrabold text-white font-syne mb-1">
                Explore Programs
              </h1>
              <p className="text-sm text-text-muted">{BRAND.tagline}</p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                </div>
                <span><span className="font-bold text-white font-syne">5</span> Programs</span>
              </div>
              <div className="w-px h-6 bg-white/[0.08]" />
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-success" />
                </div>
                <span><span className="font-bold text-white font-syne">487</span> Learners</span>
              </div>
              <div className="w-px h-6 bg-white/[0.08]" />
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-7 h-7 rounded-lg bg-blue-400/10 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span><span className="font-bold text-white font-syne">20+</span> Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Category pill tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold font-syne transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-accent text-brand-bg shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                  : 'bg-white/[0.05] text-text-secondary border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold font-syne flex items-center gap-1.5 transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-accent text-brand-bg shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                    : 'bg-white/[0.05] text-text-secondary border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span>{CATEGORY_EMOJIS[category]}</span>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="spinner" />
          </div>
        ) : courses.length > 0 ? (
          <>
            {/* Result count */}
            <p className="text-[12px] text-text-muted mb-5">
              Showing <span className="text-white font-semibold">{courses.length}</span> program{courses.length !== 1 ? 's' : ''}
              {selectedCategory && <span> in <span className="text-accent">{selectedCategory}</span></span>}
            </p>

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
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === 1
                      ? 'bg-white/[0.03] text-text-muted cursor-not-allowed'
                      : 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
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
                        className={`w-9 h-9 rounded-lg font-semibold text-sm font-syne transition-all duration-200 ${
                          pageNum === currentPage
                            ? 'bg-accent text-brand-bg shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                            : 'bg-white/[0.04] text-text-secondary border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
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
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === totalPages
                      ? 'bg-white/[0.03] text-text-muted cursor-not-allowed'
                      : 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-5 select-none">
              {selectedCategory ? CATEGORY_EMOJIS[selectedCategory] || '🔍' : '🔍'}
            </div>
            <h3 className="font-syne font-bold text-white text-lg mb-2">No programs found</h3>
            <p className="text-text-muted text-sm max-w-xs">
              {searchTerm
                ? `No results for "${searchTerm}". Try different keywords or clear the search.`
                : 'No programs available in this category yet.'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); setCurrentPage(1); }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-semibold font-syne hover:bg-accent/20 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogPage;
