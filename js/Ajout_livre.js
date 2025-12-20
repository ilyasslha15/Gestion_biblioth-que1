// ===============================
// 0️⃣ Traduction de la page
// ===============================
let currentLang = 'French'; // Langue par défaut
const selectLang = document.getElementById("select");
const form = document.getElementById("bookForm");

if (selectLang) {
    selectLang.addEventListener('change', () => {
        currentLang = selectLang.value;
        translatePage();
    });
}

function translatePage() {
    // Navbar
    const deco = document.getElementById("deco");
    if (deco) deco.textContent = currentLang === 'French' ? "Déconnexion" : "Logout";
    
    const navBrand = document.querySelector("span.navbar-brand");
    if (navBrand) navBrand.textContent = currentLang === 'French' ? "Livre" : "Book";

    // Sidebar
    const links = document.querySelectorAll("#sidebar .nav-link");
    if (links.length > 0) {
        links[0].textContent = currentLang === 'French' ? "Tableau de bord" : "Dashboard";
        links[1].textContent = currentLang === 'French' ? "Livres" : "Books";
        links[2].textContent = currentLang === 'French' ? "Commandes" : "Orders";
    }

    // Titre page
    const contentH2 = document.querySelector("#content h2");
    if (contentH2) contentH2.textContent = currentLang === 'French' ? "Ajouter un livre" : "Add Book";

    // Labels formulaire
    const titleLabel = document.querySelector("label[for='title']");
    if (titleLabel) titleLabel.textContent = currentLang === 'French' ? "Titre" : "Title";
    
    const authorLabel = document.querySelector("label[for='author']");
    if (authorLabel) authorLabel.textContent = currentLang === 'French' ? "Auteur" : "Author";
    
    const yearLabel = document.querySelector("label[for='year']");
    if (yearLabel) yearLabel.textContent = currentLang === 'French' ? "Année" : "Year";
    
    const typeLabel = document.querySelector("label[for='type']");
    if (typeLabel) typeLabel.textContent = currentLang === 'French' ? "Type" : "Type";
    
    const prixLabel = document.querySelector("label[for='prix']");
    if (prixLabel) prixLabel.textContent = currentLang === 'French' ? "Prix" : "Price";

    // Bouton
    if (form && form.querySelector("button")) {
        form.querySelector("button").textContent = currentLang === 'French' ? "Créer" : "Create";
    }
}

// ===============================
// 1️⃣ Gestion utilisateur
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "../html/login.html";

const roleElement = document.getElementById("role");
if (roleElement) roleElement.textContent = user.email;

// Déconnexion
const decoElement = document.getElementById("deco");
if (decoElement) {
    decoElement.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../html/login.html";
    });
}

const commaElement = document.getElementById("comma");
if(user.role === "admin" && commaElement) {
    commaElement.href = "../html/list_comm_admin.html";
}   

// Charger la langue sauvegardée
const savedLang = localStorage.getItem("lang") || "fr";
currentLang = savedLang === "fr" ? "French" : "English";
if (selectLang) {
    selectLang.value = currentLang;
}
translatePage();

// ===============================
// 2️⃣ Sélection des champs et messages
// ===============================

const title = document.getElementById('title');
const author = document.getElementById('author');
const year = document.getElementById('year');
const type = document.getElementById('type');
const prix = document.getElementById('prix') || document.getElementById('price');

const errTitle = document.getElementById('errTitle');
const errAuthor = document.getElementById('errAuthor');
const errYear = document.getElementById('errYear');
const errType = document.getElementById('errtype');
const errPrix = document.getElementById('errprix');
const confirmation = document.getElementById('confirmation');

// Vérifier que les éléments principaux existent
if (!title || !author || !year || !type || !prix) {
    console.warn("Éléments du formulaire manquants pour creationLivre");
    return;
}

// ===============================
// 3️⃣ Validation en temps réel
// ===============================
if (title) {
    title.addEventListener('input', () => {
        if (errTitle) errTitle.textContent = title.value.trim() ? '' : currentLang === 'French' ? 'Le titre est obligatoire' : 'Title is required';
    });
}

if (author) {
    author.addEventListener('input', () => {
        if (errAuthor) errAuthor.textContent = author.value.trim() ? '' : currentLang === 'French' ? 'L\'auteur est obligatoire' : 'Author is required';
    });
}

if (year) {
    year.addEventListener('input', () => {
        const val = Number(year.value);
        if (errYear) {
            if (!year.value.trim()) errYear.textContent = currentLang === 'French' ? 'L\'année est obligatoire' : 'Year is required';
            else if (val < 1900 || val > 2025) errYear.textContent = currentLang === 'French' ? 'Année invalide' : 'Invalid year';
            else errYear.textContent = '';
        }
    });
}

if (prix) {
    prix.addEventListener('input', () => {
        if (errPrix) errPrix.textContent = prix.value.trim() ? '' : currentLang === 'French' ? 'Le prix est obligatoire' : 'Price is required';
    });
}

// ===============================
// 4️⃣ Soumission du formulaire
// ===============================
if (form) {
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
            if (errPrix) errPrix.textContent = currentLang === "French" ? 'Le prix doit être > 0' : 'Price must be > 0';
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
        if (confirmation) {
            confirmation.textContent = currentLang === 'French' ? 'Livre ajouté avec succès !' : 'Book added successfully!';
            setTimeout(() => confirmation.textContent = '', 2000);
        }

        form.reset();
        window.location.href="../html/Liste_livres.html";
    });
}
