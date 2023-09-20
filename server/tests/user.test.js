const app = require('../app.js');
const request = require('supertest');
const mongoose = require("mongoose");
const server = require('../index.js')


describe('Testing user controller', () => {

    let mockCredentials = new mongoose.Types.ObjectId().toString()
    let recoveryCode = ""

    afterAll(() => {
        server.close()
    })

    test("register", async () => {
        const response =  await request(app).post("/user/register").send({
            name: mockCredentials,
            username: mockCredentials,
            email: mockCredentials,
            password: mockCredentials
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBeDefined();
    })

    test("login, loggedIn, logout cookie tests", async () => {
        const agent = request.agent(app);
        const response1 =  await agent.post("/user/login").send({
            username: mockCredentials, //this test MUST log in with proper credentials to work
            password: mockCredentials
        })
        const response2 =  await agent.get("/user/loggedIn")
        expect(response1.statusCode).toBe(200)
        expect(response1.body.name).toBeDefined();

        expect(response2.statusCode).toBe(200)
        expect(response2.body.username).toBeDefined();
        expect(response2.body.mapcards).toBeDefined();

    })


});




