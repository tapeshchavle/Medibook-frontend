import { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, registerDoctor as apiRegisterDoctor, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to load user", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const data = await apiRegister(userData);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Helper to check if user is authenticated
    const isAuthenticated = !!user;

    const registerDoctor = async (doctorData) => {
        const data = await apiRegisterDoctor(doctorData);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const value = {
        user,
        login,
        register,
        registerDoctor,
        logout,
        isAuthenticated,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
