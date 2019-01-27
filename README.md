## Install project

1. Create config
```bash
cp etc/config.json.sample etc/config.json
cp etc/dbConfig.json.sample etc/dbConfig.json
```
2. Install libraries
```bash
npm i
```

## Run project (dev)

1. Run server
```bash
nodemon app.js
```
1. Run worker
```bash
node workers/builder.js
```

## Run project (prod)

1. Run pm2 app
```bash
npm run start
```

## Migrations

* Create migration file
```bash
npm run create-migration
```
* Run all migrations
```bash
npm run migration
```
* Undo all migrations
```bash
npm run undo-all-migrations
```
* Undo one migration
```bash
npm run undo-migration
```

## Scripts

* Add build task
```bash
bash bin/build.sh
```
