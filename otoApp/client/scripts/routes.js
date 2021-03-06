import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

class RoutesConfig extends Config {
  constructor() {
    super(...arguments);

    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
  }

  configure() {
    this.$stateProvider
      .state('tab.eth', {
        url: '/eth',
        views: {
          'tab-chats': {
            templateUrl: 'client/templates/eth.html',
            controller: 'EthCtrl as eth'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'client/templates/login.html',
        controller: 'LoginCtrl as logger'
      })
      .state('homePage',{
        url: '/homePage',
        templateUrl: 'client/templates/homePage.html',
        controller: 'hpCtrl as hp',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('transferAssets', {
        url: '/transferAssets',
        templateUrl: 'client/templates/transferAssets.html',
        controller: 'taCtrl as ta',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('settleTransfer', {
        url: '/settleTransfer',
        templateUrl: 'client/templates/settleTransfer.html',
        controller: 'stCtrl as st',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('confirmation', {
        url: '/confirmation/:phone',
        templateUrl: 'client/templates/confirmation.html',
        controller: 'ConfirmationCtrl as confirmation'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'client/templates/profile.html',
        controller: 'ProfileCtrl as profile',
        resolve: {
          user: this.isAuthorized
        }
      })

    this.$urlRouterProvider.otherwise('homePage');
  }

  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('login');
      }
    });
  }
}

RoutesRunner.$inject = ['$rootScope', '$state'];

export default [RoutesConfig, RoutesRunner];