migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    try {
      app.findAuthRecordByEmail('users', 'af.novaes@terra.com.br')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('af.novaes@terra.com.br')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'af.novaes@terra.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
