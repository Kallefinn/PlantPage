document.body.onload = startup;

function randId() {
    return "id" + Math.random().toString(16).slice(2);
}


function updateWorld() {

    for(let i=0;i<plantSlots.length;i++){
        if(!plantSlots[i].isEmpty()){
            plantSlots[i].updatePlant();
        }
    }

    requestAnimationFrame(updateWorld);
}

requestAnimationFrame(updateWorld);

var plantSlots = [];

var seedPouch = [];

var fruitPouch = [];

const buttontype = {
    create: "newPlantSlotButton",
    delete: "deletePlantSlotButton"
}

function startup() {
    addPlantSlot(3);
    addFruitSlot(2);
    addSeedSlot(2);

    plantSlots[0].Insert(new Plant(Berry));
    plantSlots[1].Insert(new Plant(Sun));
    plantSlots[2].Insert(new Plant(Bean));
    
    seedPouch[0].Insert(new Item(4,Bean));
    seedPouch[1].Insert(new Item(4,Berry));
    
    fruitPouch[0].Insert(new Item(2,Berry));
    fruitPouch[1].Insert(new Item(2,Sun));

    const shovel = new generalButtons(buttontype.create);
    const spatula = new generalButtons(buttontype.delete);

}

function uglyDragAndDrop(text) {
    console.log(Bean.Plant[0]);
    if(text == Sun.Plant[0]) {
        return Sun;
    }
    if(text == Bean.Plant[0]) {
        return Bean;
    }
    if(text == Berry.Plant[0]) {
        return Berry;
    }
    return BaseCase;
}

function insertElementIn(array,element,name) {
    let planted = false;

    for(let i=0;i<array.length && !planted;i++) {
        if(array[i].isSame(element.type)) {
            array[i].add(element.count);
            planted = true;
        }
    
    }
    for(let i=0;i<array.length && !planted;i++) {
        if(array[i].isEmpty()) {
            array[i].Insert(element);
            planted = true;
        }
    }

    if(planted == false) {
        array.push(new ItemWindow(name));
        array[array.length-1].Insert(element);
    }

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
        let seed = new ItemWindow(inventory.Seed);
        seedPouch.push(seed);
    }
}

function addFruitSlot(count=1) {
    for(let i=0; i<count ;++i) {
        let fruit = new ItemWindow(inventory.Fruit);
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

    Plant: ["Berrybush_1","Berrybush_2"],
    Seed: "Berrybushseed",
    Fruit: "Berry"
}

function createInstanceOf(name) {
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
    constructor(name) {
        let button = document.getElementById(name);
        if(name == buttontype.create){
            button.addEventListener("click",this.addPlantSlot);
            button.style.backgroundColor = "green";
        }
        if(name == buttontype.delete) {
            button.addEventListener("click",this.deletePlantSlot);
            button.style.backgroundColor = "red";
        }
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

const inventory = {
    Seed: "SeedInventory",
    Fruit: "FruitInventory"
}

class Item {
    
    constructor(count=1, type = BaseCase) {
        this.count = count;
        this.type = type;
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
        this.watered = false;
        this.timer = Math.floor(Math.random() * 5) + 5;
    }

    class() { return "plantSlots"; }
    
    fullyGrown() {
        return this.stage == this.type.Plant.length - 1;
    }

//to do!
    tick = () => {

        
        if(1 == Math.floor(Math.random() * 200)) {
            this.watered = false;
        }

        if(this.watered && Math.floor(Math.random() * 300) == 3) {
            return true;
        }
        return false;

    }

    grow = () => {
        this.stage++;
        this.timer = Math.floor(Math.random() * 5) + 5;
    }


    heaped = () => {
        return new Item(Math.floor(Math.random() * 2) + 1, this.type);
    }
    
}


class flowerPot {
    
    constructor(plant = new Plant()) {

        this.plant = plant;

        let divElement = document.createElement("div");
        this.elementID = divElement.id = randId();
        divElement.classList.add("plantSlots");
        
        divElement.addEventListener("dragover",function(e){e.preventDefault();},false);
        

        let plantImage = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
        this.plant.ID = plantImage.id;

        divElement.append(plantImage);

        divElement.addEventListener("dragenter", (Event) => {
            Event.preventDefault();
        });
        divElement.addEventListener("dragover", (Event) => {
            Event.preventDefault();
        });
        divElement.addEventListener("drop", (Event) => {
            let cargo = Event.dataTransfer.getData("text");
            console.log(cargo);
            let input = uglyDragAndDrop(cargo);
            console.log(input);
            this.Insert(new Plant(input));
        });

        const mainWindow = document.getElementById("mainWindow");
        mainWindow.appendChild(divElement);
    }

    Insert = (flower) => {

        if(this.plant.type == BaseCase) {

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
    }

    harvest = () => {
        if(this.plant.fullyGrown()) {
            this.plant.stage = 0;
            this.updateImage();
            insertElementIn(fruitPouch, this.plant.heaped(), "FruitInventory");
            insertElementIn(seedPouch, this.plant.heaped(), "SeedInventory");
        }
    }

    updateImage() {
        let divElement = document.getElementById(this.elementID);
        let oldtexture = document.getElementById(this.plant.ID);
        let plantImage = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
        this.plant.ID = plantImage.id;
        divElement.replaceChild(plantImage,oldtexture);
    }

    watering = () => {
        this.plant.watered = true;
    }

    growPlant() {
        if( ! (this.plant.fullyGrown())) {

            let divElement = document.getElementById(this.elementID);
            
            this.plant.grow();
    
            let oldtexture = document.getElementById(this.plant.ID);
            let texture = createInstanceOf(this.plant.type.Plant[this.plant.stage]);
            this.plant.ID = texture.id;
                
            divElement.replaceChild(texture, oldtexture);
            }
    }

    updatePlant() {
        let divElement = document.getElementById(this.elementID);

        if(this.plant.tick()) {
            this.growPlant();
        }
        
        if(this.plant.watered == false) {
            divElement.style.backgroundColor = "brown";
        } else {
            divElement.style.backgroundColor = "green";
        }


    }

    isEmpty() {
        return this.plant.type == BaseCase;
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
        this.inventory = inventoryID;
        
    }

    Insert(item) {
        this.item = item;
        let divElement = document.getElementById(this.elementID);

        if(this.inventory == inventory.Fruit) {
            let texture = createInstanceOf(this.item.type.Fruit);
            divElement.appendChild(texture);
        }
        if(this.inventory == inventory.Seed) {
            let texture = createInstanceOf(this.item.type.Seed);
            divElement.appendChild(texture);
        }

        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;

        divElement.addEventListener("dragstart", (Event) => 
        Event.dataTransfer.setData("text",this.item.type.Plant[0]));
        divElement.addEventListener("dragend", (Event) => {
        this.add(-1);})
    }

    isEmpty() {
        return this.item.type == BaseCase;
    }

    isSame(type) {
        return this.item.type == type;
    }

    add(n=1) {
        this.item.count += n;
        let counter = document.getElementById(this.counterID);
        counter.innerText = this.item.count;
    }
}

