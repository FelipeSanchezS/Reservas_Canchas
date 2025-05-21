from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelos
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))  # Para práctica básica (no usar en producción así)

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(10))  # formato: yyyy-mm-dd
    hora = db.Column(db.String(5))    # formato: HH:MM
    estado = db.Column(db.String(20), default="apartada")

# Inicializar base de datos
@app.before_first_request
def crear_tablas():
    db.create_all()
    # Crear usuario admin si no existe
    if not Admin.query.filter_by(username='admin').first():
        db.session.add(Admin(username='admin', password='admin123'))
        db.session.commit()

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Admin.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

# Ver reservas
@app.route('/reservas', methods=['GET'])
def ver_reservas():
    reservas = Reserva.query.all()
    return jsonify([
        {"fecha": r.fecha, "hora": r.hora, "estado": r.estado}
        for r in reservas
    ])

# Crear reserva
@app.route('/reservar', methods=['POST'])
def reservar():
    data = request.json
    fecha = data['fecha']
    hora = data['hora']
    
    # Verificar si ya está ocupada
    existente = Reserva.query.filter_by(fecha=fecha, hora=hora).first()
    if existente:
        return jsonify({"success": False, "msg": "Horario ya reservado"}), 400
    
    nueva = Reserva(fecha=fecha, hora=hora)
    db.session.add(nueva)
    db.session.commit()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
