# This program takes a JSON schema as input and outputs the limited text values.
# This is used to populate the controlledVocabulary section of a dataverse tsv file
#

library(rjson)
library(dplyr)
library(tidyr)
library(purrr)

schema <- fromJSON(file="study-metadata-schema.json")

schema <- schema$properties

terms <- tibble(name=names(schema), properties=schema) %>%
  unnest_wider(properties) %>% unnest_longer(properties) %>%
  unnest_wider(properties, names_repair="universal")

vocab <- terms %>% select(name, properties_id, items) %>%
  unnest_wider(items) %>%
  select(properties_id, enum) %>% unnest_longer(enum) %>%
  filter(!is.na(enum))

vocab <- terms %>% select(properties_id, enum) %>% unnest_longer(enum) %>%
  filter(!is.na(enum)) %>% bind_rows(vocab)

vocab <- vocab %>% group_by(properties_id) %>%
  mutate(displayOrder=row_number()-1) %>%
  rename(DatasetField=properties_id, Value=enum)
