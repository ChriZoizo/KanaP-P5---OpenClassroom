// Variable ????
const keyForProductInCart = "cartContent";
const currentUrlInString = document.location.href; // URL actuelle en string
const currentURL = new URL(currentUrlInString); // Creation d'une nouvelle URL format URL
const id = currentURL.searchParams.get("id"); // Initialisation d'une variablke a partir du "params" ID

// Initialisation des variable/Constantes/...
const apiURL = "http://localhost:3000/api/products";
/* let cart = []; */
productInfoArray = []; // Nouvel array qui contiendra les infos du produits a afficher

getProductFromApi(apiURL);


// Fonction de recuperation du contenus de l'API
async function getProductFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log("FETCH Etape 1 : OK");
        console.log(res);
        return res.json();
      }
    })
    // Ici je reecupere les infos du produits voulusvia son "_id"
    // et je passe ses infos en parametre lors de l'appel de la fonction d'affichage
    .then(function (value) {
      productInfoArray = value.find((el) => el._id == id);
      displayOneProduct(productInfoArray);
      return value.find((el) => el._id == id);
    })
    .catch(function (err) {
      console.log("FETCHING Erreur !");
      console.log(err);
      return err;
    });
}

// Fonction pour afficher les informations du produit
function displayOneProduct(object) {
  const imageContainer = document.getElementsByClassName("item__img");
  let productImg = document.createElement("img");
  console.log("Take IMAGE URL");
  productImg.setAttribute("src", object.imageUrl);
  productImg.setAttribute("alt", object.altTxt);
  imageContainer[0].appendChild(productImg);
  const h1Container = document.getElementById("title");
  h1Container.innerText = object.name;
  const priceContainer = document.getElementById("price");
  priceContainer.innerText = object.price;
  const descriptionContainer = document.getElementById("description");
  descriptionContainer.innerText = object.description;
  const colorSelector = document.getElementById("colors");
  // Boucle sur l'element array "colors" contenant les couleurs pour les afficher dans le selecteur
  for (i = 0; i < object.colors.length; i++) {
    let thisColor = object.colors[i];
    let colorOption = document.createElement("option");
    colorOption.setAttribute("value", thisColor);
    colorOption.innerText = thisColor;
    colorSelector.appendChild(colorOption);
  }
}

// Fonction pour recuperer les informations de quantité et de couleur ainsi que l'ID
// et retourne un array. Si il manque une info, retourne une alert()
function collectDataForCart() {
  let productToAdd = {};
  let colorSelector = document.getElementById("colors");
  let quantityForm = document.getElementById("quantity").value;

  let selectedColor = colorSelector.options[colorSelector.selectedIndex].value;
  if (selectedColor == "" && quantityForm == 0) {
    alert("Veuillez choisir une couleur et definir une quantitée");
  } else if (quantityForm == 0) {
    alert("Veuillez Choisir une quantitée.");
  } else if (selectedColor == "") {
    alert("Veuiller choisir une couleur");
  } else {
    productToAdd["_id"] = productInfoArray._id;
    productToAdd["color"] = selectedColor;
    productToAdd["quantity"] = parseInt(quantityForm);
    return productToAdd;
  }
}

// Fonction pour verifier la presence d'un panier existant dans le localStorage : 
// renvoie le panier sous forme d'array si il existe deja.
// Creer une array vide si le panier n'est pas existant
function collectDataFromCart() {
  let cartContent = { ...localStorage };
  if (cartContent.cartContent != null || cartContent.cartContent != undefined) {
    array = JSON.parse(localStorage.getItem("cartContent"));
    return array;
  } else {
    array = new Array();
    return array;
  }
}


// Function qui verifie le contenus de l'array qui contient les produits du panier:
// Si un produit identique au produit a ajouter est deja present, on modifie la quantité de l'objet
// Sinon une nouvelle entrée est créer
function addToCart() {
  let productToAdd = collectDataForCart();
  console.log("Array du nouveau produit ");
  console.log(productToAdd);
  let arrayOfCartedProducts = collectDataFromCart();
  console.log("addToCart retour de la fontion takeInfoFromCart ");
  console.log(arrayOfCartedProducts);

  let indexeur = 0;
  let alreadyPresent = false;
  arrayOfCartedProducts.forEach(function (element) {
    console.log(element);
    if (
      element._id == productToAdd._id &&
      element.color == productToAdd.color
    ) {
      productToAdd.quantity += element.quantity;
      arrayOfCartedProducts.splice(indexeur, 1, productToAdd);
      alreadyPresent = true
    }
    indexeur += 1;
  });
  if (alreadyPresent == false) {
    console.log("CHECKER");
    arrayOfCartedProducts.push(productToAdd);
  }

  console.log(arrayOfCartedProducts);
  localStorage.setItem("cartContent", JSON.stringify(arrayOfCartedProducts));
  console.log(productToAdd);
  let test = JSON.parse(localStorage.getItem("cartContent"));
  console.log(test);
}

// Event Listener sur le bouton  addToCart pour l'ajout au panier
let addToCartButton = document.getElementById("addToCart");
addToCartButton.addEventListener("click", addToCart);