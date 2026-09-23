const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ARQUIVO = "./dados.json";

function lerDados() {
  return JSON.parse(fs.readFileSync(ARQUIVO, "utf8"));
}

function salvarDados(dados) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2));
}

// Teste do servidor
app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "Backend do restaurante funcionando!"
  });
});

// Buscar todos os dados
app.get("/api/dados", (req, res) => {
  res.json(lerDados());
});

// Buscar cardápio
app.get("/api/cardapio", (req, res) => {
  const dados = lerDados();
  res.json(dados.cardapio);
});

// Adicionar produto
app.post("/api/cardapio", (req, res) => {
  const dados = lerDados();

  const produto = {
    id: Date.now(),
    nome: req.body.nome,
    descricao: req.body.descricao || "",
    preco: Number(req.body.preco),
    imagem: req.body.imagem || ""
  };

  dados.cardapio.push(produto);
  salvarDados(dados);

  res.status(201).json(produto);
});

// Criar pedido
app.post("/api/pedidos", (req, res) => {
  const dados = lerDados();

  const pedido = {
    id: Date.now(),
    cliente: req.body.cliente || "",
    itens: req.body.itens || [],
    total: Number(req.body.total || 0),
    status: "pendente",
    criadoEm: new Date().toISOString()
  };

  dados.pedidos.push(pedido);
  salvarDados(dados);

  res.status(201).json(pedido);
});

// Buscar pedidos
app.get("/api/pedidos", (req, res) => {
  const dados = lerDados();
  res.json(dados.pedidos);
});

app.listen(PORT, () => {
  console.log(`Backend funcionando na porta ${PORT}`);
});