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
   
	// BELOW is Flat UI checkbox *magic* -- do not remove
	$("html").addClass("has-js");

  // First let's prepend icons (needed for effects)
  $(".checkbox, .radio").prepend("<span class='icon'></span><span class='icon-to-fade'></span>");

  $(".checkbox, .radio").click(function(){
      setupLabel();
  });
  setupLabel();
});

// Custom checkbox and radios
function setupLabel() {
    // Checkbox
    var checkBox = ".checkbox";
    var checkBoxInput = checkBox + " input[type='checkbox']";
    var checkBoxChecked = "checked";
    var checkBoxDisabled = "disabled";

    // Radio
    var radio = ".radio";
    var radioInput = radio + " input[type='radio']";
    var radioOn = "checked";
    var radioDisabled = "disabled";

    // Checkboxes
    if ($(checkBoxInput).length) {
        $(checkBox).each(function(){
            $(this).removeClass(checkBoxChecked);
        });
        $(checkBoxInput + ":checked").each(function(){
            $(this).parent(checkBox).addClass(checkBoxChecked);
        });
        $(checkBoxInput + ":disabled").each(function(){
            $(this).parent(checkBox).addClass(checkBoxDisabled);
        });
    };

    // Radios
    if ($(radioInput).length) {
        $(radio).each(function(){
            $(this).removeClass(radioOn);
        });
        $(radioInput + ":checked").each(function(){
            $(this).parent(radio).addClass(radioOn);
        });
        $(radioInput + ":disabled").each(function(){
            $(this).parent(radio).addClass(radioDisabled);
        });
    };
};


var comments = {};
var authors = {};
var authorColors = {};
// right now only 6 colors (so up to 6 authors allowed)
var colors = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']; 
var OLD_HTML = $('#text-container').html();


function setUpAuthors() {
	$.each(authors, function (key, value) {
		var authorString = '<label class="checkbox"><input type="checkbox" name="authors" checked="' + value + '" value="' + key + '">' + key + '</input></label>'
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


