const apiURL = "http://localhost:3000/api/products/";

export default class Tester{
  constructor(value){
    this.value = value
  }
}
export class ApiURL{
  constructor(){
    this.url = "http://localhost:3000/api/products/"
  }
}
export class Lol{
  constructor(lol){
  this.lol=lol}
}
export function jus(){
  console.log('JUS DE FRUIT')
}

export function getProductsFromApi(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
          console.log("Fetch Step 1 : res is OK")
        return res.json();
      }
    })
    .then(function (value) {
      console.log("Fetch OK : Res returned");
      console.log(value);
      return value;
    })
    .catch(function (err) {
        console.log("ERROR WITH APP.")
      console.log(err);
    });
}
