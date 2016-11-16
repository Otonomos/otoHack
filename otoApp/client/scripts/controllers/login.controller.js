import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller {
  constructor(){
    super(...arguments);
    this.email = "";
    this.password = "";
  }

  login() {
    // if (_.isEmpty(this.email)) return;
    // if (_.isEmpty(this.password)) return;

    // const confirmPopup = this.$ionicPopup.confirm({
    //   title: 'Number confirmation',
    //   template: '<div>' + this.phone + '</div><div>Is your phone number above correct?</div>',
    //   cssClass: 'text-center',
    //   okText: 'Yes',
    //   okType: 'button-positive button-clear',
    //   cancelText: 'edit',
    //   cancelType: 'button-dark button-clear'
    // });login

    this.$ionicLoading.show({
      template: "Login to your DBS"
    });

    console.log(this.email, this.password);

    Meteor.loginWithPassword(this.email.toString(), this.password.toString(), (err,res) => {
      this.$ionicLoading.hide();
      if (err) return this.handleError(err);
      this.$state.go('homePage');
    });

    // confirmPopup.then((res) => {
    //   if (!res) return;

      

    //   Accounts.requestPhoneVerification(this.phone, (err) => {
    //     this.$ionicLoading.hide();
    //     if (err) return this.handleError(err);
    //     this.$state.go('confirmation', { phone: this.phone });
    //   });
    // });
  }

  handleError(err) {
    this.$log.error('Login error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Login failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

LoginCtrl.$name = 'LoginCtrl';
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];