
from app import app, message

from flask import url_for, jsonify, request, session, redirect
from flask import render_template


@app.route('/')
def home():
  return render_template('compositor.html', message=message)


# @app.route('/quiz', methods=['POST', 'GET'])
# def quiz():
# 	manage = False
# 	if request.method == 'POST':
# 		content = json.loads(request.data)
# 		name = content.get('name', None)
# 		ip = request.remote_addr
# 		if name:
# 			return make_quiz(name, ip)
# 	else:
# 		manager = session.get('user', None)
# 		if manager == 'manager':
# 			manage = True
# 		return render_template('quiz.html', manage=manage)