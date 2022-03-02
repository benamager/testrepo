/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  Section: Browser
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

let browserButtons = document.querySelectorAll(".browser__upper i");

function getUrlParam(paramArg){
    let query = window.location.search;
    let param = new URLSearchParams(query);
    return param.get(paramArg);
}

offsetFunction();
function offsetFunction(){
    if (!getUrlParam("offset")){
        let url = new URL('https://' + window.location.host + '?offset=0');
        let params = new URLSearchParams(url.search);
        window.location.assign(window.location + "?" + params.toString());
    } else {
        fetchData("https://pokeapi.co/api/v2/pokemon?limit=8&offset=" + getUrlParam("offset"), getPokemonData)
    }
    if (getUrlParam("offset") == 0){
        browserButtons[0].style.opacity = "0.5";
    }
}

browserButtons.forEach(function(button){
    button.addEventListener("click", function(){
        browserButtons[0].style.opacity = "1";
        let offsetValue = getUrlParam("offset");
        if (this.id == "browserLeftBtn"){
            if (offsetValue >= 8){
                offsetValue = parseInt(offsetValue) - 8;
                if (offsetValue == 0){
                    browserButtons[0].style.opacity = "0.5";
                }
            } else {
                if (offsetValue == 0){
                    browserButtons[0].style.opacity = "0.5";
                }
                return;
            }
        } else {
            if (offsetValue >= 0){
                offsetValue = parseInt(offsetValue) + 8;
            }
        }
        let url = new URL('https://' + window.location.host + '?offset=' + offsetValue);
        let params = new URLSearchParams(url.search);

        const nextURL = '?offset=' + offsetValue;
        const nextTitle = 'Document';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.pushState(nextState, nextTitle, nextURL);

        fetchData("https://pokeapi.co/api/v2/pokemon?limit=8&offset=" + offsetValue, getPokemonData)

    })
})


/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  Section: Fetch data
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

function fetchData(url, execute){
    fetch(url)
    //guard-clause (checks status)
    .then(function(response){
        //checks status (if 200 == not good)
        if (response.status !== 200){
            //stops execution
            console.log("NÆHÆH!")
            return [];
        }
        //converts response > json
        return response.json();
    })
    .then(function(data){
        execute(data)
    })
}

/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  Section: Print pokemons
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

let pokemonBrowserContainer = document.getElementsByClassName("browser__browser")[0];

//gets the pokedata for single pokemon
function getPokemonData(data){
    pokemonBrowserContainer.innerHTML = "";
    data.results.forEach(function(pokemon){
        fetchData(pokemon.url, printPokemon)
    })
}

//prints the pokedata
function printPokemon(data){

    // let abilities = [];
    // data.abilities.forEach(function(ability){
    //     abilities.push([ability.ability.name, ability.ability.url])
    // })

    //<img class="pokemon__img" src="${data.sprites.other["official-artwork"].front_default}">


    //article
    let pokemonContainer = document.createElement("article");
    pokemonContainer.classList.add("pokemon");
    //strong
    let pokemonId = document.createElement("strong");
    pokemonId.classList.add("pokemon__id");
    pokemonId.appendChild(document.createTextNode("#" + data.id));
    pokemonContainer.appendChild(pokemonId)
    //img
    let pokemonImg = document.createElement("img");
    pokemonImg.src = "images/pokeball.png";
    pokemonImg.classList.add("pokemon__img")
    pokemonImg.classList.add("pokemon__img--loading")
    pokemonContainer.appendChild(pokemonImg)
    //pokemon name
    let pokemonName = document.createElement("p");
    pokemonName.classList.add("pokemon__name");
    pokemonName.appendChild(document.createTextNode(data.name));
    pokemonContainer.appendChild(pokemonName)

    //appending the pokemon
    pokemonBrowserContainer.appendChild(pokemonContainer);


    loadImage();
    async function loadImage(){

        const img = new Image();
        img.src = data.sprites.other["official-artwork"].front_default;

        img.onload = function(){

            pokemonImg.src = img.src;
            pokemonImg.classList.remove("pokemon__img--loading")
            pokemonImg.classList.add("pokemon__img")
        }
    }
}


window.onpopstate=function() {
  offsetFunction();
}