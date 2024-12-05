const fakeApiResponse = { success: true };

export const accountService = {
  login: async (credentials) => {
    console.log('Fake API call:', credentials);
    return new Promise((resolve) =>
      setTimeout(() => resolve(fakeApiResponse), 1000)
    );
  },
};
