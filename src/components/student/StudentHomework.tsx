import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Upload,
  Download,
  AlertCircle,
  X,
  FileCheck,
  Send
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Assignment } from '../../types';

export const StudentHomework: React.FC = () => {
  const { students, assignments, submissions, submitAssignment } = useCampus();
  const student = students[0];

  const [activeModalAssignment, setActiveModalAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const mySubmissions = submissions.filter((s) => s.studentId === student.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAssignment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const fileName = simulatedFileName || `${student.fullName.replace(/\s+/g, '_')}_${activeModalAssignment.subjectName}_Solution.pdf`;
      submitAssignment(activeModalAssignment.id, student.id, fileName, '1.9 MB');
      setIsSubmitting(false);
      setSuccessMsg(`Assignment "${activeModalAssignment.title}" submitted successfully.`);
      setActiveModalAssignment(null);
      setSimulatedFileName('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Homework & Digital Assignments</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit practice sheets, lab records, and projects for faculty evaluation
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Assignment cards */}
      <div className="space-y-3">
        {assignments.map((asg) => {
          const submission = mySubmissions.find((s) => s.assignmentId === asg.id);
          const isSubmitted = !!submission;

          return (
            <div
              key={asg.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{asg.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        submission?.status === 'approved' || submission?.status === 'graded'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : submission?.status === 'rejected'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : isSubmitted
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {submission?.status === 'approved' || submission?.status === 'graded'
                        ? `Approved (${submission.marksAwarded}/${asg.maxMarks})`
                        : submission?.status === 'rejected'
                        ? 'Revision Required'
                        : isSubmitted
                        ? 'Submitted (In Review)'
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {asg.subjectName} · Faculty: {asg.teacherName} · Max Marks: {asg.maxMarks}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {asg.description}
              </p>

              {/* Attachments if any */}
              {asg.attachments && asg.attachments.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Provided Worksheet:</span>
                  {asg.attachments.map((att, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Downloading worksheet "${att.name}" (${att.size})`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{att.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Submission details or action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isSubmitted ? (
                  <div className={`text-xs flex items-center gap-2 ${
                    submission?.status === 'rejected' ? 'text-rose-700 dark:text-rose-300 font-semibold' : 'text-emerald-800 dark:text-emerald-300'
                  }`}>
                    <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      File: <strong className="font-mono">{submission?.fileName}</strong> ({submission?.submittedAt?.split('T')[0]})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Awaiting your PDF or document upload
                  </span>
                )}

                <button
                  onClick={() => {
                    setActiveModalAssignment(asg);
                    setSimulatedFileName(`${student.fullName.replace(/\s+/g, '_')}_${asg.subjectName}_Solution.pdf`);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
                    submission?.status === 'rejected'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : isSubmitted
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {submission?.status === 'rejected' ? 'Fix & Resubmit' : isSubmitted ? 'Re-upload File' : 'Submit Homework'}
                  </span>
                </button>
              </div>

              {/* Feedback if reviewed */}
              {submission?.teacherFeedback && (
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  submission?.status === 'rejected'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200'
                    : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200'
                }`}>
                  <div className="font-semibold flex items-center justify-between">
                    <span>Teacher Review Remarks:</span>
                    {submission.marksAwarded !== undefined && (
                      <span className="font-bold tabular-nums">
                        Awarded: {submission.marksAwarded} / {asg.maxMarks}
                      </span>
                    )}
                  </div>
                  <p className="italic">"{submission.teacherFeedback}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Homework Modal */}
      {activeModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Upload Homework Solution</h3>
              </div>
              <button
                onClick={() => setActiveModalAssignment(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-500">Assignment:</div>
                <div className="text-sm font-bold text-slate-900">{activeModalAssignment.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Subject: {activeModalAssignment.subjectName} · Due: {activeModalAssignment.dueDate}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  File Document Name
                </label>
                <input
                  type="text"
                  value={simulatedFileName}
                  onChange={(e) => setSimulatedFileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden font-mono"
                  required
                />
              </div>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-800">
                  Select PDF or Document from Device
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Supported formats: PDF, DOCX, JPG (Max 25 MB)
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAssignment(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Uploading to Server...' : 'Submit Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
