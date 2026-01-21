export interface Database {
    public: {
        Tables: {
            waitlist: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
