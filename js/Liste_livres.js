// 0 - INITIALISATION
let Panier_actuel = JSON.parse(localStorage.getItem("currentOrder")) || [];
let books = JSON.parse(localStorage.getItem("books")) || [];
let user = JSON.parse(localStorage.getItem("currentUser"));
let orders = JSON.parse(localStorage.getItem("orders")) || [];

let tab_type = [...new Set(books.map(b => b.type))];// Récupérer les types uniques des livres sans répétition
let selecteur = document.getElementById("typeFilter");// Sélecteur de type

tab_type.forEach(type => {// Ajouter les options de type au sélecteur
    let option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    selecteur.appendChild(option);
}); 

if(!user) {
    window.location.href = "../html/login.html";
}

if (user.role === "admin") {
    document.getElementById("comma").href = "../html/list_comm_admin.html";
}

document.getElementById("role").innerHTML = user.email;

const tbody = document.querySelector("#table2 tbody");
const selecteur_type = document.getElementById("typeFilter");

//  Fonction pour vérifier si un livre est déjà emprunté
function isBookBorrowed(title) {
    return orders.some(o =>
        o.status === "active" &&
        o.items.some(i => i.title === title)
    );
}

// 1 - AFFICHAGE DES LIVRES
function afficher_livres(list = books) {
    tbody.innerHTML = "";

    list.forEach(elm => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td4 = document.createElement("td");
        let td3 = document.createElement("td");

        td1.innerHTML = elm.title;
        td2.innerHTML = elm.type + (isBookBorrowed(elm.title) ? " ❌ Indisponible" : "");
        td4.innerHTML = elm.prix + "$";

        // Bouton delete
        let but = document.createElement("button");
        but.innerHTML = "Supprimer";
        but.id = elm.title + " delete";
        but.className = "btn btn-danger me-1";
        but.setAttribute("data-fr", "Supprimer");
        but.setAttribute("data-en", "Delete");

        // Bouton détail
        let but2 = document.createElement("button");
        but2.innerHTML = "Détails";
        but2.id = elm.title + " detail";
        but2.className = "btn btn-success";
        but2.setAttribute("data-fr", "Détails");
        but2.setAttribute("data-en", "Details");

        // Bouton ajouter au panier pour user
        if (user.role === "user") {
            let but3 = document.createElement("button");
            but3.innerHTML = "Ajouter au panier";
            but3.className = "btn btn-success";
            but3.style.backgroundColor = "blue";
            but3.style.color = "white";
            but3.setAttribute("data-fr", "Ajouter à la commande");
            but3.setAttribute("data-en", "Add to order");

            but3.addEventListener("click", () => {
                // Vérifier si déjà dans le panier
                if (Panier_actuel.some(i => i.title === elm.title)) {
                    alert(elm.title + " est déjà dans le panier !");
                    return;
                }

                // Vérifier si déjà emprunté
                if (isBookBorrowed(elm.title)) {
                    alert(elm.title + " n'est pas disponible pour le moment !");
                    return;
                }

                // Ajouter au panier
                Panier_actuel.push({
                    title: elm.title,
                    price: elm.prix
                });

                localStorage.setItem("currentOrder", JSON.stringify(Panier_actuel));
                alert(elm.title + " ajouté au panier !");
            });

            td3.appendChild(but3);
        }

        // Admin : bouton supprimer
        if (user.role === "admin") {
            td3.appendChild(but);
        }

        td3.appendChild(but2);//détails

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td4);
        tr.appendChild(td3);

        tbody.appendChild(tr);
    });
}

afficher_livres();

// 2 - DELETE ET DETAIL
document.getElementById("liste").addEventListener("click", (event) => {
    if (event.target.id.slice(-6) === "delete") {
        let title = event.target.id.slice(0, -7);
        books = books.filter(b => b.title !== title);
        localStorage.setItem("books", JSON.stringify(books));
        afficher_livres();
    }

    if (event.target.id.slice(-6) === "detail") {
        let title = event.target.id.slice(0, -7);
        window.location.href = "../html/details_livre.html?title=" + title;
    }
});

// 3 - FILTRAGE PAR TITRE
let F_title = document.getElementById("searchTitle");
F_title.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let value = F_title.value.toLowerCase();
        let res = books.filter(elm => elm.title.toLowerCase().includes(value));
        afficher_livres(res);
    }
});

// 4 - FILTRAGE PAR TYPE
selecteur_type.addEventListener("change", () => {
    if (selecteur_type.value === "all") {
        afficher_livres();
    } else {
        afficher_livres(books.filter(elm => elm.type === selecteur_type.value));
    }
});

// 5 - VALIDATION COMMANDE
if (user.role === "user") {
    let btn = document.createElement("button");
    btn.id = "validateOrder";
    btn.innerHTML = "Confirmer la commande";
    btn.className = "btn btn-success mt-3";
    btn.setAttribute("data-fr", "Confirmer la commande");
    btn.setAttribute("data-en", "Confirm order");

    document.getElementById("liste").appendChild(btn);

    btn.addEventListener("click", () => {
        if (Panier_actuel.length === 0) {
            alert("Votre panier est vide !");
            return;
        }


        // Ajouter la commande
        orders.push({
            user: user.email,
            items: Panier_actuel,
            total: Panier_actuel.reduce((s, i) => s + Number(i.price), 0),
            status: "active",
            date: new Date().toISOString()
        });

        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("currentOrder");
        Panier_actuel = [];

        afficher_livres(); // Mettre à jour l'affichage
        alert("Commande validée !");
    });
}

// 6 - TRADUCTION
function applyLanguage(lang) {

    //Textes normaux
    document.querySelectorAll("[data-fr]").forEach(el => {
        const value = el.getAttribute(`data-${lang}`);
        if (value) el.textContent = value;
    });

    //Placeholders (input, select, textarea)
    document.querySelectorAll("[data-fr-placeholder]").forEach(el => {
        const value = el.getAttribute(`data-${lang}-placeholder`);
        if (value) el.placeholder = value;
    });

    //Sauvegarde langue
    localStorage.setItem("lang", lang);
}
const langSelector = document.getElementById("langSelector");
let savedLang = localStorage.getItem("lang") || "fr";
langSelector.value = savedLang;
applyLanguage(savedLang);

langSelector.addEventListener("change", () => {
    applyLanguage(langSelector.value);
});


// 7 - DECONNEXION
document.getElementById("deco").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
});
