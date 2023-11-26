1. To start dev server

  #Start db service
  
  sudo systemctl start scylla-server
  
  air -c .air.toml & npm --prefix ./frontend/client run build:watch
  (This will run go build with hot reload and building to ./build/main and vite build watching frontend/client building to ./public )
  To do:
    - add bun server start script for ssr in feature

2. To build project
  go build -o ./build/main & npm --prefix ./frontend/client run build // add bun built script