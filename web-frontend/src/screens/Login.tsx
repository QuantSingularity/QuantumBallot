import { LoginAccountCard } from "@/components/login-account-card";
const BlockchainBg = "/images/blockchain_background.jpg";

function Login() {
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gray-950">
      {/* Background image */}
      <img
        src={BlockchainBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/80 to-red-950/30 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand header */}
      <div className="relative z-10 mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Quantum<span className="text-red-500">Ballot</span>
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          Blockchain-Secured Electoral System
        </p>
      </div>

      {/* Login card */}
      <div className="relative z-10">
        <LoginAccountCard />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <span className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} QuantumBallot. All rights reserved.
        </span>
      </footer>
    </div>
  );
}

export default Login;
