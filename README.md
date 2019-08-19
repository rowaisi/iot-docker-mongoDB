1. Build

docker-compose build

2. Set the configuration of sensors

* Edit IoT/schedule.list
-- For example
5 10
10 10
-- means simulating 5 sensors in 10 senconds and then 10 sensors in 10 seconds
-- You can also simulate 0 sensors to simulate sleeping.

* Edit IoT/sensors.list
-- For example
temp 1
device 5 1
gps 2
asd 24
camera 15 50000
-- means: the first sensor will be a temperature sensor which reports the temperature every 1 seconds
-- the second sensor will be a device sensor which reports ON or OFF in every 5 seconds (Gaussian distribution with the mean value 5 and the standard deviation value 1
-- the third sensor will be a gps sensor which reports a position every 2 seconds
-- the forth sensor will be a sound sensor which reports sound data and samples per second is set to 24
-- the fifth sensor will be a camera sensor whill reports video data and FPS(frames per second) is set to 15 and bits per second is set to 50000.
-- the sixth sensor will be a temperature sensor
-- and so on

3. Run

* Start simulation
docker-compose up -d
-- then the iot container will start the simulation after 10 seconds

* Start auto scale
python3 auto-scale.py
-- Run "python3 auto-scale --help" to see the help information
-- Set mimimun containers with -m
-- Set maximum containers with -M
-- Set down-scale cpu threshold with -d
-- Set up-scale cpu threshold with -u
-- Set checking interval with -i

4. View the database
Access http://127.0.0.1:8081 and the database name is 'iot', the collection name is 'sensors'.

5. How
It starts a 'db' containter for database, 
one/many 'web' containers for receiving iot data and storing in the database, 
a 'haproxy' container for balancing requests to 'web' containers,
and an 'iot' container for generating iot data.
Besides, it starts a 'dbmanager' for providing http://127.0.0.1:8081 for managing the database, 
a 'cadvisor' for monitoring all containers.
