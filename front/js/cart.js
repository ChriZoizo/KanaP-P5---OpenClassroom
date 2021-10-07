function testing(arr) {
    let objectToSave = JSON.stringify(arr)
    localStorage.setItem("productInCart", objectToSave)
    let display = localStorage.getItem("productInCart")
    let displayed = JSON.parse(display)
    console.log(displayed)
  }

  let display = localStorage.getItem("productInCart")
  let displayed = JSON.parse(display)
  console.log(displayed)


  function loop(arr) {
      for (let i = 0; i < arr.length; i++) {
 populateCardWithProducts(arr[i])

}
  }

  function populateCardWithProducts(object){
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
let newArticleItemContentTitlePrice = document.createElement("div")
newArticleItemContentTitlePrice.setAttribute("class", "cart__item__content__titlePrice")
let newArticleItemContentTitle = document.createElement("h2")
newArticleItemContentTitle.innerText = object.name
let newArticleItemContentPrice = document.createElement("p")
newArticleItemContentPrice.innexText = object.price + " €"
let newArticleItemContentSettings = document.createElement('div')
newArticleItemContentSettings.setAttribute("class", "cart__item__content__settings" )

      
  }
