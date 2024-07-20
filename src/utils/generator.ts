const generateRandomCode = (length: number): string => {
  let code = '';
  let lengthCode = 0;
  const letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  while(lengthCode < length) {
      const randomNumber = Math.floor(Math.random() * 10);
      const randomForLetter = Math.floor(Math.random() * 26);
      const letterOrNumber = Math.floor(Math.random() * 2);

      if(letterOrNumber === 0) code += letterArray[randomForLetter];
      if(letterOrNumber === 1) code += randomNumber;

      ++lengthCode;
  }
  return code;
};

export { generateRandomCode };