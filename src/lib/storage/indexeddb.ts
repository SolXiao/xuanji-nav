import { openDB, IDBPDatabase } from 'idb';
import { NavigationItem } from '@/types/nav';

const DB_NAME = 'xuanji_db';
const STORE_NAME = 'links';
const DB_VERSION = 1;

export interface DBInstance extends IDBPDatabase {
  put(storeName: string, value: any, key?: any): Promise<any>;
  get(storeName: string, key: any): Promise<any>;
  delete(storeName: string, key: any): Promise<void>;
  clear(storeName: string): Promise<void>;
  getAll(storeName: string): Promise<any[]>;
}

/**
 * 初始化数据库
 */
export async function initDB(): Promise<DBInstance> {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
  return db as DBInstance;
}

/**
 * 缓存所有导航项
 */
export async function cacheLinks(items: NavigationItem[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  for (const item of items) {
    await store.put(item);
  }
  await tx.done;
}

/**
 * 获取本地缓存的所有链接
 */
export async function getCachedLinks(): Promise<NavigationItem[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

/**
 * 添加/更新单个链接（用于快速添加功能）
 */
export async function saveLocalLink(item: NavigationItem) {
  const db = await initDB();
  await db.put(STORE_NAME, item);
}

/**
 * 删除单个链接
 */
export async function deleteLocalLink(id: string) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}
