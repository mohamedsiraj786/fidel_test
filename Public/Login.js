
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Login-form');
    console.log(form, "form data")
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            console.log(response.status, "res")
            console.log(response, "res")

            if (response.status == 401) {
                alert('Wrong : Username Or Password')
            }
            if(response.status == 200)
            {
                const data = await response.json();
                alert(data.message)
                window.location.href = "/dashboard"
            }

            form.reset();
        } catch (error) {
            console.error(error);
            alert(error)
        }
    });
});
