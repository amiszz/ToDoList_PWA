# Minhas Tarefas - PWA

Uma aplicação web progressiva (PWA) para gerenciar tarefas organizadas por categorias, com suporte offline e instalação como aplicativo nativo.

## Características

- **Organização por Categorias** - Crie e organize suas tarefas em diferentes categorias
- **Gerenciamento de Tarefas** - Adicione, marque como concluída e delete tarefas
- **Armazenamento Local** - Todos os dados são salvos no localStorage do navegador
- **Instalável** - Instale a aplicação como um app nativo em seu dispositivo
- **Suporte Offline** - Funciona completamente sem conexão de internet graças ao Service Worker
- **Interface Responsiva** - Design adaptável para desktop, tablet e mobile
- **Tema Personalizado** - Interface intuitiva com cores bem definidas

## Como Usar

### No Navegador
1. Clone o repositório:
   ```bash
   git clone <https://github.com/amiszz/ToDoList_PWA.git>
   ```
2. Inicie um Live Server (pode usar a extensão Live Server do Visual Studio Code)
3. O servidor abrirá automaticamente a aplicação no navegador
4. Clique em "Nova categoria" para criar sua primeira categoria
5. Adicione tarefas à categoria e organize-se!

### Instalação como App
1. Ao acessar a aplicação, verá a opção "🖥️ Deseja instalar o app?"
2. Clique em "Instalar"
3. A aplicação será instalada como um app nativo em seu dispositivo
4. Acesse pelo menu de aplicativos ou tela inicial

## Funcionalidades

### Categorias
- Criar novas categorias
- Visualizar todas as categorias em cards
- Organizar tarefas por categoria

### Tarefas
- Adicionar tarefas a uma categoria
- Marcar tarefas como concluídas
- Deletar tarefas
- Ver contador de tarefas pendentes

## Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização e responsividade
- **JavaScript** - Lógica da aplicação
- **Service Worker** - Funcionalidade offline
- **Web Manifest** - Configuração PWA
- **LocalStorage** - Persistência de dados
- **Tabler Icons** - Ícones SVG

## 📂 Estrutura do Projeto

```
PWA_LIST/
├── index.html          # Arquivo principal da aplicação
├── manifest.json       # Configuração PWA
├── sw.js              # Service Worker para offline
├── README.md          # Este arquivo
├── css/
│   └── style.css      # Estilos da aplicação
├── js/
│   └── app.js         # Lógica da aplicação
├── icons/             # Ícones para app
└── screenshots/       # Screenshots do projeto
```

## Configuração Técnica

### Service Worker
A aplicação utiliza um Service Worker (`sw.js`) para:
- Cachear arquivos da aplicação
- Permitir funcionamento offline
- Sincronizar dados quando a conexão retorna

### Armazenamento de Dados
Os dados são armazenados no `localStorage` em dois arrays:
- `categorias` - Lista de categorias criadas
- `tarefas` - Lista de tarefas associadas às categorias

## Compatibilidade

- Chrome/Chromium (desktop e mobile)
- Firefox (com suporte a PWA)
- Safari (iOS 15+)
- Edge

## Personalização

Para personalizar a aplicação, edite:
- **Cores e temas**: Arquivo `css/style.css`
- **Ícones**: Substitua os arquivos em `icons/`
- **Nome e descrição**: Arquivo `manifest.json`

## Notas

- As tarefas e categorias são salvas automaticamente no navegador
- Não há envio de dados para servidores (privacidade garantida)
- A aplicação funciona completamente offline após a primeira visita

---

## Finalidade Acadêmica

Trabalho prático desenvolvido para fins de aprendizado em desenvolvimento de Progressive Web Apps (PWA) e técnicas modernas de desenvolvimento web.
