echo "stop monitor script"
ps aux | grep -i resource-monitor.py | awk '{print $2}' | xargs kill -9


echo "[i] clean fabric network"
cd networks/fabric-v2.2
./cleanNetwork.sh

echo "Stop all containers"
docker stop `docker ps -qa`

echo "Remove all containers"
docker rm `docker ps -qa`

echo "Remove all volumes"
docker volume rm $(docker volume ls -q)

echo "Remove all networks"
docker network rm `docker network ls -q`
