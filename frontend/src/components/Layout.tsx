import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';

const patientNav = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/profile', label: 'Profile' },
  { to: '/app/appointments', label: 'Appointments' },
  { to: '/app/doctors', label: 'Find Doctors' },
];

const doctorNav = [
  { to: '/app/doctor-dashboard', label: 'Dashboard' },
  { to: '/app/doctor-profile', label: 'Profile' },
  { to: '/app/doctor-appointments', label: 'Appointments' },
  { to: '/app/patients', label: 'Patients' },
];

const adminNav = [
  { to: '/app/admin-dashboard', label: 'Dashboard' },
  { to: '/app/users', label: 'Users' },
  { to: '/app/admin-doctors', label: 'Doctors' },
  { to: '/app/admin-patients', label: 'Patients' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav =
    user?.role === 'doctor' ? doctorNav
    : user?.role === 'admin' ? adminNav
    : patientNav;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/app" className="text-lg font-bold text-indigo-600">
            {APP_NAME}
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            {user?.firstName} {user?.lastName}
            <span className="block text-gray-400 capitalize">{user?.role}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
