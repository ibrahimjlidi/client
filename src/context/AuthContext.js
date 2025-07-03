import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser(decoded.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                logout();
            }
        }
    }, []);

    const login = (newToken) => {
        try {
            const decoded = jwtDecode(newToken);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(decoded.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const authContextValue = {
        token,
        isAuthenticated,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}; 