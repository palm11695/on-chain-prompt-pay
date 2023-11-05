// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IDKIMRegistry {
  function getDKIMPublicKeyHash(string memory _domainName) external view returns (bytes32);

  function setDKIMPublicKeyHash(string memory _domainName, bytes32 _publicKeyHash) external;
}
