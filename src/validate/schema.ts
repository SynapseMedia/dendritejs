export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SEP-001 schema',
  type: 'object',
  required: [
    'header',
    'payload'
  ],
  properties: {
    header: {
      $ref: '#/definitions/Header'
    },
    payload: {
      $ref: '#/definitions/Payload'
    }
  },
  definitions: {
    JWK: {
      additionalProperties: {},
      description: 'JSON Web Key ( {@link  https://www.rfc-editor.org/rfc/rfc7517 JWK } ). "RSA", "EC", "OKP", and "oct" key types are supported.',
      properties: {
        alg: {
          description: 'JWK "alg" (Algorithm) Parameter.',
          type: 'string'
        },
        crv: {
          type: 'string'
        },
        kty: {
          description: 'JWK "kty" (Key Type) Parameter.',
          type: 'string'
        },
        use: {
          description: 'JWK "use" (Public Key Use) Parameter.',
          type: 'string'
        },
        x: {
          type: 'string'
        },
        y: {
          type: 'string'
        }
      },
      required: [
        'x',
        'y',
        'alg',
        'kty',
        'use',
        'crv'
      ],
      type: 'object'
    },
    Descriptive: {
      additionalProperties: true,
      description: 'Descriptive metadata MUST represent information that describes the content of a multimedia resource.',
      properties: {
        description: {
          type: 'string'
        },
        title: {
          type: 'string'
        }
      },
      required: [
        'title',
        'description'
      ],
      type: 'object'
    },
    Header: {
      additionalProperties: false,
      description: 'SEP-001 header  representation.',
      properties: {
        jwk: {
          $ref: '#/definitions/JWK'
        },
        typ: {
          type: 'string'
        },
        alg: {
          type: 'string'
        }
      },
      required: [
        'typ',
        'jwk',
        'alg'
      ],
      type: 'object'
    },
    Payload: {
      additionalProperties: false,
      description: 'SEP-001 payload representation.',
      properties: {
        d: {
          $ref: '#/definitions/Descriptive'
        },
        s: {
          $ref: '#/definitions/Structural'
        },
        t: {
          $ref: '#/definitions/Technical'
        }
      },
      required: [
        'd',
        's',
        't'
      ],
      type: 'object'
    },
    Structural: {
      additionalProperties: false,
      description: 'Structural metadata MUST represent information that describes the internal structure of a multimedia resource.',
      properties: {
        cid: {
          type: 'string'
        },
        path: {
          type: 'string'
        }
      },
      required: [
        'cid'
      ],
      type: 'object'
    },
    Technical: {
      additionalProperties: true,
      description: 'Technical metadata MUST represent information that describes the technical characteristics of a multimedia resource.',
      properties: {
        height: {
          type: 'number'
        },
        length: {
          type: 'number'
        },
        size: {
          type: 'number'
        },
        width: {
          type: 'number'
        }
      },
      type: 'object'
    }
  }
}
