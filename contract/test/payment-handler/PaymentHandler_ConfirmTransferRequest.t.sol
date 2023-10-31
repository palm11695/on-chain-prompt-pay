// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerConfirmTransferRequestTest is PaymentHandlerBaseTest {
  address internal operator;

  function setUp() public override {
    super.setUp();
    operator = vm.addr(operatorPrivateKey);
  }

  function _initTransferRequest(
    address _sender,
    uint256 _thbAmount,
    uint256 _exchangeRate,
    uint256 _deadline
  ) internal {
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(_exchangeRate, _deadline);

    vm.prank(_sender);
    paymentHandler.initTransferRequest(_thbAmount, _exchangeRate, _deadline, v, r, s);
  }

  function _aliceInitTransferRequest() internal {
    // alice fund 1000 ethers
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 1000);
    paymentHandler.fund(1000);
    vm.stopPrank();

    // alice init transfer request
    uint256 thbAmount = 100;
    uint256 exchangeRate = 2;
    uint256 deadline = block.timestamp + 1000;
    _initTransferRequest(ALICE, thbAmount, exchangeRate, deadline);

    assertEq(paymentHandler.lockedBalances(ALICE), 200);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function testCorrectness_WhenConfirmTransferRequest() public {
    _aliceInitTransferRequest();

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    paymentHandler.confirmTransferRequest(transferRequestId);

    assertEq(wNative.balanceOf(operator), 200);
    assertEq(wNative.balanceOf(address(paymentHandler)), 800);

    assertEq(paymentHandler.balances(ALICE), 800);
    assertEq(paymentHandler.lockedBalances(ALICE), 0);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function testRevert_WhenConfirmTransferRequest_BeforeInitTransferRequest() public {
    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.confirmTransferRequest(0);
  }

  function testRevert_WhenConfirmTransferRequest_WithInvalidRequestId() public {
    _aliceInitTransferRequest();

    uint256 nextId = paymentHandler.nextTransferRequestId();
    assertEq(nextId, 1);

    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.confirmTransferRequest(nextId);
  }

  function testRevert_WhenConfirmTransferRequest_WithUnauthorizedCaller() public {
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_Unauthorized.selector);
    paymentHandler.confirmTransferRequest(0);
  }

  function testRevert_WhenConfirmTransferRequest_WithSameId() public {
    _aliceInitTransferRequest();

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    paymentHandler.confirmTransferRequest(transferRequestId);

    // // operator confirm transfer request again
    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_TransferRequestAlreadyConfirmed.selector);
    paymentHandler.confirmTransferRequest(transferRequestId);
  }

  function testRevert_WhenConfirmTransferRequest_WithExceedDeadline() public {
    _aliceInitTransferRequest();

    vm.warp(block.timestamp + 1001);

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_ExceedDeadline.selector);
    paymentHandler.confirmTransferRequest(transferRequestId);
  }
}
