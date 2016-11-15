//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

dbs = function(){
	this.error     = false;
  this.dbsAPIKey = '59212a29-d807-484f-9b58-ef59ddd9f210';
  this.dbsAPIEndpoint = 'https://developers.dbs.com:10443/api/sg/v1/';
}

dbs.prototype.init = function(){

}

dbs.prototype.getAccessToken = function(){

  try {
    var result = HTTP.call("POST", this.dbsAPIEndpoint + "accessToken", {
      headers: {
        'Content-Type': 'application/json',
        'apiKey': this.dbsAPIKey,
        'uuid': 'dd'
      },
      body: {
        accessTokenDetl : {
          "partnerid": "HCK1",
          "applicationId": "0002",
          "userid": "PortalUser1@testmail.com",
          "password": "password123"
        }
      },
      npmRequestOptions: {
        rejectUnauthorized: false
      }
    }, function(e, r){
      console.log('e,r: ',e,r);
    });

  } catch (e) {
    console.log(e);
    return false;
  }
}
