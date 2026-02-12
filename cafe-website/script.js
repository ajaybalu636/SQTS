let quantities = [0, 0];
let prices = [5, 4];
let total = 0;

function increase(index, price) {
  quantities[index]++;
  total += price;
  document.getElementById("qty"+index).innerText = quantities[index];
  document.getElementById("total").innerText = total;
}

function decrease(index) {
  if (quantities[index] > 0) {
    quantities[index]--;
    total -= prices[index];
  }
  document.getElementById("qty"+index).innerText = quantities[index];
  document.getElementById("total").innerText = total;
}