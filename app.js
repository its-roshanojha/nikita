var express = require('express');
var app = express();
app.use(express.static('./airportcab')); //Serves resources from public folder
var server = app.listen(8963);
console.log('website is listing @ 8963')
