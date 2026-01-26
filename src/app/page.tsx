import { getDatabase } from '@/lib/notion';
import SearchableNavigation from '@/components/SearchableNavigation';
import NetworkStatus from '@/components/NetworkStatus';
import AddItemButton from '@/components/AddItemButton';
import { NavigationItem } from '@/types/nav';

export default async function Home() {
  const items = await getDatabase();

  // Group items by category
  const categories: Record<string, NavigationItem[]> = {};
  items.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-[--bg-starry] to-[--primary-dark] text-[--foreground]">
      <main className="w-full max-w-6xl flex flex-col gap-8 px-4">
        <header className="flex flex-col items-center gap-4 py-8 md:py-16">
          <div className="relative group cursor-default">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[--accent] to-[--secondary] opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
            <h1 className="relative text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--accent-light] via-white to-[--accent-light] select-none text-shadow-glow">
              璇玑
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[--accent-light] font-light tracking-[0.5em] opacity-80">
            XUANJI NAV
          </p>
        </header>

        <SearchableNavigation items={items} />
      </main>

      <footer className="mt-20 py-8 text-center text-sm text-gray-500 border-t border-white/5 w-full">
        XuanJi Navigator &copy; {new Date().getFullYear()} | Powered by Notion
      </footer>
      <NetworkStatus />

      <AddItemButton existingCategories={Object.keys(categories)} />
    </div>
  );
}

