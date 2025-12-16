var langSelector = document.getElementById('langSelector');

  langSelector.addEventListener("change",()=>{
    var lang = langSelector.value; // "fr" ou "en"
    var elems = document.querySelectorAll('[data-fr]'); //on sélétione tous les éléments HTML qui ont l’attribut data-fr.
    for (var i = 0; i < elems.length; i++) {
      var text = elems[i].getAttribute('data-' + lang);//récupérer le texte dans l’attribut data-fr ou data-en selon la langue choisie.
      if (text) {
        elems[i].textContent = text;
      }
    }
    localStorage.setItem("lang",lang);
  });