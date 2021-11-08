#include "driver/gpio.h"

#include <sys/time.h>

#include "driver/ledc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/task.h"
#include "gpio.h"
#include "utils.h"

#define MAX_GPIO 30

static bool isr_initialized = false;
static xQueueHandle interrupt_queue;
static INTERRUPT_HANDLER interrupt_handlers[MAX_GPIO];
static unsigned short gpio_pwm_channel[MAX_GPIO];
static struct timeval gpio_last_change[MAX_GPIO];

static ledc_timer_config_t timer_config = {
    .speed_mode = LEDC_LOW_SPEED_MODE,
    .duty_resolution = LEDC_TIMER_8_BIT,
    .timer_num = LEDC_TIMER_0,
    .freq_hz = 1000,
    .clk_cfg = LEDC_AUTO_CLK,
};

/**
 * Configure timer pwm.
*/
esp_err_t pwm_config_timer() {
    return ledc_timer_config(&timer_config);
}

/**
 * Configure channel pwm.
*/
esp_err_t pwm_config_channel(short gpio, short channel) {
    ledc_channel_config_t channel_config = {
        .gpio_num = gpio,
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .channel = channel,
        .timer_sel = LEDC_TIMER_0,
        .duty = 0,
        .hpoint = 0,
    };

    gpio_pwm_channel[gpio] = channel;
    return ledc_channel_config(&channel_config);
}

/**
 * Get duty cycle for channel of gpio.
*/
int pwm_get_duty_cycle(short gpio) {
    return ledc_get_duty(LEDC_LOW_SPEED_MODE, gpio_pwm_channel[gpio]);
}

/**
 * Set duty cycle for channel of gpio.
*/
esp_err_t pwm_set_duty_cycle(short gpio, short duty_cycle) {
    esp_err_t err;

    if ((err = ledc_set_duty(LEDC_LOW_SPEED_MODE, gpio_pwm_channel[gpio], duty_cycle)) != ESP_OK) return err;

    err = ledc_update_duty(LEDC_LOW_SPEED_MODE, gpio_pwm_channel[gpio]);

    return err;
}

/**
 * ISR handler function for the corresponding GPIO number.
*/
static void IRAM_ATTR gpio_isr_handler(void *args) {
    short gpio = (int)args;
    xQueueSendFromISR(interrupt_queue, &gpio, NULL);
}

/**
 * Waits for interruption and calls the respective gpio handler.
*/
static void wait_interruptions(void *args) {
    short gpio, value;
    struct timeval now;
    unsigned long delta_time;

    while (true) {
        if (xQueueReceive(interrupt_queue, &gpio, portMAX_DELAY)) {
            value = gpio_get_level(gpio);

            gettimeofday(&now, NULL);
            delta_time = calc_delta_time(&now, &gpio_last_change[gpio]);

            interrupt_handlers[gpio](gpio, value, delta_time);

            gpio_last_change[gpio] = now;
        }
    }
}

/**
 * Configure a Interrupt Handler(ISR) for a gpio.
*/
esp_err_t gpio_isr(short gpio, gpio_int_type_t intr_type, INTERRUPT_HANDLER handler) {
    esp_err_t err;

    if (!isr_initialized) {
        if ((err = gpio_install_isr_service(0)) != ESP_OK) return err;
        interrupt_queue = xQueueCreate(10, sizeof(int));
        xTaskCreate(wait_interruptions, "ISR_HANDLER", 2048, NULL, 1, NULL);
        isr_initialized = true;
    }

    if ((err = gpio_set_intr_type(gpio, intr_type)) != ESP_OK) return err;

    if ((err = gpio_isr_handler_add(gpio, gpio_isr_handler, (void *)gpio)) != ESP_OK) return err;

    interrupt_handlers[gpio] = handler;
    gettimeofday(&gpio_last_change[gpio], NULL);

    return err;
}