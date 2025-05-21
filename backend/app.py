from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuración de base de datos (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelos
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(10), nullable=False)  # Ej: "2025-05-20"
    hora = db.Column(db.String(5), nullable=False)    # Ej: "15:00"
    estado = db.Column(db.String(20), default="apartada")

# Crear tablas e insertar admin por defecto
@app.before_request
def inicializar_db():
    db.create_all()
    if not Admin.query.filter_by(username='admin').first():
        admin = Admin(username='admin', password='admin123')
        db.session.add(admin)
        db.session.commit()

# Endpoint login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Admin.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Credenciales incorrectas"}), 401

# Ver reservas
@app.route('/reservas', methods=['GET'])
def get_reservas():
    reservas = Reserva.query.all()
    return jsonify([
        {"id": r.id, "fecha": r.fecha, "hora": r.hora, "estado": r.estado}
        for r in reservas
    ])

# Crear reserva
@app.route('/reservar', methods=['POST'])
def crear_reserva():
    data = request.json
    fecha = data['fecha']
    hora = data['hora']

    # Verificar si ya existe reserva en esa fecha y hora
    existente = Reserva.query.filter_by(fecha=fecha, hora=hora).first()
    if existente:
        return jsonify({"success": False, "message": "Horario ya reservado"}), 400

    nueva = Reserva(fecha=fecha, hora=hora)
    db.session.add(nueva)
    db.session.commit()
    return jsonify({"success": True, "message": "Reserva creada exitosamente"})

# Eliminar reserva
@app.route('/cancelar/<int:reserva_id>', methods=['DELETE'])
def cancelar_reserva(reserva_id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM reservas WHERE id = %s", (reserva_id,))
    mysql.connection.commit()
    return jsonify({"success": True, "message": "Reserva cancelada"})


if __name__ == '__main__':
    app.run(debug=True)
