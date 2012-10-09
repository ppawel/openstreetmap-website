$(document).ready(function () {
    $.ajax({
      crossDomain: true,
      url: 'http://localhost:3333/activities?user_id=' + 1234 + '&format=html',

      success: function(data, status, xhr) {
        $('#activity_stream').html(data);
      }
    });
});
