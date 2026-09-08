-- Run once as the database owner. Set the role's password separately using
-- a securely generated value; put its connection URL in ADMIN_DATABASE_URL.
-- Do not reuse the owner's DATABASE_URL for the dashboard.
create role builders_admin_reader login;
grant connect on database neondb to builders_admin_reader;
grant usage on schema public to builders_admin_reader;
grant select on public.members, public.event_responses to builders_admin_reader;
alter role builders_admin_reader set default_transaction_read_only = on;
