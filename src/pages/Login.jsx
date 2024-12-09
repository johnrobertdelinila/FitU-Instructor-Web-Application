import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import logoFitU from '../images/logo-fitu.png';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row overflow-hidden">
      {/* Background Image with Enhanced Styling */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://www.dmmmsu.edu.ph/wp-content/uploads/2021/02/Twin-hostel-1024x768.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.9)',
        }}
      >
        {/* Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Left Panel (Info) with Glass Effect */}
      <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 flex items-center backdrop-blur-md bg-primary-900/20">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <img 
              src={logoFitU} 
              alt="FitU Logo" 
              className="h-16 mb-6 animate-fade-in rounded-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Welcome to <span className="text-primary-400">FitU</span>
            </h1>
            <div className="h-1 w-24 bg-primary-500 rounded-full"></div>
          </div>
          <div className="space-y-8 text-gray-100">
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-semibold mb-3 text-primary-300">PathFit 101</h2>
              <p className="text-gray-200 leading-relaxed">
                A physical fitness subject at DMMMSU that promotes health and fitness 
                through structured and educational fitness routines.
              </p>
            </div>
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-semibold mb-3 text-primary-300">About FitU</h2>
              <p className="text-gray-200 leading-relaxed">
                FitU enables instructors to manage PathFit 101 students efficiently 
                by assigning activities, tracking progress, and fostering a healthy lifestyle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Login Form) with Glass Effect */}
      <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 flex items-center backdrop-blur-md bg-gradient-to-br from-gray-50/95 via-gray-100/95 to-gray-200/95">
        <div className="max-w-md w-full mx-auto">
          <div className="backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-primary-500/10 transition-shadow duration-300">
            <div className="flex justify-center mb-6">
              <img 
                src={logoFitU} 
                alt="FitU Logo" 
                className="h-12 rounded-xl"
              />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Instructor Login</h2>
              <p className="text-sm text-gray-600">
                Sign in to manage your PathFit 101 classes and students
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50/90 border border-red-200 text-red-600 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-3 text-base font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </div>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to the terms and conditions of FitU
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 