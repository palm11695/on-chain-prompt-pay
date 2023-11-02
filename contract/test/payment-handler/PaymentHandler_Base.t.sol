// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { BaseTest } from "../BaseTest.t.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { PaymentHandler } from "../../src/PaymentHandler.sol";

import { IPaymentHandler } from "../../src/interfaces/IPaymentHandler.sol";

contract PaymentHandlerBaseTest is BaseTest {
  PaymentHandler internal paymentHandler;
  address internal operator;

  function setUp() public virtual {
    operator = vm.addr(operatorPrivateKey);
    paymentHandler = new PaymentHandler(address(usdc), operator);
  }

  function _initTransferRequest(
    address _sender,
    uint256 _thbAmount,
    uint256 _deadline,
    uint16 _exchangeRateBps
  ) internal {
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(_exchangeRateBps, _deadline);

    vm.startPrank(_sender);
    usdc.approve(address(paymentHandler), _thbAmount * _exchangeRateBps);
    paymentHandler.initTransferRequest(_thbAmount, _deadline, _exchangeRateBps, v, r, s);
    vm.stopPrank();
  }

  function _aliceInitTransferRequest() internal {
    // alice init transfer request
    uint256 thbAmount = 1000;
    uint16 exchangeRateBps = 280;
    uint256 deadline = block.timestamp + 1000;
    _initTransferRequest(ALICE, thbAmount, deadline, exchangeRateBps);

    assertEq(usdc.balanceOf(address(paymentHandler)), 28);
    assertEq(paymentHandler.reservedBalances(ALICE), 28);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }
}
