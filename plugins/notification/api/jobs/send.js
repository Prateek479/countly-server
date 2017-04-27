'use strict';

const job = require('../../../../api/parts/jobs/job.js'),
    plugins = require('../../../pluginManager.js'),
    async = require("async"),
    log = require('../../../../api/utils/log.js')('job:notification');


class NotificationJob extends job.Job {

    run(countlyDb, doneJob, progressJob) {
        log.d("starting notification send job");

        function ping() {
            log.d('Pinging job');
            if (timeout) {
                progressJob();
                setTimeout(ping, 10000);
            }
        }
        var timeout = setTimeout(ping, 10000);
        const dailyNotification = require('../config/dailynotification')
            //load configs
        plugins.loadConfigs(countlyDb, function() {

            let currentDate = Math.round(Date.now() / 1000);
            //callback when all the notification are done and sent
            async.eachSeries(dailyNotification, function(ob, callback) {
                let db = ob.applicableTo + ob.appId,
                    query = {};
                query[ob.field] = {};
                query[ob.field][ob.constrain] = ob.value;

                if (ob.type === 'date' && ob.constrain !== '$eq') {
                    query[ob.field] = {};
                    //matching no of days with date time stamp
                    query[ob.field][ob.constrain] = (currentDate - (ob.value * 24 * 60 * 60));
                }

                countlyDb.collection(db).find(query).toArray(function(err, result) {
                    if (err) {
                        log.d("error sending notifications")
                    } else if (!err && result.length > 0) {
                        result.forEach(function(entity) {
                            //this can go into event loop if required 
                            console.log('notification sent to user ', entity.uid, ' on app ', ob.appId)
                        });
                        callback();
                    } else {
                        callback()
                    }

                });
            }, function() {
                //task complete
                console.log('Daily notification sent')
                log.d("all reports sent");
                clearTimeout(timeout);
                timeout = 0;
                doneJob();
            });
        })
    }
}

module.exports = NotificationJob;