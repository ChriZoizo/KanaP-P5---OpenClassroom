// Variables Globales
const apiURL = 'http://localhost:3000/api/products/' // Declaration de l'URL de l'api
let cartList = JSON.parse(localStorage.getItem('cartContent')) // Contenus du localStorage dans variable
let urlChecker = window.location.pathname // URL actuelle
let cartHTML = /cart.html/ // String qui permettrons de tester l'url afin de savoir quel fichier a appeler ce code
let confirmationHTML = /confirmation.html/

// Determine la fonction a appeler en fonction du fichier HTML qui appelle ce fichier
if (cartHTML.test(urlChecker) == true) {
  fetchAndStart(apiURL)
  listenOrderButton()
} else if (confirmationHTML.test(urlChecker) == true) {
  displayConfirmationCode()
}

/* A / Fonction qui recupere les objets de l'API, et l'envoie en parametre lors de l'appel de 
la fonction loop()
@param { String } url
@return { array } value
        <<{ array } value.colors
        <<{ String } value._id
        <<{ String } value.name
        <<{ Number } value.price
        <<{ String } value.imageUrl
        <<{ String } value.description*/
function fetchAndStart (url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json()
      }
    })
    .then(function (value) {
      loopOverCartList(value)
      return value
    })
    .catch(function (err) {
      console.log(err)
    })
}

/* B / Fonction qui parcours le panier pour calculer le nombre d'items dans le panier et son prix total
en recuperant les information des produits correlées dans l'array passé en parametre
Si le panier est vide, change le H1 de la page
@param { Array } arrayFromApi      
@return { Number } totalQuantityOfProducts
@return { Number } totalCartPrice
@return { Array } product
        <<{ String } product._id
        <<{ String } product.color
        <<{ Number } product.quantity
@return { Object } productInfos */
function loopOverCartList (arrayFromApi) {
  // Verifie si l'array contient quelque chose
  if (cartList === null || cartList.length == 0) {
    document.getElementsByTagName('h1')[0].innerText = 'Votre Panier Est Vide'
  } else {
    let totalQuantityOfProducts = 0
    let totalCartPrice = 0
    cartList.forEach(function (product) {
      // variable qui recevras l'objet dans l'arrayFromApi ayant le meme _id [...]
      let productInfos = arrayFromApi.find(
        element => element._id == product._id //  [...] que l'element du panier product, a chaque tour de boucle
      )
      totalQuantityOfProducts += parseInt(product.quantity) // Ajoute le nombre d'items voulus dans le panier
      totalCartPrice +=
        parseInt(product.quantity) * parseInt(productInfos.price)
      populateWithCartProducts(productInfos, product)
    })
    displayTotalPriceAndQuantity()
  }
}

/*  C / Fonction pour affficher les information des produits du paniers ainsi que les infos 
necessaires correspondant au produit dans l'API 
@param { Array } objectFromCart
        <<{ String } objectFromCart._id
        <<{ String } objectFromCart.color
        <<{ Number } objectFromCart.quantity
@param { array } objectInfos
        <<{ array } objectInfos.colors
        <<{ String } objectInfos._id
        <<{ String } objectInfos.name
        <<{ Number } objectInfos.price
        <<{ String } objectInfos.imageUrl
        <<{ String } objectInfos.description */

function populateWithCartProducts (objectInfos, objectFromCart) {
  // Declaration de la variable contenant le template de code HTML en y incluant les variable venant des params
  let htmlOfProduct = `<div class="cart__item__img">\  
  <img src="${objectInfos.imageUrl}" alt="${objectInfos.altTxt}">\
</div>\
<div class="cart__item__content">\
  <div class="cart__item__content__titlePrice">\
    <h2>${objectInfos.name} (${objectFromCart.color})</h2>\
    <p class="itemPrice">${parseInt(objectInfos.price).toFixed(2)} €</p>\
  </div>\
  <div class="cart__item__content__settings">\
    <div class="cart__item__content__settings__quantity">\
      <p id="displayQty ${objectInfos._id} ${objectFromCart.color}">Qté : ${
    objectFromCart.quantity
  }</p>\
      <input id="input ${objectInfos._id} ${
    objectFromCart.color
  }"type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
    objectFromCart.quantity
  }">\
    </div>\
    <div class="cart__item__content__settings__delete">\
      <p class="deleteItem" id="delete ${objectInfos._id} ${
    objectFromCart.color
  }">Supprimer</p>\
    </div>\
  </div>\
</div>`

  const articleContainer = document.getElementById('cart__items')
  let newArticleItemInner = document.createElement('article') // Creation de l'element <article> et ses attributs
  newArticleItemInner.setAttribute(
    'data-id',
    objectInfos._id + objectFromCart.color
  )
  newArticleItemInner.setAttribute('class', 'cart__item')
  articleContainer.appendChild(newArticleItemInner)
  newArticleItemInner.innerHTML = htmlOfProduct // Injection du template

  /* C - 1 / AJOUT ADDEVENTLISTENER
   C - 1 - a / addEventListener pour le bouton supprimer (affilié a chaque son product)*/
  document
    .getElementById(`delete ${objectInfos._id} ${objectFromCart.color}`)
    .addEventListener('click', function () {
      deleteItem(objectFromCart)
    })

  /* C - 1 - b / addEventListener sur les inputs reglant la quantité (affilié a chaque son product)*/
  document
    .getElementById(`input ${objectInfos._id} ${objectFromCart.color}`)
    .addEventListener('change', function () {
      let newQuantity = Math.floor(
        document.getElementById(
          `input ${objectInfos._id} ${objectFromCart.color}`
        ).value
      )
      // si la quantité atteint 0 lance deleteItem()
      if (newQuantity == 0) {
        deleteItem(objectFromCart)
      } else {
        changeQuantityInner(newQuantity) // Sinon change la quantité en appellant la fonction changeQuantityInner
      }
    })

  /* C - 2 FONCTIONS A PORTéE REDUITE
   C - 2 - a / Fonction pour supprimer l'objet => Demande une confirmation via une alerte 
        @params { Array } object */
  function deleteItem (object) {
    index = findIndexInCart(object)
    // demande de confirmation
    let confirm = window.confirm(
      'Etes vous sûr de vouloir supprimer cet article ?'
    )
    // Check si le resultat de la confirmation est "true" (ok)
    if (confirm == true) {
      cartList.splice(index, 1) // supprime l'objet de l'array
      localStorage.setItem('cartContent', JSON.stringify(cartList)) // enregistre l'array dans le localStorage
      window.alert('Produit supprimé du panier')
      location.reload() // recharge la page et le code
    }
  }

  /* C - 2 - b / Fonction pour enregistrer les changement de quantité d'un produit dans le localStorage
    et modifie la quantité affiché sur la page
    @params {Number} quantity
    @var    {Number} index */
  function changeQuantityInner (quantity) {
    index = findIndexInCart(objectFromCart) // Recupere l'index via la fonction findIndexInCart()
    objectFromCart.quantity = quantity
    cartList.splice(index, 1, objectFromCart)
    localStorage.setItem('cartContent', JSON.stringify(cartList))
    document.getElementById(
      `displayQty ${objectInfos._id} ${objectFromCart.color}`
    ).innerText = `Qté : ${quantity}`
    displayTotalPriceAndQuantity()
  }
}

/* D / Fonction qui recupere le prix total et la quantité de produits total. 
    Le prix est calculer au prealable par la fonction "loop()" 
    @return { Number } totalPrice */
function displayTotalPriceAndQuantity () {
  const arrayQuantity = document.getElementsByClassName('itemQuantity') // Recupere tout les input de quantité
  const arrayPrice = document.getElementsByClassName('itemPrice') // Recupere tout les <p> contenant les prix
  let totalPrice = 0 // Declaration de la variable contenant le prix total
  let totalQuantity = 0
  let i = 0
  for (let input of arrayQuantity) {
    totalQuantity += parseInt(input.value, 10)
    totalPrice +=
      parseInt(input.value, 10) * parseInt(arrayPrice[i].innerHTML, 10)
    i += 1
  }
  const totalQuantityContainer = document.getElementById('totalQuantity')
  const totalPriceContainer = document.getElementById('totalPrice')
  totalQuantityContainer.innerText = totalQuantity
  totalPriceContainer.innerText = totalPrice
  return totalPrice
}

/* E / Fonction pour lancer un EventListener sur le boutton "commader", et bloque le boutton si 
le panier est vide */
function listenOrderButton () {
  let orderButton = document.getElementById('order')
  orderButton.addEventListener('click', function (event) {
    if (cartList === null || cartList.length == 0) {
      event.preventDefault()
      window.alert('Panier Vide ! Impossible de passer une commande')
      return
    }
    recordDataFromForm()
  })
}

/* F / Fonction permettant de trouver l'index d'un produit par rapport au localStorage.cartContent
    @params { Array } item
             <<{ String } _id
             <<{ String } color
             <<{Number} quantity
    @return {Number} index */
function findIndexInCart (item) {
  for (const [index, element] of cartList.entries()) {
    if (element._id == item._id && element.color == item.color) {
      return index
    }
  }
}

/* G / Fonction qui crée un Objet "contact" a partir des informations entrées dans le formulaire
 et l'envoie a la fonction checkContactData() ezn parametre
    @return { Object } contact
             <<{ String } firstName       
             <<{ String } lastName       
             <<{ String } address       
             <<{ String } city       
             <<{ String } email  */
function recordDataFromForm () {
  let contact = {} // Objet "contact"
  contact['firstName'] = document.getElementById('firstName').value.toString()
  contact['lastName'] = document.getElementById('lastName').value.toString()
  contact['address'] = document.getElementById('address').value.toString()
  contact['city'] = document.getElementById('city').value.toString()
  contact['email'] = document.getElementById('email').value.toString()
  checkContactData(contact)
}

/* G - 1 / Fonction qui va verifier la presence de caractere "dangereux" dans l'Objet "contact". Si un 
probleme survient, fait appel a la fonction d'affichage d'erreur displayErrorDOM(). Si aucun probleme,
 crée un Array "productsIds" et appel la fonction SendToApi() avec "contact" et productsIds en parametre
    @param  { Object } contact
             <<{ String } firstName       
             <<{ String } lastName       
             <<{ String } address       
             <<{ String } city       
             <<{ String } email
    @return { Object } contact
    @return { Array } productsIds
             <<{ Number } _ids
*/
function checkContactData (contact) {
  let errorCount = 0 // "Compteur" qui serviras a savoir si il y a une erreur
  let productsIds = [] // Array qui recevra les _id des produits acheter
  // 2 RegEx differents pour 2 types de champs (les "nom" et "prenom", et le reste)
  let regExChecker = /[&<>\\\`\"{}]/
  let regExNamesChecker = /[&@#*%+/!?|<>\\\`\"{}0-9]/
  for (const [key, value] of Object.entries(contact)) {
    if (key == 'firstName' || key == 'lastName') {
      // Si le test est positif, affiche un message d'erreur
      if (regExNamesChecker.test(value) === true) {
        displayErrorDOM(key, true)
        errorCount += 1
        // Sinon appelle une fonction pour effacer un eventuel message injecter dans le DOM au préalable
      } else {
        displayErrorDOM(key, false)
      }
      // Bis Repetita pour les champs "city" "adress" et "email" avec un regEx different
    } else {
      if (regExChecker.test(value) === true) {
        displayErrorInForm(key, true)
        errorCount += 1
      } else {
        displayErrorInForm(key, false)
      }
    }
  }
  // Si aucune erreurs, enregistre les Ids des produits du panier dans un Array
  if (errorCount == 0) {
    cartList.forEach(function (product) {
      productsIds.push(product._id)
    })
    sendOrderToApi(productsIds, contact)
  }
}

/* G - 2 / Fonction qui affiche ou retire via le DOM les messages d'erreures du formulaires
@param { String } badField
@param { Boolean } validator */
function displayErrorInForm (badField, validator) {
  let dom = document.getElementById(`${badField}ErrorMsg`)
  let message = `Contenus du champ invalide ! Trop court ou présence de caractéres inattendus`
  // si le boleen "validator" est true, le message est ajouté, si il est sur false, le message est enlevé
  if (validator === true) {
    dom.innerText = message
    window.stop()
  } else if (validator === false) {
    dom.innerText = ''
  }
}

/* H / Fonction permettant la creation de l'objet "order" a partir des objets transmis en parametre
puis les envoie une requete POST a l'api qui renvoie l'objet, mais egalement orderId et appelle la 
fonction switchViewToConfirm()
    @params { Array } contact
             <<{ String } firstName       
             <<{ String } lastName       
             <<{ String } address       
             <<{ String } city       
             <<{ String } email  
    @params { Array } productsIds
             <<{ String } _id
    @return { Array } contact
    @return { Array } productsIds
    @return { String } orderId
*/
function sendOrderToApi (prod, contact) {
  order = {}
  order['products'] = prod
  order['contact'] = contact
  console.log(order)
  let products = prod
  fetch(apiURL + 'order', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(function (res) {
      if (res.ok) {
        return res.json()
      }
    })
    .then(function (value) {
      switchViewToConfirm(value.orderId)
      localStorage.clear('cartContent') // A LAISSER ?
    })
}

/* *** Fonctions pour le fichier "confirmation.html" UNIQUEMENT *** */

/* I - 1 / Fonction qui permet d'ouvrire un nouvel onglet en passant le parametre d'entrée en tant que
params de l'URL et appel la fonction displayConfirmationCode() 
    @params { String } orderId*/
function switchViewToConfirm (orderId) {
  window.location = './confirmation.html?orderId=' + orderId
  window.onload = function () {
    displayConfirmationCode()
  }
}

/* I - 2 / Fonction qui permet d'afficher l'orderId via le DOM sur la page "confirmation.html" en la 
recuperant dans l'URL */
function displayConfirmationCode () {
  const currentURL = new URL(document.location.href) // Creation d'une nouvelle URL format URL
  document.getElementById('orderId').innerText = currentURL.searchParams.get(
    'orderId'
  )
}
