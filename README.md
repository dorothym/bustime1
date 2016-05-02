# NYC MultiBusTime

## Application purpose
Allow a user to enter a geographical location and view nearby ALL nearby real-time buses on a map (regardless of MTA route number), to support decision-making about which bus line to take based on proximity.

## Dependencies and requirements
This application requires an internet connection and depends on data from [MTA Bus Time](http://bustime.mta.info/wiki/Developers/Index).

To run this application locally, you must [request a BusTime key from the MTA](http://spreadsheets.google.com/viewform?hl=en&formkey=dG9kcGIxRFpSS0NhQWM4UjA0V0VkNGc6MQ#gid=0) and export it from your `.bash_profile`:

```
export MTA_BUSTIME_KEY='[your key here]'
```

