# Incident: staging deployment of v1.2.0

1. What happened: v1.2.0 was deployed to staging and the API did not start (wrong module name in the start command). CI was green because the tests do not start the container.
2. When I knew: 18:01, when wait-healthy.sh failed after about one minute.
3. What I did: read the logs (ModuleNotFoundError: No module named 'app.appp'), then rolled back by setting IMAGE_TAG=v1.1.1 and running up -d, without rebuilding.
4. Downtime: about 3.5 minutes, from 17:59 to 18:03.
5. Prevention: add a CI job that starts the container and calls /health before a tag can be published.
