-- builders@uva membership. Applied automatically by api/join.js on first
-- request (CREATE ... IF NOT EXISTS), kept here so the shape is reviewable.

-- One row per person, keyed by UVA email. Re-submitting updates the row.
create table if not exists members (
  email       text primary key,
  year        text not null,
  technical   boolean not null,
  founded     boolean not null,
  website     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Existing members have no name until they submit the updated form.
alter table members add column if not exists full_name text;

-- One row per (person, event). The question is stored with the answer so
-- it stays readable after the question in src/lib/events.js changes.
create table if not exists event_responses (
  id          bigint generated always as identity primary key,
  email       text not null references members(email) on delete cascade,
  event_slug  text not null,
  question    text,
  answer      text,
  created_at  timestamptz not null default now(),
  unique (email, event_slug)
);
