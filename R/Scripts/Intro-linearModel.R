## We want to find the relationship between
## length at time t and length at time t+1 for
## a (simulated) population (e.g., Walford plot).
## This requires a linear model of length(t)
## versus length(t+1).  We will fit the model
## with length(t) as the independent variable
## and length(t+1) as the dependent variable.

#prompt user for csv file, read in the data from the csv file
lengthData <- read.csv(file=file.choose());

#Look at part of the data
print(head(lengthData))

#Fit the linear model
linearModelInfo <- lm(year2 ~ year1, data=lengthData)

#look at a summary of the results
print(summary(linearModelInfo))

#extract the slope and intercept
coefficients <- coef(linearModelInfo)

#Make a plot of the data with the model
plot(year2 ~ year1, data=lengthData, 
     ylab="Length at time t+1", 
     xlab="Length at time t");
abline(linearModelInfo) #the model

#Get the residuals
residuals <- linearModelInfo$residuals;

#check to see if any of the residuals are unusually large
if(any(abs(residuals) > 40))
{
  warning("Large residuals"); #output a warning to the user
}

#histogram of the residuals
hist(residuals, main="Residuals");
