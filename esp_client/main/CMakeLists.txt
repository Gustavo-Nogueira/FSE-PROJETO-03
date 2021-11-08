idf_component_register(
    SRCS
    "main.c"
    "dht11.c"
    "gpio.c"
    "flash.c"
    "wifi.c"
    "mqtt.c"
    "utils.c"
    "handlers.c"
    "config.c"
    "state.c"
    INCLUDE_DIRS "."
)