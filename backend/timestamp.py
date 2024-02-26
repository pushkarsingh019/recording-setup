#!/usr/bin/python3
import time
import os
import cv2
import re
import subprocess

from picamera2 import MappedArray, Picamera2, Preview
from picamera2.encoders import H264Encoder, Quality
from picamera2.outputs import FfmpegOutput
from libcamera import Transform

result = subprocess.run(['fbset'], capture_output=True, text=True)
resolution = re.search(r'^mode "(\d+)x(\d+)"$', result.stdout, re.MULTILINE).groups()

width = int(resolution[0])
height = int(resolution[1])

picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration())
picam2.color_effects = (128, 128)

colour = (0, 255, 0)
origin = (0, 30)
font = cv2.FONT_HERSHEY_SIMPLEX
scale = 1
thickness = 2
safe_boundary = 100

picam2.start_preview(
    Preview.QTGL, x=0, y=0, width=(width - safe_boundary), height=(height - safe_boundary), transform=Transform(hflip=1, vflip=1)
)

def apply_timestamp(request):
    timestamp = time.strftime("%Y-%m-%d %X", time.localtime())
    with MappedArray(request, "main") as m:
        # Convert the frame to black and white
        frame_bw = cv2.cvtColor(m.array, cv2.COLOR_BGR2GRAY)
        m.array[:, :, 0] = frame_bw
        m.array[:, :, 1] = frame_bw
        m.array[:, :, 2] = frame_bw

        cv2.putText(m.array, timestamp, origin, font, scale, colour, thickness)

picam2.pre_callback = apply_timestamp

output_folder = "recordings"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

timestamp = time.strftime('%d-%b-%Y_time_%H-%M')
index = 1
output_file = os.path.join(output_folder, f"video_{timestamp}_{index}.mp4")

# Find a unique file name
while os.path.exists(output_file):
    index += 1
    output_file = os.path.join(output_folder, f"video_{timestamp}_{index}.mp4")

# encoder = H264Encoder(10000000)
encoder = H264Encoder();
output = FfmpegOutput(output_file)

try:
    picam2.start_recording(encoder, output, quality=Quality.HIGH)
    while True:
        time.sleep(1)  # Sleep for 1 second, adjust as needed
except KeyboardInterrupt:
    # Stop recording when KeyboardInterrupt (Ctrl+C) is detected
    picam2.stop_recording()
    print("Recording stopped.")

# Close the camera connection
picam2.close()
