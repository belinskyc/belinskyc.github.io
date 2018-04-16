{
  rm(list=ls());  options(show.error.locations = TRUE);
  
  # give this script access to toolbox.r and the functions in the rnoaa and reshape2 packages
  source("scripts/toolbox.r");
  library(rnoaa);
  library(reshape2);
  
  ### ncdc() is inside the reshape2 package
  # Get January 2016 weather data from Lansing from the NCDC website
  # datasetid: NCDC's name for the database 
  # datatypeid: the four character names for the different types of data
  # stationid: the id of Lansing Capital City Airport's weather station
  # startdate, enddate: the dates you want data from
  # token: YOU NEED TO PUT IN YOUR 32 CHARACTER TOKEN FROM NOAA HERE
  # limit: maximum number of data points you want to collect
  lansingWeather = ncdc(datasetid="GHCND",
               datatypeid=c("TMAX", "TAVG", "TMIN", "PRCP",
                            "SNOW", "AWND", "WDF2", "WSF2",
                            "WT01", "WT09"),
               stationid="GHCND:USW00014836",
               startdate = "2016-01-01", enddate ="2016-01-31",
               token=myToken,
               limit=400  );
  
  ### If the NOAA/NCDC website is down (which often happens),
  ### You can replace lines 17-24 with this line:
  # load(file = "data/lesson3-2NOAAData.rdata");
  ### Just make sure you have the rdata file from the class material

  # subset the object "data" from lansingWeather and save it to lansingWeatherDF
  lansingWeatherDF = lansingWeather[["data"]];
  
  ### dcast() is inside the reshape2 package
  # reshape the data frame in lansingWeatherDF so that:
  # 1) unique dates are on the y-axis (rows)
  # 2) unique datatypes are on the y-axis (columns)
  # 3) the table is populated using the value's column
  lansingWeatherRS = dcast(data = lansingWeatherDF, 
                           formula = date ~ datatype, 
                           value.var = "value");

  # ### Doing mathematical and string operations on the columns
  # Resort the columns -- basically move the 2nd column to the 8th position
  lansingWeatherRS = lansingWeatherRS[,c(1,3,4,5,6,7,2,8,9,10,11)];
  
  # Divide multiple columns by 10 (because the values were in tenths of a unit)
  lansingWeatherRS[,c(2:7,9)] = lansingWeatherRS[,c(2:7,9)]/10;
  
  # convert the three temperature column from Celsius to Fareinheit
  lansingWeatherRS[,4:6] = (9/5) * lansingWeatherRS[,4:6] + 32;
  
  # Round the temperature columns to only one decimal
  lansingWeatherRS[,4:6] = round(lansingWeatherRS[,c(4,6)],digits=1);
  
  # Remove unneccessary characters from the date column (keeping characters 6-10)
  lansingWeatherRS[,1] = substr(x=lansingWeatherRS[,1], start=6, stop=10);  
  
  # Change names of the last two columns
  colnames(lansingWeatherRS)[10] = "Fog";
  colnames(lansingWeatherRS)[11] = "BSnow";  
 
  # Save the formatted data frame to a CSV file 
  write.csv(x=lansingWeatherRS, file="data/formattedLansingWeather.csv");
}