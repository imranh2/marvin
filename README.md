# NodeJS Docker Example

This repo is an example of how to create a Docker Image out of a NodeJS app.

You can literally just fork and rename the repo.

## What Images are Built?

By default this is what is built.

* latest - Every time you push to master a image is built with the image tag being the git commit full hash. This same image is also tagged as `latest`
* tag - Every time you create a new git tag, a new image is built with that same tag.

## Files in this repo

| File | Explanation |
| --- | --- |
| .dockerignore | List of files not to be copied into the docker image. |
| .gitignore | List of files to not be included in the git repo |
| .gitlab-ci.yml | Settings file for Gitlab CI that tells it what to do and how. In this case build and publish a docker image. |
| Dockerfile | File used by Docker (Google Kaniko in this case) to build a docker image. Change the initial NodeJS run file in here. |
| README.md | What you are reading right now :) |
| package.json | Example NodeJS package.json file |
| npm-shrinkwrap.json | Example NodeJS npm-shrinkwrap.json file |
| index.js | Example NodeJS code file |