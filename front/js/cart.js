// Imports
const items = { ...localStorage };
//Declaration de l'URL de l'api
const apiURL = "http://localhost:3000/api/products/";

let cartList = JSON.parse(localStorage.getItem("cartContent"));
const listOfProducts = loader(apiURL);

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
    let productInfos = allProducts.find((element) => element._id == product._id);
    totalQuantityOfProducts += parseInt(product.quantity);
    totalCartPrice += parseInt(product.quantity) * parseInt(productInfos.price);
    populateWithCartProducts(productInfos, product);
  });
  displayTotalPriceAndQuantity(totalCartPrice, totalQuantityOfProducts);
}

// Fonction pour affficher les information des produits du paniers ainsi que les infos necessaires correspondant au produit dans l'API
function populateWithCartProducts(objectInfos, objectFromCart) {
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
  newArticleItemPrice.innerText = parseInt(objectInfos.price).toFixed(2) + " €";

  let newArticleItemSettings = document.createElement("div");
  newArticleItemSettings.setAttribute("class", "cart__item__content__settings");

  let newArticleQuantity = document.createElement("div");
  newArticleQuantity.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );

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

  newArticleDeleteButton.addEventListener("click", function () {
    index = findIndexInCart(objectFromCart);
    let confirm = window.confirm(
      "Etes vous sûr de vouloir supprimer cet item ?"
    );
    if (confirm == true) {
      cartList.splice(index, 1);
      localStorage.setItem("cartContent", JSON.stringify(cartList));
      location.reload();
    }
  });
  
  newQuantityInput.addEventListener("change", function () {
    index = findIndexInCart(objectFromCart);
    objectFromCart.quantity = newQuantityInput.value;
    cartList.splice(index, 1, objectFromCart);
    localStorage.setItem("cartContent", JSON.stringify(cartList));
  });
}

function displayTotalPriceAndQuantity(totalPrice, totalQuantity) {
  console.log("function displayTotalPRice begin");
  let productInCartQuantityContainer = document.getElementById("totalQuantity");
  let cartPriceContainer = document.getElementById("totalPrice");

  productInCartQuantityContainer.innerText = totalQuantity;
  cartPriceContainer.innerText = totalPrice;
  console.log("function displayTotalPRice end");
}

function findIndexInCart(object) {
  for (const [index, element] of cartList.entries()) {
    if (element._id == object._id && element.color == object.color) {
      return index;
    }
  }
}
