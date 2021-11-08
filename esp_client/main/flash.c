#include "flash.h"

#include "esp_log.h"
#include "esp_system.h"
#include "nvs.h"
#include "nvs_flash.h"

#define TAG "NVS"

void nvs_init() {
    ESP_ERROR_CHECK(nvs_flash_init());
}

void nvs_get_integer(char *name, char *key, int *value) {
    nvs_handle std_partition_handle;
    ESP_ERROR_CHECK(nvs_flash_init());

    esp_err_t res_open = nvs_open(name, NVS_READONLY, &std_partition_handle);

    if (res_open == ESP_ERR_NVS_NOT_FOUND) {
        ESP_LOGE(TAG, "[%s][%s] - Namespace not found", name, key);
    } else {
        esp_err_t res_get = nvs_get_i32(std_partition_handle, key, value);

        switch (res_get) {
            case ESP_OK:
                ESP_LOGI(TAG, "[%s][%s] - Recovered value", name, key);
                break;
            case ESP_ERR_NOT_FOUND:
                ESP_LOGE(TAG, "[%s][%s] - Value not found", name, key);
                break;
            default:
                ESP_LOGE(TAG, "[%s][%s] - Error accessing NVS (%s)", name, key, esp_err_to_name(res_get));
                break;
        }

        nvs_close(std_partition_handle);
    }
}

void nvs_set_integer(char *name, char *key, int value) {
    nvs_handle std_partition_handle;
    ESP_ERROR_CHECK(nvs_flash_init());

    esp_err_t res_open = nvs_open(name, NVS_READWRITE, &std_partition_handle);

    if (res_open == ESP_ERR_NVS_NOT_FOUND) {
        ESP_LOGE(TAG, "[%s][%s] - Namespace not found", name, key);
    }

    esp_err_t res_set = nvs_set_i32(std_partition_handle, key, value);

    if (res_set != ESP_OK) {
        ESP_LOGE(TAG, "[%s][%s] - Could not write on NVS (%s)", name, key, esp_err_to_name(res_set));
    } else {
        ESP_LOGI(TAG, "[%s][%s] - Value written in NVS", name, key);
    }

    nvs_close(std_partition_handle);
}

void nvs_get_string(char *name, char *key, char *value, int *length) {
    nvs_handle std_partition_handle;
    ESP_ERROR_CHECK(nvs_flash_init());

    esp_err_t res_open = nvs_open(name, NVS_READONLY, &std_partition_handle);

    if (res_open == ESP_ERR_NVS_NOT_FOUND) {
        ESP_LOGE(TAG, "[%s][%s] - Namespace not found", name, key);
    } else {
        esp_err_t res_get = nvs_get_str(std_partition_handle, key, value, (size_t *)length);

        switch (res_get) {
            case ESP_OK:
                ESP_LOGI(TAG, "[%s][%s] - Recovered value", name, key);
                break;
            case ESP_ERR_NOT_FOUND:
                ESP_LOGE(TAG, "[%s][%s] - Value not found", name, key);
                break;
            default:
                ESP_LOGE(TAG, "[%s][%s] - Error accessing NVS (%s)", name, key, esp_err_to_name(res_get));
                break;
        }

        nvs_close(std_partition_handle);
    }
}

void nvs_set_string(char *name, char *key, char *value) {
    nvs_handle std_partition_handle;
    ESP_ERROR_CHECK(nvs_flash_init());

    esp_err_t res_open = nvs_open(name, NVS_READWRITE, &std_partition_handle);

    if (res_open == ESP_ERR_NVS_NOT_FOUND) {
        ESP_LOGE(TAG, "[%s][%s] - Namespace not found", name, key);
    }

    esp_err_t res_set = nvs_set_str(std_partition_handle, key, value);

    if (res_set != ESP_OK) {
        ESP_LOGE(TAG, "[%s][%s] - Could not write on NVS (%s)", name, key, esp_err_to_name(res_set));
    } else {
        ESP_LOGI(TAG, "[%s][%s] - Value written in NVS", name, key);
    }

    nvs_close(std_partition_handle);
}
