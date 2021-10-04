function displayOneProduct(object) {
    const imageContainer = document.getElementById("item__img")
    let productImg = document.createElement("img")
    productImg.setAttribute('src', object.imageUrl)
    productImg.setAttribute('alt', object.altTxt)
    imageContainer.appendChild(productImg)

    const h1Container = document.getElementById("title")
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


let addToCartButton = document.getElementById('addToCart')
addToCartButton.addEventListener('click')
