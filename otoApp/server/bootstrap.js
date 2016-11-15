import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { AssetWallets } from '../lib/collections.js';

Meteor.startup(function() {
  if (Meteor.users.find().count() == 0) {
    Accounts.createUserWithPhone({
      phone: '+972501234567',
      profile: {
        name: 'My friend 1'
      }
    });

    Accounts.createUserWithPhone({
      phone: '+972501234568',
      profile: {
        name: 'My friend 2'
      }
    });

    Accounts.createUserWithPhone({
      phone: '+972501234569',
      profile: {
        name: 'My friend 3'
      }
    });
  }

  if (AssetWallets.find().count() == 0) {
    AssetWallets.insert({
      userId: "cGPgYXTixmNdFXkXB",
      assetName: "Shares @Otonomos"
    })
  }
});