import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('bbq_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication for demo purposes
    // In a real app, this would validate against a backend
    if (username === 'admin' && password === 'bbqadmin') {
      localStorage.setItem('bbq_admin_token', 'demo_token_123');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('bbq_admin_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Brown's Bar-B-Cue Admin</title>
        <meta name="description" content="Admin dashboard for Brown's Bar-B-Cue" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <AdminDashboard onLogout={handleLogout} />
        )}
      </div>
    </>
  );
};

export default AdminPage;
