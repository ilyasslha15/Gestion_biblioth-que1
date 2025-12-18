function getauthor(){
    return JSON.parse(localStorage.getItem("Author")) || [];
}
function getUserRole(){
    return JSON.parse(localStorage.getItem("currentUser")).role;
}

if(window.location.pathname.includes("liste_auteur.html")){

    const tbody = document.getElementById("authorTableBody")
    const searchInput = document.getElementById("searchInput");

    function displayAuthors(){

        const authors = getauthor();
         const userRole = getUserRole();
        const searchValue = searchInput.toLowerCase();
       
        tbody.innerHTML = "";

        authors
            .filter( a =>
                a.fullname.toLowerCase().includes(searchValue) ||
                a.lastname.toLowerCase().includes(searchValue) ||
                a.dateBirth.include(searchValue)
            )
            .forEach( a => {
                tbody.innerHTML += `
                <tr>
                    <td>${a.fullname}</td>    
                    <td>${a.lastname}</td>    
                    <td>${a.dateBirth}</td>    
                </tr>
                if(userRole==="admin")
                {
                <td>
                    <a href="edit_author.html?=${a.id}" class= "btn-sm btn-warning">Modifier</a>
                    <button class="btn btn-sm btn-danger" onclick="deleteAuthor(${a.id})">Supprimer</button>
                </td>
                }
            `;    
            });
    }
    searchInput.addEventListener("input",displayAuthors);

    window.deleteAuthor = function (id){
        if(confirm("Voulez-vous supprimer cet autheur ?")){
            const update = getauthor().filter(a => a.id !== id);
            saveAuthors(update);
            displayAuthors();
        }
    };

    displayAuthors();
}