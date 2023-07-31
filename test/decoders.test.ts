import { CID } from 'multiformats'
import { describe, expect, it } from 'vitest'

import { createCompact, createDagJose, getDecoderFromCodec, Codec } from '../src/decoders'
import fixturePayload from './fixtures/payload.json'

import type { IPFS } from 'ipfs-core-types'

const compact = 'eyJhbGciOiJFUzI1NiIsImp3ayI6eyJhbGciOiJFUzI1NiIsImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ1c2UiOiJzaWciLCJ4IjoidjZkRU9Bb2M2eXFnd3owdHFkUzlNdUtORFZpVTFKTS1aMzMwdjJWZmN5NCIsInkiOiJYRmRmNkdQX1RNbTdVMlAweEoxRzVPZnVzdGNmT2VIZmN2eHJRc3lRT3lvIn0sInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5tcGVndXJsIn0.eyJkIjogImJhZmtyZWlnNnlkd3dubDQzcnFrNmxyazJ4eWtmd2tlbWI3dHNwYWp5NXJpeGt2ZTNsbXptdTU2ZWFhIiwgInQiOiAiYmFma3JlaWdsNW9weXd5a3Z4c3Z6enpuZGFxNWdlM2x4cmZ1dmgyaWZxM2JvYjVyYng3aTZ4cHJzcHEiLCAicyI6ICJiYWZrcmVpZ2l2bXhsZGVnYTUzYnRkeWtqbDZtNWthNnN4bHNtcW9uYzRyYnB3ZmkyZW11dm8yZWJudSJ9.Fe0fvT6O6jFLaR8eOuyU8sqBU_ZxbLSA413EyjNBLSlXNwEEZM1Qup252DEcLIHLwqTgTXY1x1qsEpqN5OjmiA'
const dagJose = { link: { '/': 'bafyreihk6pijoyutsgzkrzw7ctn5e6mcqxb7pljockvjsjt3e2iyz5m2s4' }, payload: 'AXESIOrz0Jdik5GyqObfFNvSeYKFw_etLhKqmSZ7JpGM9ZqX', signatures: [{ protected: 'eyJhbGciOiJFUzI1NiIsImp3ayI6eyJhbGciOiJFUzI1NiIsImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ1c2UiOiJzaWciLCJ4IjoiU2FHTXJWalczWVZoUHhiNzJjV05maW9MUnFYTXg0eDRzSkhRSjNpUGZPUSIsInkiOiJWZTJ4N0M3N20yV3paQjRyRUNhQXVNSW5xbzNsek1ibnJsZGVIYXViZEtnIn0sInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5tcGVndXJsIn0', signature: '8w7dSt8Fy2eYVs-MtPp4EFDcFGSGXwJjTLlRDapXzYY-ZCDHwDiX-TWHYr4vrGMsmnwfQMJsEN7x0_c7wZ99Yg' }] }

const invalidHeader = 'eyJhbGciOiJFUzI1NksiLCJqd2siOnsiYWxnIjoiRVMyNTZLIiwiY3J2Ijoic2VjcDI1NmsxIiwiZCI6IlFSOTM4Q0w0Xy1LQzRBWHZFQ3RCdlg1M3pqajYzbFNZTmVVaW9oWFljeTgiLCJrdHkiOiJFQyIsInVzZSI6InNpZyIsIngiOiJlM1ViRzZneGt0ZzJzRE93Tk1xNlpTVmlPeTJKTHQtS2x6RzUxMUs0VjJJIiwieSI6IjdxOEpDY3NZLW5tTk41V19YMUhTUkdRSHRYcTRnN2QyTU1VZlIwdlBZMzQifSwidHlwIjoiaW1hZ2UvcG5nIn0.eyJkIjogImJhZmtyZWlhaHFlMm02ejNmejcyN3hnZmhhcTRjZGZ4ZmRnZDRxZXlncjJ4anRyMnIyeWdrdTVubm9lIiwgInMiOiAiYmFma3JlaWVoNWs2dDRnNTd4cGE2NDZmMnRuM3RrbnVldnVzYXVmNXRucnl0YW93cGNoZWl2aHI1ZHkiLCAidCI6ICJiYWZrcmVpZDZtZWNkajQ3N2l2NzVlb2I1enFscWt3cnNkYWR4eGF2eXlibnY2dm5qY2c1ZzZka2pycSJ9.qvteYTFwxfzBKRSqtUnfQwR_yb0ijnjf-lrSZiCyhil5I9D_l2ixZLsLtW_xPreqd5AojyarziJyWr0lGd7mtQ'
const invalidPayload = 'eyJhbGciOiJFUzI1NiIsImp3ayI6eyJhbGciOiJFUzI1NiIsImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ1c2UiOiJzaWciLCJ4IjoiYnNia1owNWlwaC1wNUdGWjhlaEFIbjJtYzR6N0hJU0F0cjJGRFRldERpSSIsInkiOiJpME9kRmRsNVo4OGxjOVh2WWZMMmJIUzlYV1N1LTBvdlRsaC1HRU5DVDAwIn0sInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5tcGVndXJsIn0.e30.SdTdMlRe0q6AcAGY4r_JnTnkFcazZl_DgwovbbaJ9rxqSZGocnwZ61zHCUy1kplYQ_EapwPXN1AsTlPsHZBDEw'

// Expected results from ipfs block get during compact decoding
const mapBlocks: Record<string, any> = {

  bafkreifphflffiwa2ocqy4skadu6whhqiv2ax2rfqzcysj65uzplfbv6za: compact,
  bagcqcerann63enqn2vssm6gko624gojakrswyppm56rao7m6e6vfnvtcxzha: dagJose,

  // Payload s,d,t
  bafkreigivmxldega53btdykjl6m5ka6sxlsmqonc4rbpwfi2emuvo2ebnu: JSON.stringify(fixturePayload.s),
  bafkreig6ydwwnl43rqk6lrk2xykfwkemb7tspajy5rixkve3lmzmu56eaa: JSON.stringify(fixturePayload.d),
  bafkreigl5opywykvxsvzzzndaq5ge3lxrfuvh2ifq3bob5rbx7i6xprspq: JSON.stringify(fixturePayload.t),

  baebbeifij2phas4g5gqdfewielb5lf3l5hl7p5tn7s26gbryekbs76gm2u: invalidHeader,
  bafkreiepxt54zyc2xvi2w2ocrfbbfqsgbck7mbgyuz2k5f2lkn5bidt57a: invalidPayload

}

describe('Decoders', () => {
  const mockNode: IPFS = {
    block: {
      get: async (cid: CID) => {
        return await Promise.resolve(mapBlocks[cid.toString()])
      }
    },
    dag: {
      get: async (cid: CID, opt: { path: string }) => {
        if (opt.path === '/link') {
          // NOTE! reusing map block for payload to avoid rewrite the mocked data
          return await Promise.resolve({
            value: {
              d: fixturePayload.d,
              s: fixturePayload.s,
              t: fixturePayload.t
            }
          })
        }

        return await Promise.resolve({ value: mapBlocks[cid.toString()] })
      }
    }
  } as unknown as IPFS

  const testTable = {
    Compact: {
      decoder: createCompact,
      fingerprint: 'aba44a9673c452de6183c82919de2cdb8b830615e9ac684841502ba7173ee00a',
      cid: 'bafkreifphflffiwa2ocqy4skadu6whhqiv2ax2rfqzcysj65uzplfbv6za',
      invalidPayload: 'bafkreiepxt54zyc2xvi2w2ocrfbbfqsgbck7mbgyuz2k5f2lkn5bidt57a',
      invalidHeader: 'baebbeifij2phas4g5gqdfewielb5lf3l5hl7p5tn7s26gbryekbs76gm2u'
    },
    DagJose: {
      decoder: createDagJose,
      fingerprint: 'b8af21c6fd999f94ab1cf813deb8feb1e0cbdc83a2ad72fd665e4c20b924027c',
      cid: 'bagcqcerann63enqn2vssm6gko624gojakrswyppm56rao7m6e6vfnvtcxzha',
      invalidPayload: 'bafkreiepxt54zyc2xvi2w2ocrfbbfqsgbck7mbgyuz2k5f2lkn5bidt57a',
      invalidHeader: 'baebbeifij2phas4g5gqdfewielb5lf3l5hl7p5tn7s26gbryekbs76gm2u'
    }
  }

  for (const [decoder, test] of Object.entries(testTable)) {
    describe(decoder, () => {
      it('should decode serialization with valid CID', async () => {
        const decoder = test.decoder(mockNode)
        const cid = CID.parse(test.cid)
        const result = await decoder(cid)

        expect(result).toBeDefined()
        expect(result.standard.header).toBeDefined()
        expect(result.standard.header.typ).toBeTypeOf('string')
        expect(result.standard.header.jwk).toBeTypeOf('object')

        expect(result.standard.payload).toBeDefined()
        expect(result.standard.payload.s).toBeTypeOf('object')
        expect(result.standard.payload.d).toBeTypeOf('object')
        expect(result.standard.payload.t).toBeTypeOf('object')
      })

      it('should calculate the expected fingerprint based on bundlded JWK', async () => {
        const decoder = test.decoder(mockNode)
        const cid = CID.parse(test.cid)
        const result = await decoder(cid)

        expect(result.fingerprint).toBeDefined()
        expect(result.fingerprint).toBe(test.fingerprint)
      })

      it('should fail decode with exception if invalid header from cid', async () => {
        const decoder = test.decoder(mockNode)
        const cid = CID.parse(test.invalidHeader)

        await expect(async () => {
          await decoder(cid)
        }).rejects.toThrowError()
      })

      it('should fail decode with exception if invalid payload from cid', async () => {
        const decoder = createCompact(mockNode)
        const cid = CID.parse(test.invalidPayload)

        await expect(async () => {
          await decoder(cid)
        }).rejects.toThrowError('Unexpected payload: The claims "s", "t" or "d" are not present in payload.')
      })
    })
  }

  it('should return the expected decoder based on input codec', () => {
    const dagJose = getDecoderFromCodec(Codec.DagJose)
    const compact = getDecoderFromCodec(Codec.Raw)

    expect(dagJose).toBe(createDagJose)
    expect(compact).toBe(createCompact)
  })

  it('should throws error if invalid codec is provided', () => {
    expect(() => {
      // @ts-expect-error
      getDecoderFromCodec('0x00')
    }).toThrowError()
  })
})
