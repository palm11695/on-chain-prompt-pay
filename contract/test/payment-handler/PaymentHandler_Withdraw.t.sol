// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerWithdrawTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();

    // alice fund 200 ethers
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 200);
    paymentHandler.fund(200);
    vm.stopPrank();

    // bob fund 300 ethers
    vm.startPrank(BOB);
    wNative.approve(address(paymentHandler), 300);
    paymentHandler.fund(300);
    vm.stopPrank();
  }

  function testCorrectness_WhenWithdraw() public {
    vm.startPrank(ALICE);
    paymentHandler.withdraw(ALICE, 100);
    vm.stopPrank();

    uint256 aliceAaBalance = paymentHandler.balances(ALICE);

    assertEq(aliceAaBalance, 100);
    assertEq(wNative.balanceOf(ALICE), 900);
    assertEq(wNative.balanceOf(address(paymentHandler)), 400);
  }

  function testCorrectness_WhenWithdrawAll() public {
    vm.startPrank(ALICE);
    paymentHandler.withdrawAll(ALICE);
    vm.stopPrank();

    vm.startPrank(BOB);
    paymentHandler.withdrawAll(BOB);
    vm.stopPrank();

    assertEq(paymentHandler.balances(ALICE), 0);
    assertEq(paymentHandler.balances(BOB), 0);

    assertEq(wNative.balanceOf(ALICE), 1000);
    assertEq(wNative.balanceOf(BOB), 1000);
    assertEq(wNative.balanceOf(address(paymentHandler)), 0);
  }

  function testCorrectness_WhenWithdrawToWallets() public {
    vm.startPrank(ALICE);
    paymentHandler.withdraw(ALICE, 100);
    paymentHandler.withdraw(BOB, 100);
    vm.stopPrank();

    assertEq(paymentHandler.balances(ALICE), 0);
    assertEq(wNative.balanceOf(ALICE), 900);
    assertEq(wNative.balanceOf(BOB), 800);
    assertEq(wNative.balanceOf(address(paymentHandler)), 300);
  }

  function testRevert_WhenWithdraw_WithZeroAmount() public {
    vm.prank(ALICE);
    vm.expectRevert(abi.encodeWithSelector(IPaymentHandler.PaymentHandler_AmountIsZero.selector));
    paymentHandler.withdraw(ALICE, 0);

    assertEq(wNative.balanceOf(ALICE), 800);
    assertEq(wNative.balanceOf(address(paymentHandler)), 500);
  }

  function testRevert_WhenWithdraw_WithExceedBalance() public {
    // alice balance is 200, should revert when withdraw 300
    vm.prank(ALICE);
    vm.expectRevert(abi.encodeWithSelector(IPaymentHandler.PaymentHandler_InsufficientBalance.selector));
    paymentHandler.withdraw(ALICE, 300);

    assertEq(wNative.balanceOf(ALICE), 800);
    assertEq(wNative.balanceOf(address(paymentHandler)), 500);
  }
}
