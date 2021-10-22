// Imports

// Variables locales
const apiURL = "http://localhost:3000/api/products/"; // Declaration de l'URL de l'api
let cartList = JSON.parse(localStorage.getItem("cartContent")); // Contenus du localStorage dans variable
let urlChecker = window.location.pathname
let cartHTML = /cart.html/
let confirmationHTML = /confirmation.html/
if (cartHTML.test(urlChecker) == true){
fetchAndStart(apiURL);
listenOrderButton()
}
else if (confirmationHTML.test(urlChecker) == true){
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
function fetchAndStart(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log("Fetch Step 1 OK");
        console.log(res);
        return res.json();
      }
    })
    .then(function (value) {
      console.log("Fetch Step 2 OK : Initializing loop()");
      loopOverCartList(value);
      return value;
    })
    .catch(function (err) {
      console.log("ERROR WITH APP.");
      console.log(err);
    });
}

/* B / Fonction qui parcours le panier pour calculer le nombre d'items dans le panier et son prix total
en recuperant les information des produits correlées dans l'array passé en parametre
@param { Array } arrayFromApi      
@return { Number } totalQuantityOfProducts
@return { Number } totalCartPrice
@return { Array } product
        <<{ String } product._id
        <<{ String } product.color
        <<{ Number } product.quantity
@return { Object } productInfos */
function loopOverCartList(arrayFromApi) {
  let totalQuantityOfProducts = 0;
  let totalCartPrice = 0;
  cartList.forEach(function (product) {   // Boucle parcourant l'array globale cartList (panier)
    let productInfos = arrayFromApi.find( // variable qui recevras l'objet dans l'arrayFromApi ayant le meme _id [...]
      (element) => element._id == product._id //  [...] que l'element du panier product, a chaque tour de boucle
    );
    totalQuantityOfProducts += parseInt(product.quantity); // Ajoute le nombre d'items dans le panier
    totalCartPrice += parseInt(product.quantity) * parseInt(productInfos.price);
    populateWithCartProducts(productInfos, product);
  });
  displayTotalPriceAndQuantity();
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

function populateWithCartProducts(objectInfos, objectFromCart) {
// Declaration de la variable contenant le template de code HTML en y incluant les variable venant des params
  let htmlOfProduct = `<div class="cart__item__img">\  
  <img src="${objectInfos.imageUrl}" alt="${objectInfos.altTxt}">\
</div>\
<div class="cart__item__content">\
  <div class="cart__item__content__titlePrice">\
    <h2>${objectInfos.name}</h2>\
    <p class="itemPrice">${parseInt(objectInfos.price).toFixed(2)} €</p>\
  </div>\
  <div class="cart__item__content__settings">\
    <div class="cart__item__content__settings__quantity">\
      <p id="displayQty ${objectInfos._id} ${objectFromCart.color}">Qté : ${objectFromCart.quantity}</p>\
      <input id="input ${objectInfos._id} ${objectFromCart.color}"type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${objectFromCart.quantity}">\
    </div>\
    <div class="cart__item__content__settings__delete">\
      <p class="deleteItem" id="delete ${objectInfos._id} ${objectFromCart.color}">Supprimer</p>\
    </div>\
  </div>\
</div>`

  const articleContainer = document.getElementById("cart__items");
  let newArticleItemInner = document.createElement("article"); // Creation de l'element <article> et ses attributs
  newArticleItemInner.setAttribute("data-id", objectInfos._id + objectFromCart.color);
  newArticleItemInner.setAttribute("class", "cart__item");
  articleContainer.appendChild(newArticleItemInner);
  newArticleItemInner.innerHTML = htmlOfProduct // Injection du template
  
/* C - 1 / AJOUT ADDEVENTLISTENER
   C - 1 - a / addEventListener pour le bouton supprimer */
    document.getElementById(`delete ${objectInfos._id} ${objectFromCart.color}`).addEventListener("click", function () {
      deleteItem(objectFromCart);
    });

/* C - 1 - b / addEventListener sur les inputs reglant la quantité */
  document.getElementById(`input ${objectInfos._id} ${objectFromCart.color}`).addEventListener("change", function () {
    let newQuantity = Math.floor(document.getElementById(`input ${objectInfos._id} ${objectFromCart.color}`).value);
    if (newQuantity == 0) { // If... Else si la quantité atteint 0 lance deleteItem()
      deleteItem(objectFromCart);
    } else {
      changeQuantityInner(newQuantity) // Sinon change la quantité en appellant la fonction changeQuantityInner
    }
  });

/* C - 2 FONCTIONS A PORTéE REDUITE
   C - 2 - a / Fonction pour supprimer l'objet => Demande une confirmation via une alerte 
        @params { Array } object */
  function deleteItem(object) {
    index = findIndexInCart(object);
    let confirm = window.confirm(  // demande de confirmation
      "Etes vous sûr de vouloir supprimer cet article ?"
    );
    if (confirm == true) {  // Check si le resultat de la confirmation est "true" (ok)
      cartList.splice(index, 1); // supprime l'objet de l'array
      localStorage.setItem("cartContent", JSON.stringify(cartList)); // enregistre l'array dans le localStorage
      window.alert("Produit supprimé du panier") 
      location.reload(); // recharge la page et le code
    } else if (confirm == false) { 
      window.alert("Action de suppression annulée")
    }
  }

/* C - 2 - b / Fonction pour enregistrer les changement de quantité d'un produit dans le localStorage
    et modifie la quantité affiché sur la page
    @params {Number} quantity
    @var    {Number} index */
  function changeQuantityInner(quantity) {
  index = findIndexInCart(objectFromCart); // Recupere l'index via la fonction findIndexInCart()
    objectFromCart.quantity = quantity;
    cartList.splice(index, 1, objectFromCart);
    localStorage.setItem("cartContent", JSON.stringify(cartList));
    console.log(objectFromCart.quantity);
    document.getElementById(`displayQty ${objectInfos._id} ${objectFromCart.color}`).innerText = `Qté : ${quantity}`;
    displayTotalPriceAndQuantity()
  }
}

/* D / Fonction qui recupere le prix total et la quantité de produits total. 
    Le prix est calculer au prealable par la fonction "loop()" 
    @return { Number } totalPrice */
function displayTotalPriceAndQuantity() {
  const arrayQuantity = document.getElementsByClassName('itemQuantity') // Recupere tout les input de quantité
  const arrayPrice = document.getElementsByClassName('itemPrice') // Recupere tout les <p> contenant les prix
  let totalPrice = 0 
  let totalQuantity = 0
  let i = 0
for(let input of arrayQuantity){
  totalQuantity += parseInt(input.value, 10)
  totalPrice += (parseInt(input.value, 10) * parseInt(arrayPrice[i].innerHTML, 10))
  i +=1
}
const totalQuantityContainer = document.getElementById("totalQuantity");
const totalPriceContainer = document.getElementById("totalPrice")
totalQuantityContainer.innerText = totalQuantity;
totalPriceContainer.innerText = totalPrice;
return totalPrice
}

/* E / Fonction qui n'a comme but uniquement de lancer un EventListener sur le boutton "commader"*/
function listenOrderButton(){
  let orderButton = document.getElementById("order");
orderButton.addEventListener("click", function(event)
 { event.preventDefault()
checkDataFromForm()
}
);
}

/* F / Fonction permettant de trouver l'index d'un produit par rapport au localStorage.cartContent
    @params { Array } item
             <<{ String } _id
             <<{ String } color
             <<{Number} quantity
    @return {Number} index */
function findIndexInCart(item) {
  for (const [index, element] of cartList.entries()) {
    if (element._id == item._id && element.color == item.color) {
      return index;
    }
  }
}

/* G / Fonction qui recuperer les données entrée par l'utilisateur dans le formaulaire de commande,
verifie la presence de caracteres potentiellement dangereux, lance une alerte le cas echeant, sinon
deux objets seront crées (contact et products) puis envoyer en tant que parametre lkors de l'appel 
de la fonction "sendOrderToApi()"
    @return { Array } contact
             <<{ String } firstName       
             <<{ String } lastName       
             <<{ String } address       
             <<{ String } city       
             <<{ String } email  
    @return { Array } productsIds
             <<{ String } _id */
function checkDataFromForm() {
  let contact = {};
  let productsIds = [];
  let regExChecker = /[&<>\\\`\"{}]/;
  let regExNamesChecker = /[&<>\\\`\"\{}0-9]/;
  contact["firstName"] = document.getElementById("firstName").value.toString()
  contact["lastName"] = document.getElementById("lastName").value.toString()
  contact["address"] = document.getElementById("address").value.toString()
  contact["city"] = document.getElementById("city").value.toString()
  contact["email"] = document.getElementById("email").value.toString()

  if (regExNamesChecker.test(contact["firstName"]) == true) {
    console.log(contact.firstName)
    alert("Prénom nom conforme ! Présence de caractéres inattendus");
    window.stop()
  } else if (regExNamesChecker.test(contact["lastName"]) == true) {
    alert("Nom nom conforme ! Présence de caractéres inattendus");
    window.stop()
  } else if (regExChecker.test(contact["address"]) == true) {
    alert("Adresse nom conforme ! Présence de caractéres inattendus");
    window.stop()
  } else if (regExChecker.test(contact["city"]) == true) {
    alert("Ville non conforme ! Présence de caractéres inattendus");
    window.stop()
  } else if (regExChecker.test(contact["email"]) == true) {
    alert("Email nom conforme !");
    window.stop()
  } else if (
    regExNamesChecker.test(contact["firstName"]) == false &&
    regExNamesChecker.test(contact["lastName"]) == false &&
    regExChecker.test(contact["address"]) == false &&
    regExChecker.test(contact["city"]) == false &&
    regExChecker.test(contact["email"]) == false
  ) {
    cartList.forEach(function (product) {
      productsIds.push(product._id);
    });

    sendOrderToApi(productsIds, contact);
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
    
function sendOrderToApi(prod, contact) {
order = {}
order["products"]= prod
order["contact"]=contact
console.log(order)
let products = prod
  fetch(apiURL + "order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order)
  })
    .then(function (res) {
      if (res.ok) {
        console.log(res.orderId);
        return res.json();
      } else {
        window.alert("Erreure de l'application (fetch POST err)");
      }
    })
    .then(function (value) {
      switchViewToConfirm(value.orderId);
; 
    });
}

/* *** Fonctions pour le fichier "confirmation.html" UNIQUEMENT *** */

/* I - 1 / Fonction qui permet d'ouvrire un nouvel onglet en passant le parametre d'entrée en tant que
params de l'URL et appel la fonction displayConfirmationCode() 
    @params { String } orderId*/

function switchViewToConfirm(orderId){
/*   window.location.replace("./confirmation.html?orderId="+ orderId) */
  window.open("./confirmation.html?orderId="+ orderId, '_blank')
  window.onload = function(){
  displayConfirmationCode()}
}

/* I - 2 / Fonction qui permet d'afficher l'orderId sur la page "confirmation.html" en la recuperant
dans l'URL
*/
function displayConfirmationCode(){
  const currentURL = new URL(document.location.href); // Creation d'une nouvelle URL format URL
  document.getElementById('orderId').innerText = currentURL.searchParams.get("orderId"); // Injection de l'orderId recuperer dans l'URL et injecter dans le HTML

}
