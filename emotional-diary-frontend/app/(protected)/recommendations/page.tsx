"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statsApi, type Recommendation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const data = await statsApi.getRecommendations()
      setRecommendations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las recomendaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "info":
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getVariant = (type: string): "default" | "destructive" => {
    switch (type) {
      case "warning":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Recomendaciones</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          Sugerencias personalizadas basadas en tu actividad y estado de bienestar
        </p>
      </div>

      {/* Información sobre el sistema */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Sistema de Recomendaciones Inteligente</CardTitle>
              <CardDescription>Basado en tus patrones de comportamiento y bienestar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
              <span>Alertas automáticas si detectamos 3 días consecutivos con estrés mayor a 7</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
              <span>Recomendaciones personalizadas basadas en tus patrones de sueño y estado de ánimo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
              <span>Sugerencias de actividades y técnicas de manejo del estrés</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay recomendaciones aún</h3>
            <p className="text-sm text-muted-foreground text-center">
              Completa tus check-ins diarios para recibir recomendaciones personalizadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Alert key={rec.id} variant={getVariant(rec.type)}>
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getIcon(rec.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <AlertTitle className="text-balance">{rec.title}</AlertTitle>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {new Date(rec.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Badge>
                  </div>
                  <AlertDescription className="text-pretty">{rec.message}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Recomendaciones generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Consejos Generales de Bienestar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">Técnica de Respiración 4-7-8</h4>
              <p className="text-sm text-muted-foreground">
                Inhala por 4 segundos, mantén por 7, exhala por 8. Repite 4 veces para reducir el estrés.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">Higiene del Sueño</h4>
              <p className="text-sm text-muted-foreground">
                Mantén un horario regular, evita pantallas 1 hora antes de dormir y crea un ambiente oscuro y fresco.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">Actividad Física</h4>
              <p className="text-sm text-muted-foreground">
                30 minutos de ejercicio moderado al día pueden mejorar significativamente tu estado de ánimo.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">Mindfulness</h4>
              <p className="text-sm text-muted-foreground">
                Dedica 10 minutos diarios a la meditación o atención plena para reducir la ansiedad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
