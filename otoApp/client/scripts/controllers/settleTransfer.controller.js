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
    console.log(`Make payment using DBS API`);
    var _dbs = new dbs();

    _dbs.doTxn('0284886660', '0284886680', 50, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log('success: ', result);

        console.log('Update balances for both parties');
        console.log(`Once payment confirmed notify seller`);
        console.log(`Call Smart contract method`);
        console.log(`Notify both parties`);
      } 
    });
  }    
}

stCtrl.$name = 'stCtrl';
stCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
