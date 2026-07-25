-- Extensions et types énumérés partagés par le reste du schéma.

create extension if not exists "pgcrypto"; -- gen_random_uuid()

create type payment_method as enum ('cod', 'konnect');

create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create type order_status as enum (
  'pending_confirmation', -- en attente de confirmation (SMS/appel)
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);
