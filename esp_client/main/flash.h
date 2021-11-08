#ifndef FLASH_H_
#define FLASH_H_

void nvs_init();

void nvs_get_integer(char *name, char *key, int *value);

void nvs_set_integer(char *name, char *key, int value);

void nvs_get_string(char *name, char *key, char *value, int *length);

void nvs_set_string(char *name, char *key, char *value);

#endif /* FLASH_H_ */