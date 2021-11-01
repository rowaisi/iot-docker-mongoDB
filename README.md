

<a name="top"></a>

# Manual for using Blockcompass 

## Overview

BlockCompass is a benchmarking performance tool for blockchain platforms. Currently Hyperledger Fabric, Hyperledger Sawtooth and Ethereum are supported.  BlockCompass supports multiple performance indicators including resource consumption (CPU, Memory, Network Input and Network Output), latency, transmission rate, throughput and error rate. It also provides a real time chart and the possibility to export a detailed report. 


## Minimum Requirement

OS  => Ubuntu 18.04

CPU  => 2 vCPUs

Memory  => 8GB RAM

Disk Space  => 25 GB (Might need more for Ethereum Proof Of Work)



## Prerequisites

<details><summary>docker / docker compose</summary>


1. install docker either from the officiel documentation https://docs.docker.com/engine/install/ubuntu/, or following the next steps
  
 #### 1.1 Manual installation 
```
sudo apt update 
sudo apt install apt-transport-https ca-certificates 
curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce  
```
#### 1.2 Run docker without sudo  

  

```
sudo usermod -aG docker ${USER}
su - ${USER}

```
2.  install docker compose either from the officiel documentation https://docs.docker.com/compose/install/, or following the next steps

```
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```


</details>




<details><summary>nodeJS version 10.22.0</summary>


1. Install nodeJS version 10.22.0
  
####  1.1 Manual installation 
```
 cd ~
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
sudo apt install build-essential
```



</details>

<details><summary>Python / mongoDB Client</summary>


1. Python is by default installed in ubuntu 18.04 distribution, to update python run the following commands:
  

```
sudo apt update
sudo apt -y upgrade
```

  2.  Install Additional Tools
  
```
sudo apt install -y python3-pip
sudo apt install libssl-dev libffi-dev python3-dev 
sudo apt install -y python3-venv
```

  3.  Install mongoDB Client
```
sudo apt install mongodb-clients

```
  
</details>


<details><summary> Virtual environment </summary>


#### 1. Clone repository
  

```
git clone https://github.com/polytechnique-ease/blockcompass
```

####  2.  Set virtual environment and install requirement
  
```
cd blockcompass
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

 #### 3.  Install mongoDB Client
```
sudo apt install mongodb-clients

```
  
</details>



</details>

<details><summary>Hyperledger Fabric</summary>


#### 1.  Download binaries and pull docker images for Fabric v2.2


```

   curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9

```

####  2.   Using bash_profile to add Hyperledger Fabric bin permanently to the PATH environment variable

  
```
sudo nano ~/.profile
  
## At the end of the file, add this line:
export PATH=<path to fabric-sample location>/bin:$PATH
  
source ~/.profile

```

 #### 3.  Install Golang 1.17
```
cd ~
curl -O https://dl.google.com/go/go1.17.linux-amd64.tar.gz
tar xvf go1.17.linux-amd64.tar.gz
sudo chown -R root:root ./go
sudo mv go /usr/local
sudo nano ~/.profile
  
## At the end of the file, add this line:
export PATH=$PATH:/usr/local/go/bin
  
source ~/.profile


```

#### 4. Set ABRIC_CFG_PATH variable: 
```
sudo nano ~/.profile
  
## At the end of the file, add this line:
export FABRIC_CFG_PATH=<Absolute PATH to iot-docker-mongoDB folder>/networks/fabric-v2.2/config

source ~/.profile


```
  
</details>
  
  
 ## Get Started
  
  
  <details><summary>Step1 : Configuration</summary>


#### 1.  ReplicaSet
  
  1.1  In the configuration/blockchain.yaml file, change the IP address in replicaSet field by your local IP address. 

    replicaSet:
 -  'IP:27011'
 -  'IP:27012'
 -  'IP:27013'
    
```
chmod +x replicaset.sh
```

1.2 In the replicaset.sh file, change the IP address by your IP address. 


#### 2. Network Configuration:

  In the configuration/blockchain.yaml file set the target Blockchain in Blockchain.type field, allowed values are: ethereum-clique, ethereum-pow, sawtooth-pbft, sawtooth-raft, sawtooth-poet and fabric.
    
    

#####  2.1 Ethereum Configuration 

  Check the user manual page 7 for more details. You can keep the default setting and change the IP address with yours.

  
##### 2.2  Ethereum Proof Of work 
    
   Only for Ethereum Proof Of work, you need to start the Network before launching the platform

 ```
  cd blockcompass/networks/ethereum-docker-pow
  docker-compose up 
```
    
Then you need to wait for the DAG to generate, depending on the resource it might take up to 45min.
    
##### 2.3  Frontend Client Configuration
    
If you are going to access the frontend from the same machine that you runned the application on, you can skip this part. Otherwise you need to have a public IP address to access the frontend from another machine and you need to open port 4200.

    
 ```
  cd blockcompass/front/src/enviroments
 ```
   
  In environments.ts and environment.prod.ts files, change localhost by your public IP address in apiUrl and SOCKET_ENDPOINT fields.

#### 2.4 Workload configuration
    
#####  2.4.1  Schedule configuration
   
      
workload/IOT/schedule.list file holds the information about the distributions of users in time.  The file is in the form of a list with two columns: the first column indicates the number of users, and the second column represents the time in seconds that those individuals will be simulated.
 
   
 #####  2.4.2 Users configuration
      
workload/IOT/sensors.list file holds information about the type of user and emission rate per type. The file is in the form of a list with two columns: the first column indicates the user type and the second column represents the emission rate.

   
    
</details>


</details>

<details><summary>Step2 :  Activate virtual environment</summary>
  
  
  ```
  cd blockcompass
  source env/bin/activate    
 ```
  
</details>
  
</details>

<details><summary>Step3 :  Launch the platform</summary>
  
  
  ```
  cd blockcompass
  python laucher.py   
 ```
  
</details>

 ## Clean Up
 
 ```
./clean.sh  
 ```

<br> *You can cite the following papers for this project:*

