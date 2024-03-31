let submenu = document.getElementById("submenu");

function toggleMenu() {
  submenu.classList.toggle("open-menu");
}

document.querySelector("#button-create").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});

document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });

document
  .getElementById("close-btn-edit")
  .addEventListener("click", function () {
    document.querySelector("#edit").classList.remove("active");
  });

document
  .querySelector("#button-create-submit")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });

async function createItem() {
  let title = document.getElementById("title").value;
  let subtitle = document.getElementById("subtitle").value;
  let titleColor = document.getElementById("title-color").value;
  let due = document.getElementById("due").value;
  let dateColor = document.getElementById("date-color").value;
  let description = document.getElementById("description").value;
  let urgent = document.getElementById("urgent").checked;

  const data = {
    title: title,
    subtitle: subtitle,
    titleBg: titleColor,
    duedate: due,
    urgent: urgent,
    description: description,
    dateColor: dateColor,
  };

  const id = getCookie("id");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/api/todos/${id}`, requestOptions)
    .then((response) => {
      alert("success create todo");
      window.location.reload();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function doneItem(id) {
  const idUser = getCookie("id");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    todoId: id,
    status: true,
  });

  console.log(raw);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/api/todos/${idUser}/status`, requestOptions)
    .then((result) => {
      alert("Berhasil menyelesaikan todo");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
}
async function getItem(
  title = "",
  status = null,
  start_date = null,
  end_date = null
) {
  const id = getCookie("id");

  // Panggil API dengan ID
  const response = await fetch(`/api/todos/${id}`);


  // Periksa status respons
  if (response.ok) {
    // Respons berhasil
    const todoResponse = await response.json();

    // Hapus semua todos yang ditampilkan sebelumnya
    document.getElementById("todo-border-box").innerHTML = "";
    document.getElementById("todo-border-complete").innerHTML = "";
    document.getElementById('name_user').textContent = todoResponse.name;


    for (const todo of todoResponse.todos) {
      const cardTodo = card(
        todo.urgent,
        todo.titleBg,
        todo.title,
        todo.subtitle,
        todo.duedate,
        todo.dateColor,
        todo.description,
        todo.id,
        todo.status
      );

      // Filter based on title, urgent status, and date range
      const isTitleMatch =
        title === "" || todo.title.toLowerCase().includes(title.toLowerCase());
      const isStatusMatch = status === null || todo.urgent === status;
      const isDateInRange =
        start_date !== null && end_date !== null
          ? todo.duedate >= start_date && todo.duedate <= end_date
          : true;

      if (isTitleMatch && isStatusMatch && isDateInRange) {
        // Tampilkan item jika cocok dengan kriteria
        if (!todo.status) {
          document.getElementById("todo-border-box").appendChild(cardTodo);
        } else {
          document.getElementById("todo-border-complete").appendChild(cardTodo);
        }
      }
    }
  } else {
    // Respons gagal
    const error = await response.text();
    alert(error);
  }
}

async function cari() {
  let keyword = document.getElementById("keyword").value;
  getItem(keyword);
}

function filterByDate() {
  var start_date = document.getElementById("start_date").value;
  var end_date = document.getElementById("end_date").value;
  if (start_date == "") {
    alert("pilih start date");
  } else {
    getItem("", null, start_date, end_date);
  }
}

function filterUrgent() {
  let checkBox = document.getElementById("urgent_filter");
  let isChecked = checkBox.checked;
  getItem("", isChecked);
}

async function deleteItem(id) {
  const idUser = getCookie("id");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    todoId: id,
  });

  console.log(raw);

  const requestOptions = {
    method: "delete",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/api/todos/${idUser}/delete`, requestOptions)
    .then((result) => {
      alert("Berhasil hapus todo");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
}

async function update() {
  let title = document.getElementById("title_edit").value;
  let subtitle = document.getElementById("subtitle_edit").value;
  let description = document.getElementById("description_edit").value;
  let idTodo = document.getElementById("id_todo").value;

  const idUser = getCookie("id");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    todoId: idTodo,
    title: title,
    subtitle: subtitle,
    description: description,
  });

  console.log(raw);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/api/todos/${idUser}/update`, requestOptions)
    .then((result) => {
      alert("Berhasil update todo");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
}

async function edit(id) {
  var idUser = getCookie("id");
  document.querySelector("#edit").classList.add("active");
  const response = await fetch(`/api/todos/${idUser}`);
  if (response.ok) {
    const res = await response.json();
    let todos = res.todos;
    const foundTodo = todos.find((todo) => todo.id === id);
    document.getElementById("title_edit").value = foundTodo.title;
    document.getElementById("subtitle_edit").value = foundTodo.subtitle;
    document.getElementById("description_edit").value = foundTodo.description;
    document.getElementById("id_todo").value = foundTodo.id;
  } else {
    alert("please login again");
    window.location = "/";
  }
}

function card(
  urgent,
  titleColor,
  title,
  subtitle,
  due,
  dateColor,
  description,
  id,
  status
) {
  let wrapper = document.createElement("div");
  wrapper.classList.add("card");
  wrapper.classList.add("card-wrapper");
  wrapper.style.width = "18rem";
  wrapper.style.borderRadius = "20px";
  wrapper.setAttribute("id", "card-wrapper-id");

  console.log(urgent);
  if (urgent == true) {
    wrapper.style.backgroundColor = "#ffb2c5";
  }

  let body = document.createElement("div");
  body.classList.add("card-body");

  let cardTitle = document.createElement("div");
  cardTitle.classList.add("card-title-background");
  cardTitle.style.backgroundColor = titleColor;

  let h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.textContent = title;
  h5.setAttribute("id", "card-title-value");

  let h6 = document.createElement("h6");
  h6.classList.add("card-subtitle");
  h6.classList.add("mb-2");
  h6.classList.add("text-body-secondary");
  h6.textContent = subtitle;
  h6.setAttribute("id", "card-subtitle");

  let buttonContent = document.createElement("div");
  buttonContent.classList.add("row");
  buttonContent.classList.add("container");
  buttonContent.classList.add("gap-2");
  buttonContent.classList.add("justify-content-beetween");
  //   buttonContent.classList.add("")

  if (status) {
    let button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("btn");
    button.classList.add("btn-danger");
    // button.classList.add("button-done");
    button.classList.add("col-5");
    button.setAttribute("onclick", `deleteItem('${id}')`);
    button.setAttribute("id", "button-done");

    let btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-primary");
    btnEdit.classList.add("col-5");
    btnEdit.setAttribute("onclick", `edit('${id}')`);
    btnEdit.setAttribute("id", "button-edit");
    buttonContent.appendChild(button);
    buttonContent.appendChild(btnEdit);
  } else {
    let button = document.createElement("button");
    button.classList.add("btn");
    button.textContent = "Done";
    button.classList.add("btn-success");
    button.classList.add("button-done");
    button.setAttribute("onclick", `doneItem('${id}')`);
    button.setAttribute("id", "button-done");
    buttonContent.appendChild(button);
  }

  let h6p2 = document.createElement("h6");
  h6p2.classList.add("card-subtitle");
  h6p2.classList.add("mb-2");
  h6p2.classList.add("text-body-secondary");
  h6p2.classList.add("due-date");
  h6p2.style.backgroundColor = dateColor;
  h6p2.textContent = due;
  h6p2.setAttribute("id", "card-due");

  let p = document.createElement("p");
  p.classList.add("card-text");
  p.textContent = description;
  p.setAttribute("id", "card-text-value");

  wrapper.appendChild(body);
  body.append(cardTitle);
  cardTitle.append(h5);
  cardTitle.append(h6);
  body.append(h6p2);
  body.append(buttonContent);
  body.append(p);
  return wrapper;
}

function getCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === cookieName) {
      return value;
    }
  }
  return null; // Cookie not found
}








getItem();
