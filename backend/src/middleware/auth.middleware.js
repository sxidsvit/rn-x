// import { getAuth } from '@clerk/express';

// export const protectRoute = async (req, res, next) => {

//   const auth = getAuth(req);
//   console.log('         ')
//   console.log('         ')
//   console.log('protectRoute - auth.isAuthenticated: ', auth.isAuthenticated); // Отладка
//   console.log('protectRoute - auth.userId: ', auth.userId); // Отладка
//   console.log('         ')
//   console.log('         ')

//   if (!auth.userId) {
//     return res.status(401).json({
//       error: 'Unauthorized',
//       reason: auth.reason,
//       message: auth.message
//     });
//   }
//   res.json({
//     isSignedIn: true,
//     data: {
//       userId: auth.userId,
//       sessionId: auth.sessionId,
//       claims: auth
//     }
//   });

//   next();
// };

export const protectRoute = async (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};