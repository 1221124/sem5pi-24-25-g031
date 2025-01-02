function mockIsAuth(roles) {

    return function(req, res, next) {
        req.user = { role: 'Doctor', id: 'mockedUserId' }; // Mock user data
        next();
      };
  
}
  
export default mockIsAuth;