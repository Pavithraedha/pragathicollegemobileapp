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
                    <span className="text-xs font-bold text-slate-900">{asg.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        submission?.status === 'graded'
                          ? 'bg-purple-100 text-purple-800'
                          : isSubmitted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {submission?.status === 'graded'
                        ? `Graded (${submission.marksAwarded}/${asg.maxMarks})`
                        : isSubmitted
                        ? 'Submitted'
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {asg.subjectName} · Faculty: {asg.teacherName} · Max Marks: {asg.maxMarks}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {asg.description}
              </p>

              {/* Attachments if any */}
              {asg.attachments && asg.attachments.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">Provided Worksheet:</span>
                  {asg.attachments.map((att, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Downloading worksheet "${att.name}" (${att.size})`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>{att.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Submission details or action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {isSubmitted ? (
                  <div className="text-xs text-emerald-800 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      File: <strong className="font-mono">{submission.fileName}</strong> ({submission.submittedAt.split('T')[0]})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-700 font-medium">
                    Awaiting your PDF or document upload
                  </span>
                )}

                <button
                  onClick={() => {
                    setActiveModalAssignment(asg);
                    setSimulatedFileName(`${student.fullName.replace(/\s+/g, '_')}_${asg.subjectName}_Solution.pdf`);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
                    isSubmitted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSubmitted ? 'Resubmit File' : 'Submit Homework'}</span>
                </button>
              </div>

              {/* Feedback if graded */}
              {submission?.teacherFeedback && (
                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                  <div className="font-semibold text-purple-900 flex items-center justify-between">
                    <span>Teacher Evaluation & Feedback:</span>
                    <span className="font-bold tabular-nums">
                      Awarded: {submission.marksAwarded} / {asg.maxMarks}
                    </span>
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
