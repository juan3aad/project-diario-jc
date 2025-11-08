"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { Recommendation } from "@/lib/api"
import { Flame, Zap, Leaf } from "lucide-react"

interface RecommendationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recommendations: Recommendation[]
}

const priorityIcons = {
  high: <Flame className="w-5 h-5 text-red-500" />,
  medium: <Zap className="w-5 h-5 text-yellow-500" />,
  low: <Leaf className="w-5 h-5 text-green-500" />,
}

export function RecommendationsDialog({
  open,
  onOpenChange,
  recommendations,
}: RecommendationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recomendaciones para Ti</DialogTitle>
          <DialogDescription>
            Basado en tus últimas entradas, aquí tienes algunas sugerencias para mejorar tu bienestar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {recommendations.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {recommendations.map((rec) => (
                <AccordionItem key={rec.id} value={rec.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      {priorityIcons[rec.priority]}
                      <span className="text-left">{rec.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>{rec.description}</p>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground">
              No hay recomendaciones disponibles en este momento.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
