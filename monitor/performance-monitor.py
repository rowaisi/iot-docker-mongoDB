import time
import os
import sys
import getopt
import re
import time
from datetime import datetime

import pymongo

check_interval = 10


def get_collection():
    client = pymongo.MongoClient(['192.168.1.15:27011', '192.168.1.15:27012', '192.168.1.15:27013']
                                 , replicaSet='rs0')
    collection = client.benchmarker.benchmarker
    # collection.drop()
    return collection


def insertToDB(collection, item):
    collection.insert_one(item)




def check_utilization(target, collection):
    cpus = []
    mems = []
    net_is = []
    net_os = []
    names = []
    pattern = re.compile(r".*%s.*" % target)
    patternDev = re.compile(r".*%s.*" % "dev")
    order = re.compile(r".*%s.*" % "order")
    orderCa = re.compile(r".*%s.*" % "ca")

    with os.popen("sudo docker stats --no-stream") as f:
        for s in f.readlines():
            ss = s.split()
            if len(ss) >= 3 and (pattern.match(ss[1]) or order.match(ss[1])) \
                    and (not patternDev.match(ss[1]) and not orderCa.match(ss[1])):
                name = ss[1].replace("example.com", "")
                names.append(name)
                cu = float(ss[2].replace("%", ""))
                cpus.append(cu)
                mem = float(ss[6].replace("%", ""))
                mems.append(mem)
                net_i = toBytes(ss[7])
                net_o = toBytes(ss[9])
                if net_o is None:
                    net_o = 0
                if net_i is None:
                    net_i = 0
                net_is.append(net_i)
                net_os.append(net_o)


                print("INFO: container %s: cpu %.2f%%, mem %.2f%%, net_i %d B, net_o %d B" % (
                    name, cu, mem, net_i, net_o))

    num = len(cpus)
    avg_cpu = sum(cpus) / num if num > 0 else -1
    avg_mem = sum(mems) / num if num > 0 else -1
    avg_net_i = sum(net_is) / num if num > 0 else -1
    avg_net_o = sum(net_os) / num if num > 0 else -1
    data = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "avgCPU": avg_cpu,
        "avgMEM": avg_mem,
        "avgNetI": avg_net_i,
        "avgNetO": avg_net_o
    }
    insertToDB(collection, data)


def toBytes(transform):
    r = re.compile("([-+]?\d*\.\d+|\d+)([a-zA-Z]+)")
    match = r.match(transform)

    if match:
        value = match.group(1)
        unit = match.group(2)
        unit = unit.lower()
        if value is None:
            return 0
        if unit == "kb":
            return float(value) * 1000
        if unit == "mb":
            return float(value) * 1000000
        if unit == "gb":
            return float(value) * 1000000
    else:
        raise Exception("error formation %s", transform)


def main():
    collection = get_collection()
    if len(sys.argv) != 2 or sys.argv[1] == '-h':
        print("Usage: %s (-e or -s or -f)" % sys.argv[0])
        sys.exit(-1)
    source = ""
    target = sys.argv[1]
    if target == "-s":
        source = "validator"
    elif target == "-f":
        source = "peer"
    elif target == "-e":
        source = "miner"
    else:
        print("target must be sawtooth, fabric or ethereum")
        exit(0)
    while True:
        start_time = time.time()
        print("INFO:\tStart checking ...")
        check_utilization(source, collection)
        end_time = time.time()
        sleep_time = check_interval - (end_time - start_time)
        print("INFO:\tFinish checking. Sleeping %.2f seconds ...\n" % sleep_time)
        if sleep_time > 0:
            time.sleep(sleep_time)


if __name__ == "__main__":
    main()
