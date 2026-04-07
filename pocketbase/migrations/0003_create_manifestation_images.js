migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const reportsCol = app.findCollectionByNameOrId('reports')

    const collection = new Collection({
      name: 'manifestation_images',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'report_id',
          type: 'relation',
          required: true,
          collectionId: reportsCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'manifestation_id', type: 'text', required: true },
        {
          name: 'file',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_manifestation_images_report ON manifestation_images (report_id)'],
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('manifestation_images')
    app.delete(collection)
  },
)
