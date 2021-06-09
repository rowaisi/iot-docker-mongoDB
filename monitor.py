import os
import sys
import getopt
import re
import time
from datetime import datetime
import requests

target_container = "web"
check_interval = 2
log_cpu_path = "utils.csv"


def getName(target):
    pattern = re.compile(r".*%s.*" % target)
    names = []
    with os.popen("sudo docker stats --no-stream") as f:
        for s in f.readlines():
            ss = s.split()
            if pattern.match(ss[1]):
                names.append(ss[1])
    return names


def check_utilization(target, log_file):
    cpus = []
    mems = []
    net_is = []
    net_os = []
    pattern = re.compile(r".*%s.*" % target)
    with os.popen("sudo docker stats --no-stream") as f:
        for s in f.readlines():
            ss = s.split()
            if len(ss) >= 3 and pattern.match(ss[1]):
                cu = float(ss[2].replace("%", ""))
                cpus.append(cu)
                mem = float(ss[6].replace("%", ""))
                mems.append(mem)
                net_i = float(ss[7].replace("MB", "").replace("MB", ""))
                net_is.append(net_i)
                net_o = float(ss[9].replace("MB", "").replace("KB", ""))
                net_os.append(net_o)
                print("INFO: container %s: cpu %.2f%%, mem %.2f%%, net_i %.3f MB, net_o %.3f MB" % (
                    ss[1], cu, mem, net_i, net_o))

    num = len(cpus)
    avg_cpu = sum(cpus) / num if num > 0 else -1
    avg_mem = sum(mems) / num if num > 0 else -1
    avg_net_i = sum(net_is) / num if num > 0 else -1
    avg_net_o = sum(net_os) / num if num > 0 else -1
    log_file.write("%s,%d,%.2f,%.2f,%.3f,%.3f,%s\n" % (datetime.now().strftime("%H:%M:%S"),
                                                       num, avg_cpu, avg_mem, avg_net_i, avg_net_o,
                                                       ",".join("%.2f,%.2f,%.3f,%.3f" % (
                                                           cpus[i], mems[i], net_is[i], net_os[i]) for i in
                                                                range(num))))


def main():
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
    log_file = open(log_cpu_path, "w+")
    names = getName(source)
    headline = "Time,Num,AvgCPU,AvgMEM,AvgNetI,AvgNetO,"
    for name in names:
        headline += name + "-CPU" + "," + name + "-mem" + "," + name + "-netI" + "," + name + "-netO" + ","
    headline = headline[:-1]
    headline += "\n"

    log_file.write(headline)

    while True:
        start_time = time.time()
        print("INFO:\tStart checking ...")
        check_utilization(source, log_file)
        end_time = time.time()
        sleep_time = check_interval - (end_time - start_time)
        print("INFO:\tFinish checking. Sleeping %.2f seconds ...\n" % sleep_time)
        if sleep_time > 0:
            time.sleep(sleep_time)

    log_file.close()


if __name__ == "__main__":
    main()
