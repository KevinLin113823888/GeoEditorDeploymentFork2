const app = require('../index.js');
const request = require('supertest');
const mongoose = require("mongoose");

//TODO: .... mongodb needs to be mocked because all the tests are actual api requests....

describe('Testing user controller', () => {
    const mockCredentials = new mongoose.Types.ObjectId().toString()
    console.log(mockCredentials)

    test("register", async () => {
        const response =  await request(app).post("/user/register").send({
            name: mockCredentials,
            username: mockCredentials,
            email: mockCredentials,
            password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })

    test("login", async () => {
        const response =  await request(app).post("/user/login").send({
            // name: mockCredentials,
            username: mockCredentials,
            // email: mockCredentials,
            password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })

    test("logout", async () => {
        const response =  await request(app).post("/user/logout").send({
            // name: mockCredentials,
            // username: mockCredentials,
            // email: mockCredentials,
            // password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })

    test("forgotUsername", async () => {
        const response =  await request(app).post("/user/forgotUsername").send({
            // name: mockCredentials,
            // username: mockCredentials,
            email: mockCredentials,
            // password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })

    test("sendPasswordRecoveryCode", async () => {
        const response =  await request(app).post("/user/sendPasswordRecoveryCode").send({
            // name: mockCredentials,
            // username: mockCredentials,
            email: mockCredentials,
            // password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })

    test("changePassword", async () => {
        const response =  await request(app).post("/user/changePassword").send({
            // name: mockCredentials,
            // username: mockCredentials,
            // email: mockCredentials,
            // password: mockCredentials
        })
        console.log(response)
        expect(response.statusCode).toBe(200)
    })


});




