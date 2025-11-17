export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      coupons: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          descuento_porcentaje: number | null
          id: number
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          descuento_porcentaje?: number | null
          id?: number
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          descuento_porcentaje?: number | null
          id?: number
        }
        Relationships: []
      }
      dish_ingredients: {
        Row: {
          dish_id: number | null
          id: number
          incluido: boolean | null
          ingredient_id: number | null
        }
        Insert: {
          dish_id?: number | null
          id?: number
          incluido?: boolean | null
          ingredient_id?: number | null
        }
        Update: {
          dish_id?: number | null
          id?: number
          incluido?: boolean | null
          ingredient_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          id: number
          imagen_url: string | null
          nombre: string
          precio: number
          tipo: Database["public"]["Enums"]["dish_type"]
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          imagen_url?: string | null
          nombre: string
          precio: number
          tipo: Database["public"]["Enums"]["dish_type"]
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          imagen_url?: string | null
          nombre?: string
          precio?: number
          tipo?: Database["public"]["Enums"]["dish_type"]
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          disponible: boolean | null
          id: number
          nombre: string
          precio_extra: number | null
        }
        Insert: {
          disponible?: boolean | null
          id?: number
          nombre: string
          precio_extra?: number | null
        }
        Update: {
          disponible?: boolean | null
          id?: number
          nombre?: string
          precio_extra?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          cantidad: number
          dish_id: number
          id: number
          order_id: number
          personalizaciones: Json | null
          precio_unitario: number
        }
        Insert: {
          cantidad?: number
          dish_id: number
          id?: number
          order_id: number
          personalizaciones?: Json | null
          precio_unitario: number
        }
        Update: {
          cantidad?: number
          dish_id?: number
          id?: number
          order_id?: number
          personalizaciones?: Json | null
          precio_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          cupon_id: number | null
          direccion_entrega: string | null
          estado: Database["public"]["Enums"]["order_status"] | null
          fecha: string | null
          id: number
          numero_mesa: number | null
          numero_orden: string
          qr_code: string | null
          tipo_entrega: Database["public"]["Enums"]["order_type"] | null
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cupon_id?: number | null
          direccion_entrega?: string | null
          estado?: Database["public"]["Enums"]["order_status"] | null
          fecha?: string | null
          id?: number
          numero_mesa?: number | null
          numero_orden: string
          qr_code?: string | null
          tipo_entrega?: Database["public"]["Enums"]["order_type"] | null
          total: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          cupon_id?: number | null
          direccion_entrega?: string | null
          estado?: Database["public"]["Enums"]["order_status"] | null
          fecha?: string | null
          id?: number
          numero_mesa?: number | null
          numero_orden?: string
          qr_code?: string | null
          tipo_entrega?: Database["public"]["Enums"]["order_type"] | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_cupon_id_fkey"
            columns: ["cupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string
          created_at: string | null
          id: string
          nombre: string
        }
        Insert: {
          apellido: string
          created_at?: string | null
          id: string
          nombre: string
        }
        Update: {
          apellido?: string
          created_at?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      dish_type: "principal" | "combo" | "postre" | "bebida"
      order_status: "pendiente" | "aceptado" | "en_camino" | "entregado"
      order_type: "delivery" | "takeaway" | "dine_in"
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
    Enums: {
      app_role: ["admin", "customer"],
      dish_type: ["principal", "combo", "postre", "bebida"],
      order_status: ["pendiente", "aceptado", "en_camino", "entregado"],
      order_type: ["delivery", "takeaway", "dine_in"],
    },
  },
} as const
