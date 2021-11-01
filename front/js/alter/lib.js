/*  les fichiers de ce dossier contiennent le meme code avec quelques partie differentes. 
En effet, j'ai refactoriser mon code plusieurts fois pour le plaisir, Malgré l'oublie de garder ces alternatives,
j'ai quand meme pensé a les garder a partir de mon peaufinage final

Tout ce qui est lié au export/import a été supprimé (parce que je suis stupide XD)
Les commentaires ne sont pas fini, ce sont des brouillons

Juste pour le plaisir d'apprendre (ça se voit pas trop la, car il y a peu de differences)*/

export default function apiUrl () {
  return 'http://localhost:3000/api/products/'
}

export class ObjectFromApi{
    cart(url) {
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
            this = value;
          })
          .catch(function (err) {
            console.log("ERROR WITH APP.");
            console.log(err);
          });
      }
      // Repeter operation pour different get, + Conditions 
}

export class Product {
  constructor (_id, quantity, color) {
    this._id = _id
    this.color = color
    this.quantity = quantity
  }
}

export class CartProduct {
  constructor (_id, name, imageUrl, altTxt, price, description, colors) {
    this.colors = colors
    this._id = _id
    this.name = name
    this.imageUrl = imageUrl
    this.altTxt = altTxt
    this.price = price
    this.description = description
  }
}

export class Contact {
  constructor (firstName, lastName, address, city, email) {
    this.firstName = firstName
    this.lastName = lastName
    this.address = address
    this.city = city
    this.email = email
  }

  checkName (name) {
    let regExNamesChecker = /[&@#*%+/!?|<>`"{}0-9]\\\[\]/
    if (regExNamesChecker.test(name) === true || name.toString().length == 0) {
      return [false, "Tu ne sais plus comment tu t'appelle ?"]
    } else {
      return true
    }
  }
  checkCity () {
    let regExChecker = /[&@#*%+/!?|<>`"{}]\\\[\]/
    if (
      regExChecker.test(this.city) === true ||
      this.city.toString().length == 0
    ) {
      return [false, "Nom non conforme, essaye encore !"]
    } else {
      return true
    }
  }
  checkAddress () {
    let regExChecker = /[@*%+/!?|<>\\\`\"{}]/
    if (
      regExChecker.test(this.address) === true ||
      this.address.toString().length <= 8
    ) {
      return [false, "Adresse non conforme, Tu sais plus ou tu habite ? ^^"]
    } else {
      return true
    }
  }
  checkEmail () {
    let regExChecker = /[*%+/?|<>\\\`\"{}]/
    if (
      regExChecker.test(this.email) === true ||
      this.email.toString().length <= 5
    ) {
      return [false, "Non mais la tu filoute clairement ! ;)"]
    } else {
      return true
    }
  }

  check () {
    let regExNamesChecker = /[&@#*%+/!?|<>`"{}0-9]\\\[\]/
    let regExChecker = /[&@#*%+/!?|<>`"{}]\\\[\]/
    if (
      regExNamesChecker.test(this.firstName) === true ||
      this.firstName.toString().length == 0 ||
      regExNamesChecker.test(this.lastName) === true ||
      this.lastName.toString().length == 0 ||
      regExChecker.test(this.address) === true ||
      this.address.toString().length <= 8 ||
      regExChecker.test(this.email) === true ||
      this.email.toString().length <= 5 ||
      regExChecker.test(this.city) === true ||
      this.city.toString().length == 0
    ) {
      return false
    } else {
      return true
    }
  }
}



