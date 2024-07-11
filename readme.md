# E-Commerce Platform Overview

## Project Description
This project is an e-commerce platform designed to handle various aspects of online retail operations. It focuses on creating robust APIs, integrating with third-party services, ensuring security, and optimizing performance.

## Features Implemented

1. **API Development**
   - **RESTful APIs:** Developed using Node.js and Express.js for user management, product management, and order processing.
   - **Authentication and Authorization:** Implemented JWT (JSON Web Tokens) for secure authentication and authorization mechanisms.

2. **Database Integration**
   - **MongoDB:** Integrated MongoDB database with schemas for users, products, orders, and payments.
   - **Data Validation:** Implemented robust data validation techniques to ensure data integrity.
   - **Error Handling:** Comprehensive error handling strategies implemented throughout the application.

3. **Mock Third-Party Integrations**
   - **Payment Gateways:** Created mock integrations for payment gateways such as Stripe and PayPal using tools like nock.
   - **Logistics and Domain Registration:** Mock APIs set up for logistics providers and domain registration services.

4. **Security Measures**
   - **SSL/TLS:** Implemented for secure communication between clients and servers.
   - **Input Validation:** Applied rigorous input validation to prevent security vulnerabilities.
   - **Rate Limiting:** Implemented to mitigate potential abuse and ensure service availability.
   - **Secure Storage:** Ensured sensitive information such as passwords and tokens are securely stored.

5. **Scalability and Performance Optimization**
   - **High Volume Handling:** Designed to efficiently handle a high volume of concurrent requests.
   - **Database and API Optimization:** Optimized database queries and API performance for responsiveness and scalability.





## Additional Features Implemented

   - **Test Cases:** Comprehensive test cases implemented to validate functionality and ensure reliability.
   - **Refresh Token & Logout Functionality:** Implemented functionality for refreshing JWT tokens and secure logout processes.
   - **Cookie Parser:** Utilized for parsing and handling cookies securely.
   - **Token Blacklisting:** Implemented mechanism to blacklist JWT tokens for enhanced security.

### Features Summary
- USER -> Register, Login, LogOut, Refresh Token.
- Product -> Add, Edit, Update, Delete and View List Product.
- Order -> Create Order, Add Products to Order, View All, View Specific, Update and Delete Order.
- Payment -> Make Payment via stripe, Paypal, Logistic Api Integration. Can view the Payment Details

### Start App
`npm i 
npm start`

### Admin Credentials for RBAC
- username -> admin
- password -> admin

### Main APIs
**User**
- Login -> 
```
localhost:9090/api/user/login POST
{
      "username": "admin",
      "password": "admin"
}
```
- Register ->  
```
localhost:9090/api/user/signup POST
{
    "username":"john" ,
    "name": "John Andrews",
    "address": "234 Tx Plano",
    "email": "john@myindiaa.com",
    "password": "myindiaa",
    "phone": "123456789"
}
```   
- Logout -> 
```
localhost:9090/api/user/logout GET
```
**Product**
- Create -> 
```
localhost:9090/api/product/ POST
{
    "name": "Panasonic AC",
    "description": " Air conditioner product",
    "price": 73000,
    "category": "Appliances",
    "stock": 20
}
```

- View -> 
```
localhost:9090/api/product/ GET
```
- View Single -> 
```
localhost:9090/api/product/:id GET
```
- EDIT Single -> 
```
localhost:9090/api/product/:id PUT
```
- DELETE Single -> 
```
localhost:9090/api/product/:id DELETE
```

**Order**
- Create 
```
localhost:9090/api/order/ POST
{
  "products": [{
          "product": "samsung s24",
          "quantity": 2
  }],
    "totalAmount": 232
}
```

- View All 
```
localhost:9090/api/order/ GET
```

- View Single 
```
localhost:9090/api/order/:id GET
```

- Edit 
```
localhost:9090/api/order/:id PUT
{
  "status": "shipped"
}
```

- Delete 
```
localhost:9090/api/order/:id DELETE
```
**Payment**
- Make Payment
```
localhost:9090/api/payment/ POST
{
   "orderId": "66900660f594bdbc532d8cca" ,
    "paymentMethod": "stripe",
    "amount": 5000
}

```
- Get Payment Details
```
localhost:9090/api/payment/:id GET
```


## Conclusion
This e-commerce platform represents a comprehensive solution for online retail operations, incorporating advanced features for security, scalability, and performance optimization. It aims to provide a seamless and secure shopping experience for both users and administrators.
