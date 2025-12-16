//0 - INITIALISATION
let Panier_actuel = JSON.parse(localStorage.getItem("currentOrder")) || [];//on récupère le panier
let books = JSON.parse(localStorage.getItem("books")) || []; // on récupère le tableau des livres
let user = JSON.parse(localStorage.getItem("currentUser")); // on récupère l'utilisateur

if(!user){
    window.location.href = "../html/login.html"; // si il n'existe pas on le rederige vers la page de login
}
if(user.role==="admin")
{
  document.getElementById("comma").href="../html/list_comm_admin.html";
}
document.getElementById("role").innerHTML=user.email;
const tbody = document.querySelector("#table2 tbody"); // on récupère le tbody ou on va insérer les tr
const selecteur_type = document.getElementById("typeFilter"); // on récupère le selecteur de type

 // 1 - AFFICHAGE DES LIVRES
function afficher_livres(list = books){ //si on donne rien comme argument il prend par défaut list = books(liste des livres)
    tbody.innerHTML = ""; // on met le contenu du tbody comme vide ""

    list.forEach(elm => { // on parcourt la liste des livres passer comme paramètre
        let tr = document.createElement("tr"); //on creer le tr ou on va insere les 4td après

        let td1 = document.createElement("td"); // le td1
        let td2 = document.createElement("td"); // le td2
        let td4 = document.createElement("td"); // le td3
        let td3 = document.createElement("td"); // le td4
 
        td1.innerHTML = elm.title;  /*Le td1 va contenir le titre du livre , le type et le prix*/
        td2.innerHTML = elm.type;
        td4.innerHTML = elm.prix + "$";

        /* Creation du boutton delete */
        let but = document.createElement("button");
        but.innerHTML = "Supprimer";
        but.id = elm.title + " delete";
        but.className = "btn btn-danger me-1";
        but.setAttribute("data-fr","Supprimer"); 
        but.setAttribute("data-en","Delete");

        /* Creation du boutton détail */
        let but2 = document.createElement("button");
        but2.innerHTML = "Détails";
        but2.id = elm.title + " detail";
        but2.className = "btn btn-success";
        but2.setAttribute("data-fr","Détails");
        but2.setAttribute("data-en","Details");

        /* si ce n'est pas admin on ajoute le boutton ajouter commande */
        if(user.role === "user"){
            let but3 = document.createElement("button");
            but3.innerHTML = "Ajouter books la commande";
            but3.className = "btn btn-success";
            but3.style.backgroundColor = "blue";
            but3.style.color = "white";
            but3.dataset.title = elm.title;
            but3.setAttribute("data-fr","Ajouter à la commande");
            but3.setAttribute("data-en","Add to order");

            // si il tape ajouter commande ceci sera réalisé
            but3.addEventListener("click", () => {
                let exists = Panier_actuel.some(i => i.title === elm.title); //on vérifie d'abord si le livre n'existe pas dans le panier
                if(exists){
                    alert(elm.title + " est déjà dans la commande !");
                    return; //si il  existe on ne termine pas 
                }
              //Même si la boucle continue et crée d’autres boutons, chaque bouton sait quel elm il représente.

                Panier_actuel.push({ /*On ajouter le nouvelle livre au panier*/
                    title: elm.title,
                    price: elm.prix
                }); 

                localStorage.setItem("currentOrder", JSON.stringify(Panier_actuel));//on stock le nv panier dans le local
                alert(elm.title + " ajouté à la commande !");
            });

            td3.appendChild(but3); // on ajoute le boutton ajouter commande books td3
        }

        if(user.role === "admin"){
            td3.appendChild(but); //on ajoute le boutton delete pour supprimer le livre si c'est admin books td3
        }

        td3.appendChild(but2); // on ajoute le boutton détail books td3

        tr.appendChild(td1); /*Ici on ajoute les td aux tr*/
        tr.appendChild(td2);
        tr.appendChild(td4);
        tr.appendChild(td3);

        tbody.appendChild(tr); // books la fin on ajoute le tr books tbody
    });
}

afficher_livres(); //pour le premier affichage on appelle la donction afficher_livres()

 //2 - DELETE ET DETAIL
document.getElementById("liste").addEventListener("click", (event) => { //si on click sur div qui contient le tableau

    if(event.target.id.slice(-6) === "delete"){ // event.target.id = titre_livre delete avec slice on obtient delete
        let title = event.target.id.slice(0,-7); // on prend selement la partie du titre_livre avec slice 0,-7
        books = books.filter(b => b.title !== title); // on parcourt la liste des livres et on consèrve selement ceux avec titre != titre_livre
        localStorage.setItem("books", JSON.stringify(books)); // on stock la nouvelle liste des livres
        afficher_livres(); // on affiche le tableau des livres
    }

    if(event.target.id.slice(-6) === "detail"){ // sinon si le btn est détail
        let title = event.target.id.slice(0,-7);
        window.location.href = "../html/details_livre.html?title=" + title;//on passe dasn url le titre du livre vers page détails_livre.html
    }
});

 //3 - FILTRAGE PAR TITRE
let F_title = document.getElementById("searchTitle"); //on récupère l'input on user va saisir le titre

F_title.addEventListener("keydown", (e)=>{ //on entend les touches du clavier
    if(e.key === "Enter"){ // si il tape sur entrer
        let value = F_title.value.toLowerCase(); // on prend la valeur du F_title
        let res = books.filter(elm => elm.title.toLowerCase().includes(value));
        afficher_livres(res);// on passe books afficher_livres fonction de remplissage du tableau selement le livre avec li titre value
    }
});

 //4 - FILTRAGE PAR TYPE
selecteur_type.addEventListener("change", ()=>{ // si il change la val avec le selecteur du type
    if(selecteur_type.value === "all"){ // si il choisie tous
        afficher_livres(); // par défaut il va prendre books donc tout les livre
    }else{
        afficher_livres(books.filter(elm => elm.type === selecteur_type.value)); //sinon il cnserve selem les livres avec le type selecteur_type.value
    }
});


 //5 - VALIDATION COMMANDE
if(user.role === "user"){ // si il est user et pas admin
    let btn = document.createElement("button"); // on ajoute un nouvel élément au dessous du tableau valider commande
    btn.id = "validateOrder";
    btn.innerHTML = "Confirmer la commande";
    btn.className = "btn btn-success mt-3";
    btn.setAttribute("data-fr","Confirmer la commande");
    btn.setAttribute("data-en","Confirm order");

    document.getElementById("liste").appendChild(btn);// on l'ajouter au div qui contient le tableau

    btn.addEventListener("click", ()=>{ // evenement qui attend le click sur le boutton
        if(Panier_actuel.length === 0){ // si le panier est vide on afficher alert//
            alert("Votre panier est vide !");
            return;
        }
        //sinon on creer un commande contient email, le panier,total et la date en format ISO 
        let order = {
            user: user.email,
            items:Panier_actuel,
            total: Panier_actuel.reduce((s,i)=>s+Number(i.price),0),//accummulateur de somme des prix avec reduce
            date: new Date().toISOString()
        }; 

        let orders = JSON.parse(localStorage.getItem("orders")) || []; // on récupère le tableau des commande
        orders.push(order); // on ajoute la nv comm
        localStorage.setItem("orders", JSON.stringify(orders)); // et on reinitialise la liste des commande

        localStorage.removeItem("currentOrder");//on supprime le panier
        Panier_actuel = [];//et on vide le tableau qui contient les livres du panier

        alert("Commande validée !");
    });
}

/***********************
 * TRADUCTION
 ***********************/

document.getElementById("langSelector").addEventListener("change", function(){
    let lang = this.value; //c'est books dire la langue qu'on books choisit avec le selecteur
    document.querySelectorAll("[data-fr]").forEach(el=>{ //tous les éléments avec attribut data-fr
        el.textContent = el.getAttribute("data-"+lang); //selon la langue choisi on remplit e1
    });
    localStorage.setItem("lang",lang);
});

/***********************
 * DECONNEXION
 ***********************/
document.getElementById("deco").addEventListener("click", ()=>{
    localStorage.removeItem("currentUser");
    window.location.href = "../html/login.html";
});
