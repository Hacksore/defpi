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
▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀█░█▀▀▀▀ 
▐░▌       ▐░▌▐░▌          ▐░▌          ▐░▌       ▐░▌     ▐░▌     
▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     
▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀      ▐░▌     
▐░▌       ▐░▌▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌          ▐░▌           ▄▄▄▄█░█▄▄▄▄ 
▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌          ▐░▌          ▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀            ▀            ▀▀▀▀▀▀▀▀▀▀▀                                                                  
============================"

# this script should do everything to setup the pi 
sudo apt-get -y update >> /var/log/defpi.log
sudo apt-get -y install git curl hostapd dnsmasq arp-scan >> /var/log/defpi.log

if [ -z "$RUNNING_ON_PI" ]; then
  echo "Installing chromium cause we are debian"
  sudo apt-get -y install chromium >> /var/log/defpi.log
  sudo ln -s /usr/bin/chromium /usr/bin/chromium-browser
fi

echo "Installing node"
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - >> /var/log/defpi.log
sudo apt-get install -y nodejs >> /var/log/defpi.log

echo "Installing forever"
sudo npm install -g forever >> /var/log/defpi.log

# install LCD screen
if [ "$RUNNING_ON_PI" ]; then
  echo "Installing LCD drivers"
  git clone https://github.com/Hacksore/LCD-show /home/pi/lcd >> /var/log/defpi.log
  chmod +x /home/pi/lcd/LCD35-show

  # script needs dot sourced stuffz
  cd /home/pi/lcd
  # run the setup script
  sudo bash LCD35-show 270 >> /var/log/defpi.log
fi

# setup auto start
echo "Updating autostart config"
if [ "$RUNNING_ON_PI" ]; then
  contents=$(cat /home/pi/defpi/config/autostart | sed "s/:PROFILE/LXDE-pi/g")
  echo "$contents" | sudo tee "/etc/xdg/lxsession/LXDE-pi/autostart"
else
  contents=$(cat /home/pi/defpi/config/autostart | sed "s/:PROFILE/LXDE/g")
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
cat /home/pi/defpi/config/interfaces | sudo tee /etc/network/interfaces >> /var/log/defpi.log

sudo systemctl unmask hostapd >> /var/log/defpi.log
sudo systemctl enable hostapd >> /var/log/defpi.log
sudo systemctl start hostapd >> /var/log/defpi.log

# pi tweaks
echo "dtoverlay=pi3-disable-bt" | sudo tee -a /boot/config.txt
echo "consoleblank=0" | sudo tee -a /boot/cmdline.txt
sudo systemctl disable bluetooth
sudo sed -i 's/#xserver-command=X/xserver-command=X -s 0 dpms/g' /etc/lightdm/lightdm.conf

# don't reboot until script is working 100% 😎
#sudo /sbin/reboot
