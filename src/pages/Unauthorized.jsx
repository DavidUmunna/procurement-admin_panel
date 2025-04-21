import { User, Lock, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/usercontext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-50 p-6 flex flex-col items-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Access Restricted
          </h1>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 mt-0.5 text-gray-500 flex-shrink-0" />
            <p className="text-gray-600">
              {user ? (
                <>
                  Logged in as <span className="font-medium">{user.name}</span> ({user.role})
                </>
              ) : (
                "You are not currently logged in"
              )}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700">
              {user
                ? "Your account doesn't have sufficient privileges for this page."
                : "Please sign in with an authorized account."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate(user ? '/' : '/login')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              {user ? 'Return Home' : 'Go to Login'}
            </button>
          </div>
        </div>

        {user && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Need access? Contact{' '}
              <a href="mailto:admin@company.com" className="text-blue-600 hover:underline">
                your administrator
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}