
// Fonction pour recuperer et afficher la page d'un produit
function displayOneProduct(object) {
      // recuperation du conteneur pour l'image, creation de l'element
    const imageContainer = document.getElementById("item__img")
    let productImg = document.createElement("img")
      // ajout des attributs et ajout dans le code HTML
    productImg.setAttribute('src', object.imageUrl)
    productImg.setAttribute('alt', object.altTxt)
    imageContainer.appendChild(productImg)
      // Recuperation de l'element conteneur pour le nom du produit
    const h1Container = document.getElementById("title")
      // Injection dans le code HTML
    h1Container.innerText = object.name

    const priceContainer = document.getElementById("price")
    priceContainer.innerText = object.price

    const descriptionContainer = document.getElementById("description")
    descriptionContainer.innerText = object.description
    
    const colorSelector = document.getElementById("colors")
    let colorArray = object.colors
    
    for (i = 0; i < (object.colors.length); i ++){
        let colorOption = document.createElement('option')
        colorOption.setAttribute("value", object.colors[i])
        colorOption.innerText = object.colors[i]
        colorSelector.appendChild
    }

}

// Event Listener sur le bouton  addToCart pour l'ajout au panier
let addToCartButton = document.getElementById('addToCart')
addToCartButton.addEventListener('click')
