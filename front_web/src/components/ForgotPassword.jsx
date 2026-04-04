import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { CUSTOMER_API } from '../config/api';
import axios from 'axios';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendOtp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(CUSTOMER_API.SEND_OTP, {
        email
      });

      if (response.data.success) {
        setStep(2);
        setSuccess('OTP sent to your email. Please check your inbox.');
      } else {
        throw new Error(response.data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(CUSTOMER_API.VERIFY_OTP, {
        email,
        otp
      });

      if (response.data.success) {
        setStep(3);
        setSuccess('OTP verified! Please set your new password.');
      } else {
        throw new Error(response.data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(CUSTOMER_API.RESET_PASSWORD, {
        email,
        new_password: newPassword
      });

      if (response.data.success) {
        setSuccess('Password reset successful! You can now sign in with your new password.');
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Password reset failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#adc6ff] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="w-full py-3 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#adc6ff] mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] text-center text-lg font-mono focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                placeholder="000000"
                maxLength={6}
                disabled={loading}
              />
              <p className="mt-2 text-xs text-[#8c909f]">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 py-3 bg-[#424754]/30 text-[#e2e2e2] font-medium rounded-lg hover:bg-[#424754]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="flex-1 py-3 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#adc6ff] mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#adc6ff] mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 py-3 bg-[#424754]/30 text-[#e2e2e2] font-medium rounded-lg hover:bg-[#424754]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={resetPassword}
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="flex-1 py-3 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans selection:bg-primary/30 selection:text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      </div>

      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[#d0bcff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <h1 className="font-serif text-3xl tracking-tight text-[#e2e2e2]">Reset Password</h1>
          <p className="text-[#c2c6d6] text-sm">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        <div className="bg-[#353535]/20 backdrop-blur-xl rounded-xl p-8 border border-white/5 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {renderStep()}

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              disabled={loading}
              className="text-sm text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors disabled:opacity-50"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export { ForgotPassword };
