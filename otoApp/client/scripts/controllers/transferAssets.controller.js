import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
//
import { Controller } from 'angular-ecmascript/module-helpers';
import { AssetWallets, Assets } from '../../../lib/collections';

//gethqp6lx.southeastasia.cloudapp.azure.com
export default class taCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;
    this.amount = 0;
    this.price = 0;
    this.toUserId = "BXw9Mb2HxZn8B5yQ7";

    this.helpers({
      userAssets(){
        console.log(AssetWallets.find({userId: Meteor.userId()}).fetch());
        return AssetWallets.find({userId: Meteor.userId()});
      },

      totalAmount(){
        return this.price * this.amount;
      },

      cUser(){
        return Meteor.user();
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

  transfer(){
    var self = this;
    // Meteor.call('initiateAssetTransfer', this.toUserId, this.amount, this.price, function(err,res){
    Meteor.call('initiateAssetTransfer', function(err,res) {      
      if(!err){
        self.$state.go('homePage');
      }
    })
  }
}

taCtrl.$name = 'taCtrl';
taCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log', '$state'];
