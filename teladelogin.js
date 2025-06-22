    // Lista de usuários simulados na memória
    const usuarios = [
      { documento: "12345678901", senha: "Senha@123" },
      { documento: "98765432100", senha: "Teste@456" }
    ];

    // Objeto que armazena sessões ativas com tokens
    const sessoes = {};

    // Objeto com dados do usuário logado
    const usuarioLogado = { documento: null, token: null };

    // Alterna a exibição entre as telas do sistema
    function mostrarTela(id) {
      document.querySelectorAll('.tela').forEach(div => div.classList.remove('ativa'));
      document.getElementById(id).classList.add('ativa');
    }

    // Realiza o login do usuário e cria um token de sessão
    function fazerLogin() {
      const docInput = document.getElementById('documento');
      const senhaInput = document.getElementById('senha');
      const doc = docInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos do documento
      const senha = senhaInput.value;

      // Elementos para exibir mensagens de erro
      const erroDocEl = document.getElementById('erro-documento');
      const erroSenhaEl = document.getElementById('erro-senha');
      erroDocEl.innerText = '';
      erroSenhaEl.innerText = '';

      // Valida quantidade de dígitos do CPF ou CNPJ
      if (!doc || (doc.length !== 11 && doc.length !== 14)) {
        erroDocEl.innerText = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
        return;
      }

      // Verifica se o usuário existe e se a senha está correta
      const usuario = usuarios.find(u => u.documento === doc && u.senha === senha);

      if (!usuario) {
        erroSenhaEl.innerText = 'Documento ou senha incorretos.';
        return;
      }

      // Valida a estrutura da senha com os critérios estabelecidos
      if (!validarSenha(senha)) {
        erroSenhaEl.innerText = 'Senha inválida. Requisitos: entre 8 e 12 caracteres, com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial';
        return;
      }

      // Gera token de sessão
      const token = gerarTokenFake();             // Cria um token aleatório
      console.log("Token gerado:", token);
      sessoes[token] = doc;                        // Salva o token como chave e o documento como valor
      usuarioLogado.documento = doc;               // Salva o documento no objeto de sessão
      usuarioLogado.token = token;                 // Salva o token no objeto de sessão

      mostrarTela('tela-compra');                  // Exibe a tela de stands
      renderizarStands();                          // Renderiza os stands disponíveis
    }

    // Valida a estrutura da senha de acordo com os requisitos
    function validarSenha(senha) {
      const temMaiuscula = /[A-Z]/.test(senha);
      const temMinuscula = /[a-z]/.test(senha);
      const temNumero = /[0-9]/.test(senha);
      const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
      const tamanhoValido = senha.length >= 8 && senha.length <= 12;
      return temMaiuscula && temMinuscula && temNumero && temEspecial && tamanhoValido;
    }

    // Gera um token de sessão aleatório (não seguro, apenas simulação)
    function gerarTokenFake() {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Encerra a sessão e volta para tela de login
    function voltarLogin() {
      if (usuarioLogado.token) delete sessoes[usuarioLogado.token]; // Remove token da lista de sessões
      usuarioLogado.documento = null;
      usuarioLogado.token = null;
      document.getElementById('documento').value = '';
      document.getElementById('senha').value = '';
      document.getElementById('erro-documento').innerText = '';
      document.getElementById('erro-senha').innerText = '';
      mostrarTela('tela-login');
    }

    // Formata o campo de CPF ou CNPJ enquanto o usuário digita
    function formatarEValidarDocumento(e) {
      let input = e.target;
      let valor = input.value.replace(/\D/g, '');
      const erroDiv = document.getElementById('erro-documento');

      if (valor.length > 14) valor = valor.slice(0, 14);

      if (valor.length !== 11 && valor.length !== 14) {
        erroDiv.innerText = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
      } else {
        erroDiv.innerText = '';
      }

      // Aplica a máscara de CPF ou CNPJ
      if (valor.length <= 11) {
        valor = valor.replace(/^(\d{3})(\d)/, '$1.$2')
                     .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                     .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      } else {
        valor = valor.replace(/^(\d{2})(\d)/, '$1.$2')
                     .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                     .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
                     .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
      }

      input.value = valor;
    }

    // Adiciona o evento de formatação ao campo de documento
    document.getElementById('documento').addEventListener('input', formatarEValidarDocumento);