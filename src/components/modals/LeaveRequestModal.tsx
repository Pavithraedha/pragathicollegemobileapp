import React, { useState } from 'react';
import { X, Calendar, AlertCircle, FileText, Send } from 'lucide-react';
import { StudentProfile } from '../../types';

interface LeaveRequestModalProps {
  student: StudentProfile;
  onClose: () => void;
  onSubmit: (studentId: string, startDate: string, endDate: string, reason: string) => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  student,
  onClose,
  onSubmit,
}) => {
  const [startDate, setStartDate] = useState('2026-10-25');
  const [endDate, setEndDate] = useState('2026-10-26');
  const [reasonCategory, setReasonCategory] = useState<'Medical' | 'Family Function' | 'Urgent Personal'>('Medical');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }
    const fullReason = `${reasonCategory}: ${details.trim() || 'No additional remarks provided'}`;
    onSubmit(student.id, startDate, endDate, fullReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold">Apply for Student Leave</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-10 h-10 rounded-full object-cover border border-blue-200"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">{student.fullName}</div>
              <div className="text-[11px] text-slate-500">
                Grade {student.grade}-{student.section} · Roll No: {student.rollNo}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Reason Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Medical', 'Family Function', 'Urgent Personal'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setReasonCategory(cat)}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border text-center transition-colors ${
                    reasonCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Detailed Reason / Note to Teacher
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Doctor prescribed rest due to viral fever symptoms. Medical prescription can be presented on return."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <Calendar className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Official school records will reflect "Approved Leave" once reviewed by class teacher Mr. Rajesh Verma.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
