#ifndef WIFI_H_
#define WIFI_H_

#include "freertos/FreeRTOS.h"

void wifi_start();

void wifi_stop();

BaseType_t wifi_wait_connection();

#endif /* WIFI_H_ */