{
  rm(list=ls()); options(show.error.locations = TRUE);  

  # Get weather data for 2016 in Lansing, MI
  lansing2016Weather = read.csv(file="data/LansingNOAA2016.csv");

  
  # Get weather data a second time -- this time treats strings as strings - not factors
  lansing2016Weather = read.csv(file="data/LansingNOAA2016.csv",
                               stringsAsFactors = FALSE);
  
  # Extract the various parts of the weather data and save each to a vector
  date = lansing2016Weather[,"date"];
  eventData = lansing2016Weather[,"weatherType"];
  avgTemp = lansing2016Weather[,"avgTemp"];
  tempDept = lansing2016Weather[,"tempDept"]; 
  precipitation = lansing2016Weather[,"precip"]; 
  humidity = lansing2016Weather[,"relHum"];
  barometer = lansing2016Weather[,"stnPressure"];
  dewPoint = lansing2016Weather[,"dewPoint"];
  avgWind = lansing2016Weather[,"windSpeed"];
  maxWind = lansing2016Weather[,"windPeakSpeed"]; 
  windDirection = lansing2016Weather[,"windPeakDir"];
  sunrise = lansing2016Weather[,"sunrise"];
  sunset = lansing2016Weather[,"sunset"];
   
  # Change all Trace precip value to 0.005 
  for(i in 1:366)
  {
    if(precipitation[i] == "T")
    {
      precipitation[i] = 0.005;
    }
  }
  
  # Convert precipitation into a numeric vector
  precipitation = as.numeric(precipitation);
   
  # Create a scatterplot between two of the variables
  plot(formula=humidity~avgTemp);
  
  # Make modifications to the plot
  plot(formula=humidity~avgTemp,
      xlab="Average Temperature (F)", ylab="Humidity (%)",
      main="Humidity vs Average Temperature",
      pch=4, col="blue", cex=0.7  );
  
  # EXTENSION -- change the colors of the points to reflect the points in the year
  colfunc<-colorRampPalette(c("yellow", "red", "blue"));
  plot(formula=humidity~avgTemp,
       xlab="Average Temperature (F)", ylab="Humidity (%)",
       main="Humidity vs Average Temperature",
       pch=4, col=colfunc(366), cex=0.7  );
    
  # EXTENSION -- use numbers instead of points
  # might want to expand graph or pop it out to see the numbers
  plot(formula=humidity~avgTemp, type="n",
       xlab="Average Temperature (F)", ylab="Humidity (%)",
       main="Humidity vs Average Temperature");
   
  # EXTENSION -- use numbers instead of points in the scatterplot
  text(x=avgTemp, y=humidity, labels=1:366, cex= 0.7, col=colfunc(366))
  
  
  # create a scatterplot of multiple variables
  pairs(formula=~avgTemp+humidity+precipitation);  
  
  # you can be ridulous with the scatterplots...
  pairs(formula=~precipitation+avgTemp+maxWind+humidity+barometer+dewPoint+windDirection);  #  
  
  # focus on avgTemp vs dewPoint and do a linear model between them
  plot(formula=avgTemp~dewPoint);
  model = lm(avgTemp~dewPoint);
  
  # do a summary of the linear regression model -- shows definite relationship
  print(summary(model)); 
  
  # add the regression line to the plot
  abline(model, col="blue");
  

  # focus on avgTemp vs barometer and do a linear model between them
  plot(formula=avgTemp~barometer);
  model2 = lm(avgTemp~barometer);
  abline(model2, col="blue");  # add the regression line to the plot
  print(summary(model2));      # summary shows no relationship

  # create a new data frame with the formatted data
  formattedData = data.frame(date, eventData, avgTemp, tempDept, 
                             precipitation, humidity, barometer,
                             dewPoint, avgWind, maxWind, 
                             windDirection, sunrise, sunset);  # check the avgWind

  # write the new data frame to a csv file
  write.csv(x=formattedData,
            file="data/LansingNOAA2016Formatted.csv",
            row.names = TRUE );
  
  
}