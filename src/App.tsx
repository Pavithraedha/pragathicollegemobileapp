import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentAttendance } from './components/parent/ParentAttendance';
import { ParentAcademics } from './components/parent/ParentAcademics';
import { ParentFees } from './components/parent/ParentFees';
import { ParentHostel } from './components/parent/ParentHostel';
import { ParentTimetable } from './components/parent/ParentTimetable';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentSubjects } from './components/student/StudentSubjects';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentPerformance } from './components/student/StudentPerformance';
import { StudentHomework } from './components/student/StudentHomework';
import { StudentProfile } from './components/student/StudentProfile';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherAttendance } from './components/teacher/TeacherAttendance';
import { TeacherSyllabus } from './components/teacher/TeacherSyllabus';
import { TeacherGrading } from './components/teacher/TeacherGrading';
import { TeacherHomework } from './components/teacher/TeacherHomework';
import { TeacherClasses } from './components/teacher/TeacherClasses';
import { RazorpayPaymentModal } from './components/modals/RazorpayPaymentModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { LeaveRequestModal } from './components/modals/LeaveRequestModal';
import { AuditLogModal } from './components/modals/AuditLogModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { AuthScreens } from './components/auth/AuthScreens';
import { FeeInvoice, FeeReceipt } from './types';
import { ChevronLeft } from 'lucide-react';

const CampusApp: React.FC = () => {
  const {
    currentUser,
    currentRole,
    selectedChild,
    feeInvoices,
    auditLogs,
    submitLeaveRequest,
    processFeePayment,
    switchRole,
  } = useCampus();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [parentSubView, setParentSubView] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(undefined);

  // Modals state
  const [activePayInvoiceId, setActivePayInvoiceId] = useState<string | null>(null);
  const [activeReceiptData, setActiveReceiptData] = useState<{ receipt: FeeReceipt; invoice?: FeeInvoice } | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreens onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const invoiceToPay = feeInvoices.find((i) => i.id === activePayInvoiceId) || feeInvoices[0];

  // Render role screens
  const renderContent = () => {
    // 1. PARENT ROLE SCREENS
    if (currentRole === 'parent') {
      if (parentSubView === 'hostel') {
        return (
          <div className="space-y-3">
            <button
              onClick={() => setParentSubView(null)}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Parent Dashboard</span>
            </button>
            <ParentHostel />
          </div>
        );
      }

      if (parentSubView === 'timetable') {
        return (
          <div className="space-y-3">
            <button
              onClick={() => setParentSubView(null)}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Parent Dashboard</span>
            </button>
            <ParentTimetable />
          </div>
        );
      }

      switch (activeTab) {
        case 'home':
          return (
            <ParentDashboard
              onNavigateTab={(tab) => {
                setParentSubView(null);
                setActiveTab(tab);
              }}
              onOpenPayModal={(invId) => setActivePayInvoiceId(invId || feeInvoices[0]?.id)}
              onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              onSelectSubView={(view) => setParentSubView(view)}
            />
          );
        case 'attendance':
          return (
            <ParentAttendance onOpenLeaveModal={() => setIsLeaveModalOpen(true)} />
          );
        case 'academics':
          return <ParentAcademics />;
        case 'fees':
          return (
            <ParentFees
              onOpenPayModal={(invId) => setActivePayInvoiceId(invId)}
              onOpenReceiptModal={(receipt, invoice) =>
                setActiveReceiptData({ receipt, invoice })
              }
            />
          );
        case 'profile':
          return (
            <div className="space-y-4 pb-20">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono">
                      Verified Guardian Account
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser.phone}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Linked Wards / Children:</div>
                  <div>1. Rohan Sharma (Class 10-A, Roll #18)</div>
                  <div>2. Ananya Sharma (Class 7-B, Roll #04)</div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Switch Account / Logout
                  </button>
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    View System Audit Logs
                  </button>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <ParentDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPayModal={(invId) => setActivePayInvoiceId(invId || feeInvoices[0]?.id)}
              onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              onSelectSubView={(view) => setParentSubView(view)}
            />
          );
      }
    }

    // 2. STUDENT ROLE SCREENS
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'home':
          return (
            <StudentDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectSubject={(subId) => setSelectedSubjectId(subId)}
            />
          );
        case 'subjects':
          return <StudentSubjects initialSubjectId={selectedSubjectId} />;
        case 'timetable':
          return <StudentTimetable />;
        case 'performance':
          return <StudentPerformance />;
        case 'profile':
          return <StudentProfile />;
        default:
          return (
            <StudentDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectSubject={(subId) => setSelectedSubjectId(subId)}
            />
          );
      }
    }

    // 3. TEACHER ROLE SCREENS
    if (currentRole === 'teacher') {
      switch (activeTab) {
        case 'home':
          return <TeacherDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
        case 'classes':
          return <TeacherClasses />;
        case 'attendance':
          return <TeacherAttendance />;
        case 'academics':
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition-colors">
                <span className="font-semibold text-slate-500 dark:text-slate-400 pl-2">Educator Mode:</span>
                <button
                  onClick={() => setSelectedSubjectId('syllabus')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedSubjectId !== 'grading'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Syllabus & Topics Editor
                </button>
                <button
                  onClick={() => setSelectedSubjectId('grading')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedSubjectId === 'grading'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Marks Ledger & Publishing
                </button>
              </div>

              {selectedSubjectId === 'grading' ? (
                <TeacherGrading />
              ) : (
                <TeacherSyllabus />
              )}
            </div>
          );
        case 'profile':
          return (
            <div className="space-y-4 pb-20">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono">
                      Faculty Profile
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">HOD Mathematics & Class Teacher 10-A</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Primary Subject</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Advanced Mathematics</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Assigned Section</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Grade 10-A</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Department</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">STEM & Secondary Board</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Faculty ID</span>
                    <span className="font-semibold font-mono text-slate-800 dark:text-slate-100">PRAG-FAC-1988</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Switch Account / Logout
                  </button>
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    View System Audit Logs
                  </button>
                </div>
              </div>
            </div>
          );
        default:
          return <TeacherDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B132B] text-[#172033] dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Header */}
      <Header
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        onNavigateTab={(tab) => {
          setParentSubView(null);
          setActiveTab(tab);
        }}
        isMobileDeviceFrame={isMobileDeviceFrame}
        onToggleDeviceFrame={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
      />

      {/* Main Content Area */}
      <main className="grow py-4 px-3 sm:px-6">
        {isMobileDeviceFrame ? (
          // Mobile Smartphone Frame Mockup View
          <div className="max-w-[420px] mx-auto bg-slate-900 dark:bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 dark:border-slate-700 relative">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 dark:bg-slate-700 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-800 mr-2" />
              <div className="w-8 h-1 bg-slate-700 dark:bg-slate-600 rounded-full" />
            </div>

            {/* Phone Screen Canvas */}
            <div className="bg-[#F5F7FB] dark:bg-[#0B132B] rounded-[30px] p-3 overflow-y-auto max-h-[750px] relative transition-colors text-slate-900 dark:text-slate-100">
              {renderContent()}
            </div>
          </div>
        ) : (
          // Wide / Tablet / Desktop Canvas (Clean, spacious layout)
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        role={currentRole}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setParentSubView(null);
          setActiveTab(tab);
        }}
      />

      {/* Razorpay Online Payment Gateway Modal */}
      {activePayInvoiceId && invoiceToPay && (
        <RazorpayPaymentModal
          invoice={invoiceToPay}
          onClose={() => setActivePayInvoiceId(null)}
          onSuccess={(receipt) => {
            setActivePayInvoiceId(null);
            setActiveReceiptData({ receipt, invoice: invoiceToPay });
          }}
          processPayment={processFeePayment}
        />
      )}

      {/* Downloadable / Printable Receipt Modal */}
      {activeReceiptData && (
        <ReceiptModal
          receipt={activeReceiptData.receipt}
          invoice={activeReceiptData.invoice}
          onClose={() => setActiveReceiptData(null)}
        />
      )}

      {/* Parent Student Leave Request Modal */}
      {isLeaveModalOpen && (
        <LeaveRequestModal
          student={selectedChild}
          onClose={() => setIsLeaveModalOpen(false)}
          onSubmit={(studentId, start, end, reason) => {
            submitLeaveRequest(studentId, start, end, reason);
            setIsLeaveModalOpen(false);
          }}
        />
      )}

      {/* Immutable Audit Log Modal */}
      {isAuditModalOpen && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {/* Notifications Drawer / Modal */}
      {isNotifModalOpen && (
        <NotificationModal
          onClose={() => setIsNotifModalOpen(false)}
          onNavigateTab={(tab) => {
            setParentSubView(null);
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <CampusApp />
    </CampusProvider>
  );
}
