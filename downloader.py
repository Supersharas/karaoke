
#!/usr/bin/env python3

from pytube import YouTube
import moviepy.editor as mp

#ask for the link from user
link = input("Enter the link of YouTube video you want to download:  ")
yt = YouTube(link)

#Showing details
print("Title: ",yt.title)
print("Number of views: ",yt.views)
print("Length of video: ",yt.length)
print("Rating of video: ",yt.rating)
#Getting the highest resolution possible
ys = yt.streams.get_highest_resolution()

#Starting download
print("Downloading...")
#print(yt.streams.filter(only_audio=True))
ys.download('/home/jhon/Clips/test')
print("Download completed!!")

#print(YouTube.__dict__)

  
# Insert Local Video File Path 
clip = mp.VideoFileClip("//home//jhon//Clips//test//{}.{}".format(yt.title, 'mp4'))
  
# Insert Local Audio File Path
clip.audio.write_audiofile(yt.title + '.mp3')