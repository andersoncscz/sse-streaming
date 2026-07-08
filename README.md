# Real-time data streaming with SSE (Server-Sent Events)

A minimal, horizontally-scalable reference implementation for pushing real-time
notifications to browsers over **Server-Sent Events (SSE)**. It shows how to keep
long-lived streaming connections alive across **multiple load-balanced backend
instances** by using **Redis Pub/Sub** as the message fan-out layer.
   renders incoming notifications and shows a live connection-state indicator
   (connecting / connected / error).

## :books: Tech stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Backend       | Node.js, Express 5                |
| Message bus   | Redis (Pub/Sub)                   |
| Load balancer | Nginx (stream / L4 TCP)           |
| Frontend      | Vanilla JS (`EventSource` API)    |
| Orchestration | Docker Compose                    |

## :arrow_forward: Getting started

### Prerequisites

- :whale2: [Docker](https://www.docker.com/) & Docker Compose

### :running: Run it

```bash
cd backend

# Start Redis, the backend, and Nginx.
# Use --scale to run multiple backend instances behind the load balancer.
docker compose up --build --scale backend=3
```

Then open `frontend/index.html` in a browser. You should see the connection
indicator switch to **Connected**. The client connects to `http://localhost:80/stream`,
which Nginx round-robins across the backend replicas.

### :envelope: Send a test notification

Publish a message to the Redis channel and watch it appear in **every** open
browser tab, regardless of which backend instance served each connection:

```bash
docker exec -it redis redis-cli PUBLISH notification_topic "Hello from Redis!"
```

### :eyes: Watching it scale

With `--scale backend=3`, refresh the frontend a few times (or open several
tabs) and check the backend logs:

```bash
docker compose logs -f backend
```

You'll see `Stream established on instance: <hostname>` lines coming from
different container hostnames as Nginx round-robins connections — yet a single
`PUBLISH` still reaches all of them.


### :brain: System Design

<img width="1449" height="513" alt="system-design" src="https://github.com/user-attachments/assets/c0c6202b-f5d6-40e4-8092-91ff94c2069c" />

| Round Robin | Application Instances |
|---|---|
| <img width="441" alt="Round-Robin-Logs" src="https://github.com/user-attachments/assets/968ec1bd-86b6-4735-ac67-48f5921dbe44" /> <img width="441" alt="Round-Robin-Draw" src="https://github.com/user-attachments/assets/1f3ddf8a-48f1-4b18-81c4-430af78be956" /> | <img width="860" alt="Containers" src="https://github.com/user-attachments/assets/c014b025-bee8-49e1-a064-734ace4aee7f" /> |

### :movie_camera: Demo

<img width="3020" height="1600" alt="Demo" src="https://github.com/user-attachments/assets/0216a3c2-8b91-4fe0-8f3c-5c51ee851c8b" />
