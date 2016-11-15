import { Controller } from 'angular-ecmascript/module-helpers';

web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.ethereum.host));

export default class EthCtrl extends Controller {
  constructor() {
    super(...arguments);
    
    this.helpers({
        accountBalances() {
            let acctBal = [];

            try {

                allAccounts = web3.eth.accounts;
                allAccounts.map((acct, idx) => {
                    let newAcct = {};
                    newAcct.accountAddress = allAccounts[idx];
                    newAcct.accountBalance = (web3.eth.getBalance(allAccounts[idx]).c[0]/1000).toLocaleString('en-US');
                    acctBal.push(newAcct); 
                });
            } catch (err) {
                throw new Meteor.Error('Failed to get ethereum account balances');
            }
            
            return acctBal;
        }
    });
  }

}

EthCtrl.$name = 'EthCtrl';