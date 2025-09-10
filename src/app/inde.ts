let text: string = "lea";
let textos: string[] = ["hola", "chau", "adios", "puto"];
let ts: string[] = [];

// recorremos el array
for (let index = 0; index < textos.length; index++) {

    // obtenemos el elemento de cada pocision
    let element = textos[index];

    // aca pasamos de minuscula a mayuscula
    element = element.toLocaleUpperCase();

    // como lo agregamos al array ts
    ts.push(element)
    
}

