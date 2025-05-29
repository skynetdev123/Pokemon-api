const apiEndPoint = 'https://pokeapi.co/api/v2/pokemon';
const speciesAboutEndPoint = 'https://pokeapi.co/api/v2/pokemon-species';

const typesColor = {
    water: "#6493EB",
    grass: "#74CB48",
    fire: "#F57D31",
    bug: "#A7B723",
    dark: "#75574C",
    electric: "#F9CF30", 
    ghost: "#70559B",
    normal: "#AAA67F",
    poison: "#A43E9E",
    psychic: "#FB5584",
    steel: "#B7B9D0", 
    dragon: "#7037FF",
    fairy: "#E69EAC",
    fighting: "#C12239",
    flying: "#A891EC",
    ground: "#DEC16B",
    ice: "#9AD6DF",
    rock: "#B69E31"

}

const getRandomPokemonId = () => {
    return Math.floor(Math.random() * 898) + 1; // Generate a random Pokémon ID between 1 and 898 (total Pokémon count in the API)
};

const fetchPokemonData = async () => {
    const data = {
        id: "1",
        avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        name: "bulbasaur",
        types: [], 
        abilities: ["chlorophyll", "overgrow"],
        weight: "6.9 Kg",
        height: "0.7 m",
        about: "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
        stats: {
            hp: "045",
            atk: "049",
            def: "049",
            spd: "065"
        }
    };

    const id = getRandomPokemonId();

    try {
        // Fetch Pokémon data
        const pokemonResponse = await fetch(`${apiEndPoint}/${id}`);
        if (!pokemonResponse.ok) {
            throw new Error('Failed to fetch Pokémon data');
        }
   
        const pokemonDataResponse = await pokemonResponse.json();
       
        // Populate pokemonData object with Pokémon data
        data.id = pokemonDataResponse.id;
        data.name = pokemonDataResponse.name;
        data.avatar = pokemonDataResponse.sprites.other["official-artwork"].front_default;
        data.weight = pokemonDataResponse.weight;
        data.height = pokemonDataResponse.height;
        data.stats.hp = pokemonDataResponse.stats.find(stat => stat.stat.name === 'hp').base_stat;
        data.stats.atk = pokemonDataResponse.stats.find(stat => stat.stat.name === 'attack').base_stat;
        data.stats.def = pokemonDataResponse.stats.find(stat => stat.stat.name === 'defense').base_stat;
        data.stats.spd = pokemonDataResponse.stats.find(stat => stat.stat.name === 'speed').base_stat;

        

        // adding types 
        pokemonDataResponse.types.forEach(element => {
            data.types.push(element.type.name)
        });

        // adding ability 
       pokemonDataResponse.abilities.forEach((item) => {
        data.abilities.push(item.ability.name)
       })

        // Fetch Pokémon species data
        const speciesResponse = await fetch(`${speciesAboutEndPoint}/${id}`);
        if (!speciesResponse.ok) {
            throw new Error('Failed to fetch Pokémon species data');
        }
        const speciesDataResponse = await speciesResponse.json();

        // Populate pokemonData object with Pokémon species data (extract English flavor text)
        const englishFlavorText = speciesDataResponse.flavor_text_entries.find(entry => entry.language.name === 'en');
        if (englishFlavorText) {
            data.about = englishFlavorText.flavor_text;
        }

       
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
    
    return data
};

// if pokemon data is fetch successful render with pokemon data || render fail dom
function fetchAndRenderPokemondata() {
    fetchPokemonData()
    .then(pokemonData => {

        // get the color types 
        let color = ""
        for (const key in typesColor) {
            if(key === pokemonData.types[0]) {
                color = typesColor[key]
                
            }
        }

        // set bg color
        document.getElementById('main').classList.add(`bg-[${color}]`)

        //  set pokemon name 
        document.getElementById("pokemonName").textContent = pokemonData.name[0].toUpperCase() + pokemonData.name.substring(1)

        // set pokemon id
        document.getElementById("pokemonId").textContent = "#0"+ pokemonData.id

        // set pokemon avatar 
        document.getElementById("pokemonAvatar").src = pokemonData.avatar

        // set pokemon types 
        const types = document.getElementById("pokemonType")
        types.innerHTML = ""
        pokemonData.types.forEach(type => {
            const pElement = document.createElement('p')
            pElement.textContent = type
            pElement.className = 'rounded-2xl px-3 py-1 font-bold'
            
            // Check if the type has a corresponding color in typesColor object
            if (typesColor[type]) {
                
                pElement.classList.add(`bg-[${typesColor[type]}]`); // Add the color class
            } else {
                pElement.classList.add('bg-[#AAA67F]'); // Add default normal color
            }
            types.appendChild(pElement) 
        })

        // change about color text
        document.getElementById("about").classList.add(`text-[${color}]`)
         
        
       


        // set pokemon weight
        document.getElementById("pokemonWeight").textContent = pokemonData.weight

        // set height 
        document.getElementById("pokemonHeight").textContent = pokemonData.height 

        // set moves ability 
        const abilities = document.getElementById("pokemonMoves")
        abilities.innerHTML = ""
        pokemonData.abilities.forEach((ability) => {
            const abilityElement = document.createElement("p")
            abilityElement.textContent = ability[0].toUpperCase() + ability.substring(1)
            abilities.appendChild(abilityElement)
            
        })
        // change state color 
        document.getElementById("pokemonStat").classList.add(`text-[${color}]`)

        // set about
        document.getElementById("pokemonAbout").textContent = pokemonData.about

        // set stat field color 
        document.getElementById("pokemonStatField").classList.add(`text-[${color}]`)
     

        // set stats
        document.getElementById("pokemonHp").textContent = pokemonData.stats.hp
        document.getElementById("hpStat").className = `w-[${pokemonData.stats.hp}px] h-1  bg-[${color}] rounded-l`
       
        document.getElementById("pokemonAtk").textContent = pokemonData.stats.atk 
        document.getElementById("atkStat").className = `w-[${pokemonData.stats.atk}px] h-1  bg-[${color}] rounded-l`
       
        document.getElementById("pokemonDef").textContent = pokemonData.stats.def 
        document.getElementById("defStat").className = `w-[${pokemonData.stats.def}px] h-1   bg-[${color}] rounded-l`
       
        document.getElementById("pokemonSpd").textContent = pokemonData.stats.spd
        document.getElementById("spdStat").className = `w-[${pokemonData.stats.spd}px] h-1  bg-[${color}] rounded-l`


    })
    .catch(error => {
        console.error("Error fetching Pokemon data", error)
    })

}

// initially set any random 
fetchAndRenderPokemondata()
