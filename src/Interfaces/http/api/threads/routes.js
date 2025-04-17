const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadsHandler(request, h),
    options: {
      auth: 'jwt-auth',
    },
  },
];

module.exports = routes;
