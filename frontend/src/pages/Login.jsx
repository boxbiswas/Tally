import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { loginUser } from '../redux/slices/authSlice';
import LoginForm from '../components/login/LoginForm';
import AuthInput from '../components/login/AuthInput';
import LoginHeader from '../components/login/LoginHeader';



const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Handle login submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser(formData));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/companies');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 overflow-hidden selection:bg-white/20">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

            {/* Glass Card Container */}
            <div className="relative z-10 w-full max-w-md p-8 rounded-4xl bg-white/3 backdrop-blur-2xl border border-white/8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">

                <LoginHeader />

                <LoginForm
                    formData={formData}
                    loading={loading}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />

            </div>
        </div>
    );
};

export default Login;