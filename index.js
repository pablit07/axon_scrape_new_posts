"use strict"

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var handlebars = require('handlebars');
var Promise = require('promise');
var SlackClient = require('slack-api-client');

var url = 'https://www.facebook.com/axonsports/';

// slackbot integration 

// var RtmClient = require('@slack/client').RtmClient;

// var token = 'xoxb-83655554551-HJb1TpHv1FXu6WIkV5a0ZBIT';

// var rtm = new RtmClient(token, {logLevel: 'debug'});
// rtm.start();

// var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

// rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
//   console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
// });
exports.myHandler = function(event, context, callback) {

	var slack = new SlackClient('xoxb-83655554551-HJb1TpHv1FXu6WIkV5a0ZBIT');

	// var http = require('https');
 //               http.get(url, function(res) {
 //                    console.log("Got response: " + res.statusCode);
 //                    context.done(null,'');
 //                }).on('error', function(e) {
 //                  console.log("Got error: " + e.message);
 //                     context.done(null,'');
 //                });


	// main execution

	var fbRequest = new Promise(function(resolve, reject) {

		request({
			headers: { 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:48.0) Gecko/20100101 Firefox/48.0" },
			uri: url,
		}, function(error, response, html){
		    if(!error){
		        var $ = cheerio.load(html);

		        $('.userContentWrapper').each(function() {
		        	if ($(this).find('.timestampContent').text().match(/(min)/)) {
		        		var post = $(this).find('.userContent p').text();
		        		console.info(post);
		        		request.post({
		        			headers: {'content-type' : 'application/x-www-form-urlencoded'},
						  	url: ' https://hooks.slack.com/services/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',
						  	body: 'payload={\"text\":' + '\"Axon posted on FB: ' + post + '\"}'
						}, function (err, res) {
							if (err) {
								throw err;
								reject();
							}
							console.log(res);
							resolve();
						});
		        	}
	        	});

		    } else {
		    	reject();
		    }
		});
	}).done(function() {
		console.info('Finished')
		context.done(null,'');
	});
}