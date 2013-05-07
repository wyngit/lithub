$(document).ready(function() {
   
   getComments();
   
   // these next two event handlers control the toggles between edit mode and view mode in the
   // right column
   $('#edit-mode').on('click', function() {
   		switchToEditMode();
   });
   
   $('#view-mode').on('click', function() {
   		switchToViewMode();
   });
   

});

var comments = {};
var authors = {};
var authorColors = {};
// right now only 6 colors (so up to 6 authors allowed)
var colors = ['nephritis', 'green_sea', 'wisteria', 'belize_hole', 'pomegranate']; 
var OLD_HTML = $('#text-container').html();

function getComments() {
	$.getJSON('/listcomments', function(data) {
       comments = data;
       $(comments).each(function () {
			if (authors[this.user.login] == undefined) {
				authors[this.user.login] = true;
				authorColors[this.user.login] = colors.pop();
			}
		});
		setUpAuthors();
		insertComments();
		setUpCheckboxes();
   });
}

function setUpAuthors() {
	$('#checkboxes-container').html('');
	$.each(authors, function (key, value) {
		var authorString = '<label class="checkbox ' + authorColors[key] +'"><input type="checkbox" name="authors" checked="' + value + '" value="' + key + '">' + key + '</input></label>'
		// var authorString = '<label class="checkbox"><input type="checkbox" checked="checked" value="">imaginary person</label>'
		$('#checkboxes-container').append(authorString);
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

function setUpInsertCommentsPopup() {
	$('textarea').on('dblclick', function() {
   		var lines = OLD_HTML.split(/<\/?p>/);
   		lines.shift();
   		var absoluteCursorPosition = this.selectionStart;
   		var lineNumber = 0;
   		var tempCursorPosition = 0;
   		
   		console.log(lines);
   		
   		while (tempCursorPosition < absoluteCursorPosition) {
   			console.log('lines['+lineNumber+'].length = ' + lines[lineNumber].length);
   			tempCursorPosition += lines[lineNumber].length;
   			lineNumber++;
   		}
   		
   		var cursorPosition = absoluteCursorPosition - (tempCursorPosition - lines[lineNumber - 1].length);
   			
   		// fill in the fields of the popup with the line number and position
   		$('#add-comment-modal').modal('show');
   		$('#line-num').val(lineNumber);
   		$('#position').val(cursorPosition);
   	});
   	
   	// set up an event handler for saving comments
   	$('#save-comment').on('click', function() {
   		var lineNum = $('#line-num').val();
   		var position = $('#position').val();
   		var comment = $('#comment-text').val();
   		saveComment(lineNum, position, comment);
   	});
}

function switchToViewMode() {
	$('#text-container').replaceWith('<div id="text-container">' + OLD_HTML + '</div>');
   	insertComments();
   	$('#insert-comment').hide();
   	$('h3').show();
   	$('.checkbox').show();
}

function switchToEditMode() {
	var newHtml = OLD_HTML.replace(/<(?:.|\n)*?>/gm, '');
   	$('#text-container').replaceWith('<textarea id="text-container">' + newHtml + '</textarea>');
   	$('#comments h3').hide();
   	$('.checkbox').hide();
   	$('#insert-comment').show();
   		
   	setUpInsertCommentsPopup();
}

function saveComment(lineNum, position, comment) {
    var urlString = '/comment/new?comment=' + comment + '&position=' + position + '&line=' + lineNum; 
  	console.log(urlString);
  	$.ajax({
	    url: urlString,
	    success: function() {
	    	$('#add-comment-modal').modal('hide');
	    	switchToViewMode();
	    	getComments();
	    }
  	});
}




