const realtimeNotification = [{
    //redable name 
    'name': 'user session count reach x',
    //params field
    'field': 'app_user',
    //value to be matched
    'value': 8,
    //sub field
    'path': 'sc',
    'notification_msg': 'You just got luck on your x visit..!'
}, {
    'name': 'notify if platform is web',
    'field': 'app',
    'value': 'ios',
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

module.exports = realtimeNotification