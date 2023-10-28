// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerFundTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenFundToAA() public {
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 600);
    paymentHandler.fund(ALICE_AA, 600);
    vm.stopPrank();

    uint256 aaBalance = paymentHandler.balances(ALICE_AA);

    assertEq(aaBalance, 600);
    assertEq(wNative.balanceOf(ALICE), 400);
    assertEq(wNative.balanceOf(address(paymentHandler)), 600);
  }

  function testCorrectness_WhenWalletsFundToAAs() public {
    // alice fund to alice_aa
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 100);
    paymentHandler.fund(ALICE_AA, 100);
    vm.stopPrank();

    // bob fund to bob_aa
    vm.startPrank(BOB);
    wNative.approve(address(paymentHandler), 200);
    paymentHandler.fund(BOB_AA, 200);
    vm.stopPrank();

    uint256 aliceAaBalance = paymentHandler.balances(ALICE_AA);
    uint256 bobAaBalance = paymentHandler.balances(BOB_AA);

    assertEq(wNative.balanceOf(ALICE), 900);
    assertEq(wNative.balanceOf(BOB), 800);

    assertEq(aliceAaBalance, 100);
    assertEq(bobAaBalance, 200);
    assertEq(wNative.balanceOf(address(paymentHandler)), 300);
  }

  function testCorrectness_WhenWalletsFundToSameAA() public {
    // alice fund to alice_aa
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 100);
    paymentHandler.fund(ALICE_AA, 100);
    vm.stopPrank();

    // bob fund to alice_aa
    // generally, bob would not fund to alice_aa
    // but we want to test that alice_aa can receive fund from different wallet
    vm.startPrank(BOB);
    wNative.approve(address(paymentHandler), 200);
    paymentHandler.fund(ALICE_AA, 200);
    vm.stopPrank();

    uint256 aaBalance = paymentHandler.balances(ALICE_AA);

    assertEq(wNative.balanceOf(ALICE), 900);
    assertEq(wNative.balanceOf(BOB), 800);

    assertEq(aaBalance, 300);
    assertEq(wNative.balanceOf(address(paymentHandler)), 300);
  }

  function testRevert_WhenFundToAA_WithZeroAmount() public {
    vm.prank(ALICE);
    vm.expectRevert(abi.encodeWithSelector(IPaymentHandler.PaymentHandler_AmountIsZero.selector));
    paymentHandler.fund(ALICE_AA, 0);

    assertEq(wNative.balanceOf(ALICE), 1000);
    assertEq(wNative.balanceOf(address(paymentHandler)), 0);
  }
}
