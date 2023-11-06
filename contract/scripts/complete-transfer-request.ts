import * as dotenv from "dotenv";
dotenv.config();

import { Hex, createWalletClient, http, parseAbi, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumGoerli } from "viem/chains";

import proofJson from "../../circuits/build/scb_ewallet/proof.json";

(async () => {
  const client = createWalletClient({
    chain: arbitrumGoerli,
    transport: http(),
  });

  const account = privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY as Hex);

  const abi = parseAbi([
    "function confirmTransferRequest(uint256 _transferRequestId, uint256[8] memory _proof) external",
  ]);

  const transferRequestId = 8n;
  const proof = [
    parseUnits(proofJson.pi_a[0], 0),
    parseUnits(proofJson.pi_a[1], 0),
    parseUnits(proofJson.pi_b[0][1], 0),
    parseUnits(proofJson.pi_b[0][0], 0),
    parseUnits(proofJson.pi_b[1][1], 0),
    parseUnits(proofJson.pi_b[1][0], 0),
    parseUnits(proofJson.pi_c[0], 0),
    parseUnits(proofJson.pi_c[1], 0),
  ] as const;

  const hash = await client.writeContract({
    address: "0xC2c42EDB20E827049c17235cBc53C9eE5160030a",
    abi,
    functionName: "confirmTransferRequest",
    args: [transferRequestId, proof],
    account,
    chain: arbitrumGoerli,
  });

  console.log("hash", hash);
})();
