import { useNavigate } from "react-router-dom";

function NoPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="text-8xl font-black text-red-600 leading-none">404</div>
        <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NoPage;
