#include <stdio.h>

#include "config.h"
#include "definitions.h"
#include "dht11.h"
#include "driver/gpio.h"
#include "driver/ledc.h"
#include "esp_log.h"
#include "esp_system.h"
#include "flash.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "gpio.h"
#include "handlers.h"
#include "mqtt.h"
#include "sdkconfig.h"
#include "state.h"
#include "wifi.h"

#define TAG "MAIN"

extern char g_device_topic[100];
extern DEVICE_STATE g_device_state;
extern DEVICE_CONFIGURATION g_device_config;

void init_gpios();

int init_connections();

void app_main(void) {
    load_device_state();
    load_device_config();
    load_subscription_topic();

    ESP_LOGI(TAG, "DEVICE TOPIC: %s", g_device_topic);

    if (g_device_state.curr_state == DEVICE_INIT_STATE) {
        if (init_connections() == 0) {
            mqtt_subscribe_topic(g_device_topic, handle_publications);
            xTaskCreate(&handle_send_init_msg, "SEND_INIT_MSG", 4096, NULL, 1, NULL);
        }
    } else if (g_device_state.curr_state == DEVICE_OPERATIONAL_STATE) {
        if (init_connections() == 0) {
            init_gpios();
            DHT11_init(GPIO_DHT11);
            gpio_isr(GPIO_BUTTON, GPIO_INTR_ANYEDGE, handle_btn_interruptions);
            mqtt_subscribe_topic(g_device_topic, handle_publications);
            xTaskCreate(&handle_send_temp_hum, "SEND_TEMP_HUM", 4096, NULL, 1, NULL);
        }
    }
}

int init_connections() {
    nvs_init();

    wifi_start();
    if (wifi_wait_connection() == pdFAIL) return -1;

    mqtt_start();
    if (mqtt_wait_connection() == pdFAIL) return -2;

    return 0;
}

void init_gpios() {
    if (g_device_config.output_type == IO_BINARY) {
        gpio_pad_select_gpio(GPIO_LED);
        gpio_set_direction(GPIO_LED, GPIO_MODE_OUTPUT);
        if (g_device_state.output_value >= 0) {
            gpio_set_level(GPIO_LED, g_device_state.output_value);
        }
    } else if (g_device_config.output_type == IO_DIMMABLE) {
        pwm_config_timer();
        pwm_config_channel(GPIO_LED, LEDC_CHANNEL_0);
        if (g_device_state.output_value >= 0) {
            pwm_set_duty_cycle(GPIO_LED, g_device_state.output_value);
        }
    }

    if (g_device_config.input_type == IO_BINARY) {
        gpio_pad_select_gpio(GPIO_BUTTON);
        gpio_set_direction(GPIO_BUTTON, GPIO_MODE_INPUT);
        gpio_pulldown_en(GPIO_BUTTON);
        gpio_pullup_dis(GPIO_BUTTON);
    }
}