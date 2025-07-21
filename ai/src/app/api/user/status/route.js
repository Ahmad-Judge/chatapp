import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    const user = await currentUser();

    const isPro = user?.publicMetadata?.isPro === true;

    return NextResponse.json({ isPro }, { status: 200 });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ isPro: false }, { status: 500 });
  }
}
