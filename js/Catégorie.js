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
let test = document.getElementById("test"); 
if(user.role==="admin"){
    test.href="../html/list_comm_admin.html";
}else{
    test.href="../html/liste_comm_client.html";
}
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
    container.innerHTML = "";//Vider le conteneur
    const cats = getCategories();//Récupérer les catégories

    if (cats.length === 0) {//Si aucune catégorie
        container.innerHTML = "<p>Aucune catégorie</p>";//Afficher un message
        return;
    }

    cats.forEach(cat => {//Pour chaque catégorie
        const col = document.createElement("div");//Créer une colonne
        col.className = "col-md-4";//Classe Bootstrap

        const card = document.createElement("div");//Créer une carte
        card.className = "card p-4 text-center shadow";//Classe Bootstrap

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
                if (!nv) return;//Si "" , ne touche rien
                books.forEach(b => {//Mettre à jour les livres
                    if (b.type === cat) b.type = nv;
                });
                saveBooks();
                afficherCategories();
                tbody.innerHTML = "";//Vider la liste des livres
                test1.style.display = "none";
                info.style.display = "none";
            };

            del.onclick = () => {//Supprimer la catégorie
                if (confirm("Supprimer cette catégorie ?")) {//Confirmer la suppression
                    books = books.filter(b => b.type !== cat);//Supprimer les livres de la catégorie
                    saveBooks();
                    afficherCategories();
                    tbody.innerHTML = "";
                }
            };

            zone.append(edit, del);//Ajouter les boutons à la zone
            card.appendChild(zone);//Ajouter la zone à la carte
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
    tbody.innerHTML = "";//Vider le conteneur des livres
    info.style.display = "table-row";//Afficher la ligne d'information des livres
    test1.style.display = "block";//Afficher le paragraphe d'information supplémentaire

    books.filter(b => b.type === cat).forEach(b => {//Pour chaque livre de la catégorie
        const tr = document.createElement("tr");//Créer une ligne
        tr.innerHTML = `
            <td>${b.title}</td>
            <td>${b.type}</td>
            <td>${b.prix}$</td>
        `;//Contenu de la ligne
        tbody.appendChild(tr);
    });
}

// ===============================
// Traduction
// ===============================
const selectLang = document.getElementById("select");//Sélecteur de langue
let currentLang = localStorage.getItem("lang") || "fr";//Langue courante

function applyTranslation(lang) {//Appliquer la traduction
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
