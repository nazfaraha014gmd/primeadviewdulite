import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import PackagesPage from './pages/dashboard/PackagesPage';
import EarningsPage from './pages/dashboard/EarningsPage';
import WithdrawalsPage from './pages/dashboard/WithdrawalsPage';
import DepositsPage from './pages/dashboard/DepositsPage';
import ProfileSettingsPage from './pages/dashboard/ProfileSettingsPage';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <>
            <Toaster 
                position="top-right"
                toastOptions={{
                    className: '',
                    style: {
                        border: '1px solid #30363d',
                        padding: '16px',
                        color: '#c9d1d9',
                        backgroundColor: '#161B22',
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>
                
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<OverviewPage />} />
                    <Route path="packages" element={<PackagesPage />} />
                    <Route path="earnings" element={<EarningsPage />} />
                    <Route path="withdrawals" element={<WithdrawalsPage />} />
                    <Route path="deposits" element={<DepositsPage />} />
                    <Route path="settings" element={<ProfileSettingsPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
