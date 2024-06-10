module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://fakeapi.platzi.com/api/:path*',
        },
      ];
    },
  };