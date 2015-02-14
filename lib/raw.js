var Stream = require('stream');

/**
 * Concatenate the response stream and add it on a `.body` property on the response object
 *  - will block the `headers` event from firing until all the content is read
 * @param   {Object}            [options]           The plugin options
 * @param   {Array.<string>}    [options.types]     The mime types for which the plugin is applied
 * @param   {number}            [options.maxlength] The maximum length of the response body to which
 * the plugin is applied
 * @param   {bool}              [options.once]      The plugin is only applied on the next request
 * @returns {function(Client)}
 */
module.exports = function(options) {
	options           = options || {};
	options.once      = options.once || false;
	options.maxlength = options.maxlength || null;

	/**
	 * Concatenate all of the stream's content into to a property on the response
	 * @param   {Client} client
	 */
	return function(client) {
		var onfn = options.once ? client.once : client.on;

		onfn.call(client, 'after', function(event, next) {
			var
				response = event.response,
				body = ''
				;

			//if an allowed list of types is specified, then only concatenate responses where the mime type is in the allowed list of types
			if (options.types) {
				if (typeof(response.getContentType) === 'undefined' || options.types.indexOf(response.getContentType()) === -1) {
					return next();
				}
			}

			//check the max length
			if (options.maxlength) {
				var length = Number(response.getHeader('Content-Length'));
				if (length > options.maxlength) {
					return next();
				}
			}

			var stream = response.getBody();

			//check response is a stream
			if (!(stream instanceof Stream)) {
				return next();
			}

			stream.on('data', function (data) {
				body += data.toString();
			});

			stream.on('end', function () {
				response.setBody(body);
				next();
			});

		});

	};

};