// =============================
// 1 - Tableau des traductions
// =============================
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

// =============================
// 2 - Récupération des éléments HTML
// =============================
const langSelect = document.getElementById("lang");
const titleEl = document.getElementById("title");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const errorMsg = document.getElementById("errorMsg");
const loginForm = document.getElementById("loginForm");

// =============================
// 3 - Fonction pour appliquer la langue
// =============================
function appliquerLangue(code) {
    const t = textes[code];
    titleEl.textContent = t.title;
    emailEl.placeholder = t.email;
    passwordEl.placeholder = t.password;
    btnLogin.textContent = t.btnLogin;
    // Réinitialiser le message d'erreur à chaque changement de langue
    errorMsg.textContent = "";
}

// =============================
// 4 - Gestion du changement de langue par l'utilisateur
// =============================
langSelect.addEventListener("change", () => {
    const choix = langSelect.value;
    appliquerLangue(choix);
    localStorage.setItem("lang", choix); // mémoriser la langue
});

// =============================
// 5 - Appliquer la langue mémorisée au chargement
// =============================
const savedLang = localStorage.getItem("lang") || "fr";
langSelect.value = savedLang;
appliquerLangue(savedLang);

// =============================
// 6 - Vérification si un utilisateur est déjà connecté
// =============================
const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
    window.location.href = "../dashboard/dashboard.html";
}

// =============================
// 7 - Récupérer les utilisateurs enregistrés
// =============================
const users = JSON.parse(localStorage.getItem("users") || "[]");

// =============================
// 8 - Gestion du formulaire de connexion
// =============================
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Récupérer les valeurs saisies
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    // Vérifier si l'utilisateur existe
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Sauvegarder l'utilisateur courant et rediriger
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "../html/dashboard.html";
    } else {
        // Afficher le message d'erreur dans la langue sélectionnée
        errorMsg.textContent = textes[langSelect.value].error;
    }
});
