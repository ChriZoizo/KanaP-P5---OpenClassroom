/* Ne pas oublier de generer l'url de l'API selon le choix su produit (pour que les url soit lisibe je pense)*/
// Imports
import * as monScript from "./script.js";

//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products/";

const listOfProducts = await monScript.getProductsFromApi(apiURL);
console.log(listOfProducts)
loop(listOfProducts)


// Fonction pour boucler la fonction de population (populateIndexWithProducts()) sur un array
async function loop(list){
    for (let i = 0; i < list.length; i++) {
        populateIndexWithProducts(list[i], i);
      }
      console.log("index content loaded from api: LOOP ENDED")
}

  // Fonction pour peupler l'index avec les produits de l'API 
function populateIndexWithProducts(object, index) {
    //Console.log pour check A ENLEVER
  console.log(object.name);
  // Creation des elements et ajouts des attributs et/ou du contenus
  let newLink = document.createElement("a");
  newLink.setAttribute("href", "#"); /*  ATTRIBUT A REGLER */
  let newArticle = document.createElement("article");
  let newImg = document.createElement("img");
  newImg.setAttribute("src", object.imageUrl);
  newImg.setAttribute("alt", object.altTxt + ", " + object.name);
  let newH3 = document.createElement("h3");
  newH3.setAttribute("class", "productName");
  newH3.innerHTML = object.name;
  let newP = document.createElement("p");
  newP.setAttribute("class", "productDescription");
  newP.innerText = object.description;
  // injection dans le code HTML
  const itemContainer = document.getElementById("items");
  itemContainer.appendChild(newLink);
  newLink.appendChild(newArticle);
  newArticle.appendChild(newImg);
  newArticle.appendChild(newH3);
  newArticle.appendChild(newP);
}

  // Lance la boucle pour peuplé l'index avec les produits lorsque la page est charger
// A FAIRE !

// FONCTION TEST

// EventListener POour tester (click sur le header pour lancer fonction)
document
  .getElementById("test")
  .addEventListener("click", prime);


function prime() {
    loop(apiList)
  console.log("prime");
  console.log(apiList)
}

