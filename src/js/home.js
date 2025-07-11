// Função para obter os dados do usuário logado
function getUsuarioLogado() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  return usuarioLogado;
}

// Quando a página for carregada, pega o usuário logado e exibe os dados
document.addEventListener("DOMContentLoaded", function () {
  const usuario = getUsuarioLogado();

  if (usuario) {
    // Recupera o parágrafo com o id "userEmail"
    const userEmailElement = document.getElementById("userEmail");

    // Concatena o nome do usuário e o e-mail ao texto existente
    userEmailElement.innerHTML = `Bem-vindo, <strong>${usuario.name}</strong> ao sistema de controle de estoque hospitalar`;

    // Se você quiser adicionar algo mais no final, pode fazer algo assim:
    userEmailElement.innerHTML += " <strong>HealthStock</strong>.";
  } else {
    // Caso o usuário não esteja logado, redireciona para a página de login
    window.location.href = "login.html";
  }
});
