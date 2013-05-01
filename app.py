from flask import Flask, g, render_template, Response, redirect, url_for, flash, request, session
import config
import requests
import json
import simplejson
import base64
import os
import re
from jinja2 import evalcontextfilter, Markup, escape

_paragraph_re = re.compile(r'(?:\r\n|\r|\n){2,}')

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
	return redirect(request_token_url+'?client_id='+client_id+'&redirect_uri='+hostnamewithport+'/login/authorized/&scope=user,public_repo,repo,repo:status')

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

	return redirect(url_for('github_reviewdoc'))

@app.route('/comment/new')
def github_comment():
	position = request.args.get('position')
	line = request.args.get('line')
	comment = request.args.get('comment')
	commit_id = "9f1de7185fe4c9ba582141314b1b8b07ae241044"

	payload = {"body": comment, "commit_id": commit_id, "path": "testing.txt", "position": 22, "line": 1}
	headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
	r = requests.post('https://api.github.com/repos/davelester/testing/commits/'+commit_id+'/comments?access_token=cbc443a6402c0018a4c93a874b524862edab635d', data=json.dumps(payload), headers=headers)
	print('response!: ' + r.text)
	return r.text

@app.route('/listcomments')
def github_listcomments():
	r = requests.get('https://api.github.com/repos/davelester/testing/comments?access_token=cbc443a6402c0018a4c93a874b524862edab635d')
	# print('response!: ' + r.text)
	# return redirect(url_for('index'))
        return r.text

@app.route('/reviewdoc')
def github_reviewdoc():
	# get document
	# /repos/:owner/:repo/contents/:path
	r = requests.get('https://api.github.com/repos/davelester/testing/contents/testing.txt?access_token=cbc443a6402c0018a4c93a874b524862edab635d')
	c = r.text
	j = simplejson.loads(c)
	git_url = j['git_url']
	decoded_contents = base64.b64decode(j['content'])
	
	print('fulltext: ' + decoded_contents)
	
	return render_template("reviewdoc.html", fulltext=decoded_contents)

@app.route('/test')
def test():
	return render_template("test.html")

@app.template_filter()
@evalcontextfilter
def nl2br(eval_ctx, value):
	result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', '<br>\n') \
		for p in _paragraph_re.split(value))
	if eval_ctx.autoescape:
		result = Markup(result)
	return result

@app.route('/logout')
def logout():
	# remove the uid from the session
	return redirect('')

if __name__ == "__main__":
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
