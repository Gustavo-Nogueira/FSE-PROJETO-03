#ifndef UTILS_H_
#define UTILS_H_

void reset_device();

void get_device_mac_addr_str(char *mac);

unsigned long calc_delta_time(struct timeval *a, struct timeval *b);

#endif /* UTILS_H_ */