"use client"

import { useState } from "react"
import axios from "axios"
import { ArrowLeft, Upload, FileText, Download, AlertCircle, Sparkles, File, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
// import { ThemeToggle } from "@/components/theme-toggle"
import { LoadingModal } from "@/components/loading-modal"

const BACKEND_BASE = process.env.NEXT_PUBLIC_FILE_TEXT_EXTRACTOR_BACKEND_URL || "http://localhost:8000"

export default function FileFormatterPage() {
  const [file, setFile] = useState(null)
  const [formattedText, setFormattedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError("")
    setFormattedText("")
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first!")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    setLoading(true)
    setError("")
    setFormattedText("")
    setShowLoadingModal(true)

    try {
      const response = await axios.post(`${BACKEND_BASE}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setFormattedText(response.data.formatted_text)
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.detail || "An error occurred while uploading and processing the file.")
    } finally {
      setLoading(false)
      setShowLoadingModal(false)
    }
  }

  const supportedFormats = [
    { name: "PDF", icon: "📄" },
    { name: "DOCX", icon: "📝" },
    { name: "DOC", icon: "📝" },
    { name: "TXT", icon: "📄" },
    { name: "RTF", icon: "📄" },
    { name: "HTML", icon: "🌐" },
    { name: "XLS", icon: "📊" },
    { name: "XLSX", icon: "📊" },
    { name: "CSV", icon: "📊" },
    { name: "Images", icon: "🖼️" },
    { name: "ZIP", icon: "🗜️" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-yellow-900 dark:bg-black text-white">
      {/* Header */}
      <header className="border-b bg-black/95 dark:bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-orange-400 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-orange-400" />
              <h1 className="text-xl font-bold text-white">Universal File Text Formatter</h1>
            </div>
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl text-white">📄</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Universal File Text Formatter</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Extract and format text from various file types including documents, spreadsheets, images, and archives
            using AI-powered processing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="bg-black border border-orange-700/50 transition-all duration-300 hover:border-orange-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-orange-400" />
                  Upload Your File
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose a file to extract and format its text content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.docx,.doc,.txt,.rtf,.html,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.tiff,.zip"
                  />
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                      ${
                        file
                          ? "border-orange-400 bg-orange-950/20"
                          : "border-orange-600 hover:border-orange-400 hover:bg-orange-950/10"
                      }
                    `}
                  >
                    <div className="mb-4">
                      {file ? (
                        <CheckCircle2 className="h-12 w-12 text-orange-400 mx-auto" />
                      ) : (
                        <File className="h-12 w-12 text-orange-500 mx-auto" />
                      )}
                    </div>
                    <p className="text-white font-medium mb-2">{file ? file.name : "Click to select or drag & drop"}</p>
                    <p className="text-gray-400 text-sm">
                      {file
                        ? `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : "PDF, DOCX, Images, ZIP and more supported"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 text-white py-3 transition-colors duration-300"
                  disabled={!file || loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing File...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extract & Format Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Supported Formats */}
            <Card className="bg-black border border-orange-700/50 transition-all duration-300 hover:border-orange-500/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <File className="h-5 w-5 text-orange-400" />
                  Supported File Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {supportedFormats.map((format, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg border border-orange-800 hover:border-orange-600 transition-colors"
                    >
                      <span className="text-lg">{format.icon}</span>
                      <span className="text-sm text-gray-300 font-medium">{format.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Info */}
            <Card className="bg-black border border-orange-700/50 transition-all duration-300 hover:border-orange-500/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-500">1</span>
                  </div>
                  <p className="text-sm text-gray-400">Upload any supported file type</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-yellow-500">2</span>
                  </div>
                  <p className="text-sm text-gray-400">AI processes and extracts text content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-500">3</span>
                  </div>
                  <p className="text-sm text-gray-400">Get formatted, readable text output</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {/* Formatted Text Display */}
            <Card className="bg-black border border-orange-700/50 transition-all duration-300 hover:border-orange-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-400" />
                    Extracted Text
                  </CardTitle>
                  {formattedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-600 text-orange-400 hover:bg-orange-950/20"
                      onClick={() => {
                        navigator.clipboard.writeText(formattedText)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                  )}
                </div>
                {formattedText && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-orange-950/30 text-orange-300 border-orange-700">
                      {formattedText.length} characters
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-950/30 text-orange-300 border-orange-700">
                      {formattedText.split(/\s+/).length} words
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
  <div className="relative">

    {/* Upload prompt */}
    {!formattedText && !loading && (
      <div className="text-center mb-6">
        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">Upload a file to see the extracted text</p>
      </div>
    )}

    {/* Loader */}
    {loading ? (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-400 font-medium">Processing your file...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    ) : (
      <pre
        className="
          whitespace-pre-wrap word-wrap break-word p-4 
          bg-gray-900 border border-orange-800 rounded-lg 
          max-h-96 overflow-y-auto text-gray-100 text-sm 
          leading-relaxed font-mono
        "
      >
        {formattedText || "Your extracted text will appear here once the upload completes."}
      </pre>
    )}
  </div>
</CardContent>

            </Card>

            {/* Processing Stats */}
            {formattedText && (
              <Card className="bg-black border border-orange-700/50 transition-all duration-300 hover:border-orange-500/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Processing Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-orange-950/20 rounded-lg border border-orange-800">
                      <div className="text-2xl font-bold text-orange-400">{formattedText.length}</div>
                      <div className="text-xs text-gray-400">Characters</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-950/20 rounded-lg border border-yellow-800">
                      <div className="text-2xl font-bold text-yellow-400">{formattedText.split(/\s+/).length}</div>
                      <div className="text-xs text-gray-400">Words</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-950/20 rounded-lg border border-orange-800">
                    <div className="text-2xl font-bold text-orange-400">{formattedText.split("\n").length}</div>
                    <div className="text-xs text-gray-400">Lines</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Loading Modal */}
        <LoadingModal
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
          projectName="Universal File Text Formatter"
        />
      </main>
    </div>
  )
}
