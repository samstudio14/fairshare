import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, otp } = await request.json();

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // TODO: Verify OTP against stored value
    // For now, accept any 6-digit OTP
    const mockUserId = `user_${Date.now()}`; // In production, get/create real user ID

    return NextResponse.json(
      { 
        message: 'OTP verified successfully',
        userId: mockUserId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 