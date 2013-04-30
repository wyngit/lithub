$(document).ready(function() {
   
   $.getJSON('/listcomments', function(data) {
       comments = data;
       $(comments).each(function () {
			if (authors[this.user.login] == undefined) {
				authors[this.user.login] = true;
				authorColors[this.user.login] = colors.pop();
			}
		});
		setUpAuthors();
		insertComments(authors);
   });
   
});

var comments = {};
var authors = {};
var authorColors = {};
// right now only 6 colors (so up to 6 authors allowed)
var colors = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']; 
var OLD_HTML = $('#text-container').html();


function setUpAuthors() {
	$.each(authors, function (key, value) {
		var authorString = '<input type="checkbox" name="authors" checked="' + value + '" value="' + key + '">' + key + '</input>'
		$('#comments').append(authorString);
	});
	
	$('input:checkbox').change(function() {
   		authors[this.value] = this.checked;
   		insertComments(authors);
	});
}

function insertComments(authorsList) {
	var newHtml = OLD_HTML;
	$(comments).each(function () {
		if (authors[this.user.login]) {
			var commentHtml = '<span class="' + authorColors[this.user.login] +'">' + this.body + '</span>';
			if (this.position === null) {
				newHtml += commentHtml;
			} else {
				newHtml = insertAtPosition(newHtml, commentHtml, this.position);
			}
		}
	});
	$('#text-container').html(newHtml);
}

function insertAtPosition(oldString, insertString, position) {
	return [oldString.slice(0, position), insertString, oldString.slice(position)].join('');
}

