var express = require('express');
var router = express.Router();

var botgram = require("botgram");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  var bot = botgram("251656776:AAHt3XM9u0ngOTU-lJgi-wBzt5dcN_G2WEU");

  bot.command("start", function (msg, reply, next) {
    console.log("Received a /start command from", msg.from.username);
  });

  bot.command("monitor", function (msg, reply, next) {
    console.log("Received a /start command from", msg.from.username);
    reply.text(msg.text);
  });

  bot.text(function (msg, reply, next) {
    console.log("Received a text message:", msg.text);
    reply.text("yo");
  });

  res.json("{yo: yo}");
});

module.exports = router;
