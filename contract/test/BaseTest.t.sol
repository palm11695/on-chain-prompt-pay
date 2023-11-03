// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { Test, console2 } from "forge-std/Test.sol";
import { Vm } from "forge-std/VM.sol";

import { MockERC20 } from "./mocks/MockERC20.sol";

contract BaseTest is Test {
  address internal constant DEPLOYER = address(0x01);
  address internal constant ALICE = address(0x11);
  address internal constant BOB = address(0x12);

  uint256 internal immutable operatorPrivateKey;
  MockERC20 internal immutable usdc;

  constructor() {
    vm.label(DEPLOYER, "DEPLOYER");
    vm.label(ALICE, "ALICE");
    vm.label(BOB, "BOB");

    operatorPrivateKey = vm.createWallet("OPERATOR").privateKey;

    usdc = new MockERC20("USD Coin", "USDC", 18);
    usdc.mint(ALICE, 1000);
    usdc.mint(BOB, 1000);
  }

  function _operatorSign(
    uint16 _exchangeRateBps,
    uint256 _deadline
  ) internal view returns (uint8 v, bytes32 r, bytes32 s) {
    bytes32 messageHash = keccak256(abi.encodePacked(_exchangeRateBps, _deadline));
    return vm.sign(operatorPrivateKey, messageHash);
  }
}
