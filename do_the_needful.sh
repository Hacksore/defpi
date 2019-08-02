#!/bin/bash

RUNNING_ON_PI=$(uname -a | grep "raspberrypi")

if [ "$RUNNING_ON_PI" ]; then
  echo "Running on raspbian"
else 
  echo "Running on debian"  
fi

# this script should do everything to setup the pi 
sudo apt-get -y update > /dev/null

sudo apt-get -y install chromium git curl hostapd dnsmasq > /dev/null

curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - > /dev/null
sudo apt-get install -y nodejs npm > /dev/null

npm install -g forever > /dev/null

# install LCD screen
if [ "$RUNNING_ON_PI" ]; then
  git clone https://github.com/goodtft/LCD-show /tmp/lcd
  chmod +x /tmp/lcd/LCD35-show

  # run the setup script
  sudo bash /tmp/lcd/LCD35-show 90
fi

sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# setup auto start
if [ "$RUNNING_ON_PI" ]; then
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE-pi/autostart"
else
  cat "config/autostart" > "/etc/xdg/lxsession/LXDE/autostart"    
fi