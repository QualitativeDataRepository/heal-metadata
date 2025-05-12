# heal-metadata
HEAL metadata for dataverse

This is a metadata block for dataverse that implements support for NIH HEAL metadata. By default, it is only available for the collection with the alias "heal" (and not at the root). (This is easily changed in the second line.)

This was converted by hand from the JSON-format heal metadata schema at https://github.com/HEAL/heal-metadata-schemas/blob/main/study-level-metadata-schema/schema-clean/json/study-metadata-schema.json

Most, but not all fields are included in the `heal_block.tsv` file. Redundant fields with the default dataverse citation block are listed in the `map_existing_fields.csv` file.
