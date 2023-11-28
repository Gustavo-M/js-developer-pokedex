const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="selectPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function selectPokemon(id) {
    pokeApi.selectPokemon(id).then((pokeList) => {
        pokeModal(pokeList)
        console.log(pokeList)
    })
}

const pokeModal = (pokeList) => {
    const photo = pokeList.sprites.other.dream_world.front_default
    const typeName = pokeList.types.map((type) => type.type.name)
    const [type] = typeName
    const htmlModal = 
    `
        <div class="modal">
            <div id="modalDetailPokemon">
                <button class="closeBtn" onClick="closeModal()">Close</button>
                <li class="pokemon ${type}">
                    <span class="name">${pokeList.name}</span>
                    <span class="number">${pokeList.id}</span>
                    <div class="detail">
                        <ol class="types">
                            ${typeName.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                    </div>
                    <img class="pokeImage" src="${photo}" alt="buba">                
                    <div class="data">
                        <h4>Base Stats</h4>
                        <div class="pokeHab">
                            <div class="stat-desc">
                                ${pokeList.stats.map((hab) =>`<p class="${type}">${hab.stat.name}</p>`).join('')}
                            </div>
                            <div class="bar-inner">
                                ${pokeList.stats.map((base) =>`<p class="${type}">${base.base_stat}</p>`).join('')}
                            </div>
                        </div>
                        <div class="pokeStatus">
                            <div class="stat-bar">
                                <p>Weight: ${pokeList.weight}kg</p>
                                <p>Height: ${pokeList.height}m</p>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
        </div>
    `
    pokemonList.innerHTML = htmlModal + pokemonList.innerHTML
}

const closeModal = () =>{
    const modal = document.querySelector('.modal')
    modal.parentElement.removeChild(modal)
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})