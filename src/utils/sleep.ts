export const sleep = async (seconds: number = 1) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};
