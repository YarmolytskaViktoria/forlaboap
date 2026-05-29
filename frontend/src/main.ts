import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./apiClient.js";
import {
  renderTable,
  renderListStatus,
  showNotice,
  getFormData,
  fillForm,
  resetForm,
  validateForm,
  showBackendErrors,
  setFormEnabled,
  setEditMode,
  getEditId,
} from "./ui.js";
import type { ApiError } from "./dtos.js";

// --- Завантаження списку ---

async function loadProducts(): Promise<void> {
  renderListStatus("loading");

  const sortBy = (document.getElementById("sortBySelect") as HTMLSelectElement)?.value;
  const sortDir = (document.getElementById("sortDirSelect") as HTMLSelectElement)?.value;
  const licenseType = (document.getElementById("filterLicenseSelect") as HTMLSelectElement)?.value;

  try {
    const response = await getProducts({
      sortBy: sortBy || undefined,
      sortDir: sortDir || undefined,
      licenseType: licenseType || undefined,
    });
    if (!response.items || response.items.length === 0) {
      renderTable([]);
      renderListStatus("empty");
      return;
    }
    renderTable(response.items);
    renderListStatus("success");
  } catch (e) {
    const err = e as ApiError;
    renderTable([]);
    renderListStatus("error", err);
  }
}

// --- Сабміт форми (створення або редагування) ---

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault();
  const data = getFormData();

  if (!validateForm(data)) return;

  const editId = getEditId();
  setFormEnabled(false);

  try {
    if (editId) {
      await updateProduct(editId, {
        name: data.name,
        licenseType: data.licenseType as "Free" | "Academic" | "Commercial",
        userEmail: data.userEmail,
        comment: data.comment,
      });
      showNotice("Продукт оновлено успішно!");
    } else {
      await createProduct({
        name: data.name,
        licenseType: data.licenseType as "Free" | "Academic" | "Commercial",
        userEmail: data.userEmail,
        comment: data.comment,
      });
      showNotice("Продукт створено успішно!");
    }
    resetForm();
    await loadProducts();
  } catch (e) {
    const err = e as ApiError;
    if (err.status === 400 && err.errors) {
      showBackendErrors(err.errors);
    } else if (err.status === 409) {
      showNotice(`Помилка: ${err.message}`, true);
    } else {
      showNotice(`Помилка (${err.status}): ${err.message}`, true);
    }
  } finally {
    setFormEnabled(true);
  }
}

// --- Видалення ---

async function handleDelete(id: string): Promise<void> {
  if (!confirm("Видалити цей продукт?")) return;

  try {
    await deleteProduct(id);
    showNotice("Продукт видалено!");
    await loadProducts();
  } catch (e) {
    const err = e as ApiError;
    showNotice(`Помилка видалення (${err.status}): ${err.message}`, true);
  }
}

// --- Редагування ---

async function handleEdit(id: string): Promise<void> {
  try {
    const product = await getProductById(id);
    fillForm(product);
    setEditMode(id);
    document.getElementById("createForm")?.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    const err = e as ApiError;
    showNotice(`Помилка завантаження (${err.status}): ${err.message}`, true);
  }
}

// --- Події ---

document.getElementById("createForm")?.addEventListener("submit", handleSubmit);

document.getElementById("resetBtn")?.addEventListener("click", () => {
  resetForm();
});

document.getElementById("itemsTableBody")?.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const id = target.dataset.id;
  if (!id) return;

  if (target.classList.contains("deleteBtn")) {
    handleDelete(id);
  }

  if (target.classList.contains("editBtn")) {
    handleEdit(id);
  }
});

document.getElementById("sortBySelect")?.addEventListener("change", loadProducts);
document.getElementById("sortDirSelect")?.addEventListener("change", loadProducts);
document.getElementById("filterLicenseSelect")?.addEventListener("change", loadProducts);

// --- Старт ---
loadProducts();