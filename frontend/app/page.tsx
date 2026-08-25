import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Sparkles, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 상단 네비 */}
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

      {/* 히어로: 왼쪽 글 + 오른쪽 노트북 */}
      <section className="px-10 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr] gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 leading-snug">
            복잡한 인사 데이터,
            <br />
            단순하고 명확하게 관리하세요
          </h1>
          <p className="text-gray-500 mt-5 text-base leading-relaxed">
            반복적인 HR 운영 업무를 자동화하고, 인사 데이터를 기반으로
            <br />
            조직의 변화를 빠르게 파악할 수 있도록 지원하는 HR AX 시스템입니다.
          </p>
          <div className="flex gap-3 mt-8">
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

        <div className="w-full">
          <div className="rounded-2xl border-[12px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
            <div className="h-4 bg-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600" />
            </div>
            <div className="relative bg-white aspect-[16/10]">
              <Image
                src="/dashboard-preview.png"
                alt="HR Flow AI 대시보드 미리보기"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
          <div className="mx-auto h-2.5 w-[94%] rounded-b-md bg-gray-300" />
          <div className="mx-auto h-4 w-full rounded-b-2xl bg-gradient-to-b from-gray-300 to-gray-400" />
        </div>
      </section>

      {/* 기능 소개 3개 */}
      <section className="px-10 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="border border-gray-100 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <LayoutDashboard size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">HR KPI 자동 계산</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            퇴사율, 근속기간, 교육 이수율 등 핵심 인사 지표를 수작업 없이 자동으로 산출합니다.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <BarChart3 size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">부서별 현황 시각화</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            부서별 인원 및 퇴사율을 차트로 시각화하여 조직 상태를 한눈에 파악할 수 있습니다.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
            <Sparkles size={22} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-base">AI 기반 조직 분석</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            LLM이 HR 데이터에서 관찰되는 패턴을 요약하고, 추가로 확인이 필요한 데이터를 제안합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
