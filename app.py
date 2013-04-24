from flask import Flask, g, render_template, Response, redirect, url_for, flash, request, session
import config
import requests
import json
import os

app = Flask(__name__)
app.debug = config.DEBUG
app.secret_key = config.APP_SECRET_KEY

hostnamewithport='http://localhost:5000'
request_token_url='https://github.com/login/oauth/authorize'
access_token_url='https://github.com/login/oauth/access_token'
authorize_url='https://github.com/login/oauth/authorize'
client_id=config.GITHUB_APP_ID
client_secret=config.GITHUB_APP_SECRET

@app.route("/")
def index():
  return render_template("index.html")

@app.route('/login')
def login():
	return redirect(request_token_url+'?client_id='+client_id+'&redirect_uri='+hostnamewithport+'/login/authorized/')

@app.route('/login/authorized/')
def github_authorized():
	code = request.args.get('code')
	print('code: ' + code)
	payload = {'client_id': client_id,'redirect_uri': hostnamewithport, 'client_secret': client_secret, 'code': code}
	
	# # take the code, make a remote request to retrieve an access token
	r = requests.post(access_token_url, params=payload)
	# token_response = json.loads(r.text)
	print('token_response: ' + r.text)
	
	# oauth_token = token_response['access_token']

	return redirect(url_for('index'))
		
@app.route('/logout')
def logout():
	# remove the uid from the session
	return redirect('')

if __name__ == "__main__":
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)