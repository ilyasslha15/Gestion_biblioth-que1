// ===============================
// 0️⃣ Gestion utilisateur
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
    window.location.href = "../login/login.html";
}

// Afficher l’email de l’utilisateur
document.getElementById("comma").textContent = user.email;
if (user.role === "admin") {        
 document.getElementById("comma").href = "../html/list_comm_admin.html";
}

// Déconnexion
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
});

// ===============================
// 1️⃣ Traduction FR/EN
// ===============================
let currentLang = 'French'; // Langue par défaut
const selectLang = document.getElementById("select");

selectLang.addEventListener('change', () => {
    currentLang = selectLang.value;
    translatePage();
});

function translatePage() {
    // Navbar
    document.querySelector(".navbar-brand").textContent = currentLang === 'French' ? "Tableau de bord" : "Dashboard";
    document.querySelector("#sidebar .nav-link:nth-child(1)").textContent = currentLang === 'French' ? "Tableau de bord" : "Dashboard";
    document.querySelector("#sidebar .nav-link:nth-child(2)").textContent = currentLang === 'French' ? "Livres" : "Books";
    document.querySelector("#sidebar .nav-link:nth-child(3)").textContent = currentLang === 'French' ? "Commandes" : "Orders";

    // Titre page
    document.querySelector("h2").textContent = currentLang === 'French' ? "📘 Détails du livre" : "📘 Book Details";

    // Labels infos
    const labels = document.querySelectorAll(".inf");
    if (currentLang === 'French') {
        labels[0].textContent = "Titre : ";
        labels[1].textContent = "Auteur : ";
        labels[2].textContent = "Année : ";
        labels[3].textContent = "Type : ";
        labels[4].textContent = "Prix : ";
        document.getElementById("btnPDF").textContent = "Exporter PDF";
        document.getElementById("btnEdit").textContent = "Modifier";
        document.querySelector("#main a.btn-primary").textContent = "Retour"; 
        document.getElementById("deco").innerHTML="Deconexion";

    } else {
        labels[0].textContent = "Title : ";
        labels[1].textContent = "Author : ";
        labels[2].textContent = "Year : ";
        labels[3].textContent = "Type : ";
        labels[4].textContent = "Price : ";
        document.getElementById("btnPDF").textContent = "Export PDF";
        document.getElementById("btnEdit").textContent = "Edit";
        document.querySelector("#main a.btn-primary").textContent = "Back";
         document.getElementById("deco").innerHTML="Logout";

    }
}

// Appliquer la langue par défaut
translatePage();

// ===============================
// 2️⃣ Récupérer le livre depuis l’URL
// ===============================
const params = new URLSearchParams(window.location.search);
const titleParam = decodeURIComponent(params.get("title") || "");

if (!titleParam) {
    alert(currentLang === 'French' ? "Aucun titre fourni !" : "No title provided!");
    window.location.href = "../Liste/Liste.html";
}

let books = JSON.parse(localStorage.getItem("books") || "[]");

// Chercher le livre correspondant
let book = books.find(b => b.title.toLowerCase() === titleParam.toLowerCase());

if (!book) {
    alert(currentLang === 'French' ? "Livre introuvable !" : "Book not found!");
    window.location.href = "../Liste/Liste.html";
}

// ===============================
// 3️⃣ Afficher les détails du livre
// ===============================
document.getElementById("det_title").textContent = book.title;
document.getElementById("det_author").textContent = book.author;
document.getElementById("det_year").textContent = book.year;
document.getElementById("det_type").textContent = book.type;
document.getElementById("det_price").textContent = book.prix;

// ===============================
// 4️⃣ Bouton Modifier selon rôle
// ===============================
if (user.role !== "admin") {
    document.getElementById("btnEdit").style.display = "none";
} else {
    document.getElementById("btnEdit").href = "Modifier_livre.html?title=" + encodeURIComponent(book.title);
}

// ===============================
// 5️⃣ Export PDF
// ===============================
function generatePDF() {
    const printContents = document.getElementById("pdf").innerHTML;
    const printWindow = window.open('', '', 'height=100,width=300');
    printWindow.document.write(printContents);
    printWindow.document.close();
    printWindow.print();
}
