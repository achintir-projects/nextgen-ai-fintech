"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Lock, Github, Chrome, AlertCircle } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push("/admin")
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/admin")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/admin" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to PAAM</CardTitle>
            <CardDescription>
              Sign in to access your FinTech dashboard and manage your SDK integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="oauth" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="oauth">OAuth</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="oauth" className="mt-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={isLoading}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </div>
                
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="credentials" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="developer@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Demo credentials: admin@paam.com / password
              </p>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Development Mode:</strong> This is a demo environment. For production, configure your OAuth providers in environment variables.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline">🔒 Secure</Badge>
            <Badge variant="outline">⚡ Fast</Badge>
            <Badge variant="outline">🛡️ Compliant</Badge>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            PAAM FinTech Platform - Enterprise-grade SDK for financial applications
          </p>
        </div>
      </div>
    </div>
  )
}