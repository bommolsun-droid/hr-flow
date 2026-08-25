import Link from "next/link";
import { LayoutDashboard, Sparkles, BarChart3, Users } from "lucide-react";
import LaptopPreview from "../components/LaptopPreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-10 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">HR Flow AI</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          대시보드 보기
        </Link>
      </header>

      <section className="px-10 py-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600 mb-3">HR AX · 인사 운영 자동화</p>
          <h1 className="text-4xl md:text-[2.6rem] font-bold text-gray-900 leading-snug tracking-tight">
            복잡한 인사 데이터,
            <br />
            단순하고 명확하게 관리하세요
          </h1>
          <p className="text-gray-500 mt-5 text-base leading-relaxed max-w-md">
            퇴사율·근속·교육 지표를 한눈에 보고, AI가 조직 변화를 요약합니다.
            HR 운영에 필요한 인사이트를 더 빠르게 확인하세요.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              대시보드 체험하기
            </Link>
            <Link
              href="/dashboard/ai-report"
              className="border border-gray-200 text-gray-700 text-sm font-medium px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              AI 리포트 보기
            </Link>
          </div>
        </div>

        <LaptopPreview />
      </section>

      <section className="px-10 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="border border-gray-100 rounded-2xl p-8 hover:border-indigo-100 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <LayoutDashboard size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">HR KPI 자동 계산</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            퇴사율, 근속기간, 교육 이수율 등 핵심 인사 지표를 수작업 없이 자동으로 산출합니다.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8 hover:border-indigo-100 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <Users size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">부서·직원 현황 조회</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            부서별 퇴사율 차트와 직원 검색·필터로 조직 상태를 빠르게 파악할 수 있습니다.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8 hover:border-indigo-100 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <Sparkles size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">AI 기반 분석 및 PDF 다운로드</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
             LLM이 HR 데이터에서 관찰되는 패턴을 요약하고,
              분석 결과를 PDF로 다운로드해 보고서로 활용할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
