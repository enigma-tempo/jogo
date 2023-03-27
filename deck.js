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
	constructor(attack, health, mana, info, imageString, name, rarity, effect = "none", params = "none", type = "minion", acting, posture, category) {
		this.imageString = imageString;
		this.attack = attack;
		this.health = health;
		this.info = info;
		this.name = name;
		this.mana = mana;
		this.rarity = rarity;
		this.effect = effect;
		this.params = params;
		this.type = type;
		this.acting = acting;
		this.posture = posture;
		this.category = category;
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
		const type = document.createElement('div');
		const acting = document.createElement('div');
		const posture = document.createElement('div');
		const category  = document.createElement('div');

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
		effect.style.visibility = "hidden";
		params.classList.add('params');
		params.style.visibility = "hidden";
		type.classList.add('type');
		type.style.visibility = "hidden";
		acting.classList.add('acting');
		// acting.style.visibility = "hidden";
		posture.classList.add('posture');
		posture.style.visibility = "hidden";
		category.classList.add('category');
		category.style.visibility = "hidden";

		computerCardDiv.classList.add('placeCardAnim')

		computerCardDiv.appendChild(computerAttackValueBackground)
		computerCardDiv.appendChild(computerHealthValueBackground)
		computerCardDiv.appendChild(divineShield)
		computerCardDiv.appendChild(taunt)
		computerCardDiv.appendChild(effect)
		computerCardDiv.appendChild(params)
		computerCardDiv.appendChild(type)
		computerCardDiv.appendChild(acting)
		computerCardDiv.appendChild(posture)
		computerCardDiv.appendChild(category)

		computerAttackValueBackground.appendChild(computerAttackValue)
		computerHealthValueBackground.appendChild(computerHealthValue)

		computerAttackValue.innerText = this.attack
		computerHealthValue.innerText = this.health
		effect.innerText = this.effect;
		params.innerText = this.params;
		type.innerText = this.type;
		// acting.innerText = this.acting;
		acting.style.backgroundImage = "url('src/images'"+this.acting+"')";
		posture.innerText = this.posture;
		category.innerText = this.category;
		computerCardDiv.style.backgroundImage = "url('" + this.imageString + ".png')";
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
		const type = document.createElement('div');
		const acting = document.createElement('div');
		const posture = document.createElement('div');
		const category  = document.createElement('div');

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
		effect.style.visibility = "hidden";
		params.classList.add('params');
		params.style.visibility = "hidden";
		type.classList.add('type');
		type.style.visibility = "hidden";
		acting.classList.add('acting');
		acting.style.visibility = "hidden";
		posture.classList.add('posture');
		posture.style.visibility = "hidden";
		category.classList.add('category');
		category.style.visibility = "hidden";

		playerCardDiv.appendChild(playerAttackValueBackground)
		playerCardDiv.appendChild(playerHealthValueBackground)
		playerCardDiv.appendChild(divineShield)
		playerCardDiv.appendChild(taunt)
		playerCardDiv.appendChild(effect)
		playerCardDiv.appendChild(params)
		playerCardDiv.appendChild(type)
		playerCardDiv.appendChild(acting)
		playerCardDiv.appendChild(posture)
		playerCardDiv.appendChild(category)
		playerCardDiv.appendChild(legendary)

		playerAttackValueBackground.appendChild(playerAttackValue)
		playerHealthValueBackground.appendChild(playerHealthValue)

		playerAttackValue.innerText = this.attack
		playerHealthValue.innerText = this.health
		effect.innerText = this.effect;
		params.innerText = this.params;
		type.innerText = this.type;
		acting.innerText = this.acting;
		posture.innerText = this.posture;
		category.innerText = this.category;
		playerCardDiv.style.backgroundImage = "url('" + this.imageString + "')";
		id1 += 1

		if (this.rarity == "Lendária") { //Só server pra aplicar a animação. Não nome, mas raridade deveria ser usado aqui
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
		} else if (this.rarity  == "Épica") {
			setTimeout(function() {
				playerCardDiv.classList.add("stormwindChampion");
			},750);
			setTimeout(function() {
				document.getElementById("game").classList.add("epicFlipAnim");
				setTimeout(function() {
					document.getElementById("game").classList.remove("epicFlipAnim");
				},1000);
			},2000);
		} else if (this.rarity == "Rara") {
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
		const rarity_colors = {'Comum':"#b5b5b5", "Incomum":"#31c21d", "Raro":"#0249dd", "Lendária":"#", "Épica":"#bd02dd"}

		const playerCardInHandDiv = document.createElement('div');
		const playerCardFaceInHandDiv = document.createElement('div');
		const playerCardBorderInHandDiv = document.createElement('div');
		const playerManaValueInHand = document.createElement('div');
		const playerInfoValueInHand = document.createElement('div');
		const playerNameValueInHand = document.createElement('div');
		const tutorialHintValueInHand = document.createElement('div');
		const effectsInHand = document.createElement('div');
		const paramsInHand = document.createElement('div');
		const typeInHand = document.createElement('div');
		const subClassInHand = document.createElement('div');
		playerCardInHandDiv.classList.add("card")
		playerCardFaceInHandDiv.classList.add("card-face")
		playerCardBorderInHandDiv.classList.add("card-border")
		playerManaValueInHand.classList.add("cardManaValue")
		playerInfoValueInHand.classList.add("cardInfoValue")
		playerNameValueInHand.classList.add("cardNameValue")
		playerNameValueInHand.style.backgroundColor = rarity_colors[this.rarity]
		tutorialHintValueInHand.classList.add("cardtutorialhint")
		effectsInHand.classList.add("effects");
		paramsInHand.classList.add("params");
		typeInHand.classList.add("type");
		subClassInHand.classList.add("subClass");
		playerCardInHandDiv.appendChild(playerCardFaceInHandDiv)
		const playerAttackValueInHand = document.createElement('div');
		const playerHealthValueInHand = document.createElement('div');
		if(this.type == "Agente"){
			playerAttackValueInHand.classList.add("cardAttackValue")
			playerHealthValueInHand.classList.add("cardHealthValue")
			playerAttackValueInHand.innerText = this.attack
			playerHealthValueInHand.innerText = this.health
		} 
		playerCardFaceInHandDiv.appendChild(playerAttackValueInHand)
		playerCardFaceInHandDiv.appendChild(playerHealthValueInHand)
		playerCardFaceInHandDiv.appendChild(playerManaValueInHand)
		playerCardFaceInHandDiv.appendChild(playerInfoValueInHand)
		playerCardFaceInHandDiv.appendChild(playerCardBorderInHandDiv)
		playerCardFaceInHandDiv.appendChild(playerNameValueInHand)
		playerCardFaceInHandDiv.appendChild(tutorialHintValueInHand)
		playerCardFaceInHandDiv.appendChild(effectsInHand)
		playerCardFaceInHandDiv.appendChild(paramsInHand)
		playerCardFaceInHandDiv.appendChild(typeInHand)
		playerCardFaceInHandDiv.appendChild(subClassInHand)
		effectsInHand.style.visibility = "hidden";
		paramsInHand.style.visibility = "hidden";
		typeInHand.style.visibility = "hidden";
		// effectsInHand.appendChild(paramsInHand)
		// if (isTutorial == true) {}
		// let tutorialHintText = 'Mana Cost\nAttack' + '                     ' + 'Health';
		// tutorialHintValueInHand.innerText = tutorialHintText
		playerManaValueInHand.innerText = this.mana
		playerInfoValueInHand.innerText = this.info
		playerNameValueInHand.innerText = this.name
		effectsInHand.innerText = this.effect
		paramsInHand.innerText = this.params
		typeInHand.innerText = this.type
		subClassInHand.innerText = this.category
		playerCardFaceInHandDiv.style.backgroundImage = "url('" + this.imageString + "')";
		return playerCardInHandDiv
	}
}
// function to create the full deck both the player and the opponent's deck
function freshDeck(deck_id) {
	if (deck_id == undefined) {
		data = getRequest("https://api-enigma-tempo.onrender.com/api/cards")
		data = JSON.parse(data)
		cards = data['cards']
		const N = cards.length;
		let random_card_list = [];
		let generic_deck = [];
		for (let i = 0; i < 30; i++) {
			let num;
			do {
				num = Math.floor(Math.random() * (N + 1));
			} while (random_card_list.filter(n => n === num).length >= 3);
			random_card_list.push(num);
			generic_deck.push(cards[num]);
		}
		cards = generic_deck;
		
	} else {
		data = getRequest("https://api-enigma-tempo.onrender.com/api/decks/"+deck_id)
		data = JSON.parse(data)
		cards = data['deck']['cards']
	}
	listCards = []
	cards.forEach(element => {
		let name = element['name'];
		let attack = parseInt(element['attack'])
		let health = parseInt(element['health'])
		let mana = parseInt(element['mana'])
		let info = element['description']
		let imageString =  "src/cards/"+element['sprite'];
		let rarity = element['rarity'] !== undefined ? element['rarity']['name'] : "Comum"
		let effect = element['effect']
		let params = element['params']
		let posture = "";
		let type = element['type'] !== undefined ? element['type']['name'] : "Agente"
		let acting = element['acting'] !== undefined ? element['acting']['name'] : "Militar"
		// params += acting;
		let category = element['category'] !== undefined ? element['category']['name'] : "Destrutiva"
		let card = new MinionCard(attack, health, mana, info, imageString, name, rarity, effect, params, type, acting,posture,category)
		listCards.push(card)
	})
	return listCards
}

