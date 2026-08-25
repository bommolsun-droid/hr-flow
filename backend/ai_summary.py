import os
import time
from google import genai
from dotenv import load_dotenv
from kpi import get_kpi_summary

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_ai_summary():
    start = time.time()
    kpi = get_kpi_summary()
    print(f"[시간측정] KPI 계산: {time.time() - start:.2f}초")

    dept_lines = []
    for d in kpi["by_department"]:
        dept_lines.append(
            f"- {d['department_name']}팀: 인원 {d['total']}명, 퇴사율 {d['resign_rate']}%"
        )
    dept_text = "\n".join(dept_lines)

    prompt = f"""
당신은 조직 데이터를 분석하는 HR 데이터 분석가입니다.

다음은 한 회사의 HR 운영 데이터입니다.

전체 직원 수: {kpi['total_employees']}명
전체 퇴사율: {kpi['resign_rate']}%
평균 근속기간: {kpi['avg_tenure_years']}년
평균 평가점수: {kpi['avg_eval_score']}점
교육 이수율: {kpi['training_completion_rate']}%

부서별 현황:
{dept_text}

위 데이터를 바탕으로 아래 두 가지를 작성하세요.

1. 관찰 가능한 주요 변화 3가지 요약
2. 위 관찰을 더 정확히 판단하기 위해 추가로 확인이 필요한 데이터 제안

중요 원칙:
- 데이터에서 관찰되는 패턴만 서술하고, 원인을 단정적으로 판단하지 마세요.
- 상관관계를 인과관계처럼 표현하지 마세요.
- 구성원 경험과 조직 운영 관점에서 서술하세요.
- 한국어로, 간결하고 명확하게 작성하세요.
"""

    ai_start = time.time()
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )
    print(f"[시간측정] Gemini 응답: {time.time() - ai_start:.2f}초")

    return {
        "kpi": kpi,
        "ai_summary": response.text
    }


if __name__ == "__main__":
    result = get_ai_summary()
    print(result["ai_summary"])