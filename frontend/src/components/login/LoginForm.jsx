import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

// Sub-component
import AuthInput from './AuthInput';

const LoginForm = ({ formData, loading, onChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">

            {/* Email Field */}
            <AuthInput
                label="Email Address"
                type="email"
                name="email"
                icon={Mail}
                placeholder="user@smarterp.com"
                value={formData.email}
                onChange={onChange}
                required
            />

            {/* Password Field */}
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
                    <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                    </>
                )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-neutral-400 mt-8">
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-medium hover:text-neutral-300 transition-colors">
                    Register here
                </Link>
            </p>
        </form>
    );
};

export default LoginForm;