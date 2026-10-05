const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');//Importa a conexão com o Supabase
const app = express();
const PORT = process.env.PORT || 3000;


//Middleware essenciais
app.use(cors()); //Permite que o frontend acesse este backend sem erros de CORS
app.use(express.json());//Permite que o Express entenda requisições com corpo em JSON


//Passo 1 memória ram do servidor
let produtosEmMemoria = [
    {id: 1, nome: 'Teclado Mecânico RGB', preco: 15.00},
    {id: 2, nome: 'Mouse Gamer 3200 DPI', preco: 85.50}
];

//Rota GET
app.get('/produtos', async (req, res) => {
    console.log('[GET /produtos] Enviando produtos...');

    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//Rota POST
app.post('/produtos', async (req, res) => {
    const { nome, preco } = req.body;

    if(!nome || !preco) {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' });
    }

    const novoProduto = {
        nome,
        preco: parseFloat(preco)
    };

    const { data, error } = await supabase
        .from('produtos')
        .insert([novoProduto])
        .select()
        .single();

    if (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao adicionar produto!' });
    }

    console.log(`[POST /produtos] Produto adicionado no Supabase: ${data.nome}`);

    res.status(201).json(data);
});

// Rota PUT: Alterar um produto 
app.put('/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nome, preco } = req.body;
  const produto = produtosEmMemoria.find((item) => item.id === id);
  
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado." });
  }
  if(typeof nome !== 'string' || nome.trim() === '' || !Number.isFinite(Number(preco))) {
    return res.status(400).json({ mensagem: "Informe um nome e preço válidos." });
  }

  produto.nome = nome.trim();
  produto.preco = parseFloat(preco);
  
  res.json(produto);
});

// Rota DELETE: Remover um produto
app.delete('/produtos/:id', async (req, res) => {
    const id = Number(req.params.id);
    const indice = produtosEmMemoria.findIndex((produto) => produto.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    const [produtoRemovido] = produtosEmMemoria.splice(indice, 1);
    res.json(produtoRemovido);
});

//Listen Iniciar o servidor
app.listen(PORT, () => {
    console.log('===============================================================');
    console.log(`Servidor Back-End rodando em http://localhost:${PORT}`);
    console.log('Rota de produtos ativa em http://localhost:3000/produtos');
    console.log('Status: MODO MEMÓRIA RAM ATIVO');
    console.log('===============================================================');
});