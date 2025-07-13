import { getAuth } from '@clerk/express';

export const protectRoute = async (req, res, next) => {

  const auth = await getAuth(req);
  console.log('Auth result:', JSON.stringify(auth, null, 2)); // Отладка
  if (!auth.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      reason: auth.reason,
      message: auth.message
    });
  }
  res.json({
    isSignedIn: true,
    data: {
      userId: auth.userId,
      sessionId: auth.sessionId,
      claims: auth
    }
  });

  next();
};