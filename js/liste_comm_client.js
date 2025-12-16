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
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user) return window.location.href="../login/login.html";

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = allOrders.filter(order => order.user === user.email);

    const ordersContainer = document.getElementById("ordersContainer");
    if(userOrders.length === 0) {
        ordersContainer.innerHTML = `<p>${translate('noOrders')}</p>`;
        return;
    }

    let ordersHTML = `<h3>${translate('myOrders')}</h3>`;
    userOrders.forEach((order, index) => {
        const orderDate = new Date(order.date).toLocaleString(
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

        order.items.forEach(item => {
            ordersHTML += `<li>${item.title} - ${item.price} $</li>`;
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
document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('langSelector');
    const savedLang = getCurrentLanguage();
    langSelector.value = savedLang;

    langSelector.addEventListener('change', function() {
        changeLanguage(this.value);
    });

    displayUserOrders();
});
