echo "[x] start mongodb replicaset"
docker-compose -f docker-compose-mongo-replicaset.yml up -d
sleep 5
echo "[x] initiate replicaset"
echo $IP
if [ -n "$IP" ]; then
  echo "You supplied the first parameter!"
else
  echo "you must set IP variable"
fi

mongo --host "${IP}:27011"<<EOF

rs.initiate(
   {
     _id : 'rs0',
     members: [
       { _id : 0, host : "${IP}:27011" },
       { _id : 1, host : "${IP}:27012" },
       { _id : 2, host : "${IP}:27013" }
     ]
   }
 )
EOF
