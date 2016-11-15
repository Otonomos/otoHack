import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SmartContracts, AssetWallets, BankAccounts, Transactions } from '../lib/collections';
const fs = require('fs');
solc = require('solc');

Meteor.startup(function() {

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
