function authorize(user_role){
        return (req, res, next) => {
          if (req.user.role !== user_role) {
            return res
              .status(403)
              .json({ message: 'You do not have permission to access this resource.' })
          }
          next()
        }
 
}
module.exports = authorize;