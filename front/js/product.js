const currentUrlInString = document.location.href // Enregistrement URL actuelle
const currentURL = new URL(currentUrlInString) // Creation d'une nouvelle URL format URL
const id = currentURL.searchParams.get('id') // ID du produit a afficher que l'on recupere dans le params de l'URL crée

const apiURL = 'http://localhost:3000/api/products/' // URL de l'api

getProductFromApi(apiURL + id) // Appel de l'application, en passant l'urlde l'API + l'id en parametre

/* A / Fonction permettant le fetch de l'api. La presence du params "_id" dans l'URL  indique au controlleur
de ne renvoyer que le produit correspondant a cet ID.  
@params { String } url
@return { Objet } value
         <<{ array } colors
         <<{ String } _id
         <<{ String } name
         <<{ Number } price
         <<{ String } imageUrl
         <<{ String } description */
async function getProductFromApi (url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json()
      }
    })
    // Si ok, appel la fonction d'affichage en passant l'Objet "product" en parametre
    .then(function (value) {
      displayOneProduct(value)
      return value
    })
    .catch(function (err) {
      console.log(err)
      return err
    })
}

/*  B / Fonction pour afficher les informations en modifiant le DOM. 
@param { Objet } object
        <<{ Array } colors
        <<{ String } _id
        <<{ String } name
        <<{ Number } price
        <<{ String } imageUrl
        <<{ String } description */

function displayOneProduct (object) {
  const imageContainer = document.getElementsByClassName('item__img')

  let productImg = `<img src=${object.imageUrl} alt=${object.altTxt}></img>`
  imageContainer[0].innerHTML = productImg

  const h1Container = document.getElementById('title')
  h1Container.innerText = object.name

  const priceContainer = document.getElementById('price')
  priceContainer.innerText = object.price

  const descriptionContainer = document.getElementById('description')
  descriptionContainer.innerText = object.description

  const colorSelector = document.getElementById('colors')
  // Boucle sur l'array "colors" contenant les couleurs du produits pour incure dans <select>
  for (i = 0; i < object.colors.length; i++) {
    let thisColor = object.colors[i]
    let colorOption = `<option value=${thisColor}>${thisColor}</option>`
    colorSelector.insertAdjacentHTML('beforeend', colorOption)
  }
}

/* C / Fonction qui recupere les informations de quantité et de couleur ainsi que l'ID
et retourne un Objet. Si il manque une info, retourne une alert() personnalisé
@return { Object } productToAdd
         << { String } _id 
         << { String } color
         << { Number } quantity*/
function createObjectToCart () {
  let productToAdd = {}
  let colorSelector = document.getElementById('colors')
  let quantityForm = document.getElementById('quantity').value
  let selectedColor = colorSelector.options[colorSelector.selectedIndex].value
  if (selectedColor == '' && quantityForm == 0) {
    alert('Veuillez choisir une couleur et definir une quantitée')
  } else if (quantityForm == 0) {
    alert('Veuillez Choisir une quantitée.')
  } else if (selectedColor == '') {
    alert('Veuiller choisir une couleur')
  } else {
    productToAdd['_id'] = id
    productToAdd['color'] = selectedColor
    productToAdd['quantity'] = parseInt(quantityForm)
    return productToAdd
  }
}

/* D / Fonction pour verifier la presence d'un panier existant dans le localStorage.cartContent :
 renvoie le panier sous forme d'Objet si il existe deja.
 Creer une Objet vide si le panier n'est pas existant 
 @return { Object } cart
          << { Object } product
              << { String } product._id
              << { String } product.color
              << { Number } product.quantity
or
@return { Array } emptyCart ** EMPTY ***/
function createCartObject () {
  let storage = { ...localStorage } // Variable contenant le localStorage
  if (storage.cartContent != null || storage.cartContent != undefined) {
    cart = JSON.parse(localStorage.getItem('cartContent'))
    return cart
  } else {
    emptyCart = []
    return emptyCart
  }
}

/* E / Function qui parcours l'Objet panier' :
 Si un Objet "product" identique au produit a ajouter est deja present, on modifie la quantité de l'objet voulus
 Sinon un nouvel Objet "product" est ajouté a l'Objet panier  */
function addToCart () {
  let productToAdd = createObjectToCart() // Objet product a ajouter
  let cart = createCartObject() // Objet panier
  let indexeur = 0 // Indexeur qui serviras lors du splice()
  let alreadyPresent = false
  cart.forEach(function (cartedProduct) {
    // si les IDs et la couleur correspond, les quantités son additionnées et alreadyPresent passe a "true"
    if (
      cartedProduct._id == productToAdd._id &&
      cartedProduct.color == productToAdd.color
    ) {
      productToAdd.quantity += cartedProduct.quantity
      cart.splice(indexeur, 1, productToAdd)
      alreadyPresent = true // Passe le booleen a true
    }
    indexeur += 1
  })
  // A la fin de la boucle, si le booleen est toujours a false, on ajoute l'objet product tel quel dans l'Objet panier
  if (alreadyPresent == false) {
    cart.push(productToAdd)
  }
  localStorage.setItem('cartContent', JSON.stringify(cart))
  location.reload()
}

/* eventListener sur le bouton  d'ajout au panier. */
let addToCartButton = document.getElementById('addToCart')
addToCartButton.addEventListener('click', function () {
  addToCart()
})
