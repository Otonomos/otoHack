import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
const fs = require('fs');

Meteor.startup(function() {
  // if (Meteor.users.find().count() != 0) return;

  // Accounts.createUserWithPhone({
  //   phone: '+972501234567',
  //   profile: {
  //     name: 'My friend 1'
  //   }
  // });
  //
  // Accounts.createUserWithPhone({
  //   phone: '+972501234568',
  //   profile: {
  //     name: 'My friend 2'
  //   }
  // });
  //
  // Accounts.createUserWithPhone({
  //   phone: '+972501234569',
  //   profile: {
  //     name: 'My friend 3'
  //   }
  // });

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
     var solc = Meteor.npmRequire('solc');

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

});
