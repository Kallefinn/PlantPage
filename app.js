document.body.onload = startup;

function randId() {
    return "id" + Math.random().toString(16).slice(2);
}

//function to add "Windows" or "flowerpots" in this case for plants
addPlantSlot = (amount=1) => {    

    console.log("clicked");
    
    for(let i=0; i<amount ;++i) {

        let bucket = new flowerPot();

        //store for later
        plantSlots.push(bucket);
    }
}

function addSeedSlot(count=1) {
    

    for(let i=0; i<count ;++i) {
        let seed = new ItemWindow("SeedInventory");
        seedPouch.push(seed);
    }
}

function addFruitSlot(count=1) {


    for(let i=0; i<count ;++i) {
        let fruit = new ItemWindow("FruitInventory");
        fruitPouch.push(fruit);
    }
}



const Sun = {

    Plant: ["Sunflower_1","Sunflower_2"],
    Seed: "Sunflowerseed",
    Fruit: "Sunflowerfruit"
}

const Bean = {

    Plant: ["Beantree_1","Beantree_2"],
    Seed: "Beantreeseed",
    Fruit: "Bean"
}

const Berry = {

    Plant: ["Berrybush_1","Berrybush_1"],
    Seed: "BerrybushSeed",
    Fruit: "Berry"
}




class generalButtons {
    constructor(name) {
        let button = document.getElementById(name);
        button.addEventListener("click",this.addPlantSlot);
        this.ID = button.ID;
    }

    addPlantSlot = (amount=1) => {    

        console.log("clicked");
        
        let bucket = new flowerPot();

        //store for later
        plantSlots.push(bucket);
    }
}

class Item {
    
    constructor(count=1, texture) {
        this.count = count;
        this.name = texture;
        this.texture = texture;
    }

    class() {
        return "inventorySlots";
    }
}


class Plant {
    constructor(type){
        this.stage = 0;
        this.type = type;
        this.ID = 0;
    }

    class() { return "plantSlots"; }


//to do!
    tick = () => {

        return false;
    }

    grow = () => {
        this.stage++;
    }

    Fruits = () => {

        let fruitAmount = Math.floor(Math.random() * 3);

        return fruitAmount;
    }

    Seeds = () => {
        let seedAmount = Math.floor(Math.random() * 3);

        return seedAmount;
    }

    
    planttype(i) {
        return this.type.Plant[i];
    }
    
    seedtype = () => {
        return this.type.Seed;
    }
    
    fruittype = () => {
        return this.type.Fruit;
    }
}


class flowerPot {
    constructor() {

        let divElement = document.createElement("div");
        this.elementID = divElement.id = randId();
        divElement.classList.add("plantSlots");

        this.createHarvestButton(divElement);
        this.createWaterButton(divElement);

        const mainWindow = document.getElementById("mainWindow");
        mainWindow.appendChild(divElement);
    }

    plant(flower) {
        this.flower = flower;

        //insert plant image
        let divElement = document.getElementById(this.elementID);
        let texture = document.getElementById(this.flower.type.Plant[this.flower.stage]).cloneNode();
        this.flower.ID = texture.id = randId();
        divElement.append(texture);

        //insert interactable shiggy
        let shiggy = document.getElementById("wateringcan").cloneNode();
        let watericon = document.getElementById(this.watericonID);
        watericon.append(shiggy);
        watericon.addEventListener("click",this.watering);

        //insert interactable death
        let death = document.getElementById("death").cloneNode();
        let harvesticon = document.getElementById(this.harvesticonID);
        harvesticon.append(death);
        harvesticon.addEventListener("click", this.harvest);

    }

    harvest = () => {



        let fruits = new Item(this.flower.Fruits,this.flower.fruittype);
        let seeds = new Item(this.flower.Seeds,this.flower.seedtype);

        console.log("created");

        if(fruits != null){
            for (let i=0; i < fruitPouch.length; i++) {
                console.log(fruitPouch[i]);
                if(fruitPouch[i].sameFruit(fruits)){
                    console.log("fruits");
                    fruitPouch[i].add(fruits.count);
                    return;
                }
            }
            
            for (let i=0; i < fruitPouch.length; i++) {
                if(fruitPouch[i].isEmpty()){
                    console.log("fruits");
                    fruitPouch[i].setItem(fruits.fruittype);
                    return;
                }
            }
            
        }

        if(seeds != null){

            for (let i=0; i < seedPouch.length; i++) {
                if(seedPouch[i].sameSeed(seeds)){
                    console.log("seeds");
                    seedPouch[i].add(seeds.count);
                    return;
                }
            }
        }



    }

    watering = () => {
        let divElement = document.getElementById(this.elementID);
        let oldtexture = document.getElementById(this.flower.ID);
        
        this.flower.grow();
        if(document.getElementById(this.flower.planttype(this.flower.stage)) != null) {
            let texture = document.getElementById(this.flower.planttype(this.flower.stage)).cloneNode();
            this.flower.ID = texture.id = randId();
            
            divElement.replaceChild(texture, oldtexture);
        }
    }

    createHarvestButton(divElement) {
        let harvesticon = document.createElement("button");
        this.harvesticonID = harvesticon.id = randId();
        harvesticon.classList.add("interactIcon");
        divElement.appendChild(harvesticon);
    }

    createWaterButton(divElement) {
        let watericon = document.createElement("button");
        this.watericonID = watericon.id = randId();
        watericon.classList.add("interactIcon");
        divElement.appendChild(watericon);
    }

    isEmpty() {
        return this.flower == null;
    }

}


class ItemWindow {

    constructor(inventoryID) {

        let divElement = document.createElement("div");
        this.elementID = divElement.id = randId();
        divElement.classList.add("inventorySlots");
        
        let counter = document.createElement("div");
        this.counterID = counter.id = randId();
        counter.classList.add("inventorySlotsCount");
        divElement.appendChild(counter);
       
        const mainWindow = document.getElementById(inventoryID);
        mainWindow.appendChild(divElement);
        this.item = null;
    }

    setItem(itemtype) {
        this.item = new Item(1,itemtype);
        let divElement = document.getElementById(this.elementID);
        let texture = document.getElementById(itemtype).cloneNode();
        divElement.appendChild(texture);

        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;
    }

    sameFruit(input) {
        return this.item.fruittype == input.fruittype;
    }

    sameSeed(input) {
        return this.item.seedtype == input.seedtype;
    }

    isEmpty() {
        return this.item == null;
    }

    plant() {
        for (let i=0; i < plantSlots.length; i++) {
            if (plantSlots[i].isEmpty() == true) {
                plantSlots[i].plant(this.item);
                return;
            }
        }
        throw "no spot available";
    }

    add(n=1) {
        this.item.count += n;
        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;
    }
}










