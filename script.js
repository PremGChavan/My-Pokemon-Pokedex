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

 async function displayPokemon(data) {
  loader.style.display = "block"
 const promises = data.results.map(pokemon => fetchData(pokemon.url));
 const pokemonData = await Promise.all(promises);

 loader.style.display = "none"
 display(pokemonData)
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


filterBtn.addEventListener("click",()=>{
  pokemonDiv.innerHTML = "";

  const selectedOption = select.options[select.selectedIndex];
  const selectedValue = selectedOption.value;
   
  if(selectedValue === 'type'){
    alert("please select some type !!");
    window.location.reload();
    return;
     
  }
  const idx = pokemonTypes.findIndex(obj=>obj.type.includes(selectedValue));
  const typeArray = pokemonTypes[idx].pokemon_type;

  // console.log(typeArray)
  display(typeArray);
})


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