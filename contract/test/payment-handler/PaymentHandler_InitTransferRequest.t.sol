// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerInitTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenInitTransferRequest() public {
    // alice init transfer request
    uint256 thbAmount = 1000;
    uint16 exchangeRate = 280;
    uint256 deadline = block.timestamp + 1000;
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    vm.startPrank(ALICE);
    usdc.approve(address(paymentHandler), 28);
    paymentHandler.initTransferRequest(thbAmount, deadline, exchangeRate, 1, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 28);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function testCorrectness_WhenInitTransferRequestTwice() public {
    uint8 v;
    bytes32 r;
    bytes32 s;
    // alice init transfer request
    uint256 thbAmount = 10000;
    uint256 deadline = block.timestamp + 1000;

    uint16 firstExchangeRate = 280;
    (v, r, s) = _operatorSign(firstExchangeRate, deadline);

    vm.startPrank(ALICE);
    usdc.approve(address(paymentHandler), 280);
    paymentHandler.initTransferRequest(thbAmount, deadline, firstExchangeRate, 1, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 280);
    assertEq(paymentHandler.nextTransferRequestId(), 1);

    // alice init transfer request again with different exchange rate
    uint16 secondExchangeRate = 300;
    (v, r, s) = _operatorSign(secondExchangeRate, deadline);

    vm.startPrank(ALICE);
    usdc.approve(address(paymentHandler), 300);
    paymentHandler.initTransferRequest(thbAmount, deadline, secondExchangeRate, 888, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 580);
    assertEq(paymentHandler.nextTransferRequestId(), 2);
  }

  function testRevert_WhenInitTransferRequest_WithInvalidParams() public {
    // should revert when thbAmount is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_InvalidParams.selector);
    paymentHandler.initTransferRequest(0, block.timestamp, 1, 888, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when exchange rate is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_InvalidParams.selector);
    paymentHandler.initTransferRequest(1, block.timestamp, 0, 888, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when thbAmount and exchange rate is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_InvalidParams.selector);
    paymentHandler.initTransferRequest(0, block.timestamp, 0, 888, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when exchange rate is greater than MAX_BPS
    vm.expectRevert(IPaymentHandler.PaymentHandler_InvalidParams.selector);
    paymentHandler.initTransferRequest(0, block.timestamp, 10001, 888, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when thbAmount and exchange rate is too low
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(1, block.timestamp);
    vm.expectRevert(IPaymentHandler.PaymentHandler_InvalidParams.selector);
    paymentHandler.initTransferRequest(1, block.timestamp, 1, 888, v, r, s);
  }

  function testRevert_WhenInitTransferRequest_AndExchangeRateIsStale() public {
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_StaleExchangeRate.selector);
    paymentHandler.initTransferRequest(1, block.timestamp - 1, 1, 888, uint8(1), bytes32("0x"), bytes32("0x"));
  }
}
