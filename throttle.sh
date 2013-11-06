#!/bin/sh
#
# Use ipfw to throttle bandwidth.
# usage:
# ./throttle.sh     # Throttle at default (60KB/s)
# ./throttle.sh 5   # Throttle at custom speed (5KB/s)
# ./throttle.sh off # Turn throttling off

# flush rules
ipfw del pipe 1
ipfw del pipe 2
ipfw -q -f flush
ipfw -q -f pipe flush

speed=60
[ ! -z $1 ] && speed=$1

if [ "$1" == "off" ]; then
    echo "disabling BW limit."
    exit
else
    ipfw add 1 pipe 1 src-port 8081
    ipfw pipe 1 config delay 10ms bw ${speed}KByte/s
    ipfw add 1 pipe 2 src-port 8082
    ipfw pipe 2 config delay 10ms bw $((speed/2))KByte/s
fi
