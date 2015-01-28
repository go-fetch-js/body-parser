var Stream = require('stream');

/**
 * Concatenate the response stream and add it on a `.body` property on the response object
 *  - will block the `headers` event from firing until all the content is read
 * @param   {Object}            [options]           The plugin options
 * @param   {Array.<string>}    [options.types]     The mime types for which the plugin is applied
 * @param   {number}            [options.maxlength] The maximum length of the response body to which the plugin is applied
 * @returns {function(Client)}
 */
function body(options) {

	/**
	 * Concatenate all of the stream's content into to a property on the response
	 * @param   {Client} client
	 */
	return function(client) {

		client.on('after', function (request, response, done) {
			var body = '';

			//if an allowed list of types is specified, then only concatenate responses where the mime type is in the allowed list of types
			if (options && options.types) {
				if (typeof(response.getContentType) === 'undefined' || options.types.indexOf(response.getContentType()) === -1) {
					return done();
				}
			}

			var stream = response.getBody();

			//check response is a stream
			if (!(stream instanceof Stream)) {
				return done();
			}

			stream.on('data', function (data) {
				body += data.toString();
			});

			stream.on('end', function () {
				response.setBody(body);
				done();
			});

		});

	};

}

/**
 * Parse a response body as JSON
 * @param   {Object}            [options]           The plugin options
 * @param   {Array.<string>}    [options.types]     The mime types for which the plugin is applied
 * @param   {number}            [options.maxlength] The maximum length of the response body to which the plugin is applied
 * @returns {function(Client)}
 */
function json(options) {
	options       = options || {};
	options.types = options.types || ['application/json'];

	return function(client) {
		client.use(body(options));

		client.on('after', function(request, response) {

			var body = response.getBody();

			if (typeof(body) === 'string') {
				response.setBody(JSON.parse(body));
			}

		});

	};

};

module.exports = body;
module.exports.json = json;