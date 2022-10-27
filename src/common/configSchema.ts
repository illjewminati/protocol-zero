import { Schema } from 'jsonschema';

export const configSchema: Schema = {
    id: '/configSchema',
    properties: {
        tokens: { type: 'array', items: { $ref: '/tokenMetaDataSchema' } },
    },
    required: ['tokens'],
    type: 'object',
};

export const schemas: Schema[] = [
    {
        id: '/wholeNumberSchema',
        anyOf: [
            {
                type: 'string',
                pattern: '^\\d+$',
            },
            {
                type: 'integer',
            },
        ],
    },

    {
        id: '/tokenMetaDataSchema',
        properties: {
            symbol: { type: 'string' },
            name: { type: 'string' },
            icon: { type: 'string' },
            primaryColor: { type: 'string' },
            decimals: { $ref: '/wholeNumberSchema' },
            displayDecimals: { $ref: '/wholeNumberSchema' },
        },
        required: ['decimals', 'symbol', 'name', 'addresses'],
        type: 'object',
    },

    {
        id: '/configSchema',
        properties: {
            tokens: { type: 'array', items: { $ref: '/tokenMetaDataSchema' } },
        },
        required: ['tokens'],
        type: 'object',
    },
];
