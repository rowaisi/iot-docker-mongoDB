from flask import Flask, request, jsonify, g
import os
import json
import sqlite3
from pymongo import MongoClient
import hashlib
import requests
import logging
import time
import uuid
app = Flask(__name__)

logging.basicConfig(
    level = logging.INFO,
    format = '%(asctime)s [%(levelname)s]: %(message)s'
)

L = logging.getLogger()

def init_db_sqlite3():
    db = get_db_sqlite3()
    sql = """
CREATE TABLE IF NOT EXISTS `sensor` (
 `id` bigint PRIMARY KEY,
 `device` varchar(32) NOT NULL,
 `ts` double NOT NULL,
 `seq` bigint NOT NULL,
 `dsize` int NOT NULL,
 `dhash` varchar(32) NOT NULL
)
"""
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    cursor.close()

def get_db_sqlite3():
    if 'db' not in g:
        g.db = sqlite3.connect("iot.db")
        init_db_sqlite3()

    return g.db

def insert_record_sqlite3(r):
    m = hashlib.md5()
    m.update(r["sensor_data"].encode('utf-8'))
    dhash = m.hexdigest()[:30]

    db = get_db_sqlite3()
    sql = """
INSERT INTO `sensor` (device, ts, seq, dsize, dhash) 
VALUES (?,?,?,?,?)
"""
    cursor = db.cursor()
    cursor.execute(sql, (r["dev_id"], r["ts"], r["seq_no"], r["data_size"], dhash))
    db.commit()
    cursor.close()

def query_record_sqlite3(page):
    sql = """
SELECT * FROM `sensor` LIMIT 10 OFFSET %d
""" % (page * 10, )
    db = get_db_sqlite3()
    cursor = db.cursor()
    rows = cursor.execute(sql)
    records = []
    for row in rows:
        records.append({'id': row[0], 'device': row[1], 'ts': row[2], 'seq': row[3], 'size': row[4], 'hash': row[5]})
    db.commit()
    cursor.close()
    return records

def get_db_mongo():
    if 'db' not in g:
        user = os.environ.get("ME_CONFIG_MONGODB_ADMINUSERNAME")
        passwd = os.environ.get("ME_CONFIG_MONGODB_ADMINPASSWORD")
        g.mg_client = MongoClient("mongodb://%s:%s@%s:27017/" % (user, passwd, "db"))
        g.db = g.mg_client.iot
        print(user, passwd, g.mg_client, g.db)
    return g.db

def insert_record_mongo(r):

    m = hashlib.md5()
    m.update(r["sensor_data"].encode('utf-8'))
    dhash = m.hexdigest()[:30]

    #db = get_db_mongo()
    # db.sensors.insert({
    #     "device": r["dev_id"],
    #     "ts": r["ts"],
    #     "seq": r["seq_no"],
    #     "data": r["sensor_data"][0:32],
    #     "size": r["data_size"],
    #     "hash": dhash
    # })
    url = "http://curator-app:8040/api/records"

    headers = {'content-type': "application/json",
               'authorization': "eyJhbGciOiJIUzUxMiIsImlhdCI6MTYxMzU2OTkwNSwiZXhwIjoyNjEzNTY5OTA0fQ.eyJwdWJsaWNfa2V5IjoiMDIyZDlhMzRiNzg5NjEwZGFiZWQ2OTFlYzAzYjJlYmRjZjFmZjNmMDc5MjAxYjk5ODZjNGNlZDI4NGU5ZDZmZjRmIn0.bzE2is5pJCVdC0gxpGQLAx9mMr5QmRmQNG2PHWgiGMfqEFWaYJbKemFmM62Y58qp-JinN9dLwDLWPU0lufI8jA",
               'cache-control': "no-cache",
               'postman-token': "020d861f-2c66-35f3-b647-f18f23fcfc28"}

    payload = {"record_id": uuid.uuid4().hex,
               "device": str(r["dev_id"]),
               "ts": str(r["ts"]),
               "seq": str(r["seq_no"]),
               "ddata": str(r["sensor_data"][0:32]),
               "dsize": str(r["data_size"]),
               "dhash": str(dhash)}
    L.info("###before post ##")
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
    L.info("###post res ###")
    L.info(response)
def query_record_mongo(page):
    db = get_db_mongo()
    records = []
    for r in db.sensors.find().limit(10).skip(page * 10):
        records.append(r)
    return records

@app.route("/sensor/add", methods = ['POST'])
def add_sensor_record():

    data = json.loads(request.get_data())
    L.info("####main -- add_sensor_record -- before insert####")
    insert_record_mongo(data)
    L.info("####main -- add_sensor_record -- after insert####")
    return jsonify({"status": "SUCCEEED"})

@app.route("/sensor/query/<int:page>")
def query_sensor_record(page):
    return jsonify(query_record_mongo(page))

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host="0.0.0.0", debug=False, port=80)