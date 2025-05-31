"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Camera, Upload, Video, Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
// import { ThemeToggle } from "@/components/theme-toggle"
import Webcam from "react-webcam"
import { LoadingModal } from "@/components/loading-modal"

const BACKEND_URL = process.env.NEXT_PUBLIC_AI_VISION_STUDIO_BACKEND_URL || "http://localhost:8000"

export default function AIVisionStudioPage() {
  const webcamRef = useRef(null)
  const [mode, setMode] = useState("realtime") // "realtime", "upload", "capture"
  const [description, setDescription] = useState("")
  const [detailedDescription, setDetailedDescription] = useState("")
  const [loadingDescription, setLoadingDescription] = useState(false)
  const [loadingDetailed, setLoadingDetailed] = useState(false)
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [lastDescribedImage, setLastDescribedImage] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [showRecapture, setShowRecapture] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [isCountdownActive, setIsCountdownActive] = useState(false)
  const INTERVAL_MS = 15000
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const dataURLtoBlob = (dataUrl) => {
    const [header, base64] = dataUrl.split(",")
    const mime = header.match(/:(.*?);/)[1]
    const binary = atob(base64)
    let length = binary.length
    const array = new Uint8Array(length)
    while (length--) array[length] = binary.charCodeAt(length)
    return new Blob([array], { type: mime })
  }

  // Realtime: capture + describe image
  const captureAndDescribe = async () => {
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return
    setCapturedImage(imageSrc)
    setShowRecapture(true)
    const blob = dataURLtoBlob(imageSrc)
    await sendImageForDescription(blob)
  }

  // Send image for basic description
  const sendImageForDescription = async (file) => {
    setLoadingDescription(true)
    setDescription("")
    setAnswer("")
    setDetailedDescription("")
    setLastDescribedImage(file)
    setShowLoadingModal(true) // Show the modal

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${BACKEND_URL}/image/describe`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setDescription(data.description || "No description received.")
    } catch (error) {
      setDescription("Error fetching description.")
    } finally {
      setLoadingDescription(false)
      setShowLoadingModal(false) // Hide the modal
    }
  }

  // Send image for detailed description
  const sendImageForDetailedDescription = async () => {
    if (!lastDescribedImage) {
      alert("No image available. Please capture or upload one first.")
      return
    }
    setLoadingDetailed(true)
    setDetailedDescription("")
    setShowLoadingModal(true) // Show the modal

    const formData = new FormData()
    formData.append("file", lastDescribedImage)

    try {
      const res = await fetch(`${BACKEND_URL}/image/details`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setDetailedDescription(data.detailed_description || "No detailed description received.")
    } catch (error) {
      setDetailedDescription("Error fetching detailed description.")
    } finally {
      setLoadingDetailed(false)
      setShowLoadingModal(false) // Hide the modal
    }
  }

  // Ask a question about the last described image
  const sendImageQuestion = async () => {
    if (!question) {
      alert("Please enter a question.")
      return
    }
    if (!lastDescribedImage) {
      alert("No image available. Please capture or upload one first.")
      return
    }
    setLoadingQuestion(true)
    setAnswer("")
    setShowLoadingModal(true) // Show the modal

    const formData = new FormData()
    formData.append("file", lastDescribedImage)
    formData.append("question", question)

    try {
      const res = await fetch(`${BACKEND_URL}/image/question`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setAnswer(data.answer || "No answer received.")
    } catch (error) {
      setAnswer("Error fetching answer.")
    } finally {
      setLoadingQuestion(false)
      setShowLoadingModal(false) // Hide the modal
    }
  }

  // Recapture function
  const handleRecapture = () => {
    setCapturedImage(null)
    setShowRecapture(false)
    setDescription("")
    setDetailedDescription("")
    setAnswer("")
  }

  // Countdown effect for realtime mode
  useEffect(() => {
    if (mode !== "realtime") {
      setIsCountdownActive(false)
      setCountdown(15)
      return
    }

    setIsCountdownActive(true)
    setCountdown(15)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          captureAndDescribe()
          return 15 // Reset countdown
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [mode])

  // Reset countdown when mode changes
  useEffect(() => {
    if (mode === "realtime") {
      setCountdown(15)
    }
  }, [mode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 dark:bg-black text-white">
      {/* Header */}
      <header className="border-b bg-black/95 dark:bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-green-400 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-green-400" />
              <h1 className="text-xl font-bold text-white">AI Vision Studio</h1>
            </div>
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl text-white">🎥</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">AI Vision Studio</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Real-time object identification powered by Gemini AI. Capture, upload, or stream live video for intelligent
            image analysis.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-black rounded-lg shadow-md border border-green-700 p-1">
            {[
              { value: "realtime", label: "Live Stream", icon: Video },
              { value: "upload", label: "Upload Image", icon: Upload },
              { value: "capture", label: "Capture Photo", icon: Camera },
            ].map((option) => {
              const IconComponent = option.icon
              return (
                <label key={option.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={`
                    px-4 md:px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2
                    ${
                      mode === option.value
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-300 hover:bg-gray-800 hover:text-green-400"
                    }
                  `}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Camera/Upload */}
          <div className="space-y-6">
            {/* Webcam Display */}
            {(mode === "realtime" || mode === "capture") && (
              <Card className="bg-black border border-green-700/50 transition-all duration-300 hover:border-green-500/50 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Video className="h-5 w-5 text-green-400" />
                    {mode === "realtime" ? "Live Camera Feed" : "Camera Preview"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative bg-black">
                    {capturedImage && showRecapture ? (
                      <div className="relative">
                        <img
                          src={capturedImage || "/placeholder.svg"}
                          alt="Captured"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                        <div className="absolute top-4 right-4">
                          <Button
                            onClick={handleRecapture}
                            className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Recapture
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={640}
                          height={480}
                          videoConstraints={{ facingMode: "environment" }}
                          className="w-full h-auto"
                        />
                        {mode === "realtime" && (
                          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-white text-sm font-medium">LIVE</span>
                          </div>
                        )}
                        {/* Countdown Display for Realtime Mode */}
                        {mode === "realtime" && isCountdownActive && (
                          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="relative w-8 h-8">
                                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={`${(countdown / 15) * 87.96} 87.96`}
                                    className="transition-all duration-1000 ease-linear"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold">{countdown}</span>
                                </div>
                              </div>
                              <span className="text-sm font-medium">Next capture</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Section */}
            {mode === "upload" && (
              <Card className="bg-black border border-green-700/50 transition-all duration-300 hover:border-green-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-400" />
                    Upload Your Image
                  </CardTitle>
                  <CardDescription className="text-gray-400">Choose an image file to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className={`
                      border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                      ${
                        uploadedFile
                          ? "border-green-400 bg-green-950/20"
                          : "border-green-600 hover:border-green-400 hover:bg-green-950/10"
                      }
                    `}
                    >
                      <span className="text-3xl mb-4 block">{uploadedFile ? "✅" : "⬆️"}</span>
                      <p className="text-white font-medium">
                        {uploadedFile ? uploadedFile.name : "Click to select or drag & drop"}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {uploadedFile ? "File ready for analysis" : "PNG, JPG, GIF up to 10MB"}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (uploadedFile) sendImageForDescription(uploadedFile)
                      else alert("Please select an image first.")
                    }}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white transition-colors duration-300"
                    disabled={!uploadedFile || loadingDescription}
                  >
                    {loadingDescription ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Capture Photo Section */}
            {mode === "capture" && !showRecapture && (
              <Card className="bg-black border border-green-700/50 transition-all duration-300 hover:border-green-500/50">
                <CardContent className="p-6">
                  <Button
                    onClick={captureAndDescribe}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white py-4 transition-colors duration-300"
                    disabled={loadingDescription}
                  >
                    {loadingDescription ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Capturing...
                      </div>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Capture & Analyze
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Description Display */}
            <Card className="bg-black border border-green-700/50 transition-all duration-300 hover:border-green-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-400" />
                    AI Analysis Results
                  </CardTitle>
                  <Button
                    onClick={sendImageForDetailedDescription}
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-400 hover:bg-green-950/20"
                    disabled={!lastDescribedImage || loadingDetailed}
                  >
                    {loadingDetailed ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      "Detailed Analysis"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-green-400 font-medium mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Basic Description
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-4 border border-green-800">
                    {loadingDescription && !description ? (
                      <div className="flex items-center text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing image...
                      </div>
                    ) : (
                      <p className="text-white leading-relaxed min-h-[60px]">
                        {description || "No description available yet. Capture or upload an image to get started."}
                      </p>
                    )}
                  </div>
                </div>

                {detailedDescription && (
                  <div>
                    <h4 className="text-green-400 font-medium mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Detailed Analysis
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-4 border border-green-800">
                      <p className="text-white leading-relaxed">{detailedDescription}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Question & Answer Section */}
            <Card className="bg-black border border-green-700/50 transition-all duration-300 hover:border-green-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  Ask About the Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-green-400 font-medium mb-2">Your Question</label>
                  <Textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know about this image?"
                    className="w-full bg-gray-800 border border-green-700 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                    disabled={loadingQuestion}
                  />
                </div>

                <Button
                  onClick={sendImageQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white transition-colors duration-300"
                  disabled={loadingQuestion || !question.trim()}
                >
                  {loadingQuestion ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Getting Answer...
                    </div>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Get AI Answer
                    </>
                  )}
                </Button>

                {answer && (
                  <div>
                    <h4 className="text-green-400 font-medium mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      AI Response
                    </h4>
                    <div className="bg-green-950/30 border border-green-700 rounded-lg p-4">
                      <p className="text-white leading-relaxed">{answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Loading Modal */}
        <LoadingModal
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
          projectName="AI Vision Studio"
        />
      </main>
    </div>
  )
}
