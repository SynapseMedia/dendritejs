import { describe, expect, it } from 'vitest'
import {validPayloadClaims, fingerprintFromJWK, validStandard} from '../src/validate'
import fixturePayload from './fixtures/payload.json'
import fixtureSEP from './fixtures/sep001.json'
import fixtureJwk from './fixtures/jwk.json'



describe("Validate", ()=>{


    describe("Schema", ()=> {
        it("should return false with invalid SEP-001 schema validation", ()=>{
            expect(validStandard({})).toBe(false)
        })

        it("should return true with valid SEP-001 schema validation", ()=>{
            expect(validStandard(fixtureSEP)).toBe(true)
        })
    })

    describe("Payload", ()=>{
        
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

    describe("JWK", ()=>{
        
        it("should return a fingerprint from a valid JWK", async()=>{
            const expectedFingerprint = "e7aa40f080fe6eeda99a5b97934044355769e5eaedad06a605e2424f92b7bb44"
            const got = await fingerprintFromJWK(fixtureJwk)
            expect(got).toBe(expectedFingerprint)
        })
    
        it("should throws error whith invalid JWK", async()=>{
            expect(async () => {
                await fingerprintFromJWK({})
            }).rejects.toThrowError();
        })
    })

})

