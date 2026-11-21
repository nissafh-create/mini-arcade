# Incident: staging deployment of v1.1.0
 
1. What happened: v1.1.0 was deployed to staging and the API did not start (wrong module name in the start command).
2. When I knew: HH:MM, when wait-healthy.sh failed after about one minute.
3. What I did: read the logs (ModuleNotFoundError for app.appp), then rolled back by setting IMAGE_TAG=v1.0.0.
4. Downtime: about N minutes, from HH:MM to HH:MM.
5. Prevention: add a CI job that starts the container and calls /health before a tag can be published.
