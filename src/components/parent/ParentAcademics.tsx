import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle,
  FileText,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const ParentAcademics: React.FC = () => {
  const { selectedChild, subjects, assessments, assessmentMarks } = useCampus();
  const [selectedTerm, setSelectedTerm] = useState<'all' | 'term1' | 'term2'>('all');

  // Published assessments only (official results)
  const publishedAssessments = assessments.filter((a) => a.isPublished);

  // Child marks
  const childMarks = assessmentMarks.filter(
    (m) => m.studentId === selectedChild.id && publishedAssessments.some((a) => a.id === m.assessmentId)
  );

  // Subject performance breakdown
  const subjectBreakdown = subjects.map((subj) => {
    const subjAssessments = publishedAssessments.filter((a) => a.subjectId === subj.id);
    const marksForSubj = childMarks.filter((m) =>
      subjAssessments.some((a) => a.id === m.assessmentId)
    );

    let scored = 0;
    let max = 0;
    marksForSubj.forEach((m) => {
      const asm = subjAssessments.find((a) => a.id === m.assessmentId);
      if (asm) {
        scored += m.marksObtained;
        max += asm.maxMarks;
      }
    });

    const percent = max > 0 ? Math.round((scored / max) * 100) : 0;
    let grade = 'N/A';
    if (percent >= 90) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 70) grade = 'B+';
    else if (percent >= 60) grade = 'B';
    else if (percent >= 50) grade = 'C';
    else if (percent > 0) grade = 'D';

    return {
      subject: subj,
      scored,
      max,
      percent,
      grade,
      assessmentsCount: marksForSubj.length,
      latestRemark: marksForSubj[0]?.remarks || 'Consistent academic engagement recorded.',
    };
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Academic Performance & Report Cards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official evaluations for {selectedChild.fullName} (Academic Session 2026-27)
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedTerm('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedTerm === 'all' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              All Terms
            </button>
            <button
              onClick={() => setSelectedTerm('term1')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedTerm === 'term1' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              Term 1
            </button>
            <button
              onClick={() => setSelectedTerm('term2')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedTerm === 'term2' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              Term 2
            </button>
          </div>
        </div>

        {/* Verification banner */}
        <div className="mt-3 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-900">
          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Official Verified Grades:</strong> Only examinations and class tests reviewed and released by subject teachers are listed. Draft assessments remain confidential.
          </span>
        </div>
      </div>

      {/* Term Progress & Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Cumulative Average</div>
          <div className="text-3xl font-extrabold text-blue-700 mt-1 tabular-nums">89.4%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2% vs Term 1 baseline</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Overall Letter Grade</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">A+</div>
          <div className="text-[11px] text-slate-400 mt-1">Class Rank: Top 5% (Percentile 96)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Assessments Completed</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {childMarks.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Midterm & Periodic Unit Tests</div>
        </div>
      </div>

      {/* Subject-Wise Report Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Subject-Wise Evaluation Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subjectBreakdown.map((item) => (
            <div
              key={item.subject.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.subject.name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.subject.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Faculty: {item.subject.teacherName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg tabular-nums">
                    {item.grade} ({item.percent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Score Aggregate</span>
                  <span className="tabular-nums font-medium text-slate-800">
                    {item.scored} / {item.max} Marks
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Teacher remark */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p className="italic text-[11px] leading-relaxed">"{item.latestRemark}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examination History Detailed Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Official Examination History & Marks Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">Exam / Assessment</th>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Exam Date</th>
                <th className="px-3 py-2 text-right">Marks Scored</th>
                <th className="px-3 py-2 text-right">Max Marks</th>
                <th className="px-3 py-2 text-center">Grade</th>
                <th className="px-3 py-2">Educator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {childMarks.map((m) => {
                const asm = assessments.find((a) => a.id === m.assessmentId);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{asm?.title}</td>
                    <td className="px-3 py-2.5 text-slate-600">{asm?.subjectName}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500">{asm?.date}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-blue-700 tabular-nums">
                      {m.marksObtained}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-500 tabular-nums">{asm?.maxMarks}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px]">
                        {m.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 text-[11px] max-w-xs">{m.remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Strengths & Focus Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Academic Strengths</span>
          </div>
          <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside">
            <li>High analytical deduction in Quadratic Polynomials & Factorization.</li>
            <li>Strong laboratory precision in Ohm's Law resistance plotting.</li>
            <li>Consistent 90%+ in English essay reasoning and debate comprehension.</li>
          </ul>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Recommended Focus Areas</span>
          </div>
          <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
            <li>Review proof by contradiction written layout for irrational numbers.</li>
            <li>Practice downstream / upstream simultaneous equation problems for speed.</li>
            <li>Attend Wednesday evening tutorial session with Mr. Rajesh Verma.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
