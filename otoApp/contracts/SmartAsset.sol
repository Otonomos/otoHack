pragma solidity ^0.4.0;
import "DBSAccountOracle.sol";
contract SmartAsset {
    // one tx at a time per account
    mapping(address=>uint) assetTable; // assumes one asset per person
    uint assetTableIndex;

    event log(string something);
    event logA(address something);
    event logI(uint something);

    struct assetTransferTxn {
        address from;
        address to;
        uint assetAmount;
        string DBSAccountNo;
        uint8 state;
        address oracleContractAddress;
    }

    mapping(string=>assetTransferTxn) pendingTxns;

    function SmartAsset(bytes _assetDocumentation, address[] _initialAssetHolders, uint[] _initialAssetAmounts) {
       assetTableIndex = _initialAssetHolders.length;
       for (uint i=0;i<_initialAssetHolders.length;i++){
           assetTable[_initialAssetHolders[i]] = _initialAssetAmounts[i];
       }
    }

    function initiateAssetTransfer(uint _amount, address _toAddress, string _DBSAccountNo, address _oracleContractAddress) {
        if (assetTable[msg.sender]>=_amount && pendingTxns[_DBSAccountNo].state==0) {
            pendingTxns[_DBSAccountNo] = assetTransferTxn(msg.sender, _toAddress, _amount, _DBSAccountNo, 1, _oracleContractAddress);
            DBSAccountOracle(_oracleContractAddress).registerAssetToAccount(_DBSAccountNo);
        }else{
          log('Not enough assets to transfer or pre-existing pending transaction');
        }
    }
    function finalizeAssetTransfer(string _DBSAccountNo) {
        if (pendingTxns[_DBSAccountNo].state==1 && pendingTxns[_DBSAccountNo].oracleContractAddress == msg.sender) {
            assetTable[pendingTxns[_DBSAccountNo].from] -= pendingTxns[_DBSAccountNo].assetAmount;
            /*logI(pendingTxns[_DBSAccountNo].assetAmount);
            logA(pendingTxns[_DBSAccountNo].from);
            logA(pendingTxns[_DBSAccountNo].to);*/
            assetTable[pendingTxns[_DBSAccountNo].to] += pendingTxns[_DBSAccountNo].assetAmount;
            delete pendingTxns[_DBSAccountNo];
            log('Transfer successful');
        }else{
          log('No pending txs found or wrong oracle address');
        }
    }

    function cxlPendingTxn(string _DBSAccountNo) {
        if (pendingTxns[_DBSAccountNo].state==1 && pendingTxns[_DBSAccountNo].from == msg.sender) {
            delete pendingTxns[_DBSAccountNo];
        }else{
          log('No pending tx or not tx sender');
        }
    }

    function getIndex() constant returns (uint){
      return assetTableIndex;
    }

    function getAmounts(string _DBSAccountNo) constant returns (uint, uint){
      uint from = assetTable[0xa3cff205242f753f8dcb65d10e879ab1642f02a3];
      uint to = assetTable[0x2963afb32be0d6e88e0919264a041037d29331d3];
      return (from, to);
    }
}
