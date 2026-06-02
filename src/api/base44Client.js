export const base44 = {
  auth: {
    async me() {
      throw new Error('Auth client is not configured in this portfolio.');
    },
    logout(redirectUrl) {
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin(redirectUrl = '/login') {
      window.location.href = redirectUrl;
    },
  },
};
