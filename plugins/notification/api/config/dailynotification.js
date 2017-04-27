// daily crono job for notification 
//applicable to is db on which we need to check for condition
//constrain is matching condition
//date is a different type as is need comparision in terms of days
// value is exact value in case of date its no of days 
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
}];

module.exports = dailyNotification;