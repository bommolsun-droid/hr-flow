"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

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

  const kpiCards = [
    { label: "전체 직원 수", value: `${data.total_employees}명`, accent: "text-gray-900" },
    { label: "퇴사율", value: `${data.resign_rate}%`, accent: "text-red-500" },
    { label: "평균 근속기간", value: `${data.avg_tenure_years}년`, accent: "text-gray-900" },
    { label: "교육 이수율", value: `${data.training_completion_rate}%`, accent: "text-indigo-600" },
  ];

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-400 mt-1">조직의 인사 현황을 한눈에 확인하세요</p>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* 차트 2개 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* 부서별 퇴사율 막대차트 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-800 mb-4">부서별 퇴사율</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.by_department}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="department_name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(value) => [`${value}%`, "퇴사율"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Bar dataKey="resign_rate" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 부서별 인원 분포 도넛차트 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-800 mb-4">부서별 인원 분포</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.by_department}
                dataKey="total"
                nameKey="department_name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.by_department.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}명`, "인원"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
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

      {/* 부서별 상세 표 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-800 mb-4">부서별 상세 현황</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="py-2.5 font-medium">부서</th>
              <th className="py-2.5 font-medium">인원</th>
              <th className="py-2.5 font-medium">퇴사자</th>
              <th className="py-2.5 font-medium">퇴사율</th>
            </tr>
          </thead>
          <tbody>
            {data.by_department.map((dept) => (
              <tr key={dept.department_name} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-gray-900 font-medium">{dept.department_name}</td>
                <td className="py-3 text-gray-500">{dept.total}명</td>
                <td className="py-3 text-gray-500">{dept.resigned}명</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      dept.resign_rate >= 15
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {dept.resign_rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}