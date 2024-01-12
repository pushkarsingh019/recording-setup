# stop_recording.py
from picamera2 import PiCamera

def stop_recording():
    try:
        # Connect to the PiCamera
        with PiCamera() as camera:
            # Stop the recording
            camera.stop_recording()
            print("Recording stopped successfully.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    stop_recording()
