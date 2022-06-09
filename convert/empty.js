var request = require('request');
request('https://raw.githubusercontent.com/HEAL/heal-metadata-schemas/main/study-level-metadata-schema/schema-clean/json/study-metadata-schema.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
    }
})
