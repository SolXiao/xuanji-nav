import { getDatabase } from '@/lib/notion';
import SearchableNavigation from '@/components/SearchableNavigation';
import AddItemButton from '@/components/AddItemButton';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppShell } from '@/components/layout/AppShell';
import { SearchProvider } from '@/context/SearchContext';

export const revalidate = 0; // 禁用静态缓存，确保部署后数据实时更新

export default async function Home() {
  const items = await getDatabase();

  // Group items by category for AddItemButton
  const categories: string[] = Array.from(new Set(items.map(item => item.category)));

  return (
    <SearchProvider>
      <AppShell
        header={<Navbar items={items} />}
        footer={<Footer />}
      >
        <SearchableNavigation items={items} />
        <AddItemButton existingCategories={categories} />
      </AppShell>
    </SearchProvider>
  );
}
