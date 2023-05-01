const express = require("express");
const request = require("supertest");
const { describe, expect, test, beforeAll } = require("@jest/globals");

const app = express();



const consoleLog = async () => {
  console.log("worked");
  return 5;
};

app.post("/api/users/login", consoleLog);



describe("test userLogin controller", () => {
  beforeAll(() => {
    app.listen(3000);
  });
 
  test("first", async () => {
    const response = await request(app).post("/api/users/login");
    expect(response.status).toBe(200);
  });
});