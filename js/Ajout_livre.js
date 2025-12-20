// ===============================
// 0️⃣ Traduction de la page
// ===============================
let currentLang = 'French'; // Langue par défaut
const selectLang = document.getElementById("select");
const form = document.getElementById("bookForm");

selectLang.addEventListener('change', () => {
    currentLang = selectLang.value;
    translatePage();
});

function translatePage() {
    // Navbar
    document.getElementById("deco").textContent = currentLang === 'French' ? "Déconnexion" : "Logout";
    document.querySelector("span.navbar-brand").textContent = currentLang === 'French' ? "Livre" : "Book";

    // Sidebar
    const links = document.querySelectorAll("#sidebar .nav-link");
    links[0].textContent = currentLang === 'French' ? "Tableau de bord" : "Dashboard";
    links[1].textContent = currentLang === 'French' ? "Livres" : "Books";
    links[2].textContent = currentLang === 'French' ? "Commandes" : "Orders";

    // Titre page
    document.querySelector("#content h2").textContent = currentLang === 'French' ? "Ajouter un livre" : "Add Book";

    // Labels formulaire
    document.querySelector("label[for='title']").textContent = currentLang === 'French' ? "Titre" : "Title";
    document.querySelector("label[for='author']").textContent = currentLang === 'French' ? "Auteur" : "Author";
    document.querySelector("label[for='year']").textContent = currentLang === 'French' ? "Année" : "Year";
    document.querySelector("label[for='type']").textContent = currentLang === 'French' ? "Type" : "Type";
    document.querySelector("label[for='prix']").textContent = currentLang === 'French' ? "Prix" : "Price";

    // Bouton
    form.querySelector("button").textContent = currentLang === 'French' ? "Créer" : "Create";
}

// ===============================
// 1️⃣ Gestion utilisateur
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "../login/login.html";

document.getElementById("role").textContent = user.email;

// Déconnexion
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../login/login.html";
});
if(user.role === "admin") {
    document.getElementById("comma").href = "../html/list_comm_admin.html";
}   

// Charger la langue sauvegardée
const savedLang = localStorage.getItem("lang") || "fr";
currentLang = savedLang === "fr" ? "French" : "English";
selectLang.value = currentLang;
translatePage();

// ===============================
// 2️⃣ Sélection des champs et messages
// ===============================
const title = document.getElementById('title');
const author = document.getElementById('author');
const year = document.getElementById('year');
const type = document.getElementById('type');
const prix = document.getElementById('prix');

const errTitle = document.getElementById('errTitle');
const errAuthor = document.getElementById('errAuthor');
const errYear = document.getElementById('errYear');
const errType = document.getElementById('errtype');
const errPrix = document.getElementById('errprix');
const confirmation = document.getElementById('confirmation');

// ===============================
// 3️⃣ Validation en temps réel
// ===============================
title.addEventListener('input', () => {
    errTitle.textContent = title.value.trim() ? '' : currentLang === 'French' ? 'Le titre est obligatoire' : 'Title is required';
});
author.addEventListener('input', () => {
    errAuthor.textContent = author.value.trim() ? '' : currentLang === 'French' ? 'L\'auteur est obligatoire' : 'Author is required';
});
year.addEventListener('input', () => {
    const val = Number(year.value);
    if (!year.value.trim()) errYear.textContent = currentLang === 'French' ? 'L\'année est obligatoire' : 'Year is required';
    else if (val < 1900 || val > 2025) errYear.textContent = currentLang === 'French' ? 'Année invalide' : 'Invalid year';
    else errYear.textContent = '';
});
prix.addEventListener('input', () => {
    errPrix.textContent = prix.value.trim() ? '' : currentLang === 'French' ? 'Le prix est obligatoire' : 'Price is required';
});

// ===============================
// 4️⃣ Soumission du formulaire
// ===============================
form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // ----- Validation
    if (!title.value.trim()) {
        errTitle.textContent = currentLang === 'French' ? 'Le titre est obligatoire' : 'Title is required';
        valid = false;
    } else errTitle.textContent = '';

    if (!author.value.trim()) {
        errAuthor.textContent = currentLang === 'French' ? 'L\'auteur est obligatoire' : 'Author is required';
        valid = false;
    } else errAuthor.textContent = '';

    const y = Number(year.value);
    if (!year.value.trim()) {
        errYear.textContent = currentLang === 'French' ? 'L\'année est obligatoire' : 'Year is required';
        valid = false;
    } else if (y < 1900 || y > 2025) {
        errYear.textContent = currentLang === 'French' ? 'Année invalide' : 'Invalid year';
        valid = false;
    } else errYear.textContent = '';


    if (Number(prix.value.trim()) <= 0) {
        errPrix.textContent = currentLang === "French" ? 'Le prix doit être > 0' : 'Price must be > 0';
        valid = false;
    }

    if (!valid) return;

    // ----- Ajouter le livre
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    books.push({
        title: title.value.trim(),
        author: author.value.trim(),
        year: y,
        type: type.value.trim(),
        prix: Number(prix.value.trim()),
        available: true
    });
    localStorage.setItem('books', JSON.stringify(books));

    // ----- Confirmation et redirection
    confirmation.textContent = currentLang === 'French' ? 'Livre ajouté avec succès !' : 'Book added successfully!';
    setTimeout(() => confirmation.textContent = '', 2000);

    form.reset();
    window.location.href="../html/Liste_livres.html";
});
 document.getElementById("deco").addEventListener("click", () => {
     localStorage.removeItem("currentUser");
     window.location.href = "../html/login.html";
 })
