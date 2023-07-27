import { createDagJose } from './dag-jose'
import { createCompact } from './compact'
import type { IPFS } from 'ipfs-core-types'

/**
 * List of allowed codecs based on codec code reference.
 * @see {@link https://github.com/multiformats/multicodec/blob/master/table.csv reference}.
 */
export enum Codec {
  Raw = '0x55',
  DagJose = '0x85'
}

/**
 * Return the corresponding retrieval strategy based on the provided encoding codec.
 * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#serialization}.
 *
 * @param codec - The encoding codec to retrieve decoder.
 * @return The matched decoder creator.
 * @throws if the provided codec is not supported.
 */
export function getDecoderFromCodec (codec: Codec): Creator<IPFS, Decoder> {
  // Map record of allowed decoders.
  const codecDecoders = {
    [Codec.DagJose]: createDagJose,
    [Codec.Raw]: createCompact
  }

  // Check if provided codec exist in the registry.
  if (!(codec in codecDecoders)) {
    throw new Error(`The provided codec "${codec}" is not supported.`)
  }

  return codecDecoders[codec]
}

export { createCompact, createDagJose }
