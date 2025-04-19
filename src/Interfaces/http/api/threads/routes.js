const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadsHandler(request, h),
    options: {
      auth: 'jwt-auth',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadByIdHandler(request, h),
  },

];

module.exports = routes;
