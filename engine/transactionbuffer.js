
let transasaction = new transasactionbuffer()

function transasactionbuffer(){
	this.account;
	this.jsonarray = [];
}

function addtotransactionarray(txs, account){
	transasaction.jsonarray = txs;
	transasaction.account = account;
	return;
}

function returntransactionarray(){
  return transasaction.jsonarray;
}

function returnaccount(){
	return transasaction.account;
}

function emptybuffer(){
	transasaction.account;
	transasaction.jsonarray = [];
}

module.exports = {addtotransactionarray, returntransactionarray, returnaccount, emptybuffer}