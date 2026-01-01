// =============================
// 1 - Initialisation des utilisateurs
// =============================
let users = JSON.parse(localStorage.getItem("users"));//récupérer users
if (!users) {
    users = [
        { email: 'admin@app.com', password: 'admin123', role: 'admin' },
        { email: 'user@app.com', password: 'user123', role: 'user' }
    ];
    localStorage.setItem("users", JSON.stringify(users));
}

// =============================
// 2 - Tableau des traductions
// =============================
const textes = {
    fr: {
        registerTitle: "Inscription à la Bibliothèque",
        firstname: "Nom",
        lastname: "Prénom",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        signInBtn: "S'Enregistrer",
        alreadyAccount: "Déjà un compte ?",
        loginHere: "cliquer ici",
        error: "Les mots de passes doivent être identiques"
    },
    en: {
        registerTitle: "Library Sign In",
        firstname: "First name",
        lastname: "Last name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        signInBtn: "Sign in",
        alreadyAccount: "Already have an account?",
        loginHere: "click here",
        error: "Passwords must be identical"
    }
};

// =============================
// 3 - Sélecteur de langue et fonction pour appliquer la langue
// =============================
const langSelect = document.getElementById("langSelector");

function appliquerLangue(code) {
    const t = textes[code];

    // Mise à jour des placeholders et titres
    document.getElementById("title").textContent = t.registerTitle;
    document.getElementById("firstname").placeholder = t.firstname;
    document.getElementById("lastname").placeholder = t.lastname;
    document.getElementById("email").placeholder = t.email;
    document.getElementById("password").placeholder = t.password;
    document.getElementById("confirmPassword").placeholder = t.confirmPassword;
    document.getElementById("btnSignIn").textContent = t.signInBtn;

    // Texte lien "Déjà un compte ?"
    document.getElementById("loginText").childNodes[0].textContent = t.alreadyAccount + " ";//<span></span>
    document.getElementById("loginLink").textContent = t.loginHere;

    // Réinitialiser le message d'erreur
    document.getElementById("errorMsg").textContent = "";
}

// =============================
// 4 - Changement de langue par l'utilisateur
// =============================
langSelect.addEventListener("change", () => {
    const choix = langSelect.value;
    appliquerLangue(choix);
    localStorage.setItem("lang", choix);
});

// =============================
// 5 - Charger la langue sauvegardée
// =============================
const savedLang = localStorage.getItem("lang") || "fr";
langSelect.value = savedLang;
appliquerLangue(savedLang);

// =============================
// 6 - Gestion du formulaire d'inscription
// =============================
const registerForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();//éviter de recharger la page

    // Récupérer les valeurs saisies
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = 'user';

    // Vérifier la correspondance des mots de passe
    if (password === confirmPassword) {
        const newUser = { email, password, role };

        // Ajouter le nouvel utilisateur et mettre à jour le localStorage
        users.push(newUser);//ajouter un nouveau user
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // Redirection vers le dashboard
        window.location.href = "../html/dashboard.html";
    } else {
        // Afficher le message d'erreur selon la langue
        errorMsg.textContent = textes[langSelect.value].error;
    }
});
