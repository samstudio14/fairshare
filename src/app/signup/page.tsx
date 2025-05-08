'use client';

import { redirect } from 'next/navigation';
import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  const handleSignupComplete = (userId: string) => {
    // After successful signup, redirect to the dashboard or home page
    redirect('/');
  };

  return (
    <main>
      <SignupForm onSignupComplete={handleSignupComplete} />
    </main>
  );
} 