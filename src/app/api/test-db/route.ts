import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';

export async function GET() {
  try {
    // Log environment variable status (but not the actual value for security)
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await connectDB();
    return NextResponse.json({ 
      message: 'Database connected successfully!',
      envExists: !!process.env.MONGODB_URI
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to database',
        envExists: !!process.env.MONGODB_URI,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 