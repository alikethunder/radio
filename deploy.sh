#should be placed alongside the project radio
#to make file executable
# chmod +x ./deploy.sh
echo "Radio.Best deploy start"
cd radio
git pull origin HEAD
echo "installing client dependencies"
npm --prefix ./frontend/client install
echo "installing frontend server dependencies"
bun install --cwd ./frontend/server
echo "building client"
npm --prefix ./frontend/client run build -- --emptyOutDir
echo "building server"
go build -o ./build/main .
echo "Restarting ssr"
sudo systemctl restart radiobestssr
echo "Restarting server"
sudo systemctl restart radiobest
echo "Radio.Best deploy finished"