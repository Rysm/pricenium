#Gets the data from the price grabber py and inserts into mongodb

from pymongo import MongoClient
import json

client = MongoClient( "localhost", 27017)

db = client["pricenium"]

posts = db.posts

#read the data json from pricescraper
selData = open("data.json", "r")

#Parse the data
parseData = json.loads( selData.read() )

posts.remove()

posts.insert(parseData,check_keys=False)
