"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    email: string;
    token: string;
    id: number;
    dob: string;
    address: string;
    categories: string[];
    name: string
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };
    const updateUser = (newUserData: any) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...newUserData,
        }));
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
