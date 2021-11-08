#ifndef DEFINITIONS_H_
#define DEFINITIONS_H_

#include "sdkconfig.h"

// CURRENT DEVICE MODE
#ifdef CONFIG_LOW_POWER_MODE
#define DEVICE_MODE LOW_POWER_MODE
#endif
#ifdef CONFIG_NORMAL_POWER_MODE
#define DEVICE_MODE NORMAL_POWER_MODE
#endif

// MODES
#define LOW_POWER_MODE 1
#define NORMAL_POWER_MODE 2

// COMMANDS
#define CMD_DEVICE_INIT 1               // device -> central
#define CMD_RESET_DEVICE 2              // central -> device
#define CMD_SET_DEVICE_CONFIG 3         // central -> device
#define CMD_SET_OUTPUT_VALUE 4          // central -> device
#define CMD_REQUEST_IO_STATES 5         // central -> device
#define CMD_INPUT_PUSH_NOTIFICATION 6   // device -> central
#define CMD_OUTPUT_PUSH_NOTIFICATION 7  // device -> central
#define CMD_TEMPERATURE_UPDATE 8        // device -> central
#define CMD_HUMIDITY_UPDATE 9           // device -> central

// GPIOs
#define GPIO_BUTTON 0
#define GPIO_LED 2
#define GPIO_DHT11 4

// IO TYPES
#define IO_BINARY 1
#define IO_DIMMABLE 2

// RESPONSE STATUSES
#define OK_STATUS_RESPONSE 0
#define NOK_STATUS_RESPONSE -1

#endif /* DEFINITIONS_H_ */