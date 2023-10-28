// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// libraries
import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { SafeTransferLib } from "@solmate/utils/SafeTransferLib.sol";

// interfaces
import { IPaymentHandler } from "./interfaces/IPaymentHandler.sol";

contract PaymentHandler is IPaymentHandler {
  using SafeTransferLib for ERC20;

  struct TransferRequest {
    address sender;
    uint256 tokenAmount;
    uint256 deadline;
  }

  // === Events ===

  event TransferRequestInitiated(
    uint256 indexed id,
    address indexed sender,
    uint256 thbAmount,
    uint256 exchangeRate,
    uint256 deadline
  );

  // === States ===

  ERC20 public immutable wNative;

  address public operator;
  uint256 public nextTransferRequestId;
  mapping(address sender => uint256 amount) public balances;
  mapping(address sender => uint256 amount) public lockedBalances;
  mapping(uint256 reqId => TransferRequest info) public transferRequests;
  mapping(uint256 reqId => bool isTransfered) public isTransferRequestConfirmed;

  constructor(address _wNative, address _operator) {
    wNative = ERC20(_wNative);
    operator = _operator;
    nextTransferRequestId = 0;
  }

  modifier onlyOperator() {
    if (msg.sender != operator) {
      revert PaymentHandler_Unauthorized();
    }
    _;
  }

  // check sign message is from operator
  function _verifyMessage(uint256 _exchangeRate, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) internal view {
    bytes32 hash = keccak256(abi.encodePacked(_exchangeRate, _deadline));
    address signer = ecrecover(hash, _v, _r, _s);

    if (signer != operator) {
      revert PaymentHandler_SignerIsNotOperator();
    }
  }

  function fund(uint256 _amount) external override {
    // revert if amount is zero
    if (_amount == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // transfer wNative from msg.sender to this contract
    wNative.safeTransferFrom(msg.sender, address(this), _amount);

    // increase balance of msg.sender
    balances[msg.sender] += _amount;
  }

  function withdraw(address recipient, uint256 amount) external override {
    // revert if amount is zero
    if (amount == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // check if balance of msg.sender is enough
    if (balances[msg.sender] - lockedBalances[msg.sender] < amount) {
      revert PaymentHandler_InsufficientBalance();
    }

    // transfer wNative from this contract to recipient
    wNative.safeTransfer(recipient, amount);

    // decrease balance of msg.sender
    balances[msg.sender] -= amount;
  }

  function withdrawAll(address recipient) external override {
    // transfer all wNative from this contract to recipient
    wNative.safeTransfer(recipient, balances[msg.sender]);

    // set balance of msg.sender to zero
    balances[msg.sender] = 0;
  }

  function initTransferRequest(
    uint256 _thbAmount,
    uint256 _exchangeRate,
    uint256 _deadline,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external override {
    // revert if thbAmount and/or exchangeRate is zero
    if (_thbAmount == 0 || _exchangeRate == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // revert if deadline is passed
    if (_deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // verify sign message is from operator
    _verifyMessage(_exchangeRate, _deadline, _v, _r, _s);

    // calculate balance to lock
    uint256 tokenAmount = _thbAmount * _exchangeRate;
    if (tokenAmount > balances[msg.sender]) {
      revert PaymentHandler_InsufficientBalance();
    }
    lockedBalances[msg.sender] += tokenAmount;

    // store transfer request info
    isTransferRequestConfirmed[nextTransferRequestId] = false;
    transferRequests[nextTransferRequestId] = TransferRequest(msg.sender, tokenAmount, _deadline);

    // emit event with id to notify operator
    emit TransferRequestInitiated(nextTransferRequestId, msg.sender, _thbAmount, _exchangeRate, _deadline);

    unchecked {
      ++nextTransferRequestId;
    }
  }

  function confirmTransferRequest(uint256 _transferRequestId) external override onlyOperator {
    // revert if no transfer request
    if (nextTransferRequestId == 0 || _transferRequestId >= nextTransferRequestId) {
      revert PaymentHandler_NoTransferRequest();
    }

    // get transfer request info
    TransferRequest storage req = transferRequests[_transferRequestId];

    // revert if transfer request is already confirmed
    if (isTransferRequestConfirmed[_transferRequestId]) {
      revert PaymentHandler_TransferRequestAlreadyConfirmed();
    }

    // revert if deadline is passed
    if (req.deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // transfer wNative from this contract to operator
    wNative.safeTransfer(operator, req.tokenAmount);

    // decrease balance of request sender
    balances[req.sender] -= req.tokenAmount;
    lockedBalances[req.sender] -= req.tokenAmount;

    // set transfer request to confirmed
    isTransferRequestConfirmed[_transferRequestId] = true;
  }
}
