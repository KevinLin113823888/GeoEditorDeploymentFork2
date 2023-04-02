const app = require('../index.js');
const request = require('supertest');


//TODO: .... mongodb needs to be mocked because all the tests are actual api requests....

test("register", async () => {
    const response =  await request(app).post("/user/register").send({
        name: "username",
        username: "password",
        email: "mockEmailuhh",
        password: "mockPassword"

    })
    console.log(response)
    expect(response.statusCode).toBe(200)
})
// describe('Testing user controller', () => {
//     // it("exposes the API endpoint", async () => {
//     //     await request(server).post("/user").expect(200, { message: "Hello, world!" });
//     // });
//
//
//
// });
//
