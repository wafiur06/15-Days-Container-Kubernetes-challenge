# Day 5: Docker Introduction & Containerization

Today, I officially stepped into the world of containers! The goal was to deploy a live web server using Docker.

## Key Learnings & Commands:
* **Running a Container:** Deployed an Nginx web server in detached mode using `sudo docker run -d -p 8081:80 --name my-web nginx`.
* **Troubleshooting Port Conflicts:** Encountered an `address already in use` error on port 8080. Learned how Docker maps Host ports to Container ports (`HostPort:ContainerPort`) and resolved the issue by binding to an available port (8081).
* **Container Management:** Used `docker ps` to verify running instances and `docker rm` to clean up failed containers.

### My First Running Container:
![Docker Nginx Output](day-5.jpeg)

