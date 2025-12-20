// ===============================
// 1️⃣ Vérification utilisateur connecté
// ===============================
const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
    window.location.href = "../html/login.html"; // Redirection si non connecté
}

// ===============================
// 2️⃣ Gestion du rôle utilisateur et affichage
// ===============================
const roleDiv = document.getElementById("role");
roleDiv.textContent = user.email;

// Bouton ajouter livre pour admin uniquement
const addBookBtn = document.querySelector("#List");
if (user.role !== "admin") addBookBtn.remove();

// Lien commandes pour admin
const ordersLink = document.getElementById("comma");
if (user.role === "admin") ordersLink.href = "../html/list_comm_admin.html";

// Message de bienvenue
const nameDiv = document.getElementById("name");
const welcomeMsg = document.createElement("p");
welcomeMsg.textContent = `Bienvenue ${user.role}`;
welcomeMsg.style.fontSize = "large";
nameDiv.appendChild(welcomeMsg);

// ===============================
// 3️⃣ Graphiques et statistiques
// ===============================
const dia1 = document.getElementById("dia1");
const dia2 = document.getElementById("dia2");

let hor = 0, adv = 0, act = 0;
const Livres = JSON.parse(localStorage.getItem("books")) || [];

Livres.forEach(book => {
    if (book.type === "horror") hor++;
    if (book.type === "adventure") adv++;
    if (book.type === "action") act++;
});

// ----- Diagramme circulaire -----
const chart2 = new Chart(dia2, {
    type: 'doughnut',
    data: {
        labels: ['Horror', 'Adventure', 'Action'],
        datasets: [{
            data: [hor, adv, act],
            backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: "Chiffre d'affaires mensuel" }
        }
    }
});

// ----- Diagramme en barres -----
const char1 = new Chart(dia1, {
    type: 'bar',
    data: {
        labels: ['Action', 'Adventure', 'Horror'],
        datasets: [{ data: [act, adv, hor], backgroundColor: '#4e73df' }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// Statistiques nombre de livres
document.getElementById("NOB").textContent = Livres.length;

// Chiffre d'affaires pour admin
if (user.role === "admin") {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const totale = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + Number(item.price), 0), 0);
    document.getElementById("TR").textContent = totale;
}

// ===============================
// 4️⃣ Déconnexion
// ===============================
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
});

// ===============================
// 5️⃣ Traduction dynamique
// ===============================
const selectLang = document.getElementById("select");

// Fonction pour mettre à jour le message de bienvenue
function addWelcomeText(prefix) {
    welcomeMsg.textContent = `${prefix} ${user.role}`;
}

// Traductions des liens et textes
function updateLinksTextFR() {
    if (user.role !== "admin") {
        document.querySelectorAll("a")[4].textContent = "Lister livres";
    } else {
        document.querySelectorAll("a")[4].textContent = "Ajouter livre";
        document.querySelectorAll("a")[5].textContent = "Lister livres";
    }
    document.querySelectorAll(".nav-link")[0].textContent = "Tableau de bord";
    document.querySelectorAll(".nav-link")[1].textContent = "Livre";
    document.querySelectorAll(".nav-link")[2].textContent = "Commandes";
}

function updateLinksTextEN() {
    if (user.role !== "admin") {
        document.querySelectorAll("a")[4].textContent = "List books";
    } else {
        document.querySelectorAll("a")[4].textContent = "Add book";
        document.querySelectorAll("a")[5].textContent = "List books";
    }
    document.querySelectorAll(".nav-link")[0].textContent = "Dashboard";
    document.querySelectorAll(".nav-link")[1].textContent = "Book";
    document.querySelectorAll(".nav-link")[2].textContent = "Orders";
}

// Traductions des titres de l'overview
function updateOverviewTextFR() {
    const titles = ["Aperçu", "Chiffre d'affaires total", "Nombre des livres", "Croissance du chiffre d'affaires (%)"];
    document.querySelectorAll("h5").forEach((h, i) => h.textContent = titles[i]);
}

function updateOverviewTextEN() {
    const titles = ["OverView", "Total Revenue", "Number Of the Books", "Revenue Growth (%)"];
    document.querySelectorAll("h5").forEach((h, i) => h.textContent = titles[i]);
}

// Fonctions principales pour changer de langue
function french() {
    document.querySelector("button").textContent = "Déconnecté";
    addWelcomeText("Bienvenue");
    updateLinksTextFR();
    updateOverviewTextFR();
    chart2.options.plugins.title.text = "Chiffre d'affaires mensuel";
    chart2.data.datasets[0].label = "Apercu";
    chart2.update();
    char1.data.datasets[0].label = "Revenue";
    char1.update();
    document.querySelector("#premsp").textContent = "Tableau de bord";
    document.getElementById("cat").textContent = "Catégorie";
}

function english() {
    document.querySelector("button").textContent = "Disconnect";
    addWelcomeText("Welcome");
    updateLinksTextEN();
    updateOverviewTextEN();
    chart2.options.plugins.title.text = "Monthly Revenue";
    chart2.data.datasets[0].label = "Overview";
    chart2.update();
    char1.data.datasets[0].label = "Income";
    char1.update();
    document.querySelector("#premsp").textContent = "Dashboard";
    document.getElementById("cat").textContent = "Category";
}

// ===============================
// 6️⃣ Initialisation de la langue
// ===============================
const savedLang = localStorage.getItem("lang") || "fr";
if (savedLang === "fr") french(); else english();
selectLang.value = savedLang === "fr" ? "French" : "English";

// Changement de langue par l'utilisateur
selectLang.addEventListener("change", () => {
    const val = selectLang.value;
    if (val === "French") { 
        french(); 
        localStorage.setItem("lang", "fr"); 
    } else { 
        english(); 
        localStorage.setItem("lang", "en"); 
    }
});
