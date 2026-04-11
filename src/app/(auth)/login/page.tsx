"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, scaleIn } from "@/components/motion/variants";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed");
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result.data.userinfo));
      localStorage.setItem("userinfo", JSON.stringify(result.data.userinfo));
      localStorage.setItem("token", result.data.token);
      
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#050816] via-[#090a1f] to-[#020617] text-white">
      {/* Animated background orbs */}
      <motion.div 
        animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[140px] pointer-events-none" 
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-md px-4 relative"
      >
        {/* Logo Section */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 shadow-lg shadow-purple-500/20 mb-6 drop-shadow-xl">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Learnix
          </h1>
          <p className="text-white/60 mt-2 text-sm font-medium">
            AI-Powered Learning Platform
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={scaleIn}>
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Welcome back
              </CardTitle>
              <CardDescription className="text-white/60">
                Sign in with your name or email
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Identifier Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-identifier" className="text-sm font-medium text-white/80">
                    Name or Email
                  </Label>
                  <Input
                    id="login-identifier"
                    type="text"
                    placeholder="Enter your name or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-400/40 transition-all font-medium"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-white/80">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-400/40 transition-all font-medium pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !identifier.trim() || !password.trim()}
                  className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 relative overflow-hidden group border-0 border-white/10"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                </Button>
              </form>

              <div className="mt-6 text-center text-sm font-medium">
                <span className="text-white/50">Don&apos;t have an account? </span>
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p variants={fadeUp} className="text-center text-xs text-white/40 mt-8 font-medium">
          Powered by Gemini AI · Built with Next.js
        </motion.p>
      </motion.div>
    </main>
  );
}
