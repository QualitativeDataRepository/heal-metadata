library(rjson)
library(dplyr)
library(tidyr)
library(purrr)

schema <- fromJSON(file="study-metadata-schema.json")
dataverse <- read.csv("heal_generated.csv", sep="\t")

schema <- schema$properties

test <- tibble(name=names(schema), properties=schema) %>% 
  unnest_wider(properties) %>% unnest_longer(properties) %>% 
  unnest_wider(properties, names_repair="universal") %>%
  unnest_wider(items)

fields %>% filter(variable %in% dataverse$V2) %>% select(variable, label)

