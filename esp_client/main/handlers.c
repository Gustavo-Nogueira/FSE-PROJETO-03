#include <string.h>

#include "cJSON.h"
#include "config.h"
#include "definitions.h"
#include "dht11.h"
#include "driver/gpio.h"
#include "driver/ledc.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "gpio.h"
#include "mqtt.h"
#include "state.h"
#include "utils.h"

#define TAG "HANDLERS"

extern char g_device_topic[100];
extern DEVICE_STATE g_device_state;
extern DEVICE_CONFIGURATION g_device_config;

void handle_send_init_msg() {
    char *json, mac[20] = {0};
    cJSON *cj_payload = NULL, *cj_command = NULL, *cj_data = NULL, *cj_item = NULL;
    const TickType_t delay = 15000 / portTICK_PERIOD_MS;

    get_device_mac_addr_str(mac);

    while (true) {
        ESP_LOGI(TAG, "SENDING INITIALIZATION MESSAGE");

        cj_payload = cJSON_CreateObject();
        cj_data = cJSON_CreateObject();

        cj_command = cJSON_CreateNumber(CMD_DEVICE_INIT);

        cj_item = cJSON_CreateNumber(DEVICE_MODE);
        cJSON_AddItemToObject(cj_data, "mode", cj_item);

        cj_item = cJSON_CreateString(mac);
        cJSON_AddItemToObject(cj_data, "device_id", cj_item);

        cJSON_AddItemToObject(cj_payload, "command", cj_command);
        cJSON_AddItemToObject(cj_payload, "data", cj_data);

        json = cJSON_Print(cj_payload);
        mqtt_send_message(g_device_topic, json);

        vTaskDelay(delay);
    }
}

void handle_publications(char *topic, char *data) {
    esp_err_t res = ESP_OK;
    char *json_response, res_topic[100] = {0}, mac[20] = {0};
    int command, output_value = -1, input_value = -1;
    cJSON *cj_payload = NULL, *cj_command = NULL, *cj_data = NULL, *cj_item = NULL;
    cJSON *cj_response = NULL, *cj_input = NULL, *cj_output = NULL, *cj_device_id = NULL;
    cJSON *cj_res_topic = NULL, *cj_msg_id = NULL, *cj_status = NULL;

    get_device_mac_addr_str(mac);

    cj_payload = cJSON_Parse(data);

    cj_command = cJSON_GetObjectItemCaseSensitive(cj_payload, "command");
    command = cj_command->valuedouble;

    cj_msg_id = cJSON_GetObjectItemCaseSensitive(cj_payload, "msg_id");
    cj_res_topic = cJSON_GetObjectItemCaseSensitive(cj_payload, "response_topic");
    if (cJSON_IsString(cj_res_topic) && (cj_res_topic->valuestring != NULL)) {
        memcpy(res_topic, cj_res_topic->valuestring, strlen(cj_res_topic->valuestring));
    }

    switch (command) {
        case CMD_RESET_DEVICE:
            ESP_LOGI(TAG, "[CMD_RESET_DEVICE]");
            // publishing response
            cj_response = cJSON_CreateObject();
            cj_status = cJSON_CreateNumber(OK_STATUS_RESPONSE);

            cJSON_AddItemToObject(cj_response, "msg_id", cj_msg_id);
            cJSON_AddItemToObject(cj_response, "status", cj_status);

            json_response = cJSON_Print(cj_response);
            mqtt_send_message(res_topic, json_response);

            // resetting
            reset_device();
            break;
        case CMD_SET_DEVICE_CONFIG:
            ESP_LOGI(TAG, "[CMD_SET_DEVICE_CONFIG]");
            // recovering data
            cj_data = cJSON_GetObjectItemCaseSensitive(cj_payload, "data");

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "state_topic");
            if (cJSON_IsString(cj_item) && (cj_item->valuestring != NULL)) {
                sprintf(g_device_config.state_topic, "%s", cj_item->valuestring);
            }

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "temp_topic");
            if (cJSON_IsString(cj_item) && (cj_item->valuestring != NULL)) {
                sprintf(g_device_config.temp_topic, "%s", cj_item->valuestring);
            }

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "hum_topic");
            if (cJSON_IsString(cj_item) && (cj_item->valuestring != NULL)) {
                sprintf(g_device_config.hum_topic, "%s", cj_item->valuestring);
            }

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "input_type");
            if (cJSON_IsNumber(cj_item)) {
                g_device_config.input_type = cj_item->valuedouble;
            }

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "output_type");
            if (cJSON_IsNumber(cj_item)) {
                g_device_config.output_type = cj_item->valuedouble;
            }

            g_device_state.curr_state = DEVICE_OPERATIONAL_STATE;
            g_device_state.output_value = -1;

            // publishing response
            cj_response = cJSON_CreateObject();
            cj_status = cJSON_CreateNumber(OK_STATUS_RESPONSE);

            cJSON_AddItemToObject(cj_response, "msg_id", cj_msg_id);
            cJSON_AddItemToObject(cj_response, "status", cj_status);

            json_response = cJSON_Print(cj_response);
            mqtt_send_message(res_topic, json_response);
            vTaskDelay(1000 / portTICK_PERIOD_MS);

            // saving to NVS
            save_device_config();
            save_device_state();
            esp_restart();
            break;
        case CMD_SET_OUTPUT_VALUE:
            ESP_LOGI(TAG, "[CMD_SET_OUTPUT_VALUE]");
            cj_data = cJSON_GetObjectItemCaseSensitive(cj_payload, "data");

            cj_item = cJSON_GetObjectItemCaseSensitive(cj_data, "value");
            if (cJSON_IsNumber(cj_item)) {
                output_value = cj_item->valuedouble;
            }

            if (output_value >= 0) {
                // executing command
                if (g_device_config.output_type == IO_BINARY) {
                    res = gpio_set_level(GPIO_LED, output_value);
                } else if (g_device_config.output_type == IO_DIMMABLE) {
                    res = pwm_set_duty_cycle(GPIO_LED, output_value);
                }

                int status;
                if (res == ESP_OK) {
                    ESP_LOGI(TAG, "[CMD_SET_OUTPUT_VALUE] success");
                    // publishing push notification
                    cj_response = cJSON_CreateObject();
                    cj_data = cJSON_CreateObject();

                    cj_device_id = cJSON_CreateString(mac);
                    cj_output = cJSON_CreateNumber(output_value);
                    cj_command = cJSON_CreateNumber(CMD_OUTPUT_PUSH_NOTIFICATION);

                    cJSON_AddItemToObject(cj_data, "device_id", cj_device_id);
                    cJSON_AddItemToObject(cj_data, "value", cj_output);
                    cJSON_AddItemToObject(cj_response, "data", cj_data);
                    cJSON_AddItemToObject(cj_response, "command", cj_command);

                    json_response = cJSON_Print(cj_response);
                    mqtt_send_message(g_device_config.state_topic, json_response);

                    // saving to NVS
                    g_device_state.output_value = output_value;
                    save_device_state();

                    status = OK_STATUS_RESPONSE;
                } else {
                    ESP_LOGE(TAG, "[CMD_SET_OUTPUT_VALUE] failure");
                    status = NOK_STATUS_RESPONSE;
                }

                // publishing response
                cj_response = cJSON_CreateObject();
                cj_status = cJSON_CreateNumber(status);

                cJSON_AddItemToObject(cj_response, "msg_id", cj_msg_id);
                cJSON_AddItemToObject(cj_response, "status", cj_status);

                json_response = cJSON_Print(cj_response);
                mqtt_send_message(res_topic, json_response);
            }
            break;
        case CMD_REQUEST_IO_STATES:
            ESP_LOGI(TAG, "[CMD_REQUEST_IO_STATES]");
            // recovering states
            input_value = gpio_get_level(GPIO_BUTTON);
            if (g_device_config.output_type == IO_BINARY) {
                output_value = gpio_get_level(GPIO_LED);
            } else if (g_device_config.output_type == IO_DIMMABLE) {
                output_value = pwm_get_duty_cycle(GPIO_LED);
            }

            // publishing response
            cj_response = cJSON_CreateObject();
            cj_data = cJSON_CreateObject();

            cj_input = cJSON_CreateNumber(input_value);
            cj_output = cJSON_CreateNumber(output_value);
            cj_status = cJSON_CreateNumber(OK_STATUS_RESPONSE);

            cJSON_AddItemToObject(cj_data, "input_value", cj_input);
            cJSON_AddItemToObject(cj_data, "output_value", cj_output);
            cJSON_AddItemToObject(cj_response, "data", cj_data);
            cJSON_AddItemToObject(cj_response, "msg_id", cj_msg_id);
            cJSON_AddItemToObject(cj_response, "status", cj_status);

            json_response = cJSON_Print(cj_response);
            mqtt_send_message(res_topic, json_response);
            break;
        default:
            break;
    }
}

void handle_btn_interruptions(short gpio, short value, unsigned long delta_time) {
    char *json, mac[20] = {0};
    cJSON *cj_payload = NULL, *cj_command = NULL, *cj_data = NULL, *cj_item = NULL, *cj_device_id = NULL;

    get_device_mac_addr_str(mac);

    // filter jitter (100 ms)
    if (delta_time >= 100000 && value == 1) {
        if (delta_time >= 3000000) {  // reset (3 sec)
            ESP_LOGI(TAG, "[BTN_INTERRUPTION] RESET");
            reset_device();
        } else {  // just pressed
            ESP_LOGI(TAG, "[BTN_INTERRUPTION] PRESSED");
            // publishing push notification
            cj_payload = cJSON_CreateObject();
            cj_data = cJSON_CreateObject();
            cj_device_id = cJSON_CreateString(mac);

            cj_item = cJSON_CreateNumber(value);
            cj_command = cJSON_CreateNumber(CMD_INPUT_PUSH_NOTIFICATION);

            cJSON_AddItemToObject(cj_data, "value", cj_item);
            cJSON_AddItemToObject(cj_data, "device_id", cj_device_id);
            cJSON_AddItemToObject(cj_payload, "data", cj_data);
            cJSON_AddItemToObject(cj_payload, "command", cj_command);

            json = cJSON_Print(cj_payload);
            mqtt_send_message(g_device_config.state_topic, json);
        }
    }
}

void handle_send_temp_hum() {
    char *json, mac[20] = {0};
    cJSON *cj_payload = NULL, *cj_data = NULL, *cj_item = NULL, *cj_command = NULL, *cj_device_id = NULL;
    const TickType_t read_delay = 2000 / portTICK_PERIOD_MS;
    int temperature, humidity, correct_reading, i;
    struct dht11_reading dht11r;
    const int N = 5;

    get_device_mac_addr_str(mac);

    while (true) {
        temperature = 0;
        humidity = 0;
        correct_reading = 0;

        for (i = 0; i < N; i++) {
            dht11r = DHT11_read();
            if (dht11r.status == DHT11_OK) {
                temperature += dht11r.temperature;
                humidity += dht11r.humidity;
                correct_reading++;
            }
            vTaskDelay(read_delay);
        }

        if (correct_reading == 0) continue;

        temperature /= correct_reading;
        humidity /= correct_reading;

        ESP_LOGI(TAG, "PUBLISHING TEMPERATURE AND HUMIDITY");

        // publishing temperature
        cj_payload = cJSON_CreateObject();
        cj_data = cJSON_CreateObject();
        cj_device_id = cJSON_CreateString(mac);

        cj_item = cJSON_CreateNumber(temperature);
        cj_command = cJSON_CreateNumber(CMD_TEMPERATURE_UPDATE);

        cJSON_AddItemToObject(cj_data, "device_id", cj_device_id);
        cJSON_AddItemToObject(cj_data, "temperature", cj_item);
        cJSON_AddItemToObject(cj_payload, "data", cj_data);
        cJSON_AddItemToObject(cj_payload, "command", cj_command);

        json = cJSON_Print(cj_payload);
        mqtt_send_message(g_device_config.temp_topic, json);

        // publishing humidity
        cj_payload = cJSON_CreateObject();
        cj_data = cJSON_CreateObject();

        cj_item = cJSON_CreateNumber(humidity);
        cj_command = cJSON_CreateNumber(CMD_HUMIDITY_UPDATE);

        cJSON_AddItemToObject(cj_data, "device_id", cj_device_id);
        cJSON_AddItemToObject(cj_data, "humidity", cj_item);
        cJSON_AddItemToObject(cj_payload, "data", cj_data);
        cJSON_AddItemToObject(cj_payload, "command", cj_command);

        json = cJSON_Print(cj_payload);
        mqtt_send_message(g_device_config.hum_topic, json);
    }
}
