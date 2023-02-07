
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "contracts/src/DAORegistry.sol";

// A script that deploys contracts and establishes relationships between them.
contract DeployDAORegistry is Script {
    function deploy() external {
        vm.startBroadcast();

        new DAORegistry();

        vm.stopBroadcast();
    }
}
