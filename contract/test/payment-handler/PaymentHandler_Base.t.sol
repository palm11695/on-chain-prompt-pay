// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { BaseTest } from "../BaseTest.t.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { PaymentHandler } from "../../src/PaymentHandler.sol";

import { IPaymentHandler } from "../../src/interfaces/IPaymentHandler.sol";

contract PaymentHandlerBaseTest is BaseTest {
  PaymentHandler internal paymentHandler;

  function setUp() public virtual {
    paymentHandler = new PaymentHandler(address(wNative));
  }
}
