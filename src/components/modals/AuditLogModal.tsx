import React from 'react';
import { X, Shield, History, Clock } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogModalProps {
  logs: AuditLog[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#163B70] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold">Campus Security & System Audit Trail</h3>
              <p className="text-[11px] text-blue-200">Tamper-evident logs of official academic & financial actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 grow">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No audit records logged yet.</div>
          ) : (
            logs.map((log) => {
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs transition-colors hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formattedDate} {formattedTime}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-normal">{log.details}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <span>
                      Actor: <strong className="text-slate-700">{log.userName}</strong> ({log.role.toUpperCase()})
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {log.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Immutable Append-Only Audit Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
