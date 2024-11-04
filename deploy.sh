#should be placed alongside the project radio
echo "Radio.Best deploy start"
cd radio
git pull origin HEAD
npm --prefix ./frontend/client install
npm --prefix ./frontend/client run build -- --emptyOutDir
echo "Radio.best frontend built"
go build -o ./build/main .
echo "Radio.Best backend built. Restarting..."
sudo systemctl restart radiobest
echo "Radio.Best deploy finished"