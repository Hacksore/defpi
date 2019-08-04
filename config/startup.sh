#!/bin/bash

export NODE_ENV="production"
forever start /home/pi/defpi/server/main.js
DISPLAY=:0 chromium-browser --kiosk --incognito http://localhost:1337
