

from app import app

from flask import url_for, jsonify, request, session, redirect
from flask import render_template
import sys
import json
import secrets
import hashlib
import string

from app.models import db, Question, Account
from app.quiz_maker import make_quiz, get_quiz, update_quiz, submit_quiz, ranking, get_quiz_view, make_comment, delete_quiz, make_contact, get_messages, make_replied

salt = 'to_be_changed'

def Random(n):
	res = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(n))
	return res

@app.route('/login', methods=['POST'])
def login():
  error = False
  content = json.loads(request.data)
  password = content.get('password')
  pa = password.encode()
  sa = salt.encode()
  h = hashlib.sha256(pa + sa).hexdigest()
  try:
    manager = Account.query.filter_by(name='manager').first()
    if manager.so_secret == h:
      random = Random(10)
      manager.token = random
      db.session.commit()
      session['user'] = 'manager'
      session['info'] = random
    else:
      error = True
      password_msg = 'Wrong password'
  except:
    error = True
    app.logger.info(sys.exc_info())
  finally:
    db.session.close()
  if error:
    return json.dumps({'success': False, 'passwordMsg': password_msg})
  else:
    return json.dumps({'success': True})

@app.route('/logout')
def logout():
	session.clear()
	return redirect('quiz');

@app.route('/')
def hello_world():
	return redirect('quiz');

@app.route('/contact', methods=['POST'])
def contact():
  content = json.loads(request.data)
  name = content.get('name')
  email = content.get('email')
  subject = content.get('subject')
  msg = content.get('msg')
  ip = request.remote_addr
  if email and msg:
    return make_contact(name, email, subject, msg, ip)
  else:
    return {'success': False}

@app.route('/del', methods=['POST'])
def delete_entry():
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	manager = session.get('user', None)
	ip = request.remote_addr
	if manager == 'manager':
		return delete_quiz(quiz_id, ip)
	else:
		return {'success': False, 'reason': 'no meneger'}

@app.route('/replied', methods=['POST'])
def replied():
	content = json.loads(request.data)
	msg_id = content.get('msgId', None)
	return make_replied(msg_id)


@app.route('/comment', methods=['POST'])
def comment():
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	comment = content.get('comment', None)
	name = content.get('name', None)
	ip = request.remote_addr
	return make_comment(quiz_id, comment, name, ip)

@app.route('/update', methods=['POST'])
def update():
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	answers = content.get('selected', None)
	state = content.get('state', None)
	if quiz_id and answers and state:
		app.logger.info('updated')
		return update_quiz(quiz_id, answers, state)
	else:
		return json.dumps({'success': False, 'error': 'routes/update'})

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
	manage = False
	if request.method == 'POST':
		content = json.loads(request.data)
		name = content.get('name', None)
		ip = request.remote_addr
		if name:
			return make_quiz(name, ip)
	else:
		manager = session.get('user', None)
		if manager == 'manager':
			manage = True
		return render_template('quiz.html', manage=manage)

@app.route('/quiz/<int:quiz_id>')
def quiz_instance(quiz_id):
	obj = get_quiz(quiz_id)
	if obj['success']:
		return render_template('quiz_quiz.html', name=obj['name'], time=obj['time'],
			exercises=json.dumps(obj['questions']), answers=json.dumps(obj['answers']), quiz_id=quiz_id, state=obj['state']) 
	else:
		return render_template('quiz_quiz.html', error=obj['error'])

@app.route('/view/<int:quiz_id>')
def view(quiz_id):
	manage = False
	if session['user'] == 'manager':
		obj = get_quiz_view(quiz_id)
		manage = True
		return render_template('view.html', name=obj['name'], exercises=json.dumps(obj['questions']), answers=json.dumps(obj['answers']),time=obj['time'], quiz_id=quiz_id, state=0, manage=manage)
	else:
		return json.dumps({'Aurhentication error': 'Login Please!'})

@app.route('/submit', methods=['POST'])
def submit():
	app.logger.info('submitting')
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	answers = content.get('selected', None)
	if quiz_id and answers:
		return submit_quiz(quiz_id, answers)
	else:
		return json.dumps({'success in submit': False})

@app.route('/power_ranking')
def power_ranking():
	manage = False
	power = ranking()
	if 'user' in session:
		if session['user'] == 'manager':
			manage = True
	return render_template('ranking.html', ranking=power, manage=manage)

@app.route('/messaging')
def messaging():
  messages = get_messages()
  if 'user' in session:
    if session['user'] == 'manager':
      return render_template('messages.html', messages=messages, manage=True)

@app.route('/power_ranking/<int:rank_id>')
def power_ranking_one(rank_id):
	power = ranking()
	return render_template('ranking.html', ranking=power, rank_id=rank_id)

@app.route('/add_question', methods=['POST', 'GET'])
def add_question():
	error = False
	if request.method == 'POST':
		content = json.loads(request.data)
		question = content.get('question', None)
		answers = content.get('answers', None)
		question_type = content.get('questionType', None)
		url = content.get('url', None)
		app.logger.info(' %s question type' % question_type)
		if(question and answers and question_type):
			try:
				exercise = Question(description=question, answers=answers, question_type=question_type, pic=url)
				Question.insert(exercise)
				question_id = exercise.id
			except:
				error = sys.exc_info()
				app.logger.info(sys.exc_info())
			finally:
				db.session.close()
		if error:
			return json.dumps({'success': False, 'error': str(error)})
		return json.dumps({'success': True, 'questionId': question_id})
	else:
		return render_template('add_question.html')