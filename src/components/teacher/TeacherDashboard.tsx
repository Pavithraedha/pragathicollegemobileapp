import React from 'react';
import {
  Users,
  CheckSquare,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  Send,
  Plus
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface TeacherDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewAssessment?: () => void;
  onOpenAnnouncement?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateTab,
}) => {
  const {
    currentUser,
    students,
    subjects,
    timetable,
    attendanceRecords,
    leaveRequests,
    submissions,
    assignments,
  } = useCampus();

  // Class 10-A students
  const classStudents = students.filter((s) => s.grade === '10' && s.section === 'A');

  // Today's attendance status
  const todayStr = '2026-10-19';
  const markedToday = attendanceRecords.some((a) => a.date === todayStr);

  // Today's teaching schedule for Mr. Rajesh Verma (Monday)
  const todayClasses = timetable.filter(
    (t) => t.teacherId === currentUser.id && t.day === 'Monday' && !t.isBreak
  );

  // Submissions needing grading
  const pendingGrading = submissions.filter((s) => s.status === 'submitted');

  // Pending leave requests from parents
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  return (
    <div className="space-y-4 pb-20">
      {/* Teacher Welcome Card */}
      <div className="bg-gradient-to-r from-[#163B70] via-[#1a4b8f] to-[#2563EB] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Faculty Educator Portal
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{currentUser.name}</h2>
              <div className="text-xs text-blue-100 mt-0.5">
                Class Teacher (10-A) · HOD Mathematics · Senior Academic Board
              </div>
            </div>
          </div>
        </div>

        {/* Classroom Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-blue-200 text-[11px]">Class 10-A Roll</div>
            <div className="text-lg font-bold text-white tabular-nums">{classStudents.length} Students</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-blue-200 text-[11px]">Today's Periods</div>
            <div className="text-lg font-bold text-white tabular-nums">{todayClasses.length} Sessions</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-blue-200 text-[11px]">Submissions To Grade</div>
            <div className="text-lg font-bold text-amber-300 tabular-nums">{pendingGrading.length} Items</div>
          </div>
        </div>
      </div>

      {/* Attendance Call-to-Action Strip */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
          markedToday
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-amber-50/80 border-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              markedToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {markedToday ? "Today's Attendance Submitted" : 'Daily Class Attendance Pending'}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {markedToday
                ? 'Class 10-A morning session roll recorded and locked in campus registry.'
                : 'Please take roll call for Class 10-A before 09:30 AM.'}
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('attendance')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl shrink-0 transition-colors shadow-2xs ${
            markedToday
              ? 'bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {markedToday ? 'Review & Edit' : 'Mark Attendance'}
        </button>
      </div>

      {/* Pending Parent Leave Requests Alert */}
      {pendingLeaves.length > 0 && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950">
                {pendingLeaves.length} Student Leave Application Awaiting Your Review
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                From {pendingLeaves[0].studentName} ({pendingLeaves[0].startDate} to {pendingLeaves[0].endDate})
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('classes')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors shrink-0"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigateTab('attendance')}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all text-left space-y-1"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 pt-1">Roll Call</div>
          <p className="text-[11px] text-slate-500">Record 10-A daily attendance</p>
        </button>

        <button
          onClick={() => onNavigateTab('academics')}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all text-left space-y-1"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 pt-1">Syllabus Editor</div>
          <p className="text-[11px] text-slate-500">Add units, topics & notes</p>
        </button>

        <button
          onClick={() => onNavigateTab('academics')}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all text-left space-y-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 pt-1">Enter Marks</div>
          <p className="text-[11px] text-slate-500">Grade exams & publish</p>
        </button>

        <button
          onClick={() => onNavigateTab('classes')}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all text-left space-y-1"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 pt-1">Announcements</div>
          <p className="text-[11px] text-slate-500">Broadcast class notices</p>
        </button>
      </div>

      {/* Today's Teaching Schedule */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Today's Teaching Schedule (Monday)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Oct 19, 2026</span>
        </div>

        <div className="space-y-2">
          {todayClasses.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  P{c.period}
                </span>
                <div>
                  <div className="font-bold text-slate-900">{c.subjectName}</div>
                  <div className="text-[11px] text-slate-500">
                    Grade {c.grade}-{c.section} · {c.roomNo}
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                {c.startTime} – {c.endTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
