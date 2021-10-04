/* Ne pas oublier de generer l'url de l'API selon le choix su produit (pour que les url soit lisibe je pense)*/

//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products";

apiList = getProductsFromApi(apiURL);

// Fonction permettant le fetch de l'api  et est censé retourner un array MAIS NE LE FAIT PAS !!!
function getProductsFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log(res);
        return res.json();
      }
    })
    .then(function (value) {
      console.log(value);
      valeur = value
      return value;
    })
    .catch(function (err) {
      console.log(err);
    });
}

console.log(apiList)

function loop(){
/*    value = getProductsFromApi(apiURL) */
    for (let i = 0; i < valeur.length - 1; i++) {
        populateIndexWithProducts(valeur[i], i);
      }
}

  // Fonction pour peupler l'index avec les produits de l'API
function populateIndexWithProducts(object, index) {
    //Console.log pour check A ENLEVER
  console.log(object.name);
     // je declare le container qui va recevoir les nouvelles cards la <div id=items>
  const itemContainer = document.getElementById("items");
     // Declaration du nouvel element <a>, et ajout des attributs href et un id
     // les informations des attributs proviennent de l'API ou son index.
  let newLink = document.createElement("a");
  newLink.setAttribute("href", "#"); /*  ATTRIBUT A REGLER */
     // Declaration de l'element <article>
  let newArticle = document.createElement("article");
     // Declaration de l'element <img> et de ses attributs
  let newImg = document.createElement("img");
  newImg.setAttribute("src", object.imageUrl);
  newImg.setAttribute("alt", object.altTxt + ", " + object.name);
     // Declaration de l'element <h3> et de son attributs + Contenus
  let newH3 = document.createElement("h3");
  newH3.setAttribute("class", "productName");
  newH3.innerHTML = object.name;
     // Declaration de l'element <p>, son attribut et son contenus
  let newP = document.createElement("p");
  newP.setAttribute("class", "productDescription");
  newP.innerText = object.description;
     // Insertion des element dans le code HTML
  itemContainer.appendChild(newLink);
  newLink.appendChild(newArticle);
  newArticle.appendChild(newImg);
  newArticle.appendChild(newH3);
  newArticle.appendChild(newP);

  //----------------------------------
  // ALTERNATIVE avec INNERHTML ?
}


document
  .getElementById("test")
  .addEventListener("click", prime);


function prime() {
    loop()
  console.log("prime");
}
