

// middleware/isAdmin.js
 const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); //  Allow access
  } 
   return res.status(403).json({ msg: "Access denied: Admins only" }); //  Forbidden
  
};


export default isAdmin;