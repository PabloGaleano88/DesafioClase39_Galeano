export const currentSessionDTO = (userData)=>{
    const userDTO = {
        fullName: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        age: userData.age,
        cartId:userData.cartId._id,
        products: userData.cartId.products
    }
    return userDTO
}
