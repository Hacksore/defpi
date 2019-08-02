#!/bin/bash

RUNNING_ON_PI=$(uname -a | grep "raspberrypi")

# this script should do everything to setup the pi 
sudo apt -y update

# Raspbian has these but stock debian does not have this installed so we do this
if [ ! -z $RUNNING_ON_PI ]; then
  sudo apt -y install chromium-browser git curl
fi

curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt install -y nodejs npm

npm install -g forever

# install LCD screen
git clone https://github.com/goodtft/LCD-show /tmp/lcd
chmod +x /tmp/lcd/LCD35-show

# run the setup script
sudo bash /tmp/lcd/LCD35-show 90

sudo apt install -y hostapd
sudo apt install -y dnsmasq

sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# setup auto start
if [ ! -z $RUNNING_ON_PI ]; then
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE-pi/autostart"
else
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE/autostart"
fi