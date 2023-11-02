import { test, expect } from 'vitest'
import { verifyDKIMSignature } from '@zk-email/helpers/src/dkim'
import { bytesToBigInt, fromHex } from '@zk-email/helpers/src/binaryFormat'
import { generateCircuitInputs } from '@zk-email/helpers/src/input-helpers'

const path = require('path')
const fs = require('fs')
const wasm_tester = require('circom_tester').wasm

export const STRING_PRESELECTOR = 'email was meant for @'
export const MAX_HEADER_PADDED_BYTES = 1024 // NOTE: this must be the same as the first arg in the email in main args circom
export const MAX_BODY_PADDED_BYTES = 1536 // NOTE: this must be the same as the arg to sha the remainder number of bytes in the email in main args circom

test(
  'test',
  async () => {
    let dkimResult: import('@zk-email/helpers/src/dkim').DKIMVerificationResult
    let circuit: any

    const rawEmail = fs.readFileSync(path.join(__dirname, '../emls/zktestemail_twitter.eml'), 'utf8')
    dkimResult = await verifyDKIMSignature(rawEmail)

    circuit = await wasm_tester(path.join(__dirname, '../kbank.circom'), {
      // NOTE: We are running tests against pre-compiled circuit in the below path
      // You need to manually compile when changes are made to circuit if `recompile` is set to `false`.
      recompile: true,
      output: path.join(__dirname, '../build/kbank'),
      include: path.join(__dirname, '../node_modules'),
    })

    const rsaSignature = dkimResult.signature
    const rsaPublicKey = dkimResult.publicKey
    const body = dkimResult.body
    const bodyHash = dkimResult.bodyHash
    const message = dkimResult.message
    const ethereumAddress = '0x00000000000000000000'

    const emailVerifierInputs = generateCircuitInputs({
      rsaSignature,
      rsaPublicKey,
      body,
      bodyHash,
      message,
      shaPrecomputeSelector: STRING_PRESELECTOR,
      maxMessageLength: MAX_HEADER_PADDED_BYTES,
      maxBodyLength: MAX_BODY_PADDED_BYTES,
    })

    const bodyRemaining = emailVerifierInputs.in_body_padded!.map((c) => Number(c)) // Char array to Uint8Array
    const selectorBuffer = Buffer.from(STRING_PRESELECTOR)
    console.log(Buffer.from(bodyRemaining).toString())
    const usernameIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length

    const address = bytesToBigInt(fromHex(ethereumAddress)).toString()

    const twitterVerifierInputs = {
      ...emailVerifierInputs,
      twitter_username_idx: usernameIndex.toString(),
      address,
    }

    const witness = await circuit.calculateWitness(twitterVerifierInputs)
    await circuit.checkConstraints(witness)
  },
  10 * 60 * 1000,
)
