/**
 * @packageDocumentation
 *
 * Dendrite is a tool designed for the retrieval and validation of the SEP-001 standard.
 * Its main goal is to provide a user-friendly and easy-to-use interface to interact with the standard.
 *
 * @example
 *
 * ```typescript
 * import {create} from 'ipfs-core'
 * import dendrite from 'dendritejs'
 *
 * const compact = 'bafkreifphflffiwa2ocqy4skadu6whhqiv2ax2rfqzcysj65uzplfbv6za'
 * const node = await create()
 * const decoder = dendrite(node)
 * const decoded = await decoder(compact)
 *
 * const expectedFingerprint = 'aba44a9673c452de6183c82919de2cdb8b830615e9ac684841502ba7173ee00a'
 * const validFingerprint = decoded.validate(expectedFingerprint)
 * ...
 * ```
 */

import { CID } from 'multiformats/cid'

import { validStandard } from '@/validate/index.js'
import { getDecoderFromCodec } from '@/decoders/index.js'

import type { IPFS } from 'ipfs-core-types'
import type { Codec } from '@/decoders'

/**
 * The Impulse API is a standardized interface for handling retrieved metadata.
 */
export interface Impulse {
  /**
   * Return the media type found in SEP-001 header.
   * This method provides the IANA-based media type related to the metadata.
   *
   * @returns The IANA-based media type string related to the metadata.
   */
  type: () => string

  /**
   * Return the metadata found in SEP-001 payload.
   *
   * @returns The Payload object containing metadata.
   */
  metadata: () => Payload

  /**
   * Validate public key integrity using a fingerprint.
   * A fingerprint is a hash derived from the embedded public key.
   *
   * @param fingerprint - The fingerprint to validate.
   * @returns True if input fingerprint match the public key fingerprint, false otherwise.
   */
  validate: (fingerprint: string) => boolean
}

/**
 * Return function that resolves SEP001 standard metadata from a provided CID using the given IPFS node.
 *
 * @param node - The IPFS node to use for resolving the metadata .
 * @returns A promise that resolves with the SEP001 metadata representation.
 */
export default function dendrite (node: IPFS): Creator<string, Promise<Impulse>> {
  /**
   * Resolve the metadata from the provided CID.
   *
   * @param cid - The CID to resolve.
   * @returns A promise that resolves with the SEP001 implementation.
   * @throws {TypeError} If the retrieved standard doesn't comply with standard specification.
   */
  return async (cidStr: string): Promise<Impulse> => {
    const cid: CID = CID.parse(cidStr)
    const codec: Codec = `0x${(cid.code).toString(16)}` as Codec

    // Match the right decoder based on CID codec.
    const decoder = getDecoderFromCodec(codec)(node)
    const decoded = await decoder(cid)

    // Check if the metadata obtained comply with the standard schema
    if (!validStandard(decoded.standard)) {
      throw new TypeError(
        `CID resolves an invalid SEP001 standard implementation.
        ${validStandard.errors?.map((e, i) => `"${i + 1} - ${e.message ?? ''}"\n\t`).join('') ?? ''}
        `
      )
    }

    return {
      type: () => decoded.standard.header.typ,
      metadata: () => Object.freeze(decoded.standard.payload),
      validate (fingerprint: string) {
        // compact return always one fingerprint
        return fingerprint === decoded.fingerprint
      }
    }
  }
}
