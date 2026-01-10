// ===============================
// 0 - Gestion utilisateur
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
// 1 - Traduction FR/EN
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
    document.querySelectorAll(".nav-link")[0].textContent = currentLang === 'fr' ? "Tableau de bord" : "Dashboard";
    document.querySelectorAll(".nav-link")[1].textContent = currentLang === 'fr' ? "Livres" : "Books";
    document.querySelectorAll(".nav-link")[2].textContent = currentLang === 'fr' ? "Commandes" : "Orders";
   document.querySelectorAll(".nav-link")[3].textContent = currentLang === 'fr' ? "Catégories" : "Category";
    document.querySelectorAll(".nav-link")[4].textContent = currentLang === 'fr' ? "Listes des auteurs" : "Authors list";

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
        document.getElementById("retour").textContent = "Retour"; 
        document.getElementById("deco").innerHTML="Deconexion";

    } else {
        labels[0].textContent = "Title : ";
        labels[1].textContent = "Author : ";
        labels[2].textContent = "Year : ";
        labels[3].textContent = "Type : ";
        labels[4].textContent = "Price : ";
        document.getElementById("btnPDF").textContent = "Export PDF";
        document.getElementById("btnEdit").textContent = "Edit";
        document.getElementById("retour").textContent = "Back";
         document.getElementById("deco").innerHTML="Logout";

    }
    localStorage.setItem("lang", currentLang);
}

// Appliquer la langue par défaut
translatePage();

// ===============================
// 2 - Récupérer le livre depuis l’URL
// ===============================
const params = new URLSearchParams(window.location.search);//prends ce qu’il y a après ? et le transforme en objet
const titleParam = decodeURIComponent(params.get("title") || "");// Récupère le paramètre 'title' d'après l'objet
//param c'est un objet

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
// 3 -  Afficher les détails du livre
// ===============================
document.getElementById("det_title").textContent = book.title;
document.getElementById("det_author").textContent = book.author;
document.getElementById("det_year").textContent = book.year;
document.getElementById("det_type").textContent = book.type;
document.getElementById("det_price").textContent = book.prix;

// ===============================
// 4 -  Bouton Modifier selon rôle
// ===============================
if (user.role !== "admin") {
    document.getElementById("btnEdit").style.display = "none";
} else {
    document.getElementById("btnEdit").href = "Modifier_livre.html?title=" + encodeURIComponent(book.title);
    // encodeURIComponent ----> sert à encoder un texte normal en texte compatible avec une URL.
}

// ===============================
// 5 - Export PDF
// ===============================
function generatePDF() {
    const printContents = document.getElementById("pdf").innerHTML;//récupère le contenu de la div pdf
    const printWindow = window.open('', '', 'height=100,width=300');//ouvre une nouvelle fenêtre
    printWindow.document.write(printContents);//écrit le contenu dans la nouvelle fenêtre
    printWindow.print();//la barre ou il ya l'outil d'impression
}
