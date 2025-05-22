#!/bin/sh

NETWORK=""
while getopts "r:" opt
do
  case $opt in
    r)
      NETWORK=${OPTARG}
    ;;
  esac
done

if [ -z "$NETWORK" ]
then
  echo "must be usage -r"
  exit 1
fi

# echo $NETWORK;
# # cp wellknown
\cp -rf ./deploy/$NETWORK/.well-known ./public/
\cp -rf ./deploy/$NETWORK/.ic-assets.json ./public/

# build
echo "build..."
pnpm run build

# deploy
echo "deploy -> $NETWORK network..."
dfx deploy --network $NETWORK --mode reinstall fomowell_frontend_v2

echo "deploy done!"