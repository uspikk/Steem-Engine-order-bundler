const express = require("express");
const path = require("path");
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
var assert = require('assert');

//npm run dev

const getlong = require("./engine/getlongbook.js").sortmethod
const returnlong = require("./engine/getlongbook.js").returnbook
const compilelong = require("./engine/getlongbook.js").compileorders
const gettransactionbuffer = require("./engine/transactionbuffer.js").returntransactionarray
const getaccount = require("./engine/transactionbuffer.js").returnaccount
const emptybuffer = require("./engine/transactionbuffer.js").emptybuffer
const getshort = require("./engine/getshortbook.js").sortmethod
const returnshort = require("./engine/getshortbook.js").returnbook
const compileshort = require("./engine/getshortbook.js").compileorders

const publicDirectoryPath = path.join(__dirname + '/public');
const viewsPath = path.join(__dirname + '/templates');


app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(publicDirectoryPath));
app.use('/public', express.static(publicDirectoryPath));


app.get("/", function(req,res){
   let thelength = gettransactionbuffer();
   let thearray = gettransactionbuffer();
   let theaccount = getaccount();
   thearray = JSON.stringify(thearray)
   thearray = JSON.stringify(thearray)
   thelength = thelength.length
   if(thelength>0){res.render("index", {txbutton:true, txtlogic:thearray, account:theaccount})}
   else{
    res.render("index", {default:true})
   }
});

app.get("/lookup", function(req,res){
   res.render("index", {lookup:true})
});

app.post('/gettoken', function(req, res, next) {
  var item = {
    symbol: req.body.token,
    acc: req.body.account,
    mode: req.body.mode
  }
  if(req.body.mode === "long"){
  	getlong(item);
  	res.redirect('/lbooks');
  }
  if(req.body.mode === "short"){
  	getshort(item);
  	res.redirect('/sbooks')
  }
});

app.post('/slong', function(req, res, next) {
  let txidarr = []
  for(prop in req.body){
   if(Object.prototype.hasOwnProperty.call(req.body, prop)){
    txidarr.push(req.body[prop])
   }
  }
  compilelong(txidarr, [])
  res.redirect('/')
});

app.get("/lbooks", function(req,res){
	let thebook = returnlong();
	res.render("index", {lbooks:true, items:thebook})
})

app.get("/sbooks", function(req,res){
	let thebook = returnshort();
	res.render("index", {sbooks:true, items:thebook})
})

app.post('/sshort', function(req, res, next) {
  let txidarr = []
  for(prop in req.body){
   if(Object.prototype.hasOwnProperty.call(req.body, prop)){
    txidarr.push(req.body[prop])
   }
  }
  compileshort(txidarr, [])
  res.redirect('/')
});

app.get("/reset", function(req,res){
   emptybuffer();
   res.redirect("/")
});


app.listen(process.env.port || 8001);
console.log("running on port 8001");
