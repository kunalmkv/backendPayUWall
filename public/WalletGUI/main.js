const backendAPI = 'http://localhost:3000';
function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('premium_user').innerHTML = "💎💎 Premium User💎💎"
}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const page = 1;
        const page_items = localStorage.getItem('number_of_items');

        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        console.log('token:', decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser
        if (ispremiumuser) {
            showPremiumUserMessage();
            showLeaderboard()

        }
        await axios.get(`${backendAPI}/expense/get-expense?page=${page}&ITEMS_PER_PAGE=${page_items}`, { headers: { "Authorization": token } }).then(({ data: { expense, ...pageData } }) => {
            console.log(pageData);

            expense.forEach(showExpenseToUI);
            showPagination(pageData);

        })
    }
    catch (err) {
        console.log(err);
    }
});

function showLeaderboard() {
    const inputElement = document.createElement("input");
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.class = "btn"
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get(`${backendAPI}/premium/showLeaderBoard`, { headers: { "Authorization": token } })
        //console.log('******** in show leader Board')
        // console.log('leader board data', userLeaderBoardArray.data);

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.userName} Total Expense - ${userDetails.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}





document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${backendAPI}/purchase/premiummembership`, { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post(`${backendAPI}/purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })
            alert('You are a Premium User now');
            showPremiumUserMessage();
            console.log('*****', res);
            //localStorage.setItem('token', res.data.token);


        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment failed', function (response) {
        console.log(response);
        alert('something went wrong!!');

    })
}
async function savetoDB(event) {
    event.preventDefault();
    const amount = event.target.amount.value;
    const detail = event.target.desc.value;
    const category = event.target.myCat.value;

    const obj = {
        amount,
        detail,
        category
    }
    const token = localStorage.getItem('token');
    try {
        await axios.post(`${backendAPI}/expense/add-expense`, obj, { headers: { "Authorization": token } }).then(response => {
            console.log('***12344*****', response);
            showExpenseToUI(response.data.newExpenseDetail);
        })
    }
    catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<H4>Something went wrong!<h4>";
        console.log(err);
    }

}



function showExpenseToUI(obj) {

    document.getElementById('details').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';


    const parentNode = document.getElementById('listofUsers');
    const childNode = `<li class="items" id=${obj.id}> ₹${obj.amount} - ${obj.detail}
        <button onclick="deleteUser('${obj.id}')"> Delete expense </button>
        <button onclick="editUser('${obj.detail}','${obj.amount}','${obj.category}','${obj.id}')"> Edit </button>
          </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childNode;
}
async function deleteUser(userId) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${backendAPI}/expense/delete-expense/${userId}`, { headers: { "Authorization": token } })
            .then((response) => {
                removeFromScreen(userId);
            })
    }
    catch (err) {
        console.log(err);
    }

}
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
async function editUser(emai, user, cate, userId) {
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
        await axios.put(`${backendAPI}/expense/edit-expense/${userId}`, editObj)
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
}
async function download() {
    const token = localStorage.getItem('token')
    await axios.get(`${backendAPI}/user/download`, { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 201) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                console.log(response);
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                alert(response.message);
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            alert(err);
            console.log(err)
        });
}
async function downloadHistory() {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${backendAPI}/user/downloadhistory`, { headers: { "Authorization": token } });

        const historyElem = document.getElementById('downloadHistoryList');
        historyElem.innerHTML = '<h1>Download History </h1>';
        response.data.downloadhistory.forEach((history) => {
            const date = new Date(history.createdAt).toLocaleDateString();
            const link = history.downloadURL || 'N/A';
            historyElem.innerHTML += `<li>Date - ${date} link - <a href="${link}" target="_blank">${link}</a></li>`;
        });
    } catch (error) {
        console.error(error);
    }
}


function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    const page_items = localStorage.getItem('number_of_items');
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', async () => await getExpensesPagination(previousPage));
        pagination.appendChild(btn2);
        pagination.appendChild(document.createTextNode(' '));
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', async () => await getExpensesPagination(currentPage));
    pagination.appendChild(btn1);
    pagination.appendChild(document.createTextNode(' '));
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', async () => await getExpensesPagination(nextPage));
        pagination.appendChild(btn3);
        pagination.appendChild(document.createTextNode(' '));
    }
    if (lastPage) {
        const btnLast = document.createElement('button');
        btnLast.innerHTML = "Last";
        btnLast.addEventListener('click', async () => await getExpensesPagination(lastPage));
        pagination.appendChild(btnLast);
    }
}

async function getExpensesPagination(page) {
    const token = localStorage.getItem('token');
    const page_items = localStorage.getItem('number_of_items');

    await axios
        .get(`${backendAPI}/expense/get-expense?page=${page}&ITEMS_PER_PAGE=${page_items}`, { headers: { "Authorization": token } })
        .then(({ data: { expense, ...pageData } }) => {

            listofUsers.innerHTML = '';
            expense.forEach(showExpenseToUI);
            showPagination(pageData);
        })
        .catch((err) => console.log(err));

}

function noOfItems() {
    const n = numberOfItems.value;
    localStorage.setItem('number_of_items', n);
}