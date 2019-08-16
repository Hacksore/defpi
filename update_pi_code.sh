#!/bin/bash
# this script is to update the code on the pi as it will no longer have internet access

# build the app just in case we have changes to deliver to web
cd client/ && npm run build

cd ../

# sync files
rsync -av  --exclude 'client/node_modules' --exclude '.git' ./ pi@192.168.86.1:/home/pi/defpi

#rsync -av  --exclude 'node_modules' --exclude '.git' ./ pi@192.168.86.1:/home/pi/defpi

ssh pi@192.168.86.1 'bash /home/pi/defpi/restart.sh'