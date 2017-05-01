var plugin = {};

(function(plugin) {
    plugin.init = function(app, countlyDb) {

        //add your middleware or process requests here
        app.get(countlyConfig.path + '/notification/:appId', function(req, res, next) {

            //check if user is authenticated
            if (req.session.uid) {
                res.render('../../../plugins/notification/frontend/public/templates/config', {});
            } else
                res.redirect(countlyConfig.path + '/login');
        });

        app.post(countlyConfig.path + '/save/notification/:appId', function(req, req, next) {
            let notification = req.body
            let appId = req.params.appId
            countlyDb.collection('app_notification' + appId).insert(notification, function(err, result) {
                if (!err) {
                    res.status(200).json({
                        'msg': 'created job notification'
                    })
                } else {
                    res.status(500).json({
                        'msg': 'can not save notification'
                    })
                }
            });
        });

    };
}(plugin));

module.exports = plugin;