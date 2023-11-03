// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IPaymentHandler {
  error PaymentHandler_InvalidParams();
  error PaymentHandler_RequestIsLessThanOneDay();
  error PaymentHandler_ExceedDeadline();
  error PaymentHandler_Unauthorized();
  error PaymentHandler_NoTransferRequest();
  error PaymentHandler_TransferRequestAlreadyConfirmed();

  function initTransferRequest(
    uint256 _thbAmount,
    uint256 _deadline,
    uint16 _exchangeRateBps,
    uint64 _promptPayId,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external;

  function cancelTransferRequest(uint256 _transferRequestId) external;

  function confirmTransferRequest(uint256 _transferRequestId) external;
}
