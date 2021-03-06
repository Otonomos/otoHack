import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SmartContracts, AssetWallets, BankAccounts, Transactions } from '../lib/collections';
const fs = require('fs');
solc = require('solc');

Meteor.startup(function() {
  if(Meteor.users.find().count() == 0){
    Accounts.createUser({
      email:    "paul@otonomos.com",
      password: "password",
      profile:  {
        name: "Paul",
        pic:  "https://scontent.xx.fbcdn.net/v/t1.0-1/p80x80/13938547_1171553186245226_3985211402204721399_n.jpg?oh=915851368d877ccf1c544b75c5f8794a&oe=58BD6E60"
      }
    })

    Accounts.createUser({
      email:    "rick@otonomos.com",
      password: "password",
      profile:  {
        name: "Rick B.",
        pic:  "https://scontent.xx.fbcdn.net/v/t1.0-1/p320x320/11811461_10153260114376263_2828059470283617270_n.jpg?oh=725d4f28019aea88b75838a9a85e4a8a&oe=58C74614"
      }
    })
  }
});
