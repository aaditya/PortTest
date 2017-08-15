var express = require('express');
var app = express();
var net = require('net');

var server = [],ports = [];
var blacklist = [];
var errors = ['EACCES','EADDRINUSE'];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});	
	
var range = process.argv[2].split(":");
var setup ; 

if(!process.argv[3]) {
	setup = true;
}
else {
	setup = process.argv[3];
}
	
app.get('/',function(req,res) {
	var obj = {
		"status":setup
	}
	res.json(obj);
});



for(let i=range[0];i<=range[1];i++) {
	ports.push(i);
}

var isUsed = function(port,fn) {
	var res;
	var tester = net.createServer()
		.once('error', function (err) {
			if (!errors.includes(err.code)) {
				console.log(err);
			}
			filterPort(port);
		})
		.once('listening', function() {
			tester.once('close', function() { 
				return false; 
			})
			.close()
		})
		.listen(port);
}

ports.forEach(function(element) {
	isUsed(element,filterPort);
});

var filterPort = function(data) {
	blacklist.push(data);
	ports.forEach(function(element,index) {
		if(blacklist.includes(element)) {
			ports.splice(index,1);
		}
	});
}

var host = function() {
	ports.forEach(function(element) {
		server[element] = app.listen(element, function() {
			var port = server[element].address().port;
			console.log("Port "+port+" active with status "+setup+".");	
		});
	});
}

setTimeout(host,1000);