const request = require("supertest");
const { expect } = require("chai");
const { login } = require("../../helpers/login.js");
const loginData = require("../../fixtures/login.json");
/*
    TODO - Criar teste p/  usuario inativo
*/
describe("Mutation - Login", () => {
  it("Deve realizar login com sucesso quando informo credenciais validas", async () => {
    const resposta = await login(loginData.admin);
    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login).to.have.property("token");
    expect(resposta.body.data.login.token).to.not.be.empty;
    expect(resposta.body.data.login.token).to.be.a("string");
    expect(resposta.body.data.login.token).to.include("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
  });

  it("Não deve realizar login com sucesso quando informo credenciais invalidas", async () => {
    const usuario = { ...loginData.admin, senha: "1234567" };

    const resposta = await login(usuario);
    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property("message", "Credenciais inválidas ou usuário inativo.");
  });

  it("Não deve realizar login com sucesso quando não informo senha", async () => {
    const usuario = { ...loginData.admin };

    const resposta = await login(usuario);

    expect(resposta.status).to.equal(400);
    expect(resposta.body.errors[0]).to.have.property("message", `Variable \"$senha\" of required type \"String!\" was not provided.`);
  });

  it.only("Não deve realizar login com sucesso quando informo email em branco", async () => {
    const usuario = { ...loginData.admin, email: "" };

    const resposta = await login(usuario);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property("message", "Credenciais inválidas ou usuário inativo.");
  });

  it("Não deve realizar login com sucesso quando passo senha como float", async () => {
    const usuario = { ...loginData.admin, senha: 123456 };

    const resposta = await login(usuario);

    expect(resposta.status).to.equal(400);
    expect(resposta.body.errors[0]).to.have.property(
      "message",
      'Variable "$senha" got invalid value 123456; String cannot represent a non string value: 123456',
    );
  });
});
