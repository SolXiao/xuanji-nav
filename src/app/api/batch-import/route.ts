import { NextRequest, NextResponse } from 'next/server';
import { batchAddItems } from '@/lib/batchImport';
import { NavigationItem } from '@/types/nav';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body as { items: Omit<NavigationItem, 'id'>[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: '请提供有效的导航项数组' },
        { status: 400 }
      );
    }

    // 验证必填字段
    for (const item of items) {
      if (!item.title || !item.url || !item.category) {
        return NextResponse.json(
          { error: '每个导航项必须包含 title、url 和 category 字段' },
          { status: 400 }
        );
      }
    }

    // 批量添加到 Notion
    const results = await batchAddItems(items, {
      concurrency: 3, // 并发数
    });

    return NextResponse.json({
      message: '批量导入完成',
      success: results.success,
      failed: results.failed,
      total: items.length,
      errors: results.errors,
    });
  } catch (error) {
    console.error('批量导入失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '批量导入失败' },
      { status: 500 }
    );
  }
}
