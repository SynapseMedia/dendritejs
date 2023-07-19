# Requirements Document - Dendrite

## Introduction

Dendrite is a tool designed for the retrieval and validation of the SEP-001 standard. Its main goal is to provide a user-friendly and easy-to-use interface to interact with the standard.

## Technical Requirements

1. Initialization of the library with the CID corresponding to the standard:
   - The tool should allow the initialization of the library by providing the CID corresponding to the SEP-001 standard.

2. Retrieval of the CID from the IPFS network:
   - The tool should be capable of retrieving the CID from the IPFS network using the DAG or Block services.

3. Determination of the serialization type using the multiformat codec:
   - The tool should be capable of determining the serialization type (e.g., dag-jose, raw) using the multiformat codec.

4. Implementation of modules for each serialization type:
   - For each serialization type, a module should be implemented, each one implementing an interface (e.g., "Serialization", "Codec", etc.).
   - The interface should specify methods/properties that facilitate the navigation through the content of the "claims" in the SEP-001 standard.
   - Each module should be capable of validating the schema of the SEP-001 standard, including the "claims", data types, etc.
   - Each module should be capable of validating the signature in the serialization format. If the token does not contain a signature, it should be considered invalid.
   - If a public key is not detected in the serialization, the validation method should require passing the public key as a parameter.

5. Client interface based on serialization and deserialization results:
   - A client interface should be implemented to provide a user-friendly and easy-to-use interface.
   - The client interface should be based on the detected serialization and the results obtained from the deserialization process.

## Expected Deliverables

- The library should be compatible with browser and node.
- Clean and well-documented source code in TypeScript and Node.js (github repo).
- Technical documentation describing the architecture and functionality of the tool, including details on the implementation of SEP-001 and any integration with Multiformats and IPFS.
- Unit and integration tests demonstrating the functionality and validity of the tool.

## References

- [Multiformats JS Library](https://github.com/multiformats/js-multiformats)
- [DAG Service Documentation](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/DAG.md)
- [Block Service Documentation](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/BLOCK.md)

This requirements document defines the key technical aspects of the Dendrite tool, providing a guide for the development and implementation of the software. \
