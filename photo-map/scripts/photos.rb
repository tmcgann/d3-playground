#!/usr/bin/env ruby

def convert_dms_to_decimal(degrees, minutes, seconds, hemisphere)
	decimal = degrees.to_f + minutes.to_f / 60 + seconds.to_f / 3600
	decimal = decimal * -1 if hemisphere.downcase == "s" || hemisphere.downcase == "w"
	decimal.to_s
end

def convert_altitude(altitude, level)
	altitude = altitude.to_f * -1 if level.downcase != "above sea level"
	altitude.to_s
end

sourceFile = ARGV[0]

File.open(sourceFile).each do |line|

	# regex isn't stored in a variable because this way the variables (i.e degrees, minutes, etc.) are automatically instantiated
	matchesLatLong = /(?<degrees>\d+) deg (?<minutes>\d+)' (?<seconds>\d+\.?\d+)\\\" (?<hemisphere>[NSEW])/i =~ line
	matchesAlt = /(?<altitude>\d+\.?\d*) m (?<level>[\w\s]+)/i =~ line

	if matchesLatLong
		line = line.gsub(/(?<degrees>\d+) deg (?<minutes>\d+)' (?<seconds>\d+\.?\d+)\\\" (?<hemisphere>[NSEW])/i, convert_dms_to_decimal(degrees, minutes, seconds, hemisphere))
	end

	if matchesAlt
		line = line.gsub(/(?<altitude>\d+\.?\d*) m (?<level>[\w\s]+)/i, convert_altitude(altitude, level))
	end

	puts line
end