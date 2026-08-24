import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>HR Flow AI</h1>
      <p>AI 기반 HR 운영 데이터 분석 및 업무 자동화 시스템</p>
      <Link href="/dashboard" style={{ color: "blue", textDecoration: "underline" }}>
        대시보드 바로가기 →
      </Link>
    </main>
  );
}