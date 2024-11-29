// Verify metrics values are valid.
export const checkMetrics = (metrics: Record<string, object>) => {
  const validType = ['string', 'undefined']; // Type of data authorized.

  Object.keys(metrics).forEach((cryptoName) => {
    const metricsKeys = Object.keys(metrics[cryptoName]);
    const metricsValues = Object.values(metrics[cryptoName]);

    metricsValues.forEach((value, id) => {
      if (!validType.includes(typeof value)) throw new Error(`${cryptoName} ${metricsKeys[id]} type invalid`);
    })
  })
};

// Get crypto with walue for main metrics page.
export const getCryptoWithValue = (metrics: Record<string, object>) => {
  const cryptoAvailable: Record<string, string> = {};
  for (const [crypto, metricsProp] of Object.entries(metrics as object)) {
    if(metricsProp.value) cryptoAvailable[crypto] = metricsProp.value;
  }

  return cryptoAvailable;
};