import React from 'react';
import { Award, TrendingUp, CheckCircle, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const StudentPerformance: React.FC = () => {
  const { students, subjects, assessments, assessmentMarks } = useCampus();
  const student = students[0];

  const publishedAssessments = assessments.filter((a) => a.isPublished);
  const myMarks = assessmentMarks.filter(
    (m) => m.studentId === student.id && publishedAssessments.some((a) => a.id === m.assessmentId)
  );

  let totalScored = 0;
  let totalMax = 0;
  myMarks.forEach((m) => {
    const asm = assessments.find((a) => a.id === m.assessmentId);
    if (asm) {
      totalScored += m.marksObtained;
      totalMax += asm.maxMarks;
    }
  });
  const percentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 89;

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span>My Academic Progress & Report Cards</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Cumulative evaluations for {student.fullName} (Roll #{student.rollNo})
        </p>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Overall Average</div>
          <div className="text-3xl font-extrabold text-blue-700 mt-1 tabular-nums">{percentage}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top Tier Performance</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Cumulative Grade</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">A+</div>
          <div className="text-[11px] text-slate-400 mt-1">GPA Equivalent: 9.4 / 10</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Scored Marks</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {totalScored} <span className="text-xs text-slate-400 font-normal">/ {totalMax}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All Official Published Tests</div>
        </div>
      </div>

      {/* Individual Exam Cards */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Evaluated Tests & Teacher Remarks
        </h3>

        <div className="space-y-3">
          {myMarks.map((m) => {
            const asm = assessments.find((a) => a.id === m.assessmentId);
            const percent = asm ? Math.round((m.marksObtained / asm.maxMarks) * 100) : 0;

            return (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:bg-blue-50/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{asm?.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {asm?.subjectName} · Date: {asm?.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-700 tabular-nums">
                      {m.marksObtained} / {asm?.maxMarks} ({percent}%)
                    </span>
                    <div className="text-[10px] font-semibold text-emerald-700">Grade: {m.grade}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-100 text-xs text-slate-700 italic">
                  "{m.remarks}"
                  <span className="not-italic text-slate-400 font-normal text-[10px] ml-1">
                    — {m.updatedBy}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
