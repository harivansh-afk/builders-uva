-- Run as the owner after schema.sql, before deploying application review.
-- Keep the dashboard role limited to reading and updating review columns.
grant update (status, updated_at) on public.members to builders_admin_reader;
alter role builders_admin_reader set default_transaction_read_only = off;
