import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
 // important for latest OpenAI SDK
});

const MAX_PROMPTS = 5;
const WAIT_TIME = 1000 * 60 * 10; // 6 hours

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get user metadata from Clerk
    const userRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error('Failed to fetch user metadata:', errText);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const user = await userRes.json();
    const metadata = user.public_metadata || {};

    const isPro = metadata.isPro || false;

    let promptCount = metadata.promptCount || 0;
    let promptResetTime = metadata.promptResetTime || 0;
    const now = Date.now();

    // 2. Only apply limits if user is NOT Pro
    if (!isPro) {
      if (now > promptResetTime) {
        promptCount = 0;
        promptResetTime = now + WAIT_TIME;
      }

      if (promptCount >= MAX_PROMPTS) {
        return NextResponse.json(
          { error: 'Prompt limit reached. Try again in 6 hours or upgrade to Pro.' },
          { status: 429 }
        );
      }
    }

    // 3. Get prompt from request body
    const { prompt } = await request.json();

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert writer who rewrites AI-generated text to sound more human, emotional, and natural. Make the output less robotic and more conversational.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    const humanized = chatCompletion.choices[0].message.content;

    // 4. Update metadata if user is NOT Pro
    if (!isPro) {
      const updateRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          public_metadata: {
            promptCount: promptCount + 1,
            promptResetTime,
          },
        }),
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error('Failed to update metadata:', errText);
        return NextResponse.json({ error: 'Failed to update prompt metadata' }, { status: 500 });
      }
    }

    return NextResponse.json({ humanized });
  } catch (error) {
    console.error('Error processing prompt:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
