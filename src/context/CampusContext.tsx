import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  Subject,
  SyllabusChapter,
  SyllabusTopic,
  TimetableSlot,
  Assessment,
  AssessmentMark,
  Assignment,
  AssignmentSubmission,
  FeeInvoice,
  FeeReceipt,
  HostelDetails,
  Announcement,
  NotificationItem,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  AuditLog
} from '../types';
import {
  mockUsers,
  mockStudents,
  mockSubjects,
  mockChapters,
  mockTimetable,
  mockAttendanceRecords,
  mockLeaveRequests,
  mockAssessments,
  mockAssessmentMarks,
  mockAssignments,
  mockSubmissions,
  mockFeeInvoices,
  mockHostelDetails,
  mockAnnouncements,
  mockNotifications,
  mockAuditLogs,
} from '../data/mockData';

interface CampusContextType {
  currentUser: User;
  currentRole: UserRole;
  selectedChildId: string;
  selectedChild: StudentProfile;
  students: StudentProfile[];
  subjects: Subject[];
  chapters: SyllabusChapter[];
  timetable: TimetableSlot[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  assessments: Assessment[];
  assessmentMarks: AssessmentMark[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  feeInvoices: FeeInvoice[];
  hostelDetails: HostelDetails;
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  isDemoMode: boolean;
  switchRole: (role: UserRole) => void;
  switchChild: (studentId: string) => void;
  markAttendance: (
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    date: string,
    session?: 'full_day' | 'morning' | 'afternoon'
  ) => { success: boolean; message: string };
  submitLeaveRequest: (studentId: string, startDate: string, endDate: string, reason: string) => void;
  reviewLeaveRequest: (leaveId: string, status: 'approved' | 'rejected') => void;
  addSyllabusChapter: (subjectId: string, title: string, description: string) => void;
  addSyllabusTopic: (chapterId: string, topic: Omit<SyllabusTopic, 'id' | 'lastUpdated'>) => void;
  updateTopicOfficialStatus: (topicId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  updateTopicStudentStatus: (topicId: string, studentId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  createAssessment: (assessmentData: Omit<Assessment, 'id'>) => string;
  saveAssessmentMarks: (
    assessmentId: string,
    marksData: { studentId: string; marksObtained: number; grade: string; remarks: string }[],
    publishNow: boolean
  ) => void;
  createAssignment: (assignmentData: Omit<Assignment, 'id'>) => void;
  submitAssignment: (assignmentId: string, studentId: string, fileName: string, fileSize: string) => void;
  gradeSubmission: (submissionId: string, marksAwarded: number, teacherFeedback: string) => void;
  processFeePayment: (
    invoiceId: string,
    amount: number,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking',
    referenceId: string
  ) => FeeReceipt;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  markNotificationRead: (id: string) => void;
  resetToDemoDefaults: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const STORAGE_KEY = 'smart_campus_state_v1';

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or mockData
  const [currentUser, setCurrentUser] = useState<User>(() => mockUsers[0]); // default parent
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [selectedChildId, setSelectedChildId] = useState<string>('student-1');

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : mockStudents;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : mockSubjects;
  });

  const [chapters, setChapters] = useState<SyllabusChapter[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_chapters`);
    return saved ? JSON.parse(saved) : mockChapters;
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_timetable`);
    return saved ? JSON.parse(saved) : mockTimetable;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : mockAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leaves`);
    return saved ? JSON.parse(saved) : mockLeaveRequests;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assessments`);
    return saved ? JSON.parse(saved) : mockAssessments;
  });

  const [assessmentMarks, setAssessmentMarks] = useState<AssessmentMark[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marks`);
    return saved ? JSON.parse(saved) : mockAssessmentMarks;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : mockAssignments;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    return saved ? JSON.parse(saved) : mockSubmissions;
  });

  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : mockFeeInvoices;
  });

  const [hostelDetails, setHostelDetails] = useState<HostelDetails>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hostel`);
    return saved ? JSON.parse(saved) : mockHostelDetails;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : mockAnnouncements;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pragathi_theme_mode') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('pragathi_theme_mode', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_chapters`, JSON.stringify(chapters));
      localStorage.setItem(`${STORAGE_KEY}_timetable`, JSON.stringify(timetable));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
      localStorage.setItem(`${STORAGE_KEY}_leaves`, JSON.stringify(leaveRequests));
      localStorage.setItem(`${STORAGE_KEY}_assessments`, JSON.stringify(assessments));
      localStorage.setItem(`${STORAGE_KEY}_marks`, JSON.stringify(assessmentMarks));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(feeInvoices));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    } catch {
      // localStorage may fail in storage-restricted sandboxes
    }
  }, [
    students,
    subjects,
    chapters,
    timetable,
    attendanceRecords,
    leaveRequests,
    assessments,
    assessmentMarks,
    assignments,
    submissions,
    feeInvoices,
    announcements,
    notifications,
    auditLogs,
  ]);

  const selectedChild =
    students.find((s) => s.id === selectedChildId) ||
    students[0];

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'parent') {
      const parentUser = mockUsers.find((u) => u.role === 'parent')!;
      setCurrentUser(parentUser);
      setSelectedChildId('student-1');
    } else if (role === 'student') {
      const studentUser = mockUsers.find((u) => u.role === 'student')!;
      setCurrentUser(studentUser);
      setSelectedChildId('student-1');
    } else {
      const teacherUser = mockUsers.find((u) => u.role === 'teacher')!;
      setCurrentUser(teacherUser);
    }
  };

  const switchChild = (studentId: string) => {
    setSelectedChildId(studentId);
  };

  const appendAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      action,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentRole,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Attendance Management
  const markAttendance = (
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    date: string,
    session: 'full_day' | 'morning' | 'afternoon' = 'full_day'
  ) => {
    const timestamp = new Date().toISOString();
    let updatedCount = 0;
    let addedCount = 0;

    setAttendanceRecords((prev) => {
      const updated = [...prev];
      records.forEach((rec) => {
        const existingIdx = updated.findIndex(
          (a) => a.studentId === rec.studentId && a.date === date && a.session === session
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            status: rec.status,
            remarks: rec.remarks,
            markedByTeacherId: currentUser.id,
            markedByName: currentUser.name,
            markedAt: timestamp,
          };
          updatedCount++;
        } else {
          updated.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            studentId: rec.studentId,
            date,
            status: rec.status,
            session,
            remarks: rec.remarks,
            markedByTeacherId: currentUser.id,
            markedByName: currentUser.name,
            markedAt: timestamp,
          });
          addedCount++;
        }
      });
      return updated;
    });

    appendAudit(
      'ATTENDANCE_RECORDED',
      `Recorded attendance for date ${date} (${records.length} students processed: ${addedCount} created, ${updatedCount} updated)`
    );

    return {
      success: true,
      message: `Successfully saved attendance records for ${records.length} students on ${date}.`,
    };
  };

  // 2. Leave Request
  const submitLeaveRequest = (
    studentId: string,
    startDate: string,
    endDate: string,
    reason: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      studentId,
      studentName: student ? student.fullName : 'Student',
      parentId: currentUser.id,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newReq, ...prev]);

    // Send notification to teacher
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: 'teacher',
      title: 'New Leave Request',
      body: `Parent ${currentUser.name} submitted a leave application for ${student?.fullName || 'student'} (${startDate} to ${endDate}).`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'attendance',
    };
    setNotifications((prev) => [notif, ...prev]);

    appendAudit('LEAVE_REQUESTED', `Parent applied for student ${student?.fullName} leave from ${startDate} to ${endDate}.`);
  };

  const reviewLeaveRequest = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaveRequests((prev) =>
      prev.map((lr) => {
        if (lr.id === leaveId) {
          return {
            ...lr,
            status,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
          };
        }
        return lr;
      })
    );

    const req = leaveRequests.find((l) => l.id === leaveId);
    if (req) {
      // Notify parent
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        role: 'parent',
        title: `Leave Application ${status === 'approved' ? 'Approved' : 'Declined'}`,
        body: `Leave request for ${req.studentName} (${req.startDate} to ${req.endDate}) has been ${status} by ${currentUser.name}.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'attendance',
      };
      setNotifications((prev) => [notif, ...prev]);

      appendAudit(
        'LEAVE_REVIEWED',
        `Teacher ${currentUser.name} marked leave #${leaveId} as ${status.toUpperCase()} for ${req.studentName}.`
      );
    }
  };

  // 3. Syllabus Management
  const addSyllabusChapter = (subjectId: string, title: string, description: string) => {
    const newChapter: SyllabusChapter = {
      id: `chap-${Date.now()}`,
      subjectId,
      unitNumber: chapters.filter((c) => c.subjectId === subjectId).length + 1,
      chapterNumber: chapters.filter((c) => c.subjectId === subjectId).length + 1,
      title,
      description,
      orderIndex: chapters.length + 1,
      topics: [],
    };

    setChapters((prev) => [...prev, newChapter]);
    appendAudit('SYLLABUS_CHAPTER_CREATED', `Teacher created new chapter "${title}" for subject ${subjectId}`);
  };

  const addSyllabusTopic = (chapterId: string, topicData: Omit<SyllabusTopic, 'id' | 'lastUpdated'>) => {
    const newTopic: SyllabusTopic = {
      ...topicData,
      id: `top-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            topics: [...ch.topics, newTopic],
          };
        }
        return ch;
      })
    );

    appendAudit('SYLLABUS_TOPIC_CREATED', `Added topic "${topicData.title}" under chapter ${chapterId}`);
  };

  const updateTopicOfficialStatus = (
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    const dateStr = new Date().toISOString().split('T')[0];

    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        topics: ch.topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              officialStatus: status,
              completedDate: status === 'completed' ? dateStr : undefined,
              lastUpdated: dateStr,
            };
          }
          return t;
        }),
      }))
    );

    appendAudit('TOPIC_OFFICIAL_STATUS_UPDATED', `Teacher updated topic #${topicId} official syllabus progress to ${status}`);
  };

  const updateTopicStudentStatus = (
    topicId: string,
    studentId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        topics: ch.topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              studentStatus: {
                ...(t.studentStatus || {}),
                [studentId]: status,
              },
            };
          }
          return t;
        }),
      }))
    );
  };

  // 4. Assessment & Grading
  const createAssessment = (assessmentData: Omit<Assessment, 'id'>) => {
    const newId = `asm-${Date.now()}`;
    const newAsm: Assessment = {
      ...assessmentData,
      id: newId,
    };
    setAssessments((prev) => [newAsm, ...prev]);
    appendAudit('ASSESSMENT_CREATED', `Created new assessment: "${assessmentData.title}"`);
    return newId;
  };

  const saveAssessmentMarks = (
    assessmentId: string,
    marksData: { studentId: string; marksObtained: number; grade: string; remarks: string }[],
    publishNow: boolean
  ) => {
    const timestamp = new Date().toISOString();

    setAssessmentMarks((prev) => {
      const updated = [...prev];
      marksData.forEach((m) => {
        const idx = updated.findIndex((x) => x.assessmentId === assessmentId && x.studentId === m.studentId);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            marksObtained: m.marksObtained,
            grade: m.grade,
            remarks: m.remarks,
            updatedBy: currentUser.name,
            updatedAt: timestamp,
          };
        } else {
          updated.push({
            id: `mark-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            assessmentId,
            studentId: m.studentId,
            marksObtained: m.marksObtained,
            grade: m.grade,
            remarks: m.remarks,
            updatedBy: currentUser.name,
            updatedAt: timestamp,
          });
        }
      });
      return updated;
    });

    if (publishNow) {
      setAssessments((prev) =>
        prev.map((a) =>
          a.id === assessmentId
            ? { ...a, isPublished: true, publishedAt: timestamp }
            : a
        )
      );

      // Create notification for parents & students
      const asm = assessments.find((a) => a.id === assessmentId);
      const notifParent: NotificationItem = {
        id: `notif-${Date.now()}`,
        role: 'parent',
        title: 'New Examination Marks Published',
        body: `Grades for "${asm?.title || 'Assessment'}" have been officially released. You can now view subject performance.`,
        date: timestamp.split('T')[0],
        read: false,
        type: 'exam',
      };
      setNotifications((prev) => [notifParent, ...prev]);

      appendAudit('MARKS_PUBLISHED', `Published assessment results for "${asm?.title || assessmentId}" with ${marksData.length} records.`);
    } else {
      appendAudit('MARKS_SAVED_DRAFT', `Saved draft marks for assessment #${assessmentId}.`);
    }
  };

  // 5. Homework & Assignments
  const createAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...assignmentData,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);

    // Send notification to students
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: 'student',
      title: 'New Homework Assigned',
      body: `${assignmentData.subjectName}: "${assignmentData.title}" is due on ${assignmentData.dueDate}.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'homework',
    };
    setNotifications((prev) => [notif, ...prev]);

    appendAudit('ASSIGNMENT_CREATED', `Teacher created assignment "${assignmentData.title}" for ${assignmentData.grade}-${assignmentData.section}`);
  };

  const submitAssignment = (
    assignmentId: string,
    studentId: string,
    fileName: string,
    fileSize: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    const newSubm: AssignmentSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId,
      studentId,
      studentName: student?.fullName || 'Student',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      fileName,
      fileSize,
    };

    setSubmissions((prev) => {
      const filtered = prev.filter((s) => !(s.assignmentId === assignmentId && s.studentId === studentId));
      return [...filtered, newSubm];
    });

    appendAudit('ASSIGNMENT_SUBMITTED', `Student ${student?.fullName} uploaded submission "${fileName}"`);
  };

  const gradeSubmission = (
    submissionId: string,
    marksAwarded: number,
    teacherFeedback: string
  ) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'graded',
              marksAwarded,
              teacherFeedback,
            }
          : s
      )
    );
    appendAudit('ASSIGNMENT_GRADED', `Graded submission #${submissionId}: ${marksAwarded} marks awarded.`);
  };

  // 6. Fee Management & Payment Gateway Simulation (Razorpay)
  const processFeePayment = (
    invoiceId: string,
    amount: number,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking',
    referenceId: string
  ): FeeReceipt => {
    const invoice = feeInvoices.find((inv) => inv.id === invoiceId);
    const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt: FeeReceipt = {
      id: `rec-${Date.now()}`,
      receiptNo,
      paymentDate: new Date().toISOString().split('T')[0],
      amount,
      paymentMethod,
      transactionRef: referenceId || `TXN/${Math.floor(1000000000 + Math.random() * 9000000000)}/CONF`,
      items: [
        {
          name: `${invoice?.term || 'School Fees'} Payment Settlement`,
          amount,
        },
      ],
      status: 'success',
    };

    setFeeInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newAmountPaid = inv.amountPaid + amount;
          const newBalance = Math.max(0, inv.totalAmount - newAmountPaid);
          const newStatus = newBalance === 0 ? 'paid' : 'pending';
          return {
            ...inv,
            amountPaid: newAmountPaid,
            balanceAmount: newBalance,
            status: newStatus,
            receipts: [newReceipt, ...(inv.receipts || [])],
          };
        }
        return inv;
      })
    );

    // Add confirmation notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: 'parent',
      title: 'Fee Payment Verified & Received',
      body: `Payment of ₹${amount.toLocaleString('en-IN')} received with receipt #${receiptNo}. Thank you.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'fee',
    };
    setNotifications((prev) => [notif, ...prev]);

    appendAudit(
      'FEE_PAYMENT_PROCESSED',
      `Payment receipt #${receiptNo} generated for ₹${amount} via ${paymentMethod} (Ref: ${newReceipt.transactionRef}).`
    );

    return newReceipt;
  };

  // 7. Announcements
  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    appendAudit('ANNOUNCEMENT_POSTED', `Posted campus announcement: "${annData.title}"`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetToDemoDefaults = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    setStudents(mockStudents);
    setSubjects(mockSubjects);
    setChapters(mockChapters);
    setTimetable(mockTimetable);
    setAttendanceRecords(mockAttendanceRecords);
    setLeaveRequests(mockLeaveRequests);
    setAssessments(mockAssessments);
    setAssessmentMarks(mockAssessmentMarks);
    setAssignments(mockAssignments);
    setSubmissions(mockSubmissions);
    setFeeInvoices(mockFeeInvoices);
    setHostelDetails(mockHostelDetails);
    setAnnouncements(mockAnnouncements);
    setNotifications(mockNotifications);
    setAuditLogs(mockAuditLogs);
    switchRole('parent');
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        currentRole,
        selectedChildId,
        selectedChild,
        students,
        subjects,
        chapters,
        timetable,
        attendanceRecords,
        leaveRequests,
        assessments,
        assessmentMarks,
        assignments,
        submissions,
        feeInvoices,
        hostelDetails,
        announcements,
        notifications,
        auditLogs,
        isDemoMode: true,
        switchRole,
        switchChild,
        markAttendance,
        submitLeaveRequest,
        reviewLeaveRequest,
        addSyllabusChapter,
        addSyllabusTopic,
        updateTopicOfficialStatus,
        updateTopicStudentStatus,
        createAssessment,
        saveAssessmentMarks,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        processFeePayment,
        addAnnouncement,
        markNotificationRead,
        resetToDemoDefaults,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
