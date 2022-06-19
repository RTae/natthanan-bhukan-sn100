const isNumberInArray = (arr: number[], target: number) => {
  for (const value of arr) {
    if (value === target) return true;
  }

  return false;
};

export { isNumberInArray };
