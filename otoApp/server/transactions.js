//import { Transactions } from '../lib/collections';
import { Random } from 'meteor/random';
import { Transactions, BankAccounts, AssetWallets } from '../lib/collections';

Meteor.methods({

  // Method for initiating an asset transfer
  initiateTransfer(toUserId, amount, price) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to initiate an asset transfer.');
    }

    Transactions.insert({
        "from" : this.userId, 
        "to" : toUserId, 
        "assetName" : "Otonomos BCC. Pte. Ltd. shares", 
        "amount" : parseInt(amount), 
        "price" :  parseInt(price), 
        "settled" : false
    });
  },
  // Method for completing an asset transfer  
  completeTransfer() {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to initiate an asset transfer.');
    }

    Transactions.update({
        _id: "qNGdZ9ZN6nL4uoz9n"
    }, 
    { $set :
        {
            settled: true
        }
    });
  },

  // Method to make the DBS payment for a transfer
  makeDBSPayment() {
    const _dbs = new dbs();

    _dbs.doTxn('0284886660', '0284886680', 50, function (err, result) {
      if (err) {
        console.log(err);
        //callback(err, '');
      } else {
        // console.log('success: ', result);
        // console.log('Update balances for both parties');
        // console.log(`Once payment confirmed notify seller`);
        // console.log(`About to query for transactions`);
        // _dbs.getTxns('0284886680')
        // console.log(`Call Smart contract method`);
        // console.log(`Notify both parties`);
        //callback(null, result);
        return result;
      } 
    });
  },

  // Method to make the DBS payment for a transfer
  checkDBSPayment() {
    const _dbs = new dbs();

    _dbs.getTxns('0284886660', function (err, result) {
      if (err) {
        console.log(err);
        throw new Meteor.Error(`Not Cool story bro: ${err}`);
        // callback(err, '');
      } else {
        return result;
        // callback(null, result);
      } 
    });
  }, 

  resetEverything(){
    BankAccounts.remove({});
    AssetWallets.remove({});
    Transactions.remove({});

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
          assetName    : "Otonomos BCC. Pte. Ltd. shares",
          amount       : 1,
          assetAddress : "0x87e3...be3f5845"
        },
        {
          userId       : "nqNGdZ9ZN6nL4uoz9",
          assetName    : "Otonomos BCC. Pte. Ltd. shares",
          amount       : 5000,
          assetAddress : "0x87e3...be3f5845"
        },
        {
          userId       : "nqNGdZ9ZN6nL4uoz9",
          assetName    : "Physical Gold (Troy Ounces)",
          amount       : 400,
          assetAddress : "0x87e3...be3f5845"
        },
        {
          userId       : "nqNGdZ9ZN6nL4uoz9",
          assetName    : "Changi Land (Hectares)",
          amount       : 50,
          assetAddress : "0x87e3...be3f5845"
        }               
      ]
      //random
      assetWallets.forEach(function(aw){
        AssetWallets.insert(aw);
      })
    }

    // if(Transactions.find().count() == 0){
    //   var transactions = [
    //     {
    //       from      : "nqNGdZ9ZN6nL4uoz9",
    //       to        : "BXw9Mb2HxZn8B5yQ7",
    //       assetName : "Otonomos BCC. Pte. Ltd. shares",
    //       amount    : 1000,
    //       price     : 5,
    //       settled   : false
    //     },
    //     {
    //       to      : "nqNGdZ9ZN6nL4uoz9",
    //       from       : "BXw9Mb2HxZn8B5yQ7",
    //       assetName : "Otonomos BCC. Pte. Ltd. shares",
    //       amount    : 10000,
    //       price     : 2,
    //       settled   : true
    //     }
    //   ];

    //   transactions.forEach(function(tx){
    //     Transactions.insert(tx);
    //   })
    // }
  }

});
