// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerConfirmTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  // function testCorrectness_WhenConfirmTransferRequest() public {
  //   _aliceInitTransferRequest();

  //   // operator confirm transfer request
  //   uint256 transferRequestId = 0;
  //   vm.prank(operator);
  //   paymentHandler.confirmTransferRequest(transferRequestId);

  //   assertEq(usdc.balanceOf(operator), 28);
  //   assertEq(usdc.balanceOf(address(paymentHandler)), 0);

  //   assertEq(paymentHandler.reservedBalances(ALICE), 0);
  //   assertEq(paymentHandler.nextTransferRequestId(), 1);
  // }

  // function testRevert_WhenConfirmTransferRequest_BeforeInitTransferRequest() public {
  //   vm.prank(operator);
  //   vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
  //   paymentHandler.confirmTransferRequest(0);
  // }

  // function testRevert_WhenConfirmTransferRequest_WithInvalidRequestId() public {
  //   _aliceInitTransferRequest();

  //   uint256 nextId = paymentHandler.nextTransferRequestId();
  //   assertEq(nextId, 1);

  //   vm.prank(operator);
  //   vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
  //   paymentHandler.confirmTransferRequest(nextId);
  // }

  // function testRevert_WhenConfirmTransferRequest_WithUnauthorizedCaller() public {
  //   vm.prank(ALICE);
  //   vm.expectRevert(IPaymentHandler.PaymentHandler_Unauthorized.selector);
  //   paymentHandler.confirmTransferRequest(0);
  // }

  // function testRevert_WhenConfirmTransferRequest_WithSameId() public {
  //   _aliceInitTransferRequest();

  //   // operator confirm transfer request
  //   uint256 transferRequestId = 0;
  //   vm.prank(operator);
  //   paymentHandler.confirmTransferRequest(transferRequestId);

  //   // // operator confirm transfer request again
  //   vm.prank(operator);
  //   vm.expectRevert(IPaymentHandler.PaymentHandler_TransferRequestAlreadyConfirmed.selector);
  //   paymentHandler.confirmTransferRequest(transferRequestId);
  // }

  // function testRevert_WhenConfirmTransferRequest_WithExceedDeadline() public {
  //   _aliceInitTransferRequest();

  //   vm.warp(block.timestamp + 1001);

  //   // operator confirm transfer request
  //   uint256 transferRequestId = 0;
  //   vm.prank(operator);
  //   vm.expectRevert(IPaymentHandler.PaymentHandler_ExceedDeadline.selector);
  //   paymentHandler.confirmTransferRequest(transferRequestId);
  // }
}
