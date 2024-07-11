const nock = require("nock");

const setupStripeMock = () => {
  nock("https://api.stripe.com")
    .persist() // Persist the Nock interceptor to handle multiple requests
    .post("/v1/charges")
    .reply((uri, requestBody) => {
      const body = JSON.stringify(requestBody); // Parse the request body JSON

      // Extract relevant data from the request body
      const { amount, currency, source } = body;

      // Construct a dynamic response based on the request body
      const response = {
        id: `ch_${Math.floor(Math.random() * 1000)}`, // Generate a random ID for mock purposes
        amount,
        currency,
        status: "succeeded"
      };

      return [200, response]; // Return the dynamic response
    });
};

const setupPayPalMock = () => {
  nock("https://api.paypal.com")
    .post("/v1/payments/payment")
    .reply(200, {
      id: "PAY-1AB23456CD789012EF34GHIJ",
      state: "approved",
      transactions: [
        {
          amount: {
            total: "20.00",
            currency: "USD"
          }
        }
      ]
    });
};

const setupLogisticsMock = () => {
  nock("https://api.logistics.com")
    .post("/v1/shipping")
    .reply(200, {
      tracking_number: "1234567890",
      status: "shipped",
      estimated_delivery: "2023-07-15"
    });
};

const setupDomainMock = () => {
  nock("https://api.domainregistration.com")
    .post("/v1/domains")
    .reply(200, {
      domain: "example.com",
      status: "registered",
      expires: "2024-07-15"
    });
};

const setupAllMocks = () => {
  setupStripeMock();
  setupPayPalMock();
  setupLogisticsMock();
  setupDomainMock();
};

module.exports = setupAllMocks;
