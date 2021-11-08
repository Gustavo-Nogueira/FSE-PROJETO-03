#ifndef STATE_H_
#define STATE_H_

// STATES
#define DEVICE_INIT_STATE 1
#define DEVICE_OPERATIONAL_STATE 2

// DEVICE STATE
typedef struct {
    int curr_state;    // initialization | operational
    int output_value;  // last output value
} DEVICE_STATE;

// NVS
#define NVS_DEVICE_STATE_NAMESPACE "device_state"

void save_device_state();

void load_device_state();

#endif /* STATE_H_ */