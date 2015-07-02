require('source-map-support').install();

var express = require('express'),
       path = require('path'),
       orangeServer=require('./server/orangeServer'),
        app = express(),
       port = process.env.PORT || 5000;

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res){
  res.sendFile('/index.html');
});

app.get('/oranges', function(req, res){
    var day = req.param('day');
    res.send({ oranges: orangeServer.returnOranges(day) });
});

app.listen(port);
console.log('Server running http://localhost:' + port);
