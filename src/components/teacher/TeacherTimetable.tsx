import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  BookOpen,
  Coffee,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { TimetableSlot } from '../../types';

interface TeacherTimetableProps {
  onNavigateTab?: (tab: string) => void;
}

export const TeacherTimetable: React.FC<TeacherTimetableProps> = ({ onNavigateTab }) => {
  const { currentUser, timetable, subjects } = useCampus();
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [scheduleFilter, setScheduleFilter] = useState<'my' | 'all'>('my');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // My slots for the active day
  const myDaySlots = timetable.filter(
    (t) => t.day === activeDay && t.teacherId === currentUser.id
  );

  // All Class 10-A slots for the active day
  const allDaySlots = timetable.filter((t) => t.day === activeDay && t.grade === '10' && t.section === 'A');

  const displayedSlots = scheduleFilter === 'my' ? myDaySlots : allDaySlots;

  return (
    <div className="space-y-4 pb-20">
      {/* Timetable Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Faculty Academic Timetable
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser.name} · Class Teacher 10-A & HOD Mathematics
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            Term 2 Active
          </span>
        </div>

        {/* Schedule Filter: My Teaching Schedule vs Class 10-A Master */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setScheduleFilter('my')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              scheduleFilter === 'my'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Assigned Periods ({myDaySlots.length})
          </button>
          <button
            onClick={() => setScheduleFilter('all')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              scheduleFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Class 10-A Master Schedule
          </button>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = activeDay === day;
            const dayClassCount = timetable.filter(
              (t) => t.day === day && t.teacherId === currentUser.id
            ).length;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                <span>{day.slice(0, 3)}</span>
                <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {dayClassCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Day Summary Banner */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Teaching Sessions</div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
            {myDaySlots.length} Periods
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Class Incharge</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            Grade 10-A
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Primary Room</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            Room 302
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            {activeDay} Schedule ({displayedSlots.length} Slots)
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {scheduleFilter === 'my' ? 'My Classes Only' : 'Complete 10-A Section'}
          </span>
        </div>

        {displayedSlots.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Coffee className="w-8 h-8 text-amber-500 mx-auto" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No Teaching Sessions Scheduled on {activeDay}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              This day is designated for faculty research, student evaluations, department meetings, or remedial tutorials.
            </p>
          </div>
        ) : (
          displayedSlots.map((slot, idx) => {
            if (slot.isBreak) {
              return (
                <div
                  key={slot.id || idx}
                  className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-dashed border-amber-300 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200"
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-semibold">{slot.subjectName}</span>
                  </div>
                  <div className="font-mono text-[11px] text-amber-700 dark:text-amber-300">
                    {slot.startTime} – {slot.endTime}
                  </div>
                </div>
              );
            }

            const isMyClass = slot.teacherId === currentUser.id;
            const isCurrent = activeDay === 'Monday' && idx === 0;

            return (
              <div
                key={slot.id || idx}
                className={`p-3.5 bg-white dark:bg-slate-900 rounded-xl border shadow-2xs transition-all space-y-2 ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30'
                    : isMyClass
                    ? 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400'
                    : 'border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl font-bold flex flex-col items-center justify-center text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isMyClass
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-[9px] opacity-75 font-normal">P</span>
                      <span>{slot.period}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{slot.subjectName}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded animate-pulse">
                            ACTIVE
                          </span>
                        )}
                        {slot.isLab && (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-semibold px-1.5 py-0.2 rounded">
                            Lab Session
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Class {slot.grade}-{slot.section}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {slot.roomNo}
                        </span>
                        {!isMyClass && slot.teacherName && (
                          <>
                            <span>·</span>
                            <span>{slot.teacherName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 block">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                </div>

                {isMyClass && onNavigateTab && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      Assigned to you ({currentUser.name})
                    </span>
                    <button
                      onClick={() => onNavigateTab('academics')}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Syllabus Topics</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
