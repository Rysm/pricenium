#Gets the data from the price grabber py and inserts into mongodb

from pymongo import MongoClient
import json
import re

client = MongoClient( "localhost", 27017)

db = client["pricenium"]

posts = db.posts #contains the dictionary of item names as keys and date/price as values

names = db.names #contains list of items that can match the keys

stamps = db.stamps #contains list of items that can match the keys

#read the data json from pricescraper
selData1 = open("json/data.json", "r")

#Parse the data
parseData1 = json.loads( selData1.read() )

posts.remove()

posts.insert(parseData1,check_keys=False)

####### KEK #######

#read the data json from pricescraper
selData2 = open("json/names.json", "r")

#Parse the data
parseData2 = json.loads( selData2.read() )

names.remove()

names.insert(parseData2,check_keys=False)

####### KEK #######

#read the data json from pricescraper
selData3 = open("json/stamps.json", "r")

#Parse the data
parseData3 = json.loads( selData3.read() )

stamps.remove()

stamps.insert(parseData3,check_keys=False)
