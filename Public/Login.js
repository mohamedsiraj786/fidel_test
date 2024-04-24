/*const storedata = async () => {
    const userinput = document.getElementById('username').value;
    const userpasscode = document.getElementById('password').value;
    console.log("Username:", userinput);
    console.log("Password:", userpasscode);
    try {
        const apiresponse = await fetch('http://localhost:8000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"username":userinput,"password":userpasscode})
        });
        const res = await apiresponse.json();
        console.log(res);
    } catch (error) {
        console.error(error);
    }
}*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            message.textContent = data.message;
            form.reset();
        } catch (error) {
            console.error(error);
            message.textContent = 'Registration failed. Please try again.';
        }
    });
});
