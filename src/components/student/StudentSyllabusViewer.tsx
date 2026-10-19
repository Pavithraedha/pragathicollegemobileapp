import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  Clock,
  Circle,
  FileText,
  Video,
  Download,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Subject, SyllabusChapter, SyllabusTopic } from '../../types';

interface StudentSyllabusViewerProps {
  initialSubjectId?: string;
  onBackToSubjects?: () => void;
}

export const StudentSyllabusViewer: React.FC<StudentSyllabusViewerProps> = ({
  initialSubjectId,
  onBackToSubjects,
}) => {
  const {
    subjects,
    chapters,
    currentUser,
    updateTopicStudentStatus,
  } = useCampus();

  const studentId = currentUser.studentId || 'student-1';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || 'sub-math-10'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Record<string, boolean>>({
    'chap-math-1': true,
    'chap-math-2': true,
    'chap-math-3': true,
  });
  const [activeTopicModal, setActiveTopicModal] = useState<SyllabusTopic | null>(null);
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState<Record<string, boolean>>({});
  const [showAnswerIdx, setShowAnswerIdx] = useState<number | null>(null);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);

  // Toggle chapter accordion
  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Toggle bookmark
  const toggleBookmark = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedTopicIds((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Filter topics
  const filteredChapters = subjectChapters.map((chap) => {
    const matchingTopics = chap.topics.filter((topic) => {
      const studentStatus = topic.studentStatus?.[studentId] || 'not_started';
      const isCompleted = studentStatus === 'completed' || topic.officialStatus === 'completed';

      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'pending' && isCompleted) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = topic.title.toLowerCase().includes(q);
        const inDesc = topic.description.toLowerCase().includes(q);
        const inNotes = topic.teacherNotes.toLowerCase().includes(q);
        return inTitle || inDesc || inNotes;
      }
      return true;
    });

    return {
      ...chap,
      topics: matchingTopics,
    };
  });

  // Calculate subject progress metrics
  let totalTopicCount = 0;
  let teacherCompletedCount = 0;
  let studentCompletedCount = 0;

  subjectChapters.forEach((ch) => {
    ch.topics.forEach((t) => {
      totalTopicCount++;
      if (t.officialStatus === 'completed') teacherCompletedCount++;
      if (t.studentStatus?.[studentId] === 'completed') studentCompletedCount++;
    });
  });

  const teacherProgress = totalTopicCount > 0 ? Math.round((teacherCompletedCount / totalTopicCount) * 100) : 0;
  const studentProgress = totalTopicCount > 0 ? Math.round((studentCompletedCount / totalTopicCount) * 100) : 0;

  // Next and previous topic navigation inside modal
  const allTopicsFlat = subjectChapters.flatMap((c) => c.topics);
  const currentModalIndex = activeTopicModal ? allTopicsFlat.findIndex((t) => t.id === activeTopicModal.id) : -1;
  const prevTopic = currentModalIndex > 0 ? allTopicsFlat[currentModalIndex - 1] : null;
  const nextTopic = currentModalIndex >= 0 && currentModalIndex < allTopicsFlat.length - 1 ? allTopicsFlat[currentModalIndex + 1] : null;

  return (
    <div className="space-y-4 pb-24">
      {/* Subject Header & Hierarchy breadcrumb */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {onBackToSubjects && (
          <button
            onClick={onBackToSubjects}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Subjects</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Academic Year 2026-27</span>
              <span>›</span>
              <span>Grade {currentSubject.grade}-{currentSubject.section}</span>
              <span>›</span>
              <span className="font-semibold text-slate-700">{currentSubject.code}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              {currentSubject.name} — Detailed Curriculum & Syllabus
            </h2>
            <p className="text-xs text-slate-500">
              Assigned Faculty: <strong className="text-slate-800">{currentSubject.teacherName}</strong>
            </p>
          </div>

          {/* Subject Switcher Dropdown */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Dual Progress Bars: Official Teacher Progress vs Student Personal Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-blue-900">Official Classroom Teaching Coverage</span>
              <span className="font-bold text-blue-700 tabular-nums">{teacherProgress}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${teacherProgress}%` }} />
            </div>
            <div className="text-[10px] text-blue-700">
              Verified by {currentSubject.teacherName} ({teacherCompletedCount} of {totalTopicCount} topics taught)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-900">Your Self-Study & Revision Progress</span>
              <span className="font-bold text-emerald-700 tabular-nums">{studentProgress}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${studentProgress}%` }} />
            </div>
            <div className="text-[10px] text-emerald-700">
              Self-reported topic completions ({studentCompletedCount} of {totalTopicCount} studied)
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative w-full sm:grow">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters, topics, notes or concepts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs w-full sm:w-auto shrink-0 justify-center">
            {(['all', 'completed', 'pending'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors capitalize ${
                  statusFilter === filter
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters Accordion List */}
      <div className="space-y-3">
        {filteredChapters.map((chap) => {
          const isExpanded = !!expandedChapterIds[chap.id];
          const chapCompleted = chap.topics.filter(
            (t) => t.officialStatus === 'completed' || t.studentStatus?.[studentId] === 'completed'
          ).length;

          return (
            <div
              key={chap.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Chapter Header */}
              <button
                type="button"
                onClick={() => toggleChapter(chap.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {chap.chapterNumber}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Unit {chap.unitNumber} · Chapter {chap.chapterNumber}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{chap.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{chap.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500 tabular-nums hidden xs:inline">
                    {chapCompleted} / {chap.topics.length} Done
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Topics List when expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/30">
                  {chap.topics.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No topics matched your search criteria.
                    </div>
                  ) : (
                    chap.topics.map((topic, idx) => {
                      const studentStatus = topic.studentStatus?.[studentId] || 'not_started';
                      const isBookmarked = !!bookmarkedTopicIds[topic.id];

                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            setActiveTopicModal(topic);
                            setShowAnswerIdx(null);
                          }}
                          className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-blue-50/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-3 grow min-w-0">
                            {/* Student self-study status checkbox button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus =
                                  studentStatus === 'completed'
                                    ? 'not_started'
                                    : studentStatus === 'in_progress'
                                    ? 'completed'
                                    : 'in_progress';
                                updateTopicStudentStatus(topic.id, studentId, nextStatus);
                              }}
                              title="Click to update your personal study progress"
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                            >
                              {studentStatus === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                              ) : studentStatus === 'in_progress' ? (
                                <Clock className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {topic.orderIndex}. {topic.title}
                                </span>
                                {/* Official Teacher Badge */}
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                    topic.officialStatus === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : topic.officialStatus === 'in_progress'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  Class: {topic.officialStatus.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {topic.description}
                              </p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                                <span>{topic.learningObjectives.length} Learning Goals</span>
                                <span>·</span>
                                <span>{topic.resources.length} Permitted Materials</span>
                                <span>·</span>
                                <span>Updated: {topic.lastUpdated}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => toggleBookmark(topic.id, e)}
                              className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TOPIC DETAIL MODAL / DRAWER (Complete study view with objectives, teacher notes, resources, practice Qs) */}
      {activeTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 bg-[#163B70] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-300" />
                <div>
                  <div className="text-[10px] text-blue-200 uppercase font-mono">
                    Topic {activeTopicModal.orderIndex} · {currentSubject.name}
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-white truncate max-w-md">
                    {activeTopicModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveTopicModal(null)}
                className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 grow">
              {/* Status and Actions Strip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500">Official Class Status:</div>
                  <div className="text-xs font-bold text-slate-900 capitalize">
                    {activeTopicModal.officialStatus.replace('_', ' ')} (Teacher Verified)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Your Study State:</span>
                  <select
                    value={activeTopicModal.studentStatus?.[studentId] || 'not_started'}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      updateTopicStudentStatus(activeTopicModal.id, studentId, newStatus);
                      setActiveTopicModal({
                        ...activeTopicModal,
                        studentStatus: {
                          ...(activeTopicModal.studentStatus || {}),
                          [studentId]: newStatus,
                        },
                      });
                    }}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed / Studied</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  Topic Overview & Scope
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                  {activeTopicModal.description}
                </p>
              </div>

              {/* Learning Objectives */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Key Learning Objectives</span>
                </h4>
                <div className="space-y-1.5">
                  {activeTopicModal.learningObjectives.map((obj, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-slate-800"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  Educator Teaching Notes & Examination Tips
                </h4>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-950 leading-relaxed italic">
                  "{activeTopicModal.teacherNotes}"
                  <div className="text-[10px] text-amber-800 font-semibold not-italic mt-1.5">
                    — {currentSubject.teacherName} (Last reviewed: {activeTopicModal.lastUpdated})
                  </div>
                </div>
              </div>

              {/* Learning Materials & Downloads */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Official Permitted Learning Resources ({activeTopicModal.resources.length})
                </h4>
                {activeTopicModal.resources.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 text-center">
                    No downloadable lecture notes or attachments uploaded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeTopicModal.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {res.type === 'video' ? (
                            <Video className="w-4 h-4 text-red-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900">{res.title}</div>
                            <div className="text-[11px] text-slate-500 uppercase">
                              {res.type} · {res.size || 'Stream Online'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            alert(`Resource "${res.title}" opened in student study viewer.`);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Access</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practice Questions */}
              {activeTopicModal.practiceQuestions && activeTopicModal.practiceQuestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>Curriculum Practice & Revision Questions</span>
                  </h4>
                  <div className="space-y-2">
                    {activeTopicModal.practiceQuestions.map((pq, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
                      >
                        <div className="font-semibold text-slate-900">
                          Q{idx + 1}. {pq.question}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAnswerIdx(showAnswerIdx === idx ? null : idx)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline block"
                        >
                          {showAnswerIdx === idx ? 'Hide Solution Steps' : 'Reveal Solution / Method'}
                        </button>
                        {showAnswerIdx === idx && (
                          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed font-mono">
                            {pq.answerSummary}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Previous / Next navigation */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <button
                disabled={!prevTopic}
                onClick={() => {
                  if (prevTopic) {
                    setActiveTopicModal(prevTopic);
                    setShowAnswerIdx(null);
                  }
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  prevTopic
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    : 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Topic</span>
              </button>

              <button
                disabled={!nextTopic}
                onClick={() => {
                  if (nextTopic) {
                    setActiveTopicModal(nextTopic);
                    setShowAnswerIdx(null);
                  }
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  nextTopic
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
                }`}
              >
                <span>Next Topic</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
