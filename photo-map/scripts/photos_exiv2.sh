#! /bin/bash

# Initial variables
EXEC_PATH=`pwd`
BUILD_PATH="$EXEC_PATH/build"
PHOTOS="$BUILD_PATH/photos.data"
PHOTOS_CSV="$EXEC_PATH/photos.csv"
PHOTO_SRC_PATH='/Users/Taylor/Dropbox/Apps/Day One/Journal.dayone/photos'

# Create build folder if it doesn't exist already
mkdir -p $BUILD_PATH

# Create photo data file
cd "$PHOTO_SRC_PATH"
exiv2 -g GPSLatitude -g GPSLongitude -g GPSAltitude *.jpg > $PHOTOS

# Create separate data files
FILENAME_DATA="$BUILD_PATH/filename.data"
LATITUDE_DATA="$BUILD_PATH/latitude.data"
LATITUDE_REF_DATA="$BUILD_PATH/latitudeRef.data"
LONGITUDE_DATA="$BUILD_PATH/longitude.data"
LONGITUDE_REF_DATA="$BUILD_PATH/longitudeRef.data"
ALTITUDE_DATA="$BUILD_PATH/altitude.data"
ALTITUDE_REF_DATA="$BUILD_PATH/altitudeRef.data"

cd $EXEC_PATH
# echo "00F109807EC246FA81B7BA27FD57059C.jpg  Exif.GPSInfo.GPSLatitude                     Rational    3  32deg 51' 7.220\"" | awk '{ print $1":"$5" "$6" "$7 }'
cat $PHOTOS | egrep GPSLatitude\\s | awk '{ print $1","$1 }' > $FILENAME_DATA
cat $PHOTOS | egrep GPSLatitude\\s | awk '{ print $1","$5" "$6" "$7 }' > $LATITUDE_DATA
cat $PHOTOS | egrep GPSLatitudeRef | awk '{ print $1","$5 }' > $LATITUDE_REF_DATA
cat $PHOTOS | egrep GPSLongitude\\s | awk '{ print $1","$5" "$6" "$7 }' > $LONGITUDE_DATA
cat $PHOTOS | egrep GPSLongitudeRef | awk '{ print $1","$5 }' > $LONGITUDE_REF_DATA
cat $PHOTOS | egrep GPSAltitude\\s | awk '{ print $1","$5" "$6 }' > $ALTITUDE_DATA
# cat $PHOTOS | egrep GPSAltitudRef | awk '{ print $1","$5" "$6" "$7 }' > $ALTITUDE_REF_DATA

# Join the data files to create a CSV with one line per photo
## CSV Header - name,latitude,latitudeRef,longitude,longitudeRef,altitude,altitudeRef
echo 'name,latitude,latitudeRef,longitude,longitudeRef,altitude' > $PHOTOS_CSV

## Temp file variables
LATITUDE_COMBINED_DATA="$BUILD_PATH/latitude_combined.data"
LONGITUDE_COMBINED_DATA="$BUILD_PATH/longitude_combined.data"
ALTITUDE_COMBINED_DATA="$BUILD_PATH/altitude_combined.data"
COORDINATES_DATA="$BUILD_PATH/coordinates.data"

## Join temp files
join -t $',' $LATITUDE_DATA $LATITUDE_REF_DATA > $LATITUDE_COMBINED_DATA
join -t $',' $LONGITUDE_DATA $LONGITUDE_REF_DATA > $LONGITUDE_COMBINED_DATA
# join -t $',' $ALTITUDE_DATA $ALTITUDE_REF_DATA > $ALTITUDE_COMBINED_DATA

join -t $',' $LATITUDE_COMBINED_DATA $LONGITUDE_COMBINED_DATA > $COORDINATES_DATA
join -t $',' $COORDINATES_DATA $ALTITUDE_DATA >> $PHOTOS_CSV

## Replace the ' with escaped \'