// Create an API key, that has access to the Time Zones API and Geocoding API
var API_KEY = "";

/**
 * Find location of a place using the Geocode API
 * @param {string} placename
 * @returns {object}
 */
function locationFromPlace(placename) {
  var query =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    placename +
    "&key=" +
    MAPS_API_KEY;
  console.log({ message: query });
  var locationResponse = UrlFetchApp.fetch(query);
  var locationJSON = JSON.parse(locationResponse.getContentText());
  if (locationJSON && locationJSON.results.length > 0) {
    return locationJSON.results[0].geometry.location;
  } else {
    return;
  }
}

/**
 * Return the timezone offset for a location.
 *
 * @param {string} place The name of the location to look up (required)
 * @param {date} date The date for which to check the timezone (optional)
 * @return The timezone offset in hours
 * @customfunction
 */
function TIMEZONE(place, date) {
  if (!place) {
    return 0;
  }
  // Convert placename to latitude/longutude that that is needed for the TimeZones API
  var locationObject = locationFromPlace(place);
  var location;
  if (locationObject) {
    location = locationObject.lat + "," + locationObject.lng;
  } else {
    return "?";
  }

  // Convert date to the required timestamps
  var timestamp;
  if (date) {
    var parsedDate = new Date(date);
    timestamp = Math.floor(parsedDate.getTime() / 1000);
  } else {
    timestamp = Math.floor(Date.now() / 1000);
  }

  // Query the TimeZones API
  var query =
    "https://maps.googleapis.com/maps/api/timezone/json?location=" +
    location +
    "&timestamp=" +
    timestamp +
    "&key=" +
    MAPS_API_KEY;
  var response = UrlFetchApp.fetch(query);
  var responseJSON = JSON.parse(response.getContentText());
  if (responseJSON) {
    return (responseJSON.dstOffset + responseJSON.rawOffset) / (60 * 60);
  } else {
    return "?";
  }
}
