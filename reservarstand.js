// Lista dos stands da feira
    const stands = [
      { numero: 1, tamanho: '2x2', status: 'livre', localizacao: 'Interno' },
      { numero: 2, tamanho: '3x3', status: 'livre', localizacao: 'Interno' },
      { numero: 3, tamanho: '2x2', status: 'livre', localizacao: 'Interno' },
      { numero: 4, tamanho: '3x4', status: 'livre', localizacao: 'Interno' },
      { numero: 5, tamanho: '3x3', status: 'livre', localizacao: 'Interno' },
      { numero: 6, tamanho: '2x2', status: 'livre', localizacao: 'Interno' },
      { numero: 7, tamanho: '3x3', status: 'livre', localizacao: 'Interno' },
      { numero: 8, tamanho: '2x2', status: 'livre', localizacao: 'Interno' },
      { numero: 9, tamanho: '3x4', status: 'livre', localizacao: 'Interno' },
      { numero: 10, tamanho: '5x5', status: 'livre', localizacao: 'Central (Principal)' }
    ];

    // Mostra todos os stands disponíveis na interface
    function renderizarStands() {
      const mapa = document.getElementById('mapa');
      mapa.innerHTML = '';
      stands.forEach((stand, index) => {
        const div = document.createElement('div');
        div.className = 'stand' + (stand.status === 'ocupado' ? ' ocupado' : '');
        div.innerText = `Stand ${stand.numero}`;
        if (stand.status === 'livre') {
          div.onclick = () => mostrarInfo(stand, index);
        }
        mapa.appendChild(div);
      });
    }

    // Exibe detalhes de um stand selecionado
    function mostrarInfo(stand, index) {
      const info = document.getElementById('stand-info');
      info.style.display = 'block';
      info.innerHTML = `
        <h3>Informações do Stand ${stand.numero}</h3>
        <p><strong>Tamanho:</strong> ${stand.tamanho}</p>
        <p><strong>Localização:</strong> ${stand.localizacao}</p>
        <button onclick="comprarStand(${index})">Reservar</button>
      `;
    }

    // Marca um stand como reservado, desde que o token seja válido
    function comprarStand(index) {
      if (!usuarioLogado.token || !sessoes[usuarioLogado.token]) {
        alert('Sessão expirada. Faça login novamente.');
        voltarLogin();
        return;
      }

      stands[index].status = 'ocupado'; // Marca o stand como ocupado
      alert(`Stand ${stands[index].numero} reservado para ${usuarioLogado.documento}`);
      document.getElementById('stand-info').style.display = 'none';
      renderizarStands(); // Atualiza o mapa
    }

   // Reserva diretamente o primeiro stand disponível
    function reservarStandDireto() {
     const livre = stands.findIndex(s => s.status === 'livre');
    if (livre === -1) {
    alert('Todos os stands já foram reservados.');
    return;
  }
  comprarStand(livre);
}