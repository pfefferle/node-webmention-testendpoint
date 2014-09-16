# WebMention Test Endpoint

A tool to test your [WebMention](http://indiewebcamp.com/webmention) client. Generates a demo-post and a demo-endpoint to test if your client parses the webmention-endpoint correctly and to check if the ping body is transmitted correctly.

Be sure to also test the [node-webmention-testpinger](https://github.com/voxpelli/node-webmention-testpinger) of [@voxpelli](https://github.com/voxpelli)

## Usage

First clone the repository

    $ git clone https://github.com/pfefferle/node-webmention-testendpoint.git

Then run the app

    $ node .

The tool will spin up a server on port 9247 and provides a test-post and a test-endpoint.

## Options

You can find the test-post under

    http://localhost:9247/post

To test several possibilities, you have some options. Options can be added as query strings and will change the output of the test-posting.

### Type

With `type` you can choose the [autodiscovery format](https://github.com/converspace/webmention/blob/master/README.md#sender-discovers-receiver-endpoint).

    ?type={link,a,head}

* `link` will add a `<link rel="webmention" href="..." />` to the HTML-head
* `a` will add a link `<a rel="webmention" href="...">Endpoint</a>` to the HTML-body
* `head` will add a HTTP-Link header `Link: <http://...>; rel="webmention"`

You can combine several types with a semicolon separated list.

### Rel

Use 'rel' to define the link relation

    ?rel={id|uri|both}

* `id` uses the `webmention` relation: `<link rel="webmention" href="..." />`
* `uri` uses the `http://webmention.org/` uri relation: `<link rel="http://webmention.org/" href="..." />`
* `both` will add both relations: `<link rel="webmention http://webmention.org/" href="..." />`

### URL

Use `url` to choose between absolute and relative urls

    ?url={abs|rel}

(the default is `abs`)

* `abs` absolute endpoint-urls
* `rel` relative endpoint-urls

### Status Code (HTTP)

Use `status_code` to simulate for example error-scenarios via HTTP-codes

    ?status_code=500

Check out [RFC 7231](http://tools.ietf.org/html/rfc7231) and the [WebMention Spec](https://github.com/converspace/webmention/blob/master/README.md#error-responses) to find out more about the error codes.

## Changelog

### 0.1.1

* added HTTP status code support to simulate errors

### 0.1.0

* initial version
