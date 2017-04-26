'use strict';

const job = require('../../../../api/parts/jobs/job.js'),
    plugins = require('../../../pluginManager.js'),
    async = require("async"),
    log = require('../../../../api/utils/log.js')('job:notification');


class NotificationJob extends job.Job {

    run(countlyDb, doneJob, progressJob) {
        console.log('ohh fuck thats actually a job started')
        log.d("starting notification send job");

        function ping() {
            log.d('Pinging job');
            if (timeout) {
                progressJob();
                setTimeout(ping, 10000);
            }
        }
        var timeout = setTimeout(ping, 10000);

        const dailyNotification = [{
            'appId': '58fd8fd89c381c1dd19f80b1',
            'applicableTo': 'app_users',
            'field': 'sc',
            'constrain': '$eq',
            'type': 'variable',
            'notification_msg': 'signup again to get exciting offer',
            'value': 10
        }, {
            'appId': '58fd8fd89c381c1dd19f80b1',
            'applicableTo': 'app_users',
            'constrain': '$lte',
            'field': 'ls',
            'notification_msg': 'its been a week you have vistied..',
            'type': 'date',
            'value': 7
        }]

        //load configs
        plugins.loadConfigs(countlyDb, function() {

            let currentDate = Math.round(Date.now() / 1000);

            async.eachSeries(dailyNotification, function(ob, callback) {
                let db = ob.applicableTo + ob.appId,
                    query = {};
                query[ob.field] = {};
                query[ob.field][ob.constrain] = ob.value;

                if (ob.type === 'date' && ob.constrain !== '$eq') {
                    query[ob.field] = {};
                    query[ob.field][ob.constrain] = (currentDate - (ob.value * 24 * 60 * 60));
                }

                console.log('here is query', query)

                countlyDb.collection(db).find(query).toArray(function(err, result) {
                    if (err) {
                        log.d("error sending notifications")
                    } else if (!err && result.length > 0) {
                        result.forEach(function(entity) {
                            console.log('notification sent to user ', entity.uid, ' on app ', ob.appId)
                        });
                        callback();
                    } else {
                        callback()
                    }

                });
            }, function() {
                console.log('send notification')
                log.d("all reports sent");
                clearTimeout(timeout);
                timeout = 0;
                doneJob();
            });
        })
    }
}

module.exports = NotificationJob;