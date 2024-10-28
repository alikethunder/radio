This is a start template with following features:

  - Signin/logout including google oauth
  - password creation
  - verification code
  - email sending using google apps
  - auth cookie managment

Technologies:
  - Scylla db
  - Go
  - Typescript
  - Primereact
  
Prerequisites 

  - install go (1.22.5)
  - install air
  - install scylladb
  - npm install in frontend/client

  - To create dev server for scylladb:
    sudo docker run --name scylla_radio -p 9042:9042 -d scylladb/scylla --smp 1

  - For first run the following commands from cqlsh from terminal:
	  $ docker exec -it scylla_radio cqlsh

	  CREATE KEYSPACE IF NOT EXISTS app WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor': 1};

1. To start dev server

  #Start db service
  
  - start scylladb:
     - ubuntu: sudo systemctl start scylla-server
     - mac: start from docker gui
  
  - start dev server: air -c .air.toml & npm --prefix ./frontend/client run build:watch
  (This will run go build with hot reload and building to ./build/main and vite build watching frontend/client building to ./served/public )

  
  To do:
    - add bun server start script for ssr in feature

2. To build project
  go build -o ./build/main . & npm --prefix ./frontend/client run build // add bun built script


