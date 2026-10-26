import { createRequire } from 'node:module'
const require = createRequire(`${process.env.QA_DEPENDENCIES}/package.json`)
const { default: EmbeddedPostgres } = await import(require.resolve('embedded-postgres'))
const db = new EmbeddedPostgres({
  databaseDir: '/tmp/builders-calendar-qa/pgdata', user: 'calendar_qa',
  password: 'local-calendar-test', port: 55439, persistent: true,
  postgresFlags: ['-h', '127.0.0.1'],
})
await db.initialise()
await db.start()
const client = db.getPgClient()
await client.connect()
if (!(await client.query("select 1 from pg_database where datname='calendar_qa'")).rowCount) await db.createDatabase('calendar_qa')
await client.end()
console.log('QA_DATABASE_READY')
process.on('SIGINT', async () => { await db.stop(); process.exit(0) })
setInterval(() => {}, 60000)
