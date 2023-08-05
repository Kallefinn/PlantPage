document.body.onload = startup;

function randId() {
    return "id" + Math.random().toString(16).slice(2);
}


var plantSlots = [];

var seedPouch = [];

var fruitPouch = [];


function startup() {
    addPlantSlot(3);
    addFruitSlot(3);
    addSeedSlot(3);

    plantSlots[1].Insert(new Plant(Sun));
    console.log(document.getElementById(Bean.Seed));
    seedPouch[0].setItem(new Item(4,Bean.Seed));
    fruitPouch[1].setItem(new Item(2,Berry.Fruit));

    const shovel = new generalButtons("newPlantSlotButton","green","create");
    const spatula = new generalButtons("deletePlantSlotButton","red","delete");

}

//function to add "Windows" or "flowerpots" in this case for plants
addPlantSlot = (amount=1) => {    

    
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

const BaseCase = {
    Plant: ["BaseTexture","BaseTexture"],
    Seed: "BaseTexture",
    Fruit: "BaseTexture"
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
    Seed: "Berrybushseed",
    Fruit: "Berry"
}

function createInstanceOf(name) {
    console.log(name);
    let texture = document.getElementById(name).cloneNode();
    texture.id = randId();
    return texture;
}

function createInteractButton(divElement,texture = "BaseTexture") {
    let button = document.createElement("button");
    button.id = randId();
    button.classList.add("interactIcon");
    button.append(createInstanceOf(texture));
    divElement.appendChild(button);
    return button.id;
}


class generalButtons {
    constructor(name, color="grey",method) {
        let button = document.getElementById(name);
        if(method == "create")
            button.addEventListener("click",this.addPlantSlot);
        if(method == "delete")
            button.addEventListener("click",this.deletePlantSlot);
        button.style.backgroundColor = color;
        this.ID = button.ID;
    }

    addPlantSlot = () => {    
        
        let bucket = new flowerPot();

        //store for later
        plantSlots.push(bucket);
    }

    deletePlantSlot = () => {
        let slot = document.getElementById(plantSlots.pop().elementID);
        slot.remove();
        
    }
}

class Item {
    
    constructor(count=1, texture = "BaseTexture") {
        this.count = count;
        this.texture = texture;
    }

    class() {
        return "inventorySlots";
    }
}


class Plant {

    constructor(type = BaseCase){
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

    yield = () => {
        return Math.floor(Math.random() * 3);
    }
    
}


class flowerPot {
    
    constructor(plant = new Plant()) {

        this.plant = plant;

        let divElement = document.createElement("div");
        this.elementID = divElement.id = randId();
        divElement.classList.add("plantSlots");

        let plantImage = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
        this.plant.ID = plantImage.id;

        divElement.append(plantImage);

        const mainWindow = document.getElementById("mainWindow");
        mainWindow.appendChild(divElement);
    }

    Insert(flower) {

        let divElement = document.getElementById(this.elementID);

        //insert interactable shiggy
        let waterbuttonID = createInteractButton(divElement,"wateringcan");
        document.getElementById(waterbuttonID).addEventListener("click",this.watering);

        //insert interactable death
        let harvestbuttonID = createInteractButton(divElement,"death");
        document.getElementById(harvestbuttonID).addEventListener("click",this.harvest);


        let oldtexture = document.getElementById(this.plant.ID);

        this.plant = flower;


        let plantImage = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
        this.plant.ID = plantImage.id;
        divElement.replaceChild(plantImage,oldtexture);



    }

    harvest = () => {

    }

    watering = () => {
        let divElement = document.getElementById(this.elementID);
        
        this.plant.grow();

        console.log(this.plant.ID);
        let oldtexture = document.getElementById(this.plant.ID);
        let texture = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
        this.plant.ID = texture.id;
            
        divElement.replaceChild(texture, oldtexture);    
    }


    isEmpty() {
        return this.plant == null;
    }

}


class ItemWindow {

    constructor(inventoryID, item = new Item()) {

        let divElement = document.createElement("div");
        this.elementID = divElement.id = randId();
        divElement.classList.add("inventorySlots");
        
        let counter = document.createElement("div");
        this.counterID = counter.id = randId();
        counter.classList.add("inventorySlotsCount");
        divElement.appendChild(counter);
       
        const mainWindow = document.getElementById(inventoryID);
        mainWindow.appendChild(divElement);

        this.item = item;
        
    }

    setItem(item) {
        this.item = item;
        let divElement = document.getElementById(this.elementID);
        console.log(item.texture);
        let texture = createInstanceOf(item.texture);
        divElement.appendChild(texture);

        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;
    }

    isEmpty() {
        return this.item == null;
    }


    add(n=1) {
        this.item.count += n;
        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;
    }
}










