// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { Test, console2 } from "forge-std/Test.sol";
import { VmSafe } from "forge-std/VM.sol";

import { MockERC20 } from "./mocks/MockERC20.sol";

contract BaseTest is Test {
  address internal constant DEPLOYER = address(0x01);
  address internal constant ALICE = address(0x11);
  address internal constant BOB = address(0x12);

  uint256 internal immutable operatorPrivateKey;
  MockERC20 internal immutable wNative;

  constructor() {
    vm.label(DEPLOYER, "DEPLOYER");
    vm.label(ALICE, "ALICE");
    vm.label(BOB, "BOB");

    operatorPrivateKey = vm.createWallet("OPERATOR").privateKey;

    wNative = new MockERC20("Wrapped Native Token", "WNATIVE", 18);
    wNative.mint(ALICE, 1000);
    wNative.mint(BOB, 1000);
  }
}
