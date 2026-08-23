import pymysql
import os
from dotenv import load_dotenv

# .env 파일에 적어둔 DB 접속정보를 불러옴
load_dotenv()

# DB 연결
connection = pymysql.connect(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    charset="utf8mb4"
)

cursor = connection.cursor()

cursor.execute("Select count(*) from departments")
result = cursor.fetchone()
print(result)
# ===== 1. departments 데이터 생성 =====
if result[0] == 0:
    departments = ["개발", "기획", "마케팅", "인사", "재무", "고객지원"]
    for dept_name in departments:
        cursor.execute(
            "INSERT INTO departments (department_name) VALUES (%s)",
            (dept_name,)
        )
    connection.commit()
    print(f"departments {len(departments)}개 생성 완료!")
else:
    print("departments 데이터가 이미 존재합니다.")

# ===== 2. employees 300명 생성 =====
from faker import Faker
import random
from datetime import date, timedelta

fake = Faker("ko_KR")  # 한국어 이름/데이터 생성

cursor.execute("SELECT COUNT(*) FROM employees")
existing_emp_count = cursor.fetchone()[0]

if existing_emp_count == 0:
    # 부서별 목표 인원수
    dept_plan = {
    1: {"count": 90, "resign_rate": 0.18},  # 개발 - 이직 잦은 직군으로 설정
    2: {"count": 45, "resign_rate": 0.07},  # 기획
    3: {"count": 45, "resign_rate": 0.07},  # 마케팅
    4: {"count": 30, "resign_rate": 0.03},  # 인사 - 안정적인 직군
    5: {"count": 30, "resign_rate": 0.03},  # 재무 - 안정적인 직군
    6: {"count": 60, "resign_rate": 0.15},  # 고객지원 - 이직 잦은 직군
}

    positions = ["사원", "대리", "과장", "차장", "부장"]
    position_weights = [0.40, 0.30, 0.15, 0.10, 0.05]

    today = date.today()

    for dept_id, plan in dept_plan.items():
        for _ in range(plan["count"]):
            name = fake.name()

            if random.random() < 0.20:
                days_ago = random.randint(1, 365)
            else:
                days_ago = random.randint(366, 3650)
            hire_date = today - timedelta(days=days_ago)

            birth_year = random.randint(1975, 2002)
            position = random.choices(positions, weights=position_weights)[0]

            is_resigned = random.random() < plan["resign_rate"]

            if is_resigned:
                employment_status = "퇴사"
                max_days = (today - hire_date).days
                resign_offset = random.randint(30, max(max_days, 31))
                resignation_date = hire_date + timedelta(days=resign_offset)
                if resignation_date > today:
                    resignation_date = today
            else:
                employment_status = "재직"
                resignation_date = None

            cursor.execute(
                """
                INSERT INTO employees
                (name, department_id, position, hire_date, birth_year, employment_status, resignation_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (name, dept_id, position, hire_date, birth_year, employment_status, resignation_date)
            )

    connection.commit()
    print("employees 300명 생성 완료!")
else:
    print(f"employees 이미 {existing_emp_count}개 존재 — 생성 건너뜀")



# ===== 3. attendance / evaluations / training 생성 =====
cursor.execute("SELECT COUNT(*) FROM attendance")
existing_att_count = cursor.fetchone()[0]

if existing_att_count == 0:
    # 재직 중인 직원 목록만 가져오기 (퇴사자는 최근 근태 기록이 없는 게 자연스러움)
    cursor.execute("SELECT employee_id FROM employees WHERE employment_status = '재직'")
    active_employee_ids = [row[0] for row in cursor.fetchall()]

    # 최근 1개월(약 20영업일) 날짜 목록 만들기 (주말 제외)
    work_days = []
    check_date = today
    while len(work_days) < 20:
        if check_date.weekday() < 5:  # 0=월요일 ~ 4=금요일
            work_days.append(check_date)
        check_date -= timedelta(days=1)

    status_options = ["정상", "정상", "정상", "정상", "지각", "결근", "휴가"]  # 정상 비중을 높게

    attendance_rows = []
    for emp_id in active_employee_ids:
        for wd in work_days:
            status = random.choice(status_options)
            overtime = round(random.uniform(0, 3), 1) if status == "정상" and random.random() < 0.3 else 0
            attendance_rows.append((emp_id, wd, status, overtime))

    cursor.executemany(
        "INSERT INTO attendance (employee_id, date, status, overtime_hours) VALUES (%s, %s, %s, %s)",
        attendance_rows
    )
    connection.commit()
    print(f"attendance {len(attendance_rows)}건 생성 완료!")
else:
    print(f"attendance 이미 {existing_att_count}건 존재 — 생성 건너뜀")


# ----- evaluations -----
cursor.execute("SELECT COUNT(*) FROM evaluations")
existing_eval_count = cursor.fetchone()[0]

if existing_eval_count == 0:
    cursor.execute("SELECT employee_id FROM employees")
    all_employee_ids = [row[0] for row in cursor.fetchall()]

    evaluation_rows = []
    for emp_id in all_employee_ids:
        num_evals = random.randint(1, 3)
        for _ in range(num_evals):
            eval_date = today - timedelta(days=random.randint(30, 365))
            score = round(random.uniform(60, 98), 1)
            evaluation_rows.append((emp_id, eval_date, score))

    cursor.executemany(
        "INSERT INTO evaluations (employee_id, evaluation_date, score) VALUES (%s, %s, %s)",
        evaluation_rows
    )
    connection.commit()
    print(f"evaluations {len(evaluation_rows)}건 생성 완료!")
else:
    print(f"evaluations 이미 {existing_eval_count}건 존재 — 생성 건너뜀")


# ----- training -----
cursor.execute("SELECT COUNT(*) FROM training")
existing_train_count = cursor.fetchone()[0]

if existing_train_count == 0:
    cursor.execute("SELECT employee_id FROM employees")
    all_employee_ids = [row[0] for row in cursor.fetchall()]

    training_names = ["신입 온보딩", "정보보안 교육", "직무역량 강화", "리더십 교육", "컴플라이언스 교육"]

    training_rows = []
    for emp_id in all_employee_ids:
        num_trainings = random.randint(1, 3)
        chosen_trainings = random.sample(training_names, num_trainings)
        for tname in chosen_trainings:
            completed = random.random() < 0.82  # 교육 이수율 약 82%
            completed_date = (today - timedelta(days=random.randint(1, 300))) if completed else None
            training_rows.append((emp_id, tname, completed, completed_date))

    cursor.executemany(
        "INSERT INTO training (employee_id, training_name, completed, completed_date) VALUES (%s, %s, %s, %s)",
        training_rows
    )
    connection.commit()
    print(f"training {len(training_rows)}건 생성 완료!")
else:
    print(f"training 이미 {existing_train_count}건 존재 — 생성 건너뜀")





cursor.close()
connection.close()
