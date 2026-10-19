import React, { useState } from 'react';
import { Clock, MapPin, User, AlertCircle, Calendar } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const StudentTimetable: React.FC = () => {
  const { students, timetable } = useCampus();
  const student = students[0];
  const [activeDay, setActiveDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slots = timetable.filter(
    (t) => t.grade === student.grade && t.section === student.section && t.day === activeDay
  );

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Weekly Academic Timetable</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Class {student.grade}-{student.section} · Section Timetable (Room 302)
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Current Term Active
          </span>
        </div>

        {/* Day selection tabs */}
        <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                activeDay === day
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Period list */}
      <div className="space-y-2.5">
        {slots.map((slot, index) => {
          if (slot.isBreak) {
            return (
              <div
                key={slot.id}
                className="p-3 bg-amber-50/70 rounded-xl border border-dashed border-amber-200 flex items-center justify-between text-xs text-amber-900"
              >
                <div className="font-semibold">{slot.subjectName}</div>
                <div className="font-mono text-[11px] text-amber-700">
                  {slot.startTime} – {slot.endTime}
                </div>
              </div>
            );
          }

          const isCurrentPeriod = activeDay === 'Monday' && index === 0;

          return (
            <div
              key={slot.id}
              className={`bg-white p-3.5 rounded-xl border shadow-2xs flex items-center justify-between gap-3 transition-colors ${
                isCurrentPeriod ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl font-bold flex flex-col items-center justify-center text-xs shrink-0 ${
                    isCurrentPeriod ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-normal">P</span>
                  <span>{slot.period}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{slot.subjectName}</span>
                    {isCurrentPeriod && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded animate-pulse">
                        NOW
                      </span>
                    )}
                    {slot.isLab && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded">
                        Lab Session
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {slot.teacherName}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slot.roomNo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                {slot.startTime} – {slot.endTime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
