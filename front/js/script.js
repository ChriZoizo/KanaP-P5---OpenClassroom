//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products/";
// Declaration d'une variable contenant l'URL actuelle
const currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
// Creation de la base de l'url qui servira au peuplé les liens des produits
const productURLFirstPart = new URL(currentURL.replace("index.html", "product.html"))
apiList = getProductsFromApi(apiURL);


// Fonction permettant le fetch de l'api puis appel la fonction "loop()" en lui passant le resultat du fetch en parametre
function getProductsFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
          console.log("Fetch Step 1 OK")
        console.log(res);
        return res.json();
      }
    })
    .then(function (value) {
      console.log("Fetch Step 2 OK : Value is bottom");
      console.log(value);
      loop(value)
      return value;
    })
    .catch(function (err) {
        console.log("ERROR WITH API FETCHING.")
      console.log(err);
    });
}



// Fonction pour boucler la fonction "populateIndexWithProducts()" sur un array
function loop(list){
    for (let i = 0; i < list.length; i++) {
        populateIndexWithProducts(list[i], i);
      }
      console.log("index content loaded from api: LOOP ENDED")
}

  // Fonction pour peupler l'index avec les produits de l'API 
function populateIndexWithProducts(object, index) {
  let id = object._id
  console.log(id.toString())
  let link = productURLFirstPart + '?id=' + id       //.searchParams.append("id:", id)
  
  // Creation des elements et ajouts des attributs et/ou du contenus
  let newLink = document.createElement("a");
  newLink.setAttribute("href", link);
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

  //----------------------------------
  // ALTERNATIVE avec INNERHTML ?
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



