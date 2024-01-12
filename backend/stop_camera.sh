#!/bin/bash

# Find the process ID (PID) of the picamera2 script and terminate it
pid=$(pgrep -f "python3 timestamp.py")

if [ -n "$pid" ]; then
    echo "Stopping picamera2 script with PID $pid"
    kill $pid
else
    echo "picamera2 script is not running"
fi
