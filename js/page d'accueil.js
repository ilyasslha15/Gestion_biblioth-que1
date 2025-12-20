// ===== Gestion du changement de langue =====
var langSelector = document.getElementById('langSelector');

// Quand l'utilisateur change la langue
langSelector.addEventListener("change", () => {
    var lang = langSelector.value; // "fr" ou "en"

    // Sélectionner tous les éléments ayant l'attribut data-fr (ou data-en)
    var elems = document.querySelectorAll('[data-fr]');

    // Mettre à jour le texte de chaque élément selon la langue choisie
    elems.forEach((elem) => {
        var text = elem.getAttribute('data-' + lang);
        if (text) {
            elem.textContent = text;
        }
    });

    // Sauvegarder la langue choisie dans le localStorage
    localStorage.setItem("lang", lang);
});

// ===== Initialisation au chargement =====
window.addEventListener('DOMContentLoaded', () => {//quand le contenu du DOM est chargé
    var savedLang = localStorage.getItem("lang");
    if (savedLang) {
        langSelector.value = savedLang;
        langSelector.dispatchEvent(new Event('change'));// Déclenche le changement de langue
    }
});
