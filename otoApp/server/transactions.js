import { Transactions } from '../lib/collections';
import { Random } from 'meteor/random';

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
        "assetName" : "Otonomos BCC. Pte. Ltd.", 
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
  }

});
