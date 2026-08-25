"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { ChevronDown, ShieldAlert } from "lucide-react";

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

const WARNING_THRESHOLD = 20;
const PIE_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#eef2ff"];

export default function DashboardPage() {
  const [data, setData] = useState<KPIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/kpi")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="p-10 text-red-500">API 호출 실패: {error}</div>;
  }
  if (!data) {
    return <div className="p-10 text-gray-400">불러오는 중...</div>;
  }

  const rankedDepartments = [...data.by_department].sort(
    (a, b) => b.resign_rate - a.resign_rate
  );
  const totalResigned = rankedDepartments.reduce((sum, d) => sum + d.resigned, 0);
  const warningDepartments = rankedDepartments.filter(
    (d) => d.resign_rate >= WARNING_THRESHOLD
  );
  const warningNames = warningDepartments.map((d) => d.department_name);

  const kpiCards = [
    {
      label: "전체 퇴사율",
      value: `${data.resign_rate}%`,
      hint: "전체 직원 대비",
    },
    {
      label: "총 퇴사자 수",
      value: `${totalResigned}명`,
      hint: "누적 퇴사 인원",
    },
    {
      label: "평균 근속기간",
      value: `${data.avg_tenure_years}년`,
      hint: "재직자 기준",
    },
    {
      label: "경고 부서 수",
      value: `${warningDepartments.length}`,
      hint: `퇴사율 ${WARNING_THRESHOLD}% 이상`,
    },
  ];

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">부서별 퇴사율</h1>
          <p className="text-sm text-gray-400 mt-1">
            조직의 퇴사 현황을 한눈에 확인하세요
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm"
          disabled
          title="현재는 전체 회사 기준만 지원합니다"
        >
          전체 회사
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="text-2xl font-bold mt-1.5 text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1.5">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-800 mb-4">
            부서별 퇴사율 분포
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rankedDepartments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="department_name"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, "auto"]}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "퇴사율"]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                }}
              />
              <ReferenceLine
                y={WARNING_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: `경고 ${WARNING_THRESHOLD}%`,
                  position: "insideTopRight",
                  fill: "#ef4444",
                  fontSize: 11,
                }}
              />
              <Bar dataKey="resign_rate" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {rankedDepartments.map((dept) => (
                  <Cell
                    key={dept.department_name}
                    fill={
                      dept.resign_rate >= WARNING_THRESHOLD ? "#ef4444" : "#a5b4fc"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 부서별 인원 분포 도넛차트 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-800 mb-4">부서별 인원 분포</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={rankedDepartments}
                dataKey="total"
                nameKey="department_name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {rankedDepartments.map((dept, i) => (
                  <Cell key={dept.department_name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}명`, "인원"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 부서별 퇴사 현황 표 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-4">부서별 퇴사 현황</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="py-2.5 font-medium w-10">#</th>
              <th className="py-2.5 font-medium">부서</th>
              <th className="py-2.5 font-medium">퇴사자</th>
              <th className="py-2.5 font-medium">퇴사율</th>
            </tr>
          </thead>
          <tbody>
            {rankedDepartments.map((dept, index) => {
              const isWarning = dept.resign_rate >= WARNING_THRESHOLD;
              return (
                <tr
                  key={dept.department_name}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-3 text-gray-400">{index + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {dept.department_name}
                      </span>
                      {isWarning && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-600">
                          경고
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{dept.resigned}명</td>
                  <td className="py-3">
                    <span
                      className={`font-semibold ${
                        isWarning ? "text-red-600" : "text-gray-700"
                      }`}
                    >
                      {dept.resign_rate}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 하단 경고 배너 */}
      {warningDepartments.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">퇴사율 주의 부서</p>
              <p className="text-sm text-red-600/90 mt-0.5">
                {warningNames.join(", ")} 부서가 퇴사율 {WARNING_THRESHOLD}%를
                초과했습니다. 원인 분석과 대응 전략 수립을 권장합니다.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/ai-report"
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            상세 분석 보기 →
          </Link>
        </div>
      )}
    </main>
  );
}
