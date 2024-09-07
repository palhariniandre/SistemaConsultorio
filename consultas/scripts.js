document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.querySelector('.date-input'); // O campo de data
    const tableBody = document.getElementById('table-body');

    // Função para separar data e hora
    function separarDataHora(dataHoraISO) {
        if(dataHoraISO === ''){
            return { data: '', hora: '' };

        }
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
            const deleteIcon = document.createElement('img');buscarConsultasPorData
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
    
    function preencherchoosePaciente() {
        fetch('http://localhost:3000/api/pacientes')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('searchable-select');
                data.forEach(paciente => { // Itera sobre o array de pacientes
                    let option = document.createElement('option');
                    option.value = paciente.idPaciente; // Usar o ID do paciente como valor
                    option.text = paciente.nome; // Nome do paciente
                    select.add(option);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar os pacientes:', error);
            });
    }
    preencherchoosePaciente();


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
                    data = [{ idconsulta: '', nome: 'Nenhuma consulta encontrada', dataHora: '', tipoConsulta: '', convenio: '' }];
                    preencherTabela(data); // Preencher a tabela com a mensagem de erro
                }
            })
            .catch(error => console.error('Erro ao buscar consultas:', error));
    }
    buscarConsultasPorData(dateInput.value); // Buscar as consultas pela data atual
    // Evento de mudança no campo de data
    dateInput.addEventListener('change', function() {
        const dataSelecionada = this.value; // Data no formato dd/MM/yyyy do Flatpickr
        if (dataSelecionada) {
            buscarConsultasPorData(dataSelecionada);  // Buscar as consultas pela data selecionada
        }
    });
});
    //controle do popup
    const popup = document.getElementById('popup-form');
    const closeButton = document.querySelector('.close-button');
    const scheduleButton = document.querySelector('.schedule-button');

    scheduleButton.addEventListener('click', function() {
        popup.style.display = 'flex';
    });
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    //fechar popup ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });


    // Enviar dados do formulário ao backend
    const form = document.getElementById('agendar-consulta-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Captura os valores dos campos
        const paciente = document.getElementById('searchable-select').value;
        const horario = document.getElementById('horario').value;
        const convenio = document.querySelector('.choosebox').value;
        const dataConsulta = document.getElementById('data').value; // Corrigido para dataConsulta
        const tipoConsulta = document.getElementById('choosebox').value;
        
        const partes = dataConsulta.split('/');
        if (partes.length !== 3) {
            console.error('Data inválida');
            return;
        }

        // Reorganizar as partes para o formato AAAA-MM-DD
        const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
        // Junta data e horário no formato DATETIME
        const datetime = `${dataISO} ${horario}:00`; // Formato 'YYYY-MM-DDTHH:mm:ss'
    
        // Cria um objeto com os dados do agendamento
        const agendamento = {
            idPaciente: paciente,
            dataHora: datetime, // Data e horário combinados no formato correto
            tipoConsulta: tipoConsulta,
            convenio: convenio
        };
    
        console.log('Agendamento:', agendamento);
        // Aqui você pode fazer a requisição para sua API, por exemplo:
        fetch('http://localhost:3000/api/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamento),
        })
        .then(response => response.json())
        .then(data => {
            alert('Consulta cadastrada com sucesso!');
            popup.style.display = 'none';
            // Adicionar o novo paciente à tabela (opcional)
        })
        .catch(error => console.error('Erro ao cadastrar consulta:', error));
    });