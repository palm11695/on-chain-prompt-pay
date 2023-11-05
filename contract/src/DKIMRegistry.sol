// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

// libraries
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { StringUtils } from "./utils/StringUtils.sol";

// interfaces
import { IDKIMRegistry } from "./interfaces/IDKIMRegistry.sol";

contract DKIMRegistry is IDKIMRegistry, Ownable {
  mapping(string domain => bytes32 publicKeyHash) public dkimPublicKeyHashes;

  constructor(address _owner) Ownable(_owner) {
    // Pre-defined DKIM public key hashes
    dkimPublicKeyHashes["kasikornbank.com"] = bytes32(
      uint256(19430047151743734661547284238141409021047853263308871256452083578798143806083)
    );
    dkimPublicKeyHashes["scb.co.th"] = bytes32(
      uint256(17067172875469303085990980001719131698040835340315412674226156925399884329499)
    );
  }

  function getDKIMPublicKeyHash(string memory _domainName) external view override returns (bytes32) {
    return dkimPublicKeyHashes[_domainName];
  }

  function setDKIMPublicKeyHash(string memory _domainName, bytes32 _publicKeyHash) external override onlyOwner {
    dkimPublicKeyHashes[_domainName] = _publicKeyHash;
  }
}
