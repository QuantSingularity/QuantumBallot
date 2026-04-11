import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ErrorHash {
  username?: string;
  password?: string;
  general?: string;
}

export function LoginAccountCard() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<ErrorHash>({});
  const [isLoading, setIsLoading] = useState(false);

  const { onLogin } = useAuth();
  const navigate = useNavigate();

  const formValidation = () => {
    const errorHash: ErrorHash = {};
    if (!username.trim()) errorHash.username = "Username is required.";
    if (!password) errorHash.password = "Password is required.";
    setErrors(errorHash);
    return Object.keys(errorHash).length === 0;
  };

  const onClickLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formValidation()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const result = await onLogin?.(username.trim(), password);
      if (result?.error) {
        setErrors({ general: "Invalid username or password. Please try again." });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        <form className="space-y-5">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("password")?.focus()}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 text-sm
                focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all
                ${errors.username ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-white/20"}`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { const btn = document.getElementById("login-btn"); btn?.click(); } }}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 text-sm
                focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all
                ${errors.password ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-white/20"}`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            id="login-btn"
            onClick={onClickLogin}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed
              text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-red-600/25
              hover:shadow-red-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
