// Écrit à la main d'après supabase/migrations/. À terme, remplacer par :
// npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
// (cette commande écrasera ce fichier avec la version exacte générée depuis
// le vrai projet Supabase — c'est prévu et souhaitable une fois connecté).
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PaymentMethod = "cod" | "konnect";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

// Types Row nommés localement (pas de self-référence à travers Database,
// qui empêchait supabase-js d'inférer correctement les types Insert/Update).

type FamilyRow = {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string | null;
  name_ar: string | null;
  position: number;
};

type CategoryRow = {
  id: string;
  slug: string;
  family_id: string;
  name_fr: string;
  name_en: string | null;
  name_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  description_ar: string | null;
  image_r2_key: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string | null;
  name_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  description_ar: string | null;
  price_tnd: number;
  compare_at_price_tnd: number | null;
  category_id: string | null;
  gender: "femme" | "homme" | "mixte";
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  weight_grams: number | null;
  created_at: string;
};

type ProductImageRow = {
  id: string;
  product_id: string;
  r2_key: string;
  alt_fr: string | null;
  alt_en: string | null;
  alt_ar: string | null;
  position: number;
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price_delta: number;
  stock_quantity: number;
};

type AttributeRow = {
  id: string;
  type: "matiere" | "couleur";
  slug: string;
  name_fr: string;
  name_en: string | null;
  name_ar: string | null;
  position: number;
};

type ProductAttributeRow = { product_id: string; attribute_id: string };

type CollectionRow = {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string | null;
  name_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  description_ar: string | null;
  image_r2_key: string | null;
  is_active: boolean;
  position: number;
  created_at: string;
};

type ProductCollectionRow = { product_id: string; collection_id: string };

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  default_shipping_address: string | null;
  default_city: string | null;
  default_governorate: string | null;
  role: "customer" | "admin";
  created_at: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  governorate: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  konnect_payment_ref: string | null;
  user_id: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  quantity: number;
  unit_price_at_purchase: number;
  product_name_snapshot: string;
};

type OrderStatusHistoryRow = {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_at: string;
};

type ReviewRow = {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  photo_r2_keys: string[];
  is_approved: boolean;
  created_at: string;
};

type NewsletterSubscriberRow = {
  id: string;
  email: string;
  source: string | null;
  discount_code: string | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      families: {
        Row: FamilyRow;
        Insert: Partial<FamilyRow> & { slug: string; name_fr: string };
        Update: Partial<FamilyRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & {
          slug: string;
          family_id: string;
          name_fr: string;
        };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & {
          slug: string;
          name_fr: string;
          price_tnd: number;
        };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImageRow;
        Insert: Partial<ProductImageRow> & { product_id: string; r2_key: string };
        Update: Partial<ProductImageRow>;
        Relationships: [];
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: Partial<ProductVariantRow> & { product_id: string; name: string };
        Update: Partial<ProductVariantRow>;
        Relationships: [];
      };
      attributes: {
        Row: AttributeRow;
        Insert: Partial<AttributeRow> & {
          type: "matiere" | "couleur";
          slug: string;
          name_fr: string;
        };
        Update: Partial<AttributeRow>;
        Relationships: [];
      };
      product_attributes: {
        Row: ProductAttributeRow;
        Insert: ProductAttributeRow;
        Update: Partial<ProductAttributeRow>;
        Relationships: [];
      };
      collections: {
        Row: CollectionRow;
        Insert: Partial<CollectionRow> & { slug: string; name_fr: string };
        Update: Partial<CollectionRow>;
        Relationships: [];
      };
      product_collections: {
        Row: ProductCollectionRow;
        Insert: ProductCollectionRow;
        Update: Partial<ProductCollectionRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> & {
          customer_name: string;
          customer_phone: string;
          shipping_address: string;
          city: string;
          governorate: string;
          subtotal: number;
          total: number;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Partial<OrderItemRow> & {
          order_id: string;
          quantity: number;
          unit_price_at_purchase: number;
          product_name_snapshot: string;
        };
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      order_status_history: {
        Row: OrderStatusHistoryRow;
        Insert: Partial<OrderStatusHistoryRow> & {
          order_id: string;
          status: OrderStatus;
        };
        Update: Partial<OrderStatusHistoryRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow> & {
          product_id: string;
          customer_name: string;
          rating: number;
        };
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: Partial<NewsletterSubscriberRow> & { email: string };
        Update: Partial<NewsletterSubscriberRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      order_status: OrderStatus;
    };
  };
}
