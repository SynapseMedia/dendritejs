
import { create } from 'ipfs-core'
import { CID } from 'multiformats/cid'

import { validStandard } from './validate'
import { getDecoderFromCodec } from './decoders'

import type { IPFS } from 'ipfs-core'
import type { Codec } from './decoders'
export type Dendrite = (cidStr: string) => Promise<SEP001>

/**
 * Return function that resolves SEP001 standard metadata from a provided CID using the given IPFS node.
 *
 * @param node - The IPFS node to use for resolving the metadata .
 * @returns A promise that resolves with the SEP001 metadata representation.
 */
export function dendrite(node: IPFS): Dendrite {
  /**
   * Resolve the metadata from the provided CID.
   *
   * @param cid - The CID to resolve.
   * @returns A promise that resolves with the SEP001 implementation.
   *
   */
  return async (cidStr: string): Promise<SEP001> => {
    const cid: CID = CID.parse(cidStr)
    const codec: Codec = `0x${(cid.code).toString(16)}` as Codec
    // Match the right decoder based on CID codec.
    const decoder: Decoder = getDecoderFromCodec(codec)(node)
    const sep001 = await decoder(cid)

    // Check if the metadata obtained comply with the standard schema
    if (!validStandard(sep001)) {
      throw new Error('CID contains an invalid SEP001 standard implementation.')
    }

    return sep001
  }
}

(async () => {
  const dag_cid = 'bagcqceraajwo66kumbcrxf2todw7wjrmayh7tjwaegwigcgpzk745my4qa5a'
  const compact = 'bafkreidb7uq7vdxhmkstdfgky5gh7vh5t7rordkoamjvf4o6buubbdu3da'

  const node = await create()
  const retriever = dendrite(node)

  // const sep001Jose = resolve(dag_cid)
  const sep001Compact = await retriever(compact)
  console.log(sep001Compact)
})()
