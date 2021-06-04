# Challenge - iHero

Este projeto teve como intuido testar meus conhecimentos técnicos no desenvolvimento fullstack. O tema é um sistema de gerenciamento de distribuição de heróis para combater ameaças fornecidas por um socket.io. 

## Backend

Para o desenvolvimento do backend escolhi o framework web Django e linguagem Python em conjunto com Django Rest Framework (DRF) para disponibilização de API's Restful. 

### Dependências do Backend

- django: Framework web para Python.
- django-rest-framework: Ferramenta para tornar o Django em uma aplicação RESTful API.
- django-rest-auth: Biblioteca que traz lógica e endpoints para facilitação de autenticação de usuário.
- django-allauth: Biblioteca que traz ferramentas para registro de usuários, disponibilizando diversas formas de login.
- django-cors-headers: Biblioteca que nos ajudam a afrouxar as seguranças do Django e permitir requests de outros lugares.
- geopy: Biblioteca para operações, cálculos e serviços geográficos.
- psycopg2: Biblioteca para conexão com o PostgreSQL database.

### Banco de Dados

O banco de dados utilizado foi o PostgreSQL

### Autenticação

Para a autenticação de usuários foi criado um modelo custom de usuários a partir do padrão oferecido pelo Django para que permita maior customização no futuro.
O modelo de autenticação utilizado foi por Token simples, ele fica salvo no localStorage do usuário e precisa ser enviado em todas as requisições para qualquer endpoint que não seja de login ou signup.

### CRUD

Foi solicitado apenas o CRUD de Heróis, porém também desenvolvi um CRUD para Ameaças para manter o histórico e relação de batalha.

Os heróis possuem: 
- name
- rank
- original_location: Localização cadastrada.
- current_location: Localização atual que inicia na mesma posição da original e é atualizada com a localização do monstro ao iniciar a batalha.
- inBattle: Booleano para sabermos se está em batalha ou não.

As ameaças possuem:
- unique_id: Um reforço para que não seja possível cadastrar a mesma ameaça duas vezes mesmo quando occore várias requisiçoes ao mesmo tempo ao banco.
- name
- level
- location
- start_timestamp: Timestamp de quando a ameaça chegou
- battle_start_timestamp: Timestamp do início da batalha
- battle_end_timestamp: Timestamp predito da finalização da batalha
- isActive: Booleano para se ameaça está ativa
- inBattle: Booleano para se a ameaça está em batalha
- battle_with: Chave estrangeira para o herói que está batalhando ou batalhou

### Distribuição de Heróis

A conexão com o socket foi feito no frontend, ao receber a mensagem de nova ameaça o client manda as informações para cadastro da ameaça no banco de dados. Foi decidido que não é possível cadastrar uma mesma ameaça que possui exatamente as mesmas informações, então ao chegar a mesma ameaça apenas é ativada se já estiver sido derrotada, para ser derrotada novamente.

A cada 10 segundos o frontend faz uma requisiçao para dois endpoints do backend:
- /api/deploy_heroes/: Verifica todas as ameaças ativas e calcula o herói que não esteja em batalha com menor distância e rank adequado para cada ameaça.
- /api/update_battles/: O tempo de batalha é decidido de forma randômica entre os valores disponibilizados nas instruções dependendo do nível da ameaça e  prediz timestamp para o fim da batalha, quando o timestamp atual for maior que o fim da batalha, a batalha é encerrada e a ameaça desativada mantendo o histórico de quem derrotou. O herói fica disponível para novas batalhas.

### Considerações

- Como as depedencias foram poucas optei por não utilizar um gerenciador de pacotes e versões como Poetry ou Pipenv, apenas um requirements.txt.
- Por se tratar de um testes não me preocupei em fazer um .env file com as informações sensíveis, porém nunca as deixaria presentes no projeto em produção.

## Frontend

Para o desenvolvimento do Frontend escolhi o framework ReactJS, escolhi esse framework para me forçar a estudar ainda mais sobre ele, porém entrei nesse desenvolvimento com um conhecimento bem raso e quase zero do framework, quase tudo utilizado foi estudado e aprendido durante o desenvolvimento.

### Dependências do Frontend

- axios: "^0.21.1", 
- bootstrap: "^5.0.1",
- leaflet: "^1.7.1", - Ferramenta para utilização de mapas
- react: "^17.0.2",
- react-dom: "^17.0.2",
- react-leaflet: "^3.1.0", - Ferramenta para facilitar a utilização do Leaflet
- react-router-dom: "^5.2.0", - Biblioteca para roteamento de navegação
- react-scripts: "4.0.3",
- socket.io-client: "^2.3.1", - Biblioteca para conexão com o socket.io (Foi necessário utilizar uma versão antiga para que a conexão funcionasse)

### Socket.io

A conexão com o socket foi feita no frontend, no dashboard existe um botao para ativar e desativar a escuta das ameaças para que não fique adicionando de forma infinita novas ameaças durante o teste.

### Auntenticação 

A autenticação é feita com o Username e Password do usuário, assim como a cadastro também. Ao logar ou cadastrar o client recebe um token através da response que fica guardada no localStorage do client, se o usuário não possuir o token ele sempre vai ser redirecionado para o login não importa qual página tente acessar, porém não foi feita a validação do token pelo frontend, então se o token existir mas não for válido o usuário vai poder acessar as páginas mas não vai conseguir fazer requisições ao backend.

### CRUD

A tela de CRUD é bem simples com uma tabela, um botão para adicionar e os botões para editar ou remover o herói em cada linha da tabela.

### Distribuição de Heróis

A tela principal chamada Dashboard possui um mapa que mostra todas as ameaças ativas e as batalhas que estão ocorrendo, além de um botão para iniciar ou para a escuta do socket.

### Histórico de Ameaças

Por cada ameaça derrotada possuir uma chave estrangeira com o herói é simples montar uma tabela que mostre o histórico das ameaças derrotadas, disponibilizando todos os dados de duração da ameaça, duração da batalha e o herói que batalhou.

### Considerações

- Como meu conhecimento do framework era bem raso, passei mais tempo estudando e não foquei tanto no aspecto visual da aplicação.
- A validação da localização do herói é feita por regex e embora não mostre mensagem, não permite a criação do herói se fugir do padrão.
- Não foi possível fazer uma tabela mais elaborada de histórico de ameaças, pois não consegui utilizar Datatables no react e não tinha tempo para fazer de outra forma.

## Como rodar

Para virtualizaçao e ambiente da aplicação foi utilizado o Docker e Docker-Compose em conjunto com o Nginx para proxy reverso para que fosse possível rodar as duas aplicaçoes (back e front) no mesmo domínio.

Para rodar o projeto é necessário ter o Docker e docker-compose instalado na máquina.

Caso você não tenha instalado, pode seguir [esse gist](https://gist.github.com/raisiqueira/fa6e55ffaaaffde717a2fe2230422fe9) que nele tem os comandos (para linux) pra rodar o docker.

Depois de ter o docker instalado, na pasta raíz do repositório é só rodar o comando:

```bash
$ docker-compose up --build
```

Caso queira rodar sem olhar os logs é só colocar a tag `-d` e após rodar a primeira vez pode utilizar sem o `--build`.

Nesse docker-compose existem quatro serviços: O backend, frontend, postgresql e o nginx.

Na primeira vez com esse primeiro comando, pode ocorrer um erro pois o banco de dados está sendo criado e mesmo com o backend dependendo dele as vezes pode ocorrer de dar falha, então é só rodar o comando novamente.

Ao rodar o comando todas as dependências serão instaladas e as migrações do banco serão aplicadas.

Para acessar a aplicação é só acessar `http://localhost:81/` no navegador de escolha.

## Considerações Finais

Foi um ótimo desafio para exercitar e aprofundar alguns conhecimentos e foi uma ótima oportunidade de me aventurar no frontend e desenvolver em um framework que não possuo tanta familiaridade, fiz o melhor no tempo que consegui, espero que gostem :).

## TODO

- Implementar testes
- Versão 2.0 da UI
- Melhor sistema de autenticação com tempo para expirar
- Estudar mais sobre contextAPI e Redux para melhorar o fluxo de estados no frontend
- Aprimorar o sistema de batalhas


