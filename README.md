# Webhook - MRs Gitlab x Mattermost
Este projeto tem interesse em servir como webhook utilizado para enviar mensagens a canais mattermost, quando um merge request Gitlab for aberto.

## Como utilizar?
Vamos utilizar como exemplo, um projeto onde temos 2 repositórios backend e 2 repositórios frontend, e desejamos receber mensagens de MRs abertos nesses repositórios de forma separada, em canais diferentes.

### Hospedagem
Precisaremos ter uma url disponível para o gitlab realizar requisições ao nosso webhook, portanto, é necessário hospedar o projeto em um servidor node. Utilizaremos o Heroku neste exemplo. Url gerada: `https://mattermost-gitlab-webook.herokuapp.com/`

### Mattermost
No mattermost, é necessário criar webhooks de entrada nos canais que deseja receber mensagens de merge requests abertos. Para tal, vá no menu Integrações.

![image](https://user-images.githubusercontent.com/16538201/125124084-eaf87100-e0cd-11eb-8bfa-e58c4fde6bb7.png)

Em seguida, Webhooks Entrada

![image](https://user-images.githubusercontent.com/16538201/125124238-2b57ef00-e0ce-11eb-90f4-54413e3f8de9.png)

Clique no botão `Adicionar Webhooks Entrada`

![image](https://user-images.githubusercontent.com/16538201/125124499-8db0ef80-e0ce-11eb-864d-ddce891561a1.png)

Preencha os dados do formulário e clique em `Salvar`

![image](https://user-images.githubusercontent.com/16538201/125124976-542cb400-e0cf-11eb-8097-777131dab0d9.png)

Guarde a URL gerada

![image](https://user-images.githubusercontent.com/16538201/125125037-6d356500-e0cf-11eb-9dc0-8a7674c008a7.png)

Repita o mesmo processo para o canal de MRs frontend

### Gitlab
No gitlab, abra o repositório do qual que deseja receber mensagens, vá no menu Settings, em seguida, Webhooks.

![image](https://user-images.githubusercontent.com/16538201/125125760-7410a780-e0d0-11eb-8810-b50a6752b2c1.png)

Adicione a URL de onde hospedou o projeto, gere um `Secret Token` (uma string qualquer) e guarde-o, pois utilizaremos como variável de ambiente, e marque somente a trigger `Merge request events`. Em seguida, clique no botão `Add webhook`.

![image](https://user-images.githubusercontent.com/16538201/125126463-86d7ac00-e0d1-11eb-951a-536522b434f0.png)

Repita o processo para os outros projetos.

### Configuração da hospedagem
Agora precisamos adicionar algumas variáveis de ambiente no servidor onde foi realizado o deploy do nosso webhook.

#### GITLAB_SECRET_TOKEN
`Secret token` que foi utilizado na hora de adicionar os webhooks no Gitlab. Neste exemplo, utilizamos `84316468-5999-421f-acae-a468e5e23a67`

#### PROJECT_BACKEND_MM_WEBHOOKS
Webhook que criamos no mattermost para o backend. Pode ser mais de um, separados por `,` caso desejável. Neste exemplo, utilizamos `https://chat.acclabs.com.br/hooks/u9n8njxeup8d7mdybn5tbjbs8a`

#### PROJECT_BACKEND_URLS
Urls dos projetos backend, separados por `,`. Pode ser utilizado parte da url. Neste exemplo, utilizamos `arca/arca2006crmf1/arca-backend,arca/arca2006crmf1/arca-database`

#### PROJECT_FRONTEND_MM_WEBHOOKS
Webhook que criamos no mattermost para o frontend. Pode ser mais de um, separados por `,` caso desejável. Neste exemplo, utilizamos `https://chat.acclabs.com.br/hooks/e51m8g9t9jbt8x6pwmnyyk6a7c`

#### PROJECT_FRONTEND_MM_WEBHOOKS
Urls dos projetos frontend, separados por `,`. Pode ser utilizado parte da url. Neste exemplo, utilizamos `arca/arca2006crmf1/arca-front`

-----

É possível enviar mensagens de MRs abertos de outras equipes (DevOps por exemplo) criando mais variáveis de ambiente. Basta seguir o padrão `PROJECT_<NOME_DA_EQUIPE>_MM_WEBHOOKS` para os webhooks do mattermost, e `PROJECT_<NOME_DA_EQUIPE>_URLS` para urls dos projetos gitlab.
