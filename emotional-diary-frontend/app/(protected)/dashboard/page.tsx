"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statsApi, diaryApi, type WeeklyStats, type DiaryEntry, type Recommendation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { StressChart } from "@/components/dashboard/stress-chart"
import { MoodChart } from "@/components/dashboard/mood-chart"
import { WorriesChart } from "@/components/dashboard/worries-chart"
import { SleepChart } from "@/components/dashboard/sleep-chart"
import { AlertBanner } from "@/components/dashboard/alert-banner"
import { RecommendationsDialog } from "@/components/dashboard/recommendations-dialog"
import {
  TrendingUp,
  TrendingDown,
  Moon,
  AlertCircle,
  Plus,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { DiaryEntryCard } from "@/components/diary/diary-entry-card"
import { EntryFormDialog } from "@/components/diary/entry-form-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { type DateRange } from "react-day-picker"

const ENTRIES_PER_PAGE = 5

export default function DashboardPage() {
  const [stats, setStats] = useState<WeeklyStats | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRecsDialogOpen, setIsRecsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [todayEntry, setTodayEntry] = useState<DiaryEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined)

  const filteredEntriesByDate = useMemo(() => {
    return entries.filter((entry) => {
      if (!dateRange?.from || !entry.entryDate) return false
      const entryDate = new Date(entry.entryDate)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to || dateRange.from)
      entryDate.setHours(0, 0, 0, 0)
      fromDate.setHours(0, 0, 0, 0)
      toDate.setHours(0, 0, 0, 0)
      return entryDate >= fromDate && entryDate <= toDate
    })
  }, [entries, dateRange])

  const finalFilteredEntries = useMemo(() => {
    if (!searchDate) return filteredEntriesByDate
    return filteredEntriesByDate.filter((entry) => {
      const entryDate = new Date(entry.entryDate!)
      return (
        entryDate.getDate() === searchDate.getDate() &&
        entryDate.getMonth() === searchDate.getMonth() &&
        entryDate.getFullYear() === searchDate.getFullYear()
      )
    })
  }, [searchDate, filteredEntriesByDate])

  const moodChartData = useMemo(() => {
    return filteredEntriesByDate.map((entry) => ({ date: entry.entryDate!, moodRating: entry.moodRating })).reverse()
  }, [filteredEntriesByDate])

  const worriesChartData = useMemo(() => {
    const worryCounts = filteredEntriesByDate.reduce((acc, entry) => {
      if (entry.mainWorry && entry.mainWorry.trim() !== "" && entry.mainWorry.toLowerCase() !== "ninguna") {
        acc[entry.mainWorry] = (acc[entry.mainWorry] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    return Object.entries(worryCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filteredEntriesByDate])

  const sleepChartData = useMemo(() => {
    return filteredEntriesByDate.map((entry) => ({ date: entry.entryDate!, sleepHours: entry.sleepHours || 0, stressLevel: entry.stressLevel || 0 })).reverse()
  }, [filteredEntriesByDate])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, entriesData, recsData] = await Promise.all([
        statsApi.getWeekly(), 
        diaryApi.getAll(),
        statsApi.getRecommendations()
      ])
      setStats(statsData)
      setRecommendations(recsData)
      const sortedEntries = entriesData.sort((a, b) => new Date(b.entryDate!).getTime() - new Date(a.entryDate!).getTime())
      setEntries(sortedEntries)
      const today = new Date()
      const todayEntryFound = sortedEntries.find((entry) => {
        const entryDate = new Date(entry.entryDate!)
        return (
          entryDate.getDate() === today.getDate() &&
          entryDate.getMonth() === today.getMonth() &&
          entryDate.getFullYear() === today.getFullYear()
        )
      })
      setTodayEntry(todayEntryFound || null)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar todos los datos del dashboard.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEntry = async (entry: DiaryEntry) => {
    try {
      if (editingEntry) {
        const updatedEntry = { ...entry, id: editingEntry.id }
        const savedEntry = await diaryApi.update(editingEntry.id!, updatedEntry)
        setEntries(entries.map((e) => (e.id === editingEntry.id ? savedEntry : e)))
        toast({ title: "Entrada actualizada", description: "Tu entrada ha sido actualizada exitosamente" })
      } else {
        const newEntry = await diaryApi.create(entry)
        setEntries([newEntry, ...entries])
        setTodayEntry(newEntry)
        toast({ title: "Entrada guardada", description: "Tu entrada ha sido guardada con análisis de sentimientos" })
      }
      setDialogOpen(false)
      setEditingEntry(null)
      await loadData()
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error al guardar la entrada", variant: "destructive" })
    }
  }

  const handleNewEntry = () => {
    if (todayEntry) { setEditingEntry(todayEntry) } else { setEditingEntry(null) }
    setDialogOpen(true)
  }

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setDialogOpen(true)
  }

  const clearDateFilter = () => {
    setSearchDate(undefined)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(finalFilteredEntries.length / ENTRIES_PER_PAGE)
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE
  const endIndex = startIndex + ENTRIES_PER_PAGE
  const paginatedEntries = finalFilteredEntries.slice(startIndex, endIndex)

  const goToNextPage = () => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1) } }
  const goToPreviousPage = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1) } }

  if (loading) { return <DashboardSkeleton /> }

  const stressDiff = stats ? stats.averageStress - stats.previousWeekStress : 0
  const stressTrend = stressDiff > 0 ? "up" : stressDiff < 0 ? "down" : "stable"

  return (
    <div className="space-y-6 pb-20">
      <AlertBanner />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Mi Diario Emocional</h1>
          <p className="text-muted-foreground mt-2 text-pretty">Resumen de tu bienestar y registro de pensamientos</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button onClick={handleNewEntry} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            {todayEntry ? "Editar Entrada de Hoy" : "Crear Nueva Entrada"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estrés Promedio</CardTitle>
            {stressTrend === "up" ? <TrendingUp className="h-4 w-4 text-destructive" /> : stressTrend === "down" ? <TrendingDown className="h-4 w-4 text-secondary" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageStress.toFixed(1) || "0.0"}/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stressDiff !== 0 ? `${stressDiff > 0 ? "+" : ""}${stressDiff.toFixed(1)} vs. semana anterior` : "Sin cambios vs. semana anterior"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas de Sueño</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageSleep.toFixed(1) || "0.0"}h</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio semanal</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preocupación Principal</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-balance leading-tight">{stats?.mainConcern || "Sin datos"}</div>
            <p className="text-xs text-muted-foreground mt-1">Tema más mencionado este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolución del Estrés</CardTitle>
            <CardDescription>Nivel de estrés en el periodo seleccionado</CardDescription>
          </CardHeader>
          <CardContent><StressChart data={stats?.stressHistory || []} /></CardContent>
        </Card>
        <SleepChart data={sleepChartData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MoodChart data={moodChartData} />
        <WorriesChart data={worriesChartData} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Mis Entradas</h2>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchDate ? format(searchDate, "PPP", { locale: es }) : "Buscar por fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={searchDate} onSelect={setSearchDate} locale={es} />
              </PopoverContent>
            </Popover>
            {searchDate && <Button variant="ghost" size="sm" onClick={clearDateFilter}>Limpiar</Button>}
          </div>
        </div>

        {paginatedEntries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay entradas para la fecha seleccionada</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Intenta buscar otra fecha o limpia el filtro.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedEntries.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} onEdit={handleEditEntry} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, paginatedEntries.length)} de {paginatedEntries.length} entradas
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-9">{page}</Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <RecommendationsDialog open={isRecsDialogOpen} onOpenChange={setIsRecsDialogOpen} recommendations={recommendations} />

      <Button
        onClick={() => setIsRecsDialogOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
        aria-label="Ver recomendaciones"
      >
        <Lightbulb className="h-8 w-8" />
      </Button>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32 md:col-span-2 lg:col-span-1" />
      </div>
      <Skeleton className="h-96" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}