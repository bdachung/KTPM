import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const AuthContext = createContext();

// Tạo provider
export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => {
        // Lấy accessToken từ localStorage nếu có
        return localStorage.getItem('accessToken') || null;
    });

    const [refreshToken, setRefreshToken] = useState(() => {
        // Lấy refreshToken từ localStorage nếu có
        return localStorage.getItem('refreshToken') || null;
    });

    const [username, setUsername] = useState(() => {
        // Lấy username từ localStorage nếu có
        return localStorage.getItem('username') || null;
    });

    // Lưu accessToken vào localStorage khi nó thay đổi
    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    // Lưu refreshToken vào localStorage khi nó thay đổi
    useEffect(() => {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }, [refreshToken]);

    // Save username to localStorage when it changes
    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
    }, [username]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng context
export const useAuth = () => {
    return useContext(AuthContext);
};
