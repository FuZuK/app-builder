read -p 'Package: ' PACKAGE
read -p 'Site: ' SITE
read -p 'Email: ' EMAIL
read -p 'Type (debug, release): ' TYPE

export PACKAGE=$PACKAGE
export SITE=$SITE
export EMAIL=$EMAIL
export TYPE=$TYPE

node scripts/build.js

