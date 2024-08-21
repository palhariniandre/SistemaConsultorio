document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/pacientes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('table-body');

            tableBody.innerHTML = ''; // Limpar conteúdo anterior da tabela, se houver

            data.forEach(paciente => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = paciente.idPaciente;  // Atualizado para idPaciente
                row.appendChild(idCell);

                const nomeCell = document.createElement('td');
                nomeCell.textContent = paciente.nome;
                row.appendChild(nomeCell);

                const idadeCell = document.createElement('td');
                // Convertendo a data de nascimento para idade
                const idade = calcularIdade(paciente.dataNascimento);
                idadeCell.textContent = idade;
                row.appendChild(idadeCell);

                const telefoneCell = document.createElement('td');
                telefoneCell.textContent = paciente.telefone;
                row.appendChild(telefoneCell);

                const convenioCell = document.createElement('td');
                convenioCell.textContent = paciente.convenio;
                row.appendChild(convenioCell);

                tableBody.appendChild(row);

                
                addRowSelection();
            });
        })
        .catch(error => console.error('Erro ao buscar pacientes:', error));
});
   // Função para permitir a seleção das linhas
   function addRowSelection() {
    const rows = document.querySelectorAll('#table-body tr');
    
    rows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove a classe 'selected' de todas as linhas
            rows.forEach(r => r.classList.remove('selected'));
            
            // Adiciona a classe 'selected' à linha clicada
            row.classList.add('selected');
        });

        row.addEventListener('dblclick', function() {
            // Captura as informações do paciente
            const id = row.cells[0].textContent;
            const nome = row.cells[1].textContent;
            const idade = row.cells[2].textContent;
            const telefone = row.cells[3].textContent;
            const convenio = row.cells[4].textContent;

            // Exibe um alerta com as informações do paciente
            alert(`ID: ${id}\nNome: ${nome}\nIdade: ${idade}\nTelefone: ${telefone}\nConvênio: ${convenio}`);
        });
    });
}

// Função para calcular a idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}
 // Controle do Pop-up
 const popup = document.getElementById('popup-form');
 const cadastrarButton = document.querySelector('.register-button');
 const closeButton = document.querySelector('.close-button');

 cadastrarButton.addEventListener('click', function() {
     popup.style.display = 'flex';
 });

 closeButton.addEventListener('click', function() {
     popup.style.display = 'none';
 });

 // Fechar o pop-up ao clicar fora do conteúdo
 window.addEventListener('click', function(event) {
     if (event.target === popup) {
         popup.style.display = 'none';
     }
 });

 // Enviar dados do formulário ao backend
 const form = document.getElementById('cadastrar-paciente-form');
 form.addEventListener('submit', function(event) {
     event.preventDefault();

     const formData = {
         nome: form.nome.value,
         dataNascimento: form.dataNascimento.value,
         telefone: form.telefone.value,
         convenio: form.convenio.value
     };

     fetch('http://localhost:3000/api/pacientes', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
     })
     .then(response => response.json())
     .then(data => {
         alert('Paciente cadastrado com sucesso!');
         popup.style.display = 'none';
         // Adicionar o novo paciente à tabela (opcional)
     })
     .catch(error => console.error('Erro ao cadastrar paciente:', error));
 });