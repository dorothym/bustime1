# NYC MultiBusTime

## Application purpose
Allow a user to enter a geographical location and view nearby ALL nearby real-time buses on a map (regardless of MTA route number), to support decision-making about which bus line to take based on proximity.

## Dependencies and requirements
This application requires an internet connection and depends on data from [MTA Bus Time](http://bustime.mta.info/wiki/Developers/Index).

This application is not deployed yet. To run it locally, you must [request a BusTime key from the MTA](http://spreadsheets.google.com/viewform?hl=en&formkey=dG9kcGIxRFpSS0NhQWM4UjA0V0VkNGc6MQ#gid=0) and export it from your `.bash_profile`:

```
export MTA_BUSTIME_KEY='[your key here]'
```

## Current functionality:
At /location, user enters an address and clicks getLatLon.

Application console logs the following:
* Latitude and longitude for that address
* MTA bus stops within 200 meters of that latitude & longitude
* Bus routes serving the first bus stop in the array 

### TBD:

* Console log ALL bus routes serving ALL bus stops in the array

* for each route/line (or stop?), need to make separate call to get nearby buses. 

** _example by stop:_
http://bustime.mta.info/api/siri/stop-monitoring.json?key=[key]&OperatorRef=MTA&MonitoringRef=400324

** _example by line:_
http://bustime.mta.info/api/siri/vehicle-monitoring.json?&VehicleRef=339&key=[key]&OperatorRef=MTA


