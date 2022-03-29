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

To create a docker image create a folder in WSL2. Place a Dockerfile (with Dockerfile as the name) and any files that will be placed in the base image within this folder. For the apache2 example we want to move the website folder with all of our website contents into the folder with Dockerfile.

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
The next step is most easily done on GitHub's website. A good guide can be found [here](https://docs.docker.com/ci-cd/github-actions/). We must configure a couple of secrets with the login username and password for Docker Hub. Login to GitHub and go to 'Settings' then scroll down to 'Secrets' under 'Security'. Then select the option to 'New repository secret'. Create a secret for your Docker Hub username with the username as a value and something like Docker_Username as the name. It will convert the secret name into all uppercase letters. Also go to Docker Hub settings, security, new access token. Create a new token with your desired name. Use this token's name as the value of a second GitHub secret called something like Docker_Token.

Go to your GitHub repository, Actions on the repository. You may get a recommended template for a docker image. If you do, select it. If you do not, search "Docker Image" in the search bar. Give the workflow a new name, leave the sections with 'branch' the same unless you plan on working and committing outside the main branch. Assuming you are using Ubuntu WSL2 as recommended earlier you can also leave the 'runs-on' section the same as it should already say "ubuntu-latest" as its value. Configuring the last section, 'steps', will require the most work. Copy the following code block in the place of the existing 'steps' area. Make sure to preserve indentation so 'steps' is in line with 'runs-on'.

```
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
      -
        name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      -
        name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/simplewhale:latest
```

Replace all references to "DOCKER_HUB_USERNAME" with the name of your secret for your Docker Hub username. Also replace DOCKER_HUB_ACCESS_TOKEN with the name of your secret holding your Docker access token. The path to your projects Dockerfile also needs changed from ./Dockerfile. Since this file is placed in your repository under /.github/workflows/file-name, the path will probably require a few steps up using ../ . For example my path was ../../ubuntu-apache2-docker/Dockerfile . Also change the contents of the final line 'tags' from simplewhale:latest to the name of your-project:latest. This example used ubuntu-apache2-bird-website:latest .

Commit these changes in GitHub and pull them on your Ubuntu WSL2 VM.
