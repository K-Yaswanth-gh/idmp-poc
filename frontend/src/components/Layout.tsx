import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * アプリケーションの共通レイアウト
 * サイドバーとメインコンテンツエリアを含む
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen bg-aws-paper-light">
      <Sidebar />
      
      {/* メインコンテンツエリア */}
      <main className="flex-1 p-8 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
