var async = require('async'),
    pluginManager = require('../pluginManager.js'),
    countlyDb = pluginManager.dbConnection();

console.log("Installing notification plugin");

countlyDb.collection('apps').find({}).toArray(function(err, apps) {

    if (!apps || err) {
        return;
    }

    function upgrade(app, done) {
        var cnt = 0;
        console.log("Adding notification collections to " + app.name);

        function cb() {
            cnt++;
            if (cnt == 4)
                done();
        }
        countlyDb.collection('app_notification' + app._id).insert({
            _id: "meta",
            appId: app._id
        }, cb);
    }
    async.forEach(apps, upgrade, function() {
        console.log("Notification plugin installation finished");
        countlyDb.close();
    });
});