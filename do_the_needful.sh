#!/bin/bash

# this script should do everything to setup the pi 

sudo apt -y update

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install -y nodejs

npm install -g forever

# TODO: make this happen in the ldxd autostart via script?
# DISPLAY=:0 chromium-browser --kiosk --incognito http://localhost:3000
# forever start /home/pi/defpi/