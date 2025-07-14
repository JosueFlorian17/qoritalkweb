from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/guardar_respuestas", methods=["POST"])
def guardar_respuestas():
    try:
        data = request.json  # una lista con 3 respuestas de audio

        # Añadir timestamp a la sesión
        session = {
            "timestamp": datetime.now().isoformat(),
            "respuestas": data
        }

        # Cargar archivo existente o crear uno nuevo
        if os.path.exists("respuestas.json"):
            with open("respuestas.json", "r", encoding="utf-8") as f:
                historial = json.load(f)
        else:
            historial = []

        historial.append(session)

        with open("respuestas.json", "w", encoding="utf-8") as f:
            json.dump(historial, f, ensure_ascii=False, indent=4)

        return jsonify({"status": "ok", "message": "Respuestas guardadas con éxito."})
    
    except Exception as e:
        print("❌ Error al guardar respuestas:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route("/ver_respuestas", methods=["GET"])
def ver_respuestas():
    if os.path.exists("respuestas.json"):
        with open("respuestas.json", "r", encoding="utf-8") as f:
            historial = json.load(f)
        return jsonify(historial)
    else:
        return jsonify([])

if __name__ == "__main__":
    app.run(debug=True)
