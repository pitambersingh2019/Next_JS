// used to work out the colour to use for a score background on dashboard components 
const getScoreColour = (score: number, percent = true): string => {

  let style = 'red';
  
  switch (true) {

    case (percent && score >= 75) || (!percent && score >= 3.8): 
      style = 'green';
      break;
  
    case (percent && score >= 50 && score < 74) || (!percent && score >= 2.5 && score < 3.8):
      style = 'yellow';
      break;
  
    case (percent && score >= 25 && score < 49) || (!percent && score >= 1.2 && score < 2.4):
      style = 'orange';
      break;
      
    default:
      style = 'red';
      break;
     
  }

  return style;
  
};
  
export default getScoreColour;