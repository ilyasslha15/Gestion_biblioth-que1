// ===============================
// Authentification
// ===============================
let user = JSON.parse(localStorage.getItem("currentUser"));//Récupérer l'utilisateur courant
if (!user) window.location.href = "../html/login.html";//Rediriger si pas connecté
document.getElementById("role").textContent = user.email;//Afficher l'email de l'utilisateur

// ===============================
// Données
// ===============================
let books = JSON.parse(localStorage.getItem("books")) || [];//Récupérer les livres
const container = document.querySelector("#res .row");//Conteneur des catégories
const tbody = document.querySelector("#table2 tbody");//Conteneur des livres
const info = document.getElementById("info");//Ligne d'information des livres
const test1 = document.getElementById("test1");//Paragraphe d'information supplémentaire

info.style.display = "none";//Cacher la ligne d'information des livres
test1.style.display = "none";//Cacher le paragraphe d'information supplémentaire


function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));//Sauvegarder les livres dans le localStorage
}

function getCategories() {
    return [...new Set(books.map(b => b.type))];//Récupérer les catégories uniques des livres
}

// ===============================
// Afficher catégories
// ===============================
function afficherCategories() {
    container.innerHTML = "";
    const cats = getCategories();

    if (cats.length === 0) {
        container.innerHTML = "<p>Aucune catégorie</p>";
        return;
    }

    cats.forEach(cat => {//Pour chaque catégorie
        const col = document.createElement("div");//Créer une colonne
        col.className = "col-md-4";

        const card = document.createElement("div");//Créer une carte
        card.className = "card p-4 text-center shadow";

        card.innerHTML = `
            <h4>${cat}</h4>
            <button class="btn btn-primary btn-sm mt-2"
                data-fr="Voir"
                data-en="View">Voir</button>
        `;//Contenu de la carte

        card.querySelector("button").onclick = () => afficherLivres(cat);//Afficher les livres de la catégorie au clic

        // ADMIN
        if (user.role === "admin") {//Si l'utilisateur est admin
            const zone = document.createElement("div");//Créer une zone pour les boutons
            zone.className = "d-flex justify-content-center gap-2 mt-3";

            const edit = document.createElement("button");//Bouton modifier
            edit.className = "btn btn-success btn-sm";
            edit.setAttribute("data-fr", "Modifier");
            edit.setAttribute("data-en", "Edit");
            edit.textContent = "Modifier";

            const del = document.createElement("button");//Bouton supprimer
            del.className = "btn btn-danger btn-sm";
            del.setAttribute("data-fr", "Supprimer");
            del.setAttribute("data-en", "Delete");
            del.textContent = "Supprimer";

            edit.onclick = () => {//Modifier la catégorie
                const nv = prompt("Nouveau nom :", cat);//Demander le nouveau nom
                if (!nv) return;//Si annuler, ne rien faire
                books.forEach(b => {//Mettre à jour les livres
                    if (b.type === cat) b.type = nv;
                });
                saveBooks();
                afficherCategories();
                tbody.innerHTML = "";//Vider la liste des livres
            };

            del.onclick = () => {//Supprimer la catégorie
                if (confirm("Supprimer cette catégorie ?")) {//Confirmer la suppression
                    books = books.filter(b => b.type !== cat);//Supprimer les livres de la catégorie
                    saveBooks();
                    afficherCategories();
                    tbody.innerHTML = "";
                }
            };

            zone.append(edit, del);
            card.appendChild(zone);
        }

        col.appendChild(card);//ajouter la carte à la colonne
        container.appendChild(col);//ajouter la colonne au conteneur
    });

    applyTranslation(currentLang);
}

// ===============================
// Afficher livres
// ===============================
function afficherLivres(cat) {
    tbody.innerHTML = "";
    info.style.display = "table-row";
    test1.style.display = "block";

    books.filter(b => b.type === cat).forEach(b => {//
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${b.title}</td>
            <td>${b.type}</td>
            <td>${b.prix}$</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===============================
// Traduction
// ===============================
const selectLang = document.getElementById("select");
let currentLang = localStorage.getItem("lang") || "fr";

function applyTranslation(lang) {
    document.querySelectorAll("[data-fr]").forEach(el => {
        el.textContent = el.getAttribute("data-" + lang);
    });
}

selectLang.value = currentLang;
applyTranslation(currentLang);

selectLang.onchange = () => {
    currentLang = selectLang.value;
    localStorage.setItem("lang", currentLang);
    applyTranslation(currentLang);
};

// ===============================
// Déconnexion
// ===============================
document.getElementById("deco").onclick = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
};

// ===============================
afficherCategories();
