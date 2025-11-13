const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const initialHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const headers = new Headers(initialHeaders)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()

  }

  return response.json()
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiCall("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: any) =>
    apiCall("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => apiCall("/api/profile"),

  updateProfile: (data: any) =>
    apiCall("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  informStudents: (id : string) => console.log("test"),
  // Students
  getStudents: () => apiCall("/api/students"),

  getStudent: (id: string) => apiCall(`/api/students/${id}`),

  createStudent: (data: any) =>
    apiCall("/api/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStudent: (id: string, data: any) =>
    apiCall(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteStudent: (id: string) =>
    apiCall(`/api/students/${id}`, {
      method: "DELETE",
    }),

  // Teachers
  getTeachers: () => apiCall("/api/teachers"),

  getTeacher: (id: string) => apiCall(`/api/teachers/${id}`),

  createTeacher: (data: any) =>
    apiCall("/api/teachers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTeacher: (id: string, data: any) =>
    apiCall(`/api/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTeacher: (id: string) =>
    apiCall(`/api/teachers/${id}`, {
      method: "DELETE",
    }),

  // Courses
  getCourses: () => apiCall("/api/courses",{
    method: "GET",

  }),
  getCoursebyuser: () => apiCall("/api/courses/user",{
    method: "GET",

  }),
  getCourse: (id: string) => apiCall(`/api/courses/${id}`),

  createCourse: (data: any) =>
    apiCall("/api/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCourse: (id: string, data: any) =>
    apiCall(`/api/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: string) =>
    apiCall(`/api/courses/${id}`, {
      method: "DELETE",
    }),

  enrollCourse: (id: string) =>
    apiCall(`/api/courses/${id}/enroll`, {
      method: "POST",
    }),

  // Schedule
  getSchedules: () => apiCall("/api/schedule"),
  getSchedulesbyStudent: () => apiCall("/api/schedule/student"),
  getSchedule: (id: string) => apiCall(`/api/schedule/${id}`),

  createSchedule: (data: any) =>
    apiCall("/api/schedule", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSchedule: (id: string, data: any) =>
    apiCall(`/api/schedule/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSchedule: (id: string) =>
    apiCall(`/api/schedule/${id}`, {
      method: "DELETE",
    }),

  //getSchedulesByStudent: (studentId: string) => apiCall(`/api/schedule/student/${studentId}`),

  // Statistics
  getStatistics: () => apiCall("/api/statistics"),

  getDashboardStatistics: () => apiCall("/api/statistics/dashboard"),

  getEnrollmentStats: () => apiCall("/api/statistics/enrollment"),

  getCourseStats: () => apiCall("/api/statistics/courses"),

  getUserStats: () => apiCall("/api/statistics/users"),

  getGrowthStats: () => apiCall("/api/statistics/growth"),

  getActivityStats: () => apiCall("/api/statistics/activity"),
// Activities
  getActivities: (limit?: number, type?: string) => {
    const params = new URLSearchParams()
    if (limit) params.append("limit", limit.toString())
    if (type) params.append("type", type)
    return apiCall(`/api/activities${params.toString() ? "?" + params.toString() : ""}`)
  },

  markTeacherAbsence: (scheduleId: string) =>
    apiCall(`/api/schedule/${scheduleId}/teacher-absence`, {
      method: "POST",
    }),

  // Messages
  getMessages: (recipientId: string) => apiCall(`/api/messages/${recipientId}`),

  sendMessage: (recipientId: string, content: string) =>
    apiCall("/api/messages", {
      method: "POST",
      body: JSON.stringify({ recipientId, content }),
    }),

  getConversations: () => apiCall("/api/messages/conversations"),
}
