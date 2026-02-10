import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../context/AuthContext';
import { MEDICAL_DEPARTMENTS } from '../utils/departments';
import { APP_NAME } from '../utils/constants';
import { validatePassword } from '../utils/passwordValidation';
import signupIllustration from '../assets/image1.png'; // Import the illustration

type Role = 'patient' | 'doctor';

interface RegisterForm extends RegisterData {
  confirmPassword: string;
}

export default function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await doRegister({ ...payload, role });
      toast.success('Account created. You can sign in now.');
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Registration failed';
      toast.error(message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-10 order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Please sign up to book appointment</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="flex gap-4">
                {(['patient', 'doctor'] as const).map((r) => (
                  <label key={r} className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${role === r ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="role"
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium capitalize">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('firstName', { required: 'Required' })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('lastName', { required: 'Required' })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                {...registerField('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('password', {
                    required: 'Password is required',
                    validate: (v) => validatePassword(v ?? ''),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500">Use 8 or more characters with a mix of letters, numbers and symbols</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                {...registerField('phone')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                <input
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('dateOfBirth')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  {...registerField('gender')}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                {...registerField('address')}
              />
            </div>

            {role === 'doctor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BMDC Registration Number</label>
                  <input
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    {...registerField('bmdcRegistrationNumber')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    {...registerField('department')}
                  >
                    <option value="">Select department</option>
                    {MEDICAL_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
                  <input
                    type="number"
                    min={0}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    {...registerField('experience', { valueAsNumber: true })}
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 underline">
                  Login here
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex w-full md:w-1/2 bg-primary-50 items-center justify-center p-8 order-1 md:order-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center text-center">

            <img
              src={signupIllustration}
              alt="Healthcare professionals"
              className="w-full max-w-sm mb-6 object-contain drop-shadow-lg"
            />

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join {APP_NAME}</h2>
            <p className="text-lg text-gray-600 max-w-sm mx-auto">
              Your health journey starts here. Connect with top doctors and manage appointments with ease.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
}
