const state = {
  products: [],
  nextId: 1
};

// Знаходимо форму та таблицю
const form = document.getElementById("createForm");
const tableBody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");

  // Зчитуємо значення полів
  function readForm() {
  return {
    id: state.nextId++,
    name: document.getElementById("nameInput").value.trim(),
    license: document.getElementById("licenseSelect").value,
    user: document.getElementById("userInput").value.trim(),
    date: document.getElementById("dateInput").value,
  comment: document.getElementById("commentInput").value.trim()
  };
}
function showError(errorId, message, inputId) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(inputId).classList.add("invalid");
}

function clearErrors() {
  document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
  document.querySelectorAll("input, select, textarea")
    .forEach(el => el.classList.remove("invalid"));
}
  // Мінімальна валідація
  function validateForm(data) {
  let valid = true;
  clearErrors();

  if (!data.name) {
    showError("nameError", "Назва обов'язкова", "nameInput");
    valid = false;
  } else {
    document.getElementById("nameError").textContent = "";
  }

  if (!data.license) {
    showError("licenseError", "Оберіть ліцензію", "licenseSelect");
    valid = false;
  } else {
    document.getElementById("licenseError").textContent = "";
  }

  if (!data.user) {
    showError("userError", "Користувач обов'язковий", "userInput");
    valid = false;
  } else if(!data.user.includes("@")) {
    showError("userError", "Введіть коректну електронну адресу", "userInput");
    valid = false;
  } else {
    document.getElementById("userError").textContent = "";
  }
 
  if (!data.date) {
    showError("dateError", "Дата обов'язкова", "dateInput");
    valid = false;
  } else {
    document.getElementById("dateError").textContent = "";
  }

  return valid;
 }

function addItem(item) {
 state.products.push(item);
}


// Функція для оновлення таблиці
function renderTable() {
  tableBody.innerHTML = ""; 
  state.products.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.license}</td>
      <td>${p.user}</td>
      <td>${p.date}</td>
      <td>${p.comment}</td>
      <td><button class = "deleteBtn" data-id = "${p.id}">Видалити</button></td>
    `;
    tableBody.appendChild(row);
  });
}
   form.addEventListener("submit", function(event) {
  event.preventDefault();
  const data = readForm();

  if (validateForm(data)) {
    addItem(data);
    renderTable();
    form.reset();
    clearErrors();
  }
});

resetBtn.addEventListener("click", function() {
  form.reset();
  clearErrors();
});

tableBody.addEventListener("click", function(event) {
  if (event.target.classList.contains("deleteBtn")) {
    const id = Number(event.target.dataset.id);
    state.products = state.products.filter(p => p.id !== id);
    renderTable();
  }
});