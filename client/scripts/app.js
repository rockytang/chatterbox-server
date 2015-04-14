// YOUR CODE HERE:

var App = function() {
  this.server = 'http://127.0.0.1:3000/1/classes/chatterbox';
};

var app = new App();

App.prototype.init = function() {
  // var $appScript = $('.appScript');
  // $appScript.before('<script src="env/config.js"></script>');
  // var that = this;
  // $appScript.ready(function () {
  //   that.fetch();
  // });
  this.fetch();
};

App.prototype.handleSubmit = function() {
  var msg = {
    username: $('.sendingUsername').val() || "Anonymous",
    roomname: $('#roomSelect').val(),
    text: $('#message').val()
  };
  this.send(msg);
};

App.prototype._userClick = function ($msg) {
  this.addFriend($msg.find('.username'));
};

App.prototype.addFriend = function ($friend) {
  var $friends = $('#friendSelect > option');
  var hasFriend = false;
  for(var i = 0; i < $friends.length; i++){
    if($($friends[i]).val() === $friend.html()) {
      hasFriend = true;
    }
  }
  if(!hasFriend){
  $('#friendSelect').append('<option value=' + $friend.html() + '>'
        + $friend.html() + '</option>');
  }
};

App.prototype.clearMessages = function() {
  var $ul = $('#chats');
  $ul.empty();
}

App.prototype.showMessages = function (data) {
  var length = data.results.length;
  for(var i = 0; i < length; i++) {
    var msgData = data.results[i];
    this.addMessage(msgData);
  }
  $('time.timeago').timeago();
  $('.spinner').toggle();
};

App.prototype._checkFromFriend = function ($msgContent) {
  var $friends = $('#friendSelect > option');
  for(var i = 0; i < $friends.length; i++){
    if($msgContent.parent('li').find('.username').text() === $($friends[i]).val()) {
      return true
    }
  }
  return false;
};

App.prototype.addMessage = function(message) {
  var $ul = $('#chats');
  var source   = $('#msgTemplate').html();
  var userClickCallback = this._userClick.bind(this);
  var $msgContent;
  if (source) {
    var template = Handlebars.compile(source);
    var msgHTML = template(message);
    var $msg = $($.parseHTML(msgHTML));
    $msg.on('click', function (){
      userClickCallback($(this));
    });
    $msgContent = $msg.find('.content');
    if(this._checkFromFriend($msgContent)){
      $msgContent.addClass('friendText');
    }
    $ul.append($msg);
  }
};

App.prototype.addRoom = function(roomname) {
  var $roomSelect = $('#roomSelect');
  $roomSelect.append('<option value="' + roomname + '">' + roomname + '</option>');
  //<option value="value1">Value 1</option>
}

App.prototype.fetch = function() {
  var testLimit = { limit: 100, order: '-updatedAt'};
  var that = this;
  $.ajax({
    // always use this url
    url: this.server,
    type: 'GET',
    data: testLimit,
    contentType: 'application/json',
    success: function (data){
      that.showMessages(data);
    },
    error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message: ' + JSON.stringify(data));
    }
  });
};

App.prototype.send = function(message) {
  // var message = {
  //   'username': 'frankbowers',
  //   'text': 'This is April 6 16:07 test',
  //   'roomname': '6th floor'
  // };
  $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data){
      // showMessages(data);
      console.log('posted successfully');
    },
    error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message: ' + JSON.stringify(data));
    }
  });
};


$('document').ready(function (){
  app.init();
  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  });
  $('.refresh').on('click', function() {
    $('.spinner').toggle();
    app.clearMessages();
    app.fetch();
  });
});


