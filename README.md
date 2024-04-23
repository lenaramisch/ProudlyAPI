# How to use this app

## Setting up

### Start Database and apply migrations

`docker compose up db dbmigration --build`
*We include --build to rebuild the migrations into the migrations container*

### Start application (development)

`npm run dev`

### Compile TS code to JS (production)

`npm run build`
`npm run start`

## Build api spec

`rm -f ${PWD}/api-spec/bundle.yml`
`docker run --rm -v $PWD/api-spec/:/spec ghcr.io/redocly/cli:v1.0.0 lint openapi.yml`
`docker run --rm -v $PWD/api-spec/:/spec ghcr.io/redocly/cli:v1.0.0 bundle openapi.yml >> ./api-spec/bundle.yml`
