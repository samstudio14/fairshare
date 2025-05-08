import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual OTP service
    // For now, we'll simulate OTP sending
    const mockOTP = '123456'; // In production, generate a random OTP

    // Store OTP in session/database for verification
    // For now, we'll just return success
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 