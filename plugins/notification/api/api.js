var common = require('../../../api/utils/common.js'),
    log = common.log('flows:api'),
    plugins = require('../../pluginManager.js');


(function(plugins) {

    //Storing data in array of json which can further be stored in mongo collection 
    //write api for real time notifications.
    const realtimeNotification = require('./config/realtimenotification');
    //regestring all the wrtie request this can be customize as per notification     
    //making it genric for all request coming from sdk 
    plugins.register("/i", function(ob) {
        const param = ob.params
        realtimeNotification.forEach(function(cond) {

            // not for custom event base notification
            if (cond.field !== 'events') {
                if (param && param[cond.field] && param[cond.field][cond.path] === cond.value) {
                    console.log('notify user ', cond.notification_msg);
                }
            }
            //custom event notification
            else if (cond.field === 'events') {
                //assumin that event is array of single element             
                if (!cond.isSegment && param.qstring && param.qstring[cond.field] && param.qstring[cond.field][0][cond.path] === cond.value) {
                    console.log('notify user for this event', cond.notification_msg);
                } else if (cond.isSegment && param.qstring && param.qstring[cond.segment.field] && param.qstring[cond.segment.field][cond.segment.path] === cond.segment.value) {
                    //can handle it for the segment field
                    console.log('notify user for segment event', cond.notification_msg);
                }
            }
        });
    });

    // notificaiton system for daily notifications
    plugins.register("/master", function(ob) {
        // Allow configs to load & scanner to find all jobs classes
        setTimeout(() => {
            require('../../../api/parts/jobs').job('notification:send').replace().schedule('every 1 day');
        }, 10000);
    });

    plugins.register("/save/notification", function(ob) {
        console.log('here', ob);
        // Allow configs to load & scanner to find all jobs classes
        // setTimeout(() => {
        //     require('../../../api/parts/jobs').job('notification:send').replace().schedule('every 1 day');
        // }, 10000);
    });



}(plugins));

module.exports = plugins;