from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from datetime import datetime
import json
import os
import base64

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

USUARIO = "admin-qoritalk"
CONTRASENA = "qoritalk-ver-respuestas"

def check_auth(auth_header):
    if not auth_header:
        return False
    try:
        tipo, credenciales = auth_header.split()
        if tipo.lower() != "basic":
            return False
        decoded = base64.b64decode(credenciales).decode("utf-8")
        usuario, contrasena = decoded.split(":", 1)
        return usuario == USUARIO and contrasena == CONTRASENA
    except Exception:
        return False

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/guardar_respuestas", methods=["POST"])
def guardar_respuestas():
    try:
        data = request.json
        session = {
            "timestamp": datetime.now().isoformat(),
            "respuestas": data
        }

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
    auth = request.headers.get("Authorization")
    if not check_auth(auth):
        return Response(
            "Acceso denegado.\n",
            401,
            {"WWW-Authenticate": 'Basic realm="Acceso restringido"'}
        )

    if os.path.exists("respuestas.json"):
        with open("respuestas.json", "r", encoding="utf-8") as f:
            historial = json.load(f)
        return jsonify(historial)
    else:
        return jsonify([])

if __name__ == "__main__":
    app.run(debug=True)