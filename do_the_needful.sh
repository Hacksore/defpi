#!/bin/bash

RUNNING_ON_PI=$(uname -a | grep "raspberrypi")

if [ "$RUNNING_ON_PI" ]; then
  echo "Running on raspbian"
else 
  echo "Running on debian" 
fi

sudo touch /var/log/defpi.log
sudo chown pi /var/log/defpi.log

echo "============================
DEFPI, SHOW ME WHAT YOU GOT!
      ___          
    . -^   `--,      
   /# =========`-_   
  /# (--====___====\ 
 /#   .- --.  . --.| 
/##   |  * ) (   * ),
|##   \    /\ \   / |
|###   ---   \ ---  |
|####      ___)    #|
|######           ##|
 \##### ---------- / 
  \####           (  
   `\###          |  
     \###         |  
      \##        |   
       \###.    .)   
        `======/     
============================"

# this script should do everything to setup the pi 
sudo apt-get -y update >> /var/log/defpi.log
sudo apt-get -y install git curl hostapd dnsmasq >> /var/log/defpi.log

# TODO: fix, this is happening on raspbian
#if [ ! -z "$RUNNING_ON_PI" ]; then
  # echo "Installing chromium cause we are ond debian"
  # sudo apt-get -y install chromium >> /var/log/defpi.log
  # sudo ln -s /usr/bin/chromium /usr/bin/chromium-browser
#fi

echo "Installing node"
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - >> /var/log/defpi.log
sudo apt-get install -y nodejs >> /var/log/defpi.log

echo "Installing forever"
sudo npm install -g forever >> /var/log/defpi.log

# stop screen sleep
sudo sed -i 's/xserver-command=X/xserver-command=X -s 0 dpms/g' /etc/lightdm/lightdm.conf

# install LCD screen
if [ "$RUNNING_ON_PI" ]; then
  echo "Installing LCD drivers"
  git clone https://github.com/goodtft/LCD-show /tmp/lcd >> /var/log/defpi.log
  chmod +x /tmp/lcd/LCD35-show

  # script needs dot sourced stuffz
  cd /tmp/lcd/LCD35-show
  # run the setup script
  sudo bash LCD35-show 90 >> /var/log/defpi.log
fi

# setup auto start
echo "Updating autostart config"
if [ "$RUNNING_ON_PI" ]; then
  contents=$(cat "config/autostart" | sed "s/:PROFILE/LXDE-pi/g")
  echo "$contents" | sudo tee "/etc/xdg/lxsession/LXDE-pi/autostart"
else
  contents=$(cat "config/autostart" | sed "s/:PROFILE/LXDE/g")
  echo "$contents" | sudo tee "/etc/xdg/lxsession/LXDE/autostart"    
fi

# install deps
echo "Installing backend dependencies"
cd /home/pi/defpi/server && npm install >> /var/log/defpi.log

# install deps && build the app
echo "Installing front end dependencies and building"
cd /home/pi/defpi/client
npm install >> /var/log/defpi.log
npm run build >> /var/log/defpi.log

# make startup script executable
chmod +x /home/pi/defpi/config/startup.sh

# setup wifi 
echo "Configuring wireless AP"
sudo ifdown wlan0 >> /var/log/defpi.log

sudo systemctl stop hostapd >> /var/log/defpi.log
sudo systemctl stop dnsmasq >> /var/log/defpi.log

cat /home/pi/defpi/config/hostapd.conf | sudo tee /etc/hostapd/hostapd.conf >> /var/log/defpi.log
cat /home/pi/defpi/config/dnsmasq.conf | sudo tee -a /etc/dnsmasq.conf >> /var/log/defpi.log
echo "denyinterfaces wlan0" | sudo tee -a /etc/dhcpcd.conf >> /var/log/defpi.log
cat config/interfaces | sudo tee /etc/network/interfaces >> /var/log/defpi.log

sudo systemctl unmask hostapd >> /var/log/defpi.log
sudo systemctl enable hostapd >> /var/log/defpi.log
sudo systemctl start hostapd >> /var/log/defpi.log

# don't reboot until script is working 100% 😎
#sudo /sbin/reboot
