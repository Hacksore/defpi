#!/bin/bash

RUNNING_ON_PI=$(uname -a | grep "raspberrypi")

if [ "$RUNNING_ON_PI" ]; then
  echo "Running on debian"
else 
  echo "Running on raspbian"
fi

# this script should do everything to setup the pi 
sudo apt -y update > /dev/null

# Raspbian has these but stock debian does not have this installed so we do this
if [ "$RUNNING_ON_PI" ]; then
  sudo apt -y install chromium git curl > /dev/null
fi

curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - > /dev/null
sudo apt install -y nodejs npm > /dev/null

npm install -g forever > /dev/null

# install LCD screen
if [ "$RUNNING_ON_PI" ]; then
  git clone https://github.com/goodtft/LCD-show /tmp/lcd
  chmod +x /tmp/lcd/LCD35-show

  # run the setup script
  sudo bash /tmp/lcd/LCD35-show 90
fi

sudo apt install -y hostapd dnsmasq > /dev/null

sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# setup auto start
if [ "$RUNNING_ON_PI" ]; then
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE/autostart"  
else
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE-pi/autostart"
fi