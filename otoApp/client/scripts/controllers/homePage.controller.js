import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
  
import { Controller } from 'angular-ecmascript/module-helpers';
import { AssetWallets, Assets, BankAccounts, Transactions } from '../../../lib/collections';

export default class hpCtrl extends Controller {
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

      bankAccounts(){
        return BankAccounts.find({userId: Meteor.userId()});
      },

      assetWallets(){
        return AssetWallets.find({userId: Meteor.userId()});
      },

      transactions(){
        console.log(Transactions.find({to: Meteor.userId()}).fetch())
        return Transactions.find({to: Meteor.userId()});
      },

      cUser(){
        return Meteor.user();
      }

  });

    //this.autoScroll();
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  goToPage(pageName){
    this.$state.go(pageName);
  }

  multiply(a,b){
    return a*b;
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

  fromName(userId){
    //console.log('userId', userId);
    if(!userId) userId = Meteor.userId();
    return Meteor.users.findOne(userId).profile.name;
  }

  setupSettleTransfer(txID) {
    Session.set('txID', txID);
    // Redirect
    this.$state.go('settleTransfer');    
  }

  logout(){
    Meteor.logout();
    this.$state.go('login');
  }
}

hpCtrl.$name = 'hpCtrl';
hpCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log', '$state'];
