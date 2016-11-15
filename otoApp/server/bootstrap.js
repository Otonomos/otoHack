import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SmartContracts, AssetWallets, BankAccounts, Transactions } from '../lib/collections';
const fs = require('fs');
solc = require('solc');

Meteor.startup(function() {

  var solFiles = fs.readdirSync(process.env.PWD+'/contracts');
  console.log('s: ',solFiles);
   solFiles = _.filter(solFiles, function(solFile){ return solFile.endsWith('.sol')});
   //console.log('[startup] solFiles', solFiles);
   var input={};
	 for (var i=0;i<solFiles.length;i++) {
     input[solFiles[i]] = fs.readFileSync(process.env.PWD+'/contracts/'+solFiles[i], 'utf-8');
	 }

    // For development enable a switch to disable Solc compilation which slows down restarts
   if (!Meteor.settings.private.disableSolcCompile) {
     console.log('aaaa');
     // Migrate to Meteor 1.3+ => currently an issue with solc under Meteor 1.3+ so continue to use meteorhacks:npm for now

  	 var output = solc.compile({sources: input}, 1);
  	 console.log(output);
  	 var i=0;
  	 for (var contractName in output.contracts){
  	 	if (SmartContracts.find({bytecode: output.contracts[contractName].bytecode}).count()==0){
  	 		var versionInDB = 1;

  	 		var oldVersion = SmartContracts.findOne({fileName:solFiles[i]},{sort:{versionInDB:-1},limit:1});

  	 		if (oldVersion){
  	 			versionInDB = oldVersion.versionInDB + 1;
  	 		}

  	 		SmartContracts.insert({fileName:solFiles[i],versionInDB:versionInDB, version: 0,bytecode: output.contracts[contractName].bytecode, abi:output.contracts[contractName].interface})
  	 		console.log(solFiles[i]+" smart contract has changed, new version added to DB!!!");
  	 	}
  	 	i++;

  	 }

  } else {
    console.log('Development Flag Set - NOT COMPILING SOLIDITY CONTRACTS!!!');
  }

  if(BankAccounts.find().count() == 0) {
    var bankAccounts = [
      {
        name: "DBS eCurrent Plus xxx-xxxxxx90",
        amount: 2000,
        userId: "nqNGdZ9ZN6nL4uoz9"
      },
      {
        name: "DBS eSavings xxx-xxxxxx12",
        amount: 9000,
        userId: "BXw9Mb2HxZn8B5yQ7"
      }
    ]
    bankAccounts.forEach(function(ba){
      BankAccounts.insert(ba);
    })
  }

  if(AssetWallets.find().count() == 0){
    var assetWallets = [
      {
        userId       : "BXw9Mb2HxZn8B5yQ7",
        assetName    : "Otonomos BCC. Pte. Ltd.",
        amount       : 2001,
        assetAddress : "0x87e3...be3f5845"
      },
      {
        userId       : "nqNGdZ9ZN6nL4uoz9",
        assetName    : "Otonomos BCC. Pte. Ltd.",
        amount       : 5000,
        assetAddress : "0x87e3...be3f5845"
      }
    ]
    //random
    assetWallets.forEach(function(aw){
      AssetWallets.insert(aw);
    })
  }

  if(Transactions.find().count() == 0){
    var transactions = [
      {
        from      : "nqNGdZ9ZN6nL4uoz9",
        to        : "BXw9Mb2HxZn8B5yQ7",
        assetName : "Otonomos BCC. Pte. Ltd.",
        amount    : 1000,
        price     : 5,
        settled   : false
      },
      {
        to      : "nqNGdZ9ZN6nL4uoz9",
        from       : "BXw9Mb2HxZn8B5yQ7",
        assetName : "Otonomos BCC. Pte. Ltd.",
        amount    : 10000,
        price     : 2,
        settled   : true
      }
    ];

    transactions.forEach(function(tx){
      Transactions.insert(tx);
    })
  }
});

