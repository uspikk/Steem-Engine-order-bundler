const SSC = require("sscjs");
const ssc = new SSC('https://api.steem-engine.com/rpc2');

let transactionbuffer = require("./transactionbuffer.js").addtotransactionarray

let steemengine = new getbook();

function getbook(){
	this.book = [];
	this.account;
	this.decimal;
}

getbook.prototype.getlong = function(symbol, account, offset, book){
  this.book = [];
  this.account = account;
  ssc.find(
      'market',
      'sellBook',           
      {'symbol': symbol, 'account': account}, 
      1000, 
      offset, 
      [],
      (err, result) => {
        if(err){
        	console.log(err)
        }
        if(result){
        	for(var i=0;i<result.length;i++){
        		book.push(result[i]);
                if(i===result.length - 1 && result.length === 1000){
                  offset = offset + 1000;
                  this.getlong(symbol, account, offset, book);
                  return;
                }
                if(i===result.length - 1){
                  this.book = book.sort(function(a,b){return a.price - b.price});
                    ssc.find('tokens', 'tokens', { symbol: symbol }, 10, 0, [], (err, res) => {
                     if(res){
                     	this.decimal = res[0].precision
                        this.calculatesteemvalues();
                        return;
                     }
                   })
                }
        	}
        }
  });
}

getbook.prototype.calculatesteemvalues = function(){
	for(var i=0;i<this.book.length;i++){
		this.book[i].steemVal = (JSON.parse(this.book[i].quantity) * JSON.parse(this.book[i].price)).toFixed(8)*1
		if(i===this.book.length - 1){
			return;
		}
	}
}

function sortmethod(object){
steemengine.getlong(object.symbol, object.acc, 0, [])
}

function returnbook(){
	return steemengine.book;
}

function compileorders(txids, wholetxs){
  if(txids.length === 0){
    for(var i=0;i<wholetxs.length;i++){
    	wholetxs[i].quantity = JSON.parse(wholetxs[i].quantity);
    	wholetxs[i].price = JSON.parse(wholetxs[i].price);
    	if(i===wholetxs.length - 1){
    		generateneworder(wholetxs);
    		return;
    	}
    }
  }
  for(var i=0;i<steemengine.book.length;i++){
  	if(txids[0] === steemengine.book[i].txId){
  		wholetxs.push(steemengine.book[i]);
  		txids.shift();
  		compileorders(txids, wholetxs);
  		return;
  	}
  }
}

function generateneworder(txs){
  txs = txs.sort(function(a,b){return b.price - a.price});
  let highestprice = txs[0].price.toFixed(8)*1;
  let quantity = 0;
  let txarray = []
  for(var i=0;i<txs.length;i++){
  	quantity = (quantity+txs[i].quantity).toFixed(steemengine.decimal)*1;
  	  let cancelobj = {
      "contractName" : "market",
      "contractAction" : "cancel",
      "contractPayload": {
          "type":"sell",
          "id":txs[i].txId
          }
      }
    txarray.push(cancelobj);
    if(i===txs.length-1){
      let buyobj = {
        "contractName" : "market",
        "contractAction" : "sell",
        "contractPayload" : {
           "symbol": txs[0].symbol,
           "quantity": JSON.stringify(quantity),
           "price": JSON.stringify(highestprice)
           }
        }
        txarray.push(buyobj);
        transactionbuffer(txarray, steemengine.account);
    }
  }
}

module.exports = {sortmethod, returnbook, compileorders}