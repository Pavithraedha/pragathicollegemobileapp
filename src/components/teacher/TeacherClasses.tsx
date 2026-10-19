import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Building,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { StudentProfile } from '../../types';

export const TeacherClasses: React.FC = () => {
  const {
    students,
    leaveRequests,
    reviewLeaveRequest,
    addAnnouncement,
    announcements,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'students' | 'leaves' | 'announcements'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // New announcement state
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [feedback, setFeedback] = useState<string | null>(null);

  const classStudents = students.filter((s) => s.grade === '10' && s.section === 'A');

  const filteredStudents = classStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.fullName.toLowerCase().includes(q) || s.rollNo.includes(q) || s.parentName.toLowerCase().includes(q);
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;

    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      targetRoles: ['parent', 'student'],
      priority: annPriority,
      author: 'Mr. Rajesh Verma (Class Teacher 10-A)',
      category: 'academic',
    });

    setAnnTitle('');
    setAnnContent('');
    setShowAnnounceModal(false);
    setFeedback('Class announcement broadcasted to all parents and students.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header and Sub-tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Class 10-A Roster & Communication Hub</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage enrolled students, approve parent leave requests, and post announcements
            </p>
          </div>

          <button
            onClick={() => setShowAnnounceModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Student Roster ({classStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors relative ${
              activeTab === 'leaves' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Parent Leave Requests ({leaveRequests.length})
            {leaveRequests.some((l) => l.status === 'pending') && (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'announcements' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Notices & Updates
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tab 1: Student Roster */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or parent..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Class Teacher: Mr. Rajesh Verma
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {st.rollNo}
                  </span>
                  <img
                    src={st.avatar}
                    alt={st.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{st.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Adm #{st.admissionNo} · Parent: {st.parentName} ({st.parentPhone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  {st.hostelAllocated ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700">
                      Hostel Boarder
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Day Scholar
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Parent Leave Requests */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Parent Leave Applications For Class 10-A
            </h3>
          </div>

          <div className="divide-y divide-slate-100 p-2">
            {leaveRequests.map((lr) => (
              <div
                key={lr.id}
                className="p-3 rounded-xl hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{lr.studentName}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Dates: {lr.startDate} to {lr.endDate}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        lr.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lr.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lr.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{lr.reason}"
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Applied on: {lr.appliedAt.split('T')[0]}
                  </div>
                </div>

                {/* Review action buttons */}
                {lr.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => reviewLeaveRequest(lr.id, 'approved')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => reviewLeaveRequest(lr.id, 'rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Announcements */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Class 10-A Broadcasted Notices
            </h3>
          </div>

          <div className="space-y-2">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ann.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                <div className="text-[10px] text-slate-400 pt-0.5">Author: {ann.author}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Broadcast Class Notice</h3>
              <button onClick={() => setShowAnnounceModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notice Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Science Olympiad Preparatory Session"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Type official message to be shared with Class 10-A students and parents..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="important">Important Priority</option>
                  <option value="urgent">Urgent Alert</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
