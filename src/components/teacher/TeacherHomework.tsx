import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  X,
  MessageSquare,
  Award,
  Check,
  XCircle,
  ThumbsUp,
  RotateCcw,
  User,
  Calendar
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Assignment, AssignmentSubmission } from '../../types';

export const TeacherHomework: React.FC = () => {
  const {
    currentUser,
    students,
    subjects,
    assignments,
    submissions,
    createAssignment,
    reviewSubmission,
  } = useCampus();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignments[0]?.id || 'asg-1');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('sub-math-10');
  const [dueDate, setDueDate] = useState('2026-10-28');
  const [maxMarks, setMaxMarks] = useState(15);
  const [grade, setGrade] = useState('10');
  const [section, setSection] = useState('A');

  // Review modal state (Approve vs Reject)
  const [activeReviewSubmission, setActiveReviewSubmission] = useState<AssignmentSubmission | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [awardedMarks, setAwardedMarks] = useState(14);
  const [teacherRemarks, setTeacherRemarks] = useState('');

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  const assignmentSubmissions = submissions.filter((s) => s.assignmentId === selectedAssignmentId);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subj = subjects.find((s) => s.id === subjectId);
    createAssignment({
      grade,
      section,
      subjectId,
      subjectName: subj?.name || 'Mathematics',
      title: title.trim(),
      description: description.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      maxMarks: Number(maxMarks),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      attachments: [
        { name: `${title.replace(/\s+/g, '_')}_Worksheet.pdf`, url: '#', size: '1.2 MB' },
      ],
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
    setFeedback(`Homework "${title}" published! Both student and parent dashboards have been notified.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewSubmission) return;

    reviewSubmission(
      activeReviewSubmission.id,
      reviewAction,
      reviewAction === 'approve' ? awardedMarks : undefined,
      teacherRemarks.trim() || (reviewAction === 'approve' ? 'Approved by faculty.' : 'Please revise and re-upload.')
    );

    const studentName = activeReviewSubmission.studentName;
    const actionLabel = reviewAction === 'approve' ? 'approved' : 'rejected (revision requested)';
    setActiveReviewSubmission(null);
    setTeacherRemarks('');
    setFeedback(`Submission for ${studentName} was ${actionLabel}. Instant notification dispatched to student & guardian.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const openApproveModal = (subm: AssignmentSubmission) => {
    setActiveReviewSubmission(subm);
    setReviewAction('approve');
    setAwardedMarks(subm.marksAwarded || (activeAssignment ? activeAssignment.maxMarks - 1 : 14));
    setTeacherRemarks(subm.teacherFeedback || 'Well structured solutions with correct methodology.');
  };

  const openRejectModal = (subm: AssignmentSubmission) => {
    setActiveReviewSubmission(subm);
    setReviewAction('reject');
    setTeacherRemarks(subm.teacherFeedback || 'Incomplete problem steps. Please recheck questions and resubmit.');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Homework & Assignment Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create homework for students, view uploads, and approve or reject submissions
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Homework</span>
          </button>
        </div>

        {/* Assignment selector tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
          {assignments.map((asg) => {
            const isSelected = selectedAssignmentId === asg.id;
            return (
              <button
                key={asg.id}
                onClick={() => setSelectedAssignmentId(asg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {asg.title.slice(0, 24)}...
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Assignment Card */}
      {activeAssignment && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeAssignment.title}</span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Class {activeAssignment.grade}-{activeAssignment.section}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {activeAssignment.subjectName} · Educator: {activeAssignment.teacherName} · Max Marks: {activeAssignment.maxMarks}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Due: {activeAssignment.dueDate}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
            {activeAssignment.description}
          </p>
        </div>
      )}

      {/* Submissions Queue: Approve or Reject */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Student Submissions ({assignmentSubmissions.length} Received)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Review, Approve or Reject
          </span>
        </div>

        {assignmentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No student submissions uploaded yet for this homework assignment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assignmentSubmissions.map((subm) => {
              const isApproved = subm.status === 'approved' || subm.status === 'graded';
              const isRejected = subm.status === 'rejected';
              const isPending = subm.status === 'submitted';

              return (
                <div
                  key={subm.id}
                  className="p-4 flex flex-col gap-3 text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {subm.studentName}
                        </span>

                        {isApproved && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Approved ({subm.marksAwarded}/{activeAssignment.maxMarks})</span>
                          </span>
                        )}

                        {isRejected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            <span>Rejected / Revision Needed</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Awaiting Faculty Review</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        File: {subm.fileName} ({subm.fileSize}) · Submitted at: {subm.submittedAt.split('T')[0]}
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated document viewer opening "${subm.fileName}".`)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>View File</span>
                    </button>
                  </div>

                  {subm.teacherFeedback && (
                    <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                      isApproved
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : isRejected
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <strong className="block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Teacher Feedback:
                      </strong>
                      "{subm.teacherFeedback}"
                    </div>
                  )}

                  {/* Action buttons: Approve or Reject */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => openRejectModal(subm)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isRejected
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                          : 'bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isRejected ? 'Edit Rejection Note' : 'Reject Submission'}</span>
                    </button>

                    <button
                      onClick={() => openApproveModal(subm)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Update Grade & Approval' : 'Approve & Award Marks'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal (Approve or Reject with instant notifications) */}
      {activeReviewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {reviewAction === 'approve' ? (
                  <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                    <ThumbsUp className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700">
                    <XCircle className="w-4 h-4" />
                  </span>
                )}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {reviewAction === 'approve' ? 'Approve Homework Submission' : 'Reject Homework Submission'}
                </h3>
              </div>
              <button
                onClick={() => setActiveReviewSubmission(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Student: {activeReviewSubmission.studentName}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Assignment: {activeAssignment.title}
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-mono">
                File: {activeReviewSubmission.fileName}
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              {reviewAction === 'approve' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Marks Awarded (Max: {activeAssignment.maxMarks})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={activeAssignment.maxMarks}
                    value={awardedMarks}
                    onChange={(e) => setAwardedMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {reviewAction === 'approve'
                    ? 'Faculty Evaluation Remarks / Feedback'
                    : 'Rejection Reason & Required Corrections (Sent to Student and Parent)'}
                </label>
                <textarea
                  rows={3}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Praise student approach, highlight precision...'
                      : 'State why submission was rejected and what student needs to fix before resubmitting...'
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveReviewSubmission(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${
                    reviewAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {reviewAction === 'approve' ? 'Confirm Approval & Notify' : 'Confirm Rejection & Request Resubmission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create New Homework Assignment
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Quadratic Formula Practice Sheet"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assigned Class
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Grade"
                      className="px-2 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
                    />
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Section"
                      className="px-2 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Instructions & Homework Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed guidelines, problem set numbers, and submission format..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Publishing this will automatically broadcast notifications to both students and parents.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
