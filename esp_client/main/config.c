#include "config.h"

#include <stdio.h>
#include <string.h>

#include "flash.h"
#include "utils.h"

/** GLOBAL DEVICE TOPIC */
char g_device_topic[100] = {0};

/** GLOBAL DEVICE CONFIGURATION */
DEVICE_CONFIGURATION g_device_config;

void save_device_config() {
    nvs_set_integer(NVS_DEVICE_CONFIG_NAMESPACE, "input_type", g_device_config.input_type);
    nvs_set_integer(NVS_DEVICE_CONFIG_NAMESPACE, "output_type", g_device_config.output_type);
    nvs_set_string(NVS_DEVICE_CONFIG_NAMESPACE, "state_topic", g_device_config.state_topic);
    nvs_set_string(NVS_DEVICE_CONFIG_NAMESPACE, "temp_topic", g_device_config.temp_topic);
    nvs_set_string(NVS_DEVICE_CONFIG_NAMESPACE, "hum_topic", g_device_config.hum_topic);
}

void load_device_config() {
    int topic_sz;

    g_device_config.input_type = -1;
    g_device_config.output_type = -1;

    nvs_get_integer(NVS_DEVICE_CONFIG_NAMESPACE, "input_type", &g_device_config.input_type);
    nvs_get_integer(NVS_DEVICE_CONFIG_NAMESPACE, "output_type", &g_device_config.output_type);

    topic_sz = 100;
    nvs_get_string(NVS_DEVICE_CONFIG_NAMESPACE, "state_topic", g_device_config.state_topic, &topic_sz);

    topic_sz = 100;
    nvs_get_string(NVS_DEVICE_CONFIG_NAMESPACE, "temp_topic", g_device_config.temp_topic, &topic_sz);

    topic_sz = 100;
    nvs_get_string(NVS_DEVICE_CONFIG_NAMESPACE, "hum_topic", g_device_config.hum_topic, &topic_sz);
}

void load_subscription_topic() {
    // Format: fse2021/<matricula>/dispositivos/<ID_do_dispositivo>
    char mac[20] = {0};
    get_device_mac_addr_str(mac);
    strcat(g_device_topic, "fse2021/");
    strcat(g_device_topic, "170144259/");
    strcat(g_device_topic, "dispositivos/");
    strcat(g_device_topic, mac);
}