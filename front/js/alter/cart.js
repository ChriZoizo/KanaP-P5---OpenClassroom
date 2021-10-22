// Imports
const items = { ...localStorage };

//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products/";
// recuperation du contenus du localStorage
let cartList = JSON.parse(localStorage.getItem("cartContent"));
let urlChecker = window.location.pathname
let cartHTML = /cart.html/
let confirmationHTML = /confirmation.html/
if (cartHTML.test(urlChecker) == true){
loader(apiURL);
listenOrderButton()
}
else if (confirmationHTML.test(urlChecker) == true){
  displayConfirmationCode()
}

/* Fonction qui recupere les objets de l'API, et lance la fonction loop() avec le resultat
@param { string } url
@return { array } value
@return { array } value.colors
@return { String } value._id
@return { String } value.name
@return { Number } value.price
@return { String } value.imageUrl
@return { String } value.description
 */
function loader(url) {
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

/*  Fonction qui va parcourir le contenus du panier pour calculer le prix total du panier et le nombre d'articles,
et recuperer les information dans l'array allProducts qui contient toute l'API 

@param { Array } allProducts
@return { Number } totalQuantityOfProducts
@return { Number } totalCartPrice
@return { Array } product
@return { String } product._id
@return { String } product.color
@return { Number } product.quantity
@return { Object } productInfos
*/
function loopOverCartList(allProducts) {
  let totalQuantityOfProducts = 0;
  let totalCartPrice = 0;
  cartList.forEach(function (product) {
    let productInfos = allProducts.find(
      (element) => element._id == product._id
    );
    totalQuantityOfProducts += parseInt(product.quantity);
    totalCartPrice += parseInt(product.quantity) * parseInt(productInfos.price);
    populateWithCartProducts(productInfos, product);
  });
  displayTotalPriceAndQuantity(totalCartPrice, totalQuantityOfProducts);
}

// Fonction pour affficher les information des produits du paniers ainsi que les infos necessaires correspondant au produit dans l'API
function populateWithCartProducts(objectInfos, objectFromCart) {
  // ALTERNATIVE INNERHTML !!!!!
  const articleContainer = document.getElementById("cart__items");

  let newArticleItem = document.createElement("article");
  newArticleItem.setAttribute("class", "cart__item");
  newArticleItem.setAttribute("data-id", objectInfos._id);

  let newDivForImg = document.createElement("div");
  newDivForImg.setAttribute("class", "cart__item__img");

  let newImg = document.createElement("img");
  newImg.setAttribute("src", objectInfos.imageUrl);
  newImg.setAttribute("alt", objectInfos.altTxt);

  let newArticleItemContent = document.createElement("div");
  newArticleItemContent.setAttribute("class", "cart__item__content");

  let newArticleItemPriceContainer = document.createElement("div");
  newArticleItemPriceContainer.setAttribute(
    "class",
    "cart__item__content__titlePrice"
  );

  let newArticleItemTitle = document.createElement("h2");
  newArticleItemTitle.innerText =
    objectInfos.name + " (" + objectFromCart.color + ")";
  let newArticleItemPrice = document.createElement("p");
  newArticleItemPrice.setAttribute("class", "itemPrice")
  newArticleItemPrice.innerText = parseInt(objectInfos.price).toFixed(2) + " €";

  let newArticleItemSettings = document.createElement("div");
  newArticleItemSettings.setAttribute("class", "cart__item__content__settings");

  let newArticleQuantity = document.createElement("div");
  newArticleQuantity.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );

  let articleQuantity = document.createElement("p");
  articleQuantity.innerText = "Qté: " + objectFromCart.quantity;

  let newQuantityInput = document.createElement("input");
  newQuantityInput.setAttribute("type", "number");
  newQuantityInput.setAttribute("id", objectFromCart._id);
  newQuantityInput.setAttribute("class", "itemQuantity");
  newQuantityInput.setAttribute("name", "itemQuantity");
  newQuantityInput.setAttribute("min", "1");
  newQuantityInput.setAttribute("max", "100");
  newQuantityInput.setAttribute("value", objectFromCart.quantity);

  let newArticleDeleteButton = document.createElement("div");
  newArticleDeleteButton.setAttribute(
    "class",
    "cart__item__content__settings__delete"
  );

  let newDeleteButton = document.createElement("p");
  newDeleteButton.setAttribute("class", "deleteItem");
  newDeleteButton.innerText = "Supprimer";

  articleContainer.appendChild(newArticleItem);
  newArticleItem.appendChild(newDivForImg);
  newDivForImg.appendChild(newImg);
  newArticleItem.appendChild(newArticleItemContent);
  newArticleItemContent.appendChild(newArticleItemPriceContainer);
  newArticleItemPriceContainer.appendChild(newArticleItemTitle);
  newArticleItemPriceContainer.appendChild(newArticleItemPrice);
  newArticleItemContent.appendChild(newArticleItemSettings);
  newArticleItemSettings.appendChild(articleQuantity);
  newArticleItemSettings.appendChild(newQuantityInput);
  newArticleItemContent.appendChild(newArticleDeleteButton);
  newArticleDeleteButton.appendChild(newDeleteButton);

  /* ajouts addEventListener pour le bouton "supprimer"
    Type => click
    Fonction => appel la fonction "deleteItem" en envoyant l'array du produit en tant que parametre
    */
  newArticleDeleteButton.addEventListener("click", function () {
    deleteItem(objectFromCart);
  });
  /*  Ajout addEventListener pour le changement de l'input reglant la quantité
    Type => change
    Fonction => "if" => quantitée a 0, appel la fonction deleteItem avec l'array du produit en parametre
                "else" => appel la fonction changeQuantity avec la nouvelle quantitée en paramétre
      */
  newQuantityInput.addEventListener("change", function () {
    let newQuantity = Math.floor(newQuantityInput.value);
    if (newQuantity == 0) {
      deleteItem(objectFromCart);
    } else {
      changeQuantity(newQuantity);
    }
  });
  //SOUS-FONCTIONS assignés aux objets dans le localStorage.content
  /* Fonction pour supprimer l'objet => Demande une confirmation via une alerte */
  function deleteItem(object) {
    index = findIndexInCart(object);
    let confirm = window.confirm(
      "Etes vous sûr de vouloir supprimer cet article ?"
    );
    if (confirm == true) {
      cartList.splice(index, 1);
      localStorage.setItem("cartContent", JSON.stringify(cartList));
      location.reload();
    } else if (confirm == false) {
    }
  }
  // Fonction pour enregistrer une quantité d'un produit dans le localStorage
  function changeQuantity(newQuantity) {
    index = findIndexInCart(objectFromCart);
    objectFromCart.quantity = newQuantity;
    cartList.splice(index, 1, objectFromCart);
    localStorage.setItem("cartContent", JSON.stringify(cartList));
    console.log(objectFromCart.quantity);
    articleQuantity.innerText = "Qté: " + objectFromCart.quantity;
    displayTotalPriceAndQuantityRealTime()
  }
}

// FONCTION A COMMENTéE
function displayTotalPriceAndQuantity(totalPrice, totalQuantity) {
  let productInCartQuantityContainer = document.getElementById("totalQuantity");
  let cartPriceContainer = document.getElementById("totalPrice");

  productInCartQuantityContainer.innerText = totalQuantity;
  cartPriceContainer.innerText = totalPrice;
}

/* D / Fonction qui recupere le prix total et la quantité de produits total. 
    Le prix est calculer au prealable par la fonction "loop()" 
    @return { Number } totalPrice */
    function displayTotalPriceAndQuantityRealTime() {
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
    

function listenOrderButton(){
  let orderButton = document.getElementById("order");
orderButton.addEventListener("click", function(event)
 { event.preventDefault()
checkDataFromForm()
}
);
}

// FONCTION A COMMENTéE
function findIndexInCart(object) {
  for (const [index, element] of cartList.entries()) {
    if (element._id == object._id && element.color == object.color) {
      return index;
    }
  }
}

// FONCTION A COMMENTéE
function checkDataFromForm() {
  let contact = {};
  let productsIds = [];
  let regExChecker = /[<>\\{}]/;
  let regExNamesChecker = /[<>\\{}0-9]/;
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
    /*     contact["orderId"] = Math.random(); */
    console.log('##############################')
    cartList.forEach(function (product) {
      productsIds.push(product._id);
    });

    send(productsIds, contact);
  }
}

// FONCTION A COMMENTéE
function send(prod, contact) {
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




function switchViewToConfirm(orderId){
/*   window.location.replace("./confirmation.html?orderId="+ orderId) */
  window.open("./confirmation.html?orderId="+ orderId, '_blank')
  window.onload = function(){
  displayConfirmationCode()}
}

function displayConfirmationCode(){
  const currentURL = new URL(document.location.href); // Creation d'une nouvelle URL format URL
const id = currentURL.searchParams.get("orderId"); // Initialisation d'une variablke a partir du "params" ID

  let displayer = document.getElementById('orderId')
  displayer.innerText = id
}
