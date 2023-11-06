import * as dotenv from "dotenv";
dotenv.config();

import { Hex, createWalletClient, http, parseAbi, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumGoerli } from "viem/chains";

(async () => {
  const client = createWalletClient({
    chain: arbitrumGoerli,
    transport: http(),
  });

  const account = privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY as Hex);

  const abi = parseAbi([
    "function initTransferRequest(uint256 _thbAmount,uint256 _deadline,uint16 _exchangeRateBps,string calldata _promptPayId,uint8 _v,bytes32 _r,bytes32 _s) external",
  ]);

  const thbAmount = 100n;
  const deadline = 2n ** 128n;
  const exchangeRateBps = 285;
  const promptPayId = "gMDA0OTk5MDQ1MjAzNjQy"; // base64 encoded
  const v = 27;
  const r = "0x2f8c9531f4a4a9c7e4c255f507609ba1451144ff0f8db4110be4f388161195cf";
  const s = "0x3066e4fb78bdff95211cb666c49a1df3bb961d7e694a50b8089de674c36f2baa";

  const hash = await client.writeContract({
    address: "0xC2c42EDB20E827049c17235cBc53C9eE5160030a",
    abi,
    functionName: "initTransferRequest",
    args: [thbAmount, deadline, exchangeRateBps, promptPayId, v, r, s],
    account,
    chain: arbitrumGoerli,
  });

  console.log("hash", hash);
})();
