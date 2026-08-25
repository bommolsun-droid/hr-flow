"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download } from "lucide-react";

type DepartmentKPI = {
  department_name: string;
  total: number;
  resigned: number;
  resign_rate: number;
};

type KPIData = {
  total_employees: number;
  resign_rate: number;
  avg_tenure_years: number;
  avg_eval_score: number;
  training_completion_rate: number;
  by_department: DepartmentKPI[];
};

type AIReportData = {
  kpi: KPIData;
  ai_summary: string;
};

export default function AIReportPage() {
  const [data, setData] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = () => {
    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:5000/api/ai-summary")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const downloadReport = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="p-8">
      {/* 화면에서만 보이는 헤더/버튼 (인쇄 시 숨김) */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI 리포트</h1>
          <p className="text-sm text-gray-400 mt-1">
            HR 데이터를 기반으로 AI가 조직의 주요 변화를 요약합니다
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                AI 분석하기
              </>
            )}
          </button>
          {data && (
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              리포트 다운로드
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4 mb-6 print:hidden">
          분석 요청에 실패했습니다: {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm print:hidden">
          아직 분석을 실행하지 않았습니다. 위 버튼을 눌러 AI 분석을 시작하세요.
        </div>
      )}

      {/* 리포트 본문 (인쇄될 영역) */}
      {data && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 print:border-0 print:shadow-none print:p-0">
          {/* 리포트 헤더 */}
          <div className="border-b border-gray-100 pb-5 mb-6">
            <p className="text-xs text-gray-400">HR Flow AI · 월간 인사 리포트</p>
            <h2 className="text-lg font-bold text-gray-900 mt-1">{today} 기준 조직 현황 리포트</h2>
          </div>

          {/* KPI 요약 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-xs text-gray-400">전체 직원 수</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{data.kpi.total_employees}명</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">전체 퇴사율</p>
              <p className="text-xl font-bold text-red-500 mt-1">{data.kpi.resign_rate}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">평균 근속기간</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{data.kpi.avg_tenure_years}년</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">교육 이수율</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">{data.kpi.training_completion_rate}%</p>
            </div>
          </div>

          {/* 부서별 표 */}
          <p className="text-sm font-semibold text-gray-800 mb-3">부서별 현황</p>
          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">부서</th>
                <th className="py-2 font-medium">인원</th>
                <th className="py-2 font-medium">퇴사자</th>
                <th className="py-2 font-medium">퇴사율</th>
              </tr>
            </thead>
            <tbody>
              {data.kpi.by_department.map((dept) => (
                <tr key={dept.department_name} className="border-b border-gray-50">
                  <td className="py-2.5 text-gray-900 font-medium">{dept.department_name}</td>
                  <td className="py-2.5 text-gray-500">{dept.total}명</td>
                  <td className="py-2.5 text-gray-500">{dept.resigned}명</td>
                  <td className="py-2.5 text-gray-500">{dept.resign_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AI 분석 */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-indigo-600" />
            <p className="text-sm font-semibold text-gray-800">AI 분석 결과</p>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {data.ai_summary}
          </div>

          {/* 리포트 푸터 */}
          <p className="text-xs text-gray-300 mt-10 pt-4 border-t border-gray-100">
            본 리포트는 가상 데이터를 기반으로 자동 생성되었으며, AI 분석 결과는 참고용입니다.
          </p>
        </div>
      )}
    </main>
  );
}