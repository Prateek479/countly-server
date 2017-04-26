var common = require('../../../api/utils/common.js'),
    log = common.log('flows:api'),
    plugins = require('../../pluginManager.js');


(function(plugins) {

    //Storing data in array of json which can further be stored in mongo collection 
    //write api for real tim enotifications.
    const coditions = [{
        'name': 'user session count reach x',
        'field': 'app_user',
        'value': 8,
        'path': 'sc',
        'notification_msg': 'You just got luck on your x visit..!'
    }, {
        'name': 'notify if platform is web',
        'field': 'app',
        'value': 'web',
        'path': 'type',
        'notification_msg': 'Coupen Code "COUNTLY" available on web'
    }, {
        'name': 'Evenet base notification',
        'field': 'events',
        'value': 1,
        'path': 'sum',
        // if true check the segments condition
        'isSegment': false,
        'segment': {
            // there could be multiple condition based on segment comes under this
            'field': '',
            'value': '',
            'path': ''
        },
        'notification_msg': 'Coupen Code "COUNTLY" available on web'
    }];

    plugins.register("/i", function(ob) {
        const param = ob.params
        console.log('params', param)
        coditions.forEach(function(cond) {

            // not for custom event base notification
            if (cond.field !== 'events') {
                if (param && param[cond.field] && param[cond.field][cond.path] === cond.value) {
                    console.log('notify user ', cond.notification_msg);
                }
            }
            //custom event notification
            else if (cond.field === 'events') {
                console.log('meet ', param.qstring[cond.field])
                if (!cond.isSegment && param.qstring && param.qstring[cond.field] && param.qstring[cond.field][cond.path] === cond.value) {
                    console.log('notify user for this event', cond.notification_msg);
                } else if (cond.isSegment && param.qstring && param.qstring[cond.segment.field] && param.qstring[cond.segment.field][cond.segment.path] === cond.segment.value) {
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

}(plugins));

module.exports = plugins;