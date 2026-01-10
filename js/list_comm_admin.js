/****************************************
 * Gestion utilisateur
 ****************************************/
// Récupérer l'utilisateur connecté
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "../html/login.html"; // redirection si non connecté

// Afficher l'email de l'utilisateur dans la navbar
document.getElementById("role").innerText = currentUser.email;

// Déconnexion
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // supprimer l'utilisateur connecté
    window.location.href = "../html/login.html"; // redirection vers la page login
});


/****************************************
 * Traduction FR/EN
 ****************************************/
let currentLang = localStorage.getItem("lang") || "fr"; // langue courante
const langSelector = document.getElementById("langSelector");
langSelector.value = currentLang;

// Fonction pour traduire la page
function translatePage() {
    // Traduire tous les éléments avec data-fr / data-en
    document.querySelectorAll("[data-fr]").forEach(el => {
        const fr = el.getAttribute("data-fr");
        const en = el.getAttribute("data-en");
        el.innerText = currentLang === "fr" ? fr : en;
    });

    // Mettre à jour le placeholder du champ de recherche
    document.getElementById("searchTitle").placeholder = currentLang === "fr" ? "Email du client" : "Client email";

    // Sauvegarder la langue sélectionnée
    localStorage.setItem("lang", currentLang);
}

// Traduction initiale
translatePage();

// Changement de langue
langSelector.addEventListener("change", () => {
    currentLang = langSelector.value;
    translatePage();
});


/****************************************
 * Chargement des commandes
 ****************************************/
function AllOrders(userEmail = null) {

    // Récupérer les commandes depuis localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Gestion du cas où aucune commande n'existe
    if (orders.length === 0) {
        document.getElementById("titles").style.display = "none";
        document.getElementById("ligne_info").style.display = "none";
        document.getElementById("res").innerText = currentLang === "fr" ? "Aucune commande disponible." : "No orders available.";
        return;
    }

    // Préparer le tableau
    const tbody = document.querySelector("#table2 tbody");
    tbody.innerHTML = ""; // vider le tableau
    const test10Div = document.getElementById("test10");
    const ligneInfo = document.getElementById("ligne_info");
    const resMessage = document.getElementById("res");

    // Filtrer les commandes si un email est fourni
    let filteredOrders = orders;
    if (userEmail) {
        filteredOrders = orders.filter(o => o.user === userEmail);
    }

    // Afficher le filtre et le tableau
    test10Div.style.display = "block";
    ligneInfo.style.display = "table-header-group";
    resMessage.innerText = "";

    // Boucler sur les commandes et afficher chaque item
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            let tr = document.createElement("tr");

            let tdEmail = document.createElement("td");
            tdEmail.innerText = order.user;

            let tdBook = document.createElement("td");
            tdBook.innerText = item.title;

            let tdPrice = document.createElement("td");
            tdPrice.innerText = item.price;

            let tdBtn = document.createElement("td");
            let button = document.createElement("button");
            button.className = "btn btn-success mb-3";
            button.innerText = currentLang === "fr" ? "Exporter" : "Export";
            button.id = item.title + " " + order.user;
            button.onclick = () => Export_Comm(button.id);
            tdBtn.appendChild(button);

            tr.appendChild(tdEmail);
            tr.appendChild(tdBook);
            tr.appendChild(tdPrice);
            tr.appendChild(tdBtn);

            tbody.appendChild(tr);
        });
    });
}


/****************************************
 * Export d’une commande
 ****************************************/
function Export_Comm(id) {
    // Séparer l'email (dernier mot) et le titre (tout le reste)
    const parts = id.split(" ");
    const email = parts.pop();
    const title = parts.join(" ");

    // Récupérer livres et utilisateurs
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const book = books.find(b => b.title === title);
    const client = users.find(u => u.email === email);

    if (!book || !client) {
        alert("Livre ou utilisateur non trouvé !");
        return;
    }

    // Construire le contenu du fichier
    const text = `Client informations:
email : ${client.email}
role : ${client.role}

Book informations:
Book title : ${book.title}
Author : ${book.author}
Year : ${book.year}
Type : ${book.type}
Prix : ${book.prix}`;

    // Créer un fichier texte et lancer le téléchargement
    const blob = new Blob([text], { type: "text/plain" });//un fichier virtuel en mémoire dans le navigateur.
    const url = URL.createObjectURL(blob);//crée un lien temporaire vers le fichier en mémoire.

    const a = document.createElement("a");
    a.href = url;//// on met le lien vers le fichier
    a.download = `${client.email}.txt`;// // nom du fichier à télécharger
    a.click();// simule un clic pour lancer le téléchargement

    URL.revokeObjectURL(url); // libérer la mémoire
}


/****************************************
 * Recherche par email
 ****************************************/
document.getElementById("searchTitle").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = e.target.value.trim();
        const found = JSON.parse(localStorage.getItem("orders") || "[]").find(o => o.user === value);

        if (!found) {
            document.getElementById("error").innerText =
                currentLang === "fr" ? "Erreur : cet email n'existe pas !" : "Error: this email does not exist!";
            AllOrders();
        } else {
            document.getElementById("error").innerText = '';
            AllOrders(value);
        }
    }
});


/****************************************
 * Chargement initial
 ****************************************/
AllOrders();
