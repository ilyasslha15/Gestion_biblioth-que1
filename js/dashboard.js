// ===============================
// 1 - érification utilisateur connecté
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
    window.location.href = "../html/login.hml"; // Redirection si non connecté
}


// ===============================
// 2 - Gestion du rôle utilisateur et affichage
// ===============================
const roleDiv = document.getElementById("role");
roleDiv.textContent = user.email;// en haut a coté du selecteur du langue

// Bouton ajouter livre pour admin uniquement
const addBookBtn = document.querySelector("#List");
if (user.role !== "admin") addBookBtn.remove();

// Lien commandes pour admin
const ordersLink = document.getElementById("comma");
if (user.role === "admin") ordersLink.href = "../html/list_comm_admin.html";

// Message de bienvenue
const nameDiv = document.getElementById("name");
let welcomeMsg = document.createElement("p");
welcomeMsg.textContent = `Bienvenue ${user.role}`;
welcomeMsg.style.fontSize = "large";
nameDiv.appendChild(welcomeMsg);


// authors
const au = JSON.parse(localStorage.getItem('books') || '[]'); // récupération des livres (fallback)
let VAR = {}; // dictionnaire des comptes par auteur
au.forEach(elm =>{ // Parcourir le tableau des livres
    const author = elm.author;
    if (!VAR[author]) {
        VAR[author] = 1;
    }else {
        VAR[author] += 1;
    }
});
const Sort_A = Object.keys(VAR).sort((a, b) => VAR[b] - VAR[a]);


// ===============================
// 3 - Graphiques et statistiques
// ===============================
const orders = JSON.parse(localStorage.getItem("orders"))||[];
//les graphiques : 
const dia1 = document.getElementById("dia1");
const dia2 = document.getElementById("dia2");
const dia3 = document.getElementById("dia3");

let hor = 0, adv = 0, act = 0;
let chart2, char1;


// Types
const Livres = JSON.parse(localStorage.getItem("books")) || [];
let counts = {}; // objet vide pour compter
Livres.forEach(book => {
    if (counts[book.type]) {
        counts[book.type] += 1; // si le type existe déjà, on incrémente
    } else {
        counts[book.type] = 1; // sinon on initialise à 1
    }
});
// Trier les types par nombre de livres
const Sort_T = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

 //users
 let ord_T = {}
orders.forEach(elm => {
    if(ord_T[elm.user]){
       ord_T[elm.user]+=1 
    }else{
       ord_T[elm.user]=1 
    }
 });
   const ord_T1 = Object.keys(ord_T).sort((a,b)=>ord_T[b]-ord_T[a]);
   
// ----- Diagramme circulaire -----
chart2 = new Chart(dia2, {
    type: 'doughnut',
    data: {
        labels: [ord_T1[0], ord_T1[1],ord_T1[2]],
        datasets: [{
            data: [ord_T[ord_T1[0]], ord_T[ord_T1[1]], ord_T[ord_T1[2]]],
            backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: "Top 3 Clients" }
        }
    }
});

// ----- Diagramme en barres -----
char1 = new Chart(dia1, {
    type: 'bar', //type de graphique
    data: { // Les données à afficher
        labels: [Sort_T[0], Sort_T[1], Sort_T[2]],
        datasets: [
        {
            data: [counts[Sort_T[0]],counts[Sort_T[1]], counts[Sort_T[2]]],
            backgroundColor: '#4e73df'
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

let char3 = new Chart(dia3, {
    type: 'bar',
    data: {
        labels: [Sort_A[0], Sort_A[1], Sort_A[2]],
        datasets: [{
            data: [ VAR[Sort_A[0]],VAR[Sort_A[1]], VAR[Sort_A[2]]],
            backgroundColor: '#4e73df'
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// Statistiques nombre de livres
document.getElementById("NOB").textContent = Livres.length;

// Chiffre d'affaires pour admin
if (user.role === "admin") {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    let totale = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + Number(item.price), 0), 0);
    document.getElementById("TR").textContent = totale;
}

// ===============================
// 4 -  Déconnexion
// ===============================
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
});

// ===============================
// 5 - Traduction dynamique
// ===============================
const selectLang = document.getElementById("select");

function french() {
    // Traduction textes
    document.querySelector("button").textContent = "Déconexion";
    addWelcomeText("Bienvenue");

    updateLinksTextFR();
    updateOverviewTextFR();

    // Graphiques
    chart2.options.plugins.title.text = "Top 3 des clients";
    chart2.update();

    char1.data.datasets[0].label = "Top 3 catagories";
    char1.update();
     char3.data.datasets[0].label = "Top 3 des Authors";
    char3.update();

    document.querySelector("#premsp").textContent = "Tableau de bord";
}

function english() {
    // Traduction textes
    document.querySelector("button").textContent = "Logout";
    addWelcomeText("Welcome");

    updateLinksTextEN();
    updateOverviewTextEN();

    // Graphiques
    chart2.options.plugins.title.text = "Top 3 Clients";
    chart2.data.datasets[0].label = "OverView";
    chart2.update();

    char1.data.datasets[0].label = "Top 3 categorys";
    char1.update();
 char3.data.datasets[0].label = "Top 3 Author";
    char3.update();
    document.querySelector("#premsp").textContent = "Dashboard";
}

// Helpers pour traduction
function addWelcomeText(prefix) {
    welcomeMsg.textContent = `${prefix} ${user.role}`;
}


function updateLinksTextFR() {
    if (user.role !== "admin") {
        document.querySelectorAll("a")[5].textContent = "Lister livres";
    } else {
        document.querySelectorAll("a")[5].textContent = "Ajouter livre";
        document.querySelectorAll("a")[6].textContent = "Lister livres";
    }
    document.querySelectorAll(".nav-link")[0].textContent = "Tableau de bord";
    document.querySelectorAll(".nav-link")[1].textContent = "Livre";
    document.querySelectorAll(".nav-link")[2].textContent = "Commandes";
    document.querySelectorAll(".nav-link")[3].textContent = "Catégories";
    document.querySelectorAll(".nav-link")[4].textContent = "Liste des auteurs";
}

function updateLinksTextEN() {
    if (user.role !== "admin") {
        document.querySelectorAll("a")[5].textContent = "List books";
    } else {
        document.querySelectorAll("a")[5].textContent = "Add book";
        document.querySelectorAll("a")[6].textContent = "List books";
    }
    document.querySelectorAll(".nav-link")[0].textContent = "Dashboard";
    document.querySelectorAll(".nav-link")[1].textContent = "Book";
    document.querySelectorAll(".nav-link")[2].textContent = "Orders";
    document.querySelectorAll(".nav-link")[3].textContent = "Categorys";
    document.querySelectorAll(".nav-link")[4].textContent = "Author list";
}

function updateOverviewTextFR() {
    const titles = ["Aperçu", "Chiffre d'affaires total", "Nombre des livres", "Nombre total d'abonnés"];
    document.querySelectorAll("h5").forEach((h, i) => h.textContent = titles[i]);
}

function updateOverviewTextEN() {
    const titles = ["OverView", "Totale Revenue", "Number Of the Books", "Total number of subscribers"];
    document.querySelectorAll("h5").forEach((h, i) => h.textContent = titles[i]);
}

// Charger la langue depuis localStorage
const savedLang = localStorage.getItem("lang") || "fr";
if (savedLang === "fr") french(); else english();
selectLang.value = savedLang === "fr" ? "French" : "English";

// Changement de langue
selectLang.addEventListener("change", () => {
    const val = selectLang.value;
    if (val === "French") { french(); localStorage.setItem("lang", "fr"); }
    else { english(); localStorage.setItem("lang", "en"); }
});

function totale_Sub(){
    let a = JSON.parse(localStorage.getItem("users"))

    document.getElementById("RG").innerHTML=a.length
}
totale_Sub();
