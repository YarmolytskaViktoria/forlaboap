import type { ProductListItemDto, ApiError } from "./dtos.js";

// --- Notice (повідомлення про успіх/помилку) ---

export function showNotice(text: string, isError = false): void {
  const el = document.getElementById("notice")!;
  el.textContent = text;
  el.className = isError ? "notice error" : "notice success";
  setTimeout(() => {
    el.textContent = "";
    el.className = "notice";
  }, 4000);
}

// --- Стан списку ---

export function renderListStatus(status: "loading" | "empty" | "error" | "success", error?: ApiError): void {
  const el = document.getElementById("listStatus")!;
  if (status === "loading") {
    el.innerHTML = "Завантаження...";
  } else if (status === "empty") {
    el.innerHTML = "Поки що немає продуктів.";
  } else if (status === "error") {
    el.innerHTML = `Помилка (${error?.status ?? 0}): ${error?.message ?? "невідома"}`;
  } else {
    el.innerHTML = "";
  }
}

// --- Таблиця продуктів ---

export function renderTable(items: ProductListItemDto[]): void {
  const tbody = document.getElementById("itemsTableBody")!;
  tbody.innerHTML = "";

  items.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name ?? "—"}</td>
      <td>${p.licenseType ?? "—"}</td>
      <td>${p.userEmail ?? "—"}</td>
      <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString("uk-UA") : "—"}</td>
      <td>${p.comment ?? "—"}</td>
      <td>
        <button class="editBtn" data-id="${p.id}">Редагувати</button>
        <button class="deleteBtn" data-id="${p.id}">Видалити</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// --- Форма ---

export function getFormData(): {
  name: string;
  licenseType: string;
  userEmail: string;
  comment: string;
} {
  return {
    name: (document.getElementById("nameInput") as HTMLInputElement).value.trim(),
    licenseType: (document.getElementById("licenseSelect") as HTMLSelectElement).value,
    userEmail: (document.getElementById("userInput") as HTMLInputElement).value.trim(),
    comment: (document.getElementById("commentInput") as HTMLTextAreaElement).value.trim(),
  };
}

export function fillForm(product: ProductListItemDto): void {
  (document.getElementById("nameInput") as HTMLInputElement).value = product.name;
  (document.getElementById("licenseSelect") as HTMLSelectElement).value = product.licenseType;
  (document.getElementById("userInput") as HTMLInputElement).value = product.userEmail;
  (document.getElementById("commentInput") as HTMLTextAreaElement).value = product.comment ?? "";
}

export function resetForm(): void {
  (document.getElementById("createForm") as HTMLFormElement).reset();
  clearErrors();
  setEditMode(null);
}

// --- Валідація ---

export function showFieldError(errorId: string, message: string, inputId: string): void {
  const errEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);
  if (errEl) errEl.textContent = message;
  if (inputEl) inputEl.classList.add("invalid");
}

export function clearErrors(): void {
  document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input, select, textarea").forEach((el) =>
    el.classList.remove("invalid")
  );
}

export function validateForm(data: {
  name: string;
  licenseType: string;
  userEmail: string;
}): boolean {
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
  } else if (!data.userEmail.includes("@")) {
    showFieldError("userError", "Введіть коректний email", "userInput");
    valid = false;
  }

  return valid;
}

export function showBackendErrors(errors: Record<string, string[]>): void {
  const fieldMap: Record<string, { errorId: string; inputId: string }> = {
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

export function setFormEnabled(isEnabled: boolean): void {
  const btn = document.getElementById("submitBtn") as HTMLButtonElement;
  if (btn) btn.disabled = !isEnabled;
}

// --- Режим редагування ---

let currentEditId: string | null = null;

export function setEditMode(id: string | null): void {
  currentEditId = id;
  const btn = document.getElementById("submitBtn") as HTMLButtonElement;
  const title = document.getElementById("formTitle");
  if (id) {
    if (btn) btn.textContent = "Зберегти зміни";
    if (title) title.textContent = "Редагувати продукт";
  } else {
    if (btn) btn.textContent = "Додати";
    if (title) title.textContent = "Додати продукт";
  }
}

export function getEditId(): string | null {
  return currentEditId;
}