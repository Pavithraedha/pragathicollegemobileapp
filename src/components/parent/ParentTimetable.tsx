import React, { useState } from 'react';
import { Clock, Calendar, MapPin, User, BookOpen } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const ParentTimetable: React.FC = () => {
  const { selectedChild, timetable } = useCampus();
  const [activeDay, setActiveDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slotsForDay = timetable.filter(
    (s) => s.grade === selectedChild.grade && s.section === selectedChild.section && s.day === activeDay
  );

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Class Schedule & Timetable</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Weekly timetable for Grade {selectedChild.grade}-{selectedChild.section} · Room 302
        </p>

        {/* Day selector tabs */}
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

      {/* Slots list */}
      <div className="space-y-2.5">
        {slotsForDay.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No regular scheduled periods found for {activeDay}.
          </div>
        ) : (
          slotsForDay.map((slot) => {
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

            return (
              <div
                key={slot.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex flex-col items-center justify-center text-xs shrink-0">
                    <span className="text-[10px] text-blue-500 font-normal">P</span>
                    <span>{slot.period}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{slot.subjectName}</span>
                      {slot.isLab && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded">
                          Laboratory
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
          })
        )}
      </div>
    </div>
  );
};
