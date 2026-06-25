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
  attendance: number;
}

export const STUDENTS: StudentRecord[] = [
  { id: "s1", registerNo: "21CS001", name: "Ravi Teja", department: "Computer Science", year: "III Year", section: "A", email: "ravi.t@uni.edu", attendance: 99 },
  { id: "s2", registerNo: "21CS002", name: "Sneha Reddy", department: "Computer Science", year: "III Year", section: "A", email: "sneha.r@uni.edu", attendance: 92 },
  { id: "s3", registerNo: "21CS003", name: "Arjun Nair", department: "Computer Science", year: "III Year", section: "A", email: "arjun.n@uni.edu", attendance: 64 },
  { id: "s4", registerNo: "21CS004", name: "Priya Menon", department: "Computer Science", year: "III Year", section: "B", email: "priya.m@uni.edu", attendance: 88 },
  { id: "s5", registerNo: "21CS005", name: "Karthik Iyer", department: "Computer Science", year: "III Year", section: "B", email: "karthik.i@uni.edu", attendance: 71 },
  { id: "s6", registerNo: "21IT011", name: "Divya Pillai", department: "Information Technology", year: "II Year", section: "A", email: "divya.p@uni.edu", attendance: 95 },
  { id: "s7", registerNo: "21IT012", name: "Mohan Das", department: "Information Technology", year: "II Year", section: "A", email: "mohan.d@uni.edu", attendance: 58 },
  { id: "s8", registerNo: "21IT013", name: "Lakshmi Rao", department: "Information Technology", year: "II Year", section: "C", email: "lakshmi.r@uni.edu", attendance: 81 },
  { id: "s9", registerNo: "21EC021", name: "Vikram Singh", department: "Electronics & Comm.", year: "IV Year", section: "A", email: "vikram.s@uni.edu", attendance: 73 },
  { id: "s10", registerNo: "21EC022", name: "Anjali Verma", department: "Electronics & Comm.", year: "IV Year", section: "B", email: "anjali.v@uni.edu", attendance: 90 },
];

export interface DetectedFace {
  faceId: string;
  name: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  coords: string;
  live: boolean;
}

// Boxes expressed as percentages of the 1280x720 canvas for responsive overlay,
// roughly aligned to faces in the simulated classroom feed (two rows).
export const DETECTED_FACES: DetectedFace[] = [
  // Front row (larger faces)
  { faceId: "F-01", name: "Sneha Reddy", confidence: 0.99, box: { x: 4, y: 40, w: 11, h: 19 }, coords: "(51,288)–(192,425)", live: true },
  { faceId: "F-02", name: "Ravi Teja", confidence: 0.98, box: { x: 25, y: 38, w: 11, h: 20 }, coords: "(320,274)–(461,418)", live: true },
  { faceId: "F-03", name: "Priya Menon", confidence: 0.97, box: { x: 55, y: 43, w: 10, h: 19 }, coords: "(704,310)–(832,447)", live: true },
  { faceId: "F-04", name: "Anjali Verma", confidence: 0.95, box: { x: 70, y: 40, w: 11, h: 20 }, coords: "(896,288)–(1037,432)", live: true },
  // Back row (smaller faces)
  { faceId: "F-05", name: "Karthik Iyer", confidence: 0.92, box: { x: 15, y: 36, w: 7, h: 13 }, coords: "(192,259)–(282,353)", live: true },
  { faceId: "F-06", name: "Divya Pillai", confidence: 0.9, box: { x: 23, y: 37, w: 6, h: 12 }, coords: "(294,266)–(371,353)", live: true },
  { faceId: "F-07", name: "Mohan Das", confidence: 0.58, box: { x: 31, y: 36, w: 6, h: 12 }, coords: "(397,259)–(474,346)", live: false },
  { faceId: "F-08", name: "Lakshmi Rao", confidence: 0.93, box: { x: 40, y: 36, w: 6, h: 12 }, coords: "(512,259)–(589,346)", live: true },
  { faceId: "F-09", name: "Vikram Singh", confidence: 0.89, box: { x: 49, y: 35, w: 6, h: 12 }, coords: "(627,252)–(704,339)", live: true },
  { faceId: "F-10", name: "Arjun Nair", confidence: 0.94, box: { x: 63, y: 36, w: 6, h: 12 }, coords: "(806,259)–(883,346)", live: true },
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
  { id: "ALRT-001", student: "Ravi Teja", roomA: "Room A", timeA: "09:15 AM", roomB: "Room B", timeB: "09:16 AM", status: "active" },
  { id: "ALRT-002", student: "Mohan Das", roomA: "Lab 3", timeA: "10:02 AM", roomB: "Room C", timeB: "10:03 AM", status: "active" },
  { id: "ALRT-003", student: "Karthik Iyer", roomA: "Room B", timeA: "11:40 AM", roomB: "Auditorium", timeB: "11:41 AM", status: "resolved" },
];

export interface DbTable {
  name: string;
  records: number;
  sizeMb: number;
  health: "healthy" | "warning";
}

export const DB_TABLES: DbTable[] = [
  { name: "Students", records: 1256, sizeMb: 18.4, health: "healthy" },
  { name: "Attendance", records: 45672, sizeMb: 312.7, health: "healthy" },
  { name: "Subjects", records: 86, sizeMb: 0.9, health: "healthy" },
  { name: "Faculty", records: 142, sizeMb: 2.1, health: "healthy" },
  { name: "Logs", records: 98341, sizeMb: 540.3, health: "warning" },
  { name: "Embeddings", records: 12560, sizeMb: 1024.8, health: "healthy" },
];

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
