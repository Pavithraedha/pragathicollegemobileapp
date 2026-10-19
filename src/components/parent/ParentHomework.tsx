import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Check,
  XCircle,
  Award,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const ParentHomework: React.FC = () => {
  const { selectedChild, assignments, submissions } = useCampus();

  // Child submissions
  const childSubmissions = submissions.filter((s) => s.studentId === selectedChild.id);

  // Stats
  const totalHomework = assignments.length;
  const approvedCount = childSubmissions.filter((s) => s.status === 'approved' || s.status === 'graded').length;
  const rejectedCount = childSubmissions.filter((s) => s.status === 'rejected').length;
  const submittedCount = childSubmissions.filter((s) => s.status === 'submitted').length;
  const pendingCount = assignments.filter((a) => !childSubmissions.some((s) => s.assignmentId === a.id)).length;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Ward Homework & Assignments
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assigned worksheets, submission status, and faculty approvals for {selectedChild.fullName}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
            Grade {selectedChild.grade}-{selectedChild.section}
          </span>
        </div>

        {/* Quick status counters */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Total</div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{totalHomework}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <div className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-semibold">Approved</div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{approvedCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <div className="text-[10px] text-blue-800 dark:text-blue-300 uppercase font-semibold">Submitted</div>
            <div className="text-base font-bold text-blue-700 dark:text-blue-400 mt-0.5">{submittedCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
            <div className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-semibold">Pending</div>
            <div className="text-base font-bold text-amber-700 dark:text-amber-400 mt-0.5">{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {assignments.map((asg) => {
          const submission = childSubmissions.find((s) => s.assignmentId === asg.id);
          const isApproved = submission?.status === 'approved' || submission?.status === 'graded';
          const isRejected = submission?.status === 'rejected';
          const isSubmitted = submission?.status === 'submitted';

          return (
            <div
              key={asg.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 hover:border-blue-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </span>

                    {/* Status Badge */}
                    {isApproved && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Approved ({submission.marksAwarded}/{asg.maxMarks})</span>
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>Revision Requested</span>
                      </span>
                    )}

                    {isSubmitted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Submitted · Under Review</span>
                      </span>
                    )}

                    {!submission && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Pending Submission</span>
                      </span>
                    )}
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

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                {asg.description}
              </p>

              {/* Teacher Remarks if available */}
              {submission?.teacherFeedback && (
                <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                  isApproved
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                    : isRejected
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  <strong className="block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Educator Feedback:
                  </strong>
                  "{submission.teacherFeedback}"
                </div>
              )}

              {/* Download worksheet or view submission info */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {submission ? (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Submitted: {submission.fileName} ({submission.fileSize})
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Reminder: Ask ward to complete and submit before due date
                  </span>
                )}

                {asg.attachments && asg.attachments.length > 0 && (
                  <button
                    onClick={() => alert(`Downloading worksheet "${asg.attachments?.[0].name}"`)}
                    className="flex items-center gap-1 px-2.5 py-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Worksheet</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
