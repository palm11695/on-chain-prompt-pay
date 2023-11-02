// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

// libraries
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// interfaces
import { IDKIMRegistry } from "./interfaces/IDKIMRegistry.sol";

contract DKIMRegistry is IDKIMRegistry, Ownable {
  mapping(string domain => bytes32 publicKeyHash) public dkimPublicKeyHashes;

  constructor(address _owner) Ownable(_owner) {
    // Pre-defined DKIM public key hashes
    dkimPublicKeyHashes["kasikornbank.com"] = bytes32(uint256(0));
  }

  function getDKIMPublicKeyHash(string memory _domainName) external view override returns (bytes32) {
    return dkimPublicKeyHashes[_domainName];
  }

  function setDKIMPublicKeyHash(string memory _domainName, bytes32 _publicKeyHash) external override onlyOwner {
    dkimPublicKeyHashes[_domainName] = _publicKeyHash;
  }
}
