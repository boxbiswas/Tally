import React from 'react';

/**
 * Reusable Auth Input Field
 * Used for both email and password fields
 */
const AuthInput = ({
    label,
    type,
    name,
    icon: Icon,
    placeholder,
    value,
    onChange,
    required
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                    type={type}
                    name={name}
                    required={required}
                    className="pl-11 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default AuthInput;