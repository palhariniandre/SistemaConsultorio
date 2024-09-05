document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.querySelector('.date-input'); // O campo de data
    const tableBody = document.getElementById('table-body');

    // Função para separar data e hora
    function separarDataHora(dataHoraISO) {
        const dataHora = new Date(dataHoraISO);

        // Formatar a data para dd/MM/yyyy
        const data = dataHora.toLocaleDateString('pt-BR');

        // Formatar a hora para hh:mm:ss
        const hora = dataHora.toLocaleTimeString('pt-BR', { hour12: false });

        return { data, hora };
    }

    // Função para preencher a tabela com os dados
    function preencherTabela(data) {
        tableBody.innerHTML = '';  // Limpar a tabela
        data.forEach(consulta => {
            const row = document.createElement('tr');

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

            // Adiciona a linha à tabela
            tableBody.appendChild(row);
        });
    }

    // Função para buscar consultas pela data
    function buscarConsultasPorData(dataSelecionada) {
        // Verificar se a data está no formato esperado pela biblioteca Flatpickr (dd/MM/yyyy)
        const partes = dataSelecionada.split('/');
        if (partes.length !== 3) {
            console.error('Data inválida');
            return;
        }

        // Reorganizar as partes para o formato AAAA-MM-DD
        const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;

        // Fazer a requisição para o servidor com a data formatada
        fetch(`http://localhost:3000/api/consultas?data=${dataISO}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    preencherTabela(data); // Preencher a tabela com os dados recebidos
                } else {
                    tableBody.innerHTML = '<tr><td colspan="7">Nenhuma consulta encontrada para essa data</td></tr>';
                }
            })
            .catch(error => console.error('Erro ao buscar consultas:', error));
    }

    // Evento de mudança no campo de data
    dateInput.addEventListener('change', function() {
        const dataSelecionada = this.value; // Data no formato dd/MM/yyyy do Flatpickr
        if (dataSelecionada) {
            buscarConsultasPorData(dataSelecionada);  // Buscar as consultas pela data selecionada
        }
    });
});