"use client"

import { useState } from "react"
import axios from "axios"
import { ArrowLeft, Search, Loader2, Globe, Youtube, Sparkles, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoadingModal } from "@/components/loading-modal"

export default function WebScrapingPage() {
  const API_URL = process.env.NEXT_PUBLIC_WEB_SCRAPPING_BACKEND_URL || "http://localhost:8000"

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    setShowLoadingModal(true) // Show the modal

    try {
      const res = await axios.post(`${API_URL}/search`, { query })
      setResult(res.data)
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Server error")
      } else {
        setError(err.message || "Something went wrong")
      }
    } finally {
      setLoading(false)
      setShowLoadingModal(false) // Hide the modal
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() && !loading) {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:bg-black text-white">
      {/* Header */}
      <header className="border-b bg-black/95 dark:bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">Web Scraping Assistant</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Intelligent Search Assistant</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get AI-powered answers and discover relevant videos from multiple sources including Google and YouTube.
          </p>
        </div>

        {/* Search Interface */}
        <Card className="mb-8 bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
          <CardHeader>
            <CardTitle className="text-white">Ask Anything</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your query and get intelligent responses with relevant video content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  className="pl-10 h-12 text-lg bg-gray-800 text-white border-cyan-600 border focus:border-cyan-400 focus:ring-0 transition-colors duration-200"
                  placeholder="e.g., How to learn machine learning, Best cooking recipes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-colors duration-300"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-white">AI-Powered Answers</h3>
              <p className="text-sm text-gray-400">Get intelligent responses powered by Gemini AI</p>
            </CardContent>
          </Card>
          <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-white">Google Videos</h3>
              <p className="text-sm text-gray-400">Discover relevant video content from Google search</p>
            </CardContent>
          </Card>
          <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
            <CardContent className="p-6 text-center">
              <Youtube className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-white">YouTube Results</h3>
              <p className="text-sm text-gray-400">Find specific YouTube videos related to your query</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>❌ {error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Gemini Answer */}
            {result.source === "gemini" && (
              <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    AI Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-base leading-relaxed text-white">{result.answer}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Results */}
            {(result.source === "google_videos" || result.source === "youtube") && result.results && (
              <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {result.source === "google_videos" ? (
                      <>
                        <Globe className="h-5 w-5 text-cyan-400" />
                        Google Videos
                      </>
                    ) : (
                      <>
                        <Youtube className="h-5 w-5 text-red-500" />
                        YouTube Results
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Found {result.results.length} relevant videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.results.map((vid, idx) => (
                      <Card
                        key={idx}
                        className="hover:shadow-md transition-shadow bg-black border-cyan-700 border-1 hover:border-cyan-400"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <a
                                href={vid.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline font-medium text-lg mb-2 block"
                              >
                                {idx + 1}. {vid.title}
                              </a>

                              {vid.channel && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">{vid.channel}</Badge>
                                  {vid.views && <Badge variant="outline">{vid.views}</Badge>}
                                </div>
                              )}

                              {vid.description && (
                                <p className="text-gray-400 text-sm leading-relaxed">{vid.description}</p>
                              )}
                            </div>

                            <Button variant="ghost" size="sm" asChild className="text-white hover:text-cyan-400">
                              <a href={vid.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !error && !loading && (
          <Card className="bg-black border-cyan-600 border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-400">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Ready to Search</h3>
              <p className="text-gray-400">Enter your query above to get started with intelligent search results</p>
            </CardContent>
          </Card>
        )}

        {/* Loading Modal */}
        <LoadingModal
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
          projectName="Web Scraping Assistant"
        />
      </main>
    </div>
  )
}