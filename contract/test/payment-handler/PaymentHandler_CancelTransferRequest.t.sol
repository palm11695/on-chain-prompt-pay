// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerCancelTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenCancelTransferRequest_RequestIsInitForMoreThanOneDay() public {
    uint256 aliceBalanceBeforeInit = wNative.balanceOf(ALICE);
    _aliceInitTransferRequest();

    // alice cancel transfer request after 1 day
    vm.warp(block.timestamp + 1 days);
    uint256 transferRequestId = 0;
    vm.prank(ALICE);
    paymentHandler.cancelTransferRequest(transferRequestId);

    assertEq(wNative.balanceOf(ALICE), aliceBalanceBeforeInit);
    assertEq(wNative.balanceOf(address(paymentHandler)), 0);
    assertEq(paymentHandler.reservedBalances(ALICE), 0);
  }

  function testRevert_WhenCancelTransferRequest_BeforeInitTransferRequest() public {
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.cancelTransferRequest(0);

    // alice init transfer request
    _aliceInitTransferRequest();

    // should revert since there is no transfer request with id 1 (only 0 (first transfer request))
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.cancelTransferRequest(1);

    assertEq(wNative.balanceOf(address(paymentHandler)), 200);
    assertEq(paymentHandler.reservedBalances(ALICE), 200);
  }

  function testRevert_WhenCancelTransferRequest_WithOtherSender() public {
    _aliceInitTransferRequest();

    // bob cancel alice transfer request
    uint256 transferRequestId = 0;
    vm.prank(BOB);
    vm.expectRevert(IPaymentHandler.PaymentHandler_Unauthorized.selector);
    paymentHandler.cancelTransferRequest(transferRequestId);

    assertEq(wNative.balanceOf(address(paymentHandler)), 200);
    assertEq(paymentHandler.reservedBalances(ALICE), 200);
  }

  function testRevert_WhenCancelTransferRequest_AfterConfirm() public {
    _aliceInitTransferRequest();
    uint256 aliceBalanceAfterInit = wNative.balanceOf(ALICE);

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    paymentHandler.confirmTransferRequest(transferRequestId);

    // alice try to cancel transfer request
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_TransferRequestAlreadyConfirmed.selector);
    paymentHandler.cancelTransferRequest(transferRequestId);

    assertEq(wNative.balanceOf(address(operator)), 200);
    assertEq(wNative.balanceOf(address(paymentHandler)), 0);
    assertEq(wNative.balanceOf(ALICE), aliceBalanceAfterInit);
  }
}
