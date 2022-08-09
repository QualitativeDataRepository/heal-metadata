// Load packages
var empty = require('json-schema-empty').default;

// Load json data (will eventually be implemented as APIs)
const schema = require('./study-metadata-schema.json');
const dataverse = require('./dataverse_example.json');

// create template and begin extracting data
var template = empty(schema);
var heal = dataverse.data.latestVersion.metadataBlocks.heal.fields;
var citation = dataverse.data.latestVersion.metadataBlocks.citation.fields;

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

template.citation.heal_funded_status = (template.citation.heal_funded_status == 1);
template.citation.study_collection_status = (template.citation.study_collection_status == 1);
template.data_availability.produce_data = (template.data_availability.produce_data == 1);

// data that got merged into standard dataverse categories
// requires manual handling
var citation_map = new Object;
for (var i=0; i<citation.length; i++) {
  citation_map[citation[i]["typeName"]] = citation[i]["value"];
}

template.minimal_info["study_name"] = citation_map.title;
template.minimal_info["study_description"] = citation_map.dsDescription[0]["dsDescriptionValue"]["value"];

template['contacts_and_registrants']['contacts'] = [];
for (var i=0; i<citation_map.datasetContact.length; i++) {
  contact_name = citation_map.datasetContact[i]['datasetContactName']['value'].split(", ");
  template['contacts_and_registrants']['contacts'].push( {
    contact_first_name: contact_name[1],
    contact_last_name: contact_name[0],
    //contact_affiliation: citation_map.datasetContact[i]['datasetContactAffiliation']['value'],
    contact_email: citation_map.datasetContact[i]['datasetContactEmail']['value']
  });
}

template.citation['investigators'] = [];
for (var i=0; i<citation_map.author.length; i++) {
  // investigator ID is not necessarily specified
  try {
  investigator_ID = [{
    investigator_ID_type: citation_map.author[0]['authorIdentifierScheme']['value'],
    investigator_ID_value: citation_map.author[0]['authorIdentifier']['value']
  }];
  } catch(e) {
    investigator_ID = [];
  }
  author_name = citation_map.author[i]['authorName']['value'].split(", ")
  template.citation['investigators'].push( {
    investigator_first_name: author_name[1],
    investigator_last_name: author_name[0],
    investigator_affiliation: citation_map.author[i]['authorAffiliation']['value'],
    investigator_ID: investigator_ID
  });
}

if (typeof(citation_map.dateOfCollection) !== 'undefined') {
  template.data_availability.data_collection_start_date = citation_map.dateOfCollection[0]['dateOfCollectionStart']['value'];
  template.data_availability.data_collection_finish_date = citation_map.dateOfCollection[0]['dateOfCollectionEnd']['value'];
}

// needs to be formatted as an array (with funder name as an another array)
if (typeof(citation_map.grantNumber) !== 'undefined') {
  template.citation['funding'] = [ {
    funder_name: [ citation_map.grantNumber[0]['grantNumberAgency']['value'] ],
    funding_award_ID: citation_map.grantNumber[0]['grantNumberValue']['value']
  } ];
}

// strings to integers as necessary
if (typeof(template.data.subject_data_unit_of_collection_expected_number) !== 'undefined') {
  template.data.subject_data_unit_of_collection_expected_number = Number(template.data.subject_data_unit_of_collection_expected_number);
}

if (typeof(template.data.subject_data_unit_of_analysis_expected_number) !== 'undefined') {
  template.data.subject_data_unit_of_analysis_expected_number = Number(template.data.subject_data_unit_of_analysis_expected_number)
}

if (typeof(template.citation.study_collections) !== 'undefined') {
  template.citation.study_collections = [ template.citation.study_collections ]
}

//templatecitation_map.author[0]["authorName"]["value"]

// Validate against the schema again to quality check output
var Validator = require('jsonschema').Validator;
var v = new Validator();
valid = v.validate(template, schema)

if (valid.valid) {
// write output to a file
const fs = require('fs');
const output = JSON.stringify(template, null, 4);
fs.writeFile('output.json', output, (err) => {
  if (err) {
    throw(err)
  }
  console.log("Output written to: output.json");
});
}
