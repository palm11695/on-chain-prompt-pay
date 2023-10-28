// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// libraries
import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { SafeTransferLib } from "@solmate/utils/SafeTransferLib.sol";

// interfaces
import { IPaymentHandler } from "./interfaces/IPaymentHandler.sol";

contract PaymentHandler is IPaymentHandler {
  using SafeTransferLib for ERC20;

  ERC20 public immutable wNative;

  mapping(address aaSigner => uint256 amount) public balances;

  constructor(address _wNative) {
    wNative = ERC20(_wNative);
  }

  function fund(address _aaSigner, uint256 _amount) external override {
    // revert if amount is zero
    if (_amount == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // transfer wNative from msg.sender to this contract
    wNative.safeTransferFrom(msg.sender, address(this), _amount);

    // increase balance of aaSigner
    balances[_aaSigner] += _amount;
  }

  function withdraw(address recipient, uint256 amount) external override {
    // revert if amount is zero
    if (amount == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // check if balance of aaSigner is enough
    if (balances[msg.sender] < amount) {
      revert PaymentHandler_InsufficientBalance();
    }

    // transfer wNative from this contract to recipient
    wNative.safeTransfer(recipient, amount);

    // decrease balance of aaSigner
    balances[msg.sender] -= amount;
  }

  function withdrawAll(address recipient) external override {
    // transfer all wNative from this contract to recipient
    wNative.safeTransfer(recipient, balances[msg.sender]);

    // set balance of aaSigner to zero
    balances[msg.sender] = 0;
  }

  function initTransferRequest() external override {}

  function cancelTransferRequest() external override {}

  function confirmTransferRequest() external override {}
}
