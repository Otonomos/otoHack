pragma solidity ^0.4.2;

contract Transfers {

  // With this design an entity can only do one transfer at a time.

  address registrar;

  mapping(address => uint) shares;
  mapping(address => uint) entityFunds;
  mapping(address => uint) status;

  function Transfers() {
    registrar = msg.sender;
    shares[0x7c69b418efc7efd04fa206b900f0199b25fcce6e] = 50;
  }

  modifier validCall (){
    if ( msg.sender == registrar) _;
  }

  modifier checkStatus(address sender, uint state){
    if ( status[sender] == state ) _;
  }

  function setBalance(address entity, uint balance) private {
    entityFunds[entity] = balance;
  }

  function checkBalance(address entity, uint price, uint newBalance) private returns (bool){
    if( ( newBalance > entityFunds[entity] ) && ( newBalance - entityFunds[entity] == price ) ){ // first condition avoids overflow + assuming away floats...
      return true;
    }else{
      return false;
    }
  }

  function initiateTransfer(address sender, uint price, uint balance) validCall() checkStatus(sender, 0){
    setBalance(sender, balance);
    status[sender] == 1;
  }

  function completeTransfer(address sender, address recipient, uint price, uint balance, uint amount) validCall() checkStatus(sender, 1){
    if( checkBalance(sender, price, balance) ){
      shares[sender] -= amount;
      shares[recipient] += amount;
      status[sender] == 0;
    }
  }

  function manipulate(address sender) validCall(){
    status[sender] = 0;
  }

}
