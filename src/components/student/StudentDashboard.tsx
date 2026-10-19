import React from 'react';
import {
  BookOpen,
  Clock,
  Award,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
  onSelectSubject,
}) => {
  const {
    students,
    subjects,
    chapters,
    timetable,
    attendanceRecords,
    assessments,
    assignments,
    submissions,
    announcements,
  } = useCampus();

  const student = students[0]; // Rohan Sharma (student-1)

  // Attendance metrics
  const myAttendance = attendanceRecords.filter((a) => a.studentId === student.id);
  const totalDays = myAttendance.length || 1;
  const presentDays = myAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  // Next class calculation from Monday schedule
  const todayClasses = timetable.filter(
    (t) => t.grade === student.grade && t.section === student.section && t.day === 'Monday' && !t.isBreak
  );
  const nextClass = todayClasses[0] || {
    subjectName: 'Mathematics',
    teacherName: 'Mr. Rajesh Verma',
    roomNo: 'Room 302',
    startTime: '08:30 AM',
    endTime: '09:15 AM',
  };

  // Syllabus progress overall
  let totalTopics = 0;
  let completedTopics = 0;
  chapters.forEach((ch) => {
    ch.topics.forEach((top) => {
      totalTopics++;
      if (top.officialStatus === 'completed' || top.studentStatus?.[student.id] === 'completed') {
        completedTopics++;
      }
    });
  });
  const overallSyllabusRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 65;

  // Pending homework
  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const pendingAssignments = assignments.filter(
    (asg) => !mySubmissions.some((subm) => subm.assignmentId === asg.id)
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-[#163B70] via-[#1a498b] to-[#2563EB] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Student Learning Space
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{student.fullName}</h2>
              <div className="flex items-center gap-2 text-xs text-blue-100 mt-0.5">
                <span>Class {student.grade}-{student.section}</span>
                <span>·</span>
                <span>Roll #{student.rollNo}</span>
                <span>·</span>
                <span>{student.academicYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Class Highlight Strip */}
        <div className="mt-4 p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-blue-200 uppercase font-semibold">Current / Next Period</div>
            <div className="text-sm font-bold text-white mt-0.5">{nextClass.subjectName}</div>
            <div className="text-[11px] text-blue-100 flex items-center gap-2 mt-0.5">
              <span>{nextClass.teacherName}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {nextClass.roomNo}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold bg-blue-500/40 px-2.5 py-1 rounded-lg border border-blue-400/30">
              {nextClass.startTime}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigateTab('subjects')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-center hover:border-blue-400 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">Syllabus Covered</div>
          <div className="text-xl font-bold text-blue-700 mt-1 tabular-nums">{overallSyllabusRate}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{completedTopics} of {totalTopics} Topics</div>
        </button>

        <button
          onClick={() => onNavigateTab('performance')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-center hover:border-blue-400 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">Academic Average</div>
          <div className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">89.4%</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Grade A+ (Distinction)</div>
        </button>

        <button
          onClick={() => onNavigateTab('timetable')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-center hover:border-blue-400 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">Attendance Rate</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{attendanceRate}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">CBSE Compliant</div>
        </button>
      </div>

      {/* Homework Action Alert (if pending) */}
      {pendingAssignments.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950">
                {pendingAssignments.length} Assignment(s) Awaiting Submission
              </div>
              <div className="text-[11px] text-amber-800 mt-0.5">
                Next: {pendingAssignments[0].subjectName} · Due {pendingAssignments[0].dueDate}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('subjects')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Review
          </button>
        </div>
      )}

      {/* Enrolled Subjects Quick Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Enrolled Academic Subjects
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('subjects')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              onClick={() => {
                onSelectSubject(subj.id);
                onNavigateTab('subjects');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{subj.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{subj.code} · {subj.teacherName}</div>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {Math.round((subj.completedChapters / subj.totalChapters) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.round((subj.completedChapters / subj.totalChapters) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Examinations Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Upcoming Assessments & Tests
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Class 10-A Calendar</span>
        </div>

        <div className="space-y-2">
          {assessments.slice(0, 3).map((asm) => (
            <div
              key={asm.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-900">{asm.title}</div>
                <div className="text-[11px] text-slate-500">
                  {asm.subjectName} · Max Marks: {asm.maxMarks}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs font-semibold text-blue-800">{asm.date}</div>
                <span className="text-[10px] text-slate-400">Passing: {asm.passingMarks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
