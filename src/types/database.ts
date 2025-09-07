export interface Profile {
  id: string
  full_name?: string
  plan: 'free' | 'plus'
  plan_expires_at?: string
  daily_limit?: number
  usage_count?: number
  usage_date?: string
  created_at: string
  updated_at?: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
}

export type UserPlan = 'free' | 'plus'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
    }
  }
}
