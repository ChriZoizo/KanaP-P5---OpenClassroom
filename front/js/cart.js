// Imports
const items = { ...localStorage };
console.log(items);
//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products/";

let cartList = JSON.parse(localStorage.getItem("cartContent"))
const listOfProducts = getProductsFromApi(apiURL);

function getProductsFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log("Fetch Step 1 OK");
        console.log(res);
        return res.json();
      }
    })
    .then(function (value) {
      console.log("Fetch Step 2 OK : Value is bottom");
      console.log(value);
      loop(value);
      return value;
    })
    .catch(function (err) {
      console.log("ERROR WITH APP.");
      console.log(err);
    });
}

function loop(array) {
  let totalQuantityOfProduct = 0;
  let totalCartPrice = 0;
  let cartList = JSON.parse(localStorage.getItem("cartContent"))
  cartList.forEach(function (product) {
    console.log(totalQuantityOfProduct);
    let productInfos = array.find(element => element._id == product._id)
    totalQuantityOfProduct += parseInt(product.quantity)
     totalCartPrice += (parseInt(product.quantity)* parseInt(productInfos.price))
console.log(productInfos)
console.log(product)
    populateWithCartProducts(
     productInfos,
      product,

    );
  });
  displayTotalPriceAndQuantity(totalCartPrice, totalQuantityOfProduct)
/*   AddingEventListener()
  surveyQuantity(); */
}

// Fonction pour affficher les information des produits du paniers ainsi que les infos necessaires correspondant au produit dans l'API
function populateWithCartProducts(
  objectInfos,
  objectFromCart,
) {
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
  newArticleItemPriceContainer.setAttribute("class", "cart__item__content__titlePrice");

  let newArticleItemTitle = document.createElement("h2");
  newArticleItemTitle.innerText = objectInfos.name + ' (' + objectFromCart.color +')';
  let newArticleItemPrice = document.createElement("p");
  newArticleItemPrice.innerText = parseInt(objectInfos.price).toFixed(2) + " €";

  let newArticleItemSettings = document.createElement("div");
  newArticleItemSettings.setAttribute("class", "cart__item__content__settings");

  let newArticleQuantity = document.createElement("div");
  newArticleQuantity.setAttribute("class", "cart__item__content__settings__quantity");

  let articleQuantity = document.createElement("p");
  articleQuantity.innerText = "Qté: ";

  let newQuantityInput = document.createElement("input");
  newQuantityInput.setAttribute("type", "number");
  newQuantityInput.setAttribute("id", objectFromCart._id);
  newQuantityInput.setAttribute("class", "itemQuantity");
  newQuantityInput.setAttribute("name", "itemQuantity");
  newQuantityInput.setAttribute("min", "1");
  newQuantityInput.setAttribute("max", "100");
  newQuantityInput.setAttribute("value", objectFromCart.quantity);

 
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
  console.log(newQuantityInput.value);

  newQuantityInput.addEventListener('change', function(){
    let cartList = JSON.parse(localStorage.getItem("cartContent"))
    i = 0
    cartList.forEach(function(objectInCart){
 while(objectInCart != objectFromCart){
i+=1}
    }) 
    console.log(cartList[i])
    let l = cartList.find(el => el = objectFromCart)
    let p = cartList.indexOf(el => el = l)
/*     let p = (el) => el = objectFromCart */
    console.log(p)
    console.log(cartList)
/*     objectFromCart.quantity = parseInt(newQuantityInput.value) */
    console.log(objectFromCart)
    console.log(cartList)
  })
}

function displayTotalPriceAndQuantity(totalPrice, totalQuantity){
  console.log("function displayTotalPRice begin")
  let productInCartQuantityContainer = document.getElementById("totalQuantity")
  let cartPriceContainer = document.getElementById("totalPrice")

productInCartQuantityContainer.innerText = totalQuantity
cartPriceContainer.innerText = totalPrice
console.log("function displayTotalPRice end")
}

/* function AddingEventListener(){
  console.log("function addingEventListener BEGIN")
  selectors = document.getElementsByName('itemQuantity')
  indexeur = 0
  selectors.forEach(function(selector){
    
    selector.addEventListener('change', changeQuantity(indexeur, selector.value))
    indexeur +=1
    console.log("VALEUR ADDING VENET LISTENER "+selector.value)
  })
  console.log("function addingEventListener END")
}


function surveyQuantity() {
  inputs = document.getElementsByClassName("");
}

function changeQuantity(index, newValue) {
  console.log('changeQuantity BEGIN')
  cart = JSON.parse(localStorage.getItem("cartContent"))
  console.log(cart[8].quantity)
  cart[index].quantity = newValue
  localStorage.setItem("cartContent", JSON.stringify(cart))
  
  console.log('changeQuantity END')
}
 */

/* function lol(){
  console.log("lol")
} */