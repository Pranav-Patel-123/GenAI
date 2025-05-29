"use client"

import { useState } from "react"
import axios from "axios"
import { ArrowLeft, Music, Loader2, Search, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MusicRecommendationPage() {
  const API_URL = process.env.NEXT_PUBLIC_MUSIC_RECOMMENDATION_BACKEND_URL

  const [mode, setMode] = useState("song")
  const [songName, setSongName] = useState("")
  const [text, setText] = useState("")
  const [numSongs, setNumSongs] = useState(5)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setRecommendations([])
    setLoading(true)

    try {
      const payload =
        mode === "song" ? { song_name: songName, num_songs: Number(numSongs) } : { text, num_songs: Number(numSongs) }

      const endpoint = mode === "song" ? `${API_URL}/recommend_by_song` : `${API_URL}/recommend_by_text`

      const res = await axios.post(endpoint, payload)
      setRecommendations(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 dark:bg-black text-white">
      {/* Header */}
      <header className="border-b bg-background/95 dark:bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:text-purple-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold">Music Recommendations</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">AI-Powered Music Discovery</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get personalized music recommendations based on your favorite songs or describe the mood you're looking for.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card className="bg-black border border-purple-700/50 transition-all duration-300 hover:border-pink-500/50">
              <CardHeader>
                <CardTitle className="text-white">Find Your Next Favorite Song</CardTitle>
                <CardDescription className="text-gray-400">Choose how you'd like to discover new music</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={setMode} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="song"
                      className="flex items-center gap-2 justify-center text-white hover:text-purple-300 transition-colors duration-200"
                    >
                      <Search className="h-4 w-4 text-purple-500" />
                      By Song Name
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className="flex items-center gap-2 justify-center text-white hover:text-pink-300 transition-colors duration-200"
                    >
                      <Type className="h-4 w-4 text-pink-500" />
                      By Description
                    </TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <TabsContent value="song" className="space-y-4">
                      <div>
                        <label htmlFor="songName" className="block text-sm font-medium mb-2 text-gray-300">
                          Song Name
                        </label>
                        <Input
                          id="songName"
                          type="text"
                          value={songName}
                          onChange={(e) => setSongName(e.target.value)}
                          required
                          placeholder="e.g., Bohemian Rhapsody, Shape of You"
                          className="h-12 bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <label htmlFor="text" className="block text-sm font-medium mb-2 text-gray-300">
                          Describe Your Mood or Preference
                        </label>
                        <Textarea
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          required
                          rows={4}
                          placeholder="e.g., upbeat pop songs for working out, relaxing jazz for studying, emotional ballads"
                          className="resize-none bg-gray-800 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </TabsContent>

                    <div>
                      <label htmlFor="numSongs" className="block text-sm font-medium mb-2 text-gray-300">
                        Number of Recommendations
                      </label>
                      <Input
                        id="numSongs"
                        type="number"
                        min={1}
                        max={20}
                        value={numSongs}
                        onChange={(e) => setNumSongs(e.target.value)}
                        required
                        className="w-32 bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white transition-colors duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Finding Recommendations...
                        </>
                      ) : (
                        <>
                          <Music className="h-4 w-4 mr-2" />
                          Get Recommendations
                        </>
                      )}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="bg-black border border-purple-700/50 transition-all duration-300 hover:border-pink-500/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">1</span>
                  </div>
                  <p className="text-sm text-gray-400">Choose your input method: song name or text description</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-pink-500">2</span>
                  </div>
                  <p className="text-sm text-gray-400">AI analyzes your preferences using advanced ML algorithms</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">3</span>
                  </div>
                  <p className="text-sm text-gray-400">Get personalized recommendations with song details</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-purple-700/50 transition-all duration-300 hover:border-pink-500/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-start bg-gray-800 text-white border-purple-700">
                    Song-based recommendations
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start bg-gray-800 text-white border-pink-700">
                    Text-based discovery
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start bg-gray-800 text-white border-purple-700">
                    ML-powered matching
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start bg-gray-800 text-white border-pink-700">
                    Detailed song information
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-6 bg-red-800 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mt-8 bg-black border border-purple-700/50 transition-all duration-300 hover:border-pink-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Music className="h-5 w-5 text-purple-500" />
                Your Recommendations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Found {recommendations.length} songs you might love
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((rec, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-md transition-shadow dark:bg-black bg-gray-900 border border-gray-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 text-white">{rec.song}</h3>
                          <p className="text-gray-400 mb-2">by {rec.singer}</p>
                          <Badge variant="outline" className="border-purple-500 text-purple-300">
                            {rec.year}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-purple-500/20">#{idx + 1}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
