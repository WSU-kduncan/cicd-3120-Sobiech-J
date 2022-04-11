# kill any current bird website containers then delete any unused images and containers
docker kill bird-website
yes | docker system prune
#Get updated image
docker pull sobiechj/wsu-ceg3120-bird-website:latest
#Create container from image
docker run -d --rm --name bird-website -p 80:80 sobiechj/wsu-ceg3120-bird-website:latest
