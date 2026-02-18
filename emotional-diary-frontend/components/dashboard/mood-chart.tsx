"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  Dot,
} from "recharts"

interface MoodChartProps {
  data: Array<{
    date: string
    moodRating: number
  }>
}

const getMoodColor = (rating: number) => {
  if (rating >= 4) return "#22c55e" // Green 500
  if (rating >= 3) return "#facc15" // Yellow 400
  return "#ef4444" // Red 500
}

// @ts-ignore
const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload } = props
  if (payload && payload.moodRating !== undefined) {
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        stroke={getMoodColor(payload.moodRating)}
        strokeWidth={2}
        fill={"hsl(var(--background))"}
      />
    )
  }
  return null
}

export function MoodChart({ data }: MoodChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución del Humor</CardTitle>
        <CardDescription>Tu calificación de humor registrada en el periodo.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[1, 5]}
              tickFormatter={(value) => `${value} ★`}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 1000 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
            />
            <Legend verticalAlign="top" align="right" />
            <Line
              type="monotone"
              dataKey="moodRating"
              name="Humor (1-5)"
              stroke="url(#moodGradient)"
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}