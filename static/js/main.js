$(document).ready(function() {
   $.getJSON('/listcomments', function(data) {
       console.log(data);
   });
});