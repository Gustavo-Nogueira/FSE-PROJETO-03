#ifndef HANDLERS_H_
#define HANDLERS_H_

void handle_send_init_msg();

void handle_send_temp_hum();

void handle_publications(char *topic, char *data);

void handle_btn_interruptions(short gpio, short value, unsigned long delta_time);

#endif /* HANDLERS_H_ */