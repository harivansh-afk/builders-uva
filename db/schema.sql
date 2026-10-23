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

-- One row per (person, event), independent of membership. The question is stored with the answer so
-- it stays readable after the question in src/lib/events.js changes.
create table if not exists event_responses (
  id          bigint generated always as identity primary key,
  email       text not null,
  event_slug  text not null,
  question    text,
  answer      text,
  created_at  timestamptz not null default now(),
  unique (email, event_slug)
);

-- Grandfather existing signups once; all subsequent applicants start pending.
alter table members add column if not exists status text not null default 'approved'
  check (status in ('pending', 'approved', 'declined'));
alter table members alter column status set default 'pending';

-- Keep existing RSVPs while allowing registration without an application.
alter table event_responses add column if not exists full_name text;
alter table event_responses drop constraint if exists event_responses_email_fkey;
update event_responses r set full_name = m.full_name
  from members m where r.email = m.email and r.full_name is null and m.full_name is not null;

-- The interest form no longer asks the technical or founder questions; earlier
-- answers stay. LinkedIn is required by the form; older rows have none.
alter table members alter column technical drop not null;
alter table members alter column founded drop not null;
alter table members add column if not exists linkedin text;

-- Required for new registrations; older RSVPs have no submitted question.
alter table event_responses add column if not exists speaker_question text;
