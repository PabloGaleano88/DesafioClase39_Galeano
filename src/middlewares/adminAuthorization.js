const adminRoutes = (req, res, next) => {
    console.log(req.session.role)
    if (req.session.admin || req.session.role === "premium") {
        next();
    } else {
        return res.redirect('/products');
    }

}
export default adminRoutes