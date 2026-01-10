var langSelector = document.getElementById("langSelector");
langSelector.addEventListener("change", () => { // Quand l'utilisateur change la langue
    translate_page();
});

function translate_page(){
    var lang = langSelector.value;
    var elems = document.querySelectorAll('[data-fr]');
        elems.forEach((elem) => {
        var text = elem.getAttribute('data-' + lang);
        if (text) {
            elem.textContent = text;
        }
    });
     localStorage.setItem("lang", lang);
}
//langue dans localStorage
let savedlang = localStorage.getItem("lang")||"FR";
langSelector.value =  savedlang;
translate_page();


