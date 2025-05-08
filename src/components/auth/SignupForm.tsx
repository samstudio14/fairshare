'use client';

import React, { useState } from 'react';

interface SignupFormProps {
  onSignupComplete: (userId: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateIndianPhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateIndianPhoneNumber(phoneNumber)) {
      setError('Please enter a valid Indian mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setStep('OTP');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      onSignupComplete(data.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome to FairShare
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Split expenses with friends and family
          </p>
        </div>

        {step === 'PHONE' ? (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <label htmlFor="phone-number" className="sr-only">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                  +91
                </span>
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="appearance-none rounded-r-md relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-700"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length !== 10}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOTPSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-700"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupForm; 