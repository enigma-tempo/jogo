// imports module 'Deck' from deck.js
// import Deck from "./deck.js"
// defines global variables
var gameStartsAt;
var gameEndAt;
var iElements = null;
var currentAttacker = null;
var collision = new Boolean(false);
var canAttack = new Boolean(false);
var playersTurn = new Boolean(false);
var alreadyMocked = new Boolean(false);
var gameIsWon = new Boolean(false);
var isTutorial = new Boolean(false);
var tauntExists = new Boolean(false);
var manaCost = null;
var manaCapacity = 1;
var mana = manaCapacity;
var maxOpponentCardsInPlay = 7;
var cardplaceSnd = new Audio('src/sounds/cardplace.mp3');
var mockSnd = new Audio('src/sounds/mock.mp3');
// var jobsdoneSnd = new Audio('src/voiceovers/innkeeper_jobs_done.mp3');
var playerturnSnd = new Audio('src/sounds/playerturn.mp3');
var heropowerSnd = new Audio('src/sounds/heropower.mp3');
var amount = 0;
var oldNumOfChild = 0;
var playerHandArray = [];
var getNameOfElement = '';
var getElementEffect = '';
var getElementEffectParams = '';
// defines constant variables to refer to HTML elements
const computerCardSlot = document.querySelector('.board--opponent');
const playerCardSlot2 = document.querySelector('.board--player');
const hand = document.querySelector('.cards');
const computerDeckElement = document.querySelector('.computer-deck');
const playerDeckElement = document.querySelector('.player-deck');
const svg = document.getElementById('svg');
const svgpath = document.getElementById('svgpath');
const body = document.getElementById('body');
const playerHero = document.getElementById('playerhero');
const cpuHero = document.getElementById('opposinghero');
const cardinplay = document.getElementsByClassName('cardinplay');
const collisionbox = document.getElementById('collisionbox');
const draggableElements = document.getElementsByClassName('card');
const manaElement = document.getElementById('mana');
let originalPlayerDeck, originalComputerDeck, playerDeck, computerDeck, inRound;
const win_coin = 10;
let data_game = getGameData();

/* calls and defines the startGame function to perform 
required functions when the page is loaded. */
function startGame() {
  setGameConfig(data_game);
  originalPlayerDeck = new Deck(data_game[0]['deck']);
  playerDeck = new Deck(data_game[0]['deck']);
  playerDeck.shuffle();
  computerDeck = new Deck(data_game[1]['deck']);
  originalComputerDeck = new Deck(data_game[1]['deck']);
  computerDeck.shuffle();
  inRound = false;
  updateDeckCount();
  // if the player is playing the tutorial start with one 1 mana card
  if (isTutorial == true) {
    for (let i = 0; i < playerDeck.cards.length; i++) {
      if (playerDeck.cards[i]['mana'] == 1) {
        hand.appendChild(playerDeck.cards[i].getPlayerCardsInHandHTML());
        break;
      }
    }
    // remove a card from both the player's and computer's deck
    playerDeck.cards.shift();
    computerDeck.cards.shift();
    updateDeckCount();
    /* checks to see what cards can be played and if the player has the 
    required mana to play each card */
    checkForRequiredMana();
  } else {
    /* start with 3 cards in hand initially with one of the cards being a 
    guaranteed 1 mana card */
    let x = 4;
    for (let i = 0; i < x; i++) {
      hand.appendChild(playerDeck.cards[0].getPlayerCardsInHandHTML());
      playerDeck.cards.shift();
      computerDeck.cards.shift();
      updateDeckCount();
    }
    for (let i = 0; i < playerDeck.cards.length; i++) {
      if (playerDeck.cards[i]['mana'] == 1) {
        hand.appendChild(playerDeck.cards[i].getPlayerCardsInHandHTML());
        playerDeck.cards.shift();
        computerDeck.cards.shift();
        updateDeckCount();
        break;
      }
    }
    checkForRequiredMana();
  }
  createManaCrystal();
  /* ensures the player i playing the tutorial by checking if the 
  computer's health is set to 10 */
  if (document.querySelector('.opposingHeroHealth').innerText == 10) {
    isTutorial = true;
  }
}

function placeCardFunc() {
  if (collision == true) {
    var found = false;
    setTimeout(function () {
      for (var i = 0; i < originalPlayerDeck.cards.length; i++) {
        if (originalPlayerDeck.cards[i]['name'] == getNameOfElement && playerCardSlot2.childElementCount < 7) {
          found = true;
          var manaCost = parseInt(originalPlayerDeck.cards[i]['mana']);
          mana -= manaCost;
          manaElement.innerHTML = mana + '/' + manaCapacity;
          if (originalPlayerDeck.cards[i]['type'] == 'Agente') playerCardSlot2.appendChild(originalPlayerDeck.cards[i].getPlayerHTML());
          else {
            let ele = document.getElementById('collisionbox');
            let item = originalPlayerDeck.cards[i].getPlayerCardsInHandHTML();
            ele.appendChild(item);
            item.classList.add('magicCardPlaced');
            item.id = 'magicCardPlaced';
            item.lastChild.id = 'magicCard';
          }
          checkForRequiredMana();
          updateManaGUI();
          cardPlace('player', originalPlayerDeck.cards[i]);
          cardplaceSnd.play();
          /* lets the user know to press the end turn button as they have 
        no more cards left to play */
          if (hand.childElementCount == 0) {
            document.getElementById('gifhint').style.backgroundImage = "url('src/hints/end_turn.gif')";
            document.getElementById('texthint').innerText = 'Press the end turn button...';
          }
          break;
        }
      }
    }, 0.2);
  }
}

/* defines function that updates the mana GUI at the bottom left of the screen
whenever mana is spent or the player's turn has just started  WTF*/
function updateManaGUI() {
  var manaCrystals = document.getElementsByClassName('manabox');
  for (let i = 0; i < manaCrystals.length; i++) {
    if (i == manaCost) {
      break;
    }
    manaCrystals[manaCrystals.length - (i + 1)].style.backgroundColor = 'black';
  }
}

// defines a new function that adds an event listener (mouseup) to all elements with the class name 'card' then calls the placeCardFunc()
function placeCard() {
  document.querySelectorAll('.card').forEach(function (e) {
    e.addEventListener('mouseup', placeCardFunc);
  });
}
/* defines new function that updates the HTML and makes it equal to the current number of cards in each deck 
then checks if either the players or computers deck is empty and if so the deck is no longer made visible */
function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards;
  playerDeckElement.innerText = playerDeck.numberOfCards;
  if (computerDeckElement.innerText === '0') {
    computerDeckElement.style.display = 'none';
  } else {
    computerDeckElement.style.display = 'block';
  }

  if (playerDeckElement.innerText === '0') {
    playerDeckElement.style.display = 'none';
  } else {
    playerDeckElement.style.display = 'block';
  }
}
/* adds an event listener to the end turn button where when clicked plays an audio file and calls the 
opponentTurn function then checks if the audio has been played yet and if not plays it and sets audioIsPlayed to false */
document.getElementById('endturn').addEventListener('click', function () {
  let t = 500;
  for (let index = 0; index < playerCardSlot2.childElementCount; index++) {
    const element = playerCardSlot2.children[index];
    let player_card_effects = element.children[4].innerHTML.split(':');
    if (player_card_effects[0] == 'end_turn') {
      t += 1000;
      effect_dict[player_card_effects[1]]('player', element.children[5].innerHTML);
    }
  }

  setTimeout(() => {
    var endturn = new Audio('src/sounds/endturn.mp3');
    endturn.play();
    document.querySelector('#endturn').style.zIndex = '50';
    document.getElementById('gifhint').style.backgroundImage = "url('src/hints/attack.gif')";
    document.getElementById('texthint').innerText = 'Click on an green glowing allied card then click on an enemy to attack.';
    document.getElementById('opposinghero').removeEventListener('mousedown', setAttacked);
    document.getElementById('playerheropower').removeEventListener('click', useHeroPower);
    opponentTurn();
  }, t);
});
/* defines new function that calls the getComputerHTML function from deck.js using the first card at the top of the computers' deck and appends as a child to 
the computers board and uses the shift method to remove the first card in the array then proceeds to call both updateDeckCount and playerTurn functions. */
function opponentTurn() {
  playersTurn = false;
  for (let i = 0; i < playerCardSlot2.childElementCount; i++) {
    playerCardSlot2.children[i].style.boxShadow = 'none';
  }
  for (let i = 0; i < hand.childElementCount; i++) {
    hand.children[i].children[0].children[4].style.border = 'solid 4px rgb(56, 56, 56)';
  }
  document.getElementById('playerheropower').style.boxShadow = 'none';
  document.body.style.cursor = 'url(src/cursor/spectate.png) 10 2, auto';
  document.getElementById('computerTurn').style.display = 'block';
  document.getElementById('endturn').style.backgroundColor = 'grey';
  document.getElementById('endturn').innerText = 'TURNO INIMIGO';
  if (document.querySelector('.board--opponent').childElementCount > 0) {
    /* calls function defined in AI.js (determines what the computer 
    attacks and with what minions) */
    setTimeout(function () {
      AI();
    }, 1250);
  }
  // places card if number of cards on board has not reached the max amount (10)
  async function e() {
    let opponentCardsInPlay = computerCardSlot.childElementCount;
    if (opponentCardsInPlay < maxOpponentCardsInPlay) {
      if (opponentCardsInPlay >= 0) {
        computerCardSlot.style.transform = 'translateY(-3.5%)';
      }
      await computerCardPlace(maxOpponentCardsInPlay - opponentCardsInPlay);
      // to fix position of board GUI onclick
    }
    // then calls the player turn function allowing the player to play his turn
    playerTurn();
  }
  e();
}
/* places a card onto the computers board whose mana is equal 
to the player's mana capacity */
function computerCardPlace(numero_cartas) {
  var mana = manaCapacity;
  var hand = 0;
  function iterate_() {
    let card = parseInt(Math.random() * (computerDeck.cards.length - 1));
    if (parseInt(computerDeck.cards[card]['mana']) <= mana) {
      if (computerDeck.cards[card]['type'] == 'Agente') {
        let opponentCard = computerDeck.cards[card].getComputerHTML();
        computerCardSlot.appendChild(opponentCard);
      } else {
        let item = computerDeck.cards[card].getPlayerCardsInHandHTML();
        let ele = document.getElementById('collisionbox2');
        ele.appendChild(item);
        item.classList.add('magicComputerCardPlaced');
        setTimeout(() => {
          item.remove();
        }, 2000);
      }
      cardPlace('computer', computerDeck.cards[card]);
      computerDeck.cards.splice(computerDeck.cards.indexOf(card), 1);
      numero_cartas--;
      let cost = parseInt(computerDeck.cards[card]['mana']);
      mana -= cost;
    }
    hand++;
  }

  function complement() {
    if (mana > 0 && computerDeck.cards.length > 0 && computerCardSlot.childElementCount) {
      for (let i = 0; i < computerDeck.cards.length; i++) {
        if (parseInt(computerDeck.cards[i]['mana']) <= mana) {
          setTimeout(function () {
            if (computerDeck.cards[i]['type'] == 'Agente') {
              let opponentCard = computerDeck.cards[i].getComputerHTML();
              computerCardSlot.appendChild(opponentCard);
            } else {
              let ele = document.getElementById('collisionbox2');
              ele.appendChild(computerDeck.cards[i].getPlayerCardsInHandHTML());
              ele.children[0].classList.add('magicComputerCardPlaced');
              setTimeout(() => {
                ele.children[0].remove();
              }, 2000);
            }
            cardPlace('computer', computerDeck.cards[i]);
            computerDeck.cards.splice(computerDeck.cards.indexOf(i), 1);
            numero_cartas--;
            let cost = parseInt(computerDeck.cards[i]['mana']);
            mana -= cost;
          }, 800);
          break;
        }
        hand++;
      }
    }
    updateDeckCount();
  }

  return new Promise((resolve, reject) => {
    var draw = setInterval(() => {
      if (mana > 0 && hand < 5 && numero_cartas > 0 && computerDeck.cards.length > 0 && computerCardSlot.childElementCount < 8) {
        setTimeout(() => {
          iterate_();
        }, 400);
      } else {
        clearInterval(draw);
        complement();
        resolve();
      }
    }, 1000);
  });
}

/* the player turn function allows the player ot place cards and attack 
computer minions increments the mana capcity if manacapcity is not at 
the maximum (10) and displays the mana and manaCapacity in an element's
innerHTML and checks what cards can played and if the player has the
required mana to play the card for every card in the player's hand and
if so makes the boxShadow css property green*/
function playerTurn() {
  playersTurn = true;
  if (manaCapacity < 10) {
    manaCapacity++;
    createManaCrystal();
  }
  mana = manaCapacity;
  manaElement.innerHTML = mana + '/' + manaCapacity;
  var manaCrystals = document.getElementsByClassName('manabox');
  for (let i = 0; i < manaCrystals.length; i++) {
    manaCrystals[i].style.backgroundColor = '#3669c9';
  }
  oldNumOfChild = playerCardSlot2.childElementCount;
  playerturnSnd.play();
  document.body.style.cursor = 'url(src/cursor/cursor.png) 10 2, auto';
  document.getElementById('computerTurn').style.display = 'none';
  document.getElementById('endturn').style.backgroundColor = '#4ce322';
  document.getElementById('endturn').innerText = 'ENCERRAR TURNO';
  // mock's the user (dialogue) if it has been their turn for 30secs+
  setTimeout(function () {
    if (playersTurn == true && alreadyMocked == false && gameIsWon == false && isTutorial == false) {
      alreadyMocked = true;
      mockSnd.play();
      setTimeout(function () {
        document.querySelector('#computerbubble').innerText = 'Vá em frente,\ntermine seu turno e então\nterminarei com você!';
        document.querySelector('#computerbubble').style.visibility = 'visible';
        document.querySelector('#computerbubble').classList.add('openMenuAnim');
        setTimeout(function () {
          document.querySelector('#computerbubble').classList.add('easeOutAnim');
          document.querySelector('#computerbubble').classList.remove('openMenuAnim');
          setTimeout(function () {
            document.querySelector('#computerbubble').style.visibility = 'hidden';
            document.querySelector('#computerbubble').classList.remove('easeOutAnim');
          }, 250);
        }, 5000);
      }, 250);
    }
  }, 30000);
  // the player draws a card if their hand is not full (max cards in hand 10 cards)
  if (hand.childElementCount != 10) {
    hand.appendChild(playerDeck.cards[0].getPlayerCardsInHandHTML());
  }
  checkForRequiredMana();
  clearAttackEvents();
  attack();
  enableDrag();
  /* Removes all event listeners from elements with the class name 'card' for function placeCardFunc
  on mouseup to ensure elements do not have more than 1 event listener when the placeCard() function is called. */
  document.querySelectorAll('.card').forEach(function (e) {
    e.removeEventListener('mouseup', placeCardFunc);
  });
  placeCard();
  playerDeck.cards.shift();
  updateDeckCount();
}
/* checks if the player has enough mana to play each card in their hand 
and if so makes the border of the card green */
function checkForRequiredMana() {
  for (let i = 0; i < draggableElements.length; i++) {
    if (draggableElements[i].children[0] == undefined) {
      draggableElements[i].remove();
      continue;
    }
    if (mana < draggableElements[i].children[0].children[2].innerText) {
      draggableElements[i].style.pointerEvents = 'none';
      draggableElements[i].children[0].children[4].style.border = 'solid 4px rgb(56, 56, 56)';
    } else {
      draggableElements[i].style.pointerEvents = 'all';
      draggableElements[i].children[0].children[4].style.border = 'solid 4px #0FCC00';
    }
  }
}
// creates an element inside the element with id "manacontainer"
function createManaCrystal() {
  const manacontainer = document.getElementById('manacontainer');
  const manacrystal = document.createElement('div');
  manacrystal.classList.add('manabox');
  manacontainer.appendChild(manacrystal);
}
/* the following functions allow the user to drag cards 
from the hand onto the board */
function enableDrag() {
  for (var i = 0; i < draggableElements.length; i++) {
    dragElement(draggableElements[i]);
  }
}
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + 'header')) {
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    iElements = e.target;
    elmnt.style.position = 'absolute';
    elmnt.style.left = e.clientX + 'px';
    pos3 = parseInt(e.clientX);
    pos4 = parseInt(e.clientY);
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
    return false;
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - parseInt(e.clientX);
    pos2 = pos4 - parseInt(e.clientY);
    pos3 = parseInt(e.clientX);
    pos4 = parseInt(e.clientY);
    // sets the position of the element to the position of the mouse
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    // Checks for collision between elements (the card and collisionbox)
    var aRect = collisionbox.getBoundingClientRect();
    var bRect = iElements.getBoundingClientRect();
    if (aRect.top + aRect.height < bRect.top || aRect.top > bRect.top + bRect.height || aRect.left + aRect.width < bRect.left || aRect.left > bRect.left + bRect.width) {
      collision = false;
    } else {
      collision = true;
      document.querySelectorAll('.card').forEach(function (e) {
        e.addEventListener('mouseup', function a(e) {
          if (collision == true && playerCardSlot2.childElementCount <= 7) {
            getNameOfElement = iElements.children[0].children[5].innerText;
            iElements.removeEventListener('mouseup', a);
            iElements.addEventListener('mouseup', placeCardFunc);
            iElements.remove();
          }
        });
      });
    }
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
startGame();
placeCard();
enableDrag();

// disable and enable screen shakes (options menu)
const screenshakebtn = document.getElementById('togglescreenshake');
var isScreenShake = new Boolean(true);
screenshakebtn.onclick = function () {
  if (isScreenShake == true) {
    isScreenShake = false;
  } else if (isScreenShake == false) {
    isScreenShake = true;
  }
};

function getGameData() {
  //getFromDB
  //Stock model = {player_id, hero_id, deck_id, enemy_id} <- fromGet
  const opponent_user_default = '6420b5a32fc1037c60c6f6cd';
  const player_id = new URL(location.href).searchParams.get('id_jogador');
  const hero_id = new URL(location.href).searchParams.get('id_personalidade');
  const opponent_id = new URL(location.href).searchParams.get('id_oponente');
  if (player_id == null || hero_id == null || opponent_id == null) {
    loading_error();
  }

  const player_data = JSON.parse(getRequest('https://api-enigma-tempo.onrender.com/api/user/' + player_id));
  console.log(player_data['me']);
  if (player_data == undefined || player_data == '') {
    loading_error();
  }
  const hero_data = JSON.parse(getRequest('https://api-enigma-tempo.onrender.com/api/heroes/' + hero_id));
  if (hero_data == undefined || hero_data == '') {
    loading_error();
  }

  const opponent_data = JSON.parse(getRequest('https://api-enigma-tempo.onrender.com/api/heroes/' + opponent_id));
  if (opponent_data == undefined || opponent_data == '') {
    loading_error();
  }

  const deck_id = new URL(location.href).searchParams.get('id_baralho');
  const opponent_deck_id = JSON.parse(getRequest('https://api-enigma-tempo.onrender.com/api/decks/' + opponent_user_default + '/' + opponent_id))['deck']['id'];

  mockData = [
    {
      player: player_data['me'],
      id: player_id,
      hero_id: hero_id,
      hero: hero_data['hero']['name'],
      hero_power: hero_data['hero']['power'] ?? 'buff',
      hero_power_cost: hero_data['hero']['mana'] ?? '2',
      hero_power_params: hero_data['hero']['params'] ?? '1,0,Agente',
      hero_txt: hero_data['hero']['hero_lines'] ?? 'Olá;Sua vez',
      hero_img: hero_data['hero']['sprite'] ?? 'src/images/Dom-Pedro-II.png',
      hero_acting: hero_data['hero']['acting']['name'] ?? 'Transgressor',
      deck: deck_id,
    },
    {
      hero_id: opponent_id,
      hero: opponent_data['hero']['name'],
      hero_txt: opponent_data['hero']['hero_lines'] ?? 'Olá;Sua vez',
      hero_img: opponent_data['hero']['sprite'] ?? 'src/images/Dom-Pedro-II.png',
      hero_acting: opponent_data['hero']['acting']['name'] ?? 'Transgressor',
      deck: opponent_deck_id,
    },
  ];
  return mockData;
}

function setGameConfig(data_game) {
  document.getElementById('match_coins').innerHTML = data_game[0]['player']['match_points'] ?? 0;
  gameStartsAt = Date.now();
  //player
  document.getElementById('playerhero').style.backgroundImage = "url('" + data_game[0]['hero_img'] + "')";
  document.getElementById('player-acting').style.backgroundImage = "url('src/images/" + data_game[0]['hero_acting'].toLowerCase() + ".png')";
  document.getElementById('playerlabel').innerText = data_game[0]['hero'];
  document.getElementById('playerbubble').innerHTML = data_game[0]['hero_txt'].split(';')[0];
  document.getElementsByClassName('playerheropower')[0].style.backgroundImage = "url('src/images/" + data_game[0]['hero_power'] + "_power.png')";

  //opponent
  document.getElementById('opposinghero').style.backgroundImage = "url('" + data_game[1]['hero_img'] + "')";
  document.getElementById('opposing-acting').style.backgroundImage = "url('src/images/" + data_game[1]['hero_acting'].toLowerCase() + ".png')";
  document.getElementById('opponentlabel').innerText = data_game[1]['hero'];
  document.getElementById('computerbubble').innerHTML = data_game[1]['hero_txt'].split(';')[0];
}
function getRequest(url) {
  let request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.send();
  return request.responseText;
}
function postRequest(url, json) {
  let request = new XMLHttpRequest();
  request.open('POST', url, false);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(json));
  return request.responseText;
}
function patchRequest(url, json) {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.open('PATCH', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(json));
    resolve(request);
  });
}
function loading_error() {
  let ele = document.getElementById('preventCORS');
  ele.innerHTML = 'Ocorreu um erro ao tentar carregar o jogo.';
  ele.addEventListener('click', () => {
    window.location = 'https://daniellydsa.github.io/SiteEnigmaTempo/';
  });
  ele.visibility = 'visible';
}
