import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// JWT removed - no auth header
API.interceptors.request.use((config) => config);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");

// Students
export const getAllStudents = () => API.get("/students/all");
export const searchStudents = (q) => API.get(`/students/search?q=${q}`);
export const getStudentByRegNo = (regNo) => API.get(`/students/${regNo}`);
export const updateProfile = (data) => API.put("/students/profile", data);

// Achievements
export const addAchievement = (data) => API.post("/achievements", data);
export const getAchievements = (studentId) => API.get(`/achievements/${studentId}`);
export const getAllAchievements = () => API.get("/achievements/all");
export const deleteAchievement = (id) => API.delete(`/achievements/${id}`);

// Documents
export const uploadDocument = (data) => API.post("/documents/upload", data);
export const getMyDocuments = (studentId) => API.get(`/documents/by-id/${studentId}`);
export const getDocumentsByRegNo = (regNo) => API.get(`/documents/${regNo}`);
export const getAllDocuments = () => API.get("/documents/all");
export const verifyDocument = (id) => API.put(`/documents/verify/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// Stats
export const getStudentStats = (studentId) => API.get(`/stats/student?studentId=${studentId}`);
export const getAdminStats = () => API.get("/stats/admin");

// OCR
export const suggestActivityType = (data) => API.post("/ocr/suggest", data);

export default API;
