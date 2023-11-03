// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ZKVerifier } from "../../src/ZKVerifier.sol";

import "forge-std/Test.sol";

import "../utils/StringUtils.sol";

contract ZKVerifierTest is Test {
  ZKVerifier internal verifier;

  function setUp() public {
    verifier = new ZKVerifier();
  }

  function convertStringToPackedBytes(
    string memory rawString,
    uint256 packSize
  ) public pure returns (uint256[] memory packedBytes) {
    bytes memory stringBytes = bytes(rawString);
    uint256 packedArraySize = (stringBytes.length + packSize - 1) / packSize;
    packedBytes = new uint256[](packedArraySize);

    for (uint256 i = 0; i < stringBytes.length; i++) {
      uint256 packedIndex = i / packSize;
      uint256 byteIndexWithinPacked = i % packSize;
      packedBytes[packedIndex] |= uint256(uint8(stringBytes[i])) << (8 * byteIndexWithinPacked);
    }

    return packedBytes;
  }

  function test_stringConversion() public {
    // uint256[] memory packedBytes = new uint256[](3);
    // packedBytes[0] = 28557011619965818;
    // string memory byteList = StringUtils.convertPackedBytesToString(packedBytes, 15, 7);
    // console.logString(byteList);
    uint256[] memory packedBytes = convertStringToPackedBytes("662-6-02192-3", 31);
    console.log(packedBytes[0]);
    // console.log(packedBytes[1]);
  }

  function test_verify() public {
    uint256[3] memory publicSignals;
    // pubkey_hash
    // account
    // address

    publicSignals[0] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    publicSignals[1] = 4054623830042818900215125390902;
    publicSignals[2] = 0;

    // publicSignals[0] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // publicSignals[2] = 4054623830042818900215125390902;
    // publicSignals[1] = 0;

    // publicSignals[1] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // publicSignals[0] = 4054623830042818900215125390902;
    // publicSignals[2] = 0;

    // publicSignals[1] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // publicSignals[2] = 4054623830042818900215125390902;
    // publicSignals[0] = 0;

    // publicSignals[2] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // publicSignals[0] = 4054623830042818900215125390902;
    // publicSignals[1] = 0;

    // publicSignals[2] = 19430047151743734661547284238141409021047853263308871256452083578798143806083;
    // publicSignals[1] = 4054623830042818900215125390902;
    // publicSignals[0] = 0;

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

    // Test proof verification
    bool verified = verifier.verifyProof(proof_a, proof_b, proof_c, publicSignals);
    assertEq(verified, true);
  }
}
