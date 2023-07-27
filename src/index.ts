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
 * const compact = 'bafkreidb7uq7vdxhmkstdfgky5gh7vh5t7rordkoamjvf4o6buubbdu3da'
 * const node = await create()
 * const decoder = dendrite(node)
 * const decoded = await decoder(compact)
 * ...
 * ```
 */

import { create } from 'ipfs-core'
import { CID } from 'multiformats/cid'

import { validStandard } from '@/validate'
import { getDecoderFromCodec } from '@/decoders'

import type { IPFS } from 'ipfs-core'
import type { Codec } from '@/decoders'

/**
 * The standard Impulse API for handling metadata.
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
export function dendrite (node: IPFS): Creator<string, Promise<Impulse>> {
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

    // delete decoded.standard.payload.d.title
    // Check if the metadata obtained comply with the standard schema
    console.log(validStandard({}))
    if (!validStandard(decoded.standard)) {
      throw new TypeError('CID resolves an invalid SEP001 standard implementation.')
    }

    // TODO verificar que validStandard resuelva correctamente

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

(async () => {
  // const dagCid = 'bagcqceraldl3mw72pvte7p77vbspq7umcbxxnxzoqrzkb26xmekwd3j3mgza'
  // const compact = 'bafkreidb7uq7vdxhmkstdfgky5gh7vh5t7rordkoamjvf4o6buubbdu3da'
  // BAD CIDs above!

  // const dagJose = 'bagcqcerann63enqn2vssm6gko624gojakrswyppm56rao7m6e6vfnvtcxzha'
  const compact ='bafkreifphflffiwa2ocqy4skadu6whhqiv2ax2rfqzcysj65uzplfbv6za'

  // ipfs node
  const node = await create()

  // dendrite standard retrieval
  const retriever = dendrite(node)
  const decoded = await retriever(compact)

  console.log(decoded.type()) // the media mime type represented in metadata
  console.log(decoded.metadata()) // payload {structural,descriptive,technical} metadata
  // fingerprint verification with shared fingerprint
  console.log(decoded.validate('aba44a9673c452de6183c82919de2cdb8b830615e9ac684841502ba7173ee00a')) 
})()
