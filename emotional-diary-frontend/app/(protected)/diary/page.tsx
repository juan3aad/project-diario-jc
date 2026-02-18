"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { diaryApi, type DiaryEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, BookOpen } from "lucide-react"
import { DiaryEntryCard } from "@/components/diary/diary-entry-card"
import { EntryFormDialog } from "@/components/diary/entry-form-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await diaryApi.getAll()
      setEntries(data.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las entradas del diario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewEntry = async (entry: DiaryEntry) => {
    try {
      const newEntry = await diaryApi.create(entry)
      setEntries([newEntry, ...entries])
      setDialogOpen(false)
      toast({
        title: "Entrada guardada",
        description: "Tu entrada ha sido guardada con análisis de sentimientos",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar la entrada",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Mi Diario</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Escribe tus pensamientos y recibe análisis de sentimientos
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay entradas aún</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Comienza a escribir tu primer entrada para llevar un registro de tus pensamientos
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Entrada
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <DiaryEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <EntryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleNewEntry} />
    </div>
  )
}
