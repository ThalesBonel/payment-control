const request = require("supertest");
const { expect } = require("chai");

describe.skip("Mutation - Criar Funcionario", () => {
  let token;
  let cpfReaproveitado = Date.now();
  console.log(`Primeiro cpf: ${cpfReaproveitado}`);

  before(async () => {
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .send({
        query: `mutation Login($email: String!, $senha: String!) {
                                    login(email: $email, senha: $senha) {
                                        token
                                    }
                        }`,
        variables: {
          email: "admin@admin.com",
          senha: "123456",
        },
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login).to.have.property("token");
    token = resposta.body.data.login.token;
  });
  it("Deve criar um funcionario quando preencho os campos obrigatórios de forma válida", async () => {
    console.log(cpfReaproveitado);
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                        criarFuncionario(input: $input) {
                            id
                            cpf
                            nome
                            salario_base
                            admissao
                            desligamento
                        }
                    }`,
        variables: {
          input: {
            cpf: `${cpfReaproveitado}`,
            nome: "Rogério Ceni",
            salario_base: 105000.9,
            admissao: "2026-01-01",
            desligamento: "",
          },
        },
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.criarFuncionario).to.have.property("id");
  });

  it("Deve criar um funcionario quando preencho todos os campos de forma válida", async () => {
    let cpf = Date.now();
    console.log(cpf);
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                        criarFuncionario(input: $input) {
                            id
                            cpf
                            nome
                            salario_base
                            admissao
                            desligamento
                        }
                    }`,
        variables: {
          input: {
            cpf: `${cpf}`,
            nome: "Rogério Ceni",
            salario_base: 105000.9,
            admissao: "2026-01-01",
            desligamento: "2026-01-20",
          },
        },
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.criarFuncionario).to.have.property("id");
  });

  it("Não deve crir um funcionário quando o salario é passado como string", async () => {
    let cpf = Date.now();
    console.log(cpf);
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                        criarFuncionario(input: $input) {
                            id
                            cpf
                            nome
                            salario_base
                            admissao
                            desligamento
                        }
                    }`,
        variables: {
          input: {
            cpf: `${cpf}`,
            nome: "c",
            salario_base: "105000.9",
            admissao: "2026-01-01",
            desligamento: "2026-01-20",
          },
        },
      });
    expect(resposta.status).to.equal(400);
    expect(resposta.body.errors[0]).to.have.property(
      "message",
      `Variable \"$input\" got invalid value \"105000.9\" at \"input.salario_base\"; Float cannot represent non numeric value: \"105000.9\"`,
    );
  });

  it("Não deve crir um funcionário quando o nome é passado em branco", async () => {
    let cpf = Date.now();
    console.log(cpf);
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                        criarFuncionario(input: $input) {
                            id
                            cpf
                            nome
                            salario_base
                            admissao
                            desligamento
                        }
                    }`,
        variables: {
          input: {
            cpf: `${cpf}`,
            nome: "",
            salario_base: 105000.9,
            admissao: "2026-01-01",
            desligamento: "2026-01-20",
          },
        },
      });
    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property("message", "CPF, nome, salário base e admissão são obrigatórios.");
  });

  it("Não deve crir um funcionário quando o cpf passado já foi cadastrado", async () => {
    console.log(cpfReaproveitado);
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                        criarFuncionario(input: $input) {
                            id
                            cpf
                            nome
                            salario_base
                            admissao
                            desligamento
                        }
                    }`,
        variables: {
          input: {
            cpf: `${cpfReaproveitado}`,
            nome: "Rogério Ceni",
            salario_base: 105000.9,
            admissao: "2026-01-01",
            desligamento: "2026-01-20",
          },
        },
      });
    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property("message", "Já existe funcionário com este CPF.");
  });
});
