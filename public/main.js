
async function newUserSave(event) {
    event.preventDefault();
    const newID = event.target.newUserID.value;
    const mail = event.target.newEmail.value;
    const pw = event.target.newPW.value;

    const obj = {
        newID,
        mail,
        pw
    }
    try {
        await axios.post("http://localhost:3000/newUser/add", obj).then(response => {

            alert('Registered Successfully. Login!!');
        })
    }
    catch (err) {

        alert('Oopss! User exists Already!! Login Please');
    }

}
async function userLogin(event) {
    event.preventDefault();
    const mail = event.target.email.value;
    const pw = event.target.pw.value;
    const loginDetail = {
        mail,
        pw
    }
    try {
        await axios.post("http://localhost:3000/existingUser/login", loginDetail).then(response => {
            if (response.status === 200) {
                alert(response.data.message);
                localStorage.setItem('token', response.data.token);
                window.location.href = "WalletGUI/index.html"
            }
            else {
                alert(response.data.message);
            }
        })
    }
    catch (err) {
        //document.body.innerHTML = document.body.innerHTML + "<H4>Something went wrong!<h4>";,
        //alert(err.message);
        console.log('****Not login***', JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;"> ${err.message} <div>`
    }

}

function showforgetpasswordForm() {
    window.location.href = "forgotPasswordForm/forgotForm.html"

}


/*window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/admin/get-expense").then((response) => {
        console.log(response);
        for (var i = 0; i < response.data.allUsers.length; i++) {
            showMeUser(response.data.allUsers[i]);
        }
    })
        .catch((err) => {
            console.log(err);
        })
})*/


/*function showMeUser(obj) {

    document.getElementById('details').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';


    const parentNode = document.getElementById('listofUsers');
    console.log('***123**', obj);
    const childNode = `<li class="items" id=${obj.id}> ₹${obj.amount} - ${obj.detail}
        <button onclick="deleteUser('${obj.id}')"> Delete expense </button>
        <button onclick="editUser('${obj.detail}','${obj.amount}','${obj.category}','${obj.id}')"> Edit </button>
          </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childNode;
}
async function deleteUser(userId) {
    try {
        await axios.delete(`http://localhost:3000/admin/delete-expense/${userId}`)
            .then((response) => {
                removeFromScreen(userId);
            })
    }
    catch (err) {
        console.log(err);
    }

}*/
/*function deleteUser(userId) {

    axios.delete(`http://localhost:3000/admin/delete-expense/${userId}`)
        .then((response) => {
            removeFromScreen(userId);
        })

}*/
/*function editUser(emai, user, cate, userId) {
    document.getElementById('details').value = emai;
    document.getElementById('amount').value = user;
    document.getElementById('category').value = cate;
    deleteUser(userId);
    removeFromScreen(userId);

}*/
/*async function editUser(emai, user, cate, userId) {
    document.getElementById('details').value = emai;
    document.getElementById('amount').value = user;
    document.getElementById('category').value = cate;
    deleteUser(userId);
    removeFromScreen(userId);
    var editObj = {
        id: userId,
        amount: user,
        detail: emai,
        category: cate
    }
    try {
        await axios.put(`http://localhost:3000/admin/edit-expense/${userId}`, editObj)
            .then((response) => {
                //removeFromScreen(userId);
                deleteUser(userId);
                console.log('edited', response);
            })
    }
    catch (err) {
        console.log(err);
    }

}
function removeFromScreen(userId) {
    const parent = document.getElementById('listofUsers');
    const childtobeDeleted = document.getElementById(userId);
    if (childtobeDeleted) {
        parent.removeChild(childtobeDeleted);
    }
}*/
/*window.addEventListener("DOMContentLoaded", async () => {
    try {
        await axios.get("http://localhost:3000/admin/get-expense").then((response) => {
            console.log(response);
            for (var i = 0; i < response.data.allUsers.length; i++) {
                showMeUser(response.data.allUsers[i]);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})*/