// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Script, console2 } from "forge-std/Script.sol";
import { PaymentHandler } from "../src/PaymentHandler.sol";

contract DeploymentScript is Script {
  uint256 internal deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

  function run() public {
    vm.startBroadcast(deployerPrivateKey);

    // config
    address usdc = vm.parseAddress("0x38934bDf2462768388829194fD40a43eD9916B4C");
    address operator = vm.parseAddress("0x09FC1B9B288647FF0b5b4668C74e51F8bEA50C67");

    // deploy payment handler
    console2.log("Deploying PaymentHandler...");
    PaymentHandler paymentHandler = new PaymentHandler(usdc, operator);

    vm.stopBroadcast();

    console2.log("PaymentHandler deployed at: %s", vm.toString(address(paymentHandler)));
  }
}