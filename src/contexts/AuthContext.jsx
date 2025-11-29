import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser } from '../types';
import { authAPI } from '../utils/apiClient';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Try to restore user from localStorage first
        const storedUser = localStorage.getItem('projectflow_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }

        // Try to get current user from API if token exists
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success && response.user) {
            const userData = createUser(
              response.user.id,
              response.user.name,
              response.user.email,
              response.user.role,
              response.user.avatar
            );
            setUser(userData);
            localStorage.setItem('projectflow_user', JSON.stringify(userData));
          }
        } catch (error) {
          console.warn('Failed to get current user from API:', error.message);
          // If token is invalid, clear it
          if (error.message?.includes('token')) {
            localStorage.removeItem('projectflow_token');
            localStorage.removeItem('projectflow_user');
            setUser(null);
          }
        }

        // Load all users for teacher dashboard
        try {
          const usersResponse = await authAPI.getAllUsers();
          if (usersResponse.success && usersResponse.users) {
            setAllUsers(usersResponse.users);
          }
        } catch (error) {
          console.warn('Failed to load users:', error.message);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user) {
        const userData = createUser(
          response.user.id,
          response.user.name,
          response.user.email,
          response.user.role,
          response.user.avatar
        );
        setUser(userData);
        localStorage.setItem('projectflow_user', JSON.stringify(userData));
        setIsLoading(false);
        return { success: true, user: userData };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: response.error || 'Login failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Handle network errors
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network error: Unable to connect to the server. Please check your internet connection and make sure the backend server is running.' 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (name, email, password, role) => {
    setIsLoading(true);
    try {
      if (!name || !email || !password || !role) {
        setIsLoading(false);
        return { success: false, error: 'All fields are required' };
      }

      const response = await authAPI.signup(name, email, password, role);
      
      if (response.success && response.user) {
        const userData = createUser(
          response.user.id,
          response.user.name,
          response.user.email,
          response.user.role,
          response.user.avatar
        );
        setUser(userData);
        localStorage.setItem('projectflow_user', JSON.stringify(userData));
        
        // Refresh users list
        try {
          const usersResponse = await authAPI.getAllUsers();
          if (usersResponse.success && usersResponse.users) {
            setAllUsers(usersResponse.users);
          }
        } catch (e) {
          console.warn('Failed to refresh users list:', e);
        }
        
        setIsLoading(false);
        return { success: true, user: userData };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: response.error || 'Sign up failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      
      // Handle network errors
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network error: Unable to connect to the server. Please check your internet connection and make sure the backend server is running.' 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Sign up failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('projectflow_user');
    localStorage.removeItem('projectflow_token');
    authAPI.logout();
  };

  const getStudents = () => {
    return allUsers.filter(u => u.role === 'student');
  };

  const getStudentsByTeacher = (teacherId) => {
    // In a real app, this would filter students assigned to specific teacher
    // For now, return all students
    return allUsers.filter(u => u.role === 'student');
  };

  const contextValue = {
    user,
    login,
    logout,
    signup,
    isLoading,
    getStudents,
    getStudentsByTeacher,
    allUsers
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
