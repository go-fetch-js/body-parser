var body = require('./raw');
var Qs = require('qs');

/**
 * Parse a response body as a urlencoded form
 * @param   {Object}            [options]           The plugin options
 * @param   {Array.<string>}    [options.types]     The mime types for which the plugin is applied
 * @param   {number}            [options.maxlength] The maximum length of the response body to which the plugin is applied
 * @param   {bool}              [options.once]      The plugin is only applied on the next request
 * @returns {function(Client)}
 */
module.exports = function(options) {
	options       = options || {};
	options.types = options.types || ['application/x-www-form-urlencoded'];

	return function(client) {
		client.use(body(options));

		var onfn = options.once ? client.once : client.on;
		onfn.call(client, 'after', function(event) {
			var
				res   = event.response,
				body  = res.getBody()
			;

			if (typeof(body) === 'string' && event.response.isContentType(options.types)) {
				res.setBody(Qs.parse(body));
			}

		});

	};
};
