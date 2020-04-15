const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  // Retornando lista com todos os repositorios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  //Pegando title, url e techs do corpo
  const { title, url, techs} = request.body;

  //Criando um objeto repository com id=uuid, title, url, techs, e like (iniciando com 0)
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  //Colocando o objeto repository no array repositories
  repositories.push(repository);

  //Retornando repository criado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //Pegando ID de params, e title, url e techs de body
  const { id } = request.params;
  const { title, url, techs} = request.body;

  //Procurando indice do repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //Se repositorio não existir (-1), retorna status 400
  if( repositoryIndex === -1) return response.status(400).json({ error: 'Repository does not exist'});

  //Alterando repositorio
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  //Altera o repositorio
  repositories[repositoryIndex] = repository;
  
  //Retorna repositorio alterado
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  //Pegando ID de params
  const { id } = request.params;

  //Procurando indice do repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //Se repositorio não existir (-1), retorna status 400
  if( repositoryIndex === -1) return response.status(400).json({ error: 'Repository does not exist'});

  //Caso exista, exclua uma posição
  repositories.splice(repositoryIndex, 1);
  
  //Retorna status 204
  return response.status(204).send();

});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //Procurando indice do repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
 
  //Se repositorio não existir (-1), retorna status 400
  if( repositoryIndex === -1) return response.status(400).json({ error: 'Repository does not exist'});

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
