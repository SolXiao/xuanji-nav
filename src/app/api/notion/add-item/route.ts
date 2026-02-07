import { NextResponse } from 'next/server';
import { addItem } from '@/lib/notion';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, category, subCategory, description, icon } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await addItem({
      title,
      url,
      category,
      subCategory,
      description,
      icon,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add item' },
      { status: 500 }
    );
  }
}
