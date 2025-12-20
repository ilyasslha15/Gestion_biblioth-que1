

//Helper
function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(data) {
    localStorage.setItem("books", JSON.stringify(data));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

//Lister les Auteurs

if (window.location.pathname.includes("html") &&
    window.location.pathname.includes("liste_auteur.html")) {

    const tbody = document.getElementById("authorsTableBody");
    const searchInput = document.getElementById("searchInput");

    function getAuthorsFromBooks() {
        const books = getBooks();
        const authorsMap = {};

        books.forEach(b => {
            if (!authorsMap[b.author]) {
                authorsMap[b.author] = [];
            }
            authorsMap[b.author].push(b);
        });

        return authorsMap;
    }

    function displayAuthors() {
        const authorsMap = getAuthorsFromBooks();
        const searchValue = searchInput.value.toLowerCase();

        tbody.innerHTML = isAdmin() ? `<div class="mb-3">
        <a href="creation_auteur.html" class="btn btn-primary">
            ➕ Ajouter un auteur
        </a>
    </div>` : "";

        Object.keys(authorsMap)
            .filter(author =>
                author.toLowerCase().includes(searchValue)
            )
            .forEach(author => {
                tbody.innerHTML += `
                    <tr>
                        <td>
                            <a href="details_auteurs.html?author=${encodeURIComponent(author)}">
                                ${author}
                            </a>
                        </td>
                        <td>${authorsMap[author].length}</td>
                        <td>
                            ${isAdmin() ? `
                                <a href="modifier_auteur.html?author=${encodeURIComponent(author)}"
                                   class="btn btn-sm btn-warning">
                                   Modifier
                                </a>
                                <button class="btn btn-sm btn-danger"
                                    onclick="deleteAuthor('${author}')">
                                    Supprimer
                                </button>
                            ` : ``}
                        </td>
                    </tr>
                `;
            });
    };

    window.deleteAuthor = function (authorName) {
        if (!isAdmin()) {
            alert("Action réservée à l’admin");
            return;
        }

        if (confirm("Supprimer cet auteur et tous ses livres ?")) {
            const updated = getBooks().filter(b => b.author !== authorName);
            saveBooks(updated);
            displayAuthors();
        }
    };

    searchInput.addEventListener("input", displayAuthors);
    displayAuthors();
}

//Detail auteur

if (window.location.pathname.includes("html") &&
    window.location.pathname.includes("details_auteurs.html")) {

    const params = new URLSearchParams(window.location.search);
    const author = params.get("author");

    const books = getBooks().filter(b => b.author === author);

    document.getElementById("authorDetails").innerHTML = `
        <h3>${author}</h3>
        <ul>
            ${books.map(b => `
                <li>
                    <strong>${b.title}</strong> (${b.year}) -
                    ${b.type} - ${b.prix} dhs
                </li>
            `).join("")}
        </ul>
    `;
}

//modifier
if (window.location.pathname.includes("html") &&
    window.location.pathname.includes("modifier_auteur.html")) {

    if (!isAdmin()) {
        alert("Accès refusé");
        window.location.href = "liste_auteur.html";
    }

    const params = new URLSearchParams(window.location.search);
    const authorName = params.get("author");

    document.getElementById("authorName").value = authorName;

    document.getElementById("editAuthorForm").addEventListener("submit", e => {
        e.preventDefault();

        const newName = document.getElementById("authorName").value;

        const updatedBooks = getBooks().map(b =>
            b.author === authorName ? { ...b, author: newName } : b
        );

        saveBooks(updatedBooks);

        alert("Auteur modifié");
        window.location.href = "liste_auteur.html";
    });
}

//Creation - Auteur et livre 

if (window.location.pathname.includes("html") &&
    window.location.pathname.includes("creation_auteur.html")) {

    if (!isAdmin()) {
        alert("Accès refusé");
        window.location.href = "liste_auteur.html";
    }

    document.getElementById("authorForm").addEventListener("submit", e => {
        e.preventDefault();

        // Récupérer les valeurs du formulaire
        const author = document.getElementById("author").value.trim();
        const title = document.getElementById("title").value.trim();
        const year = Number(document.getElementById("year").value);
        const type = document.getElementById("type").value.trim();
        const price = Number(document.getElementById("price").value);

        // Validation
        if (!author || !title || year<1400 || year>2025 || !year || !type || price <= 0) {
            alert("Veuillez remplir tous les champs correctement");
            return;
        }

        // Ajouter le livre
        const books = getBooks();
        books.push({
            title: title,
            author: author,
            year: year,
            type: type,
            prix: price,
            available: true
        });
        saveBooks(books);

        alert("Auteur et livre créés !");
        window.location.href = "liste_auteur.html";
    });

}
