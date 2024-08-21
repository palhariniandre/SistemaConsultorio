document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, senha }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login bem-sucedido!');
                // Redirecionar para outra página ou fazer algo mais
            } else {
                alert('Login ou senha incorretos.');
            }
        })
        .catch(error => console.error('Erro:', error));
    });
});
