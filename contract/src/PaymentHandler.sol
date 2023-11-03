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
    address operator;
    uint256 initTimestamp;
    uint256 deadline;
    uint256 tokenAmount;
    uint256 thbAmount;
    uint64 promptPayId;
  }

  // === Events ===

  event TransferRequestInitiated(
    uint256 indexed id,
    address indexed operator,
    uint256 thbAmount,
    uint16 exchangeRateBps,
    uint64 promptPayId
  );

  // === States ===

  ERC20 public immutable token;
  uint16 public constant MAX_BPS = 10000;

  // address public operator;
  uint256 public nextTransferRequestId;
  mapping(address sender => uint256 amount) public reservedBalances;
  mapping(uint256 reqId => TransferRequest info) public transferRequests;
  mapping(uint256 reqId => bool isTransfered) public isTransferRequestConfirmed;

  constructor(address _token) {
    token = ERC20(_token);
    nextTransferRequestId = 0;
  }

  function _getMessageSigner(
    uint16 _exchangeRateBps,
    uint256 _deadline,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) internal pure returns (address) {
    bytes32 hash = keccak256(abi.encodePacked(_exchangeRateBps, _deadline));
    return ECDSA.recover(hash, _v, _r, _s);
  }

  function initTransferRequest(
    uint256 _thbAmount,
    uint256 _deadline,
    uint16 _exchangeRateBps,
    uint64 _promptPayId,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external override {
    // revert if thbAmount and/or exchangeRate is zero
    if (_thbAmount == 0 || _exchangeRateBps == 0 || _exchangeRateBps > MAX_BPS) {
      revert PaymentHandler_InvalidParams();
    }

    // revert if deadline is passed
    if (_deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // calculate balance to lock
    uint256 tokenAmount = (_thbAmount * _exchangeRateBps) / MAX_BPS;
    if (tokenAmount == 0) {
      revert PaymentHandler_InvalidParams();
    }

    // safe pull token from sender
    token.safeTransferFrom(msg.sender, address(this), tokenAmount);
    reservedBalances[msg.sender] += tokenAmount;

    // store transfer request info
    address operator = _getMessageSigner(_exchangeRateBps, _deadline, _v, _r, _s);
    isTransferRequestConfirmed[nextTransferRequestId] = false;
    transferRequests[nextTransferRequestId] = TransferRequest(
      msg.sender,
      operator,
      block.timestamp,
      _deadline,
      tokenAmount,
      _thbAmount,
      _promptPayId
    );

    // emit event with id to notify operator
    emit TransferRequestInitiated(nextTransferRequestId, operator, _thbAmount, _exchangeRateBps, _promptPayId);

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
    token.safeTransfer(req.sender, req.tokenAmount);

    // decrease balance of request sender
    reservedBalances[req.sender] -= req.tokenAmount;

    // set transfer request to confirmed
    isTransferRequestConfirmed[_transferRequestId] = true;

    // delete transfer request info
    delete transferRequests[_transferRequestId];
  }

  function confirmTransferRequest(uint256 _transferRequestId) external override {
    // revert if no transfer request
    if (nextTransferRequestId == 0 || _transferRequestId >= nextTransferRequestId) {
      revert PaymentHandler_NoTransferRequest();
    }

    // revert if transfer request is already confirmed
    if (isTransferRequestConfirmed[_transferRequestId]) {
      revert PaymentHandler_TransferRequestAlreadyConfirmed();
    }

    TransferRequest memory req = transferRequests[_transferRequestId];

    // revert if msg.sender is not operator
    if (msg.sender != req.operator) {
      revert PaymentHandler_Unauthorized();
    }

    // revert if deadline is passed
    if (req.deadline < block.timestamp) {
      revert PaymentHandler_ExceedDeadline();
    }

    // TODO: implement proof

    // transfer token from this contract to operator
    token.safeTransfer(msg.sender, req.tokenAmount);

    // decrease balance of request sender
    reservedBalances[req.sender] -= req.tokenAmount;

    // set transfer request to confirmed
    isTransferRequestConfirmed[_transferRequestId] = true;
  }
}
