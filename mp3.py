from mutagen.mp3 import MP3
import requests

url = "https://obytrics-audios.s3.amazonaws.com/speech-output/.92dda091-3b36-471a-b6ea-ca6ba97938fa.mp3" #event["image"]
response = requests.get(url)

with open("./audio.mp3", 'wb') as f:
    f.write(response.content)
# def mutagen_length(path):
#     try:
#         audio = MP3(path)
#         print(audio)
#         length = audio.info.length
#         return length
#     except e:
#         print(e)
#         return None

# length = mutagen_length("./speech_20240809043229891.mp3")
# print("duration sec: " + str(length))
# print("duration min: " + str(int(length/60)) + ':' + str(int(length%60)))
