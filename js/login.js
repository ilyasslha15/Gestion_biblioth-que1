// -----------------------------
// 1 -  Tableau des traductions
// -----------------------------
const textes = {
    fr: {
        title: "Connexion Bibliothèque",
        email: "Email",
        password: "Mot de passe",
        btnLogin: "Se connecter",
        error: "Email ou mot de passe incorrect"
    },
    en: {
        title: "Library Login",
        email: "Email",
        password: "Password",
        btnLogin: "Log in",
        error: "Incorrect email or password"
    }
};

// -----------------------------
// 2 -  Récupération du select de langue
// -----------------------------
const lang = document.getElementById("lang");

// -----------------------------
// 3 -  Fonction pour appliquer la langue
// -----------------------------
function appliquerLangue(code) {
    const t = textes[code]; // récupère l'objet correspondant à la langue
    document.getElementById("title").textContent = t.title;
    document.getElementById("email").placeholder = t.email;
    document.getElementById("password").placeholder = t.password;
    document.getElementById("btnLogin").textContent = t.btnLogin;
}

// -----------------------------
// 4 -  Changement de langue par l'utilisateur
// -----------------------------
lang.addEventListener("change", () => {
    const choix = lang.value;
    appliquerLangue(choix);
    localStorage.setItem("lang", choix); // mémoriser la langue
});

// -----------------------------
// 5 -  Appliquer la langue mémorisée au chargement
// -----------------------------
const savedLang = localStorage.getItem("lang") || "fr";
lang.value = savedLang;
appliquerLangue(savedLang);

// -----------------------------
// 6 -  Vérification si un utilisateur est déjà connecté
// -----------------------------
let currentUser = localStorage.getItem("currentUser");
if (currentUser) {
    window.location.href = "../dashboard/dashboard.html";
}

// -----------------------------
// 7 -  Récupérer les utilisateurs enregistrés
// -----------------------------
let users = JSON.parse(localStorage.getItem("users") || "[]");

// -----------------------------
// 8 -  Gestion du formulaire de connexion
// -----------------------------
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs saisies
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Vérifier si l'utilisateur existe
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Sauvegarder l'utilisateur courant et rediriger
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "../html/dashboard.html";
    } else {
        // Afficher le message d'erreur dans la langue sélectionnée
        const t = textes[lang.value];
        errorMsg.textContent = t.error;
    }
});
