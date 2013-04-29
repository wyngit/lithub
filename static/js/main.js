$(document).ready(function() {
   
   $.getJSON('/listcomments', function(data) {
       comments = data;
       $(comments).each(function () {
			if (authors.indexOf(this.user.login) == -1) {
				authors.push(this.user.login);
			}
		});
		setUpAuthors();
		insertComments();
   });
});

var comments = {};
var authors = [];


function setUpAuthors() {
	$(authors).each(function () {
		$('#comments').append('<input type="radio" value="' + this + '">' + this + '</input>');
	});
}

function insertComments() {
	var oldHtml = $('#text-container').html();
	$(comments).each(function () {
		var commentHtml = '<span class="red">' + this.body + '</span>';
		if (this.position === null) {
			oldHtml += commentHtml;
		} else {
			oldHtml = insertAtPosition(oldHtml, commentHtml, this.position);
		}
	});
	$('#text-container').html(oldHtml);
}

function insertAtPosition(oldString, insertString, position) {
	return [oldString.slice(0, position), insertString, oldString.slice(position)].join('');
}