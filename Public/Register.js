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
    console.log(form, "form data")
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        console.log(password, "pass")

          
        let number = 0;
        let charecter = 0;
        let symbol = 0

        if(password.length >= 8)
        {

           for(let i = 0; i < password.length-1 ; i++)
           {

            console.log(password[i])
              if(password[i]  ==  "@" || "#" || "$" || "*" ) symbol++

              if(Number(password[i]) >= 1 && Number(password[i]) <= Number.MAX_VALUE) number++

              if(password[i] >= "a" && password[i] <= "z"  || password[i] >= "A" && password[i] <= "Z")  charecter++
           }
        }

        console.log(number, charecter, symbol)

        if(number >= 1 && charecter >= 1 && symbol >= 1){


        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if(response.status == 403)
            {
             
                alert(data.message)
             
            }

            // message.textContent = data.message;
            alert(data.message)
            form.reset();
        } catch (error) {
            console.error(error);
            message.textContent = 'Registration failed. Please try again.';
        }

    }

    else

    alert("Must Enter A Strong Password  with minimum 8 charecters & use special Charecters")
    });
});
