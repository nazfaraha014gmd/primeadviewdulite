import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getSafeRedirectOrigin } from '../lib/urls';
import Button from '../components/ui/Button';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectBase = getSafeRedirectOrigin();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectBase}/reset-password`,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent!');
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Check your email</h2>
        <p className="text-text-secondary mt-2">
          A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
        </p>
        <div className="mt-6">
          <Button as="a" to="/login" variant="primary" className="w-full">
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Forgot Password?</h2>
        <p className="text-text-secondary mt-1">No worries, we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
          &larr; Back to Sign In
        </Link>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
