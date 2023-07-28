# Dendrite

Dendrite is a tool designed for the retrieval and validation of the SEP-001 standard. Its main goal is to provide a user-friendly and easy-to-use interface to interact with the standard.

## Key features

* Fetches metadata from the Meta Lake (IPFS).
* Automatically detects the serialization format of the metadata and applies the appropriate strategy to fetch and decode it.
* Validates the metadata's signature to ensure its authenticity and integrity.
* Verifies that the retrieved metadata adheres to the defined schema, ensuring its correctness and compliance with standards.
* Provides a standardized interface for interacting with the metadata, allowing users to:
  * Validate the fingerprint of the metadata.
  * Determine the type of multimedia represented by the metadata.
  * Handle and manage the results of the payload recovered from the metadata.

## Install

Dendrite is available as a NPM package.

`npm install dendritejs`


## Usage

```typescript
import {create} from 'ipfs-core'
import dendrite from 'dendritejs'

const node = await create()
const decoder = dendrite(node)

const dagJose = 'bagcqcerann63enqn2vssm6gko624gojakrswyppm56rao7m6e6vfnvtcxzha'
const decoded = await decoder(dagJose)

// ... 
const mediaType = decoded.type() 
const payload = decoded.metadata() 

// fingerprint verification with shared fingerprint
const expectedFingerprint = 'aba44a9673c452de6183c82919de2cdb8b830615e9ac684841502ba7173ee00a'
const validFingerprint = decoded.validate(expectedFingerprint)

```
## References

* [Multiformats JS Library](https://github.com/multiformats/js-multiformats)
* [DAG Service Documentation](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/DAG.md)
* [Block Service Documentation](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/BLOCK.md)
