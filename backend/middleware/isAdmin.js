import { isAdmin } from "../middleware/isAdmin.js";

// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); //  Allow access
  } else {
    res.status(403).json({ msg: "Access denied: Admins only" }); //  Forbidden
  }
};
