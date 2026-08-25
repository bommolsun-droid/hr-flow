"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Employee = {
  employee_id: number;
  name: string;
  department_name: string;
  position: string;
  hire_date: string;
  employment_status: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/employees")
      .then((res) => res.json())
      .then((json) => {
        setEmployees(json);
        setLoading(false);
      });
  }, []);

  const departments = ["전체", ...Array.from(new Set(employees.map((e) => e.department_name)))];

  const filtered = employees.filter((e) => {
    const matchesSearch = e.name.includes(search);
    const matchesDept = deptFilter === "전체" || e.department_name === deptFilter;
    const matchesStatus = statusFilter === "전체" || e.employment_status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  if (loading) {
    return <div className="p-10 text-gray-400">불러오는 중...</div>;
  }

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">직원 조회</h1>
        <p className="text-sm text-gray-400 mt-1">전체 {employees.length}명의 직원 정보를 확인하세요</p>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="이름으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          {departments.map((d) => (
            <option key={d} value={d} className="text-gray-700 bg-white">{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="전체" className="text-gray-700 bg-white">전체 상태</option>
          <option value="재직" className="text-gray-700 bg-white">재직</option>
          <option value="퇴사" className="text-gray-700 bg-white">퇴사</option>
        </select>
      </div>

      {/* 표 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 font-medium">이름</th>
              <th className="py-3 px-4 font-medium">부서</th>
              <th className="py-3 px-4 font-medium">직급</th>
              <th className="py-3 px-4 font-medium">입사일</th>
              <th className="py-3 px-4 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.employee_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="py-2.5 px-4 text-gray-900 font-medium">{e.name}</td>
                <td className="py-2.5 px-4 text-gray-500">{e.department_name}</td>
                <td className="py-2.5 px-4 text-gray-500">{e.position}</td>
                <td className="py-2.5 px-4 text-gray-500">{e.hire_date}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      e.employment_status === "재직"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {e.employment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">검색 결과가 없습니다</div>
        )}
      </div>
    </main>
  );
}