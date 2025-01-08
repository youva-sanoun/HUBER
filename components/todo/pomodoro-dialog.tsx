"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PomodoroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workDuration: number
  breakDuration: number
  taskTitle: string
}

export function PomodoroDialog({
  open,
  onOpenChange,
  workDuration,
  breakDuration,
  taskTitle,
}: PomodoroDialogProps) {
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
      // Play notification sound
      new Audio('/notification.mp3').play().catch(() => {})
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="text-6xl font-mono tabular-nums">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-lg font-medium">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </div>
          <div className="flex gap-4">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

