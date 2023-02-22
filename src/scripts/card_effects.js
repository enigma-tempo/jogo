effect_dict = {"buff" : buffAllieds, "taunt": taunt, "summon": summon, "draw" : draw, "divineshield" : divineShield, "charge":charge, "dealDamageHero":dealDamageHero, "healHero" : healHero, "setAttib": setAttib, "buffSelf": buffSelf, "damageEnemies" : damageEnemies}

who_dict = { 'player': {'slot':playerCardSlot2, 'deck': playerDeck, 'original_deck':originalPlayerDeck}, 'computer': {'slot':computerCardSlot, 'deck':computerDeck, 'original_deck':computerDeck} }

function getEffectNames(mob){
    return mob.children[4].innerText;
}
function getParamText(mob){
    return mob.children[5].innerText;
}

//Effects
function damageEnemies(who, params){
    [enemies, health] = params.toString().split(',');
    if (who == 'player') {
        who = "computer";
        look = ilookForTaunts;
    }else{
        who = "player";
        look = lookForTaunts;
    }
    if(parseInt(enemies) == 0)
        enemies_count = who_dict[who]['slot'].childElementCount;
    else 
        enemies_count = parseInt(enemies);
    
    for (let i = 0; i < enemies_count; i++) {
        let targetI = i;
        if (look()) {
            for (let j = 0; j < who_dict[who]['slot'].childElementCount; j++) {
                if(who_dict[who]['slot'].children[j].classList.contains("hasTaunt")){
                    targetI = j;
                    break;
                }                
            }
        }else if (parseInt(enemies) != 0) targetI = Math.floor(Math.random() * who_dict[who]['slot'].childElementCount);
        let target = who_dict[who]['slot'].children[targetI];
        if (target == null) {
            continue
        }
        target.style["boxShadow"] = "0px 0px 35px #f20301";
        if (target.classList.contains("hasDivineShield")) {
            target.classList.remove("hasDivineShield");
            target.children[2].classList.add("divineShieldBreak");
            setTimeout(function() {
                target.children[2].style.visibility = "hidden";
            },400);
        }else{
            let h = parseInt(target.children[1].children[0].innerText);
            target.children[1].children[0].innerText = h - parseInt(health);
            target.children[1].children[0].style.color = "#f20301";
            setTimeout(function() {
                target.style["boxShadow"] = "";
                if(parseInt(target.children[1].children[0].innerText) < 1){
                    if(target.classList.contains("hasTaunt")){
                        clearAttackEvents();
                        attack(true);
                    }
                    target.remove();
                } 
            }, 1000);

        }
    }
}

function buffSelf(who, params){
    [atk, hp] = params.toString().split(',');
    n_allieds = who_dict[who]['slot'].childElementCount  - 1;
    let target = who_dict[who]['slot'].lastChild;
    let attackPlus = parseInt(target.children[0].children[0].innerText);
    let healthPlus = parseInt(target.children[1].children[0].innerText);
    target.children[0].children[0].innerText = attackPlus + (parseInt(atk)* n_allieds);
    target.children[1].children[0].innerText = healthPlus + (parseInt(hp)* n_allieds);
    target.children[0].children[0].style.color = "#00d70c";
    target.children[1].children[0].style.color = "#00d70c";
}

function frenesi(cardHTML){
    atk = parseInt(cardHTML.children[5].innerHTML);
    let target = cardHTML;
    let attackPlus = parseInt(target.children[0].children[0].innerText);
    target.children[0].children[0].innerText = attackPlus + parseInt(atk);
    target.children[0].children[0].style.color = "#00d70c";
}

function buffAllieds(who, params){
    [allied, atk, health] = params.toString().split(',');
    if(parseInt(allied) == 0){
        n_allieds = 0;
    }else{
        n_allieds = who_dict[who]['slot'].childElementCount - parseInt(allied) - 1;
    }
    for (let i=(who_dict[who]['slot'].childElementCount-2); i>=n_allieds; i--) {
        let target = who_dict[who]['slot'].children[i];
        if (target == null) {
            continue
        }
        let attackPlusOne = parseInt(target.children[0].children[0].innerText);
        let healthPlusOne = parseInt(target.children[1].children[0].innerText);
        target.children[0].children[0].innerText = attackPlusOne + parseInt(atk);
        target.children[1].children[0].innerText = healthPlusOne + parseInt(health);
        target.children[0].children[0].style.color = "#00d70c";
        target.children[1].children[0].style.color = "#00d70c";
    }
}

function taunt(who, mob){
    if (!mob.toString().includes('div')) {
        mob = who_dict[who]['slot'].lastChild;
    }
    tauntExists = true;
    mob.classList.add("hasTaunt");
    setTimeout(function() {
        mob.children[3].style.visibility = "visible";
        let tauntSnd = new Audio("src/sounds/effectSnds/taunt.mp3");
        tauntSnd.play();
    },400);
}

function summon(who, params){
    [card_name, quantity] = params.toString().split(',');
    for(var i = 0; i < who_dict[who]['original_deck'].cards.length; i++) {
        if ((who_dict[who]['original_deck'].cards[i]['name'] == card_name) && (who_dict[who]['slot'].childElementCount != 7)) {
            for (let j = 0; j < quantity; j++) {
                let mob = who_dict[who]['original_deck'].cards[i];
                let mob_html = null;
                if(who == 'player'){
                    mob_html = mob.getPlayerHTML();
                }else{
                    mob_html = mob.getComputerHTML();
                }
                who_dict[who]['slot'].appendChild(mob_html);
                mob['effect'] = mob['effect'].replace("summon", ""); 
                setTimeout(function() {
                    cardPlace(who, mob);
                },400);
            }
            break;
        }
    }
}

function draw(who, params){
    if(who == 'computer') return null;
    quantity = parseInt(params);
    for (let index = 0; index < quantity; index++) {
        if(hand.childElementCount < 10) {
            hand.appendChild(who_dict['player']['deck'].cards[index].getPlayerCardsInHandHTML());
            who_dict['player']['deck'].cards.shift();
        }     
    }
    checkForRequiredMana();
    enableDrag();
    placeCard();
    updateDeckCount();
}

function divineShield(who){
    who_dict[who]['slot'].lastChild.classList.add("hasDivineShield");
    who_dict[who]['slot'].lastChild.children[2].style.visibility = "visible";
}

function charge(who){
    who_dict[who]['slot'].lastChild.children[4].style.visibility = "visible";
    who_dict[who]['slot'].lastChild.style.boxShadow = "0px 2px 15px 12px #0FCC00"; ;
    who_dict[who]['slot'].lastChild.classList.add("canAttack");
    attack(true);
}

//Em construção...
function setAttib(who, params){
    [attr, value] = params.split(',');
    if (who == 'player') {
        who = ".opposingHeroHealth";
    }else{
        who = ".playerHeroHealth";
    }
    let opponentHeroHealth = parseInt(document.querySelector(who).innerText);
    if(opponentHeroHealth > value){
        document.querySelector(who).innerText = value;
    }
} //Travado no atributo vida por ora

function dealDamageHero(who, params){
    let target = 'computer';
    let targethealth = 'opposing';
    if (who == 'computer') {
        let target = 'player';
        let targethealth = 'player';
    }
    let damage = params.split(',')[0];
    let opponentHeroHealth = parseInt(document.querySelector("."+targethealth+"HeroHealth").innerText);
    document.querySelector("."+targethealth+"HeroHealth").innerText = opponentHeroHealth - parseInt(damage);

    document.querySelector("#"+target+"damagevalue").innerText = (damage*(-1));
    document.querySelector("#"+target+"damagecontainer").style.visibility = "visible";
    document.getElementById(target+'damagecontainer').style.opacity="1";
    document.getElementById(target+'damagecontainer').style.transition="none";
    document.querySelector("#"+target+"damagelabel").classList.add("openMenuAnim");
    document.querySelector("#"+target+"damagevalue").classList.add("openMenuAnim");
    document.querySelector("#"+target+"damagelabel").classList.remove("fadeOutAnim");
    document.querySelector("#"+target+"damagevalue").classList.remove("fadeOutAnim");
    setTimeout(function() {
        document.querySelector("#"+target+"damagelabel").classList.add("fadeOutAnim");
        document.querySelector("#"+target+"damagevalue").classList.add("fadeOutAnim");
        document.querySelector("#"+target+"damagelabel").classList.remove("openMenuAnim");
        document.querySelector("#"+target+"damagevalue").classList.remove("openMenuAnim");
        setTimeout(function() {
        document.getElementById(target+'damagecontainer').style.visibility="hidden";
        document.getElementById(target+'damagecontainer').style.opacity="0";
        },1000);
    },2000);
}

function healHero(who, params){
    let heal = parseInt(params);
    let target = who;
    let targethealth = 'player';
    if (who == 'computer') {
        targethealth = 'opposing';
    }
    let playerHeroHealth = parseInt(document.querySelector("."+targethealth+"HeroHealth").innerText);
    let newHp = playerHeroHealth + heal;
    if (newHp > 30) {
        newHp = 30;
    }
    document.querySelector("."+targethealth+"HeroHealth").innerText = newHp;

    document.querySelector("#"+target+"damagevalue").innerText = heal;
    document.querySelector("#"+target+"damagecontainer").style.visibility = "visible";
    document.getElementById(target+"damagecontainer").style.opacity="1";
    document.getElementById(target+"damagecontainer").style.transition="none";
    document.querySelector("#"+target+"damagelabel").classList.add("openMenuAnim");
    document.querySelector("#"+target+"damagevalue").classList.add("openMenuAnim");
    document.querySelector("#"+target+"damagelabel").classList.remove("fadeOutAnim");
    document.querySelector("#"+target+"damagevalue").classList.remove("fadeOutAnim");
    setTimeout(function() {
      document.querySelector("#"+target+"damagelabel").classList.add("fadeOutAnim");
      document.querySelector("#"+target+"damagevalue").classList.add("fadeOutAnim");
      document.querySelector("#"+target+"damagelabel").classList.remove("openMenuAnim");
      document.querySelector("#"+target+"damagevalue").classList.remove("openMenuAnim");
      setTimeout(function() {
        document.getElementById(target+"damagecontainer").style.visibility="hidden";
        document.getElementById(target+"damagecontainer").style.opacity="0";
      },1000);
    },2000);
}

//Actions
function playCardSound(name){
    name = name.replace(" ", "_").toLowerCase();
    let snd = new Audio("src/sounds/cardPlaceSnds/"+name+"_play.mp3")
    snd.play();
    snd.volume = 0.7;
    fadeOutInMusic();
}

// function for the sounds and effects when a card is placed onto the board
function cardPlace(who, card) {

    // playCardSound(getNameOfElement);
    let effects = card['effect'];
    let params = card['params'];
    effects.split(' ').forEach(element => {
        if(element in effect_dict && element != 'frenesi'){
            setTimeout(function() {
                //who = 'player' or 'computer'
                effect_dict[element](who, params);
            },400);
        } 
    });

    // ragnaros the firelord card effects
    if (getNameOfElement == "Ragnaros the Firelord") {
        let ragnarosthefirelordSnd = new Audio("src/sounds/cardPlaceSnds/ragnaros_the_firelord_play.mp3")
        ragnarosthefirelordSnd.play();
        ragnarosthefirelordSnd.volume = 0.7;
        fadeOutInMusic();
        who_dict['player']['slot'].lastChild.children[4].style.visibility = "visible";
    }
    // deathwing card effects
    else if (getNameOfElement == "Deathwing") {
        let deathwingSnd = new Audio("src/sounds/cardPlaceSnds/deathwing_play.mp3")
        deathwingSnd.play();
        deathwingSnd.volume = 0.7;
        fadeOutInMusic();
        who_dict['player']['slot'].lastChild.children[4].style.visibility = "visible";
        // discard hand
        for (let i=0; i<hand.childElementCount; i++) {
            hand.children[i].remove();
        }
        // remove all minions on players board
        for (let i=0; i<who_dict['player']['slot'].childElementCount; i++) {
            who_dict['player']['slot'].children[i].remove();
        }
        // remove all minions on computers board
        for (let i=0; i<computerCardSlot.childElementCount; i++) {
            computerCardSlot.children[i].remove();
        }
    }
    // alexstrasza card effects
    else if (getNameOfElement == "Alexstrasza") {
        let alexstraszaSnd = new Audio("src/sounds/cardPlaceSnds/alexstrasza_play.mp3")
        let alexstraszamusicSnd = new Audio("src/sounds/cardPlaceSnds/alexstrasza_music_play.mp3")
        alexstraszaSnd.play();
        who_dict['player']['slot'].lastChild.children[4].style.visibility = "visible";
        setTimeout(function() {
            alexstraszamusicSnd.play();
        },375);
    }
    // the lich king card effects
    else if (getNameOfElement == "The Lich King") {
        let lichkingSnd = new Audio("src/sounds/cardPlaceSnds/lich_king_play.mp3")
        lichkingSnd.play();
        fadeOutInMusic();
        document.getElementById('snowCanvas').style.display = "block";
        document.getElementById('snowCanvas').classList.add("fadeInAnim");
        who_dict['player']['slot'].lastChild.classList.add("hasTaunt");
        setTimeout(function() {
            who_dict['player']['slot'].lastChild.children[4].style.visibility = "visible";
        },1500);
        setTimeout(function() {
            who_dict['player']['slot'].lastChild.children[3].style.visibility = "visible";
        },3300);
        setTimeout(function() {
            document.getElementById('snowCanvas').classList.remove("fadeInAnim");
            document.getElementById('snowCanvas').classList.add("fadeOutAnim");
            setTimeout(function() {
                document.getElementById('snowCanvas').classList.remove("fadeOutAnim");
                document.getElementById('snowCanvas').style.display = "none";
            },1000);
        },3000);
    }
}

// function that fades the music out and back in over a period of 5.3 seconds
function fadeOutInMusic() {
    lichkingOST.volume = 0.7;
    setTimeout(function() {
        lichkingOST.volume = 0.4;
        setTimeout(function() {
            lichkingOST.volume = 0.1;
            setTimeout(function() {
                lichkingOST.volume = 0.4;
                setTimeout(function() {
                    lichkingOST.volume = 1;
                },300);
            },4500);
        },250);
    },250);
}