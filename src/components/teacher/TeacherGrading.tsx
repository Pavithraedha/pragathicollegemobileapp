import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Save,
  Send,
  Plus,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  X
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { AssessmentType } from '../../types';

export const TeacherGrading: React.FC = () => {
  const {
    students,
    subjects,
    assessments,
    assessmentMarks,
    createAssessment,
    saveAssessmentMarks,
  } = useCampus();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments[0]?.id || 'asm-1'
  );
  const [showNewAsmModal, setShowNewAsmModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New assessment form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AssessmentType>('unit_test');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(25);
  const [newPassingMarks, setNewPassingMarks] = useState<number>(9);
  const [newSubjectId, setNewSubjectId] = useState('sub-math-10');
  const [newDate, setNewDate] = useState('2026-10-25');

  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];
  const classStudents = students.filter(
    (s) => s.grade === activeAssessment?.grade && s.section === activeAssessment?.section
  );

  // Draft marks map
  const [marksState, setMarksState] = useState<Record<string, { marks: number; grade: string; remarks: string }>>(() => {
    const map: Record<string, { marks: number; grade: string; remarks: string }> = {};
    classStudents.forEach((st) => {
      const existing = assessmentMarks.find(
        (m) => m.assessmentId === selectedAssessmentId && m.studentId === st.id
      );
      map[st.id] = {
        marks: existing ? existing.marksObtained : 0,
        grade: existing ? existing.grade : 'B',
        remarks: existing ? existing.remarks : 'Good comprehension',
      };
    });
    return map;
  });

  // When assessment selector changes, reload marks
  const handleSelectAssessment = (asmId: string) => {
    setSelectedAssessmentId(asmId);
    const map: Record<string, { marks: number; grade: string; remarks: string }> = {};
    classStudents.forEach((st) => {
      const existing = assessmentMarks.find(
        (m) => m.assessmentId === asmId && m.studentId === st.id
      );
      map[st.id] = {
        marks: existing ? existing.marksObtained : 0,
        grade: existing ? existing.grade : 'B',
        remarks: existing ? existing.remarks : '',
      };
    });
    setMarksState(map);
    setFeedback(null);
  };

  const calculateGrade = (scored: number, max: number): string => {
    const percent = max > 0 ? (scored / max) * 100 : 0;
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B+';
    if (percent >= 60) return 'B';
    if (percent >= 50) return 'C';
    return 'D';
  };

  const handleMarkChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(val, activeAssessment.maxMarks));
    const grade = calculateGrade(clamped, activeAssessment.maxMarks);

    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        marks: clamped,
        grade,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { marks: 0, grade: 'B' }),
        remarks,
      },
    }));
  };

  const handleSave = (publishNow: boolean) => {
    const data = classStudents.map((st) => ({
      studentId: st.id,
      marksObtained: marksState[st.id]?.marks ?? 0,
      grade: marksState[st.id]?.grade || 'B',
      remarks: marksState[st.id]?.remarks || 'Reviewed by subject teacher',
    }));

    saveAssessmentMarks(activeAssessment.id, data, publishNow);
    setFeedback(
      publishNow
        ? `Official examination results published to students and parents with instant notification.`
        : `Assessment draft marks saved securely in educator ledger.`
    );
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCreateNewAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const subj = subjects.find((s) => s.id === newSubjectId);
    const newId = createAssessment({
      title: newTitle.trim(),
      type: newType,
      grade: '10',
      section: 'A',
      subjectId: newSubjectId,
      subjectName: subj?.name || 'Mathematics',
      date: newDate,
      maxMarks: Number(newMaxMarks),
      passingMarks: Number(newPassingMarks),
      weightagePercentage: 20,
      isPublished: false,
      createdByTeacherId: 'user-teacher-1',
    });

    setShowNewAsmModal(false);
    handleSelectAssessment(newId);
    setFeedback(`New assessment "${newTitle}" created in draft mode.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Class score metrics
  let totalClassMarks = 0;
  let highest = 0;
  classStudents.forEach((st) => {
    const m = marksState[st.id]?.marks || 0;
    totalClassMarks += m;
    if (m > highest) highest = m;
  });
  const classAvg = classStudents.length > 0 ? Math.round(totalClassMarks / classStudents.length) : 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Assessment & Grade Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter and validate student marks, maintain draft privacy, and publish official report records
            </p>
          </div>

          <button
            onClick={() => setShowNewAsmModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Test / Exam</span>
          </button>
        </div>

        {/* Assessment selector & status strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 grow">
            <label className="text-xs font-semibold text-slate-700 shrink-0">Assessment:</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => handleSelectAssessment(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 grow sm:grow-0"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.isPublished ? 'PUBLISHED' : 'DRAFT'}) — Max: {a.maxMarks}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeAssessment?.isPublished
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {activeAssessment?.isPublished ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visible to Parents & Students</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Private Educator Draft (Not Published)</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Class Analytics Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">Maximum Marks</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {activeAssessment?.maxMarks} Marks
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] text-blue-800 font-semibold block">Class Average</span>
            <span className="text-base font-bold text-blue-700 tabular-nums">
              {classAvg} / {activeAssessment?.maxMarks} ({Math.round((classAvg / (activeAssessment?.maxMarks || 1)) * 100)}%)
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-semibold block">Highest Score</span>
            <span className="text-base font-bold text-emerald-700 tabular-nums">
              {highest} / {activeAssessment?.maxMarks}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Marks Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Student Marks Ledger ({classStudents.length} Students)
          </span>
          <span className="text-[11px] text-slate-500">
            Real-time validation: Marks cannot exceed {activeAssessment?.maxMarks}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 w-16">Roll #</th>
                <th className="px-3 py-2">Student Name</th>
                <th className="px-3 py-2 text-center w-36">Marks Obtained</th>
                <th className="px-3 py-2 text-center w-20">Grade</th>
                <th className="px-3 py-2">Individual Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const currentData = marksState[st.id] || { marks: 0, grade: 'B', remarks: '' };

                return (
                  <tr key={st.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-mono font-bold text-slate-700">{st.rollNo}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-slate-900">{st.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Adm: {st.admissionNo}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={activeAssessment.maxMarks}
                          value={currentData.marks}
                          onChange={(e) => handleMarkChange(st.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs text-center font-bold font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                        />
                        <span className="text-slate-400 font-mono">/ {activeAssessment.maxMarks}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-blue-50 text-blue-700 font-mono">
                        {currentData.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        value={currentData.remarks}
                        onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                        placeholder="Add constructive feedback..."
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Publishing results instantly triggers push notifications to linked parents and students.
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Publish Official Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Assessment Modal */}
      {showNewAsmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Examination / Test</h3>
              <button onClick={() => setShowNewAsmModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAssessment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assessment Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unit Test 3: Quadratic Equations"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assessment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="unit_test">Unit Test</option>
                    <option value="midterm">Midterm Exam</option>
                    <option value="final">Final Exam</option>
                    <option value="assignment">Assignment / Project</option>
                    <option value="practical">Practical Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={newPassingMarks}
                    onChange={(e) => setNewPassingMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAsmModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
