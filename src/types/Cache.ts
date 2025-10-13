type INonceData = {
    used: boolean,
};

type IMetrics = {
    crypto: Record<string, object>,
    lastUpdate: Date,
};

type ICache = {
    nonceData: INonceData,
    metrics: IMetrics,
    hasAlreadyReqMetrics: boolean,
    mailZohoToken: string,
};

export { INonceData, ICache, IMetrics }