import { redirect } from 'next/navigation';

export default function Home() {
  // Temporarily redirect to signup page
  // This should be replaced with proper auth check later
  redirect('/signup');
  
  return null;
} 