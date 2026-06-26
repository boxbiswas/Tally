import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { registerUser } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 overflow-hidden selection:bg-white/20">
      {/* Ambient Background Glows to emphasize the glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-4xl bg-white/3 backdrop-blur-2xl border border-white/8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create Account</h1>
          <p className="text-sm text-neutral-400 mt-2">Join SmartERP today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                name="name"
                required
                className="pl-11 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="pl-11 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                placeholder="admin@smarterp.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="password"
                name="password"
                required
                className="pl-11 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-neutral-950 p-3 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-medium hover:text-neutral-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;