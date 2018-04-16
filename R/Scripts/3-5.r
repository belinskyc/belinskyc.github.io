{
  rm(list=ls()); options(show.error.locations = TRUE);  

  # take eight random values from the sequence 1:10 -- allow for repeats
  randomSample1 = sample( x=c(1:10), size=8, replace=TRUE);

  # take eight random values from the sequence 1:10 -- don't allow repeats
  randomSample2 = sample( x=c(1:10), size=8, replace=FALSE);
  
  ### Read data from CSV file and save to a variable
  lansJanTempsDF = read.csv(file = "data/lansingJanTemps.csv"); 
  
  # Default variable is data frame -- convert the variable to a matrix
  lansJanTemps = as.matrix(x=lansJanTempsDF);
  
  ### Sample data from a matrix
  # sample 80 values (allowing for repeats) from lansJanTemps 
  randomTemps = sample(x=lansJanTemps, size=80, replace=TRUE);
  
  # perform a histogram to see if the distribution of random values is normal
  hist(x=randomTemps);
  
  # put a red vertical dashed-line at the mean of random temperatures
  abline(v=mean(randomTemps), col="red", lty=4);

  # normal distribution with a mean of 20 and standard deviation of 4
  normalDist = rnorm(n=200, mean=20, sd=4);
  hist(x=normalDist, col=c("blue", "green"));
  abline(v=mean(normalDist), col="red", lty=4, lwd=3);
   
  # normal distribution based on the mean and standard deviation of maxTemps
  normalTemps = rnorm(n=100, mean = mean(lansJanTemps), 
                      sd=sd(lansJanTemps));
  hist(normalTemps, angle=60, density=10,
      col=c("purple", "black", "red"),
      main="Histogram of Normal Temps Vector",
      xlab="Normal Temps");
  abline(v=mean(normalTemps), col="darkgreen", lty=6, lwd=3);
 
  # text(x=mean(normalTemps), y=10, labels="Mean Value", 
  #    col="darkgreen", cex=1.2);
  # 
  # using set.seed() to produce pseudo-random values
  set.seed(seed=23);
  seedSample1 = sample( x=c(1:100), size=20 );
  seedSample2 = sample( x=c(1:100), size=20 );
  
  # change the seed value in set.seed()
  set.seed(seed=28);
  seedSample3 = sample( x=c(1:100), size=20 );
  seedSample4 = sample( x=c(1:100), size=20 );
  
  # reset the seed
  set.seed(seed=23);
  seedSample5 = sample( x=c(1:100), size=20 );
  seedSample6 = sample( x=c(1:100), size=20 );
   
  # get 80 pseudo-random values from the maxTemp vector
  setSeedTemps = sample(x=lansJanTemps, size=80, replace=TRUE);
   
  # get 100 pseudo-random normalized temperature values
  setSeedNormalTemps = rnorm(n=100, mean = mean(lansJanTemps), 
                             sd=sd(lansJanTemps));
  
  # make a list of the four temperature vector we have generated in this script
  listOfTemps = list("Random_Temps" = randomTemps, 
                     "Normal_Temps" = normalTemps, 
                     "Set_Seed_Temps" = setSeedTemps, 
                     "Set_Seed_Normal_Temps" = setSeedNormalTemps);

  # subsetting temperature vectors from the list
  listRandomTemps = listOfTemps[["Random_Temps"]];
  listSeedTemps = listOfTemps[["Set_Seed_Normal_Temps"]];
  # 
  # # save the list to a file
  # save(listOfTemps, file = "data/weatherList.rdata");
}