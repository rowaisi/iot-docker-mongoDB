 Step 1: start the mongo databases
 
 ```
 docker-compose -f docker-compose-mongo-replicaset.yml up
 or
 docker-compose -f docker-compose-mongo-replicaset.yml up -d
 ```
 
 Step 2: exec into one of the mongos:
 
 ```
 docker exec -it localmongo1 /bin/bash
 ```
 
 Step 3: access mongo console
 
 ```
 mongo
 ```
 
 Step 4: configure replica set by pasting the following, 
 change 192.168.1.15 with your local IP address
 
 ```
 rs.initiate(
   {
     _id : 'rs0',
     members: [
       { _id : 0, host : "192.168.1.15:27011" },
       { _id : 1, host : "192.168.1.15:27012" },
       { _id : 2, host : "192.168.1.15:27013" }
     ]
   }
 )
 ```