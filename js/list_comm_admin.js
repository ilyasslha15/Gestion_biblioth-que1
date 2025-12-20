/****************************************
 * Gestion utilisateur
 ****************************************/
let currentUser = JSON.parse(localStorage.getItem("currentUser"));//récupérer l'utilisateur connecté
if(!currentUser) window.location.href = "../html/login.html";//rediriger si pas connecté
document.getElementById("role").innerText = currentUser.email;//afficher l'email de l'utilisateur connecté

// Déconnexion
document.getElementById("deco").addEventListener("click", () => {//ajout gestion de deconexion
    localStorage.removeItem("currentUser");//supprimer l'utilisateur connecté
    window.location.href = "../html/login.html";//rediriger vers la page de login
}); // gestion de deconexion

/****************************************
 * Traduction FR/EN
 ****************************************/
let currentLang = 'fr';//langue par défaut
const langSelector = document.getElementById("langSelector");//sélecteur de langue
langSelector.addEventListener("change", () => {//écouteur d'événement pour le changement de langue
    currentLang = langSelector.value;//mettre à jour la langue courante
    translatePage();//traduire la page
});

function translatePage() {
    // Navbar & Sidebar
    document.querySelectorAll("[data-fr]").forEach(el => {//sélectionner tous les éléments avec les attributs data-fr et data-en
        const fr = el.getAttribute("data-fr");//récupérer le texte en français
        const en = el.getAttribute("data-en");//récupérer le texte en anglais
        el.innerText = currentLang === "fr" ? fr : en;//mettre à jour le texte en fonction de la langue courante
    });

    // Placeholder
    document.getElementById("searchTitle").placeholder = currentLang === "fr" ? "Email du client" : "Client email";//mettre à jour le placeholder du champ de recherche
}
translatePage();

/****************************************
 * Chargement des commandes
 ****************************************/
let orders = JSON.parse(localStorage.getItem("orders")) || []; //on récupère la liste des commandes
const tbody = document.querySelector("#table2 tbody"); //le tbody ou on va afficher les commandes

function AllOrders(userEmail) {
    tbody.innerHTML = '';
    orders.forEach(order => { //on parcourt la list des livres
        if (!userEmail || order.user === userEmail) {
            order.items.forEach(item => {//
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
        }
    });
}

/****************************************
 * Export d’une commande
 ****************************************/
function Export_Comm(id) {
    // Séparer l'email (dernier mot) et le titre (tout le reste)
    const parts = id.split(" ");
    const email = parts.pop();          // dernier mot = email
    const title = parts.join(" ");      // le reste = titre

    // Récupérer les données depuis localStorage
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

    // Créer le fichier en mémoire et lancer le téléchargement
    const blob = new Blob([text], { type: "text/plain" });//créer un blob avec le contenu texte
    const url = URL.createObjectURL(blob);//créer une URL pour le blob

    const a = document.createElement("a");//créer un élément <a>
    a.href = url;//définir l'URL du blob comme href
    a.download = `${client.email}.txt`;//définir le nom du fichier à télécharger
    a.click();//simuler un clic pour lancer le téléchargement/l’utilisateur n’a pas besoin de cliquer lui-même.

    URL.revokeObjectURL(url); // libérer la mémoire
}


/****************************************
 * Recherche par email
 ****************************************/
document.getElementById("searchTitle").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = e.target.value.trim();
        const found = orders.find(o => o.user === value);

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