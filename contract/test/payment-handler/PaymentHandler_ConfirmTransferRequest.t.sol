// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PaymentHandlerBaseTest, IPaymentHandler } from "./PaymentHandler_Base.t.sol";

contract PaymentHandlerConfirmTransferRequestTest is PaymentHandlerBaseTest {
  function setUp() public override {
    super.setUp();
  }

  function testCorrectness_WhenConfirmTransferRequest() public {
    _aliceInitTransferRequest();

    uint256[3] memory publicSignals;
    // pubkey_hash
    publicSignals[0] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // account
    publicSignals[1] = 4054623830042818900215125390902;
    // address
    publicSignals[2] = 0;

    uint256[2] memory proof_a = [
      2272480160896829909518428411637247125535234088651787885535703227282845181370,
      14468187618084246368169101151528239235675627220338085160935909931767366050199
    ];
    // Note: you need to swap the order of the two elements in each subarray
    uint256[2][2] memory proof_b = [
      [
        18590567909098742223339670396535173047473561530466697402426461550113649546195,
        12129650690587114763953975458507524926768521060663399638705300231074557215445
      ],
      [
        10472079768490004099850598243089615771718974818006282473280969100772245648681,
        2858908759969140587984295508026493403257179635574383785451641291172520697771
      ]
    ];
    uint256[2] memory proof_c = [
      4400119510940497671047370825247029698555336884030343094392538945802146097150,
      11633267222742183660566019016538467381053551416281348615315102951791598413224
    ];

    uint256[8] memory proof = [
      proof_a[0],
      proof_a[1],
      proof_b[0][0],
      proof_b[0][1],
      proof_b[1][0],
      proof_b[1][1],
      proof_c[0],
      proof_c[1]
    ];

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    paymentHandler.confirmTransferRequest(transferRequestId, proof, publicSignals);

    assertEq(usdc.balanceOf(operator), 28);
    assertEq(usdc.balanceOf(address(paymentHandler)), 0);

    assertEq(paymentHandler.reservedBalances(ALICE), 0);
    assertEq(paymentHandler.nextTransferRequestId(), 1);
  }

  function testRevert_WhenConfirmTransferRequest_BeforeInitTransferRequest() public {
    uint256[3] memory publicSignals;
    uint256[8] memory proof;

    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.confirmTransferRequest(0, proof, publicSignals);
  }

  function testRevert_WhenConfirmTransferRequest_WithInvalidRequestId() public {
    uint256[3] memory publicSignals;
    uint256[8] memory proof;

    _aliceInitTransferRequest();

    uint256 nextId = paymentHandler.nextTransferRequestId();
    assertEq(nextId, 1);

    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_NoTransferRequest.selector);
    paymentHandler.confirmTransferRequest(nextId, proof, publicSignals);
  }

  function testRevert_WhenConfirmTransferRequest_WithUnauthorizedCaller() public {
    uint256[3] memory publicSignals;
    uint256[8] memory proof;

    _aliceInitTransferRequest();

    vm.prank(ALICE);
    vm.expectRevert(IPaymentHandler.PaymentHandler_Unauthorized.selector);
    paymentHandler.confirmTransferRequest(0, proof, publicSignals);
  }

  function testRevert_WhenConfirmTransferRequest_WithSameId() public {
    uint256[3] memory publicSignals;
    // pubkey_hash
    publicSignals[0] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // account
    publicSignals[1] = 4054623830042818900215125390902;
    // address
    publicSignals[2] = 0;

    uint256[2] memory proof_a = [
      2272480160896829909518428411637247125535234088651787885535703227282845181370,
      14468187618084246368169101151528239235675627220338085160935909931767366050199
    ];
    // Note: you need to swap the order of the two elements in each subarray
    uint256[2][2] memory proof_b = [
      [
        18590567909098742223339670396535173047473561530466697402426461550113649546195,
        12129650690587114763953975458507524926768521060663399638705300231074557215445
      ],
      [
        10472079768490004099850598243089615771718974818006282473280969100772245648681,
        2858908759969140587984295508026493403257179635574383785451641291172520697771
      ]
    ];
    uint256[2] memory proof_c = [
      4400119510940497671047370825247029698555336884030343094392538945802146097150,
      11633267222742183660566019016538467381053551416281348615315102951791598413224
    ];

    uint256[8] memory proof = [
      proof_a[0],
      proof_a[1],
      proof_b[0][0],
      proof_b[0][1],
      proof_b[1][0],
      proof_b[1][1],
      proof_c[0],
      proof_c[1]
    ];

    _aliceInitTransferRequest();

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    paymentHandler.confirmTransferRequest(transferRequestId, proof, publicSignals);

    // // operator confirm transfer request again
    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_TransferRequestAlreadyConfirmed.selector);
    paymentHandler.confirmTransferRequest(transferRequestId, proof, publicSignals);
  }

  function testRevert_WhenConfirmTransferRequest_WithExceedDeadline() public {
    uint256[3] memory publicSignals;
    uint256[8] memory proof;

    _aliceInitTransferRequest();

    vm.warp(block.timestamp + 1001);

    // operator confirm transfer request
    uint256 transferRequestId = 0;
    vm.prank(operator);
    vm.expectRevert(IPaymentHandler.PaymentHandler_ExceedDeadline.selector);
    paymentHandler.confirmTransferRequest(transferRequestId, proof, publicSignals);
  }
}
