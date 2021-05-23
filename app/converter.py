

# Python code to convert video to audio
import moviepy.editor as mp
  
# Insert Local Video File Path 
clip = mp.VideoFileClip(r"/home/jhon/Clips/Regard - Ride It (Lyrics).mp4")
  
# Insert Local Audio File Path
clip.audio.write_audiofile(r"ride_it.mp3")