// Datos de demostración para visualizar la aplicación sin backend

export const MOCK_USER = {
  id: "demo-user-123",
  email: "demo@mindwell.com",
  name: "Usuario Demo",
  token: "demo-token-xyz",
}

export const MOCK_STRESS_HISTORY = [
  { date: "2025-01-05", stress: 6, mood: 6, sleep: 7, concern: "Trabajo" },
  { date: "2025-01-06", stress: 7, mood: 5, sleep: 6, concern: "Trabajo" },
  { date: "2025-01-07", stress: 8, mood: 4, sleep: 5, concern: "Economía" },
  { date: "2025-01-08", stress: 7, mood: 5, sleep: 6, concern: "Trabajo" },
  { date: "2025-01-09", stress: 5, mood: 7, sleep: 7, concern: "Salud" },
  { date: "2025-01-10", stress: 4, mood: 8, sleep: 8, concern: "Ninguna" },
  { date: "2025-01-11", stress: 3, mood: 8, sleep: 8, concern: "Ninguna" },
]

export const MOCK_WEEKLY_STATS = {
  averageStress: 5.7,
  previousWeekStress: 6.8,
  averageSleep: 6.7,
  mainConcern: "Trabajo",
  stressHistory: MOCK_STRESS_HISTORY,
}

export const MOCK_DIARY_ENTRIES = [
  {
    id: "1",
    userId: "demo-user-123",
    date: "2025-01-11T20:30:00Z",
    content:
      "Hoy fue un día increíble. Me desperté temprano, hice ejercicio y me sentí con mucha energía durante todo el día. Logré completar todas mis tareas pendientes y tuve tiempo para leer un poco antes de dormir.",
    stressLevel: 3,
    sleepHours: 8,
    concern: "Ninguna",
    sentiment: "positive" as const,
    sentimentScore: 0.85,
    keywords: ["energía", "ejercicio", "productividad"],
    createdAt: "2025-01-11T20:30:00Z",
  },
  {
    id: "2",
    userId: "demo-user-123",
    date: "2025-01-10T19:15:00Z",
    content:
      "Día tranquilo en general. Trabajé desde casa y pude avanzar bastante en mis proyectos. Me tomé descansos regulares y salí a caminar un poco. Me siento satisfecho con lo que logré.",
    stressLevel: 4,
    sleepHours: 8,
    concern: "Trabajo",
    sentiment: "positive" as const,
    sentimentScore: 0.65,
    keywords: ["trabajo", "productividad"],
    createdAt: "2025-01-10T19:15:00Z",
  },
  {
    id: "3",
    userId: "demo-user-123",
    date: "2025-01-09T22:00:00Z",
    content: "Hoy estoy feliz porque compre mi carro. Es un logro importante para mí y me da mucha libertad.",
    stressLevel: 2,
    sleepHours: 7,
    concern: "Ninguna",
    sentiment: "positive" as const,
    sentimentScore: 0.9,
    keywords: ["carro", "logro", "feliz"],
    createdAt: "2025-01-09T22:00:00Z",
  },
  {
    id: "4",
    userId: "demo-user-123",
    date: "2025-01-08T21:45:00Z",
    content:
      "Hoy fue un día difícil. Tuve muchas reuniones y me sentí abrumado con la cantidad de trabajo. No dormí bien anoche y eso afectó mi concentración. Espero que mañana sea mejor.",
    stressLevel: 8,
    sleepHours: 5,
    concern: "Trabajo",
    sentiment: "negative" as const,
    sentimentScore: -0.45,
    keywords: ["trabajo", "estrés", "sueño"],
    createdAt: "2025-01-08T21:45:00Z",
  },
  {
    id: "5",
    userId: "demo-user-123",
    date: "2025-01-07T18:30:00Z",
    content:
      "Me siento un poco ansioso por la presentación de mañana. He estado preparándome pero no sé si será suficiente. Necesito descansar bien esta noche.",
    stressLevel: 7,
    sleepHours: 6,
    concern: "Trabajo",
    sentiment: "negative" as const,
    sentimentScore: -0.3,
    keywords: ["ansiedad", "trabajo", "presentación"],
    createdAt: "2025-01-07T18:30:00Z",
  },
  {
    id: "6",
    userId: "demo-user-123",
    date: "2025-01-06T18:20:00Z",
    content:
      "Día regular. Nada especial que destacar. Cumplí con mis responsabilidades pero no me sentí particularmente motivado. Necesito encontrar algo que me inspire.",
    stressLevel: 5,
    sleepHours: 7,
    concern: "Futuro",
    sentiment: "neutral" as const,
    sentimentScore: 0.1,
    keywords: ["motivación"],
    createdAt: "2025-01-06T18:20:00Z",
  },
  {
    id: "7",
    userId: "demo-user-123",
    date: "2025-01-05T20:00:00Z",
    content:
      "Hoy tuve una conversación importante con mi familia. Me ayudó a aclarar algunas cosas que me preocupaban. Me siento más tranquilo ahora.",
    stressLevel: 4,
    sleepHours: 7,
    concern: "Familia",
    sentiment: "positive" as const,
    sentimentScore: 0.5,
    keywords: ["familia", "conversación"],
    createdAt: "2025-01-05T20:00:00Z",
  },
  {
    id: "8",
    userId: "demo-user-123",
    date: "2025-01-04T19:45:00Z",
    content:
      "Estoy preocupado por mi salud últimamente. He estado sintiendo algunos dolores y no sé si debería ir al médico. Tal vez solo sea estrés.",
    stressLevel: 6,
    sleepHours: 6,
    concern: "Salud",
    sentiment: "negative" as const,
    sentimentScore: -0.4,
    keywords: ["salud", "preocupación"],
    createdAt: "2025-01-04T19:45:00Z",
  },
]

export const MOCK_RECOMMENDATIONS = [
  {
    id: "1",
    title: "Practica la respiración profunda",
    description:
      "Tus niveles de estrés han estado elevados. Intenta hacer 5 minutos de respiración profunda cada mañana.",
    category: "stress",
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Mejora tu rutina de sueño",
    description: "Has dormido menos de 7 horas en promedio. Intenta acostarte 30 minutos más temprano esta semana.",
    category: "sleep",
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Actividad física regular",
    description: "El ejercicio puede ayudar a reducir el estrés. Intenta caminar 20 minutos al día.",
    category: "exercise",
    priority: "medium" as const,
  },
  {
    id: "4",
    title: "Tiempo para ti",
    description: "Dedica al menos 15 minutos diarios a una actividad que disfrutes sin distracciones.",
    category: "selfcare",
    priority: "low" as const,
  },
]

export const MOCK_ALERT = {
  show: true,
  message: "Has registrado niveles altos de estrés durante 3 días consecutivos. Considera tomar un descanso.",
  severity: "warning" as const,
}
