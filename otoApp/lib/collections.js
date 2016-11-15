import { Mongo } from 'meteor/mongo';

export const Chats = new Mongo.Collection('chats');
export const Messages = new Mongo.Collection('messages');
export const SmartContracts = new Mongo.Collection('smartContracts');
export const Oracles = new Mongo.Collection('oracles');
