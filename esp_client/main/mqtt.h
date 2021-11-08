#ifndef MQTT_H_
#define MQTT_H_

#include "freertos/FreeRTOS.h"

typedef void (*MQTT_MESSAGE_HANDLER)(char *topic, char *message);

void mqtt_start();

void mqtt_subscribe_topic(char *topic, MQTT_MESSAGE_HANDLER handler);

void mqtt_unsubscribe_topic(char *topic);

void mqtt_send_message(char *topic, char *message);

BaseType_t mqtt_wait_connection();

#endif /* MQTT_H_ */