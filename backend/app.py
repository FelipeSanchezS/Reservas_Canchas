from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
#from app import db

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

class Cancha(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # Fútbol 5 o Fútbol 7

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(10), nullable=False)  # Formato YYYY-MM-DD
    hora = db.Column(db.String(5), nullable=False)    # Formato HH:MM
    estado = db.Column(db.String(20), default="apartada")
    cancha_id = db.Column(db.Integer, db.ForeignKey('cancha.id'), nullable=False)
    cancha = db.relationship('Cancha', backref='reservas', lazy=True)

# Crear base de datos
with app.app_context():
    db.create_all()

# Crear tablas e insertar datos por defecto
@app.before_request
def inicializar_db():
    db.create_all()

    # Insertar canchas si no existen
    if Cancha.query.count() == 0:
        canchas = [
            Cancha(nombre="Cancha F5 - A", tipo="Fútbol 5"),
            Cancha(nombre="Cancha F5 - B", tipo="Fútbol 5"),
            Cancha(nombre="Cancha F5 - C", tipo="Fútbol 5"),
            Cancha(nombre="Cancha F7 - A", tipo="Fútbol 7"),
            Cancha(nombre="Cancha F7 - B", tipo="Fútbol 7"),
        ]
        db.session.add_all(canchas)
        db.session.commit()

    # Insertar administrador por defecto
    if not Admin.query.filter_by(username='admin').first():
        admin = Admin(username='admin', password='admin123')
        db.session.add(admin)
        db.session.commit()

# Endpoint: login de administrador
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Admin.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Credenciales incorrectas"}), 401

# Endpoint: obtener todas las reservas
@app.route('/reservas', methods=['GET'])
def get_reservas():
    reservas = Reserva.query.all()
    return jsonify([
        {
            "id": r.id,
            "fecha": r.fecha,
            "hora": r.hora,
            "estado": r.estado,
            "cancha_id": r.cancha.id,
            "cancha_nombre": r.cancha.nombre
        } for r in reservas
    ])

# Endpoint: crear nueva reserva
@app.route('/reservar', methods=['POST'])
def crear_reserva():
    data = request.json
    fecha = data['fecha']
    hora = data['hora']
    cancha_id = data['cancha_id']

    existente = Reserva.query.filter_by(fecha=fecha, hora=hora, cancha_id=cancha_id).first()
    if existente:
        return jsonify({"success": False, "message": "Ese horario ya está reservado para esta cancha"}), 400

    nueva = Reserva(fecha=fecha, hora=hora, cancha_id=cancha_id)
    db.session.add(nueva)
    db.session.commit()
    return jsonify({"success": True, "message": "Reserva creada exitosamente"})

# Endpoint: eliminar reserva
@app.route('/reservas/<int:id>', methods=['DELETE'])
def eliminar_reserva(id):
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({"success": False, "message": "Reserva no encontrada"}), 404

    db.session.delete(reserva)
    db.session.commit()
    return jsonify({"success": True, "message": "Reserva eliminada exitosamente"})

# Endpoint: obtener lista de canchas
@app.route('/canchas', methods=['GET'])
def get_canchas():
    canchas = Cancha.query.all()
    return jsonify([
        {"id": c.id, "nombre": c.nombre, "tipo": c.tipo}
        for c in canchas
    ])

if __name__ == '__main__':
    app.run(debug=True)
