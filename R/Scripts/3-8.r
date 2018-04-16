{
  rm(list=ls()); options(show.error.locations = TRUE);  

  # Get weather data for 2016 in Lansing, MI
  lansing2016Weather = read.csv(file="data/LansingNOAA2016Formatted.csv",
                                stringsAsFactors = FALSE);
  
  # Extract the various parts of the weather data and save each to a vector
  date = lansing2016Weather[,"date"];
  eventData = lansing2016Weather[,"eventData"];
  avgTemp = lansing2016Weather[,"avgTemp"];
  tempDept = lansing2016Weather[,"tempDept"];  
  precipitation = lansing2016Weather[,"precipitation"];  
  humidity = lansing2016Weather[,"humidity"];
  barometer = lansing2016Weather[,"barometer"];
  dewPoint = lansing2016Weather[,"dewPoint"];
  avgWind = lansing2016Weather[,"avgWind"];
  maxWind = lansing2016Weather[,"maxWind"];  
  windDirection =  lansing2016Weather[,"windDirection"];
  sunrise = lansing2016Weather[,"sunrise"];
  sunset = lansing2016Weather[,"sunset"];

  ### using which() to index values from a vector
  # give the index of the values in avgTemp that are greater than 80
  daysOver80 = which(avgTemp > 80);
  
  # # index the dates and humidity vectors by the days over 80 degrees
  datesOver80 = date[daysOver80];
  humidityOver80 = humidity[daysOver80];
   
  # give the min and max humdity for days over 80 degrees
  minHumOver80 = min(humidity[daysOver80]);
  maxHumOver80 = max(humidity[daysOver80]);
  
  ### multiple conditions using a which()
  # give the index of values where avgTemp is between 60 and 70  
  tempsIn60s = which(avgTemp > 60 & avgTemp < 70);
   
  # find the mean wind and mean precipiation when avgTemp is between 60 and 70
  meanWind60s = mean(avgWind[tempsIn60s]);
  maxPrecip60s = max(precipitation[tempsIn60s]);
   
  # give the index of values where temperatures are more than 15 degrees from normal
  highDepart = which(tempDept > 15 | tempDept < -15);
   
  ### plotting and modelling subset data
  # plot temperature vs pressure on the days when temperature is more than 15 degrees from normal
  plot(formula=avgTemp[highDepart]~barometer[highDepart]);
   
  # do a linear model of temp vs. pressure on the abnormal temperature days
  model = lm(formula=avgTemp[highDepart]~barometer[highDepart]);
   
  # add the regression line to the plot
  abline(model, col="blue");  
   
  # show summary of the relationship
  print(summary(model));      
   
  # repeat the process above with southerly winds (winds between 90 and 270 degrees)
  southWinds = which(windDirection > 90 & windDirection < 270);
  plot(formula=avgTemp[southWinds]~barometer[southWinds]);
  model2 = lm(formula=avgTemp[southWinds]~barometer[southWinds]);
  abline(model2, col="blue");  
  print(summary(model2));      
  
  ### use grep() to get index values from a string vecto (eventData)
  # get days that had snow
  snowyDays = grep("SN", eventData);
  
  # get days that had rain
  rainyDays = grep("RA", eventData);
  
  # find the days that had either rain OR snow
  precipDays = grep("SN|RA", eventData);
  
  # find the days that had either rain AND snow
  daysWithRainAndSnow1  = grep("SN&RA", eventData);  # does not work!
  daysWithRainAndSnow2 = intersect(snowyDays, rainyDays);  # works!
   
  ### multiple conditions on multiple variable in which()
  # days with high wind (>15mph) and abnomal temperature (more than 10 degrees from normal)
  abnormalTempHighWind = which( (avgWind > 15) &
                      (tempDept < -10 | tempDept > 10 ) );
  
  # days with temperatures between 40 and 50 and precipitation between 0.1 and 0.2 inches
  chillyLightRain = which( (avgTemp > 40 & avgTemp < 50) &
                      (precipitation > 0.1 & precipitation < 0.2 ));
  
  # get the dates for the above conditions
  dates1 = date[abnormalTempHighWind];
  dates2 = date[chillyLightRain];

  # print to console the information from above.
  cat("Abnormal temps and high winds:\n");
  print(dates1);
  cat("\nChilly days and light rain:\n");
  print(dates2);
}