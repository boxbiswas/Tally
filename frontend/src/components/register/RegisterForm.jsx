import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

// Reusable component
import AuthInput from '../login/AuthInput';

const RegisterForm = ({ formData, loading, onChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            
            {/* Full Name */}
            <AuthInput
                label="Full Name"
                type="text"
                name="name"
                icon={User}
                placeholder="John Doe"
                value={formData.name}
                onChange={onChange}
                required
            />

            {/* Email Address */}
            <AuthInput
                label="Email Address"
                type="email"
                name="email"
                icon={Mail}
                placeholder="admin@smarterp.com"
                value={formData.email}
                onChange={onChange}
                required
            />

            {/* Password */}
            <AuthInput
                label="Password"
                type="password"
                name="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={onChange}
                required
            />

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-neutral-950 p-3 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    'Create Account'
                )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-neutral-400 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium hover:text-neutral-300 transition-colors">
                    Sign In
                </Link>
            </p>
        </form>
    );
};

export default RegisterForm;