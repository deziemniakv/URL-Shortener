"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Link, BarChart3, Eye, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  clicks: number
  createdAt: Date
}

export default function URLShortener() {
  const [url, setUrl] = useState("")
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const handleShorten = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const shortCode = generateShortCode()
      const newShortenedUrl: ShortenedUrl = {
        id: shortCode,
        originalUrl: url,
        shortUrl: `https://short.ly/${shortCode}`,
        clicks: Math.floor(Math.random() * 100),
        createdAt: new Date(),
      }

      setShortenedUrls((prev) => [newShortenedUrl, ...prev])
      setUrl("")
      setIsLoading(false)

      toast({
        title: "Success!",
        description: "URL shortened successfully",
      })
    }, 1000)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">ShortLink</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              Free Plan
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Shorten Your URLs</h2>
            <p className="text-lg text-muted-foreground">
              Create short, memorable links that are easy to share and track
            </p>
          </div>

          {/* URL Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Create Short Link
              </CardTitle>
              <CardDescription>Paste your long URL below to get a shortened version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/very-long-url..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                />
                <Button onClick={handleShorten} disabled={isLoading} className="px-6">
                  {isLoading ? "Shortening..." : "Shorten"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shortened URLs List */}
          {shortenedUrls.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Your Shortened URLs
              </h3>

              {shortenedUrls.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* URLs */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Short URL</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.shortUrl)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 bg-muted rounded-md">
                          <code className="text-sm text-primary font-mono">{item.shortUrl}</code>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Original URL</span>
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground truncate">{item.originalUrl}</p>
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{item.clicks} clicks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            <span>Created {item.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {shortenedUrls.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No shortened URLs yet</h3>
                <p className="text-muted-foreground">Create your first short link using the form above</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
