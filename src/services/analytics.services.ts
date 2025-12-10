// Send event to GA4 with Measurement Protocol API
const sendEventToGA = async (clientId: string, name: string, id: number, title: string) => {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_TRACKING_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
            client_id: clientId,
            events: [
                {
                    name: name,
                    params: {
                        post_id: id,
                        post_title: title,
                    },
                },
            ],
        }),
    });
}

export { sendEventToGA }