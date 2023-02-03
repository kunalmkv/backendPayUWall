async function forgotMail(event) {
    event.preventDefault();


    const userDetails = {
        mail: event.target.mail.value

    }
    console.log(userDetails);
    await axios.post('http://localhost:3000/password/forgotpassword', userDetails).then(response => {
        if (response.status === 200) {
            console.log(response.data);
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
            alert(response.data.message);
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })

}