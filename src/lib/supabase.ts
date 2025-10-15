// Mock Supabase client for local development
export const supabase = {
  from: (table: string) => ({
    select: async (columns?: string) => ({ 
      data: [], 
      error: null 
    }),
    insert: async (data: any) => ({ 
      data: [{ id: Math.random().toString(36).substr(2, 9), ...data }], 
      error: null 
    }),
    update: async (data: any) => ({ 
      data: [data], 
      error: null 
    }),
    delete: async () => ({ 
      data: [], 
      error: null 
    }),
    eq: function(column: string, value: any) { return this; },
    neq: function(column: string, value: any) { return this; },
    gt: function(column: string, value: any) { return this; },
    gte: function(column: string, value: any) { return this; },
    lt: function(column: string, value: any) { return this; },
    lte: function(column: string, value: any) { return this; },
    like: function(column: string, value: any) { return this; },
    ilike: function(column: string, value: any) { return this; },
    is: function(column: string, value: any) { return this; },
    in: function(column: string, values: any[]) { return this; },
    contains: function(column: string, value: any) { return this; },
    containedBy: function(column: string, value: any) { return this; },
    rangeGt: function(column: string, value: any) { return this; },
    rangeGte: function(column: string, value: any) { return this; },
    rangeLt: function(column: string, value: any) { return this; },
    rangeLte: function(column: string, value: any) { return this; },
    rangeAdjacent: function(column: string, value: any) { return this; },
    overlaps: function(column: string, value: any) { return this; },
    textSearch: function(column: string, query: string) { return this; },
    match: function(query: Record<string, any>) { return this; },
    not: function(column: string, operator: string, value: any) { return this; },
    or: function(filters: string) { return this; },
    filter: function(column: string, operator: string, value: any) { return this; },
    order: function(column: string, options?: { ascending?: boolean }) { return this; },
    limit: function(count: number) { return this; },
    range: function(from: number, to: number) { return this; },
    single: function() { return this; },
    maybeSingle: function() { return this; }
  }),
  auth: {
    signIn: async (credentials: any) => ({ 
      user: { 
        id: 'mock-user-id',
        email: credentials.email || 'mock@example.com',
        user_metadata: { name: 'Mock User' }
      }, 
      error: null 
    }),
    signUp: async (credentials: any) => ({ 
      user: { 
        id: 'mock-user-id',
        email: credentials.email,
        user_metadata: credentials.options?.data || {}
      }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ 
      data: { 
        user: { 
          id: 'mock-user-id',
          email: 'mock@example.com',
          user_metadata: { name: 'Mock User' }
        } 
      }, 
      error: null 
    }),
    getSession: async () => ({ 
      data: { 
        session: { 
          user: { 
            id: 'mock-user-id',
            email: 'mock@example.com'
          },
          access_token: 'mock-token'
        } 
      }, 
      error: null 
    }),
    onAuthStateChange: (callback: Function) => {
      // Mock auth state change
      setTimeout(() => {
        callback('SIGNED_IN', {
          user: { 
            id: 'mock-user-id',
            email: 'mock@example.com'
          }
        });
      }, 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  channel: (name: string) => ({
    on: (event: string, callback: Function) => ({ subscribe: () => {} }),
    subscribe: () => {},
    unsubscribe: () => {}
  }),
  realtime: {
    channel: (name: string) => ({
      on: (event: string, callback: Function) => ({ subscribe: () => {} }),
      subscribe: () => {},
      unsubscribe: () => {}
    })
  }
};

export default supabase;