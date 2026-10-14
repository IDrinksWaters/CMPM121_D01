// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
// this is a test
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const message = document.createElement("p");
message.textContent = "Milk Dragons: 0";

app.append(heading, image, message);

//--------------------------------------------
//For number count
let milkDragonCount = 0;
let maxSoldierCount = 0;
let saltSoldierCount = 0;
let waterBottleSoldierCount = 0;

//For click counter
let clickStart = 1;

//For required power
let maxReqPower = 100;
let saltReqPower = 500;
let waterBottleReqPower = 1000;

//For base_power
let milkDragonBasePower = 1;
let maxSoldierBasePower = 10;
let saltSoldierBasePower = 50;
let waterBottleSoldierBasePower = 100;

//For base_production speed (BPS)
let milkDragonBPS = 0;
let maxSoldierBPS = 0.1;
let saltSoldierBPS = 0.1;
let waterBottleSoldierBPS = 0.1;

//For power upgrades

let milkDragonTroopCamp: boolean = false;
let maxTroopCamp: boolean = false;
let saltTroopCamp: boolean = false;
let waterBottleTroopCamp: boolean = false;

let milkDragonBlackSmith: boolean = false;
let maxBlackSmith: boolean = false;
let saltBottleBlackSmith: boolean = false;
let waterBottleBlackSmith: boolean = false;

let advertisement: boolean = false;
let cloneTechnology: boolean = false;

//--------------------------------------------

//Calucate the combined power of all troops.
function calculateTotalPower(): number {
  return (
    milkDragonCount * milkDragonBasePower +
    maxSoldierCount * maxSoldierBasePower +
    saltSoldierCount * saltSoldierBasePower +
    waterBottleSoldierCount * waterBottleSoldierBasePower
  );
}

//Create text for the other three armies.
const soldierCountText = document.createElement("p");

//Create text for total power.
const totalPowerText = document.querySelector<HTMLParagraphElement>(
  "#total_power_display",
)!;
//Create the recruitment button.
const recruitButton = document.querySelector<HTMLButtonElement>(
  "#increment_button",
)!;

//Update the displayed numbers.
function updateDisplay(): void {
  message.textContent = "Milk Dragons: ${milkDragonCount}";

  soldierCountText.textContent = "Max Soldiers: ${maxSoldierCount} | " +
    "Salt Soldiers: ${saltSoldierCount} | " +
    "Water Bottle Soldiers: ${waterBottleSoldierCount}";

  totalPowerText.textContent = "Current Total Power: ${calculateTotalPower()}";

  recruitButton.textContent = "Gain Soldiers! (+${clickStart})";
}

//Recruit Milk Dragons using the current click amount.
recruitButton.addEventListener("click", () => {
  milkDragonCount += clickStart;
  updateDisplay();
});

app.append(soldierCountText);

//Show the initial game state.
updateDisplay();
