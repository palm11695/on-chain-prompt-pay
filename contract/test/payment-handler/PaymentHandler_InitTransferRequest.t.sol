// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerInitTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function _operatorSign(
    uint256 _exchangeRate,
    uint256 _deadline
  ) internal view returns (uint8 v, bytes32 r, bytes32 s) {
    bytes32 messageHash = keccak256(abi.encodePacked(_exchangeRate, _deadline));
    return vm.sign(operatorPrivateKey, messageHash);
  }

  function testCorrectness_WhenInitTransferRequest() public {
    // alice fund to alice_aa
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 1000);
    paymentHandler.fund(ALICE_AA, 1000);
    vm.stopPrank();

    // alice_aa init transfer request
    uint256 thbAmount = 100;
    uint256 exchangeRate = 2;
    uint256 deadline = block.timestamp + 1000;
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    vm.prank(ALICE_AA);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    uint256 lockedBalance = paymentHandler.lockedBalances(ALICE_AA);

    assertEq(lockedBalance, 200);
    assertEq(paymentHandler.latestTransferRequestId(), 1);

    // alice_aa should not be able to withdraw more than `funding balance - locked balance`
    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_InsufficientBalance.selector);
    paymentHandler.withdraw(ALICE, 801);
  }

  function testCorrectness_WhenInitTransferRequestTwice() public {
    // alice fund to alice_aa
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 500);
    paymentHandler.fund(ALICE_AA, 500);
    vm.stopPrank();

    uint8 v;
    bytes32 r;
    bytes32 s;
    // alice_aa init transfer request
    uint256 thbAmount = 100;
    uint256 deadline = block.timestamp + 1000;

    uint256 firstExchangeRate = 2;
    (v, r, s) = _operatorSign(firstExchangeRate, deadline);

    vm.prank(ALICE_AA);
    paymentHandler.initTransferRequest(thbAmount, firstExchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.lockedBalances(ALICE_AA), 200);
    assertEq(paymentHandler.latestTransferRequestId(), 1);

    // alice_aa init transfer request again with different exchange rate
    uint256 secondExchangeRate = 3;
    (v, r, s) = _operatorSign(secondExchangeRate, deadline);

    vm.prank(ALICE_AA);
    paymentHandler.initTransferRequest(thbAmount, secondExchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.lockedBalances(ALICE_AA), 500);
    assertEq(paymentHandler.latestTransferRequestId(), 2);
  }

  function testRevert_WhenInitTransferRequest_WithZeroAmount() public {
    vm.startPrank(ALICE_AA);

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
    vm.prank(ALICE_AA);
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
    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, abritraryExchangeRate, deadline, v, r, s);

    // should revert when non-operator signed exchange rate
    (v, r, s) = vm.sign(vm.createWallet("MOCK").privateKey, keccak256(abi.encodePacked(exchangeRate)));
    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.lockedBalances(ALICE_AA), 0);
    assertEq(paymentHandler.latestTransferRequestId(), 0);
  }

  function testRevert_WhenInitTransferRequest_WithNonOperatorSignedDeadline() public {
    uint256 thbAmount = 100;
    uint256 exchangeRate = 5;
    uint256 deadline = block.timestamp + 1000;
    uint256 abritraryDeadline = block.timestamp + 5000;

    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    // should revert when using abritrary deadline
    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, abritraryDeadline, v, r, s);

    // should revert when non-operator signed deadline
    (v, r, s) = vm.sign(vm.createWallet("MOCK").privateKey, keccak256(abi.encodePacked(exchangeRate)));
    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_SignerIsNotOperator.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.lockedBalances(ALICE_AA), 0);
    assertEq(paymentHandler.latestTransferRequestId(), 0);
  }

  function testRevert_WhenInitTransferRequest_WithExceedBalance() public {
    // alice fund to alice_aa
    vm.startPrank(ALICE);
    wNative.approve(address(paymentHandler), 1000);
    paymentHandler.fund(ALICE_AA, 1000);
    vm.stopPrank();

    // alice_aa init transfer request
    uint256 thbAmount = 1000;
    uint256 exchangeRate = 2;
    uint256 deadline = block.timestamp + 1000;
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(exchangeRate, deadline);

    vm.prank(ALICE_AA);
    vm.expectRevert(IPaymentHandler.PaymentHandler_InsufficientBalance.selector);
    paymentHandler.initTransferRequest(thbAmount, exchangeRate, deadline, v, r, s);

    assertEq(paymentHandler.lockedBalances(ALICE_AA), 0);
    assertEq(paymentHandler.latestTransferRequestId(), 0);
  }
}
