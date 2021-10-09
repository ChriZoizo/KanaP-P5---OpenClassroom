function testing() {
    let display = localStorage.getItem("productInCart")
    let displayed = JSON.parse(display)
    console.log(displayed)
    return displayed
  }

  let display = localStorage.getItem("productInCart")
  let displayed = JSON.parse(display)
  
loop(displayed)
  console.log(displayed)


  function loop(arr) {
      for (let i = 0; i < arr.length; i++) {
 populateCardWithProducts(arr[i])
 console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")

}
  }




  function populateCardWithProducts(object){
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
      const articleContainer = document.getElementById("cart__items")
      let newArticleItemLeft = document.createElement("article")
      newArticleItemLeft.setAttribute("class", "cart__item")
      newArticleItemLeft.setAttribute("data-id", object._id)
      let newDivForImg = document.createElement('div')
      newDivForImg.setAttribute("class", "cart__item__img")
      let newImg = document.createElement("img")
      newImg.setAttribute("src", object.imageUrl)
      newImg.setAttribute("alt", object.altTxt)
let newArticleItemContent = document.createElement("div")
newArticleItemContent.setAttribute("classe", "cart__item__content")
let newArticleItemPriceContainer = document.createElement("div")
newArticleItemPriceContainer.setAttribute("class", "cart__item__content__titlePrice")
let newArticleItemTitle = document.createElement("h2")
newArticleItemTitle.innerText = object.name
let newArticleItemPrice = document.createElement("p")
newArticleItemPrice.innexText = object.price + " €"
let newArticleItemSettings = document.createElement('div')
newArticleItemSettings.setAttribute("class", "cart__item__content__settings" )
let newArticleQuantity = document.createElement("div")
newArticleQuantity.setAttribute("class", "cart__item__content__settings__quantity")
let articleQuantity = document.createElement("p")
articleQuantity.innerText = "90"

articleContainer.appendChild(newArticleItemLeft)
console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
newArticleItemLeft.appendChild(newDivForImg)
newDivForImg.appendChild(newImg)
      
  }
