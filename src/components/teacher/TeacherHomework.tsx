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
  Award
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Assignment, AssignmentSubmission } from '../../types';

export const TeacherHomework: React.FC = () => {
  const {
    students,
    subjects,
    assignments,
    submissions,
    createAssignment,
    gradeSubmission,
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

  // Grading modal state
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [awardedMarks, setAwardedMarks] = useState(14);
  const [teacherRemarks, setTeacherRemarks] = useState('');

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  const assignmentSubmissions = submissions.filter((s) => s.assignmentId === selectedAssignmentId);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subj = subjects.find((s) => s.id === subjectId);
    createAssignment({
      grade: '10',
      section: 'A',
      subjectId,
      subjectName: subj?.name || 'Mathematics',
      title: title.trim(),
      description: description.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      maxMarks: Number(maxMarks),
      teacherId: 'user-teacher-1',
      teacherName: 'Mr. Rajesh Verma',
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
    setFeedback(`Assignment "${title}" published to student dashboards.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeSubmission(gradingSubmission.id, awardedMarks, teacherRemarks);
    setGradingSubmission(null);
    setFeedback(`Grade and evaluation feedback submitted for ${gradingSubmission.studentName}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Homework & Assignment Queue</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribute homework worksheets, review student submissions, and award grades
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>

        {/* Assignment selector tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          {assignments.map((asg) => (
            <button
              key={asg.id}
              onClick={() => setSelectedAssignmentId(asg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedAssignmentId === asg.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {asg.title.slice(0, 28)}...
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Assignment Info */}
      {activeAssignment && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900">{activeAssignment.title}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                {activeAssignment.subjectName} · Max Marks: {activeAssignment.maxMarks}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Due: {activeAssignment.dueDate}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {activeAssignment.description}
          </p>
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Student Submissions ({assignmentSubmissions.length} Received)
          </h3>
          <span className="text-[11px] text-slate-500">Class 10-A</span>
        </div>

        {assignmentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No student submissions uploaded yet for this assignment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignmentSubmissions.map((subm) => (
              <div
                key={subm.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{subm.studentName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        subm.status === 'graded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {subm.status === 'graded' ? `Graded (${subm.marksAwarded}/${activeAssignment.maxMarks})` : 'Submitted'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    File: {subm.fileName} ({subm.fileSize}) · Submitted at: {subm.submittedAt.split('T')[0]}
                  </div>
                  {subm.teacherFeedback && (
                    <div className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{subm.teacherFeedback}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert(`Simulated document viewer opening "${subm.fileName}".`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </button>

                  <button
                    onClick={() => {
                      setGradingSubmission(subm);
                      setAwardedMarks(subm.marksAwarded || activeAssignment.maxMarks - 1);
                      setTeacherRemarks(subm.teacherFeedback || 'Well structured solutions.');
                    }}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{subm.status === 'graded' ? 'Update Grade' : 'Grade Submission'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Grade Submission: {gradingSubmission.studentName}
              </h3>
              <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Marks Awarded (Max: {activeAssignment.maxMarks})
                </label>
                <input
                  type="number"
                  min={0}
                  max={activeAssignment.maxMarks}
                  value={awardedMarks}
                  onChange={(e) => setAwardedMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Constructive Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  placeholder="Provide comments on solution steps, presentation, and accuracy..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Homework Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Quadratic Formula Practice Sheet"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed guidelines and problem numbers..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
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
