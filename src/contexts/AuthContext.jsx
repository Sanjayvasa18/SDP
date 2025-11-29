import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser } from '../types';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(undefined);

// Profiles cache (fetched from Supabase)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          console.warn('Supabase not configured. Using localStorage only.');
          // Try to restore from localStorage
          const storedUser = localStorage.getItem('projectflow_user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed to parse stored user:', e);
            }
          }
          setIsLoading(false);
          return;
        }

        // Restore session from Supabase
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.warn('Supabase auth error:', authError.message);
        }
        
        if (authData?.user) {
          // Load profile for normalized app user
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .limit(1);
          
          if (profileError) {
            console.warn('Supabase profile error:', profileError.message);
          } else {
            const profile = profiles?.[0];
            if (profile) {
              const normalized = createUser(
                profile.id,
                profile.name,
                profile.email,
                profile.role,
                profile.avatar
              );
              setUser(normalized);
              localStorage.setItem('projectflow_user', JSON.stringify(normalized));
            }
          }
        }
        
        // Preload student list
        const { data: fetchedUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id,name,email,role,avatar');
        
        if (usersError) {
          console.warn('Supabase users error:', usersError.message);
        } else {
          setAllUsers(fetchedUsers || []);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Try to restore from localStorage as fallback
        const storedUser = localStorage.getItem('projectflow_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        setIsLoading(false);
        return { success: false, error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      const supaUser = data.user;
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .limit(1);
      
      if (profileError) {
        setIsLoading(false);
        return { success: false, error: profileError.message };
      }
      
      const profile = profiles?.[0];
      if (!profile) {
        setIsLoading(false);
        return { success: false, error: 'Profile not found' };
      }
      const userData = createUser(profile.id, profile.name, profile.email, profile.role, profile.avatar);
      setUser(userData);
      localStorage.setItem('projectflow_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password, role) => {
    setIsLoading(true);
    try {
      if (!name || !email || !password || !role) {
        setIsLoading(false);
        return { success: false, error: 'All fields are required' };
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        setIsLoading(false);
        return { success: false, error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } }
      });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      const supaUser = data.user;
      const avatar = role === 'teacher' ? '👩‍🏫' : '👨‍🎓';
      // Create profile row (RLS should allow insert by authenticated user)
      const { error: insertError } = await supabase.from('profiles').insert({
        id: supaUser.id,
        name,
        email,
        role,
        avatar
      });
      
      if (insertError) {
        setIsLoading(false);
        return { success: false, error: insertError.message };
      }
      
      const userData = createUser(supaUser.id, name, email, role, avatar);
      setUser(userData);
      localStorage.setItem('projectflow_user', JSON.stringify(userData));
      // Refresh cached users list
      const { data: fetchedUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id,name,email,role,avatar');
      
      if (!usersError) {
        setAllUsers(fetchedUsers || []);
      }
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('projectflow_user');
    supabase.auth.signOut();
  };

  const getStudents = () => {
    return allUsers.filter(u => u.role === 'student');
  };

  const getStudentsByTeacher = (teacherId) => {
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
