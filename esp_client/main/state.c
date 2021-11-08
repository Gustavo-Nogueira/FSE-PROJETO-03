#include "state.h"

#include "flash.h"

/** GLOBAL DEVICE STATE */
DEVICE_STATE g_device_state;

void save_device_state() {
    nvs_set_integer(NVS_DEVICE_STATE_NAMESPACE, "curr_state", g_device_state.curr_state);
    nvs_set_integer(NVS_DEVICE_STATE_NAMESPACE, "output_value", g_device_state.output_value);
}

void load_device_state() {
    g_device_state.curr_state = DEVICE_INIT_STATE;
    g_device_state.output_value = -1;

    nvs_get_integer(NVS_DEVICE_STATE_NAMESPACE, "curr_state", &g_device_state.curr_state);
    nvs_get_integer(NVS_DEVICE_STATE_NAMESPACE, "output_value", &g_device_state.output_value);
}
