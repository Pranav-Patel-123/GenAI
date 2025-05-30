"use client"

import { useState, useEffect } from "react"
import { Search, Music, Globe, ChevronRight, ExternalLink, Camera } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

const projects = [
  {
    id: "music-recommendation",
    title: "Music Recommendation System",
    description:
      "AI-powered music recommendation engine that suggests songs based on your preferences or text descriptions using advanced machine learning algorithms.",
    icon: Music,
    tags: ["Machine Learning", "Music", "Recommendation", "AI"],
    route: "/music-recommendation",
    features: ["Song-based recommendations", "Text-based discovery", "Personalized suggestions"],
    tech: ["Python", "FastAPI", "ML Models", "Next.js"],
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "web-scraping",
    title: "Intelligent Web Scraping Assistant",
    description:
      "Smart web scraping tool that intelligently searches and extracts information from various sources including Google Videos and YouTube.",
    icon: Globe,
    tags: ["Web Scraping", "Search", "Data Extraction", "AI"],
    route: "/web-scraping",
    features: ["Multi-source search", "Video content discovery", "AI-powered results"],
    tech: ["Python", "Web Scraping", "APIs", "Next.js"],
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "ai-vision-studio",
    title: "AI Vision Studio",
    description:
      "Real-time object identification powered by Gemini AI. Capture, upload, or stream live video for intelligent image analysis and Q&A.",
    icon: Camera,
    tags: ["Computer Vision", "Image Analysis", "Real-time", "AI"],
    route: "/ai-vision-studio",
    features: ["Real-time analysis", "Image Q&A", "Multi-mode capture"],
    tech: ["React", "Gemini AI", "Webcam API", "Next.js"],
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:bg-black">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 shadow-sm dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GenAI Projects
            </h1>
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 dark:bg-black">
        {/* Hero Section */}
        <motion.section className="text-center mb-12" variants={fadeInVariants} initial="initial" animate="animate">
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            variants={fadeInVariants}
          >
            GenAI Projects Showcase
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
            variants={fadeInVariants}
          >
            Explore my collection of AI-powered projects demonstrating machine learning, web scraping, and intelligent
            automation capabilities.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="relative max-w-md mx-auto mb-8 hover:scale-[1.02] transition-transform duration-300"
            variants={fadeInVariants}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
            />
          </motion.div>
        </motion.section>

        {/* Projects Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Featured Projects</h2>
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="initial"
            animate="animate"
          >
            {filteredProjects.map((project) => {
              const IconComponent = project.icon
              return (
                <motion.div key={project.id} variants={cardVariants}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 hover:border-transparent hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 bg-white dark:bg-black overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-3 ${project.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className={`h-6 w-6 ${project.iconColor}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                              {project.title}
                            </CardTitle>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Features - Compact */}
                        <div>
                          <h4 className="font-semibold text-xs mb-1 text-slate-700 dark:text-slate-300">
                            Key Features:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 2).map((feature, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {project.features.length > 2 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                              >
                                +{project.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Tech Stack - Compact */}
                        <div>
                          <h4 className="font-semibold text-xs mb-1 text-slate-700 dark:text-slate-300">Tech Stack:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.tech.slice(0, 3).map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {project.tech.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                              >
                                +{project.tech.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link href={project.route} className="block pt-2">
                          <Button
                            className={`w-full bg-gradient-to-r ${project.gradient} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-white border-0`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Try Project
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">No projects found matching your search.</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </footer>
      </main>
    </div>
  )
}
