import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface LoginForm {
  emailOrPhone: string;
  password: string;
  remember?: boolean;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.emailOrPhone, data.password);
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Invalid email/phone or password';
      toast.error(message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div
        className="flex flex-col md:flex-row items-stretch bg-white rounded-[30px] border border-[#CDCDCD] overflow-hidden max-w-[600px] w-full"
        style={{ boxShadow: "0px 20px 50px #5F6FFF1A" }}
      >
        {/* Left Side - Form */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-gray-600 text-3xl md:text-4xl font-bold mb-4">
            Sign in to your account
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Enter your email or phone number
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Email or Phone"
                autoComplete="username"
                className="w-full h-[45px] px-4 rounded border border-[#A4A2A2] focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                {...registerField('emailOrPhone', {
                  required: 'Email or phone is required',
                })}
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="text-gray-600 text-lg mb-2 block ml-1">Password</label>
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full h-[45px] px-4 pr-12 rounded border border-[#A5A2A2] focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                  {...registerField('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end mb-8">
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white text-xl md:text-xl font-bold py-2 rounded-[43px] border border-gray-400 hover:bg-primary-600 transition-colors disabled:opacity-70 mb-6"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <div className="flex flex-wrap items-center gap-1.5 text-gray-600 text-sm mb-6">
              {/* <span>By continuing, you agree to the Terms of use</span>
              <span>and Privacy Policy.</span> */}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] bg-black w-20 opacity-20"></div>
              <span className="text-gray-500 text-sm">New to our community</span>
              <div className="h-[1px] bg-black w-20 opacity-20"></div>
            </div>

            <Link to="/register">
              <button
                type="button"
                className="w-full bg-primary-500 text-white text-xl md:text-xl font-bold py-2 rounded-[43px] border border-gray-400 hover:bg-primary-600 transition-colors"
              >
                Create an Account
              </button>
            </Link>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex w-full md:w-1/2 lg:w-[45%] bg-white p-4 items-center justify-center">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v0o8XbXdnI/1xdg11f0_expires_30_days.png"
            alt="Login Illustration"
            className="w-full h-auto object-contain max-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
