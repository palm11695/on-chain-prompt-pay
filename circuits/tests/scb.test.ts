import { beforeAll, expect, test } from 'vitest'
import { verifyDKIMSignature } from '@zk-email/helpers/src/dkim'
import { bytesToBigInt, fromHex } from '@zk-email/helpers/src/binaryFormat'
import { findIndexInUint8Array, generateCircuitInputs } from '@zk-email/helpers/src/input-helpers'

const path = require('path')
const fs = require('fs')
const wasm_tester = require('circom_tester').wasm

export const STRING_PRESELECTOR = 'L3RkPjwvdHI+PHRyPjx0ZD48L3Rk'
export const MAX_HEADER_PADDED_BYTES = 640 // NOTE: this must be the same as the first arg in the email in main args circom
export const MAX_BODY_PADDED_BYTES = 3840 // NOTE: this must be the same as the arg to sha the remainder number of bytes in the email in main args circom

let dkimResult: import('@zk-email/helpers/src/dkim').DKIMVerificationResult
let circuit: any

const skipCircuit = false

beforeAll(async () => {
  console.log('skipCircuit', skipCircuit)

  if (!skipCircuit) {
    circuit = await wasm_tester(path.join(__dirname, '../scb.circom'), {
      // NOTE: We are running tests against pre-compiled circuit in the below path
      // You need to manually compile when changes are made to circuit if `recompile` is set to `false`.
      recompile: true,
      output: path.join(__dirname, '../build/scb'),
      include: path.join(__dirname, '../node_modules'),
    })
  }

  const rawEmail = fs.readFileSync(path.join(__dirname, '../emls/scb.eml'), 'utf8')
  dkimResult = await verifyDKIMSignature(rawEmail)
})

test('should verify account', async () => {
  const selector = new TextEncoder().encode(STRING_PRESELECTOR)
  const selectorIndex = findIndexInUint8Array(dkimResult.body, selector)
  console.log('selectorIndex', selectorIndex)
  console.log('dkimResult.body', dkimResult.body.map((c) => Number(c)).slice(selectorIndex, selectorIndex + 100))

  const emailVerifierInputs = generateCircuitInputs({
    rsaSignature: dkimResult.signature,
    rsaPublicKey: dkimResult.publicKey,
    body: dkimResult.body,
    bodyHash: dkimResult.bodyHash,
    message: dkimResult.message,
    shaPrecomputeSelector: STRING_PRESELECTOR,
    maxMessageLength: MAX_HEADER_PADDED_BYTES,
    maxBodyLength: MAX_BODY_PADDED_BYTES,
  })

  const bodyRemaining = emailVerifierInputs.in_body_padded!.map((c) => Number(c)) // Char array to Uint8Array
  const selectorBuffer = Buffer.from(STRING_PRESELECTOR)
  const usernameIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) - 17

  const ethereumAddress = '0x00000000000000000000'
  const address = bytesToBigInt(fromHex(ethereumAddress)).toString()

  const scbVerifierInputs = {
    ...emailVerifierInputs,
    account_idx: usernameIndex.toString(),
    address,
  }

  console.log(scbVerifierInputs)

  if (!skipCircuit) {
    const witness = await circuit.calculateWitness(scbVerifierInputs)
    await circuit.checkConstraints(witness)
  }
})

// test('should fail to verify account if account index is invalid', async () => {
//   const emailVerifierInputs = generateCircuitInputs({
//     rsaSignature: dkimResult.signature,
//     rsaPublicKey: dkimResult.publicKey,
//     body: dkimResult.body,
//     bodyHash: dkimResult.bodyHash,
//     message: dkimResult.message,
//     shaPrecomputeSelector: STRING_PRESELECTOR,
//     maxMessageLength: MAX_HEADER_PADDED_BYTES,
//     maxBodyLength: MAX_BODY_PADDED_BYTES,
//   })

//   const bodyRemaining = emailVerifierInputs.in_body_padded!.map((c) => Number(c)) // Char array to Uint8Array
//   const selectorBuffer = Buffer.from(STRING_PRESELECTOR)
//   const usernameIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length

//   const ethereumAddress = '0x00000000000000000000'
//   const address = bytesToBigInt(fromHex(ethereumAddress)).toString()

//   const scbVerifierInputs = {
//     ...emailVerifierInputs,
//     account_idx: usernameIndex.toString(),
//     address,
//   }
//   scbVerifierInputs.account_idx = (Number(scbVerifierInputs.account_idx) + 1).toString()

//   try {
//     const witness = await circuit.calculateWitness(scbVerifierInputs)
//     await circuit.checkConstraints(witness)
//   } catch (error) {
//     expect((error as Error).message).toMatch('Assert Failed')
//   }
// })
