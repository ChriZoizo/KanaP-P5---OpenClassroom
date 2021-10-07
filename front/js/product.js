const apiURL = "http://localhost:3000/api/products";
const currentUrlInString = document.location.href
const currentURL = new URL(currentUrlInString)
const id = currentURL.searchParams.get("id")
const productsList = getProductsFromApi(apiURL)
console.log(id)

// Fonction permettant le fetch de l'api  et est censé retourner un array MAIS NE LE FAIT PAS !!!
function getProductsFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
          console.log("fetch step 1")
        console.log(res);
        return res.json();
      }
    })
    .then(function (value) {
      console.log(value);
      console.log("values a the top of this is for step 2 fetching");
      listOfProducts = value
      displayOneProduct(listOfProducts.find(el => el._id == id))
      return value;
    })
    .catch(function (err) {
        console.log("ERROR WITH API FETCHING. LOOK BOTTOM")
      console.log(err);
    });
}


/* function getOneProduct(arr) {
return arr.find(product => product._id === id)
} */

// Fonction pour recuperer et afficher la page d'un produit

function displayOneProduct(object) {
      // recuperation du conteneur pour l'image, creation de l'element
    const imageContainer = document.getElementsByClassName("item__img")
    let productImg = document.createElement("img")
      // ajout des attributs et ajout dans le code HTML
    productImg.setAttribute('src', object.imageUrl)
    productImg.setAttribute('alt', object.altTxt)
    imageContainer[0].appendChild(productImg)
      // Recuperation de l'element conteneur pour le nom du produit
    const h1Container = document.getElementById("title")
      // Injection dans le code HTML
    h1Container.innerText = object.name
      // Recuperation de l'element conteneur pour le prix du produit
    const priceContainer = document.getElementById("price")
      // injection dans le code HTML
    priceContainer.innerText = object.price
      // Recuperation de l'element conteneur pour la descritpion
    const descriptionContainer = document.getElementById("description")
      // Injection dans le code HTML
    descriptionContainer.innerText = object.description
      // Recuperation du selecteur conteneur
    const colorSelector = document.getElementById("colors") //A mettre dans la boucle ?
    
    let colorArray = object.colors

    //BOUCLE FOR ... OF ??????
    for (i = 0; i < (object.colors.length); i ++){
        let thisColor = object.colors[i]
        let colorOption = document.createElement('option')
        colorOption.setAttribute("value", thisColor )
        colorOption.innerText = thisColor
        colorSelector.appendChild(colorOption)
    }

}

// Event Listener sur le bouton  addToCart pour l'ajout au panier
let addToCartButton = document.getElementById('addToCart')
addToCartButton.addEventListener('click', addToCart)

function addToCart(){
  console.log("added to cart")
  getOneProduct(id)
}

