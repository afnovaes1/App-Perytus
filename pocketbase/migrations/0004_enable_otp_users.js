migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    col.otp.enabled = true
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    col.otp.enabled = false
    app.save(col)
  },
)
