#ifndef CONFIG_H_
#define CONFIG_H_

// DEVICE CONFIGURATION
typedef struct {
    char state_topic[100];  // IO States Topic
    char temp_topic[100];   // Temperature Topic
    char hum_topic[100];    // Humidity Topic
    int input_type;         // IO_BINARY
    int output_type;        // IO_BINARY | IO_DIMMABLE
} DEVICE_CONFIGURATION;

// NVS
#define NVS_DEVICE_CONFIG_NAMESPACE "device_config"

void save_device_config();

void load_device_config();

void load_subscription_topic();

#endif /* CONFIG_H_ */