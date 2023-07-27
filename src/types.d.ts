import type { JWK } from 'jose'
import type { CID } from 'multiformats'
import type { IPFS } from 'ipfs-core'

declare global {

  /**
   * Structural metadata MUST represent information that describes the internal structure of a multimedia resource.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#additional-claims structural} spec.
   */
  interface Structural {
    readonly cid: string // Could be changed later to a CID type
    readonly path?: string
  }

  /**
   * Descriptive metadata MUST represent information that describes the content of a multimedia resource.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#additional-claims descriptive} spec.
   */
  interface Descriptive {
    readonly title: string
    readonly description: string
  }

  /**
   * Technical metadata MUST represent information that describes the technical characteristics of a multimedia resource.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#additional-claims technical} spec.
   */
  interface Technical {
    readonly size?: number
    readonly width?: number
    readonly height?: number
    readonly length?: number
  }

  /**
   * SEP-001 header  representation.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#structure-of-json-web-token header} spec.
   */
  interface Header {
    typ: string
    jwk: JWK
  }

  /**
   * SEP-001 payload representation.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md#structure-of-json-web-token payload} spec.
   */
  interface Payload {
    readonly d: Descriptive
    readonly s: Structural
    readonly t: Technical
  }

  /**
   * SEP-001 standard representation.
   * @see {@link https://github.com/SynapseMedia/sep/blob/main/SEP/SEP-001.md sep-001} spec.
   */
  interface SEP001 {
    header: Header
    payload: Payload
  }

  interface Decoded {
    standard: SEP001
    fingerprint: string
  }

  type Creator<Param, Return> = (param: Param) => Return
  type Decoder = (cid: CID) => Promise<Decoded>

}

export { }
