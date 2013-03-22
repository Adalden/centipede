var shared = require('../shared')
  , sounds = require('../sounds')
  , jadify = require('../requires/render')
  ;

function init() {
  getUser();
  bindHandlers();
}

function getUser() {
  shared.user = JSON.parse($('.user-obj').text());
  $('.user-obj').remove();
}

function bindHandlers() {
  $('.music-setting').click(function () {
    var key = $(this).data('option')
      , val = shared.user[key] = !shared.user[key];

    sounds.playEffect();
    sounds.playMusic();

    $(this).find('.bocks').css('background-position-y', shared.user[key] ? '' : '50px');
    $.post('/updateUser', { key: key, val: val });
  });

  $('.control-setting').click(function () {
    var key = $(this).data('option');
    showDialog(key, $(this));
  });
}

exports.str  = 'slide-settings';
exports.init = init;
exports.unbindDialog = removeDialog;



function showDialog(key, $this) {
  removeDialog();
  $('body').append(jadify('components/dialog', { key: key }));
  $('.close-btn').click(removeDialog);

  // bind keypress to get key
  $('body').bind('keydown.settings', function (e) {
    // console.log('you pressed ' + e.keyCode);
    removeDialog();

    if (e.keyCode === 27) return;

    $this.find('.bocks').text(makeReadable(e.keyCode));
    $.post('/updateUser', { key: 'controls', key2: key, val: e.keyCode });
  });
}

function removeDialog() {
  $('.dialog-box').remove();
  $('body').unbind('keydown.settings');
}

function makeReadable(val) {
  if (val == 32)      val = 'space';
  else if (val == 13) val = 'enter';
  else if (val == 37) val = 'left';
  else if (val == 38) val = 'up';
  else if (val == 39) val = 'right';
  else if (val == 40) val = 'down';
  else                val = String.fromCharCode(val);
  return val;
}
