import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the Authorization header

  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
};

export { authenticate };
