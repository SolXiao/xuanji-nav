import { NextRequest, NextResponse } from 'next/server';
import { updateNotionItem } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, description, category, icon } = body;

    if (!id || !title || !url) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    await updateNotionItem(id, {
      title,
      url,
      description,
      category,
      icon
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Notion item error:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}
