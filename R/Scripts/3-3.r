{
  rm(list=ls());  options(show.error.locations = TRUE);
  
  # myToken is in the toolbox.r script
  source(file="scripts/toolbox.r");
  
  # give this script access to the functions in the rnoaa package
  library(rnoaa);

  # get the maximum temperatures for every day in  January 2011 from the NOAA database
  lansWeather11 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2011-01-01", enddate ="2011-01-31",
                       token=myToken,
                       limit=50  );

  ### If the NOAA/NCDC website is down (which often happens),
  ### You can replace lines 11-16 with this line:
  # load(file = "data/lesson3-3NOAAData.rdata");
  ### Just make sure you have the rdata file from the class material
  
  # subset the data frame (temperature data) from the list -- save to lw11Data 
  lw11Data = lansWeather11[["data"]];
  
  # save the column named "value", which holds the temperatures, to the vector lw11Temps
  lw11Temps = lw11Data[, "value"];

  ### Repeat the above steps for 2012, 2013, 2104, 2015, and 2016
  # add a half-second delay because the database will not always accept multiple requests without delays
  Sys.sleep(time=0.5);
  lansWeather12 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2012-01-01", enddate ="2012-01-31",
                       token=myToken,
                       limit=50  );
  Sys.sleep(time=0.5);
  lansWeather13 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2013-01-01", enddate ="2013-01-31",
                       token=myToken,
                       limit=50  );
  Sys.sleep(time=0.5);
  lansWeather14 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2014-01-01", enddate ="2014-01-31",
                       token=myToken,
                       limit=50  );
  Sys.sleep(time=0.5);
  lansWeather15 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2015-01-01", enddate ="2015-01-31",
                       token=myToken,
                       limit=50  );
  Sys.sleep(time=0.5);
  lansWeather16 = ncdc(datasetid="GHCND",
                       datatypeid=c("TMAX"),
                       stationid="GHCND:USW00014836",
                       startdate = "2016-01-01", enddate ="2016-01-31",
                       token=myToken,
                       limit=50  );

   # for 2012-2016: subset the data frames from the lists (just like we did with 2011)
  lw12Data = lansWeather12[["data"]];
  lw13Data = lansWeather13[["data"]];
  lw14Data = lansWeather14[["data"]];
  lw15Data = lansWeather15[["data"]];
  lw16Data = lansWeather16[["data"]];

  # for 2012-2016: save the columns named "value" to a vector (just like 2011)
  lw12Temps = lw12Data[, "value"];
  lw13Temps = lw13Data[, "value"];
  lw14Temps = lw14Data[, "value"];
  lw15Temps = lw15Data[, "value"];
  lw16Temps = lw16Data[, "value"];

  # Put all of the temperatures from the six months into one vector
  lansTempsAll = c(lw11Temps, lw12Temps, lw13Temps,
                   lw14Temps, lw15Temps, lw16Temps);

  ### Create a two-dimensional matrix from the six one-dimension tenmperature vectors
  # The matrix will have 31 rows (days) and 6 columns (years)
  # We want to fills the matrix column first
  lansWeatherMat = matrix(data=lansTempsAll, nrow=31, ncol=6, byrow = FALSE);
a = cbind(lw11Temps, lw12Temps, lw13Temps, lw14Temps, lw15Temps, lw16Temps);
b = rbind(lw11Temps, lw12Temps, lw13Temps, lw14Temps, lw15Temps, lw16Temps);
  # In this matrix, R will calculate ncol
  lansWeatherMat2 = matrix(data=lansTempsAll, nrow=31, byrow = FALSE);

  # In this matrix, R will calculate nrow
  lansWeatherMat3 = matrix(data=lansTempsAll, ncol=6, byrow = FALSE);

  # Reversing the matrix -- columns are days, rows are years
  lansWeatherMatRev = matrix(data=lansTempsAll, nrow=6, ncol=31,
                             byrow = TRUE);

  # Coverting the matrix from tenths of a Celsius to Celsius
  lansWeatherMat = lansWeatherMat * 0.1;

  # Converting the matrix from Celsius to Fahrenheit
  lansWeatherMat = (9/5) * lansWeatherMat + 32;

  # Setting the number of significant digits to 2
  lansWeatherMat = signif(x=lansWeatherMat, digits=2);

  ### finding mean values
  # find mean of the whole matrix
  meanAllJan = mean(lansWeatherMat);

  # find mean of January 2013 (the third column)
  meanJan2013 = mean(lansWeatherMat[,3]);

  # find mean of all January 17ths (the 17th row)
  meanJan17 = mean(lansWeatherMat[17,]);

  ### Find the mean for all columns (year)
  # vector that holds the yearly mean values
  yearlyMean = c();

  # go through each of the six column and find the mean of the temperature values
  for(i in 1:6)  # remember i is used to index the iteration in the for()
  {
    # get the mean of all values in column i and save it to monthlyMean[i]
    yearlyMean[i] = mean(lansWeatherMat[,i]);
  }

  ### Find the mean for all rows (days in January)
  # vector that holds the daily mean values
  dailyMean = c();

  # go through each of the 31 rows and find the mean of the temperature values
  for(i in 1:31)
  {
    # get the mean of all values in row i and save it to dailyMean[i]
    dailyMean[i] = mean(lansWeatherMat[i,]);
  }

  ### Save matrix to a CSV file for use in next lesson
  # row.names = FALSE tells R to not include the row numbers
  write.csv(x=lansWeatherMat, file = "data/LansingJanTemps.csv", row.names = FALSE);
  
  
  ### The following code is in the Extension: 
  #    Using cbind() and rbind() to create matrices
  
  # bind the temperature vectors into a matrix -- each vector becomes a column 
  cbindMatrix = cbind(lw11Temps, lw12Temps, lw13Temps, 
                      lw14Temps, lw15Temps, lw16Temps);
  
  # bind the temperature vectors into a matrix -- each vector becomes a row 
  rbindMatrix = rbind(lw11Temps, lw12Temps, lw13Temps, 
                      lw14Temps, lw15Temps, lw16Temps);  
}