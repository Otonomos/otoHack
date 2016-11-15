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
        "assetName" : "Otonomos BCC Pte. Ltd.", 
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
  }
});
