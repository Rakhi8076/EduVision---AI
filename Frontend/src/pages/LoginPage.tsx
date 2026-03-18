import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Moon, Sun } from "lucide-react";
import { login } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ✅ UPDATED HANDLE SUBMIT (ASYNC + TOKEN FLOW)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      await login(email, password); // ✅ backend call

      navigate("/dashboard"); // ✅ after success

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4 relative">
      
      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg glass-card"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass-card-strong rounded-3xl p-8">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <span className="text-3xl">🧠</span>
            <h1 className="font-display text-2xl font-bold mt-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              login in to your EduVision AI account
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-destructive/20 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-muted border outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl bg-muted border outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-3"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary">
                Forgot password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary font-semibold"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;