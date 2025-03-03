from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import requests
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Модель базы данных
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    balance = db.Column(db.Float, default=0.0)  # Баланс пользователя

TEMPLATES_DIR = "templates/messages"
HISTORY_DIR = "history"

@app.route('/')
def index():
    if 'user' in session:
        username = session['user']
        user = User.query.filter_by(username=username).first()

        if not user:
            flash('Пользователь не найден. Пожалуйста, войдите в систему.', 'danger')
            return redirect(url_for('login'))

        # Путь к файлу шаблона пользователя
        template_path = os.path.join(TEMPLATES_DIR, f"{username}_message.txt")
        if os.path.exists(template_path):
            with open(template_path, "r", encoding="utf-8") as file:
                template_content = file.read()
        else:
            template_content = ""

        # Показ истории отправок
        today = datetime.now().strftime('%Y-%m-%d')
        history = get_history(username, date=today)

        return render_template(
            'index.html',
            user=username,
            balance=user.balance,
            template_content=template_content,
            history=history,
            current_date=today
        )
    flash('Пожалуйста, войдите в систему.', 'danger')
    return redirect(url_for('login'))


# Сохранение шаблона
@app.route('/save_template', methods=['POST'])
def save_template():
    if 'user' not in session:
        return {"error": "Вы не авторизованы"}, 403

    username = session['user']
    template_text = request.form.get('template_text')
    template_path = os.path.join(TEMPLATES_DIR, f"{username}_message.txt")

    os.makedirs(TEMPLATES_DIR, exist_ok=True)
    with open(template_path, "w", encoding="utf-8") as file:
        file.write(template_text)

    return {"message": "Шаблон успешно сохранен"}

# Получение истории
@app.route('/get_history', methods=['GET'])
def get_history_route():
    if 'user' not in session:
        return {"error": "Вы не авторизованы"}, 403

    username = session['user']
    date = request.args.get('date', None)
    history = get_history(username, date=date)
    return {"history": history}

# Сохранение истории отправки
def save_history(username, phone_number, message):
    os.makedirs(HISTORY_DIR, exist_ok=True)
    history_file = os.path.join(HISTORY_DIR, f"{username}_history.json")

    try:
        with open(history_file, "r", encoding="utf-8") as file:
            history_data = json.load(file)
    except FileNotFoundError:
        history_data = []

    history_data.append({
        "date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "phone_number": phone_number,
        "message": message
    })

    with open(history_file, "w", encoding="utf-8") as file:
        json.dump(history_data, file, ensure_ascii=False, indent=4)

# Получение истории отправки
def get_history(username, date=None):
    history_file = os.path.join(HISTORY_DIR, f"{username}_history.json")

    try:
        with open(history_file, "r", encoding="utf-8") as file:
            history_data = json.load(file)
    except FileNotFoundError:
        return []

    if date:
        history_data = [
            entry for entry in history_data
            if entry["date"].startswith(date)
        ]
    return history_data

# Отправка сообщения в Telegram
TELEGRAM_BOT_TOKEN = '7634722165:AAEPhI82nVtkUY8um5USTVf8U6Gj-MPf2lc'
TELEGRAM_CHAT_ID = '-1002373420223'

@app.route('/send_message', methods=['POST'])
def send_message():
    if 'user' not in session:
        return {"error": "Вы не авторизованы"}, 403

    data = request.get_json()
    phone_number = data.get('phone_number')
    if not phone_number:
        return {"error": "Некорректный номер телефона"}, 400

    username = session['user']
    user = User.query.filter_by(username=username).first()
    template_path = os.path.join(TEMPLATES_DIR, f"{username}_message.txt")

    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as file:
            template_content = file.read()
    else:
        template_content = "Шаблон не найден"

    telegram_message = (
        f"📱 <a href='tel:{phone_number}'>{phone_number}</a>\n\n"
        f"<b>Сообщение:</b>\n{template_content}"
    )
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': telegram_message,
        'parse_mode': 'HTML'
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            save_history(username, phone_number, template_content)
            user.balance += 1.0  # Добавляем $1 за каждое отправленное сообщение
            db.session.commit()
            return {"message": "Сообщение отправлено в Telegram"}, 200
        else:
            return {"error": "Не удалось отправить сообщение в Telegram"}, 500
    except Exception as e:
        print(f"Ошибка: {e}")
        return {"error": "Ошибка при отправке в Telegram"}, 500

# Регистрация, вход, выход
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        if User.query.filter_by(username=username).first():
            flash('Логин уже существует', 'danger')
            return redirect(url_for('register'))

        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        flash('Регистрация успешна. Войдите в систему.', 'success')
        return redirect(url_for('login'))

    return render_template('login.html', action="register")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user'] = username
            flash('Вы успешно вошли!', 'success')
            return redirect(url_for('index'))

        flash('Неверный логин или пароль', 'danger')
        return redirect(url_for('login'))

    return render_template('login.html', action="login")

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('Вы вышли из системы.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8080)
