//preencher a tabela com os dados do banco /api/consultas
document.addEventListener('DOMContentLoaded', function() {
    // fetch('http://192.168.0.16:3000/api/consultas')
    fetch('http://localhost:3000/api/consultas')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('table-body');

        tableBody.innerHTML = '';  // Limpar a tabela
        // Função para separar data e hora
        function separarDataHora(dataHoraISO) {
            const dataHora = new Date(dataHoraISO);

            // Formatar a data para dd/mm/yyyy
            const data = dataHora.toLocaleDateString('pt-BR');

            // Formatar a hora para hh:mm:ss
            const hora = dataHora.toLocaleTimeString('pt-BR', { hour12: false });

            return { data, hora };
        }

        data.forEach(consulta => {
            const row = document.createElement('tr');

            // Separar data e hora da consulta
            const { data, hora } = separarDataHora(consulta.dataHora);

            const idCell = document.createElement('td');
            idCell.textContent = consulta.idconsulta;
            row.appendChild(idCell);

            const nomeCell = document.createElement('td');
            nomeCell.textContent = consulta.nome;
            row.appendChild(nomeCell);

            //horario
            const horaCell = document.createElement('td');
            horaCell.textContent = hora;
            row.appendChild(horaCell);

            const convenioCell = document.createElement('td');
            convenioCell.textContent = consulta.convenio;
            row.appendChild(convenioCell);

            // Adicionando Data da consulta
            const dataCell = document.createElement('td');
            dataCell.textContent = data;
            row.appendChild(dataCell);
            
            const tipoConsultaCell = document.createElement('td');
            tipoConsultaCell.textContent = consulta.tipoConsulta;
            row.appendChild(tipoConsultaCell);

            // Adicionando a coluna de ações com os botões Editar e Deletar
            const acoesCell = document.createElement('td');

            // Criando botão de Editar
            const editButton = document.createElement('button');
            editButton.classList.add('action-button');
            const editIcon = document.createElement('img');
            editIcon.src = 'images/edit-icon.png';
            editIcon.alt = 'Editar';
            editButton.appendChild(editIcon);

            // Criando botão de Deletar
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('action-button');
            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'images/delete-icon.png';
            deleteIcon.alt = 'Deletar';
            deleteButton.appendChild(deleteIcon);

            // Adicionando os botões à célula de ações
            acoesCell.appendChild(editButton);
            acoesCell.appendChild(deleteButton);
            row.appendChild(acoesCell);

            
           tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao buscar consultas:', error));
});
