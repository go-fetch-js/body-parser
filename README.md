# go-fetch-parse-body

[![Circle CI](https://circleci.com/gh/go-fetch-js/parse-body.svg?style=svg)](https://circleci.com/gh/go-fetch-js/parse-body)

Concatenate and parse the response stream.

## Installation 

    npm install --save go-fetch-parse-body
    
## Usage
    
    var HttpClient = require('go-fetch');
    var parseBody = require('go-fetch-parse-body');
    
    HttpClient()
        .use(HttpClient.plugins.contentType)
        .use(parseBody.json())
        .get('https://api.github.com/repos/go-fetch-js/parse-body', {'User-Agent': 'go-fetch'}, function(error, response) {
            console.log(error, response.getBody());
        })
    ;
    
## API

### Methods

#### body(options)

Concatenate the response stream as a string.

Optional options:

- `options.once` - Only parses the body of the next response if set to true
- `options.maxlength` - Only parses responses with a `Content-Length` shorter than the specified value  
- `options.types` - Only parses the responses with a `Content-Type` of the specified value

#### body.json(options)

Concatenate and parse the response stream as a JSON object.

#### body.urlencoded(options)

Concatenate and parse the response stream as a form URL encoded object.

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.