// --- Notice (повідомлення про успіх/помилку) ---
export function showNotice(text, isError = false) {
    const el = document.getElementById("notice");
    el.textContent = text;
    el.className = isError ? "notice error" : "notice success";
    setTimeout(() => {
        el.textContent = "";
        el.className = "notice";
    }, 4000);
}
// --- Стан списку ---
export function renderListStatus(status, error) {
    const el = document.getElementById("listStatus");
    if (status === "loading") {
        el.innerHTML = "Завантаження...";
    }
    else if (status === "empty") {
        el.innerHTML = "Поки що немає продуктів.";
    }
    else if (status === "error") {
        el.innerHTML = `Помилка (${error?.status ?? 0}): ${error?.message ?? "невідома"}`;
    }
    else {
        el.innerHTML = "";
    }
}
// --- Таблиця продуктів ---
export function renderTable(items) {
    const tbody = document.getElementById("itemsTableBody");
    tbody.innerHTML = "";
    items.forEach((p, index) => {
        const row = document.createElement("tr");
        const numberTd = document.createElement("td");
        numberTd.textContent = String(index + 1);
        const nameTd = document.createElement("td");
        nameTd.textContent = p.name ?? "—";
        const licenseTd = document.createElement("td");
        licenseTd.textContent = p.licenseType ?? "—";
        const userTd = document.createElement("td");
        userTd.textContent = p.userEmail ?? "—";
        const dateTd = document.createElement("td");
        dateTd.textContent = p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("uk-UA")
            : "—";
        const commentTd = document.createElement("td");
        commentTd.textContent = p.comment ?? "—";
        const actionsTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.className = "editBtn";
        editBtn.dataset.id = p.id;
        editBtn.textContent = "Редагувати";
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn";
        deleteBtn.dataset.id = p.id;
        deleteBtn.textContent = "Видалити";
        actionsTd.append(editBtn, deleteBtn);
        row.append(numberTd, nameTd, licenseTd, userTd, dateTd, commentTd, actionsTd);
        tbody.appendChild(row);
    });
}
// --- Форма ---
export function getFormData() {
    return {
        name: document.getElementById("nameInput").value.trim(),
        licenseType: document.getElementById("licenseSelect").value,
        userEmail: document.getElementById("userInput").value.trim(),
        comment: document.getElementById("commentInput").value.trim(),
    };
}
export function fillForm(product) {
    document.getElementById("nameInput").value = product.name;
    document.getElementById("licenseSelect").value = product.licenseType;
    document.getElementById("userInput").value = product.userEmail;
    document.getElementById("commentInput").value = product.comment ?? "";
}
export function resetForm() {
    document.getElementById("createForm").reset();
    clearErrors();
    setEditMode(null);
}
// --- Валідація ---
export function showFieldError(errorId, message, inputId) {
    const errEl = document.getElementById(errorId);
    const inputEl = document.getElementById(inputId);
    if (errEl)
        errEl.textContent = message;
    if (inputEl)
        inputEl.classList.add("invalid");
}
export function clearErrors() {
    document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
    document.querySelectorAll("input, select, textarea").forEach((el) => el.classList.remove("invalid"));
}
export function validateForm(data) {
    let valid = true;
    clearErrors();
    if (!data.name || data.name.length < 3) {
        showFieldError("nameError", "Назва має бути не менше 3 символів", "nameInput");
        valid = false;
    }
    if (!data.licenseType) {
        showFieldError("licenseError", "Оберіть ліцензію", "licenseSelect");
        valid = false;
    }
    if (!data.userEmail) {
        showFieldError("userError", "Email обов'язковий", "userInput");
        valid = false;
    }
    else if (!data.userEmail.includes("@")) {
        showFieldError("userError", "Введіть коректний email", "userInput");
        valid = false;
    }
    return valid;
}
export function showBackendErrors(errors) {
    const fieldMap = {
        name: { errorId: "nameError", inputId: "nameInput" },
        licenseType: { errorId: "licenseError", inputId: "licenseSelect" },
        userEmail: { errorId: "userError", inputId: "userInput" },
    };
    for (const [field, messages] of Object.entries(errors)) {
        const map = fieldMap[field];
        if (map) {
            showFieldError(map.errorId, messages[0], map.inputId);
        }
    }
}
// --- Кнопки ---
export function setFormEnabled(isEnabled) {
    const btn = document.getElementById("submitBtn");
    if (btn)
        btn.disabled = !isEnabled;
}
// --- Режим редагування ---
let currentEditId = null;
export function setEditMode(id) {
    currentEditId = id;
    const btn = document.getElementById("submitBtn");
    const title = document.getElementById("formTitle");
    if (id) {
        if (btn)
            btn.textContent = "Зберегти зміни";
        if (title)
            title.textContent = "Редагувати продукт";
    }
    else {
        if (btn)
            btn.textContent = "Додати";
        if (title)
            title.textContent = "Додати продукт";
    }
}
export function getEditId() {
    return currentEditId;
}
