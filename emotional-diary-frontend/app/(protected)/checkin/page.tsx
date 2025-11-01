"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { checkInApi, type CheckIn } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Smile, Brain, Moon, AlertCircle, CheckCircle } from "lucide-react"

export default function CheckInPage() {
  const [mood, setMood] = useState([5])
  const [stress, setStress] = useState([5])
  const [sleep, setSleep] = useState([7])
  const [concern, setConcern] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const checkInData: CheckIn = {
        userId: user.id,
        date: new Date().toISOString(),
        mood: mood[0],
        stress: stress[0],
        sleep: sleep[0],
        concern: concern.trim(),
      }

      await checkInApi.create(checkInData)

      setSubmitted(true)
      toast({
        title: "Check-in completado",
        description: "Tus datos han sido registrados exitosamente",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el check-in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check-in Completado</h2>
            <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Check-in Diario</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          Responde estas 4 preguntas para registrar tu estado actual
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Estado de ánimo */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Smile className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Estado de Ánimo</CardTitle>
                <CardDescription>¿Cómo te sientes hoy?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Muy mal</span>
              <span className="text-2xl font-bold text-primary">{mood[0]}/10</span>
              <span className="text-sm text-muted-foreground">Excelente</span>
            </div>
            <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} className="w-full" />
          </CardContent>
        </Card>

        {/* Nivel de estrés */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle>Nivel de Estrés</CardTitle>
                <CardDescription>¿Qué tan estresado te sientes?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Muy relajado</span>
              <span className="text-2xl font-bold text-accent">{stress[0]}/10</span>
              <span className="text-sm text-muted-foreground">Muy estresado</span>
            </div>
            <Slider value={stress} onValueChange={setStress} min={1} max={10} step={1} className="w-full" />
          </CardContent>
        </Card>

        {/* Horas de sueño */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle>Horas de Sueño</CardTitle>
                <CardDescription>¿Cuántas horas dormiste anoche?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">0 horas</span>
              <span className="text-2xl font-bold text-secondary">{sleep[0]}h</span>
              <span className="text-sm text-muted-foreground">12 horas</span>
            </div>
            <Slider value={sleep} onValueChange={setSleep} min={0} max={12} step={0.5} className="w-full" />
          </CardContent>
        </Card>

        {/* Preocupación principal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle>Preocupación Principal</CardTitle>
                <CardDescription>¿Qué te preocupa más hoy?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe brevemente tu principal preocupación del día..."
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Guardando..." : "Completar Check-in"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
