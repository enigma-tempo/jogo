const computerCardSlot2 = document.querySelector('.board--opponent')
const playerCardSlot = document.querySelector('.board--player')


var snd = new Audio("src/sounds/attack.mp3");
// attacks differently according to how many cards are currently in play
function AI() {
  const currentHeroHealth = document.getElementById('playerhero').children[1].innerText;
  const opponentCards = document.querySelectorAll('.computer-cardinplay')
  const numOfOpponentCards = computerCardSlot2.childElementCount;
  const alliedCards = document.querySelectorAll('.player-cardinplay')
  const numOfAlliedCards = playerCardSlot.childElementCount;

  if(numOfAlliedCards == 0){
    attackPlayerHero(getSumOfAttack());
  } else { 
    action();
  }
  
  // checks if the player has lost
  const newHeroHealth = document.getElementById('playerhero').children[1].innerText;
  if(newHeroHealth < currentHeroHealth) {
    checkForLoss()
  }
  if(numOfOpponentCards >= 1) {
    snd.play();
  }
  for (let i=0; i<numOfAlliedCards; i++) {
    setTimeout(function() {
      let cardToCheck = parseInt(alliedCards[i].children[1].children[0].innerText);
      if(cardToCheck <= 0) { 
        alliedCards[i].remove();
      }
    },250);
  }
  for (let i=0; i<numOfOpponentCards; i++) {
    setTimeout(function() {
      let cardToCheck = parseInt(opponentCards[i].children[1].children[0].innerText);
      if(cardToCheck <= 0) { 
        opponentCards[i].remove();
      }
    },250);
  }
  return true
}

/* returns the element with the largest attack or health on the opponent's or player's side 
where the parameter 'largestValue' determines the value of n 
when nth value is returned*/
function findMaxOf(option, player, largestValue) {
  option = option == 'attack' ? 0 : 1;
  const cards = document.querySelectorAll('.'+player+'-cardinplay')
  let values = []
  let biggestValue = 0
  for(let i=0; i<cards.length; i++) {
    values.push(cards[i].children[option].children[0].innerText);
  }
  for(let i=0; i<values.length; i++) {
    if(cards[i].children[0].children[0].innerText > biggestValue) {
      biggestValue = cards[i].children[option].children[0].innerText;
    }
  }
  for (let i=0; i<largestValue; i++) {
    let index = values.indexOf(biggestValue);
    values.splice(index, 1);
    biggestValue = 0;
    for(let i=0; i<values.length; i++) {
      if(cards[i].children[0].children[0].innerText > biggestValue) {
        biggestValue = cards[i].children[option].children[0].innerText;
      }
    }
  }
  for(let i=0; i<cards.length; i++) {
    if(cards[i].children[option].children[0].innerText == biggestValue) {
      return cards[i]
    }
  }
  return null;
}

function checkForLoss() {
  if (document.getElementById('playerhero').children[1].innerText <= 0) {
    playerHero.style.display = "none";
  }
  if (window.getComputedStyle(playerHero).display === "none") {
    setTimeout(function() {
      alert("You've Lost!")
      location.reload();
    },1000);
  }
  return true
}

function getSumOfAttack() {
  let sumOfAttack = 0;
  const opponentCards = document.querySelectorAll('.computer-cardinplay')
  const numOfOpponentCards = computerCardSlot2.childElementCount;
  for(let i = 0; i < numOfOpponentCards; i++) {
    sumOfAttack += parseInt(opponentCards[i].children[0].children[0].innerText);
  }
  return sumOfAttack;
}

function showDamageLabel(currentAttackerAttack) {
  document.querySelector("#playerdamagevalue").innerText = "-" + currentAttackerAttack;
  document.querySelector("#playerdamagecontainer").style.visibility = "visible";
  document.getElementById('playerdamagecontainer').style.opacity="1";
  document.getElementById('playerdamagecontainer').style.transition="none";
  document.querySelector("#playerdamagelabel").classList.add("openMenuAnim");
  document.querySelector("#playerdamagevalue").classList.add("openMenuAnim");
  document.querySelector("#playerdamagelabel").classList.remove("fadeOutAnim");
  document.querySelector("#playerdamagevalue").classList.remove("fadeOutAnim");
  setTimeout(function() {
    document.querySelector("#playerdamagelabel").classList.add("fadeOutAnim");
    document.querySelector("#playerdamagevalue").classList.add("fadeOutAnim");
    document.querySelector("#playerdamagelabel").classList.remove("openMenuAnim");
    document.querySelector("#playerdamagevalue").classList.remove("openMenuAnim");
    setTimeout(function() {
      document.getElementById('playerdamagecontainer').style.visibility="hidden";
      document.getElementById('playerdamagecontainer').style.opacity="0";
    },1000);
  },2000);
  return true
}

// AI RELATED
function attackPlayerHero(damage) {
  document.getElementById('playerhero').children[1].innerText -= damage;
  showDamageLabel(damage);
}

function get_health_Modifier(numOfOpponentCards, start){
  let healthModifier = start;
  if (numOfOpponentCards == 2) {
    healthModifier += 2;
  } else{
    healthModifier = (numOfOpponentCards-1)*2;
  }
  return healthModifier;
}

function getAttack(slot) {
  if (slot == null) {
    return 0;
  }
  return slot.children[0].children[0].innerText;
}
function getHealth(slot){
  if (slot == null) {
    return 0;
  }
  return slot.children[1].children[0].innerText;
}
function setHealth(slot, value){
  slot.children[1].children[0].innerText = value; 
}
function ai_attack(attacker, attacked){

  if(attacker == null || attacked == null){
    return null;
  }


  var attackerAttack = getAttack(attacker);
  var attackerHealth = getHealth(attacker);
  var attackedAttack = getAttack(attacked);
  var attackedHealth = getHealth(attacked);

  if (attacked.classList.contains("hasDivineShield")) {
    attacked.classList.remove("hasDivineShield");
    attacked.children[2].classList.add("divineShieldBreak");
    setTimeout(function() {
      attacked.children[2].style.visibility = "hidden";
    },400);
  } else {
    setHealth(attacked, (attackedHealth - attackerAttack));
  }

  if (attacker.classList.contains("hasDivineShield")) {
    attacker.classList.remove("hasDivineShield");
    attacker.children[2].classList.add("divineShieldBreak");
    setTimeout(function() {
      attacker.children[2].style.visibility = "hidden";
    },400);
  }
  else {
    setHealth(attacker, (attackerHealth - attackedAttack));
  }

  if(getHealth(attacked) < 1) { 
    attacked.remove();
  }
  if(getHealth(attacker) < 1) { 
    attacker.remove();
  }

}

function lookForTaunts(){
  const alliedCards = document.querySelectorAll('.player-cardinplay');
  for (let index = 0; index < alliedCards.length; index++) {
    if (alliedCards[index].classList.contains("hasTaunt")) {
      return true;
    }
  }
  return false;
}

function action() {
  const numOfOpponentCards = computerCardSlot2.childElementCount;
  const numOfAlliedCards = playerCardSlot2.childElementCount;

  let healthModifier = get_health_Modifier(numOfOpponentCards, (11 - numOfAlliedCards) );

  if (lookForTaunts()) {
    var allied = 0;
    while (!playerCardSlot2.children[allied].classList.contains("hasTaunt")) {
      allied++;
    }
    for (let i=0; i<numOfOpponentCards; i++) {
      if (playerCardSlot2.children[allied].classList.contains("hasTaunt")) {
        var maxOpponentAttack = findMaxOf('attack','computer',0);
        ai_attack(maxOpponentAttack, playerCardSlot2.children[allied]);
      } else {
        action();
      }
    }
  }
  else if((document.getElementById('playerhero').children[1].innerText <= healthModifier) || numOfAlliedCards == 0) {
    attackPlayerHero(getSumOfAttack());
  }
  // otherwise attacks the highest attack card on the board and attacks the hero with the other
  else {
        if (numOfOpponentCards > 0) {
          ai_attack_move(numOfOpponentCards);
        }
      } 
  return true
}

function ai_attack_move(numOfOpponentCards){
  let sumOfAttack = getSumOfAttack();
  for (let i=0; i<numOfOpponentCards; i++) {
    var maxOpponentAttack = findMaxOf('attack','computer',i);
    var maxPlayerAttack = findMaxOf('attack','player',i);
    if(maxPlayerAttack == null){
      attackPlayerHero(getAttack(maxOpponentAttack));
    }
    else{
      if((getHealth(maxPlayerAttack) <= getAttack(maxOpponentAttack)) || (getHealth(maxPlayerAttack) <= sumOfAttack))
        ai_attack(maxOpponentAttack, maxPlayerAttack);
      else attackPlayerHero(getAttack(maxOpponentAttack));
    }
  }
}