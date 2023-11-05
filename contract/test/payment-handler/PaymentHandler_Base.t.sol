// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { BaseTest } from "../BaseTest.t.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { PaymentHandler } from "../../src/KbankPaymentHandler.sol";
import { DKIMRegistry } from "../../src/DKIMRegistry.sol";
import { ZKVerifier } from "../../src/KbankZKVerifier.sol";

import { IPaymentHandler } from "../../src/interfaces/IPaymentHandler.sol";

contract PaymentHandlerBaseTest is BaseTest {
  PaymentHandler internal paymentHandler;
  address internal operator;

  function setUp() public virtual {
    operator = vm.addr(operatorPrivateKey);
    ZKVerifier _zkVerifier = new ZKVerifier();
    DKIMRegistry _dkimRegistry = new DKIMRegistry(DEPLOYER);
    vm.prank(DEPLOYER);
    _dkimRegistry.setDKIMPublicKeyHash(
      "kasikornbank.com",
      bytes32(uint256(19430047151743734661547284238141409021047853263308871256452083578798143806083))
    );
    paymentHandler = new PaymentHandler(address(usdc), address(_zkVerifier), address(_dkimRegistry));
  }

  function _initTransferRequest(
    address _sender,
    uint256 _thbAmount,
    uint256 _deadline,
    uint16 _exchangeRateBps,
    string memory _promptPayId
  ) internal {
    (uint8 v, bytes32 r, bytes32 s) = _operatorSign(_exchangeRateBps, _deadline);

    vm.startPrank(_sender);
    usdc.approve(address(paymentHandler), _thbAmount * _exchangeRateBps);
    paymentHandler.initTransferRequest(_thbAmount, _deadline, _exchangeRateBps, _promptPayId, v, r, s);
    vm.stopPrank();
  }

  function _aliceInitTransferRequest() internal {
    // alice init transfer request
    uint256 thbAmount = 1000;
    uint16 exchangeRateBps = 280;
    uint256 deadline = block.timestamp + 1000;
    _initTransferRequest(ALICE, thbAmount, deadline, exchangeRateBps, "662-6-02192-3");

    assertEq(usdc.balanceOf(address(paymentHandler)), 28);
    assertEq(paymentHandler.reservedBalances(ALICE), 28);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function _getAliceProof() internal pure returns (uint256[8] memory proof) {
    uint256[2] memory proof_a = [
      21822605512387702805329796966798681498173632730912737733277726290270988453016,
      16001462426673928083928827740496876864845264087843046366004239806055261058136
    ];
    // Note: you need to swap the order of the two elements in each subarray
    uint256[2][2] memory proof_b = [
      [
        18700333760455528663599050942154891739112080605376834310526770446788219095213,
        3008758698541290036384038852907949142923798504590663787243624017534323375420
      ],
      [
        10420699357324231170878666925947910317267498768659199832458479217326342979597,
        2914166797693310005729389519404179500608581931698293573364091127112423043456
      ]
    ];
    uint256[2] memory proof_c = [
      17096158936409808862207224993432417274439573274579721167953590434270729043964,
      2223765861557327639247140856635533525323219858356583116374930296895009798101
    ];

    proof = [
      proof_a[0],
      proof_a[1],
      proof_b[0][0],
      proof_b[0][1],
      proof_b[1][0],
      proof_b[1][1],
      proof_c[0],
      proof_c[1]
    ];
  }
}
