import React from 'react';
import { X, Bell, CheckCircle2, Clock, CalendarCheck, Award, CreditCard, FileText } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { NotificationItem } from '../../types';

interface NotificationModalProps {
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  onClose,
  onNavigateTab,
}) => {
  const { notifications, currentRole, markNotificationRead } = useCampus();

  const roleNotifs = notifications.filter(
    (n) => n.role === currentRole || !n.role
  );

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'attendance':
        return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
      case 'exam':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'fee':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'homework':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#163B70] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-300" />
            <h3 className="text-sm font-semibold">Campus Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto space-y-2.5 grow">
          {roleNotifs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No recent notifications for your role.
            </div>
          ) : (
            roleNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.type === 'attendance') onNavigateTab('attendance');
                  else if (n.type === 'exam') onNavigateTab('academics');
                  else if (n.type === 'fee') onNavigateTab('fees');
                  else if (n.type === 'homework') onNavigateTab('subjects');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                  n.read
                    ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                    : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold">
                    {getIcon(n.type)}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] pl-6">{n.body}</p>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
