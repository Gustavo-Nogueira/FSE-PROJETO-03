#include "mqtt.h"

#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"
#include "esp_system.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include "lwip/sockets.h"
#include "mqtt_client.h"

#define TAG "MQTT"

#define MAX_SUB_TOPICS 5

#define MOSQUITTO_BROKER_URL "ws://mqtt.eclipseprojects.io:80/mqtt"

typedef struct {
    char topic[100];
    MQTT_MESSAGE_HANDLER handler;
} MQTT_SUBSCRIBED_TOPIC;

static short last_topic_index = -1;
static esp_mqtt_client_handle_t mqtt_client;
static xSemaphoreHandle mqtt_connection_semaphore;
static MQTT_SUBSCRIBED_TOPIC *subscribed_topics[MAX_SUB_TOPICS];

static short get_topic_index(char *topic) {
    for (short i = 0; i <= last_topic_index; i++) {
        if (strcmp(topic, subscribed_topics[i]->topic) == 0) {
            return i;
        }
    }

    return -1;
}

static esp_err_t mqtt_event_handler_cb(esp_mqtt_event_handle_t event) {
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            xSemaphoreGive(mqtt_connection_semaphore);
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;
        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");
            int index;
            char topic[100] = {0}, data[500] = {0};
            sprintf(data, "%.*s", event->data_len, event->data);
            sprintf(topic, "%.*s", event->topic_len, event->topic);
            if ((index = get_topic_index(topic)) >= 0) {
                subscribed_topics[index]->handler(topic, data);
            }
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }

    return ESP_OK;
}

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data) {
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
    mqtt_event_handler_cb(event_data);
}

void mqtt_start() {
    esp_mqtt_client_config_t mqtt_config = {
        .uri = MOSQUITTO_BROKER_URL,
    };

    mqtt_client = esp_mqtt_client_init(&mqtt_config);
    mqtt_connection_semaphore = xSemaphoreCreateBinary();

    esp_mqtt_client_register_event(mqtt_client, ESP_EVENT_ANY_ID, mqtt_event_handler, mqtt_client);
    esp_mqtt_client_start(mqtt_client);
}

BaseType_t mqtt_wait_connection() {
    return xSemaphoreTake(mqtt_connection_semaphore, portMAX_DELAY);
}

void mqtt_subscribe_topic(char *topic, MQTT_MESSAGE_HANDLER handler) {
    if (last_topic_index + 1 < MAX_SUB_TOPICS) {
        subscribed_topics[++last_topic_index] = (MQTT_SUBSCRIBED_TOPIC *)malloc(sizeof(MQTT_SUBSCRIBED_TOPIC));
        strcpy(subscribed_topics[last_topic_index]->topic, topic);
        subscribed_topics[last_topic_index]->handler = handler;

        int msg_id = esp_mqtt_client_subscribe(mqtt_client, topic, 1);
        ESP_LOGI(TAG, "Sent subscribe successful, msg_id=%d", msg_id);
    } else {
        ESP_LOGE(TAG, "Failed to subscribe to the topic");
    }
}

void mqtt_unsubscribe_topic(char *topic) {
    short index;
    MQTT_SUBSCRIBED_TOPIC *aux;

    if ((index = get_topic_index(topic)) >= 0) {
        aux = subscribed_topics[index];
        subscribed_topics[index] = subscribed_topics[last_topic_index];
        subscribed_topics[last_topic_index] = aux;
        free(subscribed_topics[last_topic_index--]);

        int msg_id = esp_mqtt_client_unsubscribe(mqtt_client, topic);
        ESP_LOGI(TAG, "Sent unsubscribe successful, msg_id=%d", msg_id);
    } else {
        ESP_LOGE(TAG, "Unregistered topic");
    }
}

void mqtt_send_message(char *topic, char *message) {
    int msg_id = esp_mqtt_client_publish(mqtt_client, topic, message, 0, 1, 0);
    ESP_LOGI(TAG, "Message sent. ID: %d", msg_id);
}
