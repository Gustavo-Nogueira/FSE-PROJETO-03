# Cliente ESP32

## Uso

Versão ESP-IDF: v5.0-dev-75-g1561fbd2c5-dirty 

Build:
```
idf.py build
```

Insira as credenciais da sua rede a partir da opção Wifi Configuration do menuconfig:
```
idf.py menuconfig
```

Carregando programa na ESP:
```
idf.py -p <porta> flash monitor
```
