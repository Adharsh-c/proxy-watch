// Central mock data stores for the Smart Attendance & Proxy-Detection System.

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Comm.",
  "Mechanical",
  "Electrical",
];

export const YEARS = ["I Year", "II Year", "III Year", "IV Year"];
export const SECTIONS = ["A", "B", "C"];

export const SUBJECTS = [
  "Machine Learning",
  "Computer Networks",
  "Operating Systems",
  "Database Systems",
  "Data Structures",
];

export interface StudentRecord {
  id: string;
  registerNo: string;
  name: string;
  department: string;
  year: string;
  section: string;
  email: string;
  phone?: string;
  dob?: string;
  attendance: number;
  subject: string;
  status: "Active" | "At risk";
  capturedImages?: string[];
}

export const STUDENTS: StudentRecord[] = [
  {
    id: "s1",
    registerNo: "21CS001",
    name: "Ravi Teja",
    department: "Computer Science",
    year: "III Year",
    section: "A",
    email: "ravi.t@uni.edu",
    phone: "+91 98765 43210",
    dob: "2002-03-12",
    attendance: 99,
    subject: "Machine Learning",
    status: "Active",
  },
  {
    id: "s2",
    registerNo: "21CS002",
    name: "Sneha Reddy",
    department: "Computer Science",
    year: "III Year",
    section: "A",
    email: "sneha.r@uni.edu",
    phone: "+91 91234 56789",
    dob: "2002-07-04",
    attendance: 92,
    subject: "Machine Learning",
    status: "Active",
  },
  {
    id: "s3",
    registerNo: "21CS003",
    name: "Arjun Nair",
    department: "Computer Science",
    year: "III Year",
    section: "A",
    email: "arjun.n@uni.edu",
    phone: "+91 99876 54321",
    dob: "2002-09-18",
    attendance: 64,
    subject: "Machine Learning",
    status: "At risk",
  },
  {
    id: "s4",
    registerNo: "21CS004",
    name: "Priya Menon",
    department: "Computer Science",
    year: "III Year",
    section: "B",
    email: "priya.m@uni.edu",
    phone: "+91 98712 34567",
    dob: "2002-01-29",
    attendance: 88,
    subject: "Computer Networks",
    status: "Active",
  },
  {
    id: "s5",
    registerNo: "21CS005",
    name: "Karthik Iyer",
    department: "Computer Science",
    year: "III Year",
    section: "B",
    email: "karthik.i@uni.edu",
    phone: "+91 94652 71839",
    dob: "2002-12-05",
    attendance: 71,
    subject: "Database Systems",
    status: "At risk",
  },
  {
    id: "s6",
    registerNo: "21IT011",
    name: "Divya Pillai",
    department: "Information Technology",
    year: "II Year",
    section: "A",
    email: "divya.p@uni.edu",
    phone: "+91 92345 67890",
    dob: "2003-05-22",
    attendance: 95,
    subject: "Computer Networks",
    status: "Active",
  },
  {
    id: "s7",
    registerNo: "21IT012",
    name: "Mohan Das",
    department: "Information Technology",
    year: "II Year",
    section: "A",
    email: "mohan.d@uni.edu",
    phone: "+91 93581 24760",
    dob: "2003-08-11",
    attendance: 58,
    subject: "Operating Systems",
    status: "At risk",
  },
  {
    id: "s8",
    registerNo: "21IT013",
    name: "Lakshmi Rao",
    department: "Information Technology",
    year: "II Year",
    section: "C",
    email: "lakshmi.r@uni.edu",
    phone: "+91 96420 18375",
    dob: "2003-04-06",
    attendance: 81,
    subject: "Data Structures",
    status: "Active",
  },
  {
    id: "s9",
    registerNo: "21EC021",
    name: "Vikram Singh",
    department: "Electronics & Comm.",
    year: "IV Year",
    section: "A",
    email: "vikram.s@uni.edu",
    phone: "+91 94231 65874",
    dob: "2001-11-19",
    attendance: 73,
    subject: "Electronics & Comm.",
    status: "Active",
  },
  {
    id: "s10",
    registerNo: "21EC022",
    name: "Anjali Verma",
    department: "Electronics & Comm.",
    year: "IV Year",
    section: "B",
    email: "anjali.v@uni.edu",
    phone: "+91 98123 45678",
    dob: "2001-06-14",
    attendance: 90,
    subject: "Electronics & Comm.",
    status: "Active",
  },
];

export interface DetectedFace {
  faceId: string;
  name: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  coords: string;
  live: boolean;
  boxClass: string;
}

export const DETECTED_FACES: DetectedFace[] = [
  {
    faceId: "F-01",
    name: "Sneha Reddy",
    confidence: 0.99,
    box: { x: 4, y: 40, w: 11, h: 19 },
    coords: "(51,288)–(192,425)",
    live: true,
    boxClass: "detection-face-F-01",
  },
  {
    faceId: "F-02",
    name: "Ravi Teja",
    confidence: 0.98,
    box: { x: 25, y: 38, w: 11, h: 20 },
    coords: "(320,274)–(461,418)",
    live: true,
    boxClass: "detection-face-F-02",
  },
  {
    faceId: "F-03",
    name: "Priya Menon",
    confidence: 0.97,
    box: { x: 55, y: 43, w: 10, h: 19 },
    coords: "(704,310)–(832,447)",
    live: true,
    boxClass: "detection-face-F-03",
  },
  {
    faceId: "F-04",
    name: "Anjali Verma",
    confidence: 0.95,
    box: { x: 70, y: 40, w: 11, h: 20 },
    coords: "(896,288)–(1037,432)",
    live: true,
    boxClass: "detection-face-F-04",
  },
  {
    faceId: "F-05",
    name: "Karthik Iyer",
    confidence: 0.92,
    box: { x: 15, y: 36, w: 7, h: 13 },
    coords: "(192,259)–(282,353)",
    live: true,
    boxClass: "detection-face-F-05",
  },
  {
    faceId: "F-06",
    name: "Divya Pillai",
    confidence: 0.9,
    box: { x: 23, y: 37, w: 6, h: 12 },
    coords: "(294,266)–(371,353)",
    live: true,
    boxClass: "detection-face-F-06",
  },
  {
    faceId: "F-07",
    name: "Mohan Das",
    confidence: 0.58,
    box: { x: 31, y: 36, w: 6, h: 12 },
    coords: "(397,259)–(474,346)",
    live: false,
    boxClass: "detection-face-F-07",
  },
  {
    faceId: "F-08",
    name: "Lakshmi Rao",
    confidence: 0.93,
    box: { x: 40, y: 36, w: 6, h: 12 },
    coords: "(512,259)–(589,346)",
    live: true,
    boxClass: "detection-face-F-08",
  },
  {
    faceId: "F-09",
    name: "Vikram Singh",
    confidence: 0.89,
    box: { x: 49, y: 35, w: 6, h: 12 },
    coords: "(627,252)–(704,339)",
    live: true,
    boxClass: "detection-face-F-09",
  },
  {
    faceId: "F-10",
    name: "Arjun Nair",
    confidence: 0.94,
    box: { x: 63, y: 36, w: 6, h: 12 },
    coords: "(806,259)–(883,346)",
    live: true,
    boxClass: "detection-face-F-10",
  },
];

export interface LivenessFactor {
  label: string;
  score: number;
}

export const LIVENESS_FACTORS: LivenessFactor[] = [
  { label: "Blink Detection", score: 0.68 },
  { label: "Texture Analysis", score: 0.61 },
  { label: "Depth Estimation", score: 0.57 },
  { label: "Motion Tracking", score: 0.65 },
];

export interface SpoofSample {
  id: string;
  type: "PRINT" | "PHONE";
  subject: string;
  score: number;
}

export const SPOOF_SAMPLES: SpoofSample[] = [
  { id: "SP-01", type: "PRINT", subject: "Unknown @ Seat 14", score: 0.52 },
  { id: "SP-02", type: "PHONE", subject: "Unknown @ Seat 22", score: 0.58 },
];

export interface ProxyAlert {
  id: string;
  student: string;
  roomA: string;
  timeA: string;
  roomB: string;
  timeB: string;
  status: "active" | "resolved";
}

export const PROXY_ALERTS: ProxyAlert[] = [
  {
    id: "ALRT-001",
    student: "Ravi Teja",
    roomA: "Room A",
    timeA: "09:15 AM",
    roomB: "Room B",
    timeB: "09:16 AM",
    status: "active",
  },
  {
    id: "ALRT-002",
    student: "Mohan Das",
    roomA: "Lab 3",
    timeA: "10:02 AM",
    roomB: "Room C",
    timeB: "10:03 AM",
    status: "active",
  },
  {
    id: "ALRT-003",
    student: "Karthik Iyer",
    roomA: "Room B",
    timeA: "11:40 AM",
    roomB: "Auditorium",
    timeB: "11:41 AM",
    status: "resolved",
  },
];

export interface DbTable {
  name: string;
  records: number;
  sizeMb: number;
  health: "healthy" | "warning";
  lastUpdated: string;
}

export const DB_TABLES: DbTable[] = [
  {
    name: "Students",
    records: 1256,
    sizeMb: 18.4,
    health: "healthy",
    lastUpdated: "2026-06-25 11:12 AM",
  },
  {
    name: "Attendance",
    records: 45672,
    sizeMb: 312.7,
    health: "healthy",
    lastUpdated: "2026-06-26 12:07 PM",
  },
  {
    name: "Subjects",
    records: 86,
    sizeMb: 0.9,
    health: "healthy",
    lastUpdated: "2026-06-24 03:42 PM",
  },
  {
    name: "Faculty",
    records: 142,
    sizeMb: 2.1,
    health: "healthy",
    lastUpdated: "2026-06-26 09:30 AM",
  },
  {
    name: "Logs",
    records: 98341,
    sizeMb: 540.3,
    health: "warning",
    lastUpdated: "2026-06-26 01:15 PM",
  },
  {
    name: "Embeddings",
    records: 12560,
    sizeMb: 1024.8,
    health: "healthy",
    lastUpdated: "2026-06-25 08:00 PM",
  },
];

export interface DbTableRows {
  headers: string[];
  rows: Array<Record<string, string | number>>;
}

export const DB_TABLE_RECORDS: Record<string, DbTableRows> = {
  Students: {
    headers: ["Student ID", "Name", "Grade", "Status"],
    rows: [
      { "Student ID": "STU-001", Name: "Anya Sharma", Grade: "10", Status: "Active" },
      { "Student ID": "STU-002", Name: "Ravi Teja", Grade: "11", Status: "Inactive" },
      { "Student ID": "STU-003", Name: "Priya Singh", Grade: "12", Status: "Active" },
    ],
  },
  Attendance: {
    headers: ["Record ID", "Student", "Date", "Present"],
    rows: [
      { "Record ID": "ATT-101", Student: "Anya Sharma", Date: "2026-06-26", Present: "Yes" },
      { "Record ID": "ATT-102", Student: "Ravi Teja", Date: "2026-06-26", Present: "No" },
      { "Record ID": "ATT-103", Student: "Priya Singh", Date: "2026-06-26", Present: "Yes" },
    ],
  },
  Subjects: {
    headers: ["Subject ID", "Name", "Teacher", "Credits"],
    rows: [
      { "Subject ID": "SUB-01", Name: "Machine Learning", Teacher: "Dr. Rao", Credits: 4 },
      { "Subject ID": "SUB-02", Name: "Database Systems", Teacher: "Ms. Kapoor", Credits: 3 },
      { "Subject ID": "SUB-03", Name: "Data Structures", Teacher: "Mr. Patel", Credits: 3 },
    ],
  },
  Faculty: {
    headers: ["Faculty ID", "Name", "Department", "Status"],
    rows: [
      { "Faculty ID": "FAC-01", Name: "Dr. Rao", Department: "ML", Status: "Available" },
      { "Faculty ID": "FAC-02", Name: "Ms. Kapoor", Department: "DBMS", Status: "Busy" },
      { "Faculty ID": "FAC-03", Name: "Mr. Patel", Department: "DSA", Status: "Available" },
    ],
  },
  Logs: {
    headers: ["Log ID", "Event", "Timestamp", "Severity"],
    rows: [
      { "Log ID": "LG-9001", Event: "Backup completed", Timestamp: "2026-06-26 01:15 PM", Severity: "Info" },
      { "Log ID": "LG-9002", Event: "Failed login attempt", Timestamp: "2026-06-26 12:05 PM", Severity: "Warning" },
      { "Log ID": "LG-9003", Event: "Proxy alert created", Timestamp: "2026-06-26 11:22 AM", Severity: "Info" },
    ],
  },
  Embeddings: {
    headers: ["Embedding ID", "Source", "Dimension", "Size"],
    rows: [
      { "Embedding ID": "EMB-001", Source: "Students", Dimension: 512, Size: "4 KB" },
      { "Embedding ID": "EMB-002", Source: "Attendance", Dimension: 512, Size: "32 KB" },
      { "Embedding ID": "EMB-003", Source: "Logs", Dimension: 512, Size: "64 KB" },
    ],
  },
};

export const SUBJECT_DISTRIBUTION = [
  { subject: "ML", present: 112, absent: 16 },
  { subject: "Networks", present: 98, absent: 30 },
  { subject: "OS", present: 105, absent: 23 },
  { subject: "DBMS", present: 120, absent: 8 },
  { subject: "DSA", present: 90, absent: 38 },
];

export const MONTHLY_TREND = [
  { month: "Jan", attendance: 82 },
  { month: "Feb", attendance: 78 },
  { month: "Mar", attendance: 85 },
  { month: "Apr", attendance: 74 },
  { month: "May", attendance: 88 },
];

export const KPIS = {
  totalStudents: 128,
  presentToday: 98,
  absentToday: 30,
  overallAttendance: 78.45,
};

export const DEFAULTER_THRESHOLD = 75;
