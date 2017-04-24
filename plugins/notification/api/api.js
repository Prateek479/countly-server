var common = require('../../../api/utils/common.js'),
    log = common.log('flows:api'),
    plugins = require('../../pluginManager.js');


(function (plugins) {
	//write api cal
	plugins.register("/i", function(ob){
		console.log('here is my object',ob)
	});
}(plugins));

module.exports = plugins;

