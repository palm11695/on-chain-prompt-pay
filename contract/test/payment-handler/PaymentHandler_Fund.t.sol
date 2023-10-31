// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerFundTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenFund() public {
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 600);
    paymentHandler.fund(600);
    vm.stopPrank();

    assertEq(wNative.balanceOf(ALICE), 400);
    assertEq(paymentHandler.balances(ALICE), 600);
    assertEq(wNative.balanceOf(address(paymentHandler)), 600);
  }

  function testCorrectness_WhenManyWalletsFund() public {
    // alice fund 100 ethers
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 100);
    paymentHandler.fund(100);
    vm.stopPrank();

    // bob fund 200 ethers
    vm.startPrank(BOB);
    wNative.approve(address(paymentHandler), 200);
    paymentHandler.fund(200);
    vm.stopPrank();

    assertEq(wNative.balanceOf(ALICE), 900);
    assertEq(wNative.balanceOf(BOB), 800);

    assertEq(paymentHandler.balances(ALICE), 100);
    assertEq(paymentHandler.balances(BOB), 200);
    assertEq(wNative.balanceOf(address(paymentHandler)), 300);
  }

  function testRevert_WhenFundToAA_WithZeroAmount() public {
    vm.prank(ALICE);
    vm.expectRevert(abi.encodeWithSelector(IPaymentHandler.PaymentHandler_AmountIsZero.selector));
    paymentHandler.fund(0);

    assertEq(wNative.balanceOf(ALICE), 1000);
    assertEq(wNative.balanceOf(address(paymentHandler)), 0);
  }
}
