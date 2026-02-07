
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-gray-100 flex flex-col">
      <Navbar items={[]} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-32 md:py-48 animate-in fade-in duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[--accent] to-purple-400">
          隐私权政策
        </h1>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. 数据存储原则</h2>
            <p>
              璇玑导航 (XuanJi Navigator) 承诺遵守“数据最小化”原则。
              您的所有自定义导航数据（包括但不限于链接、标题、分类）均直接存储在<span className="text-[--accent] font-bold">您的 Notion 数据库</span>中。
            </p>
            <p className="mt-4">
              我们仅作为一个前端展示界面，<span className="text-red-400 font-bold">不持有、不存储、不分析</span>您的任何个人数据。
              所有数据交互均通过加密的 API 直接与 Notion 官方服务器进行。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. 本地缓存</h2>
            <p>
              为了提升访问速度，我们可能会在您的浏览器中使用 <code className="bg-white/10 px-2 py-0.5 rounded text-sm">IndexedDB</code> 进行临时数据缓存。
              这些数据仅存在于您的设备上，您可以随时通过清空浏览器缓存来移除它们。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. 第三方服务</h2>
            <p>
              本站可能会包含指向第三方网站的链接。我们不对这些第三方网站的隐私惯例负责。
              建议您在访问只需查看其隐私政策。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              4. Notion 数据隐私保障
            </h2>
            <div className="space-y-4 px-6 py-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/5">
              <p>
                璇玑导航使用 Notion API 作为数据源，但我们对您的数据安全和隐私有严格的保障措施：
              </p>

              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong className="text-white">完全控制</strong>：您的 Notion 数据完全由您控制，我们无法访问、存储或修改您的任何数据</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong className="text-white">密钥安全</strong>：所有 Notion API 密钥均由您自行管理，存储在您的环境变量中</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong className="text-white">仅展示</strong>：本应用仅作为数据展示工具，不会对您的 Notion 数据库进行任何修改</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong className="text-white">加密传输</strong>：所有数据传输采用 HTTPS 加密协议，确保数据安全</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong className="text-white">开源透明</strong>：项目代码完全开源，您可以随时审查我们的数据处理方式</span>
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-200 leading-relaxed">
                  💡 <strong>提示</strong>：如果您对数据安全有任何疑问，可以查看我们的开源代码或自行部署本项目。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. 联系我们</h2>
            <p>
              如果您对本隐私政策有任何疑问，请通过 GitHub Issues 或相关社区渠道联系我们。
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-white/10 text-center text-sm text-gray-500">
          最后更新：2026年2月7日
        </div>
      </main>

      <Footer />
    </div>
  );
}
