var express = require('express');
var router = express.Router();

var botgram = require("botgram");
var request = require("request");

var timers = {};

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  var bot = botgram("251656776:AAHt3XM9u0ngOTU-lJgi-wBzt5dcN_G2WEU");

  bot.command("start", function (msg, reply, next) {
    console.log("Received a /start command from", msg.from.id);
  });

  bot.command("monitor", function (msg, reply, next) {
    console.log("Received a /monitor command from", msg.from.id);
    var url = msg.args();

    var id = generateId(msg);

    var pinger = setInterval(function () {
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          reply.text(id); // Show the HTML for the Google homepage.
        }
      });
    }, 5000);

    var oldPinger = timers[id];
    if (oldPinger) clearInterval(oldPinger);

    timers[id] = pinger;
  });

  bot.command("stop", function (msg, reply, next) {
    var url = msg.args();
    var id = generateId(msg);
    var pinger = timers[id];

    if (pinger) {
      clearInterval(pinger);
      reply.text("Stopped " + url);
    }
    else {
      reply.text("Not stopped " + url);
    }
  });

  bot.text(function (msg, reply, next) {
    console.log("Received a text message:", msg.text);
    reply.text("yo");
  });

  res.json("Register completed");
});

function generateId(msg) {
  return msg.from.id + msg.args() + msg.chat.id;
}

module.exports = router;
