"use client"

import { useEffect, useState } from "react"
import { X, Clock, Server, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoadingModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
}

export function LoadingModal({ isOpen, onClose, projectName }: LoadingModalProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setTimeElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Processing Request</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {projectName} is starting up...
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-lg font-semibold text-blue-700 dark:text-blue-300">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 dark:text-amber-400 text-sm">⏱️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  First Response May Take Time
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  This may take <strong>50 seconds to 5 minutes</strong> to provide you with a response because this is
                  a non-profit personal project deployed on free services like Render.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 dark:text-gray-400 text-sm">💤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Service Auto-Sleep</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  The service automatically shuts down after 15 minutes of inactivity to save resources.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                  Subsequent Requests Are Fast
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                  I assure you that your second response will be quick once the service is warmed up!
                </p>
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Processing your request...</span>
          </div>

          {/* Dismiss Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Continue in Background
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
