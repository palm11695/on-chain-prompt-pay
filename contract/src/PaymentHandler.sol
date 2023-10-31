// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// libraries
import { ERC20 } from "@solmate/tokens/ERC20.sol";
import { SafeTransferLib } from "@solmate/utils/SafeTransferLib.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// interfaces
import { IPaymentHandler } from "./interfaces/IPaymentHandler.sol";

contract PaymentHandler is IPaymentHandler {
  using SafeTransferLib for ERC20;

  struct TransferRequest {
    address sender;
    uint256 tokenAmount;
    uint256 initTimestamp;
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

  ERC20 public immutable token;

  address public operator;
  uint256 public nextTransferRequestId;
  mapping(address sender => uint256 amount) public reservedBalances;
  mapping(uint256 reqId => TransferRequest info) public transferRequests;
  mapping(uint256 reqId => bool isTransfered) public isTransferRequestConfirmed;

  constructor(address _token, address _operator) {
    token = ERC20(_token);
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
    address signer = ECDSA.recover(hash, _v, _r, _s);

    if (signer != operator) {
      revert PaymentHandler_SignerIsNotOperator();
    }
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

    // safe pull token from sender
    token.safeTransferFrom(msg.sender, address(this), tokenAmount);
    reservedBalances[msg.sender] += tokenAmount;

    // store transfer request info
    isTransferRequestConfirmed[nextTransferRequestId] = false;
    transferRequests[nextTransferRequestId] = TransferRequest(msg.sender, tokenAmount, block.timestamp, _deadline);

    // emit event with id to notify operator
    emit TransferRequestInitiated(nextTransferRequestId, msg.sender, _thbAmount, _exchangeRate, _deadline);

    unchecked {
      ++nextTransferRequestId;
    }
  }

  function cancelTransferRequest(uint256 _transferRequestId) external override {
    // revert if no transfer request
    if (nextTransferRequestId == 0 || _transferRequestId >= nextTransferRequestId) {
      revert PaymentHandler_NoTransferRequest();
    }

    TransferRequest memory req = transferRequests[_transferRequestId];

    // revert if msg.sender is not transfer request sender
    if (msg.sender != req.sender) {
      revert PaymentHandler_Unauthorized();
    }

    // revert if transfer request is already confirmed
    if (isTransferRequestConfirmed[_transferRequestId]) {
      revert PaymentHandler_TransferRequestAlreadyConfirmed();
    }

    // TODO: re-consider this logic
    // only transfer request that init more than 1 day can be canceled
    if (block.timestamp < req.initTimestamp + 1 days) {
      revert PaymentHandler_RequestIsLessThanOneDay();
    }

    // transfer token from this contract to sender
    token.safeTransfer(msg.sender, req.tokenAmount);

    // decrease balance of request sender
    reservedBalances[msg.sender] -= req.tokenAmount;

    // set transfer request to confirmed
    isTransferRequestConfirmed[_transferRequestId] = true;

    // delete transfer request info
    delete transferRequests[_transferRequestId];
  }

  function confirmTransferRequest(uint256 _transferRequestId) external override onlyOperator {
    // revert if no transfer request
    if (nextTransferRequestId == 0 || _transferRequestId >= nextTransferRequestId) {
      revert PaymentHandler_NoTransferRequest();
    }

    // get transfer request info
    TransferRequest memory req = transferRequests[_transferRequestId];

    // revert if transfer request is already confirmed
    if (isTransferRequestConfirmed[_transferRequestId]) {
      revert PaymentHandler_TransferRequestAlreadyConfirmed();
    }

    // revert if deadline is passed
    if (req.deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // transfer token from this contract to operator
    token.safeTransfer(operator, req.tokenAmount);

    // decrease balance of request sender
    reservedBalances[req.sender] -= req.tokenAmount;

    // set transfer request to confirmed
    isTransferRequestConfirmed[_transferRequestId] = true;
  }
}
