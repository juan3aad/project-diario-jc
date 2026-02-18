"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DiaryEntry } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Lightbulb, Moon, Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EntryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: DiaryEntry) => Promise<void>
  editingEntry?: DiaryEntry | null
}

const COMMON_CONCERNS = [
  "Trabajo",
  "Estudios",
  "Familia",
  "Relaciones",
  "Salud",
  "Economía",
  "Futuro",
  "Soledad",
  "Otra",
]

export function EntryFormDialog({ open, onOpenChange, onSave, editingEntry }: EntryFormDialogProps) {
  const [entryText, setEntryText] = useState("")
  const [moodRating, setMoodRating] = useState(3) // Default mood
  const [stressLevel, setStressLevel] = useState(5)
  const [sleepHours, setSleepHours] = useState(7)
  const [mainWorry, setMainWorry] = useState("")
  const [customConcern, setCustomConcern] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (editingEntry) {
      setEntryText(editingEntry.entryText)
      setMoodRating(editingEntry.moodRating || 3)
      setStressLevel(editingEntry.stressLevel || 5)
      setSleepHours(editingEntry.sleepHours || 7)
      setMainWorry(editingEntry.mainWorry || "")
      if (editingEntry.mainWorry && !COMMON_CONCERNS.includes(editingEntry.mainWorry)) {
        setMainWorry("Otra")
        setCustomConcern(editingEntry.mainWorry)
      }
    } else {
      setEntryText("")
      setMoodRating(3)
      setStressLevel(5)
      setSleepHours(7)
      setMainWorry("")
      setCustomConcern("")
    }
  }, [editingEntry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !entryText.trim()) return

    setLoading(true)

    try {
      const finalConcern = mainWorry === "Otra" ? customConcern : mainWorry

      const entry: DiaryEntry = {
        userId: user.id,
        entryText: entryText.trim(),
        moodRating,
        stressLevel,
        sleepHours,
        mainWorry: finalConcern,
      }

      await onSave(entry)
      setEntryText("")
      setMoodRating(3)
      setStressLevel(5)
      setSleepHours(7)
      setMainWorry("")
      setCustomConcern("")
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEntryText("")
    setMoodRating(3)
    setStressLevel(5)
    setSleepHours(7)
    setMainWorry("")
    setCustomConcern("")
    onOpenChange(false)
  }

  const getStressEmoji = (level: number) => {
    if (level <= 3) return "😊"
    if (level <= 6) return "😐"
    return "😰"
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return "text-secondary"
    if (level <= 6) return "text-accent"
    return "text-destructive"
  }

  const getMoodColor = (level: number) => {
    if (level <= 2) return "text-destructive"
    if (level <= 3) return "text-accent"
    return "text-primary"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Editar Entrada" : "Nueva Entrada"}</DialogTitle>
            <DialogDescription>
              {editingEntry
                ? "Modifica tu entrada del día. Solo puedes tener una entrada por día."
                : "Escribe tus pensamientos y sentimientos. El sistema analizará automáticamente el sentimiento de tu entrada."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* Campo de texto principal */}
            <div>
              <Label htmlFor="content" className="text-base font-medium mb-2 block">
                ¿Cómo te sientes hoy? 💭
              </Label>
              <Textarea
                id="content"
                placeholder="Escribe libremente sobre tus pensamientos y emociones..."
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                rows={8}
                className="resize-none"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="mood" className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Nivel de humor
                </Label>
                <div className={`text-3xl font-bold ${getMoodColor(moodRating)}`}>{moodRating}</div>
              </div>
              <Slider
                id="mood"
                min={1}
                max={5}
                step={1}
                value={[moodRating]}
                onValueChange={(value) => setMoodRating(value[0])}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">😞 Bajo (1)</span>
                <span className="flex items-center gap-1">😐 Medio (3)</span>
                <span className="flex items-center gap-1">😊 Alto (5)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="stress" className="text-base font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Nivel de estrés
                </Label>
                <div className={`text-3xl font-bold ${getStressColor(stressLevel)}`}>{stressLevel}</div>
              </div>
              <Slider
                id="stress"
                min={1}
                max={10}
                step={1}
                value={[stressLevel]}
                onValueChange={(value) => setStressLevel(value[0])}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">😊 Bajo (1)</span>
                <span className="flex items-center gap-1">😐 Medio (5)</span>
                <span className="flex items-center gap-1">😰 Alto (10)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sleep" className="text-base font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Horas de sueño
                </Label>
                <div className="text-2xl font-bold text-primary">{sleepHours}h</div>
              </div>
              <Slider
                id="sleep"
                min={0}
                max={12}
                step={0.5}
                value={[sleepHours]}
                onValueChange={(value) => setSleepHours(value[0])}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mainWorry" className="text-base font-medium">
                Preocupación principal
              </Label>
              <Select value={mainWorry} onValueChange={setMainWorry} disabled={loading}>
                <SelectTrigger id="mainWorry">
                  <SelectValue placeholder="Selecciona una preocupación" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_CONCERNS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {mainWorry === "Otra" && (
                <div className="space-y-2 animate-in fade-in-50 duration-200">
                  <Label htmlFor="customConcern" className="text-sm">
                    Especifica tu preocupación
                  </Label>
                  <Input
                    id="customConcern"
                    placeholder="Escribe tu preocupación..."
                    value={customConcern}
                    onChange={(e) => setCustomConcern(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}
            </div>

            <Alert>
              <p className="text-xs text-muted-foreground mt-2">
                {entryText.length} caracteres {entryText.length < 50 && "• Mínimo 50 caracteres"}
              </p>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Consejo:</strong> Escribir sobre tus emociones puede ayudarte a procesarlas mejor. Sé honesto
                contigo mismo y no te preocupes por la gramática o la estructura.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading || entryText.trim().length < 50 || !mainWorry || (mainWorry === "Otra" && !customConcern.trim())
              }
            >
              {loading ? "Guardando..." : editingEntry ? "💾 Actualizar Entrada" : "💾 Guardar Entrada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
