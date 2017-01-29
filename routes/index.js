var express = require('express');
var router = express.Router();

var botgram = require("botgram");
var request = require("request");

var _ = require("lodash");
var compareUrls = require('compare-urls');

var pg = require('pg');
pg.defaults.ssl = true;

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
    var chatId = msg.chat.id;

    // in base all'id chat: recuperare urls
    // se url già presente:
    //    avvisare del duplicato e return (usare: https://github.com/sindresorhus/compare-urls)

    pg.connect(process.env.DATABASE_URL, function (err, client) {
      if (err) throw err;
      reply.text('Connected to postgres! Getting schemas...');

      client
        .query('SELECT url FROM pageMonitors WHERE idChat = ' + chatId + ';')
        .on('row', function (row, result) {
          reply.text(JSON.stringify(row));
          result.addRow(row);
        })
        .on('end', function (result) {
          reply.text(result.rows.length + ' rows were received');
          var hasUrl = _.some(result.rows, function (row) {
            return compareUrls(row.url, url);
          });

          if (hasUrl) {
            reply.text("Riga duplicata");
            return;
          }

          var queryText = 'INSERT INTO pageMonitors(url, idUtente, idChat, idStato, dataInserimentoRichiesta)' +
            'VALUES($1, $2, $3, $4, $5) RETURNING id';
          client.query(queryText, [url, msg.from.id, msg.chat.id, 1, new Date()], function (err, result) {
            if (err) throw err;

            var newlyCreatedUserId = result.rows[0].id;
            reply.text("id riga " + newlyCreatedUserId);
          });
        });
    });

    /*
    // Insert nuovo monitor e recuperare id
    var id = generateId(msg);

    var pinger = setInterval(function () {

      // in base all'id chat e url: recuperare vecchio html

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // confrontare con nuovo html
          // se diverso:
          //    invia notifica
          //    salvare nuovo html e update numerocambienti e nuovadatacambiamento
          // salvare dataultimocontrollo

          reply.text(id); // Show the HTML for the Google homepage.
        }
      });
    }, 5000);

    // non necessario?
    //var oldPinger = timers[id];
    //if (oldPinger) clearInterval(oldPinger);

    timers[id] = pinger;
    */
  });

  bot.command("stop", function (msg, reply, next) {
    // recuperare urls attivi per chatid
    // mostrare scelta
    // stoppare quello scelto
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
