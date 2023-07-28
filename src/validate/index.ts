import Ajv from 'ajv'
import { calculateJwkThumbprint, JWK } from 'jose'
import schemaTpl from './schema.json'

const ajv = new Ajv({ allErrors: true })
export const validStandard = ajv.compile(schemaTpl)

/**
 * Validates if metadata payload comply with SEP001 spec claims.
 *
 * @param payload - The metadata payload to validate.
 * @throws {TypeError} If the JWK is not present in standard header.
 */
export const validPayloadClaims = (payload: any): any => {
  // listed claims in SEP001 standard spec.
  const claims = [payload?.s, payload?.d, payload?.t]
  // We need to be sure that every nested claims CID exists in payload.
  if (!claims.every((c) => c !== undefined)) {
    throw new TypeError('Unexpected payload: The claims "s", "t" or "d" are not present in payload.')
  }

  return payload
}

/**
 * Calculates the fingerprint from a JSON Web Key (JWK).
 *
 * @param jwk - The JWK object for which to calculate the fingerprint.
 * @returns The fingerprint of the JWK as a hexadecimal string.
 * @throws {Error} If the JSON Web Key is not valid.
 */
export const fingerprintFromJWK = async (jwk: JWK): Promise<string> => {
  const b64Thumbprint = await calculateJwkThumbprint(jwk)
  // convert the base64 thumbprint to a hexadecimal string
  return Buffer.from(b64Thumbprint, 'base64').toString('hex')
}
