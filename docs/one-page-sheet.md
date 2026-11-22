# Mini Arcade: one-page sheet

## Architecture

    browser -> localhost:8080 -> [ api: Flask + gunicorn ] -> db:3306 -> [ db: MySQL 8.4 ]
                                      (port published)        (private Compose network, port NOT published)
                                                                          |
                                                                  volume: dbdata (data survives)

- Images: built from Dockerfile (python:3.12-slim, non-root user, HEALTHCHECK on /health).
- Compose: api waits for db to be healthy before starting.
- CI (GitHub Actions): on every pull request, test -> docker-build (needs), test report kept as an artifact.
- Release: tag vX.Y.Z publishes ghcr.io/nissafh-create/mini-arcade:vX.Y.Z; the image is never rebuilt.

## Version deployed on staging (http://localhost:8081)

v1.2.1 (restores the start command after the broken v1.2.0), checked by scripts/wait-healthy.sh.

## Rollback procedure

1. Deploy fails: wait-healthy.sh returns 1.
2. Read: docker compose ... logs --tail=50 api, find the first useful error.
3. Set the previous tag: IMAGE_TAG=v1.1.1 in .env.staging.
4. docker compose ... up -d, then run wait-healthy.sh again: it must print "staging healthy".
5. Write the incident report (docs/incident-v1.2.0.md).
