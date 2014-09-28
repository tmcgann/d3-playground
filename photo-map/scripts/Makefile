build/gz_2010_us_050_00_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://www2.census.gov/geo/tiger/GENZ2010/$(notdir $@)
build/gz_2010_us_050_00_20m.shp: build/gz_2010_us_050_00_20m.zip
	unzip -od $(dir $@) $<
	touch $@
# build/counties.json: build/gz_2010_us_050_00_20m.shp
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albersUsa() \
# 			.scale(1280) \
# 			.translate([width / 2, height / 2])' \
# 		--simplify=.5 \
# 		--filter=none \
# 		-- counties=$<
build/counties.json: build/gz_2010_us_050_00_20m.shp build/ACS_12_5YR_B01003_with_ann.csv
	node_modules/.bin/topojson \
		-o $@ \
		--id-property='STATE+COUNTY,Id2' \
		--external-properties=build/ACS_12_5YR_B01003_with_ann.csv \
		--properties='name=Geography' \
		--properties='population=+d.properties["Estimate; Total"]' \
		--projection='width = 960, height = 600, d3.geo.albersUsa() \
			.scale(1280) \
			.translate([width / 2, height / 2])' \
		--simplify=.5 \
		--filter=none \
		-- counties=$<
build/states.json: build/counties.json
	node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=counties \
		--out-object=states \
		--key='d.id.substring(0, 2)' \
		-- $<
us.json: build/states.json
	node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=states \
		--out-object=nation \
		-- $<
# build/photo.data: ~/Dropbox/Apps/Day\ One/Journal.dayone/photos/*.jpg
# 	exiv2 -g GPSLatitude -g GPSLongitude "$<" | grep Rational > `pwd`/$@