import { Mongo } from 'meteor/mongo';

export const Chats = new Mongo.Collection('chats');
export const Messages = new Mongo.Collection('messages');


export const Assets       = new Mongo.Collection('Assets');
//Asset Name, assetAddress
export const BankAccounts = new Mongo.Collection('BankAccounts');
//userId
export const Transactions = new Mongo.Collection('Transactions');
//fromAddress, toAddress, timeUpdated, assetAddress, amount
export const AssetWallets = new Mongo.Collection('AssetWallets');
//userId, assetAddress, lastUpdated, amount
