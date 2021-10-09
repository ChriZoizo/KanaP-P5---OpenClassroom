// JEN SUIS AU MOMENT OU JE VEUX ENVOYER LES INFO AU LOCALSTORAGE? MAIS DANS 
::FUNCTION EN QUESTION? LES PUSH N4ONT PAS L4AI R DE FONCTONNERCAR ILE NE RENVOIENT RIEN  DUT TouchListJE NE SAIS PAS COMMENT M4Y PREBNDRE 




const apiURL = "http://localhost:3000/api/products";

//Recuperation de l'url actuelle sous forme de string
const currentUrlInString = document.location.href
// Création d'une nouvelle URL
const currentURL = new URL(currentUrlInString)
// recuperation de l'ID dans les params de la nouvelle URL
const id = currentURL.searchParams.get("id")

productArray = []

const productToAdd = []
 getProductFromApi(apiURL)


// Fonction permettant les données de l'API
async function getProductFromApi(url) {
  fetch(url)
  // Jerecupere les données compléte de l'API
    .then(function (res) {
      if (res.ok) {
          console.log("fetch step 1")
        console.log(res);
        return res.json();
      }
    })
    // Si elle sont ok, je selectionne le produit concerné via son ID
    .then(function (value) {
       productArray.push(value.find(el => el._id == id)) 
       productArray = productArray[0]
      console.log(value.find(el => el._id == id))
      console.log("TOP IS RETURN FUNCTION")
/*       console.log(productSelected) */
      console.log(productArray)
      displayOneProduct(productArray)
      return value.find(el => el._id == id);
    })
    .catch(function (err) {
        console.log("ERROR WITH API FETCHING. LOOK BOTTOM")
      console.log(err);
      return err
    });
}

// Fonction pour recuperer et afficher les infos du produits concerné
function displayOneProduct(object) {
  console.log("DISPLAYING" + object)
    const imageContainer = document.getElementsByClassName("item__img")
    let productImg = document.createElement("img")
    console.log("Take IMAGE URL")
    productImg.setAttribute('src', object.imageUrl)
    productImg.setAttribute('alt', object.altTxt)
    imageContainer[0].appendChild(productImg)
    const h1Container = document.getElementById("title")
    h1Container.innerText = object.name
    const priceContainer = document.getElementById("price")
    priceContainer.innerText = object.price
    const descriptionContainer = document.getElementById("description")
    descriptionContainer.innerText = object.description
    const colorSelector = document.getElementById("colors") 
    // Boucle sur l'array contenant les couleurs pour afficher
    let colorArray = object.colors
    for (i = 0; i < (object.colors.length); i ++){
        let thisColor = object.colors[i]
        let colorOption = document.createElement('option')
        colorOption.setAttribute("value", thisColor )
        colorOption.innerText = thisColor
        colorSelector.appendChild(colorOption)
    }


    /* testing(object) */
    console.log(productArray)
}


function addToCart() {
  let colorSelector = document.getElementById("colors")
  let quantityForm = document.getElementById("quantity").value
  let selectedColor = colorSelector.options[colorSelector.selectedIndex].value
  if (selectedColor == "" && quantityForm == 0){
    alert("Veuillez choisir une couleur et definir une quantitée")
  }
  else if (quantityForm == 0) {
    alert("Veuillez Choisir une quantitée. Car sinon nous vous enverrons zero cannapé ^^")
  }
  else if (selectedColor == ""){
    alert("Veuiller choisir une couleur")
  }
  else {
    productToAdd["_id"]= productArray._id
    productToAdd["color"] = selectedColor
    productToAdd["quantity"] = quantityForm
    console.log(productToAdd)


    let objectToSave = new Array(productToAdd)
    localStorage.setItem("productInCart", JSON.stringify(productArray._id + productArray.colors.find(el => el == selectedColor))
    let display = localStorage.getItem("productInCart")
    let displayed = JSON.stringify(display)
    console.log(displayed)
  }


}


// Event Listener sur le bouton  addToCart pour l'ajout au panier
let addToCartButton = document.getElementById('addToCart')
addToCartButton.addEventListener('click', addToCart)


async function addToCarte(){

  console.log("adding to cart BU ALSO TESTINNNNNNNGGGGGG")
  console.log(await getProductFromApi(apiURL))
  const product = await getProductFromApi(apiURL)
  console.log("MARQUER 1")
  const detailOfProduct = await displayOneProduct(product)
  console.log("MARQUER 2")
  console.log(product)
  console.log(productsList)
}

