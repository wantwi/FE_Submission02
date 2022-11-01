

document.addEventListener("DOMContentLoaded", () => {
    const useNameInput = document.getElementById("username")
    const usePasswordInput = document.getElementById("password")
    const loginBtn = document.getElementById("loginBtn")
    const errorMessage = document.getElementById("errorMsg")
    //
    // Handles user login

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if(!useNameInput?.value && !usePasswordInput?.value){
       
            errorMessage.innerText = "Username and password field is required"
            errorMessage.style.color = "red"
            return
        }
        let data = {
            username:useNameInput?.value,
            password:usePasswordInput?.value
        }
       
        loginUser(data)
    })

    const loginUser = async (data) => {
       
        try {
            const result =  await fetch("https://freddy.codesubmit.io/login",{
                method:"POST",
                body:JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                  }
            })

            const response =  await result.json()

            if(result.status === 401){ 
                throw new Error(response?.msg)
            }
            else{
                sessionStorage.setItem("access_token", response.access_token)
                sessionStorage.setItem("refresh_token", response.refresh_token)

              window.location.href = './index.html'
            }
           

        } catch (error) {
            console.error({error});
            //error.message
            errorMessage.innerText = `${error?.message}. Please provide a valid credential.`
            errorMessage.style.color = "red"
        }

    }
  });

//   { username: 'freddy', password: 'ElmStreet2019' }`