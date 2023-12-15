const userRoutes= (req,res, next)=>{
    if (req.session.admin || !req.session.isLogged) {
        return res.redirect('/products')
    }
    next()
}
export default userRoutes