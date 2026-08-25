import pandas as pd
from db import get_connection

def get_kpi_summary():
    connection = get_connection()

    employees_df = pd.read_sql("SELECT * FROM employees", connection)
    departments_df = pd.read_sql("SELECT * FROM departments", connection)
    evaluations_df = pd.read_sql("SELECT * FROM evaluations", connection)
    training_df = pd.read_sql("SELECT * FROM training", connection)

    connection.close()

    # ---- 전체 직원 수 ----
    total_employees = len(employees_df)

    # ---- 전체 퇴사율 ----
    total_resigned = len(employees_df[employees_df["employment_status"] == "퇴사"])
    resign_rate = round(total_resigned / total_employees * 100, 1)

    # ---- 평균 근속기간 ----
    active_df = employees_df[employees_df["employment_status"] == "재직"].copy()
    active_df["hire_date"] = pd.to_datetime(active_df["hire_date"])
    today = pd.Timestamp.now()
    active_df["tenure_years"] = (today - active_df["hire_date"]).dt.days / 365
    avg_tenure_years = round(active_df["tenure_years"].mean(), 1)

    # ---- 평균 평가점수 ----
    avg_eval_score = round(evaluations_df["score"].mean(), 1)

    # ---- 교육 이수율 ----
    training_completion_rate = round(training_df["completed"].mean() * 100, 1)

    # ---- 부서별 인원수 / 퇴사율 ----
    merged_df = employees_df.merge(departments_df, on="department_id")
    dept_summary = merged_df.groupby("department_name").agg(
        total=("employee_id", "count"),
        resigned=("employment_status", lambda x: (x == "퇴사").sum())
    ).reset_index()
    dept_summary["resign_rate"] = round(dept_summary["resigned"] / dept_summary["total"] * 100, 1)

    # DataFrame을 JSON으로 보내기 좋은 리스트[딕셔너리] 형태로 변환
    by_department = dept_summary.to_dict(orient="records")

    return {
        "total_employees": int(total_employees),
        "resign_rate": float(resign_rate),
        "avg_tenure_years": float(avg_tenure_years),
        "avg_eval_score": float(avg_eval_score),
        "training_completion_rate": float(training_completion_rate),
        "by_department": by_department
    }

def get_employee_list():
    connection = get_connection()

    query = """
        SELECT
            e.employee_id,
            e.name,
            d.department_name,
            e.position,
            e.hire_date,
            e.employment_status
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        ORDER BY e.employee_id
    """
    df = pd.read_sql(query, connection)
    connection.close()

    # 날짜(Timestamp) 타입을 문자열로 변환 (JSON 직렬화를 위해)
    df["hire_date"] = df["hire_date"].astype(str)

    return df.to_dict(orient="records")


if __name__ == "__main__":
    result = get_kpi_summary()
    print(result)


