// File: src/components/InputField.jsx

import React, { useState } from 'react';
import EyeIcon from './EyeIcon';
import EyeSlashedIcon from './EyeSlashedIcon';

const InputField = ({ placeholder, value, onChange, type = 'text' }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordField = type === 'password';

    const toggleVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const inputType = isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type;

    return (
        <div className="relative w-full mb-4">
            <input
                type={inputType}
                className="w-full bg-secondary text-white rounded-lg px-4 py-3 text-base pr-12 border border-transparent focus:border-accent focus:outline-none"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoCapitalize="none"
            />
            {isPasswordField && (
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-textLight hover:text-white"
                >
                    {isPasswordVisible ? <EyeSlashedIcon /> : <EyeIcon />}
                </button>
            )}
        </div>
    );
};

export default InputField;