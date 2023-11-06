// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "forge-std/Test.sol";

import "../src/payment-handlers/SCBEWalletPaymentHandler.sol";

contract ForkTest is Test {
  SCBEWalletPaymentHandler internal paymentHandler;

  function setUp() public {
    vm.createSelectFork("arbitrum_goerli");

    paymentHandler = SCBEWalletPaymentHandler(0xC2c42EDB20E827049c17235cBc53C9eE5160030a);
  }

  function testWhyNotWork() public {
    uint256[2] memory proof_a = [
      6036006441970746169244971387123142155245794594882076313904521229487907647146,
      11988189073574702292574524230554783994125698152889565277171612272818604885887
    ];
    // Note: you need to swap the order of the two elements in each subarray
    uint256[2][2] memory proof_b = [
      [
        16838106554033841810879490639289155205971464952947121652130311902484370276862,
        12732494221907060504825187937217599144059439320534417036162103482868866858511
      ],
      [
        18460232420252577439676293207875165850119013214699473718727080926310934939680,
        16702699200777147743321846486108309072902032648726443258989799496680064511972
      ]
    ];
    uint256[2] memory proof_c = [
      9189677023683718615337642014633763497924459717407681800044961176704278413877,
      3437483668329009282319710462351247825777229185764789615210518536944809882339
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

    vm.prank(0x00D8cD1F00558D275f6501Ae00Ef8a7D4b40A7E8);
    paymentHandler.confirmTransferRequest(5, proof);
  }
}
