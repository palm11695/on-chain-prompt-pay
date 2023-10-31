// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerInitTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenInitTransferRequest() public {
    // alice init transfer request
    uint256 thbAmount = 100;
    uint256 exchangeRate = 2;
    uint256 deadline = block.timestamp + 1000;
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), thbAmount * exchangeRate);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 200);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function testCorrectness_WhenInitTransferRequestTwice() public {
    uint8 v;
    bytes32 r;
    bytes32 s;
    // alice init transfer request
    uint256 thbAmount = 100;
    uint256 deadline = block.timestamp + 1000;

    uint256 firstExchangeRate = 2;
    (v, r, s) = _operatorSign(firstExchangeRate, deadline);

    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), thbAmount * firstExchangeRate);
    paymentHandler.initTransferRequest(thbAmount, firstExchangeRate, deadline, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 200);
    assertEq(paymentHandler.nextTransferRequestId(), 1);

    // alice init transfer request again with different exchange rate
    uint256 secondExchangeRate = 3;
    (v, r, s) = _operatorSign(secondExchangeRate, deadline);

    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), thbAmount * secondExchangeRate);
    paymentHandler.initTransferRequest(thbAmount, secondExchangeRate, deadline, v, r, s);
    vm.stopPrank();

    assertEq(paymentHandler.reservedBalances(ALICE), 500);
    assertEq(paymentHandler.nextTransferRequestId(), 2);
  }

  function testRevert_WhenInitTransferRequest_WithZeroAmount() public {
    vm.startPrank(ALICE);

    // should revert when thbAmount is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_AmountIsZero.selector);
    paymentHandler.initTransferRequest(0, 1, block.timestamp + 1000, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when exchange rate is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_AmountIsZero.selector);
    paymentHandler.initTransferRequest(1, 0, block.timestamp + 1000, uint8(1), bytes32("0x"), bytes32("0x"));

    // should revert when thbAmount and exchange rate is zero
    vm.expectRevert(IPaymentHandler.PaymentHandler_AmountIsZero.selector);
    paymentHandler.initTransferRequest(0, 0, block.timestamp + 1000, uint8(1), bytes32("0x"), bytes32("0x"));

    vm.stopPrank();
  }

  function testRevert_WhenInitTransferRequest_AndDeadlineExceed() public {
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_ExceedDeadline.selector);
    paymentHandler.initTransferRequest(1, 1, block.timestamp - 1, uint8(1), bytes32("0x"), bytes32("0x"));
  }

  function testRevert_WhenInitTransferRequest_WithNonOperatorSignedExchangeRate() public {
    uint256 thbAmount = 100;
    uint256 exchangeRate = 5;
    uint256 abritraryExchangeRate = 1;
    uint256 deadline = block.timestamp + 1000;

    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    // should revert when using abritrary exchange rate
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, abritraryExchangeRate, deadline, v, r, s);

    // should revert when non-operator signed exchange rate
    (v, r, s) = vm.sign(vm.createWallet("MOCK").privateKey, keccak256(abi.encodePacked(exchangeRate)));
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.reservedBalances(ALICE), 0);
    assertEq(paymentHandler.nextTransferRequestId(), 0);
  }

  function testRevert_WhenInitTransferRequest_WithNonOperatorSignedDeadline() public {
    uint256 thbAmount = 100;
    uint256 exchangeRate = 5;
    uint256 deadline = block.timestamp + 1000;
    uint256 abritraryDeadline = block.timestamp + 5000;

    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    // should revert when using abritrary deadline
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, abritraryDeadline, v, r, s);

    // should revert when non-operator signed deadline
    (v, r, s) = vm.sign(vm.createWallet("MOCK").privateKey, keccak256(abi.encodePacked(exchangeRate)));
    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.reservedBalances(ALICE), 0);
    assertEq(paymentHandler.nextTransferRequestId(), 0);
  }
}
