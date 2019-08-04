#!/bin/bash
# this script is to update the code on the pi as it will no longer have internet access

rsync -av --exclude 'node_modules' ./ pi@192.168.86.1:/home/pi/defpi