// Traductions
const translations = {
    fr: {
        'myOrders': 'Mes Commandes',
        'orderNum': 'Commande #',
        'date': 'Date',
        'total': 'Total',
        'items': 'Articles',
        'noOrders': 'Vous n\'avez aucune commande.'
    },
    en: {
        'myOrders': 'My Orders',
        'orderNum': 'Order #',
        'date': 'Date',
        'total': 'Total',
        'items': 'Items',
        'noOrders': 'You have no orders.'
    }
};

// Obtenir la langue courante
function getCurrentLanguage() {
    return localStorage.getItem('lang') || 'fr';
}

// Traduire une clé
function translate(key) {
    let lang = getCurrentLanguage();
    return translations[lang][key] || key;
}

// Afficher les commandes de l'utilisateur
function displayUserOrders() {
    const user = JSON.parse(localStorage.getItem("currentUser"));//recuperer l'utilisateur connecté
    if(!user) return window.location.href="../login/login.html";//rediriger si pas connecté

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];//récupère toutes les commandes
    const userOrders = allOrders.filter(order => order.user === user.email);//filtre les commandes de l'utilisateur connecté

    const ordersContainer = document.getElementById("ordersContainer");//container pour afficher les commandes
    if(userOrders.length === 0) {//si aucune commande
        ordersContainer.innerHTML = `<p>${translate('noOrders')}</p>`;//afficher message si aucune commande
        return;
    }

    let ordersHTML = `<h3>${translate('myOrders')}</h3>`;//titre des commandes
    userOrders.forEach((order, index) => {//parcourir chaque commande
        const orderDate = new Date(order.date).toLocaleString(//creer une date lisible
            getCurrentLanguage() === 'fr' ? 'fr-FR' : 'en-US'
        );

        ordersHTML += `
            <div class="order-card">
                <h4>${translate('orderNum')}${index + 1}</h4>
                <p><strong>${translate('date')}:</strong> ${orderDate}</p>
                <p><strong>${translate('total')}:</strong> ${order.total.toFixed(2)} $</p>
                <h5>${translate('items')}:</h5>
                <ul>
        `;

        order.items.forEach(item => {//parcourir chaque article de la commande
            ordersHTML += `<li>${item.title} - ${item.price} $</li>`;//afficher le titre et le prix de chaque article
        });

        ordersHTML += `</ul></div>`;
    });

    ordersContainer.innerHTML = ordersHTML;
}

// Changer la langue
function changeLanguage(lang) {
    localStorage.setItem('lang', lang);
    displayUserOrders();
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {//quand le document est chargé
    const langSelector = document.getElementById('langSelector');//sélecteur de langue
    const savedLang = getCurrentLanguage();//récupérer la langue sauvegardée
    langSelector.value = savedLang;

    langSelector.addEventListener('change', function() {
        changeLanguage(this.value);
    });

    displayUserOrders();
});
