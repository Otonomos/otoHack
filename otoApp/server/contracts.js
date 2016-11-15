var lightwallet = require('eth-lightwallet');
import coder from 'web3/lib/solidity/coder';
import { ContractAddresses } from '../lib/collections';
import { SmartContracts } from '../lib/collections';
Fiber = Npm.require('fibers');

var web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.ethereum.host));

var txutils = lightwallet.txutils
var signing = lightwallet.signing
var encryption = lightwallet.encryption

function encodeConstructorParams (abi, params) {
  //console.log(params.length)
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
      //console.log('types:'+types+ ' / params: '+params);
      //console.log('coder.encodeParams(types, params) : '+coder.encodeParams(types, params));
        return coder.encodeParams(types, params);
    })[0] || '';
};

string2Bin = function(str){

	if( !str ) return false;

  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

var smartAssetABI = [{"constant":false,"inputs":[{"name":"_amount","type":"uint256"},{"name":"_toAddress","type":"address"},{"name":"_DBSAccountNo","type":"string"},{"name":"_oracleContractAddress","type":"address"}],"name":"initiateAssetTransfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_DBSAccountNo","type":"string"}],"name":"finalizeAssetTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_DBSAccountNo","type":"string"}],"name":"cxlPendingTxn","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_assetDocumentation","type":"bytes"},{"name":"_initialAssetHolders","type":"address[]"},{"name":"_initialAssetAmounts","type":"uint256[]"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"something","type":"string"}],"name":"log","type":"event"}]
var oracleABI     = [{"constant":false,"inputs":[{"name":"_DBSAccountNo","type":"string"}],"name":"registerAssetToAccount","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_DBSAccountNo","type":"string"}],"name":"updateAsset","outputs":[],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"something","type":"string"}],"name":"log","type":"event"}]

var smartAssetCode = '6060604052604051610fec380380610fec833981016040528080518201919060200180518201919060200180518201919060200150505b60008251600160005081905550600090505b825181101560b757818181518110156002579060200190602002015160006000506000858481518110156002579060200190602002015173ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b80806001019150506048565b5b50505050610f22806100ca6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806328f9790a1461005d57806381045ead146100d357806398811b1a146100fb578063d1ef26771461015657610058565b610002565b34610002576100d16004808035906020019091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919080359060200190919050506101b1565b005b34610002576100e560048050506107c2565b6040518082815260200191505060405180910390f35b34610002576101546004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506107d4565b005b34610002576101af6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610c75565b005b7f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260018152602001807f310000000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390a183600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156102af57506000600260005083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060040160009054906101000a900460ff1660ff16145b15610703577f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260018152602001807f320000000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390a160c0604051908101604052803381526020018481526020018581526020018381526020016001815260200182815260200150600260005083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c01000000000000000000000000908102040217905550604082015181600201600050556060820151816003016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061047a57805160ff19168380011785556104ab565b828001600101855582156104ab579182015b828111156104aa57825182600050559160200191906001019061048c565b5b5090506104d691906104b8565b808211156104d257600081815060009055506001016104b8565b5090565b505060808201518160040160006101000a81548160ff02191690837f010000000000000000000000000000000000000000000000000000000000000090810204021790555060a08201518160040160016101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055509050507f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260018152602001807f330000000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff166385fc04cb83604051827c010000000000000000000000000000000000000000000000000000000002815260040180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561066e5780820380516001836020036101000a031916815260200191505b5092505050600060405180830381600087803b156100025760325a03f115610002575050507f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260018152602001807f340000000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390a16107bb565b7f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260418152602001807f4e6f7420656e6f7567682061737365747320746f207472616e73666572206f7281526020017f207072652d6578697374696e672070656e64696e67207472616e73616374696f81526020017f6e0000000000000000000000000000000000000000000000000000000000000081526020015060600191505060405180910390a15b5b50505050565b600060016000505490506107d1565b90565b6001600260005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060040160009054906101000a900460ff1660ff161480156108c757503373ffffffffffffffffffffffffffffffffffffffff16600260005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060040160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15610bdf57600260005081604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000506002016000505460006000506000600260005084604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550600260005081604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000506002016000505460006000506000600260005084604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540192505081905550600260005081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600282016000506000905560038201600050805460018160011615610100020316600290046000825580601f10610b5f5750610b9c565b601f016020900490600052602060002090810190610b9b9190610b7d565b80821115610b975760008181506000905550600101610b7d565b5090565b5b506004820160006101000a81549060ff02191690556004820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555050610c71565b7f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f5060405180806020018281038252602c8152602001807f4e6f2070656e64696e672074787320666f756e64206f722077726f6e67206f7281526020017f61636c652061646472657373000000000000000000000000000000000000000081526020015060400191505060405180910390a15b5b50565b6001600260005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060040160009054906101000a900460ff1660ff16148015610d6857503373ffffffffffffffffffffffffffffffffffffffff16600260005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15610eb257600260005081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600282016000506000905560038201600050805460018160011615610100020316600290046000825580601f10610e325750610e6f565b601f016020900490600052602060002090810190610e6e9190610e50565b80821115610e6a5760008181506000905550600101610e50565b5090565b5b506004820160006101000a81549060ff02191690556004820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555050610f1e565b7f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f5060405180806020018281038252601e8152602001807f4e6f2070656e64696e67207478206f72206e6f742074782073656e646572000081526020015060200191505060405180910390a15b5b5056';
var oracleCode     = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b610416806100516000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806385fc04cb14610047578063c54216b4146100a257610042565b610002565b34610002576100a06004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506100fd565b005b34610002576100fb6004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061019b565b005b60206040519081016040528033815260200150600160005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055509050505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610412576000600160005082604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103a557600160005081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166398811b1a82604051827c010000000000000000000000000000000000000000000000000000000002815260040180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561037b5780820380516001836020036101000a031916815260200191505b5092505050600060405180830381600087803b156100025760325a03f11561000257505050610411565b7f41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f506040518080602001828103825260208152602001807f4552524f523a206e6f20617373657420636f6e747261637420746f2063616c6c81526020015060200191505060405180910390a15b5b5b5056';

// You can change this to your seed
// and the nonce of the first address
var seed = 'cactus diesel absent fun rate eye wagon collect motion energy siege trust' // 0x8529b49a04d1a8568b85bcb9a11a79eb130a552d

lightwallet.keystore.deriveKeyFromPassword('mypassword', function(err, pwDerivedKey) {
  if( pwDerivedKey ){
    try{
      var keystore = new lightwallet.keystore(seed, pwDerivedKey);
      keystore.generateNewAddress(pwDerivedKey);

      var sendingAddr = keystore.getAddresses()[0];
      console.log(sendingAddr);
      try{
        var nonce = web3.eth.getTransactionCount(keystore.getAddresses()[0], "pending");
      }catch(e){
        console.log('0',e);
      }
      console.log('nonce: ',nonce);
    }catch(e){
      console.log('1',e);
    }

    // The transaction data follows the format of ethereumjs-tx
    var data = oracleCode + encodeConstructorParams(oracleABI,[])
    txOptions = {
        gasPrice: parseInt(web3.eth.gasPrice),
        gasLimit: 4000000,
        nonce: nonce,
        data: data
    }
    console.log('2',txOptions);

    try{
      // sendingAddr is needed to compute the contract address
      var contractData = txutils.createContractTx(sendingAddr, txOptions)
      var signedTxn = signing.signTx(keystore, pwDerivedKey, contractData.tx, sendingAddr)
    }catch(e){
      console.log('3',e);
    }

    console.log('Signed Contract creation TX: ' + signedTxn)
    console.log('')
    console.log('ORACLE contract address: 0x' + contractData.addr)
    console.log('')

    try{
      Fiber(function(){
        ContractAddresses.remove({}, function(e,r){
          console.log('DB e,r: ',e,r);
        });
        ContractAddresses.insert({
          type: 'Oracle',
          address:'0x'+contractData.addr}, function(e,r){
          console.log('DB e,r: ',e,r);
        });
      }).run();
    }catch(e){
      console.log(e);
    }

    web3.eth.sendRawTransaction(signedTxn,function(error,result){
		  if(error){
		  	console.log('SendTxn 1 error: ',error);
		  }else{
				console.log('SendTxn 1 result: ',result);
        var nonce = web3.eth.getTransactionCount(keystore.getAddresses()[0], "pending");
        console.log('follow-up nonce: ',nonce);
        var params = [string2Bin('assetInfo'),
                      ['0xa3cff205242f753f8dcb65d10e879ab1642f02a3'], // key dad injury rabbit core steel heavy return drum helmet high wide
                      [50]
                     ]
        console.log(params);
        var data = smartAssetCode + encodeConstructorParams(smartAssetABI,params);
        txOptions = {
            gasPrice: parseInt(web3.eth.gasPrice),
            gasLimit: 4000000,
            nonce: nonce,
            data: data
        }
        try{
          // sendingAddr is needed to compute the contract address
          var contractData = txutils.createContractTx(sendingAddr, txOptions)
          var signedTxn = signing.signTx(keystore, pwDerivedKey, contractData.tx, sendingAddr)
          Fiber(function(){
            ContractAddresses.insert({
              type: 'Asset',
              address:'0x'+contractData.addr}, function(e,r){
              console.log('DB e,r: ',e,r);
            });
          }).run();
        }catch(e){
          console.log('3',e);
        }
        web3.eth.sendRawTransaction(signedTxn,function(error,result){
          if(error){
            console.log('SendTxn 2 error: ',error);
          }else{
            console.log('SendTxn 2 result: ',result);
          }
        });
		  }
		});
  }

  /*
  // TX to register the key 123
  txOptions.to = contractData.addr
  txOptions.nonce += 1
  var registerTx = txutils.functionTx(abi, 'register', [123], txOptions)
  var signedRegisterTx = signing.signTx(keystore, pwDerivedKey, registerTx, sendingAddr)

  // inject signedRegisterTx into the network...
  console.log('Signed register key TX: ' + signedRegisterTx)
  console.log('')

  // TX to set the value corresponding to key 123 to 456
  txOptions.nonce += 1
  var setValueTx = txutils.functionTx(abi, 'setValue', [123, 456], txOptions)
  var signedSetValueTx = signing.signTx(keystore, pwDerivedKey, setValueTx, sendingAddr)

  // inject signedSetValueTx into the network...
  console.log('Signed setValueTx: ' + signedSetValueTx)
  console.log('')

  // Send a value transaction
  txOptions.nonce += 1
  txOptions.value = 1500000000000000000
  txOptions.data = undefined
  txOptions.to = 'eba8cdda5058cd20acbe5d1af35a71cfc442450e'
  var valueTx = txutils.valueTx(txOptions)

  var signedValueTx = signing.signTx(keystore, pwDerivedKey, valueTx, sendingAddr)
  console.log('Signed value TX: ' + signedValueTx)
  console.log('')
  */

});

Meteor.methods({

  initiateAssetTransfer: function(){
    seed = 'key dad injury rabbit core steel heavy return drum helmet high wide';
    lightwallet.keystore.deriveKeyFromPassword('mypassword', function(err, pwDerivedKey) {
      if( pwDerivedKey ){
        var keystore = new lightwallet.keystore(seed, pwDerivedKey);
        keystore.generateNewAddress(pwDerivedKey);
        var sendingAddr = keystore.getAddresses()[0];
        var assetAddress;
        Fiber(function(){
          oracleAddress = ContractAddresses.findOne({type: 'Oracle'}).address;
          assetAddress = ContractAddresses.findOne({type:'Asset'}).address;
          console.log('oracleAddress',oracleAddress);
          console.log('assetAddress',assetAddress);
          var nonce = web3.eth.getTransactionCount(keystore.getAddresses()[0], "pending");
          console.log('initiate transfer nonce: ',nonce);
          try{
            var params = [25,
                          '0x2963afb32be0d6e88e0919264a041037d29331d3', // again coffee spin firm medal math whip rug sport expose simple mass
                          '01010101',
                          oracleAddress
                        ];
            console.log('initiateAssetTransfer params: ',params);
          }catch(e){
            console.log(e);
          }
          try{
            txOptions = {
                gasPrice: parseInt(web3.eth.gasPrice),
                gasLimit: 4000000,
                nonce: nonce,
                to: assetAddress
            }
          }catch(e){
            console.log(e);
          }
          console.log(txOptions);
          try{
            // sendingAddr is needed to compute the contract address
            var sigData = txutils.functionTx(smartAssetABI, 'initiateAssetTransfer', params, txOptions);
            console.log(sigData);
            var signedTxn = signing.signTx(keystore, pwDerivedKey, sigData, sendingAddr)
          }catch(e){
            console.log('initiateAssetTransfer error: ',e);
          }
          web3.eth.sendRawTransaction(signedTxn,function(error,result){
            if(error){
              console.log('initiateAssetTransfer error: ',error);
            }else{
              console.log('initiateAssetTransfer result: ',result);
            }
          });
        }).run();
      }
    });
  },

  finalizeAssetTransfer: function(){
    lightwallet.keystore.deriveKeyFromPassword('mypassword', function(err, pwDerivedKey) {
      if( pwDerivedKey ){
        var keystore = new lightwallet.keystore(seed, pwDerivedKey);
        keystore.generateNewAddress(pwDerivedKey);
        var sendingAddr = keystore.getAddresses()[0];
        var oracleAddress;
        Fiber(function(){
          oracleAddress = ContractAddresses.findOne({type: 'Oracle'}).address;
          console.log('oracleAddress ', oracleAddress);
          var nonce = web3.eth.getTransactionCount(keystore.getAddresses()[0], "pending");
          console.log('finalize transfer nonce: ',nonce);
          var params = ['01010101'];
          txOptions = {
              gasPrice: parseInt(web3.eth.gasPrice),
              gasLimit: 4000000,
              nonce: nonce,
              to: oracleAddress
          }
          try{
            // sendingAddr is needed to compute the contract address
            var sigData = txutils.functionTx(oracleABI, 'updateAsset', params, txOptions);
            var signedTxn = signing.signTx(keystore, pwDerivedKey, sigData, sendingAddr)
          }catch(e){
            console.log('finalizeAssetTransfer error: ',e);
          }
          web3.eth.sendRawTransaction(signedTxn,function(error,result){
            if(error){
              console.log('finalizeAssetTransfer error: ',error);
            }else{
              console.log('finalizeAssetTransfer result: ',result);
            }
          });
        }).run();
      }
    });
  },
  cancelTxn: function(){
    // needed?
  },
  getIndex: function(resoAddress){
    console.log(resoAddress);
    var resoCode = smartAssetCode;
    var resoABI = smartAssetABI;

    var resoContract 	= web3.eth.contract(resoABI);
    var resoInstance 	= resoContract.at(resoAddress);
    try{
      var ind = resoInstance.getIndex();
      console.log('ind: ', ind);
      return ind;
    }catch(e){
      console.log(e);
    }
  }
});
