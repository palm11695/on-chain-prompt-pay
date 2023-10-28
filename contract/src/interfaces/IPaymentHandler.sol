// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IPaymentHandler {
  error PaymentHandler_AmountIsZero();
  error PaymentHandler_InsufficientBalance();

  function fund(address _aaSigner, uint256 _amount) external;

  function withdraw(address _recipient, uint256 _amount) external;

  function withdrawAll(address _recipient) external;

  function initTransferRequest() external;

  function cancelTransferRequest() external;

  function confirmTransferRequest() external;
}
