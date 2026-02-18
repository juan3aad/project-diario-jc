"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { statsApi, type Recommendation } from "@/lib/api"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlertBanner() {
  const [alerts, setAlerts] = useState<Recommendation[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const recommendations = await statsApi.getRecommendations()
      const warningAlerts = recommendations.filter((rec) => rec.type === "warning")
      setAlerts(warningAlerts)
    } catch (error) {
      // Silently fail - alerts are not critical
    }
  }

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id))
  }

  const visibleAlerts = alerts.filter((alert) => !dismissed.has(alert.id))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-balance">{alert.title}</AlertTitle>
          <AlertDescription className="text-pretty">{alert.message}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => handleDismiss(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  )
}
