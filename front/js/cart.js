const apiURL = 'http://localhost:3000/api/products/' // URL de l'api
let cartList = JSON.parse(localStorage.getItem('cartContent')) // Objet panier (recuperer du localStorage.cartContent)
let urlChecker = window.location.pathname // URL actuelle
let cartHTML = /cart.html/ // RegExs qui permettrons de tester l'url afin de savoir quel fichier a appeler ce code
let confirmationHTML = /confirmation.html/

// Determine la fonction a appeler en fonction du fichier HTML qui appelle ce fichier (cart.html ou confirmation.html)
if (cartHTML.test(urlChecker) == true) {
  fetchAndStart(apiURL)
  listenOrderButton()
} else if (confirmationHTML.test(urlChecker) == true) {
  displayConfirmationCode()
}

/* A / Fonction qui recupere l'Objet products de l'API, et l'envoie en parametre lors de l'appel de 
la fonction B
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

/* B / Fonction qui parcours l'Objet panier, si null ou vide, change le H1 de la page.
Sinon, l'_id de chaques elements de l'Objet panier permet de recuperer dans l'Objet de l'API les infos
image, nom, etc... Puis appel la fonction d'affichage avec les infos (Objet) en parametres
@param { Objet } arrayFromApi      
@return { Objet } productOfCart
        <<{ String } productOfCart._id
        <<{ String } productOfCart.color
        <<{ Number } productOfCart.quantity
@return { Object } productInfos 
        <<{ array } objectInfos.colors
        <<{ String } objectInfos._id
        <<{ String } objectInfos.name
        <<{ Number } objectInfos.price
        <<{ String } objectInfos.imageUrl
        <<{ String } objectInfos.description*/
function loopOverCartList (arrayFromApi) {
  // Verifie si l'array contient quelque chose, si true, change le <h1>
  if (cartList === null || cartList.length == 0) {
    document.getElementsByTagName('h1')[0].innerText = 'Votre Panier Est Vide'
  } else {
    cartList.forEach(function (productOfCart) {
      // variable qui recevras l'Objet product contenus dans l'Objet de l'api [...]
      let productInfos = arrayFromApi.find(
        element => element._id == productOfCart._id //  [...] ayant le même _id.
      )
      populateWithCartProducts(productInfos, productOfCart)
    })
    displayTotalPriceQuantity() // Appel la fonction qui calcule le total du panier
  }
}

/*  C / Fonction pour afficher les informations d'un produit du panier. Accepte l'Objet product de l'API, et
l'Objet product du panier en parametre. 
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
  // template de code HTML en interpolant les variable voulus
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

  const articleContainer = document.getElementById('cart__items') // ciblage du container
  let newArticleItemInner = document.createElement('article') // Creation de l'element <article> et ses attributs
  newArticleItemInner.setAttribute(
    'data-id',
    objectInfos._id + objectFromCart.color
  )
  newArticleItemInner.setAttribute('class', 'cart__item')
  articleContainer.appendChild(newArticleItemInner) // Injection du template
  newArticleItemInner.innerHTML = htmlOfProduct

/* C - 1 / AJOUT ADDEVENTLISTENER
C - 1 - a / addEventListener bouton supprimer (affilié a son product)*/
  document
    .getElementById(`delete ${objectInfos._id} ${objectFromCart.color}`)
    .addEventListener('click', function () {
      deleteItem(objectFromCart)
    })

/* C - 1 - b / addEventListener input quantité (affilié a son product)*/
  document
    .getElementById(`input ${objectInfos._id} ${objectFromCart.color}`)
    .addEventListener('change', function () {
      // Recupere la valeur de l'input quantity
      let newQuantity = Math.floor(
        document.getElementById(
          `input ${objectInfos._id} ${objectFromCart.color}`
        ).value
      )
      // si la quantité atteint 0 lance deleteItem()
      if (newQuantity == 0) {
        deleteItem(objectFromCart)
      } else {
        changeQuantityInner(newQuantity) // Sinon change la quantité appel de fonction C - 2 - b (changeQuantityInner())
      }
    })

/* C - 2 FONCTIONS A PORTéE REDUITE
 C - 2 - a / Fonction pour supprimer l'objet
@params { Object } object */
  function deleteItem (object) {
    index = findIndexInCart(object)
    // demande confirmation
    let confirm = window.confirm(
      'Etes vous sûr de vouloir supprimer cet article ?'
    )
    // Check le resultat de la confirmation, si "true"
    if (confirm == true) {
      cartList.splice(index, 1) // supprime l'objet de l'array
      localStorage.setItem('cartContent', JSON.stringify(cartList)) // enregistre l'array dans le localStorage
      newArticleItemInner.remove() // Supprime du DOM
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
    displayTotalPriceQuantity()
  }
}

/* D / Fonction qui recupere le prix total et la quantité total du panier. 
@return { Number } totalPrice */
function displayTotalPriceQuantity () {
  const arrayQuantity = document.getElementsByClassName('itemQuantity') // Recupere tout les input de quantité
  const arrayPrice = document.getElementsByClassName('itemPrice') // Recupere tout les <p> contenant les prix
  let totalPrice = 0 // Declaration variable du prix total
  let totalQuantity = 0 // Declaration variable quantité total
  let i = 0 // Index utilisé pour parcourir les array de noeuds
  for (let input of arrayQuantity) {
    totalQuantity += parseInt(input.value, 10)
    totalPrice +=
      parseInt(input.value, 10) * parseInt(arrayPrice[i].innerHTML, 10)
    i += 1 // incrémente l'index
  }
  const totalQuantityContainer = document.getElementById('totalQuantity')
  const totalPriceContainer = document.getElementById('totalPrice')
  totalQuantityContainer.innerText = totalQuantity
  totalPriceContainer.innerText = totalPrice
  return totalPrice
}

/* E / Fonction pour lancer un EventListener sur le boutton "commander", annule l'action si 
l'Objet panier est vide ou null*/
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

/* F / Fonction pour trouver l'index d'un produit donné en paramétre dans l'Objet panier
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

/* G / Fonction qui crée un Objet contact a partir des informations entrées dans le formulaire
et appelle la fonction G-1 avec l'Objet crée en parametre
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

/* G - 1 / Fonction qui verifie la presence de caracteres "dangereux" dans l'Objet contact. Si un 
probleme (true), fait appel a la fonction d'affichage d'erreur G-2 displayErrorDOM(). Si aucun probleme (false),
crée un Array "productsIds" et appel la fonction H avec l'Objet "contact" et l'Array productsIds en parametre
@param  { Object } contact
         <<{ String } firstName       
         <<{ String } lastName       
         <<{ String } address       
         <<{ String } city       
         <<{ String } email
@return { Object } contact
@return { Array } productsIds
         <<{ Number } _ids*/
function checkContactData (contact) {
  let errorCount = 0 // "Compteur" d'erreurs
  let productsIds = [] // Array qui recevra les _id des produits
  // 2 RegEx differents pour 2 types de champs (les "nom" et "prenom", et le reste)
  let regExChecker = /[&<>\\\`\"{}]/
  let regExNamesChecker = /[&@#*%+/!?|<>\\\`\"{}0-9]/
  for (const [key, value] of Object.entries(contact)) {
    if (key == 'firstName' || key == 'lastName') {
      // Si le test est positif, affiche un message d'erreur
      if (regExNamesChecker.test(value) === true || value.length == 0) {
        displayErrorDOM(key, true)
        errorCount += 1
        // Sinon appelle une fonction pour effacer un eventuel message injecté dans le DOM au préalable
      } else {
        displayErrorDOM(key, false)
      }
      // Bis Repetita pour les champs "city" "adress" et "email" avec un regEx different
    } else {
      if (regExChecker.test(value) === true || value.length == 0) {
        displayErrorDOM(key, true)
        errorCount += 1
      } else {
        displayErrorDOM(key, false)
      }
    }
  }
  // Si aucune erreurs, enregistre les Ids des produits du panier dans l'Array productsIds
  if (errorCount == 0) {
    cartList.forEach(function (product) {
      productsIds.push(product._id)
    })
    sendOrderToApi(productsIds, contact) // A la fin, appel la fonction H
  }
}

/* G - 2 / Fonction qui affiche ou retire via le DOM les messages d'erreures du formulaires
@param { String } badField
@param { Boolean } validator */
function displayErrorDOM (badField, validator) {
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

/* H / Fonction qui crée l'Objet "order" a partir des objets transmis en parametre
puis les envoie dans le body d'une requete POST a l'api qui renvoie l'objet, mais egalement orderId. Si
tout OK, appelle la fonction I- 1 switchViewToConfirm() avec l'orderID en parametre
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
      localStorage.clear('cartContent')
    })
}

/* *** Fonctions pour le fichier "confirmation.html" UNIQUEMENT *** */

/* I - 1 / Fonction qui ouvre un nouvel onglet, ajoute en params de l'URL de l'onget le string reçus en paramétre.
Puis appelle la fonction displayConfirmationCode() 
    @params { String } orderId*/
function switchViewToConfirm (orderId) {
  window.location = './confirmation.html?orderId=' + orderId
  window.onload = function () {
    displayConfirmationCode() // POSSIBILITé d'envoyer l'orderID en parametre lors de cet appel de fonction (plus safe)
  }
}

/* I - 2 / Fonction qui affiche l'orderId via le DOM sur la page "confirmation.html" en la 
recuperant dans l'URL (params).  */
function displayConfirmationCode () {
  const currentURL = new URL(document.location.href) 
  document.getElementById('orderId').innerText = currentURL.searchParams.get(
    'orderId'
  )
}

