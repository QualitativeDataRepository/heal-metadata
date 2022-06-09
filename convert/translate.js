var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var validator = require('is-my-json-valid')

var schema_url;
var url = "https://data.stage.qdr.org/api/datasets/:persistentId/versions/:draft?persistentId=";
var pid = "";
var token = "";

var metadata;
var getJSON = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    //xhr.setRequestHeader('X-Dataverse-Key', a_token);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        metadata = JSON.parse(xhr.responseText);
      } else {
        console.log('Something went wrong: ' + xhr.status);
      }
    };
    xhr.send();
};

getJSON(url + pid, token)

heal = metadata.data.metadataBlocks.heal.fields

//for (let i=0, l=heal.length; i<l; i++) {

//}

var empty = require('json-schema-empty').default;
getJSON("https://raw.githubusercontent.com/HEAL/heal-metadata-schemas/main/study-level-metadata-schema/schema-clean/json/study-metadata-schema.json")
empty(metadata)
