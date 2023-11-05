// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Script, console2 } from "forge-std/Script.sol";
import { KbankPaymentHandler } from "../src/KbankPaymentHandler.sol";
import { DKIMRegistry } from "../src/DKIMRegistry.sol";
import { ZKVerifier } from "../src/KbankZKVerifier.sol";

contract DeploymentScript is Script {
  uint256 internal deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

  function run() public {
    vm.startBroadcast(deployerPrivateKey);

    // config
    address usdc = vm.parseAddress("0x38934bDf2462768388829194fD40a43eD9916B4C");
    address operator = vm.parseAddress("0x09FC1B9B288647FF0b5b4668C74e51F8bEA50C67");

    // deploy zk verifier
    console2.log("Deploying ZKVerifier...");
    ZKVerifier zkVerifier = new ZKVerifier();

    // deploy dkim registry
    console2.log("Deploying DKIMRegistry...");
    DKIMRegistry dkimRegistry = new DKIMRegistry(operator);

    // deploy payment handler
    console2.log("Deploying KbankPaymentHandler...");
    KbankPaymentHandler paymentHandler = new KbankPaymentHandler(usdc, address(zkVerifier), address(dkimRegistry));

    vm.stopBroadcast();

    console2.log("DKIMRegistry deployed at: %s", vm.toString(address(dkimRegistry)));
    console2.log("KbankPaymentHandler deployed at: %s", vm.toString(address(paymentHandler)));
  }
}
