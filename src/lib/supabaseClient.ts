// Mock Supabase client for development

// This is a simplified mock of the Supabase client
// In a real application, you would use the actual Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string) => {
      // Return empty data for now, the sample data is hardcoded in index.tsx
      return Promise.resolve({ data: [], error: null });
    }
  }),
  channel: (name: string) => ({
    on: (event: string, config: any, callback: Function) => ({
      on: (event: string, config: any, callback: Function) => ({
        subscribe: () => {}
      })
    }),
    subscribe: () => {}
  })
};