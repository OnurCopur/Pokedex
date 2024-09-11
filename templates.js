async function assignments(i, listItem) {
    let pokemon = allPokemons[i];
    let pokemonUrl = pokemon['url'];
    let response = await fetch(pokemonUrl);
    let allPokeJson = await response.json();
    let pokeElement1 = allPokeJson['types'][0]['type']['name'];
    let pokeElement2 = allPokeJson['types'][1] ? allPokeJson['types'][1]['type']['name'] : null; // Überprüfen, ob ein zweiter Typ vorhanden ist
    
    let pokemonID = pokemon.url.split("/")[6];
    let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Formatieren des Pokémon-Namens

    assignBackgroundColor(pokeElement1, listItem); // Hier wird die Hintergrundfarbe zugewiesen

    return { pokemonName, pokemonID, pokeElement1, pokeElement2, listItem }; // listItem zur Rückgabe hinzufügen
}


function generateHTML(pokemonName, pokemonID, pokeElement1, pokeElement2, i) {
    return `
    <div class="pokemon-container">
        <div class="header-wrap">
            <p class="name-font">${pokemonName}</p>
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="typImage">
            <div class="types">
                <div id="typ1_${i}" class="display_type">${pokeElement1}</div>
                ${pokeElement2 ? `<div id="typ2_${i}" class="display_type">${pokeElement2}</div>` : ''}
            </div>   
            <div class="img-wrap">
                <img class="pokemonImage" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemonName}"/>
            </div>
        </div>
    </div>   
`;
}


function generatePokemonDetailsHTML(pokemonName, pokemonID, pokemonTypes, flavorText, backgroundColorClass, backgroundColorClassSecondType, moves) {
    const typesHTML = pokemonTypes.map((type, index) => `<div id="typ${index + 1}_${index}" class="display-type-card">${type.type.name}</div>`).join('');
    const movesHTML = displayPokemonMoves(moves); // moves-HTML generieren

    return `
    <div class="pokemon-container-popUp ${backgroundColorClass}">
        <div class="header-wrap">
            <p class="name-font-popUp">${pokemonName}</p>
            <p class="caption-fonts-popUp">#${pokemonID}</p>
        </div>
        <div class="types-card">
            ${typesHTML}
        </div>
        <div class="img-wrap-card">
            <div class="featured-img">
                <a class="arrow left-arrow" id="leftArrow" onclick="previousPokemon()">
                    <img src="img/chevron_left.svg" alt="back" />
                </a>
                <div class="detail-img-wrapper">
                    <img class="pokemonImage-card" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemonName}"/>
                </div>
                <a class="arrow right-arrow" id="rightArrow" onclick="nextPokemon()">
                    <img src="img/chevron_right.svg" alt="forward" />
                </a>
            </div>
        </div>
    </div>    
    
    <div class="info-container">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">About</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Base Stats</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Moves</a>
            </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab"><p class="about">${flavorText}</p></div>
            <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab"><canvas id="myChart"></canvas></div>
            <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                <div class="moves">${movesHTML}</p></div>
            </div>
        </div>
    </div>
    `;
}