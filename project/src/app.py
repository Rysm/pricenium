#Handles the web page rendering

from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'pricenium'
COLLECTION_1 = 'posts'
COLLECTION_2 = 'names'
COLLECTION_3 = 'stamps'
FIELDS = {'school_state': True, 'resource_type': True, 'poverty_level': True, 'date_posted': True, 'total_donations': True, '_id': False}

@app.route("/")

def index():
    return render_template('index.html')

@app.route("/pricenium/posts")
def get_full():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_1]
    items = collection.find()
    json_items = []
    for item in items:
        json_items.append(item)
    json_items = json.dumps(json_items, default=json_util.default)
    connection.close()
    return json_items

@app.route("/pricenium/names")
def get_keys():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_2]
    items = collection.find()
    json_items = []
    for item in items:
        json_items.append(item)
    json_items = json.dumps(json_items, default=json_util.default)
    connection.close()
    return json_items

@app.route("/pricenium/stamps")
def get_time():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_3]
    items = collection.find()
    json_items = []
    for item in items:
        json_items.append(item)
    json_items = json.dumps(json_items, default=json_util.default)
    connection.close()
    return json_items


if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)
