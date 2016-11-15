import { Transactions } from '../lib/collections';
import { Random } from 'meteor/random';

Meteor.methods({

  // Method for initiating an asset transfer
  initiateTransfer() {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to initiate an asset transfer.');
    }

    Transactions.insert({
        "_id" : "qNGdZ9ZN6nL4uoz9n", 
        "from" : "nqNGdZ9ZN6nL4uoz9", 
        "to" : "BXw9Mb2HxZn8B5yQ7", 
        "assetName" : "Cool Story Ltd.", 
        "amount" : NumberInt(1000), 
        "price" : NumberInt(5), 
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
