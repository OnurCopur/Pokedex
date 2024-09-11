async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");

    for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html");
      let resp = await fetch(file);
      if (resp.ok) {
        element.innerHTML = await resp.text();
      } else {
        element.innerHTML = "Page not found";
      }
    }
  }

  
let allPokemons = [];
let currentPokemon = 0;


let typeToClass = {
    fire: "type_fire", 
    grass: "type_grass", 
    water: "type_water", 
    bug: "type_bug", 
    normal: "type_normal",
    poison: "type_poison", 
    electric: "type_electric", 
    ground: "type_ground", 
    fairy: "type_fairy", 
    fighting: "type_fighting",
    psychic: "type_psychic", 
    rock: "type_rock", 
    ghost: "type_ghost", 
    ice: "type_ice", 
    dragon: "type_dragon", 
    dark: "type_dark",
    steel: "type_steel", 
    flying: "type_flying"
};


async function fetchPokemons() {
        let url = `https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`;
        let response = await fetch(url);
        let responseAsJson = await response.json();
        allPokemons = responseAsJson.results;
        console.log(allPokemons);
        currentPokemon = 19;
        displayPokemons(allPokemons);
}
fetchPokemons();


async function displayPokemons(pokemons) {
    let listWrapper = document.querySelector(".list-wrapper");
    listWrapper.innerHTML = "";
    let startIndex = Math.max(0, currentPokemon + 1); // Startindex basierend auf dem aktuellen Index aktualisieren

    for (let i = 0; i < 20; i++) {
        let listItem = document.createElement("div"); // listItem innerhalb der Schleife deklarieren
        listItem.className = "list-item";

        let { pokemonName, pokemonID, pokeElement1, pokeElement2 } = await assignments(i, listItem); // await assignments und Variablen erhalten
        listItem.innerHTML += generateHTML(pokemonName, pokemonID, pokeElement1, pokeElement2, i);

        listWrapper.appendChild(listItem);
        assignBackgroundColorForSecondType(pokeElement2, listItem, i);
    }}


// Hintergrundfarben entsprechend des ersten Pokémon-Typs zuweisen
function assignBackgroundColor(pokeElement1, listItem) {
    const cssClass = typeToClass[pokeElement1];
    if (cssClass) {
        listItem.classList.add(cssClass);
    }
}


// Hintergrundfarben entsprechend des zweiten Pokémon-Typs zuweisen
function assignBackgroundColorForSecondType(pokeElement2, listItem, i) {
    let typ2 = document.getElementById(`typ2_${i}`); // Ändern Sie dies, um den Index zu verwenden
    const cssClass = typeToClass[pokeElement2];
    if (cssClass) {
        typ2.classList.add(cssClass);
    }
}


// Search Pokemon 
function filterPokemons(input) {
    return allPokemons.filter(pokemon => pokemon.name.includes(input));
}


function displayFilteredPokemons(filteredPokemons) {
    let listWrapper = document.querySelector(".list-wrapper");
    listWrapper.innerHTML = "";

    filteredPokemons.forEach(async (pokemon, index) => {
        let listItem = document.createElement("div");
        listItem.className = "list-item";
        let { pokemonName, pokemonID, pokeElement1, pokeElement2 } = await assignments(allPokemons.indexOf(pokemon), listItem);
        listItem.innerHTML += generateHTML(pokemonName, pokemonID, pokeElement1, pokeElement2, index);

        listWrapper.appendChild(listItem);
        assignBackgroundColorForSecondType(pokeElement2, listItem, index);
    });
}


function searchFilter() {
    let input = document.getElementById("search-input").value.toLowerCase();

    if (input.length >= 3) {
        let filteredPokemons = filterPokemons(input);
        displayFilteredPokemons(filteredPokemons);
        document.getElementById("loadMore").style.display = "none"; // Verstecke den Load More Button, wenn gefilterte Pokémon vorhanden sind
    } else {
        displayPokemons(allPokemons);
        document.getElementById("loadMore").style.display = "block";    // Zeige den Load More Button, wenn keine gefilterten Pokémon vorhanden sind
    }
}
//


async function loadMorePokemons() {
    const startIndex = currentPokemon + 1;
    const endIndex = Math.min(startIndex + 19, allPokemons.length - 1);

    for (let i = startIndex; i <= endIndex; i++) {
        let listItem = document.createElement("div");
        listItem.className = "list-item";

        let { pokemonName, pokemonID, pokeElement1, pokeElement2 } = await assignments(i, listItem);
        listItem.innerHTML += generateHTML(pokemonName, pokemonID, pokeElement1, pokeElement2, i);

        document.querySelector(".list-wrapper").appendChild(listItem);
        assignBackgroundColorForSecondType(pokeElement2, listItem, i);
    }
    currentPokemon = endIndex;
    toggleLoadMoreButtonVisibility();}


function toggleLoadMoreButtonVisibility() {
    if (currentPokemon === allPokemons.length - 1) {
        document.getElementById("loadMore").style.display = "none";
    }}


async function displayPokemonDetails(pokemon) {
    let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    let popupContent = document.getElementById("popupContent");
    let flavorTextUrl = pokemon['species']['url'];
    let response = await fetch(flavorTextUrl);
    let allFlavorTexts = await response.json();
    let flavorText = allFlavorTexts['flavor_text_entries'][10]['flavor_text'];
    
    const { backgroundColorClass, backgroundColorClassSecondType } = getPokemonTypeClasses(pokemon);
    const htmlContent = generatePokemonDetailsHTML(pokemonName, pokemon.id, pokemon.types, flavorText, backgroundColorClass, backgroundColorClassSecondType, pokemon.moves); // Übergeben Sie die Pokemon-Moves an die Generierungsfunktion
    popupContent.innerHTML = htmlContent;
    
    if (backgroundColorClassSecondType) {
        popupContent.querySelectorAll('.display-type-card')[1].classList.add(backgroundColorClassSecondType);
    }
    renderChart(pokemon);
    displayPopupWindow();
}


function getPokemonTypeClasses(pokemon) {
    const backgroundColorClass = typeToClass[pokemon.types[0].type.name];
    const backgroundColorClassSecondType = pokemon.types[1] ? typeToClass[pokemon.types[1].type.name] : null;
    return { backgroundColorClass, backgroundColorClassSecondType };
 }


function displayPopupWindow() {
    document.getElementById("pokemonPopup").style.display = "block";    // Popup-Fenster anzeigen
    document.getElementById("overlay").style.display = "block";         // Overlay anzeigen
    document.body.classList.add("popup-open");                          // Scrollen des Body deaktivieren
}


document.querySelector(".list-wrapper").addEventListener("click", function(event) {
    // Überprüfen, ob das geklickte Element ein Kind von '.list-item' ist
    if (event.target.closest('.list-item')) {
        const listItem = event.target.closest('.list-item');
        const index = Array.from(listItem.parentNode.children).indexOf(listItem);
        const selectedPokemon = allPokemons[index];
        
        currentPokemon = index; // Setzen des aktuellen Pokémons

        fetch(selectedPokemon.url)
            .then(response => response.json())
            .then(data => displayPokemonDetails(data)); // Details des ausgewählten Pokémon anzeigen
    }
});


// Schließen des Popup-Fensters beim Klicken außerhalb des Inhalts
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("overlay")) {
        document.getElementById("pokemonPopup").style.display = "none";
        document.getElementById("overlay").style.display = "none";

        // Scrollen des Body aktivieren
        document.body.classList.remove("popup-open");
    }
});


function displayPokemonMoves(moves) {
    let movesHTML = '';
    for (let i = 0; i < Math.min(moves.length, 20); i++) {
        movesHTML += `<p class="flavor-text">${moves[i].move.name}</p>`;
    }
    return movesHTML;
}


function nextPokemon() {
    // Überprüfen, ob es ein nächstes Pokémon gibt
    if (currentPokemon < allPokemons.length - 1) {
        // Erhöhen Sie den Wert von currentPokemon um 1
        currentPokemon++;
        
        // Rufen Sie displayPokemonDetails mit dem nächsten Pokémon auf
        fetch(allPokemons[currentPokemon].url)
            .then(response => response.json())
            .then(data => displayPokemonDetails(data));
    }
}


function previousPokemon() {
    // Überprüfen, ob es ein vorheriges Pokémon gibt
    if (currentPokemon > 0) {
        // Reduzieren Sie den Wert von currentPokemon um 1
        currentPokemon--;
        
        // Rufen Sie displayPokemonDetails mit dem vorherigen Pokémon auf
        fetch(allPokemons[currentPokemon].url)
            .then(response => response.json())
            .then(data => displayPokemonDetails(data));
    }
}