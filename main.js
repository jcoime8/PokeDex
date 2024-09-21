/* Llamadas al html */
const boton = document.querySelector('#boton');
const labelBusPoke = document.querySelector('#busqueda');
const cardPo = document.querySelector('#contenedor')
const antes = document.querySelector('#previust')
const siguiente = document.querySelector('#next')
const select = document.querySelector('#tipoP')


/* tarer todos los poquemon de consolola */
let urlP = 'https://pokeapi.co/api/v2/pokemon';

const getPokemon = async (URL) => {
    let traerP = await fetch(URL);
    let jeisonTP = await traerP.json();
    return jeisonTP;
}

const BuscraNombre = async (nombre, url) => {
    let datosPokemon = await getPokemon(url);
    let resultadosPo = datosPokemon.results.filter(pokemon => pokemon.name.includes(nombre.toLowerCase()));
    return resultadosPo;
}

console.log(BuscraNombre('b', urlP))


const crearCard = async (imagen, nombre, experiencia) => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-4', 'mx-auto');

    const img = document.createElement('img');
    img.src = imagen;

    const body = document.createElement('div');
    body.classList.add('card-body', 'px-0');

    const nombrePok = document.createElement('p');
    nombrePok.textContent = `Name: ${nombre}`;

    const experienciaPok = document.createElement('p');
    experienciaPok.textContent = `EXP: ${experiencia}`;

    const botonInfo = document.createElement('button')
    botonInfo.classList.add('btn', 'btn-outline-success', 'mx-auto', 'text-center')
    botonInfo.textContent = 'Mas informacion'

    body.appendChild(nombrePok);
    body.appendChild(experienciaPok);
    body.appendChild(botonInfo)


    card.appendChild(img);
    card.appendChild(body);

    cardPo.appendChild(card);
}

const despliegueDeCard = async (url) => {
    const { results } = await getPokemon(url);

    results.forEach(async (pokemon) => {
        let { name, url } = pokemon;
        let traerInfoPok = await fetch(url);
        let { base_experience, sprites } = await traerInfoPok.json();
        let imageUrl = sprites.other['official-artwork']?.front_default ||
            other.home?.front_default ||
            other.dream_world?.front_default;
        crearCard(imageUrl, name, base_experience);
    });
}

const verificacionLink = async (URL) => {
    const { next, previous } = await getPokemon(URL)
    if (next == null) {
        siguiente.classList.add('disabled')
    } else {
        siguiente.classList.remove('disabled')
    }

    if (previous == null) {
        antes.classList.add('disabled')
    } else {
        antes.classList.remove('disabled')
    }
}

const buqueda = async (nombre) => {
    let linkbusqueda = 'https://pokeapi.co/api/v2/pokemon';
    let resultadosEncontrados = [];

    while (linkbusqueda !== null) {
        const pokeApi = await fetch(linkbusqueda);
        const { next, results } = await pokeApi.json();

        // Busca todos los Pokémon que coincidan con la cadena de búsqueda en esta página
        const resultadosPagina = await BuscraNombre(nombre, linkbusqueda);
        resultadosEncontrados = [...resultadosEncontrados, ...resultadosPagina];

        linkbusqueda = next;
    }

    console.log(resultadosEncontrados);

    if (resultadosEncontrados.length > 0) {
        cardPo.innerHTML = ''; 
        for (const pokemon of resultadosEncontrados) {
            const { name, url } = pokemon;
            const traerMasinfo = await fetch(url);
            const { sprites, base_experience } = await traerMasinfo.json();

            const imageUrl = sprites.other['official-artwork']?.front_default ||
                sprites.other.home?.front_default ||
                sprites.other.dream_world?.front_default ||
                sprites.front_default;

            crearCard(imageUrl, name, base_experience);
        }
    } else {
        alert('No se encontró el Pokémon');
    }
};

const tiposPokemon = async () => {
    let tipoPok = 'https://pokeapi.co/api/v2/type/'
    const tipoApi = await fetch(tipoPok);
    const { results } = await tipoApi.json();
    results.forEach(async tPokemon => {
        const opcion = document.createElement('option');
        opcion.value = tPokemon.name
        opcion.textContent = tPokemon.name.charAt(0).toUpperCase() + tPokemon.name.slice(1);
        select.appendChild(opcion)
    })
}

const filtrarCard = async (url, tipoPokemon) => {
    if (tipoPokemon == 'todos') {
        cardPo.innerHTML = '';
        despliegueDeCard(urlP)
        console.log(select.value)
        return;
    }
    const api = await fetch(url);
    const { results } = await api.json();
    results.forEach(async tipos => {
        if (tipoPokemon == tipos.name) {
            const listApi = await fetch(tipos.url)
            const { pokemon } = await listApi.json();
            pokemon.forEach(async listaP => {
                cardPo.innerHTML = ''
                sacarPokemon(listaP)
            })
            return;
        }
    })
}

const sacarPokemon = async (listP) => {
    let nombre = listP.pokemon.name
    let link = await fetch(listP.pokemon.url);
    let { base_experience, sprites } = await link.json();
    let imageUrl = sprites.other['official-artwork']?.front_default ||
        other.home?.front_default ||
        other.dream_world?.front_default;
    crearCard(imageUrl, nombre, base_experience)
}

select.addEventListener('change', async function (event) {
    let direccion = 'https://pokeapi.co/api/v2/type/'
    filtrarCard(direccion, select.value)
})

const sugerencias = async () => {
    let linkactual = 'https://pokeapi.co/api/v2/pokemon';
    let nombres = [];

    while (linkactual !== null) {
        const pokeApi = await fetch(linkactual);
        const { next, results } = await pokeApi.json();
        nombres = nombres.concat(results.map(pokemon => pokemon.name));
        linkactual = next;
    }

    return nombres;
};





antes.addEventListener('click', async function () {
    const { previous } = await getPokemon(urlP);
    if (previous) {
        cardPo.innerHTML = ''
        urlP = previous;
        verificacionLink(urlP)
        despliegueDeCard(urlP);
    }
});

siguiente.addEventListener('click', async function () {
    const { next } = await getPokemon(urlP);
    if (next) {
        cardPo.innerHTML = ''
        urlP = next;
        verificacionLink(urlP)
        despliegueDeCard(urlP);
    }
});

labelBusPoke.addEventListener('keyup', async function(){
    if (labelBusPoke.value) {
        buqueda(labelBusPoke.value)
    } else {
        cardPo.innerHTML = ''
        despliegueDeCard(urlP);
    }
})

boton.addEventListener('click', async function () {
    if (labelBusPoke.value) {
        buqueda(labelBusPoke.value)
    } else {
        alert('El contenedor esta vacio')
    }
})


tiposPokemon()

verificacionLink(urlP)

despliegueDeCard(urlP);
