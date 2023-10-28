// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// libraries
import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { SafeTransferLib } from "@solmate/utils/SafeTransferLib.sol";

// interfaces
import { IPaymentHandler } from "./interfaces/IPaymentHandler.sol";

contract PaymentHandler is IPaymentHandler {
  using SafeTransferLib for ERC20;

  // === Events ===

  event TransferRequestInitiated(
    uint256 indexed id,
    address indexed aaSigner,
    uint256 thbAmount,
    uint256 exchangeRate,
    uint256 deadline
  );

  // === States ===

  ERC20 public immutable wNative;

  address public operator;
  uint256 public latestTransferRequestId;
  mapping(address aaSigner => uint256 amount) public balances;
  mapping(address aaSigner => uint256 amount) public lockedBalances;

  constructor(address _wNative, address _operator) {
    wNative = ERC20(_wNative);
    operator = _operator;
    latestTransferRequestId = 0;
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
    if (balances[msg.sender] - lockedBalances[msg.sender] < amount) {
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

  function initTransferRequest(
    uint256 _thbAmount,
    uint256 _exchangeRate,
    uint256 _deadline,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external override {
    // verify thbAmount and/or exchangeRate is not zero
    if (_thbAmount == 0 || _exchangeRate == 0) {
      revert PaymentHandler_AmountIsZero();
    }

    // verify deadline is not passed
    if (_deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // verify sign message is from operator
    _verifyMessage(_exchangeRate, _deadline, _v, _r, _s);

    // calculate balance to lock
    uint256 balanceToLock = _thbAmount * _exchangeRate;
    if (balanceToLock > balances[msg.sender]) {
      revert PaymentHandler_InsufficientBalance();
    }
    lockedBalances[msg.sender] += balanceToLock;

    // emit event with id to notify operator
    emit TransferRequestInitiated(latestTransferRequestId, msg.sender, _thbAmount, _exchangeRate, _deadline);

    unchecked {
      ++latestTransferRequestId;
    }
  }

  function cancelTransferRequest() external override {}

  function confirmTransferRequest() external override onlyOperator {}
}
