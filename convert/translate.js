// Load packages
var validator = require('is-my-json-valid');
var empty = require('json-schema-empty').default;

// Load json data (will eventually be implemented as APIs)
const schema = require('./study-metadata-schema.json');
const dataverse = require('./dataverse_example.json');

// create template and begin extracting data
var template = empty(schema);
var heal = dataverse.data.metadataBlocks.heal.fields;
var citation = dataverse.data.metadataBlocks.citation.fields;

// cycle through two levels and assign values into the empty template
for (var i=0; i<heal.length; i++) {
  var toplevel = heal[i]["typeName"];
  // had to name the field as heal_citation due to a limitation of dataverse
  // we change it back here
  if (toplevel=="heal_citation") {
    toplevel = "citation";
  }

  var sublevel = heal[i]["value"];
  // need to extract into a simple name:var format
  for (let key in sublevel) {
    sublevel[key] = sublevel[key]["value"];
  }

  // commit back to empty template based on "typeName"
  template[toplevel] = sublevel;
}

// data that got merged into standard dataverse categories
// requires manual handling
var citation_map = new Object;
for (var i=0; i<citation.length; i++) {
  citation_map[citation[i]["typeName"]] = citation[i]["value"];
}
template.minimal_info["study_name"] = citation_map.title;
template.minimal_info["study_description"] = citation_map.dsDescription[0]["dsDescriptionValue"]["value"];
templatecitation_map.author[0]["authorName"]["value"]
