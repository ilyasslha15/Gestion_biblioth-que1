// ===============================
// 0️⃣ Gestion utilisateur
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
    window.location.href = "../login/login.html";
}

// Afficher l’email de l’utilisateur
document.getElementById("role").textContent = user.email;
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
let currentLang = localStorage.getItem("lang") || "fr";//langue par défaut
const selectLang = document.getElementById("select");
selectLang.value = currentLang;

selectLang.addEventListener('change', () => {
    currentLang = selectLang.value;
    selectLang.value = currentLang;
    translatePage();
});

function translatePage() {
    // Navbar
    document.querySelector(".navbar-brand").textContent = currentLang === 'fr' ? "Détailes" : "Details";
    document.querySelector("#sidebar .nav-link:nth-child(1)").textContent = currentLang === 'fr' ? "Tableau de bord" : "Dashboard";
    document.querySelector("#sidebar .nav-link:nth-child(2)").textContent = currentLang === 'fr' ? "Livres" : "Books";
    document.querySelector("#sidebar .nav-link:nth-child(3)").textContent = currentLang === 'fr' ? "Commandes" : "Orders";
   document.querySelector("#sidebar .nav-link:nth-child(4)").textContent = currentLang === 'fr' ? "Catégories" : "Category";
    // Titre page
    document.querySelector("h2").textContent = currentLang === 'fr' ? "📘 Détails du livre" : "📘 Book Details";

    // Labels infos
    const labels = document.querySelectorAll(".inf");
    if (currentLang === 'fr') {
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
    localStorage.setItem("lang", currentLang);
}

// Appliquer la langue par défaut
translatePage();

// ===============================
// 2️⃣ Récupérer le livre depuis l’URL
// ===============================
const params = new URLSearchParams(window.location.search);//prends ce qu’il y a après ? dans l’URL le mets dans params
const titleParam = decodeURIComponent(params.get("title") || ""); // Récupère le paramètre 'title'
// decodeURIComponent ----> sert à transformer un texte encodé dans une URL en texte normal.

if (!titleParam) {
    alert(currentLang === 'fr' ? "Aucun titre fourni !" : "No title provided!");
    window.location.href = "../Liste/Liste.html";
}
let books = JSON.parse(localStorage.getItem("books") || "[]");

// Chercher le livre correspondant
let book = books.find(b => b.title.toLowerCase() === titleParam.toLowerCase());//cherche le livre avec le titre correspondant

if (!book) {
    alert(currentLang === 'fr' ? "Livre introuvable !" : "Book not found!");
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
    // encodeURIComponent ----> sert à encoder un texte normal en texte compatible avec une URL.
}

// ===============================
// 5️⃣ Export PDF
// ===============================
function generatePDF() {
    const printContents = document.getElementById("pdf").innerHTML;//récupère le contenu de la div pdf
    const printWindow = window.open('', '', 'height=100,width=300');//ouvre une nouvelle fenêtre
    printWindow.document.write(printContents);//écrit le contenu dans la nouvelle fenêtre
    printWindow.document.close();//ferme le document pour que le navigateur sache que tout le contenu est chargé
    printWindow.print();//lance l'impression
}
