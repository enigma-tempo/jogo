var id1 = 0;
var id2 = 0;

// creates a 'Deck' class where objects can be made from using the OOP
class Deck {
	constructor(deck_id) {
		cards = freshDeck(deck_id);
		this.cards = cards;
	}
	// function that returns the length of the deck
	get numberOfCards() {
		return this.cards.length
	}
	// defines a shuffle function that shuffles the cards in the deck randomly
	shuffle() {
		for (let i = this.numberOfCards - 1; i > 0; i--) {
			const newIndex = Math.floor(Math.random() * (i + 1))
			const oldValue = this.cards[newIndex]
			this.cards[newIndex] = this.cards[i]
			this.cards[i] = oldValue
		}
	}
}
// class to make objects for each card including the card stats and properties
class MinionCard {
	constructor(attack, health, mana, info, imageString, name, rarity, effect = "none", params = "none") {
		this.imageString = imageString;
		this.attack = attack;
		this.health = health;
		this.info = info;
		this.name = name;
		this.mana = mana;
		this.rarity = rarity;
		this.effect = effect;
		this.params = params;
	}
	// function to create the card in play element for the opponent
	getComputerHTML() {
		const computerCardDiv = document.createElement('div');
		const computerAttackValueBackground = document.createElement('div');
		const computerHealthValueBackground = document.createElement('div');
		const computerAttackValue = document.createElement('div');
		const computerHealthValue = document.createElement('div');
		const divineShield = document.createElement('div');
		const taunt = document.createElement('div');
		const effect = document.createElement('div');
		const params = document.createElement('div');

		computerCardDiv.id = "cpuCardInPlay" + id2;
		computerCardDiv.classList.add("cardinplay");
		computerCardDiv.classList.add("computer-cardinplay");

		computerAttackValue.classList.add("attackValue")
		computerHealthValue.classList.add("healthValue")
		computerAttackValueBackground.classList.add("attackValueBackground")
		computerHealthValueBackground.classList.add("healthValueBackground")

		divineShield.classList.add("divineShield");
		taunt.classList.add("taunt");
		effect.classList.add("effects");
		// effect.classList.add(this.effect);
		params.classList.add('params');
		params.style.visibility = "hidden";

		computerCardDiv.classList.add('placeCardAnim')

		computerCardDiv.appendChild(computerAttackValueBackground)
		computerCardDiv.appendChild(computerHealthValueBackground)
		computerCardDiv.appendChild(divineShield)
		computerCardDiv.appendChild(taunt)
		computerCardDiv.appendChild(effect)
		computerCardDiv.appendChild(params)

		computerAttackValueBackground.appendChild(computerAttackValue)
		computerHealthValueBackground.appendChild(computerHealthValue)

		computerAttackValue.innerText = this.attack
		computerHealthValue.innerText = this.health
		effect.innerText = this.effect;
		params.innerText = this.params;
		computerCardDiv.style.backgroundImage = "url('" + this.imageString + "')";
		id2 += 1;
		return computerCardDiv
	}
	// function to create the card in play element for the player
	getPlayerHTML() {
		const playerCardDiv = document.createElement('div');
		const playerAttackValueBackground = document.createElement('div');
		const playerHealthValueBackground = document.createElement('div');
		const playerAttackValue = document.createElement('div');
		const playerHealthValue = document.createElement('div');
		const legendary = document.createElement('div');
		const divineShield = document.createElement('div');
		const taunt = document.createElement('div');
		const effect = document.createElement('div');
		const params = document.createElement('div');

		playerCardDiv.id = "playerCardInPlay" + id1;
		playerCardDiv.classList.add("cardinplay");
		playerCardDiv.classList.add("player-cardinplay");
	
		playerAttackValue.classList.add("attackValue");
		playerHealthValue.classList.add("healthValue");
		playerAttackValueBackground.classList.add("attackValueBackground");
		playerHealthValueBackground.classList.add("healthValueBackground");
		legendary.classList.add("legendaryinplay");
		divineShield.classList.add("divineShield");
		taunt.classList.add("taunt");
		effect.classList.add("effects");
		// effect.classList.add(this.effect);
		params.classList.add('params');
		params.style.visibility = "hidden";

		playerCardDiv.appendChild(playerAttackValueBackground)
		playerCardDiv.appendChild(playerHealthValueBackground)
		playerCardDiv.appendChild(divineShield)
		playerCardDiv.appendChild(taunt)
		playerCardDiv.appendChild(effect)
		playerCardDiv.appendChild(params)
		playerCardDiv.appendChild(legendary)

		playerAttackValueBackground.appendChild(playerAttackValue)
		playerHealthValueBackground.appendChild(playerHealthValue)

		playerAttackValue.innerText = this.attack
		playerHealthValue.innerText = this.health
		effect.innerText = this.effect;
		params.innerText = this.params;
		playerCardDiv.style.backgroundImage = "url('" + this.imageString + "')";
		id1 += 1

		if (this.rarity == "Legendary") { //Só server pra aplicar a animação. Não nome, mas raridade deveria ser usado aqui
			playerCardDiv.classList.add('ragnarosTheFirelord')
			setTimeout(function() {
				document.getElementById("game").classList.add("legendaryFlipAnim");
				setTimeout(function() {
					document.getElementById("game").classList.remove("legendaryFlipAnim");
				},1000);
			},1900);
		} else if (this.name  == "The Lich King") {
			playerCardDiv.style.visibility = "hidden";
			setTimeout(function() {
				playerCardDiv.classList.add('theLichKing')
				playerCardDiv.style.visibility = "visible";
				setTimeout(function() {
					document.getElementById("game").classList.add("theLichKingShake");
					setTimeout(function() {
						document.getElementById("game").classList.remove("theLichKingShake");
					},1000);
				},250)
			},2000)
		} else if (this.rarity  == "Epic") {
			setTimeout(function() {
				playerCardDiv.classList.add("stormwindChampion");
			},750);
			setTimeout(function() {
				document.getElementById("game").classList.add("epicFlipAnim");
				setTimeout(function() {
					document.getElementById("game").classList.remove("epicFlipAnim");
				},1000);
			},2000);
		} else if (this.rarity == "Rare") {
			playerCardDiv.classList.add("deathwing");
			setTimeout(function() {
				document.getElementById("game").classList.add("deathwingShake");
				setTimeout(function() {
					document.getElementById("game").classList.remove("deathwingShake");
				},1000);
			},1250);
		}
		else {
			playerCardDiv.classList.add('placeCardAnim')
		}
		return playerCardDiv
	}
	// function to create the card in hand element for the player
	getPlayerCardsInHandHTML() {
		const playerCardInHandDiv = document.createElement('div');
		const playerCardFaceInHandDiv = document.createElement('div');
		const playerCardBorderInHandDiv = document.createElement('div');
		const playerAttackValueInHand = document.createElement('div');
		const playerHealthValueInHand = document.createElement('div');
		const playerManaValueInHand = document.createElement('div');
		const playerInfoValueInHand = document.createElement('div');
		const playerNameValueInHand = document.createElement('div');
		const tutorialHintValueInHand = document.createElement('div');
		const effectsInHand = document.createElement('div');
		const paramsInHand = document.createElement('div');
		playerCardInHandDiv.classList.add("card")
		playerCardFaceInHandDiv.classList.add("card-face")
		playerCardBorderInHandDiv.classList.add("card-border")
		playerAttackValueInHand.classList.add("cardAttackValue")
		playerHealthValueInHand.classList.add("cardHealthValue")
		playerManaValueInHand.classList.add("cardManaValue")
		playerInfoValueInHand.classList.add("cardInfoValue")
		playerNameValueInHand.classList.add("cardNameValue")
		tutorialHintValueInHand.classList.add("cardtutorialhint")
		effectsInHand.classList.add("effects");
		paramsInHand.classList.add("params");
		playerCardInHandDiv.appendChild(playerCardFaceInHandDiv)
		playerCardFaceInHandDiv.appendChild(playerAttackValueInHand)
		playerCardFaceInHandDiv.appendChild(playerHealthValueInHand)
		playerCardFaceInHandDiv.appendChild(playerManaValueInHand)
		playerCardFaceInHandDiv.appendChild(playerInfoValueInHand)
		playerCardFaceInHandDiv.appendChild(playerCardBorderInHandDiv)
		playerCardFaceInHandDiv.appendChild(playerNameValueInHand)
		playerCardFaceInHandDiv.appendChild(tutorialHintValueInHand)
		playerCardFaceInHandDiv.appendChild(effectsInHand)
		playerCardFaceInHandDiv.appendChild(paramsInHand)
		effectsInHand.style.visibility = "hidden";
		paramsInHand.style.visibility = "hidden";
		// effectsInHand.appendChild(paramsInHand)
		// if (isTutorial == true) {}
		let tutorialHintText = 'Mana Cost\nAttack' + '                     ' + 'Health';
		tutorialHintValueInHand.innerText = tutorialHintText
		playerAttackValueInHand.innerText = this.attack
		playerHealthValueInHand.innerText = this.health
		playerManaValueInHand.innerText = this.mana
		playerInfoValueInHand.innerText = this.info
		playerNameValueInHand.innerText = this.name
		effectsInHand.innerText = this.effect
		paramsInHand.innerText = this.params
		playerCardFaceInHandDiv.style.backgroundImage = "url('" + this.imageString + "')";
		return playerCardInHandDiv
	}
}
// function to create the full deck both the player and the opponent's deck
function freshDeck(deck_id) {
	// data = getRequest("https://api-enigma-tempo.onrender.com/api/deck/"+deck_id)
	data = getRequest("https://api-enigma-tempo.onrender.com/api/cards")
	data = JSON.parse(data)
	cards = data['cards']
	listCards = []
	cards.forEach(element => {
		// atributes = []
		// Object.keys(element).forEach((key) => {
		// 	atributes.push(element[key])
		// })
		let name = element['name'];
		let attack = parseInt(element['attack'])
		let health = parseInt(element['health'])
		let mana = parseInt(element['mana'])
		let info = element['description']
		let imageString =  "src/cards/"+element['sprite'];
		let rarity = 'commom'
		let effect = element['effect']
		let params = element['params']
		if (effect == 'taunt') {
			mana = 1;
		}
		let card = new MinionCard(attack, health, mana, info, imageString, name, rarity, effect, params)
		listCards.push(card)
		listCards.push(card)
	})
	return listCards
}

function getRequest(url){
  let request = new XMLHttpRequest()
  request.open("GET", url, false)
  request.send()
  return request.responseText
}