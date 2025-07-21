import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateMetadata = {
      public_metadata: {
        isPro: true,
        promptCount: 0,
        promptResetTime: null,
      },
    };

    const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(updateMetadata),
    });

    if (!clerkRes.ok) {
      const errText = await clerkRes.text();
      console.error('Failed to update user via REST:', errText);
      return NextResponse.json({ error: 'Failed to update Clerk metadata' }, { status: 500 });
    }

    const user = await clerkRes.json();
    return NextResponse.json({ message: 'User upgraded to Pro successfully!', user });
  } catch (error) {
    console.error('Error upgrading user:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
