const apiUrl = 'http://localhost:3000/fornecedores';




async function fetchData() {
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
    }
}

// Chama a função quando a página carrega
fetchData();

function getUsuarioLogado() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  return usuarioLogado;
}

const fornecedoresList = document.getElementById('fornecedoresList');
const searchInput = document.getElementById('searchInput');
const form = document.getElementById('fornecedorForm');

const idInput = document.getElementById('fornecedorId');
const nomeInput = document.getElementById('nomeFornecedor');
const cnpjInput = document.getElementById('cnpjFornecedor');
const emailInput = document.getElementById('emailFornecedor');
const telefoneInput = document.getElementById('telefoneFornecedor');

// Carrega os fornecedores
function loadFornecedores(filtro = '') {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log('Fornecedores carregados:', data);
      fornecedoresList.innerHTML = '';
      data.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(filtro.toLowerCase())
      ).forEach(renderFornecedor);
    });
}

function renderFornecedor(fornecedor) {
  const item = document.createElement('div');
  item.className = 'fornecedor-item d-flex justify-content-between align-items-center border-bottom py-2';

  const info = document.createElement('div');
  info.innerHTML = `
    <strong>${fornecedor.nome}</strong><br>
    CNPJ: ${fornecedor.cnpj}<br>
    Email: ${fornecedor.email}<br>
    Telefone: ${fornecedor.telefone}<br>
    <small class="text-muted">Última alteração: ${formatDateToUser(fornecedor.dataAlteracao)}</small>
  `;

  const actions = document.createElement('div');
  actions.className = 'd-flex gap-2';

  const editButton = document.createElement('button');
  editButton.className = 'btn btn-sm btn-outline-primary';
  editButton.onclick = () => editFornecedor(fornecedor);
  editButton.innerHTML = '<i class="fas fa-edit"></i>';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-sm btn-outline-danger';
  deleteButton.onclick = () => deleteFornecedor(fornecedor.id);
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';

  actions.append(editButton, deleteButton);
  item.append(info, actions);

  fornecedoresList.appendChild(item);
}

// Função para abrir o modal
function openFornecedorModal() {
  const modal = new bootstrap.Modal(document.getElementById('fornecedorModal'));
  modal.show();
}

// Função para fechar o modal
function closeFornecedorModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('fornecedorModal'));
  modal.hide();
}

// Editar
function editFornecedor(fornecedor) {
  idInput.value = fornecedor.id;
  nomeInput.value = fornecedor.nome;
  cnpjInput.value = fornecedor.cnpj;
  emailInput.value = fornecedor.email;
  telefoneInput.value = fornecedor.telefone;

  document.getElementById('alteradoPorFornecedor').value = fornecedor.alteradoPor?.name || '-';
  document.getElementById('dataAlteracaoFornecedor').value = formatDateToUser(fornecedor.dataAlteracao);

  openFornecedorModal();
}

// Excluir
function deleteFornecedor(id) {
  if (confirm('Deseja excluir este fornecedor?')) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => loadFornecedores());
  }
}

// Salvar (create/update)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const usuario = getUsuarioLogado();

  const fornecedor = {
    nome: nomeInput.value,
    cnpj: cnpjInput.value,
    email: emailInput.value,
    telefone: telefoneInput.value,
    alteradoPor: {
      id: usuario.id,
      name: usuario.name
    },
    dataAlteracao: new Date().toISOString()
  };

  const id = idInput.value;

  if (id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fornecedor)
    }).then(() => {
      form.reset();
      closeFornecedorModal();
      loadFornecedores();
    });
  } else {
    fornecedor.criadoPor = {
      id: usuario.id,
      name: usuario.name
    };
    fornecedor.dataCriacao = new Date().toISOString();

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fornecedor)
    }).then(() => {
      form.reset();
      closeFornecedorModal();
      loadFornecedores();
    });
  }
});

// Pesquisa
searchInput.addEventListener('input', (e) => {
  loadFornecedores(e.target.value);
});

// Inicializa
loadFornecedores();

// Utilitários
function formatDateToUser(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  return formatter.format(date);
}
