'use strict';
//Andrzej Dejnas vel Denek

var http = require('http');
var port = process.env.PORT || 1337;

var express = require('express');
var routes = require('./routes');
var path = require('path');
var urlencoded = require('url');
var bodyParser = require('body-parser');
var json = require('json');
var logger = require('logger');
var methodOverride = require('method-override');


var nano = require('nano')('http://localhost:5984');

var baza = nano.use('adres');
var server = express();


server.set('port', port);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

server.use(methodOverride());
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', routes.index);

server.post('/utworz_baze', function (req, res) {
    nano.db.create(req.body.dbname, function (err) {
        if (err) {
            res.send("Utworzenie bazy danych sie nie powiodlo!" + req.body.dbname);
            return;
        }

        res.send("Baza danych " + req.body.dbname + " Utworzenie sie powiodlo");
    });
});

server.post('/nowy_kontakt', function (req, res) {
   
    var telefon = req.body.telefon;
    var imie = req.body.imie;
    var nazwisko = req.body.nazwisko;
    var adress = req.body.adress;
    var kodPocztowy = req.body.kodPocztowy;
    var miejscowosc = req.body.miejscowosc;
    var adresEmail = req.body.adresEmail;

    baza.insert({ telefon:telefon, imie:imie, nazwisko:nazwisko, adress:adress, kodPocztowy:kodPocztowy, miejscowosc:miejscowosc, adresEmail:adresEmail , crazy:true }, telefon, function (err, body, header) {
        var test1;
        if (err) {
            res.send("Kontakt nie zostal utworzony");
            return;
        }
        test1 = "<br/>Numer Telefonu: " + telefon + "<br/>Imie: " + imie + "<br/>Nazwisko: " + nazwisko + "<br/>Adress: " + adress + "<br/>Kod Pocztowy: " + kodPocztowy + "<br/>Miejscowosc: " + miejscowosc + "<br/>Adres email: " + adresEmail;
        res.send("Kontakt zostal pomyslnie utworzony: " + test1);
    });

});

server.post('/wyswietl_kontakt', function (req, res) {
    var test = "Kontakt:";
        baza.get(req.body.telefon, { revs_info: true }, function (err, body) {
            if (!err) {
                console.log(body);
            }

            if (body) {
                test += "<br/>Numer Telefonu: " + body.telefon + "<br/>Imie: " + body.imie + "<br/>Nazwisko: " + body.nazwisko + "<br/>Adress: " + body.adress + "<br/>Kod Pocztowy: " + body.kodPocztowy + "<br/>Miejscowosc: " + body.miejscowosc + "<br/>Adres email: " + body.adresEmail;

            }
            else {
                test = "Rekord bazy danych o id telefonu nie zostal utworzony!";
            }
            res.send(test);
        });
});

server.post('/usun_kontakt', function (req, res) {
    baza.get(req.body.telefon, { revs_info:true }, function (err, body) {
        if (!err) {
            baza.destroy(req.body.telefon, body._rev, function (err, body) {
                if (err) {
                    res.send("Usuniecie kontaktu sie nie powiodlo!");
                }
            });
            res.send("Kontakt zostal usuniety!!!");
        }
    });
});

http.createServer(server).listen(server.get('port'), function () {
    console.log('Express server listening on port' + server.get('port'));
});

