Backup database

#enter docker container
docker exec -it scylla_radio bash

#create snapshot
nodetool snapshot app

cd /var/lib/scylla/data

#zip snapshot
tar czf app.tar.gz app

#copy snapshot archive to local machine ("root" folder)
sudo docker cp scylla_radio:/var/lib/scylla/data/app.tar.gz .

#copy snapshot archive to local machine
scp -P 56777 root@45.66.248.26:/root/app.tar.gz .

#copy snapshot archive to docker container
docker cp app.tar.gz scylla_radio:/var/lib/scylla/data

docker exec -it scylla_radio supervisorctl stop scylla

#inside docker container 

rm -rf /var/lib/scylla/data/app

#unzip snapshot archive 
tar -xvzf app.tar.gz

#outside docker container
docker exec -it scylla_radio supervisorctl start scylla