// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { SCBEWalletZKVerifier } from "../../src/SCBEWalletZKVerifier.sol";

import "forge-std/Test.sol";

import "../../src/utils/StringUtils.sol";

contract SCBEWalletZKVerifierTest is Test {
  SCBEWalletZKVerifier internal verifier;

  function setUp() public {
    verifier = new SCBEWalletZKVerifier();
  }

  function test_SCBEWallet_VerifyProof() public {
    uint256[3] memory publicSignals;
    // pubkey_hash
    publicSignals[0] = 17067172875469303085990980001719131698040835340315412674226156925399884329499;
    // account
    publicSignals[1] = 177306497084826731560661377703308485966398620978535;
    // address
    publicSignals[2] = 0;

    uint256[2] memory proof_a = [
      20830066681319823473497281616119232639224973184755620030537654812993898952408,
      5485748648194882456013688311215574561726483637113354652137298425324532626831
    ];
    // Note: you need to swap the order of the two elements in each subarray
    uint256[2][2] memory proof_b = [
      [
        2148763658310108305816333685888625247338868884798552456794950946433055350936,
        14877731812187433117725554567318087583968909293282471348137170749998315484839
      ],
      [
        15817960824366940426241104273428424625555600779856681576935327282580826772352,
        15616240802616232102593747894069966969884939870312173578236989371257700399465
      ]
    ];
    uint256[2] memory proof_c = [
      10642644346166715728981399938210521415177110148278963904042015414530595321469,
      13405334751054666652771830237952638825051861212502367140184129934895122619950
    ];

    // Test proof verification
    bool verified = verifier.verifyProof(proof_a, proof_b, proof_c, publicSignals);
    assertEq(verified, true);
  }
}
