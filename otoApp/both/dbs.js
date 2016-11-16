//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';



dbs = function(){
	this.error     = false;
  this.dbsAPIKey = '59212a29-d807-484f-9b58-ef59ddd9f210';
  this.dbsAPIEndpoint = 'https://developers.dbs.com:10443/api/sg/v1/';
  this.apiHeaders = {
    'Content-Type': 'application/json',
    'apiKey': this.dbsAPIKey,
    'uuid' : 'dd',
    'Authorization' : 'bPIIqpDNbR14tBI0X+DbkVWa0Ao='
  };
  this.accessToken = 'bPIIqpDNbR14tBI0X+DbkVWa0Ao=';
}

dbs.prototype.init = function(){

}

//Account 1: 0284886660
//Account 2: 0284886680

//var a = new dbs().getTxns('0284886660')
dbs.prototype.getTxns = function(accountId, callback){
  var result = HTTP.call("GET", this.dbsAPIEndpoint + "accounts/" + accountId + "/transactions", {
    headers: this.apiHeaders,
    npmRequestOptions: { // We need to add this to prevent cert issues
      rejectUnauthorized: false
    },
    //content: '{"accesstokenDetl":{"partnerid":"HCK1","app id":"0002","userid": "hck1user","passwd":"Hackathon1"}}'
  }, function(e, r){
    //console.log(e,r);
    if( e ) {
      callback(e, '');
    } else {
      callback(null, r);
    }
    // console.log( r.content )
  });
}

//Account 1: 0284886660
//Account 2: 0284886680
dbs.prototype.doTxn = function(from, to, amount, callback){
  apiContent = '{"transferType":"01","transactionAmount":{"amount":1,"currency":"SGD"},"valueDate":"2016-11-15","transactionDesc":"test","transferFromDetl":{"accountId":"'+from+'","productType":"CA","accountNumber":"028-28967124"},"transferToDetl":{"accountId":"'+to+'","productType":"CA","accountNumber":"028-28967124"}}'; 

  console.log(`*********************** START DBS API REQUEST *********************`);
  console.log(JSON.stringify(JSON.parse(apiContent), null, 2)); 
  console.log(`*********************** END DBS API REQUEST *********************`);

  var result = HTTP.call("POST", this.dbsAPIEndpoint + "accounts/" + from + "/fundsTransfer", {
    headers: this.apiHeaders,
    npmRequestOptions: { // We need to add this to prevent cert issues
      rejectUnauthorized: false
    },
    content : apiContent
  }, function(e, r){
    if ( e ) {
      callback (e, null);
    } else {
      console.log(`*********************** START DBS API REPLY *********************`);
      console.log(JSON.stringify(r.data, null, 2)); 
      console.log(`*********************** END DBS API REPLY *********************`);      
      callback(e, r.data.transactionReference);
    }
  });
}

//Account 1: 0284886660 (028-28967124)
//Account 2: 0284886680 (028-28967124)
//var a = new dbs().getAccount('0284886680')
dbs.prototype.getAccount = function(accountId){
  var result = HTTP.call("GET", this.dbsAPIEndpoint + "depositAccounts/" + accountId + "?productType=CA", {
    headers: this.apiHeaders,
    npmRequestOptions: {
      rejectUnauthorized: false
    }
  }, function(e, r){
    // console.log(e,r);

  //  if( e )
//      throw e;

  });
}


//Get the accessToken needed for all requests, this is fixed and has no expiry. Thats why I put one in the constructor
dbs.prototype.getAccessToken = function(){
  var result = HTTP.call("POST", this.dbsAPIEndpoint + "accessToken", {
    headers: this.apiHeaders,
    npmRequestOptions: { // We need to add this to prevent cert issues
      rejectUnauthorized: false
    },
    content: '{"accesstokenDetl":{"partnerid":"HCK1","app id":"0002","userid": "hck1user","passwd":"Hackathon1"}}'
  }, function(e, r){
    if( e )
      throw e;

    console.log('AccessToken: ', r.data.accessToken);
    return r.data.accessToken;
  });
}

dbs.prototype.getParties = function(){
  var result = HTTP.call("GET", this.dbsAPIEndpoint + "parties", {
    headers: this.apiHeaders,
    npmRequestOptions: { // We need to add this to prevent cert issues
      rejectUnauthorized: false
    },
    //content: '{"accesstokenDetl":{"partnerid":"HCK1","app id":"0002","userid": "hck1user","passwd":"Hackathon1"}}'
  }, function(e, r){
    // console.log(e,r);
  });
}
