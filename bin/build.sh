read -p 'Copy ID: ' COPY_ID
read -p 'Package: ' APP_ID
read -p 'Server host: ' SERVER_HOST

export COPY_ID=$COPY_ID
export APP_ID=$APP_ID
export SERVER_HOST=$SERVER_HOST

node scripts/build.js

