document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Cria o calendário
    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'timeGrid', 'dayGrid'],
        initialView: 'timeGridWeek', // Visualização semanal
        locale: 'pt-br', 
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotDuration: '00:20:00', // Slots de 30 minutos
        minTime: '08:00:00',      // Hora de início às 8 da manhã
        maxTime: '18:00:00',      // Hora de fim às 8 da noite
        editable: false,
        eventLimit: true,
        slotLabelFormat: { // Formato 24 horas para os rótulos do eixo de tempo
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Usa o formato 24 horas
        },
        eventTimeFormat: { // Formato 24 horas para os eventos
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Usa o formato 24 horas
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('http://localhost:3000/api/agenda')
            .then(response => response.json())
            .then(data => {
                // Passa os eventos recebidos para o FullCalendar via successCallback
                successCallback(data);
            })
            .catch(error => {
                console.error('Erro ao carregar eventos:', error);
                failureCallback(error); // Chama failureCallback em caso de erro
            });
        }
    });

    // Renderiza o calendário na página
    calendar.render();
});
