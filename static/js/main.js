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
		setUpCheckboxes();
   });
   

});

var comments = {};
var authors = {};
var authorColors = {};
// right now only 6 colors (so up to 6 authors allowed)
var colors = ['nephritis', 'belize_hole', 'wisteria', 'green_sea', 'pomegranate']; 
var OLD_HTML = $('#text-container').html();


function setUpAuthors() {
	$.each(authors, function (key, value) {
		var authorString = '<label class="checkbox ' + authorColors[key] +'"><input type="checkbox" name="authors" checked="' + value + '" value="' + key + '">' + key + '</input></label>'
		// var authorString = '<label class="checkbox"><input type="checkbox" checked="checked" value="">imaginary person</label>'
		$('#comments').append(authorString);
	});
	
	$('input:checkbox').change(function() {
   		authors[this.value] = this.checked;
   		insertComments();
	});
}

function insertComments() {
	var newHtml = OLD_HTML;
	$(comments).each(function () {
		if (authors[this.user.login]) {
			var commentHtml = '<span class="' + authorColors[this.user.login] + '"> ' + this.body + ' </span>';
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

function setUpCheckboxes() {
	$("html").addClass("has-js");

    // First let's prepend icons (needed for effects)
    $(".checkbox, .radio").prepend("<span class='icon'></span><span class='icon-to-fade'></span>");

    $(".checkbox, .radio").click(function(){
        setupLabel();
    });
    setupLabel();
}


