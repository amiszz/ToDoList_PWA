// ======= REGISTRO DO SERVICE WORKER =========

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registro) => console.log('[APP] Service Worker registrado!', registro))
      .catch((erro) => console.log('[APP] Erro ao registrar SW:', erro));
  });
}

// ======= INSTALAÇÃO PWA ==========

let eventoInstalacao = null;

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  eventoInstalacao = evento;
  document.getElementById('barra-instalar').style.display = 'flex';
});

document.getElementById('botao-instalar').addEventListener('click', () => {
  if (!eventoInstalacao) return;
  eventoInstalacao.prompt();
  eventoInstalacao.userChoice.then(() => {
    eventoInstalacao = null;
    document.getElementById('barra-instalar').style.display = 'none';
  });
});

// ======= Dados salvos no localStorage ==============

let listaCategorias = JSON.parse(localStorage.getItem('categorias')) || [];
let listaTarefas    = JSON.parse(localStorage.getItem('tarefas'))    || [];

function salvarDados() {
  localStorage.setItem('categorias', JSON.stringify(listaCategorias));
  localStorage.setItem('tarefas',    JSON.stringify(listaTarefas));
}

// ======== CATEGORIAS ===============

document.getElementById('botao-nova-categoria').addEventListener('click', () => {
  criarNovaCategoria();
});

function criarNovaCategoria() {
  const novaCategoria = {
    id:   Date.now().toString(),
    nome: '',
  };

  listaCategorias.push(novaCategoria);
  salvarDados();
  renderizar();

  // foco automático no input da nova categoria
  const inputNome = document.querySelector(
    `.input-nome-categoria[data-id="${novaCategoria.id}"]`
  );
  if (inputNome) inputNome.focus();
}

function renomearCategoria(idCategoria, novoNome) {
  const categoria = listaCategorias.find((c) => c.id === idCategoria);
  if (!categoria) return;
  categoria.nome = novoNome;
  salvarDados();
  atualizarContador();
}

function excluirCategoria(idCategoria) {
  const categoria = listaCategorias.find((c) => c.id === idCategoria);
  if (!categoria) return;

  const nome = categoria.nome || 'esta categoria';
  const confirmado = confirm(`Excluir "${nome}" e todas as suas tarefas?`);
  if (!confirmado) return;

  listaCategorias = listaCategorias.filter((c) => c.id !== idCategoria);
  listaTarefas    = listaTarefas.filter((t) => t.categoriaId !== idCategoria);
  salvarDados();
  renderizar();
}

// ======= TAREFAS ===========

function adicionarTarefa(idCategoria, inputElemento) {
  const texto = inputElemento.value.trim();
  if (!texto) return;

  const novaTarefa = {
    id:          Date.now().toString(),
    texto:       texto,
    categoriaId: idCategoria,
    concluida:   false,
  };

  listaTarefas.push(novaTarefa);
  salvarDados();
  inputElemento.value = '';
  renderizarTarefasDoCard(idCategoria);
  atualizarContador();
}

function toggleConcluida(idTarefa) {
  const tarefa = listaTarefas.find((t) => t.id === idTarefa);
  if (!tarefa) return;
  tarefa.concluida = !tarefa.concluida;
  salvarDados();
  renderizarTarefasDoCard(tarefa.categoriaId);
  atualizarContador();
}

function excluirTarefa(idTarefa) {
  const tarefa = listaTarefas.find((t) => t.id === idTarefa);
  if (!tarefa) return;
  const categoriaId = tarefa.categoriaId;
  listaTarefas = listaTarefas.filter((t) => t.id !== idTarefa);
  salvarDados();
  renderizarTarefasDoCard(categoriaId);
  atualizarContador();
}

// ======= EDIÇÃO DE TAREFA ===========

let idTarefaEditando = null;

const fundoModal          = document.getElementById('fundo-modal');
const inputEdicao         = document.getElementById('input-edicao');
const botaoSalvarEdicao   = document.getElementById('botao-salvar-edicao');
const botaoCancelarEdicao = document.getElementById('botao-cancelar-edicao');

function abrirModalEdicao(idTarefa) {
  const tarefa = listaTarefas.find((t) => t.id === idTarefa);
  if (!tarefa) return;
  idTarefaEditando       = idTarefa;
  inputEdicao.value      = tarefa.texto;
  fundoModal.style.display = 'flex';
  inputEdicao.focus();
}

function fecharModalEdicao() {
  fundoModal.style.display = 'none';
  idTarefaEditando = null;
}

botaoSalvarEdicao.addEventListener('click', () => {
  const novoTexto = inputEdicao.value.trim();
  if (!novoTexto) return;

  const tarefa = listaTarefas.find((t) => t.id === idTarefaEditando);
  if (!tarefa) return;

  tarefa.texto = novoTexto;
  salvarDados();
  fecharModalEdicao();
  renderizarTarefasDoCard(tarefa.categoriaId);
});

botaoCancelarEdicao.addEventListener('click', fecharModalEdicao);

fundoModal.addEventListener('click', (evento) => {
  if (evento.target === fundoModal) fecharModalEdicao();
});

inputEdicao.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter')  botaoSalvarEdicao.click();
  if (evento.key === 'Escape') fecharModalEdicao();
});

// ======== ATUALIZA CONTADOR DO CABEÇALHO =========

function atualizarContador() {
  const pendentes = listaTarefas.filter((t) => !t.concluida).length;
  document.getElementById('contador-pendentes').textContent =
    `${pendentes} pendente${pendentes !== 1 ? 's' : ''}`;
}

// ========= RENDERIZAÇÃO DE CARD ====================

function renderizarTarefasDoCard(idCategoria) {
  const listaTarefasElemento = document.querySelector(
    `.lista-tarefas[data-categoria-id="${idCategoria}"]`
  );
  const contadorCard = document.querySelector(
    `.contador-card[data-categoria-id="${idCategoria}"]`
  );
  if (!listaTarefasElemento) return;

  const tarefasDaCategoria = listaTarefas.filter(
    (t) => t.categoriaId === idCategoria
  );

  // att contador do card
  if (contadorCard) contadorCard.textContent = tarefasDaCategoria.length;

  // lista de tarefas vazia
  if (tarefasDaCategoria.length === 0) {
    listaTarefasElemento.innerHTML = `
      <p class="mensagem-card-vazio">Nenhuma tarefa ainda</p>
    `;
    return;
  }

  listaTarefasElemento.innerHTML = tarefasDaCategoria.map((tarefa) => `
    <div class="item-tarefa">
      <div
        class="circulo-check ${tarefa.concluida ? 'concluida' : ''}"
        onclick="toggleConcluida('${tarefa.id}')"
        title="${tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}"
      ></div>
      <span class="texto-tarefa ${tarefa.concluida ? 'concluida' : ''}">
        ${tarefa.texto}
      </span>
      <div class="icones-tarefa">
        <i class="ti ti-edit"  onclick="abrirModalEdicao('${tarefa.id}')" title="Editar"></i>
        <i class="ti ti-trash" onclick="excluirTarefa('${tarefa.id}')"    title="Excluir"></i>
      </div>
    </div>
  `).join('');
}

// ======= RENDERIZAÇÃO TODOS OS CARDS =============

function renderizar() {
  const grade        = document.getElementById('grade-categorias');
  const mensagemVazia = document.getElementById('mensagem-vazia');

  // tela vazia
  mensagemVazia.style.display = listaCategorias.length === 0 ? 'flex' : 'none';

  grade.innerHTML = '';

  listaCategorias.forEach((categoria) => {
    const tarefasDaCategoria = listaTarefas.filter(
      (t) => t.categoriaId === categoria.id
    );

    const card = document.createElement('div');
    card.className = 'card-categoria';

    card.innerHTML = `
      <div class="cabecalho-card">
        <input
          type="text"
          class="input-nome-categoria"
          data-id="${categoria.id}"
          placeholder="Nome da categoria..."
          value="${categoria.nome}"
          maxlength="30"
        />
        <div class="acoes-card">
          <span
            class="contador-card"
            data-categoria-id="${categoria.id}"
          >${tarefasDaCategoria.length}</span>
          <button
            class="botao-excluir-categoria"
            onclick="excluirCategoria('${categoria.id}')"
            title="Excluir categoria"
          >
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>

      <div class="area-adicionar-tarefa">
        <input
          type="text"
          class="input-nova-tarefa"
          placeholder="Nova tarefa..."
          maxlength="80"
        />
        <button class="botao-adicionar-tarefa">
          <i class="ti ti-plus"></i> add
        </button>
      </div>

      <div class="lista-tarefas" data-categoria-id="${categoria.id}">
        <p class="mensagem-card-vazio">Nenhuma tarefa ainda</p>
      </div>
    `;

    // evento de renomear categoria
    const inputNome = card.querySelector('.input-nome-categoria');
    inputNome.addEventListener('input', () => {
      renomearCategoria(categoria.id, inputNome.value);
    });

    // evento de adicionar tarefa pelo botão
    const inputTarefa = card.querySelector('.input-nova-tarefa');
    const botaoAdd    = card.querySelector('.botao-adicionar-tarefa');

    botaoAdd.addEventListener('click', () => {
      adicionarTarefa(categoria.id, inputTarefa);
    });

    // evento de adicionar tarefa pelo Enter
    inputTarefa.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter') adicionarTarefa(categoria.id, inputTarefa);
    });

    grade.appendChild(card);

    // renderização
    renderizarTarefasDoCard(categoria.id);
  });

  atualizarContador();
}

// ======= INICIALIZADOR =============

renderizar();