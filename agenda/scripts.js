document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'dayGrid', 'timeGrid'],
        defaultView: 'timeGridWeek',  // Alterado para visualização semanal
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        eventLimit: true,
        events: [
            { title: 'Consulta com Dr. Silva', start: '2024-08-25T10:00:00', end: '2024-08-25T11:00:00' },
            { title: 'Consulta com Dra. Maria', start: '2024-08-26T14:00:00', end: '2024-08-26T15:00:00' }
        ]
    });

    calendar.render();
});
var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'timeGrid'],
    defaultView: 'timeGridWeek',
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotDuration: '00:30:00', // Slots de 30 minutos
    minTime: '08:00:00',      // Hora de início às 8 da manhã
    maxTime: '20:00:00',      // Hora de fim às 8 da noite
    editable: true,
    eventLimit: true,
    events: [
    ]
});

calendar.render();

