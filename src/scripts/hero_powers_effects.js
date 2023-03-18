var hero_effect_dict = {"buff" : heroPowerBuff, "taunt": taunt, "summon": summon, "draw" : draw, "divineshield" : divineShield, "charge":charge, "dealDamageHero":dealDamageHero, "healHero" : healHero, "setAttib": setAttib, "buffSelf": buffSelf, "damageEnemies" : damageEnemies}

function heroPowerBuff(who, params){
    [atk, health, classe] = params.toString().split(',');
    for (let i=(who_dict[who]['slot'].childElementCount-1); i>=0; i--) {
        let target = who_dict[who]['slot'].children[i];
        if ((target == null) || (target.children[6].innerHTML != classe)) {
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