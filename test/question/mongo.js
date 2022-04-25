var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "test": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": []
          }
        ]
      },
      "undefined": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "question-answers"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "undefined.question-answers",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "question-answers",
            "documents": [
              {
                "a": "2",
                "_id": ObjectID("6266226b44bdc13230d1257b")
              }
            ]
          }
        ]
      }
    }
  }
}