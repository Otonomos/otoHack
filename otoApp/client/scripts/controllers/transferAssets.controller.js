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
    this.amount = "";
    this.price = "";
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

  fingerprint(){
    var self = this;
    var myPopup = this.$ionicPopup.show({
      template: '<center><img src="http://ngcordova.com/img/feature-touchid.png" width="50"></br><strong>Touch ID</strong><br/>Authentication is needed to initiate asset transfer<br/><br/></center>',

    })

    setTimeout(function(){
      myPopup.close();
      self.$ionicLoading.show({
        template: "Authenticating your fingerprint..."
      });

      setTimeout(function(){
        self.transfer();
      },1000)
    },1500)
  }

  transfer(){
    var self = this;
    // Meteor.call('initiateAssetTransfer', this.toUserId, this.amount, this.price, function(err,res){
    this.$ionicLoading.show({
      template: "Initiating asset transfer on the blockchain..."
    })

    Meteor.call('initiateAssetTransfer', function(err,res) {      
      if(!err){
        setTimeout(function(){
          self.$ionicLoading.show({
            template: "Notifying the recipient ..."
          })
          Meteor.call('initiateTransfer', self.toUserId, self.amount, self.price, function(err,res){

            setTimeout(function(){
              self.$ionicLoading.show({
                template: "Asset transfer successfully initiated!",
                timeout: 3000
              })

              setTimeout(function(){
                self.$ionicLoading.hide();
                self.$state.go('homePage');
              },1000)
            },1000)
            

            

          })
        },1000)
        
      }
    })
  }
}

taCtrl.$name = 'taCtrl';
taCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log', '$state', '$ionicLoading', '$ionicPopup'];
