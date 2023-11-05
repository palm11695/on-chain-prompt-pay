// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Script, console2 } from "forge-std/Script.sol";
import { SCBEWalletPaymentHandler } from "../src/payment-handlers/SCBEWalletPaymentHandler.sol";
import { DKIMRegistry } from "../src/DKIMRegistry.sol";
import { SCBEWalletZKVerifier } from "../src/verifiers/SCBEWalletZKVerifier.sol";

contract DeploymentScript is Script {
  uint256 internal deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

  function run() public {
    vm.startBroadcast(deployerPrivateKey);

    // config
    address usdc = vm.parseAddress("0x38934bDf2462768388829194fD40a43eD9916B4C");
    address owner = vm.parseAddress("0x09FC1B9B288647FF0b5b4668C74e51F8bEA50C67");

    // deploy zk verifier
    console2.log("Deploying SCBEWalletZKVerifier...");
    SCBEWalletZKVerifier zkVerifier = new SCBEWalletZKVerifier();

    // deploy dkim registry
    console2.log("Deploying DKIMRegistry...");
    DKIMRegistry dkimRegistry = new DKIMRegistry(owner);

    // deploy payment handler
    console2.log("Deploying SCBEWalletPaymentHandler...");
    SCBEWalletPaymentHandler paymentHandler = new SCBEWalletPaymentHandler(
      usdc,
      address(zkVerifier),
      address(dkimRegistry)
    );

    vm.stopBroadcast();

    console2.log("SCBEWalletZKVerifier deployed at: %s", vm.toString(address(zkVerifier)));
    console2.log("DKIMRegistry deployed at: %s", vm.toString(address(dkimRegistry)));
    console2.log("SCBEWalletPaymentHandler deployed at: %s", vm.toString(address(paymentHandler)));
  }
}
