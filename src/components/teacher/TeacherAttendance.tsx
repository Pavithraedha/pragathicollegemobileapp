import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Search,
  Users,
  ShieldCheck,
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { AttendanceStatus } from '../../types';

export const TeacherAttendance: React.FC = () => {
  const { students, attendanceRecords, markAttendance, currentUser } = useCampus();

  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDate, setSelectedDate] = useState('2026-10-19');
  const [selectedSession, setSelectedSession] = useState<'full_day' | 'morning' | 'afternoon'>('full_day');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Filter students for selected class
  const classStudents = students.filter(
    (s) => `${s.grade}-${s.section}` === selectedClass
  );

  // Initialize draft statuses from existing attendance records or default to 'present'
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      const existing = attendanceRecords.find(
        (a) => a.studentId === st.id && a.date === selectedDate && a.session === selectedSession
      );
      map[st.id] = existing ? existing.status : 'present';
    });
    return map;
  });

  const [studentRemarks, setStudentRemarks] = useState<Record<string, string>>({});

  // When date or session changes, reload existing attendance records
  const handleDateOrSessionChange = (newDate: string, newSession: 'full_day' | 'morning' | 'afternoon') => {
    setSelectedDate(newDate);
    setSelectedSession(newSession);
    const map: Record<string, AttendanceStatus> = {};
    const remarksMap: Record<string, string> = {};
    classStudents.forEach((st) => {
      const existing = attendanceRecords.find(
        (a) => a.studentId === st.id && a.date === newDate && a.session === newSession
      );
      map[st.id] = existing ? existing.status : 'present';
      if (existing?.remarks) {
        remarksMap[st.id] = existing.remarks;
      }
    });
    setDraftStatuses(map);
    setStudentRemarks(remarksMap);
    setSubmissionFeedback(null);
  };

  // Bulk action: Mark All Present
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      updated[st.id] = 'present';
    });
    setDraftStatuses(updated);
  };

  // Change individual status
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Summary counts
  const presentCount = Object.values(draftStatuses).filter((s) => s === 'present').length;
  const lateCount = Object.values(draftStatuses).filter((s) => s === 'late').length;
  const leaveCount = Object.values(draftStatuses).filter((s) => s === 'leave').length;
  const absentCount = Object.values(draftStatuses).filter((s) => s === 'absent').length;

  // Filtered students by search
  const filteredStudents = classStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.fullName.toLowerCase().includes(q) || s.rollNo.includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !confirm(
        `Confirm submission of attendance for Class ${selectedClass} on ${selectedDate}?\n\nPresent: ${presentCount}\nLate: ${lateCount}\nLeave: ${leaveCount}\nAbsent: ${absentCount}`
      )
    ) {
      return;
    }

    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: draftStatuses[s.id] || 'present',
      remarks: studentRemarks[s.id] || undefined,
    }));

    const res = markAttendance(records, selectedDate, selectedSession);
    setSubmissionFeedback(res.message);
    setTimeout(() => setSubmissionFeedback(null), 5000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Daily Classroom Roll Call & Attendance</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized Educator: {currentUser.name} · Session Model: Official CBSE Registry
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Mark All Present</span>
          </button>
        </div>

        {/* Class, Date, and Session Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Class & Section
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden"
            >
              <option value="10-A">Class 10 - Section A (Assigned Class)</option>
              <option value="10-B">Class 10 - Section B</option>
              <option value="9-A">Class 9 - Section A</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateOrSessionChange(e.target.value, selectedSession)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Session Interval
            </label>
            <select
              value={selectedSession}
              onChange={(e) => handleDateOrSessionChange(selectedDate, e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden"
            >
              <option value="full_day">Full Day Session</option>
              <option value="morning">Morning Roll Call</option>
              <option value="afternoon">Afternoon Post-Lunch</option>
            </select>
          </div>
        </div>

        {/* Live Attendance Counters Strip */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-semibold block">Present</span>
            <span className="text-lg font-bold text-emerald-700 tabular-nums">{presentCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] text-amber-800 font-semibold block">Late</span>
            <span className="text-lg font-bold text-amber-700 tabular-nums">{lateCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] text-blue-800 font-semibold block">Leave</span>
            <span className="text-lg font-bold text-blue-700 tabular-nums">{leaveCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
            <span className="text-[11px] text-red-800 font-semibold block">Absent</span>
            <span className="text-lg font-bold text-red-700 tabular-nums">{absentCount}</span>
          </div>
        </div>
      </div>

      {submissionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* Student List & Attendance Marking Controls */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Search header */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or roll number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {filteredStudents.length} Students Listed
          </div>
        </div>

        {/* Student row list */}
        <div className="divide-y divide-slate-100">
          {filteredStudents.map((st) => {
            const currentStatus = draftStatuses[st.id] || 'present';

            return (
              <div
                key={st.id}
                className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {st.rollNo}
                  </span>
                  <img
                    src={st.avatar}
                    alt={st.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{st.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Adm: {st.admissionNo} · Parent: {st.parentName}
                    </div>
                  </div>
                </div>

                {/* Status selection buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'late')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      currentStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                    }`}
                  >
                    Late
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'leave')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      currentStatus === 'leave'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700'
                    }`}
                  >
                    Leave
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'absent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      currentStatus === 'absent'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Bottom Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Attendance changes are timestamped and logged in immutable campus audit trail.</span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Submit Official Attendance</span>
          </button>
        </div>
      </form>
    </div>
  );
};
