import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  AlertCircle,
  FilePlus,
  CheckCircle2,
  Clock,
  XCircle,
  Filter
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface ParentAttendanceProps {
  onOpenLeaveModal: () => void;
}

export const ParentAttendance: React.FC<ParentAttendanceProps> = ({ onOpenLeaveModal }) => {
  const { selectedChild, attendanceRecords, leaveRequests } = useCampus();

  const [monthFilter, setMonthFilter] = useState('2026-10');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter records for selected child
  const childRecords = attendanceRecords.filter((a) => a.studentId === selectedChild.id);

  const totalWorkingDays = childRecords.length || 1;
  const presentDays = childRecords.filter((a) => a.status === 'present').length;
  const lateDays = childRecords.filter((a) => a.status === 'late').length;
  const leaveDays = childRecords.filter((a) => a.status === 'leave').length;
  const absentDays = childRecords.filter((a) => a.status === 'absent').length;

  const attendancePercentage = Math.round(((presentDays + lateDays) / totalWorkingDays) * 100);

  // Filtered list
  const filteredRecords = childRecords.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (monthFilter && !r.date.startsWith(monthFilter)) return false;
    return true;
  });

  // Days in October 2026 for visual calendar grid
  const daysInOctober = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${dayNum.toString().padStart(2, '0')}`;
    const record = childRecords.find((r) => r.date === dateStr);
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sun or Sat

    return {
      dayNum,
      dateStr,
      record,
      isWeekend,
    };
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Leave Application Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Attendance & Leave Records</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified official attendance for {selectedChild.fullName} (Class {selectedChild.grade}-{selectedChild.section})
          </p>
        </div>
        <button
          onClick={onOpenLeaveModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <FilePlus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Attendance Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-medium">Monthly Percentage</div>
          <div className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">
            {attendancePercentage}%
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Above 75% CBSE requirement</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-medium">Total Working Days</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalWorkingDays}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Academic Session Days</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-medium">Present / Late</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {presentDays} <span className="text-xs text-slate-400 font-normal">({lateDays} Late)</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Marked in classroom</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-medium">Approved Leave / Absent</div>
          <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">
            {leaveDays} <span className="text-xs text-slate-400 font-normal">({absentDays} Unexcused)</span>
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Official Excuses Recorded</div>
        </div>
      </div>

      {/* Monthly Attendance Calendar Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              October 2026 Attendance Calendar
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Present
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Late
            </span>
            <span className="flex items-center gap-1 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Leave
            </span>
            <span className="flex items-center gap-1 text-red-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Absent
            </span>
          </div>
        </div>

        {/* 7-column calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="font-semibold text-slate-400 py-1 text-[11px]">
              {d}
            </div>
          ))}

          {/* Blank offset for Oct 1 2026 (Thursday -> 4 blank cells: Sun, Mon, Tue, Wed) */}
          <div className="p-2" />
          <div className="p-2" />
          <div className="p-2" />
          <div className="p-2" />

          {daysInOctober.map((item) => {
            const isToday = item.dateStr === '2026-10-19';
            let bgClass = 'bg-slate-50 text-slate-600 border border-slate-100';

            if (item.isWeekend) {
              bgClass = 'bg-slate-100/60 text-slate-400 border border-transparent';
            } else if (item.record) {
              if (item.record.status === 'present') bgClass = 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold';
              else if (item.record.status === 'late') bgClass = 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold';
              else if (item.record.status === 'leave') bgClass = 'bg-blue-50 text-blue-900 border border-blue-300 font-semibold';
              else if (item.record.status === 'absent') bgClass = 'bg-red-50 text-red-900 border border-red-300 font-semibold';
            }

            return (
              <div
                key={item.dayNum}
                className={`min-h-[42px] p-1 rounded-xl flex flex-col items-center justify-between transition-transform ${bgClass} ${
                  isToday ? 'ring-2 ring-blue-600 font-bold' : ''
                }`}
                title={item.record ? `${item.dateStr}: ${item.record.status.toUpperCase()}` : item.dateStr}
              >
                <span className="text-[11px] tabular-nums">{item.dayNum}</span>
                {item.record && (
                  <span className="text-[9px] uppercase tracking-tighter scale-90">
                    {item.record.status === 'present' ? 'P' : item.record.status === 'late' ? 'L' : item.record.status === 'leave' ? 'LV' : 'AB'}
                  </span>
                )}
                {item.isWeekend && <span className="text-[9px] text-slate-400">Off</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submitted Leave Requests Status */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Recent Leave Applications & Approval Status
        </h3>
        <div className="space-y-2">
          {leaveRequests
            .filter((l) => l.studentId === selectedChild.id)
            .map((leave) => (
              <div
                key={leave.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{leave.startDate} to {leave.endDate}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        leave.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : leave.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">{leave.reason}</p>
                  {leave.reviewedBy && (
                    <div className="text-[10px] text-slate-500 mt-1">
                      Reviewed by {leave.reviewedBy} on {leave.reviewedAt?.split('T')[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Detailed Attendance Log with Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Detailed Daily Attendance Log
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="late">Late Only</option>
              <option value="leave">Leave Only</option>
              <option value="absent">Absent Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Session</th>
                <th className="px-3 py-2">Teacher Remarks</th>
                <th className="px-3 py-2">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                    No attendance records matching filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2 font-mono text-slate-800 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          rec.status === 'present'
                            ? 'text-emerald-700'
                            : rec.status === 'late'
                            ? 'text-amber-700'
                            : rec.status === 'leave'
                            ? 'text-blue-700'
                            : 'text-red-700'
                        }`}
                      >
                        {rec.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {rec.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                        {rec.status === 'leave' && <Calendar className="w-3.5 h-3.5" />}
                        {rec.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                        <span className="capitalize">{rec.status}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-500 capitalize">
                      {rec.session.replace('_', ' ')}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {rec.remarks || 'Standard roll call verified'}
                    </td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                      {rec.markedByName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
