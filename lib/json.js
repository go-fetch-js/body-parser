var body = require('./raw');

/**
 * Parse a response body as JSON
 * @param   {Object}            [options]           The plugin options
 * @param   {Array.<string>}    [options.types]     The mime types for which the plugin is applied
 * @param   {number}            [options.maxlength] The maximum length of the response body to which the plugin is applied
 * @param   {bool}              [options.once]      The plugin is only applied on the next request
 * @returns {function(Client)}
 */
module.exports = function(options) {
	options       = options || {};
	options.types = options.types || ['application/json'];

	return function(client) {
		client.use(body(options));

		var onfn = options.once ? client.once : client.on;
		onfn.call(client, 'after', function(event) {
			var
				res   = event.response,
				body  = res.getBody()
				;

			if (typeof(body) === 'string') {
				res.setBody(JSON.parse(body));
			}

		});

	};

};