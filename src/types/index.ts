export type UserRole = 'parent' | 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  linkedStudentIds?: string[]; // for parent
  assignedClassIds?: string[]; // for teacher: e.g. ['class-10-A', 'class-10-B']
  assignedSubjectIds?: string[]; // for teacher
  studentId?: string; // for student
  designation?: string; // for teacher
}

export interface StudentProfile {
  id: string;
  fullName: string;
  admissionNo: string;
  rollNo: string;
  grade: string; // e.g. '10'
  section: string; // e.g. 'A'
  academicYear: string; // e.g. '2026-2027'
  avatar: string;
  dob: string;
  bloodGroup: string;
  gender: 'Male' | 'Female' | 'Other';
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  hostelAllocated: boolean;
  busRoute?: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  session: 'full_day' | 'morning' | 'afternoon';
  remarks?: string;
  markedByTeacherId: string;
  markedByName: string;
  markedAt: string; // ISO string
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  documents?: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
  section: string;
  teacherId: string;
  teacherName: string;
  color: string;
  accentColor: string;
  totalChapters: number;
  completedChapters: number;
}

export interface TopicResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'slides';
  url: string;
  size?: string;
}

export interface SyllabusTopic {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  description: string;
  learningObjectives: string[];
  teacherNotes: string;
  resources: TopicResource[];
  practiceQuestions: { question: string; answerSummary: string }[];
  officialStatus: 'not_started' | 'in_progress' | 'completed'; // Teacher verified
  studentStatus?: Record<string, 'not_started' | 'in_progress' | 'completed'>; // Student reported
  plannedDate?: string;
  completedDate?: string;
  lastUpdated: string;
  orderIndex: number;
}

export interface SyllabusChapter {
  id: string;
  subjectId: string;
  unitNumber: number;
  chapterNumber: number;
  title: string;
  description: string;
  orderIndex: number;
  topics: SyllabusTopic[];
}

export interface TimetableSlot {
  id: string;
  grade: string;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string; // e.g. "08:30 AM"
  endTime: string;   // e.g. "09:15 AM"
  subjectId?: string;
  subjectName: string;
  teacherId?: string;
  teacherName?: string;
  roomNo: string;
  isBreak?: boolean;
  isLab?: boolean;
  isSubstituted?: boolean;
  substitutionNote?: string;
}

export type AssessmentType = 'midterm' | 'final' | 'unit_test' | 'assignment' | 'practical';

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  grade: string;
  section: string;
  subjectId: string;
  subjectName: string;
  date: string;
  maxMarks: number;
  passingMarks: number;
  weightagePercentage: number;
  isPublished: boolean; // Published to students/parents
  publishedAt?: string;
  createdByTeacherId: string;
}

export interface AssessmentMark {
  id: string;
  assessmentId: string;
  studentId: string;
  marksObtained: number;
  grade: string; // e.g. 'A+', 'A', 'B'
  remarks: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  grade: string;
  section: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  teacherId: string;
  teacherName: string;
  attachments?: { name: string; url: string; size: string }[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'late' | 'graded' | 'returned';
  fileName?: string;
  fileSize?: string;
  marksAwarded?: number;
  teacherFeedback?: string;
}

export interface FeeItem {
  name: string;
  amount: number;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  transactionRef: string;
  items: FeeItem[];
  status: 'success' | 'pending';
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  invoiceNo: string;
  academicYear: string;
  term: string; // e.g. 'Term 2 (2026-27)'
  tuitionFee: number;
  examFee: number;
  transportFee: number;
  hostelFee: number;
  labAndLibraryFee: number;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'failed' | 'overdue';
  receipts: FeeReceipt[];
}

export interface HostelDetails {
  studentId: string;
  hostelName: string;
  block: string;
  roomNo: string;
  bedNo: string;
  wardenName: string;
  wardenPhone: string;
  feeStatus: 'Paid' | 'Due';
  messType: 'Vegetarian' | 'Non-Vegetarian' | 'Special Diet';
  mealTimings: {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  };
  outpassHistory: {
    id: string;
    departureDate: string;
    returnDate: string;
    destination: string;
    status: 'Approved' | 'Returned' | 'Pending';
  }[];
  emergencyWardenContact: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRoles: UserRole[];
  date: string;
  priority: 'normal' | 'important' | 'urgent';
  author: string;
  category: 'academic' | 'event' | 'holiday' | 'hostel' | 'general';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  role: UserRole;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: 'attendance' | 'exam' | 'fee' | 'homework' | 'message' | 'announcement';
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  role: UserRole;
  details: string;
  timestamp: string;
}
