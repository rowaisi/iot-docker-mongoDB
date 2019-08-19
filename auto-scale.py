import os
import sys
import getopt
import re
import time
from datetime import datetime
import requests

use_cpu_utilization = True

url = "http://localhost:8086/status"
min_containers = 1
max_containers = 6
target_container = "web"
check_interval = 10
up_threshold = 85 if use_cpu_utilization else 20
down_threshold = 60 if use_cpu_utilization else -1
log_cpu_path = "utils.csv"


def printSetting():
    print("Target container:\t%s" % target_container)
    if not use_cpu_utilization:
        print("Nginx status url:\t%s" % url)
    print("Min containers:  \t%d" % min_containers)
    print("Max containers:  \t%d" % max_containers)
    print("Check interval:  \t%d seconds" % check_interval)
    if use_cpu_utilization:
        print("Up threshold:    \t> %.2f%% cpu utilization" % up_threshold)
        print("Down threshold:  \t< %.2f%% cpu utilization" % down_threshold)
    else:
        print("Up threshold:    \t> %d waiting requests" % int(up_threshold))
        print("Down threshold:  \t< %d waiting requests" % int(down_threshold))

def printUsage():
    print(
"""
Usage: %s [options]
    -h or --help: show help info
    -l url or --link=url: the status url of nginx
    -m min_containers or --min=min_containers: the min number of containers
    -M max_containers or --max=max_containers: the max number of containers
    -t target_container or --target=target_container: the target container
    -i check_interval or --interval=check_interval: the checking interval
    -u up_threshold or --up=up_threshold: the threshold for scaling up
    -d down_threshold or --down = down_threshold: the threshold for scaling down
"""
    % (sys.argv[0], ))


def get_current_containers():
    num = 0
    pattern = re.compile(r".*_%s_\d+$" % target_container)
    with os.popen("docker-compose ps") as f:
        for s in f.readlines():
           if "Up" in s:
               ss = s.split()
               if ss and pattern.match(ss[0]):
                   num += 1
    return num
               

def check_nginx_status():
    try:
        r = requests.get(url, timeout = 5)
    except requests.exceptions.RequestException:
        return -1, "Timeout"

    if need_scale != 1:
        if r.status_code == 200:
            pattern = re.compile(r"Waiting: (\d+)")
            m = pattern.search(r.text)
            if m:
                num_waitings = int(m.group(1))
                return num_waitings, None
            else:
                return -1, "No match"
        else:
            return -1, "Error status code: " + str(r.status_code)
            
    return need_scale

def scale_with_nginx_status():
    need_scale = 0

    print("INFO:\tGetting nginx status")
    num_waitings, msg = check_nginx_status()
    if num_waitings == -1:
        if msg == "Timeout":
            need_scale = 1
            print("INFO:\tTimeout, scaling up ...")
        else:
            print("WARNING: " + msg)
    elif num_waitings > up_threshold:
        print("INFO:\tToo many waiting requests (%d > %d), scaling up ..." % 
            (num_waitings, up_threshold))
        need_scale = 1
    elif num_waitings < down_threshold:
        print("INFO:\tToo few waiting requests (%d < %d), scaling down ..." % 
            (num_waitings, down_threshold))
        need_scale = -1
    else:
        print("INFO:\tCurrently %d waiting requests" % num_waitings)

    return need_scale

def check_cpu_utilization(log_file):
    pattern = re.compile(r".*_%s_\d+$" % target_container)
    cpus = []
    mems = []
    with os.popen("docker stats --no-stream") as f:
        for s in f.readlines():
           ss = s.split()
           if len(ss) >= 3 and pattern.match(ss[1]):
               cu = float(ss[2].replace("%", ""))
               cpus.append(cu)
               mem = float(ss[6].replace("%", ""))
               mems.append(mem)
               print("INFO: container %s: cpu %.2f%%, mem %.2f%%" % (ss[1], cu, mem))
    num = len(cpus)
    avg_cpu = sum(cpus) / num if num > 0 else -1
    avg_mem = sum(mems) / num if num > 0 else -1
    log_file.write("%s,%d,%.2f,%.2f,%s\n" % (datetime.now().strftime("%H:%M:%S"), 
        num, avg_cpu, avg_mem,
        ",".join("%.2f,%.2f" % (cpus[i], mems[i]) for i in range(num))))
    log_file.flush()
    return avg_cpu

def scale_with_cpu_utilization(log_file):
    need_scale = 0

    print("INFO:\tGetting cpu utilizations")
    avg_cu = check_cpu_utilization(log_file)
    if avg_cu < 0:
        print("INFO:\tNo containers, scaling up ...")
        need_scale = 1
    elif avg_cu > up_threshold:
        print("INFO:\tToo busy (%.2f%% > %.2f%%), scaling up ..." % 
            (avg_cu, up_threshold))
        need_scale = 1
    elif avg_cu < down_threshold:
        print("INFO:\tToo free (%.2f%% < %.2f%%), scaling down ..." % 
            (avg_cu, down_threshold))
        need_scale = -1
    else:
        print("INFO:\tCurrently %.2f%% cpu utilization" % avg_cu)

    return need_scale

try:
    opts, args = getopt.getopt(sys.argv[1:], 
        "hl:m:M:t:i:u:d:", 
        ["help", "link=", "min=", "max=", "target=", "interval=", "up=", "down="]
    )
except getopt.GetoptError:
    print("Error: Invalid arguments!")
    sys.exit(-1)

for cmd, arg in opts:
    if cmd in ("-h", "--help"):
        printSetting()
        print("")
        printUsage()
        sys.exit(0)
    elif cmd in ("-l", "--link"):
        url = arg
    elif cmd in ("-m", "--min"):
        min_containers = max(1, int(arg))
    elif cmd in ("-M", "--max"):
        max_containers = int(arg)
    elif cmd in ("-t", "--target"):
        target_container = target_container
    elif cmd in ("-u", "--up"):
        up_threshold = float(arg)
    elif cmd in ("-d", "--down"):
        down_threshold = float(arg)
    elif cmd in ("-i", "--interval"):
        check_interval = int(arg)

printSetting()
print("")

log_file = open(log_cpu_path, "w+")
log_file.write("Time,Num,AvgCPU,AvgMEM,C1CPU,CIMEM,...\n")

while True:
    start_time = time.time()

    print("INFO:\tStart checking ...")

    num_containers = get_current_containers()
    print("INFO:\tCurrently %d %s containers" % (num_containers, target_container))

    if use_cpu_utilization:
        need_scale = scale_with_cpu_utilization(log_file)
    else:
        need_scale = scale_with_nginx_status()

    if need_scale == 1:
        if num_containers >= max_containers:
            print("WARNING:\tUnable to scale up for it already has %d contaienrs" % num_containers)
        else:
            os.system("docker-compose up -d --scale %s=%d %s" % 
                (target_container, num_containers + 1, target_container))
    elif need_scale == -1:
        if num_containers <= min_containers:
            print("WARNING:\tNeed not scale down for it only has %d containers" % num_containers)
        else:
            os.system("docker-compose up -d --scale %s=%d %s" %
                (target_container, num_containers - 1, target_container))

    end_time = time.time()
    sleep_time = check_interval - (end_time - start_time)

    print("INFO:\tFinish checking. Sleeping %.2f seconds ...\n" % sleep_time)
    if sleep_time > 0:
        time.sleep(sleep_time)

log_file.close()
