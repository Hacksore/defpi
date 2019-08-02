#!/bin/bash

# this script should do everything to setup the pi 
sudo apt -y update

# Raspbian has this but stock debian does not have this installed so we do this
sudo apt -y install chromium-browser

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install -y nodejs

npm install -g forever

# install screen
git clone git@github.com:goodtft/LCD-show.git /tmp/lcd

chmod +x /tmp/lcd/LCD35-show
sudo bash /tmp/lcd/LCD35-show

sudo apt install -y hostapd
sudo apt install -y dnsmasq

sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# setup auto start
cat "config/autostart" > "/etc/xdg/lxsession/LXDE-pi/autostart"