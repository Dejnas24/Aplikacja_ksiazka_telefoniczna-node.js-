exports.create = function (req, res) {
    nano.db.create(req.body.dbname, function () {
        if (err) {
            res.send("Baza danych nie została utworzona");
            return;
        }
        res.send("Pomyślnie dodano do bazy!");
    });
};