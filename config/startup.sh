#!/bin/bash

forever start /home/pi/defpi/server/main.js
export NODE_ENV="production"
DISPLAY=:0 chromium-browser --kiosk --incognito http://localhost:1337
