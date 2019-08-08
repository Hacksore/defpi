#!/bin/bash

forever stopall

# get the chromium pid
pid=$(ps aux | grep localhost:1337 | awk '{print $2}' | head -n 1)

# kill the chromium browser
kill -9 $pid

# run the startup script
bash /home/pi/defpi/config/startup.sh