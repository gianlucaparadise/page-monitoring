var express = require('express');
var router = express.Router();

var botgram = require("botgram");
var request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  var bot = botgram("251656776:AAHt3XM9u0ngOTU-lJgi-wBzt5dcN_G2WEU");

  bot.command("start", function (msg, reply, next) {
    console.log("Received a /start command from", msg.from.username);
  });

  var pinger = null;
  bot.command("monitor", function (msg, reply, next) {
    console.log("Received a /monitor command from", msg.from.username);
    var url = msg.args();

    pinger = setInterval(function () {
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          reply.text(body); // Show the HTML for the Google homepage.
        }
      });
    }, 5000);
  });

  bot.command("stop", function (msg, reply, next) {
    if (pinger) clearInterval(pinger);
    reply.text("Stopped");
  });

  bot.text(function (msg, reply, next) {
    console.log("Received a text message:", msg.text);
    reply.text("yo");
  });

  res.json("Register completed");
});

module.exports = router;
