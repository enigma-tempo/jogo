var effect_dict = {"buff" : buffAllieds, "taunt": taunt, "summon": summon, "draw" : draw, "divineshield" : divineShield, "charge":charge, "dealDamageHero":dealDamageHero, "healHero" : healHero, "setAttib": setAttib, "buffSelf": buffSelf, "damageEnemies" : damageEnemies, "damageEnemy":damageEnemy, "healAllied":hpAddRandomAllied, "lifeSteal":lifeSteal,"legado:summon": summon, "buffSelfByEnemyActing":buffSelfByEnemyActing, "end_turn:hpAddRandomAllied": hpAddRandomAllied}
var effect_in_fight = ["frenesi", "lifeSteal", "legado:summon", "end_turn:hpAddRandomAllied"];
var who_dict = { 'player': {'slot':playerCardSlot2, 'deck': playerDeck, 'original_deck':originalPlayerDeck}, 'computer': {'slot':computerCardSlot, 'deck':computerDeck, 'original_deck':computerDeck} }

function getEffectNames(mob){
    return mob.children[4].innerText;
}
function getParamText(mob){
    return mob.children[5].innerText;
}


function hpAddRandomAllied(who, params){
    [allieds, health, category] = params.toString().split(',');
    let hit = category.toLowerCase() == "todos" || category.toLowerCase() == "todas";
    if(who_dict[who]['slot'].childElementCount < 2) return null;
    if (allieds == 0) {
        for (let index = 0; index < who_dict[who]['slot'].childElementCount; index++) {
            const target = who_dict[who]['slot'].children[index];
            if(!hit || target.children[8] == category){
                let h = parseInt(target.children[1].children[0].innerText);
                target.children[1].children[0].innerText = h + parseInt(health);
                target.children[1].children[0].style.color = "green";
            }
        }
    } else {
        n_allieds = 0;
        for (let index = 0; index < who_dict[who]['slot'].childElementCount; index++) {
            const target = who_dict[who]['slot'].children[index];
            if(!hit || target.children[8] == category){
                n_allieds++;
            }
        }
        targetI = Math.floor(Math.random() * n_allieds)
        for (let index = 0; index < who_dict[who]['slot'].childElementCount; index++) {
            const target = who_dict[who]['slot'].children[index];
            if (!hit || n_allieds == targetI) {
                target = who_dict[who]['slot'].children[index];
                let h = parseInt(target.children[1].children[0].innerText);
                target.children[1].children[0].innerText = h + parseInt(health);
                target.children[1].children[0].style.color = "green";
                break;
            }
        }
    }
}

function damageEnemy(who, params){
    [damage] = params.toString().split(',')[0];
    if(who == 'player'){
        const ele = document.getElementById('collisionbox').lastChild.children[0];
        ele.id = "magicCard";
        ele.children[0].style.visibility = "hidden";
        ele.children[0].style.position = "absolute";
        ele.children[1].style.visibility = "hidden";
        ele.children[1].style.position = "absolute";
        ele.children[0].innerHTML = damage;
        ele.children[1].innerHTML  = 0;

        setAttacker(ele);
    }
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
        target.style.boxShadow = "0px 0px 35px #f20301";
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
                target.style.boxShadow = "";
                if(parseInt(target.children[1].children[0].innerText) < 1){
                    if(target.classList.contains("hasTaunt")){
                        clearAttackEvents();
                        attack(true);
                    }
                    target.remove();
                } 
            }, 1500);
        }
    }
}

function buffSelf(who, params){
    [atk, hp, category] = params.toString().split(',');
    n_allieds = 0;
    for (let index = 0; index < who_dict[who]['slot'].childElementCount; index++) {
        if (who_dict[who]['slot'].children[index].children[9].innerHTML == category) {
            n_allieds++;
        } 
    }
    let target = who_dict[who]['slot'].lastChild;
    let attackPlus = parseInt(target.children[0].children[0].innerText);
    let healthPlus = parseInt(target.children[1].children[0].innerText);
    target.children[0].children[0].innerText = attackPlus + (parseInt(atk)* n_allieds);
    target.children[1].children[0].innerText = healthPlus + (parseInt(hp)* n_allieds);
    target.children[0].children[0].style.color = "#00d70c";
    target.children[1].children[0].style.color = "#00d70c";
}

function buffSelfByEnemyActing(who, params){
    [atk, hp, acting] = params.toString().split(',');
    let hit = false;
    for (let index = 0; index < who_dict[who]['slot'].childElementCount; index++) {
        if (who_dict[who]['slot'].children[index].children[7].innerHTML == acting) {
            hit = true;
            break;
        } 
    }
    if (hit) {
        let target = who_dict[who]['slot'].lastChild;
        let attackPlus = parseInt(target.children[0].children[0].innerText);
        let healthPlus = parseInt(target.children[1].children[0].innerText);
        target.children[0].children[0].innerText = attackPlus + (parseInt(atk)* n_allieds);
        target.children[1].children[0].innerText = healthPlus + (parseInt(hp)* n_allieds);
        target.children[0].children[0].style.color = "#00d70c";
        target.children[1].children[0].style.color = "#00d70c";
    }
}

function frenesi(cardHTML){
    atk = parseInt(cardHTML.children[5].innerHTML);
    let target = cardHTML;
    let attackPlus = parseInt(target.children[0].children[0].innerText);
    target.children[0].children[0].innerText = attackPlus + parseInt(atk);
    target.children[0].children[0].style.color = "#00d70c";
}

function lifeSteal(cardHTML, damageDone){
    hp = parseInt(cardHTML.children[1].children[0].innerText);
    let target = cardHTML;
    target.children[1].children[0].innerText = hp + damageDone;
    target.children[1].children[0].style.color = "#00d70c";
}


function buffAllieds(who, params){
    [allied, atk, health, category] = params.toString().split(',');
    affectAll = category.toLowerCase() == "todas" || category.toLowerCase() == "todos";
    hit = true;
    // [allied, atk, health, category] = params.toString().split(',');
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
        if (!affectAll) {
            hit = target.children[9].innerHTML == category
        }
        if (hit) {
            let attackPlusOne = parseInt(target.children[0].children[0].innerText);
            let healthPlusOne = parseInt(target.children[1].children[0].innerText);
            target.children[0].children[0].innerText = attackPlusOne + parseInt(atk);
            target.children[1].children[0].innerText = healthPlusOne + parseInt(health);
            target.children[0].children[0].style.color = "#00d70c";
            target.children[1].children[0].style.color = "#00d70c";
        }
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
                mob['effect'] = mob['effect'].replace("legado:summon", ""); 
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
    who_dict[who]['slot'].lastChild.style.boxShadow = "0px 2px 15px 12px #0FCC00"; ;
    who_dict[who]['slot'].lastChild.classList.add("canAttack");
    attack(true);
}

//Em construção...
function setAttib(who, params){
    // [attr, value] = params.split(',');
    value = params.split(',')[0];
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
        if(element in effect_dict && !effect_in_fight.includes(element) ){
            let run = true;
            if (card.info.split(":")[0] == "Bradante") {
                if (mana < (card.mana*2)) {
                    run = false;
                }
            }
            if (run) {
                setTimeout(function() {
                    effect_dict[element](who, params);
                },400);
            }
        } 
    });
    setTimeout(function(){
        if (card['type'] !== "Agente") {
            if (!effects.split(' ').includes('damageEnemy')) {
                let ele = document.getElementById('magicCardPlaced');
                if (ele !== undefined && ele !== null) {
                    ele.remove(); 
                }
            }
        }
    }, 2000);
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