const apiURL = 'http://localhost:3000/api/products/' //Declaration de l'URL de l'api
const currentURL = // Declaration d'une variable contenant l'URL actuelle
  window.location.protocol +
  '//' +
  window.location.host +
  window.location.pathname
const productURLFirstPart = new URL(   // Creation de la base de l'url qui servira de liens produits
  currentURL.replace('index.html', 'product.html')
) 
var keys='z';
window.addEventListener('keydownf', function(e) {
keys += e.key
console.log(keys)
}
, 1000)
;
console.log(keys)
getProductsFromApi(apiURL) // appel de l'application (commence par le fetch de l'API)

/* A / Fonction permettant le fetch de l'api puis appel la fonction B 
en lui passant le resultat du fetch en parametre 
@params { String } url
@return { Object } value
         >> { Array } product
         >> { String } _id
         >> { String } name
         >> { String } imageUrl
         >> { String } altTxt
         >> { String } description  */
function getProductsFromApi (url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log("API Res OK")
        return res.json()
      }
    })
    .then(function (value) {
      populateIndexWithProducts(value)
      return value
    })
    .catch(function (err) {
      console.log(err)
    })
}

/* B / Fonction qui passe en revus les items de l'Objet passé en parametre et affiche certaines 
informations des produits sur la page HTML via le DOM
@params { Object } allProducts
         >> { Array } product
         >> { String } _id
         >> { String } name
         >> { String } imageUrl
         >> { String } altTxt
         >> { String } description */
function populateIndexWithProducts (allProducts) {
  for (let object of allProducts) {
    let link = productURLFirstPart + '?id=' + object._id // Creation de l'url href du produits
    const itemContainer = document.getElementById('items') // Ciblage du conteneur des <article>

    let newLink = document.createElement('a') // Creation <a>
    newLink.setAttribute('href', link)

    let newArticle = document.createElement('article') // Creation <article>

    let newImg = document.createElement('img') // Creation <img>
    newImg.setAttribute('src', object.imageUrl)
    newImg.setAttribute('alt', object.altTxt + ', ' + object.name)

    let newH3 = document.createElement('h3') // Creation <h3>
    newH3.setAttribute('class', 'productName')
    newH3.innerHTML = object.name

    let newP = document.createElement('p') // Creation <p>
    newP.setAttribute('class', 'productDescription')
    newP.innerText = object.description

    itemContainer.appendChild(newLink) // injection des éléments dans le code HTML
    newLink.appendChild(newArticle)
    newArticle.appendChild(newImg)
    newArticle.appendChild(newH3)
    newArticle.appendChild(newP)
  }
}
