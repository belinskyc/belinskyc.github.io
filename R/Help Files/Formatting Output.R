{
  rm(list=ls()); options(show.error.locations = TRUE);
 
  # Formatting output in a nice way is harder than using the "sep" property...
  
  val1 = 10;
  val2 = 20;
  val3 = 30;
  val4 = 40;
  
  # You could set the value of sep to a comma but this is probably
  # more agressive at adding commas than you want it to be
  cat(sep=",", "The sample values are:", val1, val2, val3, val4, "\n");
  
  # Showing the same thing using (~) as the separator:
  cat(sep="~", "\nThe sample values are:", val1, val2, val3, val4, "\n");
 
  # Unfortunately, the best way to use commas to separate values is
  # to insert them in yourself. This is the standard way to most
  # programming languages.
  cat("\nThe sample values are:", val1, ",", val2, ",", 
      val3, ",", val4, "\n");
  
  # And, I would also make the value for sep the empty quote so
  # you don't have spaces that you don't want
  cat(sep="", "\nThe sample values are:", val1, ",", val2, ",", 
      val3, ",", val4, "\n");
  
  # Next, I put in my own spaces and an "and" to better present the output
  cat(sep="", "\nThe sample values are: ", val1, ", ", val2, ", ", 
      val3, ", and ", val4, "\n");
}