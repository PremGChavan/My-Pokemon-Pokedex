let limit = 20;
let offset = 0;

let pokemonDiv = document.querySelector(".pokemon-container");
let load = document.querySelector("#load");
let resetBtn = document.querySelector(".resetBtn");
let select = document.querySelector("#select-opt");
let filterBtn = document.querySelector("#filterBtn");
let userInput = document.querySelector("#search");

let loader = document.querySelector(".loader");
let count = 1;

const pokemonTypes = [
  { 
    type: 'grass',
    pokemon_type:[]
  },
  { type: 'fire' ,pokemon_type:[]},
  { type: 'water',pokemon_type:[] },
  { type: 'bug' ,pokemon_type:[]},
  { type: 'normal' ,pokemon_type:[]},
  { type: 'poison',pokemon_type:[] },
  { type: 'electric',pokemon_type:[]  },
  { type: 'ground',pokemon_type:[]  },
  { type: 'fairy',pokemon_type:[]  },
  { type: 'fighting',pokemon_type:[]  },
  { type: 'psychic',pokemon_type:[]  },
  { type: 'rock',pokemon_type:[]  },
  { type: 'ghost',pokemon_type:[]  },
  { type: 'ice',pokemon_type:[]  },
  { type: 'dark',pokemon_type:[]  },
  { type: 'dragon',pokemon_type:[]  }
];


window.addEventListener("load", async () => {
  loader.style.display = "block"
    const response = await fetchData(
      "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
    );
    loader.style.display = "none"
    displayPokemon(response);
});

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data)

  return data;
}

function appendPokemon(pokemonData) {
  pokemonData.forEach((pokemon) => {
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    const flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    // Front Side of Card
    const flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");

    const numberPara = document.createElement("p");
    numberPara.innerText = `#${pokemon.id}`;

    const img = document.createElement("img");
    img.src = pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default;
    img.id = `number_${pokemon.id}`;

    const name = document.createElement("span");
    name.innerText = pokemon.name;

    const typeName = document.createElement("span");
    typeName.innerText = pokemon.types[0].type.name;

    flipCardFront.append(numberPara, img, name, typeName);

    // Back Side of Card
    const flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    const backImg = document.createElement("img");
    backImg.src = pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default;

    const backHeading = document.createElement("span");
    backHeading.innerText = pokemon.name;

    const abilityPara = document.createElement("div");
    abilityPara.classList.add("ability");

    abilityPara.innerHTML = `
      <p><strong>Height: </strong>${pokemon.height} cm</p>
      <p><strong>Weight: </strong>${pokemon.weight} kg</p>
      ${pokemon.stats.map(stat => `<p class='stat'><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>`).join('')}
    `;

    //  Apply bg color based on type
    if (isPokemonTypeExists(typeName.innerText)) {
      flipCardBack.classList.add(typeName.innerText);
      flipCardFront.classList.add(typeName.innerText);
    }


    flipCardBack.append(backImg, backHeading, abilityPara);
    flipCardInner.append(flipCardFront, flipCardBack);
    flipCard.append(flipCardInner);
    pokemonDiv.append(flipCard);
  });
}



 async function displayPokemon(data) {
  if(!data) return;
  loader.style.display = "block"
 const promises = data.results.map(pokemon => fetchData(pokemon.url));
 const pokemonData = await Promise.all(promises);
 loader.style.display = "none"
 appendPokemon(pokemonData);
}

async function filterPokemonBySearch(data){
  const promises = data.map(pokemon => fetchData(pokemon.url));
  const pokemonData = await Promise.all(promises);
  display(pokemonData)
}

function isPokemonTypeExists(type) {
  return pokemonTypes.find((pokemon,index) => pokemon.type === type) !== undefined;
}

resetBtn.addEventListener("click", () => {
  window.location.reload();
});


userInput.addEventListener("input",async(event)=>{
   const keyword = event.target.value;
   const response = await fetchData("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset);
  //  console.log(response.results)
    const filterData = response.results.filter((pokemon)=>{
        return pokemon.name.includes(keyword);
    })
    filterPokemonBySearch(filterData)
})


filterBtn.addEventListener("click",async ()=>{
  pokemonDiv.innerHTML = "";

  const selectedOption = select.options[select.selectedIndex];
  const selectedValue = selectedOption.value;

  if (selectedOption === "type") {
    alert("Please select a type");
    return;
  }

  // Fetch pokemon by type
  loader.style.display = "block";
  const typeData = await fetchData(`https://pokeapi.co/api/v2/type/${selectedValue}`);
  loader.style.display = "none";

  // Extract pokemon URLs
  const filteredPokemonList = typeData.pokemon.slice(0,20).map((p) => p.pokemon);

  // Fetch pokemon data
  const promises = filteredPokemonList.map(p => fetchData(p.url));
  const pokemonData = await Promise.all(promises);

  // Display pokemon
  display(pokemonData);
})

load.addEventListener("click", async () => {
  offset += limit;

  const response = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  if (response) displayPokemon(response);
});


function display(pokemonData){

  pokemonDiv.innerHTML = ""
  pokemonData.forEach((pokemon,index)=>{
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");
    const flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    const flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");

    const numberPara = document.createElement("p");
    numberPara.innerText = `#${index+1}`;
    const img = document.createElement("img");
    img.src = pokemon.sprites.other.dream_world.front_default;
    img.setAttribute("id", `number_${pokemon.id}`);

    const name = document.createElement("span");
    name.innerText = pokemon.name;
    const typeName = document.createElement("span");
    typeName.innerText = pokemon.types[0].type.name;

    flipCardFront.append(numberPara, img, name, typeName);

    const flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    const backImg = document.createElement("img");
    backImg.src = pokemon.sprites.other.dream_world.front_default;
    const backHeading = document.createElement("span");
    backHeading.innerText = pokemon.name;

    const abilityPara = document.createElement("div");
    abilityPara.classList.add("ability");

    const height = document.createElement("p");
    height.innerHTML = "<strong>Height: </strong>" + pokemon.height + " cm";
    abilityPara.append(height);

    const weight = document.createElement("p");
    weight.innerHTML = "<strong>Weight: </strong>" + pokemon.weight + " kg";
    abilityPara.append(weight);

    pokemon.stats.forEach((stat) => {
      const para = document.createElement("p");
      para.classList.add("stat");
      para.innerHTML =
        "<strong>" + stat.stat.name + " : " + "</strong>" + stat.base_stat;

      abilityPara.append(para);
    });
    

    // this condition for storing type pokemon in array 
     if(count <= 207){
      const idx = pokemonTypes.findIndex(obj => obj.type === typeName.innerText);
      pokemonTypes[idx].pokemon_type.push(pokemon)
        count++;
     }
 
    // this condition for background color 
    if (isPokemonTypeExists(typeName.innerText)) {
      flipCardBack.classList.add(typeName.innerText);
      flipCardFront.classList.add(typeName.innerText);
    }

    flipCardBack.append(backImg, backHeading, abilityPara);

    flipCardInner.append(flipCardFront, flipCardBack);
    flipCard.append(flipCardInner);

    pokemonDiv.append(flipCard);
  })
}