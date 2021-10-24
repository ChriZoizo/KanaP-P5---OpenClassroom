/*  les fichiers de ce dossier contiennent le meme code avec quelques partie differentes. 
En effet, j'ai refactoriser mon code plusieurts fois pour le plaisir, Malgré l'oublie de garder ces alternatives,
j'ai quand meme pensé a les garder a partir de mon peaufinage final

Tout ce qui est lié au export/import a été supprimé (parce que je suis stupide XD)
Les commentaires ne sont pas fini, ce sont des brouillons

Juste pour le plaisir d'apprendre (ça se voit pas trop la, car il y a peu de differences)
*/
// Imports
import apiUrl from "./lib"
// A / Variables
const apiURL = apiUrl() //Declaration de l'URL de l'api
const currentURL = // Declaration d'une variable contenant l'URL actuelle
  window.location.protocol +
  '//' +
  window.location.host +
  window.location.pathname
const productURLFirstPart = new URL(
  currentURL.replace('index.html', 'product.html')
) // Creation de la base de l'url qui servira au peuplé les liens des produits


// CODE
getProductsFromApi(apiURL) // appel de la fonction de fetch avec l'url de l'API en params

/* B / Fonction permettant le fetch de l'api puis appel la fonction "populateIndexWithProducts()" 
en lui passant le resultat du fetch en parametre 
  @params { String } url
  @return { Array } value */
function getProductsFromApi (url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        console.log('Fetch Step 1 : res is OK')
        return res.json()
      }
    })
    .then(function (value) {
      console.log('Fetch Ok : Returning res')
      console.log(value)
      populateIndexWithProducts(value)
      return value
    })
    .catch(function (err) {
      console.log('ERROR WITH APP.')
      console.log(err)
    })
}

/* C / Fonction qui passe en revus les items de l'array passé en parametre et affiche certaines 
informations les produits sur la page HTML en modifiant le DOM
@params {Array} allProducts
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
