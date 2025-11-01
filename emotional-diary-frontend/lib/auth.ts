export interface User {
  id: string
  email: string
  name: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// URL base del microservicio de autenticación
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8081/api/v1/auth"

const DEMO_MODE = false // Cambiar a false para usar el backend real

export async function login(credentials: LoginCredentials): Promise<User> {
  // Modo demo: simular login exitoso
  if (DEMO_MODE) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoUser = {
      id: "demo-user-123",
      email: credentials.email,
      name: "Usuario Demo",
      token: "demo-token-xyz",
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", demoUser.token)
      localStorage.setItem("user", JSON.stringify(demoUser))
    }

    return demoUser
  }

  // Código original para backend real
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al iniciar sesión")
  }

  const data = await response.json()

  // Guardar token en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data))
  }

  return data
}

export async function register(data: RegisterData): Promise<User> {
  // Modo demo: simular registro exitoso
  if (DEMO_MODE) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoUser = {
      id: "demo-user-123",
      email: data.email,
      name: data.name,
      token: "demo-token-xyz",
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", demoUser.token)
      localStorage.setItem("user", JSON.stringify(demoUser))
    }

    return demoUser
  }

  // Código original para backend real
  const response = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al registrarse")
  }

  const userData = await response.json()

  // Guardar token en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("token", userData.token)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  return userData
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}
