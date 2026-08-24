import Link from "next/link";
import { LayoutDashboard, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100">
          <p className="text-lg font-bold text-gray-900">HR Flow AI</p>
          <p className="text-xs text-gray-400 mt-0.5">인사 운영 자동화 시스템</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50"
          >
            <LayoutDashboard size={18} />
            대시보드
          </Link>
          <Link
            href="/dashboard/ai-report"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <Sparkles size={18} />
            AI 리포트
          </Link>
        </nav>

        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-800">bommolsun</p>
          <p className="text-xs text-gray-400">HR AX 지원자</p>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1">{children}</div>
    </div>
  );
}