#include <string.h>
#include <sys/time.h>

#include "esp_log.h"
#include "esp_system.h"
#include "state.h"

extern DEVICE_STATE g_device_state;

void get_device_mac_addr_str(char *mac) {
    char digit[5];
    uint8_t mac_addr[6] = {0};
    ESP_ERROR_CHECK(esp_efuse_mac_get_default(mac_addr));

    sprintf(digit, "%d", mac_addr[0]);
    strcat(mac, digit);
    sprintf(digit, "%d", mac_addr[1]);
    strcat(mac, digit);
    sprintf(digit, "%d", mac_addr[2]);
    strcat(mac, digit);
    sprintf(digit, "%d", mac_addr[3]);
    strcat(mac, digit);
    sprintf(digit, "%d", mac_addr[4]);
    strcat(mac, digit);
    sprintf(digit, "%d", mac_addr[5]);
    strcat(mac, digit);
}

void reset_device() {
    g_device_state.curr_state = DEVICE_INIT_STATE;
    g_device_state.output_value = -1;
    save_device_state();
    esp_restart();
}

/**
 * Find the time difference in usec.
*/
unsigned long calc_delta_time(struct timeval *a, struct timeval *b) {
    return abs((a->tv_sec * 1000000 + a->tv_usec) - (b->tv_sec * 1000000 + b->tv_usec));
}