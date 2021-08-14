import os
import sys
import logging
import json
import random
import time
import csv
import wave
import asyncio
import aiohttp
import pymongo
import yaml
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s]: %(message)s'
)

L = logging.getLogger()

gps_paths = []
wave_data = []


def load_gps_paths():
    with open('gps_path.txt', 'r') as gpsfile:
        p = csv.reader(gpsfile, delimiter='\t')
        for row in p:
            if len(row) >= 3:
                r = [float(row[0]), float(row[1]), float(row[2])]
                gps_paths.append(r)
    L.info("GPS paths: %d rows" % len(gps_paths))


def load_wave():
    waveFile = wave.open('asd.wav', 'rb')
    params = waveFile.getparams()
    # params:  (2, 2, 48000, 2880000, 'NONE', 'not compressed')
    rate = float(params[2])
    frames = waveFile.getnframes()
    # number of frames aggregated in each timestamp
    splPerTs = rate / 120
    asdWrapLimit = int(params[3] / splPerTs)
    for i in range(0, asdWrapLimit):
        data = waveFile.readframes(int(splPerTs))
        wave_data.append(data)
    L.info("Wave data: %d flames" % len(wave_data))


# Load settings of sensors from path
# File format: Each line:
# sensor_type sensor_settings
def load_sensors_settings(path):
    sensors = []
    with open(path) as f:
        for line in f.readlines():
            ss = line.strip().split(" ")
            if (len(ss) >= 1):
                sensors.append(ss)
    return sensors


# Load settings of schedule from path
# File format: Each line:
# num_sensors runtime
def load_schedule_settings(path):
    scheds = []
    with open(path) as f:
        for line in f.readlines():
            ss = line.strip().split(" ")
            if (len(ss) == 2):
                scheds.append((int(ss[0]), int(ss[1])))
            # elif(len(ss) != 0):
            #    L.warning("Schedule configs: Unsupported format: " + str(ss))

    return scheds


# Generate messages from device sensor
# ON / OFF
def get_device_sensor_msg(sensor):
    val = random.choice(["OFF", "ON"])
    valString = str(val)
    n = 8
    for i in range(n):
        valString += valString

    msg = {
        "dev_id": str(sensor["id"]),
        "ts": round(time.time(), 5),
        "seq_no": sensor["seqno"],
        "data_size": len(valString),
        "sensor_data": str(valString)
    }
    sensor["seqno"] += 1
    st = random.gauss(sensor["mean"], sensor["sigma"])
    return json.dumps(msg), st


# Generate messages from temperature sensor
# the temperature value
def get_temp_sensor_msg(sensor):
    val = str(round(random.normalvariate(sensor["mean"], 10), 1))
    valString = str(val)
    n = 8
    for i in range(n):
        valString += valString
    valString += " C"
    msg = {
        "dev_id": str(sensor["id"]),
        "ts": round(time.time(), 5),
        "seq_no": sensor["seqno"],
        "data_size": len(valString),
        "sensor_data": str(valString)
    }
    sensor["seqno"] += 1
    st = sensor["interval"]
    return json.dumps(msg), st


# Generate messages from gps sensor
# the position value
def get_gps_sensor_msg(sensor):
    j = sensor["spot"]
    val = "(%f,%f)" % (gps_paths[j][0], gps_paths[j][1])
    valString = str(val)
    n = 8
    for i in range(n):
        valString += valString
    msg = {
        "dev_id": str(sensor["id"]),
        "ts": round(time.time(), 5),
        "seq_no": sensor["seqno"],
        "data_size": len(valString),
        "sensor_data": str(valString)
    }

    sensor["seqno"] += 1
    if sensor["dir"]:
        j += 1
        if j >= len(gps_paths):
            j = len(gps_paths) - 2
            sensor["dir"] = False
    else:
        j -= 1
        if j < 0:
            j = 1
            sensor["dir"] = True
    sensor["spot"] = j
    st = sensor["interval"]

    return json.dumps(msg), st


# Generate messages from camera value
# NO_MOTION or video value
def get_camera_sensor_msg(sensor):
    new_motion = False
    if sensor["motion"]:
        fps = sensor["fps"]
        bitrate = int(random.uniform(sensor["bitrate"] / 4, sensor["bitrate"]))
        val = os.urandom(int(bitrate / 8 / fps))
        st = float(1.0 / fps)
        sensor["cur_time"] += st
        if sensor["cur_time"] > sensor["motion_time"]:
            new_motion = True
    else:
        val = "NO_MOTION"
        st = sensor["motion_time"]
        new_motion = True

    if new_motion:
        sensor["motion"] = (random.choice([0, 1]) == 1)
        sensor["motion_time"] = float(random.uniform(1, 10))
        sensor["cur_time"] = 0

    valString = str(val)
    n = 8
    for i in range(n):
        valString += valString
    msg = {
        "dev_id": str(sensor["id"]),
        "ts": round(time.time(), 5),
        "seq_no": sensor["seqno"],
        "data_size": len(valString),
        "sensor_data": valString
    }
    sensor["seqno"] += 1
    return json.dumps(msg), st


# Generate messages from ASD sensor
# Sound value
def get_asd_sensor_msg(sensor):
    n = 8
    j = sensor["spot"]
    val = str(wave_data[j])
    for i in range(n):
        val += str(val)
    msg = {
        "dev_id": str(sensor["id"]),
        "ts": round(time.time(), 5),
        "seq_no": sensor["seqno"],
        "data_size": len(val),
        "sensor_data": str(val)
    }
    sensor["seqno"] += 1
    st = 1 / sensor["sps"]
    sensor["spot"] = (j + round(120 / sensor["sps"])) % len(wave_data)

    return json.dumps(msg), st


# Initialize the sensor
def init_sensor(simulator, id, config):
    session = aiohttp.ClientSession()
    t = {
        "url": simulator["url"],
        "session": session,
        "id": config[0] + "_" + str(id),
        "seqno": 0
    }
    if config[0] == "device":
        t["mean"] = float(config[1])
        t["sigma"] = float(config[2])
        t["func"] = get_device_sensor_msg
    elif config[0] == "temp":
        t["interval"] = float(config[1])
        t["mean"] = random.uniform(-30, 50)
        t["func"] = get_temp_sensor_msg
    elif config[0] == "gps":
        t["interval"] = float(config[1])
        t["dir"] = True
        t["spot"] = random.randrange(0, len(gps_paths), 1)
        t["func"] = get_gps_sensor_msg
    elif config[0] == "camera":
        t["fps"] = int(config[1])
        t["bitrate"] = int(config[2])
        t["motion"] = (random.choice([0, 1]) == 1)
        t["motion_time"] = float(random.uniform(1, 10))
        t["cur_time"] = 0
        t["func"] = get_camera_sensor_msg
    elif config[0] == "asd":
        t["sps"] = int(config[1])
        t["spot"] = random.randrange(0, len(wave_data), 1)
        t["func"] = get_asd_sensor_msg
    else:
        L.error("Sensor %d: No such type" % id)
    return t


# Send the message to the server
async def send_sensor_msg(session, url, msg):
    # L.info("Url: %s, data: %s" % (url, msg))
    headers = {'content-type': 'application/json'}
    try:
        async with session.post(url, data=msg, headers=headers) as resp:
            if resp.status == 200:
                return True
            else:
                return False
    except:
        return False


# Run the id-th sensor
async def run_sensor(simulator, id, config):
    L.info("Sensor %d: Start %s" % (id, str(config)))
    sensor = init_sensor(simulator, id, config)
    metrics = simulator["metrics"]

    while (id < simulator["cur_sensors"]):
        msg, st = sensor["func"](sensor)
        # L.info("Sensor %d: Send %d bytes, Sleep %.2f" % (id, len(msg), st))
        starttime = time.time()
        success = await send_sensor_msg(sensor["session"], sensor["url"], msg)
        endtime = time.time()

        if success:
            # send request
            metrics[0] += 1
            # latency
            metrics[2] += endtime - starttime
        else:
            # error request
            metrics[1] += 1

        diff = st - (endtime - starttime)
        if diff > 0:
            await asyncio.sleep(st)

    await sensor["session"].close()
    L.info("Sensor %d: Exit" % id)


# Start new sensors
def start_sensors(simulator, new_sensors, configs):
    num_configs = len(configs)
    old_sensors = simulator["cur_sensors"]
    simulator["cur_sensors"] = new_sensors
    for i in range(old_sensors, new_sensors):
        config = configs[i % num_configs]
        task = simulator["loop"].create_task(run_sensor(simulator, i, config))
        # simulator["tasks"].append(task)


# Stop current sensors
def stop_sensors(simulator, new_sensors):
    simulator["cur_sensors"] = new_sensors
    # old_tasks = []
    # for i in range(len(simulator["tasks"]), new_sensors, -1):
    #    old_tasks.append(simulator["tasks"].pop())
    # return old_tasks
def insertToDB(collection, item):
    collection.insert_one(item)

def get_collection():
    connection_string = []
    with open("/configuration/blockchain.yaml", 'r') as stream:
        try:
            loaded_config = yaml.safe_load(stream)
            if (loaded_config['replicaSet']):
                connection_string = loaded_config['replicaSet']
        except yaml.YAMLError as exc:
            L.error(exc)

    client = pymongo.MongoClient(connection_string
                                 , replicaSet='rs0')
    collection = client.benchmarker.performance
    return collection


# Do statistics and output
async def do_statistics(simulator, interval, collection):
    metrics = simulator["metrics"]
    with open("run/metrics.csv", "w") as f:
        f.write("Time,Sensors,Requests,success,ErrorRate,AvgLatency\n")
        while simulator["running"]:
            await asyncio.sleep(interval)

            avgLatency = metrics[2] / metrics[0] * 1000 if metrics[0] > 0 else 0.0
            allRequests = metrics[0] + metrics[1]
            succRequests = metrics[0]
            errorRate = metrics[1] / allRequests if allRequests > 0 else 0.0

            L.info("METRIC: %d sensors, %.2f seconds, %d requests, %d success , Error Rate: %.2f, Average Latency: %.2f ms" %
                   (simulator["cur_sensors"], interval, allRequests, succRequests, errorRate, avgLatency))

            t = time.localtime()
            f.write("%02d:%02d:%02d,%d,%d,%d,%.2f,%.2f\n" % (t.tm_hour, t.tm_min, t.tm_sec,
                                                          simulator["cur_sensors"],
                                                          allRequests, succRequests, errorRate, avgLatency))

            data = {
                "time": datetime.now(),
                "sensors": simulator["cur_sensors"],
                "allRequests": allRequests,
                "succRequests": succRequests,
                "errorRate": errorRate,
                "avgLatency": avgLatency

            }
            insertToDB(collection, data)
            metrics[0] = 0
            metrics[1] = 0
            metrics[2] = 0.0


# Run the scheduler
async def run_scheduler(simulator, schedules, sensors, collection):
    simulator["loop"].create_task(do_statistics(simulator, 10, collection))
    for sched in schedules:
        L.info("%d sensors in %d seconds" % sched)
        if sched[0] > simulator["cur_sensors"]:
            start_sensors(simulator, sched[0], sensors)
        else:
            stop_sensors(simulator, sched[0])
        await asyncio.sleep(sched[1])
    tasks = stop_sensors(simulator, 0)
    simulator["running"] = False
    await asyncio.sleep(12)


def main(argv):
    if len(argv) != 2:
        L.error("Usage: %s server_url" % argv[0])
        return
    collection = get_collection()
    load_gps_paths()
    load_wave()
    sensors = load_sensors_settings("run/sensors.list")
    schedules = load_schedule_settings("run/schedule.list")
    loop = asyncio.get_event_loop()
    metrics = [0, 0, 0.0]
    simulator = {
        "url": argv[1],
        "loop": loop,
        "cur_sensors": 0,
        "tasks": [],
        "metrics": metrics,
        "running": True
    }
    loop.run_until_complete(run_scheduler(simulator, schedules, sensors,collection))
    loop.close()


if __name__ == "__main__":
    main(sys.argv)