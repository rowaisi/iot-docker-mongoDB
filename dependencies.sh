chmod +x clean.sh
chmod +x replicaset.sh
chmod +x monitor/start.sh
chmod +x networks/fabric-v2.2/start_network_five_peers.sh
chmod +x networks/fabric-v2.2/network.sh
chmod +x networks/fabric-v2.2/cleanNetwork.sh
chmod +x networks/fabric-v2.2/addPeer.sh
chmod +x networks/fabric-v2.2/deployCC.sh
chmod +x networks/fabric-v2.2/addPeer.sh
chmod +x networks/fabric-v2.2/drop-node.sh

sudo apt install mongodb-clients
sudo apt-get install python3-venv
apt-get install python3-venv0
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
