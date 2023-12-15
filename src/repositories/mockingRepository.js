import {fakerES_MX as faker} from '@faker-js/faker'

class MockingRepository{
    getProducts(){
        const products = {
            _id: faker.string.alphanumeric(24),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({min:15, max:1500}),
            code: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
            status:true,
            category:faker.commerce.product(),
            stock: faker.number.int(100),
            thumbnail:faker.image.urlPicsumPhotos({ width: 286,height:100 }),
        }
        return products
    }

    createUser(){
        const user= {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int(90),
            //Este es un Cart de Test
            cartId: "655c0179b0e6d15326c8290e",
            role: 'user'
        }
        return user
    }
}

export default MockingRepository