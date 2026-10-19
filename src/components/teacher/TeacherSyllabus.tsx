import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  CheckCircle2,
  Clock,
  Layers,
  FilePlus,
  Video,
  FileText,
  Save,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { SyllabusChapter, SyllabusTopic } from '../../types';

export const TeacherSyllabus: React.FC = () => {
  const {
    subjects,
    chapters,
    addSyllabusChapter,
    addSyllabusTopic,
    updateTopicOfficialStatus,
  } = useCampus();

  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-math-10');
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState<string | null>(null); // holds chapterId

  // New chapter form state
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');

  // New topic form state
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicObjectives, setTopicObjectives] = useState('Solve sample board problems\nUnderstand core definition and proof');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [plannedDate, setPlannedDate] = useState('2026-11-01');
  const [videoUrl, setVideoUrl] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const subjectChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;
    addSyllabusChapter(selectedSubjectId, chapterTitle.trim(), chapterDesc.trim());
    setChapterTitle('');
    setChapterDesc('');
    setShowAddChapterModal(false);
    setFeedback('New syllabus chapter created successfully.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddTopicModal || !topicTitle.trim()) return;

    const objectivesList = topicObjectives
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addSyllabusTopic(showAddTopicModal, {
      chapterId: showAddTopicModal,
      subjectId: selectedSubjectId,
      title: topicTitle.trim(),
      description: topicDesc.trim(),
      learningObjectives: objectivesList.length > 0 ? objectivesList : ['Master key concept'],
      teacherNotes: teacherNotes.trim() || 'Reviewed in regular class period.',
      resources: videoUrl
        ? [
            {
              id: `res-${Date.now()}`,
              title: `${topicTitle} Classroom Lecture Recording`,
              type: 'video',
              url: videoUrl,
              size: 'Stream Online',
            },
          ]
        : [],
      practiceQuestions: [
        {
          question: `Review core theorem in ${topicTitle} and write down the general formula.`,
          answerSummary: 'Refer to classroom notebook notes for complete derivation.',
        },
      ],
      officialStatus: 'in_progress',
      plannedDate,
      orderIndex: 4,
    });

    setTopicTitle('');
    setTopicDesc('');
    setTeacherNotes('');
    setVideoUrl('');
    setShowAddTopicModal(null);
    setFeedback('New topic added and published to student and parent portals.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Syllabus & Topic Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Plan curriculum units, publish learning resources, and update official teaching milestones
            </p>
          </div>

          <button
            onClick={() => setShowAddChapterModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Chapter</span>
          </button>
        </div>

        {/* Subject selection */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 shrink-0">Subject:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) — Grade {s.grade}-{s.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Chapters & Topics Editor */}
      <div className="space-y-3">
        {subjectChapters.map((chap) => (
          <div
            key={chap.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
          >
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chapter {chap.chapterNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{chap.title}</h3>
                <p className="text-xs text-slate-500">{chap.description}</p>
              </div>

              <button
                onClick={() => setShowAddTopicModal(chap.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            </div>

            {/* Topic Rows */}
            <div className="divide-y divide-slate-100 p-2">
              {chap.topics.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{t.orderIndex}. {t.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({t.resources.length} resources)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.description}</p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Planned: {t.plannedDate || 'Ongoing'} · Last updated: {t.lastUpdated}
                    </div>
                  </div>

                  {/* Official Progress Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] text-slate-500 font-medium">Official Status:</span>
                    <select
                      value={t.officialStatus}
                      onChange={(e) => updateTopicOfficialStatus(t.id, e.target.value as any)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors ${
                        t.officialStatus === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : t.officialStatus === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed / Taught</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Syllabus Chapter</h3>
              <button onClick={() => setShowAddChapterModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChapter} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Chapter Title</label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Chapter 5: Arithmetic Progressions"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description / Chapter Scope</label>
                <textarea
                  rows={3}
                  value={chapterDesc}
                  onChange={(e) => setChapterDesc(e.target.value)}
                  placeholder="e.g. Introduction to nth term of an AP, sum of first n terms, and real-life mathematical modeling."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Topic & Learning Objectives</h3>
              <button onClick={() => setShowAddTopicModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Topic Title</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="e.g. nth Term Formula Derivation: an = a + (n-1)d"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Explanation</label>
                <textarea
                  rows={2}
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="Detailed breakdown of concepts taught during period..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Learning Objectives (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={topicObjectives}
                  onChange={(e) => setTopicObjectives(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Educator Notes & Tips</label>
                <input
                  type="text"
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Important exam tips or focus formulas..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Planned Teaching Date</label>
                  <input
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Video Resource URL (Optional)</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
