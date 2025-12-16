/****************************************
 * Gestion utilisateur
 ****************************************/
let currentUser = JSON.parse(localStorage.getItem("currentUser")); // on récupère user actuel
if(!currentUser) window.location.href = "../html/login.html"; // si il n'ya pas redirection vers login.html
document.getElementById("role").innerText = currentUser.email; //email de user

// Déconnexion
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
}); // gestion de deconexion

/****************************************
 * Traduction FR/EN
 ****************************************/
let currentLang = 'fr';
const langSelector = document.getElementById("langSelector");
langSelector.addEventListener("change", () => {
    currentLang = langSelector.value;
    translatePage();
});

function translatePage() {
    // Navbar & Sidebar
    document.querySelectorAll("[data-fr]").forEach(el => {
        const fr = el.getAttribute("data-fr");
        const en = el.getAttribute("data-en");
        el.innerText = currentLang === "fr" ? fr : en;
    });

    // Placeholder
    document.getElementById("searchTitle").placeholder = currentLang === "fr" ? "Email du client" : "Client email";
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
        }
    });
}

/****************************************
 * Export d’une commande
 ****************************************/
function Export_Comm(id) {
    const [title, email] = id.split(" ");
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const book = books.find(b => b.title === title);
    const client = users.find(u => u.email === email);

    const text = `Client informations:
email : ${client.email}
role : ${client.role}

Book informations:
Book title : ${book.title}
Author : ${book.author}
Year : ${book.year}
Type : ${book.type}
Prix : ${book.prix}`;

    const blob = new Blob([text], { type: "text/plain" }); //Blob crée un fichier en mémoire avec le contenu text.
    const url = URL.createObjectURL(blob); //URL.createObjectURL permet de générer un lien vers ce fichier.

    const a = document.createElement("a"); //On crée un <a> dynamique pour lancer le téléchargement.
    a.href = url;
    a.download = `${client.email}.txt`;
    a.click();

    URL.revokeObjectURL(url); //URL.revokeObjectURL libère la mémoire après téléchargement.
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