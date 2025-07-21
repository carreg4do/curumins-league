export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string | null
          category: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url?: string | null
          category?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          category?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          tournament_id: string | null
          team_a_id: string | null
          team_b_id: string | null
          team_a_score: number | null
          team_b_score: number | null
          status: string
          match_type: string
          map: string | null
          scheduled_at: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          tournament_id?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          team_a_score?: number | null
          team_b_score?: number | null
          status: string
          match_type: string
          map?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          tournament_id?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          team_a_score?: number | null
          team_b_score?: number | null
          status?: string
          match_type?: string
          map?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      matchmaking_queue: {
        Row: {
          id: string
          user_id: string
          game_mode: string
          map_preference: string | null
          status: string
          queue_start: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          game_mode: string
          map_preference?: string | null
          status: string
          queue_start?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          game_mode?: string
          map_preference?: string | null
          status?: string
          queue_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      player_match_stats: {
        Row: {
          id: string
          match_id: string
          user_id: string
          team_id: string | null
          kills: number | null
          deaths: number | null
          assists: number | null
          headshots: number | null
          mvps: number | null
          score: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          user_id: string
          team_id?: string | null
          kills?: number | null
          deaths?: number | null
          assists?: number | null
          headshots?: number | null
          mvps?: number | null
          score?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string
          team_id?: string | null
          kills?: number | null
          deaths?: number | null
          assists?: number | null
          headshots?: number | null
          mvps?: number | null
          score?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_stats_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_stats_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_stats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_requests: {
        Row: {
          id: string
          team_id: string
          user_id: string
          status: string
          message: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          status: string
          message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          status?: string
          message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_requests_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          tag: string
          logo_url: string | null
          cover_url: string | null
          description: string | null
          elo: number | null
          wins: number | null
          losses: number | null
          region: string | null
          is_recruiting: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          tag: string
          logo_url?: string | null
          cover_url?: string | null
          description?: string | null
          elo?: number | null
          wins?: number | null
          losses?: number | null
          region?: string | null
          is_recruiting?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          tag?: string
          logo_url?: string | null
          cover_url?: string | null
          description?: string | null
          elo?: number | null
          wins?: number | null
          losses?: number | null
          region?: string | null
          is_recruiting?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          id: string
          tournament_id: string
          team_id: string
          status: string
          registered_at: string | null
        }
        Insert: {
          id?: string
          tournament_id: string
          team_id: string
          status: string
          registered_at?: string | null
        }
        Update: {
          id?: string
          tournament_id?: string
          team_id?: string
          status?: string
          registered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          prize: string | null
          status: string
          max_teams: number | null
          registration_start: string | null
          registration_end: string | null
          tournament_start: string | null
          tournament_end: string | null
          game_mode: string | null
          maps: string[] | null
          rules: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          prize?: string | null
          status: string
          max_teams?: number | null
          registration_start?: string | null
          registration_end?: string | null
          tournament_start?: string | null
          tournament_end?: string | null
          game_mode?: string | null
          maps?: string[] | null
          rules?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          prize?: string | null
          status?: string
          max_teams?: number | null
          registration_start?: string | null
          registration_end?: string | null
          tournament_start?: string | null
          tournament_end?: string | null
          game_mode?: string | null
          maps?: string[] | null
          rules?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          steam_id: string | null
          nickname: string
          avatar_url: string | null
          profile_cover_url: string | null
          city: string | null
          elo: number | null
          elo_points: number | null
          rank: number | null
          team_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_id?: string | null
          steam_id?: string | null
          nickname: string
          avatar_url?: string | null
          profile_cover_url?: string | null
          city?: string | null
          elo?: number | null
          elo_points?: number | null
          rank?: number | null
          team_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string | null
          steam_id?: string | null
          nickname?: string
          avatar_url?: string | null
          profile_cover_url?: string | null
          city?: string | null
          elo?: number | null
          elo_points?: number | null
          rank?: number | null
          team_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_auth_id_fkey"
            columns: ["auth_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
