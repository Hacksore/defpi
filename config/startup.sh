#!/bin/bash

DISPLAY=:0 chromium-browser --kiosk --incognito http://localhost:3000
forever start /home/pi/defpi/