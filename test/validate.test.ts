import { describe, expect, it } from 'vitest'
import {validPayloadClaims} from '../src/validate'
import fixturePayload from './fixtures/payload.json'

describe("Validate", ()=>{

    it("should return validated payload when payload validation succeeds", ()=>{
        const validPayload = validPayloadClaims(fixturePayload)
        expect(validPayload).toBe(fixturePayload)
    })


    it("should throws error when payload validation fails", ()=>{
        const invalidPayload = {a: 1, b: 2, c:3}

        expect(() => {
            validPayloadClaims(invalidPayload)
        }).toThrowError('Unexpected payload: The claims "s", "t" or "d" are not present in payload.');
    })
})