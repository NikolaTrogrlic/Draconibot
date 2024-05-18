
let randomIterator = 0;
let currentRandomArray = 0;
let randomSpreads = [
   shuffleArray([...Array(100).keys()]),
   shuffleArray([...Array(100).keys()]),
   shuffleArray([...Array(100).keys()]),
   shuffleArray([...Array(100).keys()]),
   shuffleArray([...Array(100).keys()])
];
const amountOfSpreads = randomSpreads.length;

export function getRandomPercent(): number{

   if(randomIterator < 100){
      randomIterator++;
   }
   else{
      randomIterator = 0;
      currentRandomArray++;
      if(currentRandomArray >= amountOfSpreads){
         currentRandomArray = 0;
      }
   }

   return randomSpreads[currentRandomArray][randomIterator];
}

function shuffleArray(array: any[]): any[] {
   var m = array.length, t, i;
   while (m) {
     i = Math.floor(Math.random() * m--);
     t = array[m];
     array[m] = array[i];
     array[i] = t;
   }
 
   return array;
 }