pragma solidity ^0.4.0;
import "SmartAsset.sol";
contract DBSAccountOracle {

    address oracle;
    struct account {
        address contractToCall;
    }
    event log(string something);

    mapping(string=>account) DBSAccounts;

    function DBSAccountOracle (){
        oracle = msg.sender;
    }

    function registerAssetToAccount(string _DBSAccountNo){
        DBSAccounts[_DBSAccountNo] = account(msg.sender);
    }

    function updateAsset(string _DBSAccountNo) {
        if (msg.sender == oracle){
            if (DBSAccounts[_DBSAccountNo].contractToCall!=0x0000000000000000000000000000000000000000){
                SmartAsset(DBSAccounts[_DBSAccountNo].contractToCall).finalizeAssetTransfer(_DBSAccountNo);
            }else{
              log('ERROR: no asset contract to call');
            }
        }
    }
}
