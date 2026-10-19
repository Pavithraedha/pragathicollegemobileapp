import React, { useState } from 'react';
import {
  BookOpen,
  User,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { StudentSyllabusViewer } from './StudentSyllabusViewer';

export const StudentSubjects: React.FC<{ initialSubjectId?: string }> = ({ initialSubjectId }) => {
  const { subjects, chapters } = useCampus();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialSubjectId || null);

  if (selectedSubjectId) {
    return (
      <StudentSyllabusViewer
        initialSubjectId={selectedSubjectId}
        onBackToSubjects={() => setSelectedSubjectId(null)}
      />
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Enrolled Subjects & Curriculum</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select any course below to explore unit chapters, topic explanations, and practice worksheets
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {subjects.map((subj) => {
          const subjChapters = chapters.filter((c) => c.subjectId === subj.id);
          const percent = Math.round((subj.completedChapters / subj.totalChapters) * 100);

          return (
            <div
              key={subj.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between hover:border-blue-400 transition-all space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {subj.code.substring(0, 3)}
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg tabular-nums">
                    {percent}% Completed
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{subj.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{subj.teacherName}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Code: {subj.code}</span>
                  <span>·</span>
                  <span>{subj.totalChapters} Chapters</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                </div>

                <button
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Open Syllabus & Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
