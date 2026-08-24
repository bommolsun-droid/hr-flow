from flask import Flask, jsonify
from flask_cors import CORS
from kpi import get_kpi_summary

app = Flask(__name__)
CORS(app)  # Next.js(다른 포트)에서 이 API를 호출할 수 있게 허용

@app.route("/api/kpi", methods=["GET"])
def kpi():
    data = get_kpi_summary()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)