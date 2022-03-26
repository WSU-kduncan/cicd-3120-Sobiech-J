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

First a base image must be installed from Docker Hub. I will use the latest [apache2/httpd image](https://hub.docker.com/_/httpd). You may need to create a Docker Hub account.

To create a docker image create a folder in WSL2. Place a Dockerfile (with Dockerfile as the name) and any files that will be placed in the base image within this folder. For the apache2 example we want to move the website folder with all of our website contents into the folder with Dockerfile.

When these files are assembled, the new image can be downloaded with a bash command. For the image I am using the command is `docker pull httpd`.

In the Dockerfile define the details of the image you want to create. Details can be found [on Docker's documentation](https://docs.docker.com/engine/reference/builder/). My new image was defined as follows:

**To build the image**
* command to create a new image: `docker build -t my-u-apache2:latest` .
  * this command must be run while inside of the folder with the dockerfile (that is what the . is referring to)

**To run a container of the image**
* command to run the new image as a container in the Linux command line: `docker run -dit -p 8080:80 my-u-apache2:latest`
* The container can also be run for the first time from an image inside of the Docker Desktop Windows program. To run a container that way, click on the "Images" tab. Press the green "Run" button that appears when hovering over the desired image.
  * A previously run container can be run again in the Docker Desktop app. It can be found under the Container/Apps tab.

**To check that the container works**
* you can check that the container is running on the specified port (port 8080 for the run config in the Linux command line run command) by going to 127.0.0.1:port on a web browser. The website should be displayed on that port.


##Part 2: GitHub and DockerHub

