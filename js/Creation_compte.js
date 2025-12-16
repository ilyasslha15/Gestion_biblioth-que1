// -----------------------------
// 1 -  Initialisation des utilisateurs
// -----------------------------
let users = JSON.parse(localStorage.getItem("users"));
if (!users) {
    users = [
        { email: 'admin@app.com', password: 'admin123', role: 'admin' },
        { email: 'user@app.com', password: 'user123', role: 'user' }
    ];
    localStorage.setItem("users", JSON.stringify(users));
}

// -----------------------------
// 2 -  Tableau des traductions
// -----------------------------
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

// -----------------------------
// 3 -  Sélecteur de langue et fonction d'application
// -----------------------------
const lang = document.getElementById("langSelector");

function appliquerLangue(code) {
    const t = textes[code];
    document.getElementById("title").textContent = t.registerTitle;
    document.getElementById("firstname").placeholder = t.firstname;
    document.getElementById("lastname").placeholder = t.lastname;
    document.getElementById("email").placeholder = t.email;
    document.getElementById("password").placeholder = t.password;
    document.getElementById("confirmPassword").placeholder = t.confirmPassword;
    document.getElementById("btnSignIn").textContent = t.signInBtn;

    // Texte lien déjà un compte
    document.getElementById("loginText").childNodes[0].textContent = t.alreadyAccount + " ";
    document.getElementById("loginLink").textContent = t.loginHere;
}

// -----------------------------
// 4 -  Changement de langue par l'utilisateur
// -----------------------------
lang.addEventListener("change", () => {
    const choix = lang.value;
    appliquerLangue(choix);
    localStorage.setItem("lang", choix);
});

// -----------------------------
// 5 - Charger la langue sauvegardée
// -----------------------------
const savedLang = localStorage.getItem("lang") || "fr";
lang.value = savedLang;
appliquerLangue(savedLang);

// -----------------------------
// 6 - Gestion du formulaire
// -----------------------------
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = 'user';

    if (password === confirmPassword) {
        const newUser = { email, password, role };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // Redirection vers dashboard
        window.location.href = "../html/dashboard.html";
    } else {
        // Message d'erreur selon la langue
        errorMsg.textContent = textes[lang.value].error;
    }
});
