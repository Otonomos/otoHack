import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Controller } from 'angular-ecmascript/module-helpers';
import { AssetWallets, Assets, Transactions, BankAccounts} from '../../../lib/collections';

export default class stCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;
    this.price = 0;
    this.numOfShares = 0;

    this.helpers({
      userAssets(){
        console.log(AssetWallets.find({userId: Meteor.userId()}).fetch());
        return AssetWallets.find({userId: Meteor.userId()});
      },

      totalAmount(){
        return this.price * this.numOfShares;
      },

      thisTransaction() {
        return Transactions.find(Session.get('txID'));
      }
    });

    //this.autoScroll();
  }

  handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

  fromName(userId) {
    if(!userId) userId = Meteor.userId();
    return Meteor.users.findOne(userId).profile.name;
  }

  getAccount(user) {
    if(!user) user = Meteor.userId();
    return BankAccounts.findOne({userId: user}).name;    
  }

  numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  multiply(a, b) {
    return a * b;
  }

  receiveTransfer() {
    console.log(`You are completing the transfer`);

    const thisTX = Transactions.find(Session.get('txID'));
    const thisAmount = thisTX.amount;
    const thisPrice = thisTX.price;
    const thisAsset = thisTX.assetName;

    console.log(`Make payment using DBS API`);
    Meteor.call('makeDBSPayment', function (err, result) {
      if (err) {
        console.log(`An error has occurred in making the DBS payment: ${err}`)
        throw new Meteor.Error(`Failed to make DBS payment: ${err}`);
      } else {
        
        // console.log(`**************** START POLLING FOR DBS API - PAYMENT TX COMPLETE *******************`);
        // let a = 1;
        // pollDBS = Meteor.setInterval(function() {
        //   Meteor.call('checkDBSPayment', function(err, result) {

        //   });
        //   a++;
        //   console.log(`TRANSACTION NOT CONFIRMED ${new Date()}`);
        //   if (a == 5) clearInterval(pollDBS);
        // }, 2000);

        // console.log(`**************** END POLLING FOR DBS API - PAYMENT TX FOUND!!! *******************`);

        Meteor.call('checkDBSPayment', function(err, result) {
          if (err) {
            console.log(`An error occurred: ${err}`);
            callback(err, '');
          } else {

            console.log(`Updating balances for both parties`);

            // Reduce the buyers balance
            baID = BankAccounts.findOne({userId: '"BXw9Mb2HxZn8B5yQ7"'})._id;
            BankAccounts.update({_id: baID}, { $inc : {  amount: (-1 * thisAmount * thisPrice) } });

            // BankAccounts.update({userId: 'oeRQ5F7cTHPWfHAvE'},
            //   { $inc : {  amount: (-1 * thisAmount * thisPrice) } });

            // Increase the sellers balance
            baID = BankAccounts.findOne({userId: 'nqNGdZ9ZN6nL4uoz9'})._id;
            BankAccounts.update({_id: baID}, { $inc : {  amount: (thisAmount * thisPrice) } });

            // BankAccounts.update({userId: 'nqNGdZ9ZN6nL4uoz9'},
            //   { $inc : { amount: (thisAmount * thisPrice) }});

            // Update the assets for both parties

            // Reduce the sellers assets
            awID = AssetWallets.findOne({userId: 'nqNGdZ9ZN6nL4uoz9', assetName: thisAsset})._id;

            AssetWallets.update({_id: awID},
               { $inc: {amount: (-1 * thisAmount)} })

            // AssetWallets.update({userId: 'nqNGdZ9ZN6nL4uoz9', assetName: thisAsset},
            //   { $inc: {amount: (-1 * thisAmount)} })

            // Increase the buyers assets
            awID = AssetWallets.findOne({userId: 'BXw9Mb2HxZn8B5yQ7', assetName: thisAsset})._id;

            AssetWallets.update({_id: awID},
               { $inc: {amount: (thisAmount)} })

            // AssetWallets.update({userId: 'oeRQ5F7cTHPWfHAvE', assetName: thisAsset},
            //   { $inc: {amount: (thisAmount)} })

            // Notify the buyer and seller that transaction settled
            Transaction.update({_id: thisTX}, { $set: { settled: true}});

            // Call the smart contract method to update the blockchain
            finalizeAssetTransfer();

          }
        })
      }
    });

    // var _dbs = new dbs();

    // _dbs.doTxn('0284886660', '0284886680', 50, function (err, result) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log('success: ', result);
    //     console.log('Update balances for both parties');
    //     console.log('Update assets for both parties');
    //     console.log(`Once payment confirmed notify seller`);

    //     _dbs.getTxns('0284886680')

    //     console.log(`Call Smart contract method`);
    //     console.log(`Notify both parties`);
    //   } 
    // });
  }    
}

stCtrl.$name = 'stCtrl';
stCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
