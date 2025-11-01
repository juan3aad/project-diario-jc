import { getToken } from "./auth"
import { MOCK_WEEKLY_STATS, MOCK_DIARY_ENTRIES, MOCK_RECOMMENDATIONS, MOCK_STRESS_HISTORY } from "./mock-data"

const DIARY_API_URL = process.env.NEXT_PUBLIC_DIARY_API_URL || "http://localhost:8082/api/v1"
const DEMO_MODE = false // Activar modo demo para simular respuestas

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${DIARY_API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error en la solicitud" }))
    throw new Error(error.message || "Error en la solicitud")
  }

  return response.json()
}

// Tipos para el diary service
export interface CheckIn {
  id?: string
  userId: string
  date: string
  mood: number // 1-10
  stress: number // 1-10
  sleep: number // horas
  concern: string
  createdAt?: string
}

export interface DiaryEntry {
  id?: string
  userId: string
  entryText: string
  moodRating: number
  stressLevel?: number // 1-10
  sleepHours?: number // 0-12
  mainWorry?: string
  aiEmotion?: string
  aiIntensity?: number
  aiSummary?: string
  createdAt?: string
}

export interface WeeklyStats {
  averageStress: number
  previousWeekStress: number
  mainConcern: string
  averageSleep: number
  stressHistory: Array<{ date: string; stress: number }>
}

export interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "high" | "medium" | "low"
}

async function simulateNetworkDelay() {
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))
}

// API functions
export const checkInApi = {
  create: async (data: CheckIn) => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return {
        ...data,
        id: `checkin-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
    }
    return apiRequest<CheckIn>("/checkins", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getAll: async () => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return MOCK_STRESS_HISTORY.map((item, index) => ({
        id: `checkin-${index}`,
        userId: "demo-user-123",
        date: item.date,
        mood: item.mood,
        stress: item.stress,
        sleep: item.sleep,
        concern: item.concern,
        createdAt: `${item.date}T12:00:00Z`,
      }))
    }
    return apiRequest<CheckIn[]>("/checkins")
  },

  getById: async (id: string) => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      const item = MOCK_STRESS_HISTORY[0]
      return {
        id,
        userId: "demo-user-123",
        date: item.date,
        mood: item.mood,
        stress: item.stress,
        sleep: item.sleep,
        concern: item.concern,
        createdAt: `${item.date}T12:00:00Z`,
      }
    }
    return apiRequest<CheckIn>(`/checkins/${id}`)
  },
}

export const diaryApi = {
  create: async (data: DiaryEntry) => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      // Simular análisis de sentimientos básico
      const content = data.content.toLowerCase()
      let sentiment = "neutral"
      let sentimentScore = 0

      if (
        content.includes("feliz") ||
        content.includes("bien") ||
        content.includes("genial") ||
        content.includes("increíble") ||
        content.includes("alegre") ||
        content.includes("contento")
      ) {
        sentiment = "positive"
        sentimentScore = 0.7 + Math.random() * 0.3
      } else if (
        content.includes("triste") ||
        content.includes("mal") ||
        content.includes("difícil") ||
        content.includes("abrumado") ||
        content.includes("deprimido") ||
        content.includes("ansioso")
      ) {
        sentiment = "negative"
        sentimentScore = -(0.4 + Math.random() * 0.4)
      } else {
        sentimentScore = -0.2 + Math.random() * 0.4
      }

      const keywords: string[] = []
      if (content.includes("trabajo")) keywords.push("trabajo")
      if (content.includes("familia")) keywords.push("familia")
      if (content.includes("salud")) keywords.push("salud")
      if (content.includes("estrés") || content.includes("estres")) keywords.push("estrés")
      if (content.includes("sueño")) keywords.push("sueño")

      return {
        ...data,
        id: `diary-${Date.now()}`,
        sentiment,
        sentimentScore,
        keywords: keywords.length > 0 ? keywords : undefined,
        createdAt: new Date().toISOString(),
      }
    }
    return apiRequest<DiaryEntry>("/diary", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: DiaryEntry) => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      const content = data.content.toLowerCase()
      let sentiment = "neutral"
      let sentimentScore = 0

      if (
        content.includes("feliz") ||
        content.includes("bien") ||
        content.includes("genial") ||
        content.includes("increíble")
      ) {
        sentiment = "positive"
        sentimentScore = 0.7 + Math.random() * 0.3
      } else if (
        content.includes("triste") ||
        content.includes("mal") ||
        content.includes("difícil") ||
        content.includes("abrumado")
      ) {
        sentiment = "negative"
        sentimentScore = -(0.4 + Math.random() * 0.4)
      } else {
        sentimentScore = -0.2 + Math.random() * 0.4
      }

      const keywords: string[] = []
      if (content.includes("trabajo")) keywords.push("trabajo")
      if (content.includes("familia")) keywords.push("familia")
      if (content.includes("salud")) keywords.push("salud")
      if (content.includes("estrés") || content.includes("estres")) keywords.push("estrés")
      if (content.includes("sueño")) keywords.push("sueño")

      return {
        ...data,
        id,
        sentiment,
        sentimentScore,
        keywords: keywords.length > 0 ? keywords : undefined,
        createdAt: new Date().toISOString(),
      }
    }
    return apiRequest<DiaryEntry>(`/diary/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  getAll: async () => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return MOCK_DIARY_ENTRIES
    }
    return apiRequest<DiaryEntry[]>("/diary")
  },

  getById: async (id: string) => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return MOCK_DIARY_ENTRIES.find((entry) => entry.id === id) || MOCK_DIARY_ENTRIES[0]
    }
    return apiRequest<DiaryEntry>(`/diary/${id}`)
  },
}

export const statsApi = {
  getWeekly: async () => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return MOCK_WEEKLY_STATS
    }
    return apiRequest<WeeklyStats>("/stats/weekly")
  },

  getRecommendations: async () => {
    if (DEMO_MODE) {
      await simulateNetworkDelay()
      return MOCK_RECOMMENDATIONS
    }
    return apiRequest<Recommendation[]>("/recommendations")
  },
}
