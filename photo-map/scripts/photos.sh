#! /bin/bash

# NOTE: Requires exiftool and ruby

# Variables
EXEC_PATH=`pwd`
PHOTOS_JSON="$EXEC_PATH/photos.json"
PHOTOS_DSM_JSON="$EXEC_PATH/photos_dsm.json"
PHOTOS_CSV="$EXEC_PATH/photos.csv"
PHOTO_SRC_PATH='/Users/Taylor/Dropbox/Apps/Day One/Journal.dayone/photos'

# Execute
exiftool -json -FileName -GPSLatitude -GPSLongitude -GPSAltitude -GPSDateTime "$PHOTO_SRC_PATH" > "$PHOTOS_DSM_JSON"
exiftool -csv -FileName -GPSLatitude -GPSLongitude -GPSAltitude -GPSDateTime "$PHOTO_SRC_PATH" > "$PHOTOS_CSV"

./photos.rb $PHOTOS_DSM_JSON > $PHOTOS_JSON