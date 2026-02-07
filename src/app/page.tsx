import { getDatabase } from '@/lib/notion';
import SearchableNavigation from '@/components/SearchableNavigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';

export const revalidate = 0; // 禁用静态缓存，确保部署后数据实时更新

export default async function Home() {
  const items = await getDatabase();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[--bg-starry] to-[--primary-dark] text-[--foreground]">
      <Navbar items={items} />

      <main className="w-full max-w-[1400px] flex flex-col pt-24 px-6 md:px-10 lg:px-12">
        <SearchableNavigation items={items} />
      </main>

      <Footer />

      {/* Cookie 同意横幅 */}
      <CookieBanner />

    </div>
  );
}
