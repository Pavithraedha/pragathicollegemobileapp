import React from 'react';
import {
  CalendarCheck,
  CreditCard,
  Building,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface ParentDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenPayModal: (invoiceId?: string) => void;
  onOpenLeaveModal: () => void;
  onSelectSubView: (view: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onNavigateTab,
  onOpenPayModal,
  onOpenLeaveModal,
  onSelectSubView,
}) => {
  const {
    selectedChild,
    attendanceRecords,
    feeInvoices,
    assessments,
    assessmentMarks,
    assignments,
    announcements,
    hostelDetails,
  } = useCampus();

  // Calculate attendance for selected child
  const childAttendance = attendanceRecords.filter((a) => a.studentId === selectedChild.id);
  const totalDays = childAttendance.length || 1;
  const presentDays = childAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  // Today's status (latest record)
  const todayRecord = childAttendance[childAttendance.length - 1];

  // Outstanding fee for child
  const childInvoices = feeInvoices.filter((i) => i.studentId === selectedChild.id);
  const pendingInvoice = childInvoices.find((i) => i.status === 'pending' || i.status === 'overdue');
  const outstandingAmount = childInvoices.reduce((acc, curr) => acc + curr.balanceAmount, 0);

  // Academic marks
  const publishedAssessments = assessments.filter((a) => a.isPublished);
  const childMarks = assessmentMarks.filter(
    (m) => m.studentId === selectedChild.id && publishedAssessments.some((p) => p.id === m.assessmentId)
  );

  let totalScored = 0;
  let totalMax = 0;
  childMarks.forEach((m) => {
    const asm = assessments.find((a) => a.id === m.assessmentId);
    if (asm) {
      totalScored += m.marksObtained;
      totalMax += asm.maxMarks;
    }
  });
  const overallAvg = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 89;

  // Upcoming exams
  const upcomingExams = assessments.filter((a) => !a.isPublished);

  // Pending assignments
  const pendingHomework = assignments.length;

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Welcome & Child Card */}
      <div className="bg-gradient-to-r from-[#163B70] to-[#1e4d8f] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <img
            src="/src/assets/images/smart_campus_crest_1792401817858.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={selectedChild.avatar}
              alt={selectedChild.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Student Profile
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {selectedChild.fullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-blue-100 mt-0.5">
                <span>Class {selectedChild.grade}-{selectedChild.section}</span>
                <span>·</span>
                <span>Roll No: {selectedChild.rollNo}</span>
                <span>·</span>
                <span>Adm: {selectedChild.admissionNo}</span>
              </div>
            </div>
          </div>

          {selectedChild.hostelAllocated && (
            <button
              onClick={() => onSelectSubView('hostel')}
              className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-blue-300" />
              <span>Hostel Resident</span>
            </button>
          )}
        </div>

        {/* Quick KPI Strip inside Card */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[11px] text-blue-200">Attendance</div>
            <div className="text-base sm:text-lg font-bold text-white tabular-nums">
              {attendanceRate}%
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[11px] text-blue-200">Overall Grade</div>
            <div className="text-base sm:text-lg font-bold text-white tabular-nums">
              {overallAvg}% (A)
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[11px] text-blue-200">Pending Fees</div>
            <div className="text-base sm:text-lg font-bold text-amber-300 tabular-nums">
              ₹{outstandingAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenLeaveModal}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-all text-center"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-1.5">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800">Apply Leave</span>
        </button>

        <button
          onClick={() => {
            if (pendingInvoice) {
              onOpenPayModal(pendingInvoice.id);
            } else {
              onNavigateTab('fees');
            }
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-all text-center"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800">Pay Fees</span>
        </button>

        <button
          onClick={() => onSelectSubView('timetable')}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-all text-center"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800">Timetable</span>
        </button>

        <button
          onClick={() => onSelectSubView('hostel')}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-all text-center"
        >
          <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mb-1.5">
            <Building className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800">Hostel</span>
        </button>
      </div>

      {/* Attendance & Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today's Attendance Widget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Today's Attendance
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="text-xs text-slate-500">October 19, 2026 (Monday)</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                Status: <span className="text-emerald-600 capitalize">{todayRecord?.status || 'Present'}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Marked by: {todayRecord?.markedByName || 'Mr. Rajesh Verma'} at 08:35 AM
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center font-bold text-emerald-700 text-xs">
              {attendanceRate}%
            </div>
          </div>
        </div>

        {/* Fee Alert Widget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Term 2 School Fees
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('fees')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>All Invoices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-900">
                {pendingInvoice ? pendingInvoice.term : 'All Fees Cleared'}
              </div>
              <div className="text-[11px] text-amber-800 mt-0.5">
                Due Date: <span className="font-semibold">{pendingInvoice?.dueDate || 'None'}</span>
              </div>
              <div className="text-base font-bold text-amber-950 mt-1 tabular-nums">
                ₹{outstandingAmount.toLocaleString('en-IN')} Due
              </div>
            </div>
            {outstandingAmount > 0 && (
              <button
                onClick={() => onOpenPayModal(pendingInvoice?.id)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Academic Highlights & Recent Exams */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Recent Published Assessment Results
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('academics')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Detailed Marks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {childMarks.slice(0, 3).map((mark) => {
            const asm = assessments.find((a) => a.id === mark.assessmentId);
            return (
              <div
                key={mark.id}
                className="p-3 bg-slate-50 hover:bg-blue-50/30 rounded-xl border border-slate-200/70 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{asm?.title}</div>
                  <div className="text-[11px] text-slate-500">
                    Subject: {asm?.subjectName} · Max Marks: {asm?.maxMarks}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-700 tabular-nums">
                    {mark.marksObtained} / {asm?.maxMarks}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    Grade {mark.grade}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hostel Status Card (if allocated) */}
      {selectedChild.hostelAllocated && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Hostel Residence Overview
              </h3>
            </div>
            <button
              onClick={() => onSelectSubView('hostel')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-purple-950">{hostelDetails.hostelName}</div>
              <div className="text-purple-800 text-[11px]">
                {hostelDetails.roomNo} · {hostelDetails.bedNo} · Warden: {hostelDetails.wardenName}
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg">
              Mess Active
            </span>
          </div>
        </div>
      )}

      {/* School Announcements */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Campus Announcements
          </h3>
          <span className="text-[11px] text-slate-500">Official Notices</span>
        </div>
        <div className="space-y-2">
          {announcements.slice(0, 2).map((ann) => (
            <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              <div className="text-[10px] text-slate-400 pt-1">Issued by: {ann.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
