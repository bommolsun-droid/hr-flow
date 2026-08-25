from flask import Flask, jsonify
from flask_cors import CORS
from kpi import get_kpi_summary
from ai_summary import get_ai_summary

app = Flask(__name__)
CORS(app)

@app.route("/api/kpi", methods=["GET"])
def kpi():
    data = get_kpi_summary()
    return jsonify(data)

@app.route("/api/ai-summary", methods=["GET"])
def ai_summary():
    data = get_ai_summary()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)