# cicd-3120-Sobiech-J
cicd-3120-Sobiech-J created by GitHub Classroom

## **Overview:**
This project is meant as an example of how to create a new docker image from a base image, and how to manage this image via GitHub and DockerHub.

## **Required Software**

This project requires a Linux distro or a virtual machine such as an Ubuntu WSL2 instance. Docker will also need to be installed as well. For Windows users it is recommended to use Ubuntu in WSL2 and the Docker Desktop app with its WSL2 integration enabled.
  * for a step-by-step guide to installing WSL2, please see [this guide](https://www.windowscentral.com/how-install-wsl2-windows-10)
  * refer to this guide as well as [Microsoft's documentation](https://docs.microsoft.com/en-us/windows/wsl/install) if the abbreviated guide below does not work or you cannot upgrade to the appropriate version of Windows 10 or 11.
An abbreviated guide:
  *  update to Windows 10 version 2004 or higher
  *  Open Windows' PowerShell as Administrator
  *  In PowerShell run the following command: `wsl --install`

You can install docker desktop [from Docker's website](https://docs.docker.com/desktop/windows/install/). In the desktop's app there is an option to enable WSL2 integration in the Settings tab under General section. There are some more detailed instructions on [Docker's documentation](https://docs.docker.com/desktop/windows/wsl/).

Having a GitHub repo is not required but it is highly recomended. To create a repo you need to [create an account at github.com](github.com). For pointers on how to create a repository for your code, take a look at [GitHub's documentation for creating a repo](https://docs.github.com/en/get-started/quickstart/create-a-repo).

## **Part 1: Create a docker image**

First a base image must be installed from Docker Hub. I will use the latest [ubuntu/apache2 image](https://hub.docker.com/r/ubuntu/apache2). The files for this can be found in the ubuntu-apache2-docker folder for this project. As an alternative, I created a container from the [httpd image](https://hub.docker.com/_/httpd) that hosts the same website in apache2. It's files can be found in the httpd-apache2-docker folder in this project. The steps for creating the ubuntu version of the container are laid out below. You may need to create a Docker Hub account to download any base image.

To create a docker image create a folder in WSL2. Place a Dockerfile (with Dockerfile as the name) and any files that will be placed in the base image within this folder. For the apache2 example we want to move the website folder with all of our website contents into the folder with Dockerfile. For later automation to work, if this project is done in a GitHub repo, the Dokerfile you use and all the file it needs need to be in the root directory of the repository. They cannot be inside another folder within it. In my sample GitHub repository where the READE.md is located, the ubuntu version of the project would be run because its files are in the root directory and the httpd version in the httpd-docker-image folder will be ignored.

When these files are assembled, the new image can be downloaded with a bash command. For the image I am using the command is `docker pull ubuntu/apache2`. The new image will be called "bird-website-apache2".

In the Dockerfile define the details of the image you want to create. Details can be found [on Docker's documentation](https://docs.docker.com/engine/reference/builder/). The Dockerfile for my new image was defined as follows:

```
FROM ubuntu/apache2:latest

RUN rm /var/www/html/index.html
RUN rm /etc/apache2/sites-available/000-default.conf

COPY website /var/www/html/website
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD apachectl -D FOREGROUND
```

**To build the image**
* command to create a new image: `docker build -t bird-website-apache2:latest .`
  * this command must be run while inside of the folder with the dockerfile (that is what the . is referring to)

**To run a container of the image**
* command to run the new image as a container in the Linux command line: `docker run -dit -p 8080:80 bird-website-apache2:latest`
* The container can also be run for the first time from an image inside of the Docker Desktop Windows program. To run a container that way, click on the "Images" tab. Press the green "Run" button that appears when hovering over the desired image.
  * A previously run container can be run again in the Docker Desktop app. It can be found under the Container/Apps tab.

**To check that the container works**
* you can check that the container is running on the specified port (port 8080 for the run config in the Linux command line run command) by going to 127.0.0.1:port on a web browser. The website should be displayed on that port.


## **Part 2: GitHub and DockerHub**

**Create a Docker Hub repository and push image to it**<br>
Create an account on [Docker Hub]( https://hub.docker.com/) if you have not already. When signed it click on the option for "Repositories". Click the "Create Repository" button in the top right of the next webpage. Name the repository and make it public. We will automate the process of pushing images to Docker Hub, but here is the manual process on the command line to outline what is being automated.

**Manually pushing an image to Docker Hub**<br>
If you already have a working image and a Docker repository set up, use the following commands on the command line. Change anything in <> to match your information:
* login to docker before using the following commands: `docker login -u <"your-username"> -p <"your-docker-password"> docker.io`
* `docker tag <image-name> <your-username-on-docker-hub>/<your-repository-name>:<image-tag>`
* `docker push <image-name> <your-username-on-docker-hub>/<your-repository-name>:<image-tag>`

**Automating the process**<br>
The next step is most easily done on GitHub's website. A good guide can be found [here](https://docs.docker.com/ci-cd/github-actions/). We must configure a couple of secrets with the login username and password for Docker Hub. Login to GitHub and go to 'Settings' then scroll down to 'Secrets' under 'Security'. Then select the option to 'New repository secret'. Create a secret for your Docker Hub username with the username as a value and something like Docker_Username as the name. It will convert the secret name into all uppercase letters. Also go to Docker Hub settings, security, new access token. Create a new token with your desired name. This token will only show its value at creation so make sure to save it. This value should be used as the value of a second GitHub secret called something like Docker_Token. You will also need a third secret with the name of your Docker Repository saved in it.

An excellent starting point can be found [here](https://github.com/pattonsgirl/Spring2022-CEG3120/blob/main/Projects/Project5/sample-workflows/docker-workflow-v2.yml).In your project repository create a .github folder, create a workflow folder within and place the .yml file there. These folders will already exist if you have played with GitHub Actions already. Open up the .yml workflow file and give the workflow a new name, leave the sections with 'branch' the same unless you plan on working and committing outside the main branch. Assuming you are using Ubuntu WSL2 as recommended earlier you can also leave the 'runs-on' section the same as it should already say "ubuntu-latest" as its value. Change the "DOCKER_HUB_REPO" variable to match the name of your Docker Hub repository. Configuring the last section, 'steps', will require the most work. Copy the following code block in the place of the existing 'steps' area. Make sure to preserve indentation so 'steps' is in line with 'runs-on'.

Replace all references to "DOCKER_HUB_USERNAME" with the name of your secret for your Docker Hub username. Also replace DOCKER_TOKEN with the name of your secret holding your Docker access token. Replace all references to DOCKER_HUB_REPO with the name of your Docker Hub repository secret as well. Delete the 'env' section and change the prefix to where the Docker Repository secret is used from 'env' to 'secret'. We are using a secret for this instead of the environment variable from the template.

Commit these changes in GitHub and pull them on your Ubuntu WSL2 VM. Whenever you push commits to GitHub remotely or push a commit within GitHub, this workflow will be triggered.

## **Part 3: Install Webhooks On Remote System**
* Get access to a Ubuntu system. These steps are done on an Ubuntu 18 virtual machine on Amazon Web Services

**On The Remote System**
* Get ssh access, get updates with `sudo apt update`, etc.
* Install docker with `sudo apt install docker.io`
* Install the webhook library with `sudo apt install webhook`
* Create a hook config file. In this example it will be a .json file called redeploy.json .
* Create a script that will call the config file:
* Go to the Docker Hub repo for the project/image and press on "Webhooks"
  * Enter a name for the new webhook
  * Enter the public IP of you remote system into the https://server-address:9000/hooks/{id}
  * id should be the id tag in the hooks config json file (redeploy.json for this example, where the id is "redeploy")
  * Note that the webhook will be running on port 9000
* Set up webhook receiver on remote system
  * webhook can be called manually using `sudo ./<script-name> -hooks <hook-config-file.json> -verbose`
  * to turn on listener for webhook use `webhook -hooks <path/to/webhook-config.json> -verbose`
* Test changes by altering the website files in the project on the remote system. Commit and push changes (triggering GitHub workflow and Docker Hub commit from Part 2)
  * Can tag version before push by writing `git tag -a v<version>.<release>.<patch>`. ie v1.6.2

Sample script to update and replace running container
```
#!/bin/bash

# kill any current bird website containers then delete any unused images and containers
docker kill bird-website
yes | docker system prune
#Get updated image
docker pull sobiechj/wsu-ceg3120-bird-website:latest
#Create container from image
docker run -d --rm --name bird-website -p 80:80 sobiechj/wsu-ceg3120-bird-website:latest

```

This script is using the repository that I set up for this project. To fit your own project change all references to `sobiechj/wsu-ceg3120-bird-website` to the name of your docker repository. First the script kills any old versions of the container running with `docker kill` This script will delete any unused docker images and containers on a system the script is called on using `docker system prune`. Note that the listener line used to call this should be called in sudo to allow docker to run on a default docker set up. `docker pull` will fetch the updated docker image, and the `docker run` line will create a container of the new image to run on port 80.

Sample of webhook config/json file:
```
[
  {
    "id": "redeploy",
    "execute-command": "./pull-restart.sh",
    "command-working-directory": "/home/ubuntu/cicd-3120-Sobiech-J/webhook",
    "response-message": "Redeploying API server."
  }
]

```

This json file defines what files the webhook should call. The first line with label "id" tells the webhook the name of this webhook workflow so the Docker Hub webhook knows what id to use when making a call to the server. The "execute-command" line gives the name of the script to run that will update the image and container on the server. "command-working-directory" gives the directory that the script is located in. The final line, "response-message", is optional and merely gives a message to print out when the webhook call is successfully made.


## Part 4: Diagramming



## Final notes on the website container

The website hosted by the container/image used in this walkthrough are a simple webpage that uses some basic javascript functionality. The webpage is a gallery of photos of birds ordered alphabetically. The webpage randomly loads a bird with its name shown above. The gallery can be navigated using 3 buttons to get the next bird alphabetically in the list, the previous bird, or a random one that is different than the current bird.

![picture of container's website](bird-website.jpg)
