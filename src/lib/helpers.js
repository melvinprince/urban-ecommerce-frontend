const QAR_TO_USD = 0.27;

function convertToUSD(qarAmount) {
  return (qarAmount * QAR_TO_USD).toFixed(2);
}

export { convertToUSD };
