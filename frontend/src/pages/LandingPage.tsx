import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
      <nav className="flex items-center justify-between px-6 py-4 text-white">
        <span className="text-xl font-bold">{APP_NAME}</span>
        <div className="flex gap-4">
          <Link to="/login" className="text-white/90 hover:text-white">
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-white/20 px-4 py-2 font-medium hover:bg-white/30"
          >
            Get Started
          </Link>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center px-6 py-24 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to {APP_NAME}</h1>
        <p className="text-xl text-white/90 mb-8 max-w-xl">
          Your trusted healthcare platform. Book appointments, manage records, and connect with doctors.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 hover:bg-gray-100"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-lg border-2 border-white px-6 py-3 font-semibold hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
