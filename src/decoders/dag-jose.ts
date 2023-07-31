import { generalVerify, EmbeddedJWK, GeneralJWSInput, JWK } from 'jose'
import { validPayloadClaims, fingerprintFromJWK } from '@/validate/index.js'

import { CID } from 'multiformats'
import type { IPFS } from 'ipfs-core-types'

/**
 * Creates a DagJose decoder.
 *
 * @param node - The connected node to use for metadata retrieval.
 * @return A Dag-Jose decoder.
 */
export const createDagJose = (node: IPFS): Decoder => {
  /**
   * Resolves the metadata from cid using IPFS node's `dag` api.
   *
   * @param cid - The metadata cid to resolve.
   * @return  The raw metadata resolved from cid.
   */
  const fetch = async <Type>(cid: CID, path: string | null = null): Promise<Type> => {
    return (await node.dag.get(cid, path !== null ? { path } : {}))?.value as Type
  }

  /**
   * Deserializes the resolved data from IPFS according to the "dag-jose" SEP-001 serialization spec.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md SEP-001} for the specification.
   *
   * @param raw - The raw metadata to deserialize.
   * @returns A promise that resolves with decoded cid.
   * @throws {TypeError} If the JWK is not present in standard header.
   * @throws {Error} If decoding fails.
   */
  return async (cid: CID): Promise<Decoded> => {
    try {
      const rawMetadata = await fetch<GeneralJWSInput>(cid)
      const { protectedHeader } = await generalVerify(rawMetadata, EmbeddedJWK)

      const header = protectedHeader as Header
      const payload = validPayloadClaims(await fetch<Payload>(cid, '/link'))
      const fingerprint = await fingerprintFromJWK(protectedHeader?.jwk as JWK)

      return {
        fingerprint,
        standard: {
          header,
          payload
        }
      }
    } catch (err: any) {
      if (err instanceof TypeError || err.name === 'JWSInvalid') {
        // This exception is raised by jose when JWK is not present or is an invalid token.
        // It's better understand a clear reason why this exception..
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new TypeError(`Unexpected header: ${err.message}`)
      }

      throw err
    }
  }
}
