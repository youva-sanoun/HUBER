"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PomodoroTimerProps {
  workDuration?: number
  breakDuration?: number
}

export function PomodoroTimer({ workDuration = 25, breakDuration = 5 }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak)
      setTimeLeft(isBreak ? workDuration * 60 : breakDuration * 60)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration])

  const toggleTimer = () => setIsRunning(!isRunning)
  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(workDuration * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Card className="p-4 flex items-center space-x-4">
      <div className="text-2xl font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTimer}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        {isBreak ? 'Break time' : 'Focus time'}
      </div>
    </Card>
  )
}

