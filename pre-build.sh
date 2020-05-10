npm run build
sudo chmod 777 -R dist 
sudo rm -Rf /usr/share/lightdm-webkit/themes/lightdm-webkit-theme-osmos/*
sudo cp -r ./dist/* /usr/share/lightdm-webkit/themes/lightdm-webkit-theme-osmos