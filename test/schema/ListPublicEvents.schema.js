const listPublicEventsSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'number',
      enum: [200]
    },

    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          actor: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              login: { type: 'string' },
              display_login: { type: 'string' },
              gravatar_id: { type: 'string' },
              url: { type: 'string' },
              avatar_url: { type: 'string' }
            }
          },
          repo: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              url: { type: 'string' }
            }
          },
          payload: {
            type: 'object',
            properties: {
              push_id: { type: 'number' },
              size: { type: 'number' },
              distinct_size: { type: 'number' },
              ref: { type: 'string' },
              head: { type: 'string' },
              before: { type: 'string' },
              commits: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sha: { type: 'string' },
                    author: {
                      type: 'object',
                      properties: {
                        email: 'string',
                        name: 'string'
                      }
                    },
                    message: { type: 'string' },
                    distinct: { type: 'boolean' },
                    url: { type: 'string' }
                  }
                }
              }
            }
          },
          public: { type: 'boolean' },
          created_at: { type: 'string' },
          org: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              login: { type: 'string' },
              gravatar_id: { type: 'string' },
              url: { type: 'string' },
              avatar_url: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
