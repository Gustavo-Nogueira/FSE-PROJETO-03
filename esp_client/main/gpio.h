#ifndef GPIO_H_
#define GPIO_H_

#include "driver/gpio.h"

typedef void (*INTERRUPT_HANDLER)(short gpio, short value, unsigned long delta_time);

esp_err_t pwm_config_timer();

esp_err_t pwm_config_channel(short gpio, short channel);

int pwm_get_duty_cycle(short gpio);

esp_err_t pwm_set_duty_cycle(short gpio, short duty_cycle);

esp_err_t gpio_isr(short gpio, gpio_int_type_t intr_type, INTERRUPT_HANDLER handler);

#endif /* GPIO_H_ */