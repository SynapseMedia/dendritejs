import { compactVerify, EmbeddedJWK, JWK } from 'jose'
import { validPayloadClaims, fingerprintFromJWK } from '@/validate/index.js'
import { CID } from 'multiformats'

import type { IPFS } from 'ipfs-core-types'

/**
 * Creates a Compact decoder .
 *
 * @param node - The connected ipfs node to use for metadata retrieval.
 * @return A Compact serialization decoder.
 */
export const createCompact = (node: IPFS): Decoder => {
  /**
   * Resolves the metadata from cid using IPFS node's `block` api.
   *
   * @param cid - The metadata cid to resolve.
   * @return The raw metadata resolved from cid.
   */
  const fetch = async (cid: CID): Promise<string> => {
    return (await node.block.get(cid)).toString()
  }

  /**
   * Does the same as "fetch" and serializes the result as JSON.
   *
   * @param cid - The metadata cid to resolve.
   * @return The JSON metadata resolved from cid.
   */
  const fetchCompactAsJSON = async <Type>(cid: CID): Promise<Type> => {
    return JSON.parse(await fetch(cid)) as Type
  }

  /**
   * Deserializes the resolved data from IPFS according to the "compact" SEP-001 serialization spec.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md SEP-001} specification.
   *
   * @param cid - The raw metadata cid to deserialize.
   * @returns A promise that resolves with decoded cid.
   * @throws {TypeError} If the JWK is not present in standard header.
   * @throws {Error} If decoding fails.
   */
  return async (cid: CID): Promise<Decoded> => {
    try {
      const compactSerialization = await fetch(cid)
      // Verify the compact serialization using the embedded JWK.
      const { payload, protectedHeader } = await compactVerify(compactSerialization, EmbeddedJWK)

      // Decode Uint8Array to JSON object
      const stringPayload = (new TextDecoder().decode(payload))
      const fingerprint = await fingerprintFromJWK(protectedHeader.jwk as JWK)
      const rawPayload = validPayloadClaims(JSON.parse(stringPayload))

      const s = await fetchCompactAsJSON<Structural>(CID.parse(rawPayload.s))
      const d = await fetchCompactAsJSON<Descriptive>(CID.parse(rawPayload.d))
      const t = await fetchCompactAsJSON<Technical>(CID.parse(rawPayload.t))

      return {
        fingerprint,
        standard: {
          header: protectedHeader as Header,
          payload: { s, d, t }
        }
      }
    } catch (err: any) {
      if (err instanceof TypeError || err.name === 'JWSInvalid') {
        // This exception is raised by jose when JWK is not present or is an invalid token.
        // It's better understand a clear reason why this exception..
        throw new TypeError(`Unexpected header: ${err.message}`)
      }

      throw err
    }
  }
}
