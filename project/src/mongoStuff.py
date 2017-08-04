#Gets the data from the price grabber py and inserts into mongodb
#rip coding practices

from pymongo import MongoClient
import json
import re #use the python raw_decoder to correctly handle multiple data

#Specify URL and port
client = MongoClient( "localhost", 27017)

#Our target db client
db = client["pricenium"]

#Declare the collections I used
posts = db.posts #contains the dictionary of item names as keys and date/price as values
names = db.names #contains list of items that can match the keys
stamps = db.stamps #contains list of items that can match the keys

#A raw_decode example by falsetru
#https://stackoverflow.com/a/22112491/5627221
nonspace = re.compile(r"\S")
def iterparse(j):
    decoder = json.JSONDecoder()
    pos = 0
    while True:
        matched = nonspace.search(j, pos)
        if not matched:
            break
        pos = matched.start()
        decoded, pos = decoder.raw_decode(j, pos)
        yield decoded

####### Everything below this line is data  #######

#Clear it out first because I keep altering the database structure
posts.remove()
names.remove()
stamps.remove()

#read the data json
sel1 = open("json/data.json", "r")

for piece in list(iterparse(sel1.read())):

    posts.insert( piece , check_keys=False)



#read the item names
sel2 = open("json/names.json", "r")

for piece in list(iterparse(sel2.read())):

    names.insert( piece , check_keys=False)


#read the time stamps from pricescraper
sel3 = open("json/stamps.json", "r")

for piece in list(iterparse(sel3.read())):

    stamps.insert( piece , check_keys=False)
