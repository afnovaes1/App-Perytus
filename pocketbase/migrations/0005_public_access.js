migrate(
  (app) => {
    const reports = app.findCollectionByNameOrId('reports')
    reports.listRule = ''
    reports.viewRule = ''
    reports.createRule = ''
    reports.updateRule = ''
    reports.deleteRule = ''

    const rUserId = reports.fields.getByName('user_id')
    if (rUserId) rUserId.required = false
    app.save(reports)

    const images = app.findCollectionByNameOrId('manifestation_images')
    images.listRule = ''
    images.viewRule = ''
    images.createRule = ''
    images.updateRule = ''
    images.deleteRule = ''

    const iUserId = images.fields.getByName('user_id')
    if (iUserId) iUserId.required = false
    app.save(images)
  },
  (app) => {
    const reports = app.findCollectionByNameOrId('reports')
    reports.listRule = "@request.auth.id != '' && user_id = @request.auth.id"
    reports.viewRule = "@request.auth.id != '' && user_id = @request.auth.id"
    reports.createRule = "@request.auth.id != ''"
    reports.updateRule = "@request.auth.id != '' && user_id = @request.auth.id"
    reports.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id"

    const rUserId = reports.fields.getByName('user_id')
    if (rUserId) rUserId.required = true
    app.save(reports)

    const images = app.findCollectionByNameOrId('manifestation_images')
    images.listRule = "@request.auth.id != '' && user_id = @request.auth.id"
    images.viewRule = "@request.auth.id != '' && user_id = @request.auth.id"
    images.createRule = "@request.auth.id != ''"
    images.updateRule = "@request.auth.id != '' && user_id = @request.auth.id"
    images.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id"

    const iUserId = images.fields.getByName('user_id')
    if (iUserId) iUserId.required = true
    app.save(images)
  },
)
