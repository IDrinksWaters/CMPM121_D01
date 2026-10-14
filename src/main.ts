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

//Spend soldiers to pay the required power.
function spendPower(requiredPower: number): boolean {
  //Do not spend anything if the total power is insufficient.
  if (calculateTotalPower() < requiredPower) {
    return false;
  }

  let remainingPower = requiredPower;

  //Return the remaining count after spending this troop type.
  function consumeTroops(
    count: number,
    powerPerSoldier: number,
  ): number {
    if (remainingPower <= 0) {
      return count;
    }

    const soldiersToSpend = Math.min(
      count,
      Math.ceil(remainingPower / powerPerSoldier),
    );

    remainingPower -= soldiersToSpend * powerPerSoldier;

    return count - soldiersToSpend;
  }

  //Spend lower-tier troops first.
  milkDragonCount = consumeTroops(milkDragonCount, milkDragonBasePower);

  maxSoldierCount = consumeTroops(maxSoldierCount, maxSoldierBasePower);

  saltSoldierCount = consumeTroops(saltSoldierCount, saltSoldierBasePower);

  waterBottleSoldierCount = consumeTroops(
    waterBottleSoldierCount,
    waterBottleSoldierBasePower,
  );

  return true;
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

//Track whether leaders has been defeated.
let maxUnlocked = false;
let saltUnlocked = false;
let waterBottleUnlocked = false;

//Connect to the attack buttons.
const maxUnlockButton = document.querySelector<HTMLButtonElement>(
  "#unlock_max_button",
)!;

const saltUnlockButton = document.querySelector<HTMLButtonElement>(
  "#unlock_salt_button",
)!;

const waterBottleUnlockButton = document.querySelector<HTMLButtonElement>(
  "#unlock_water_bottle_button",
)!;

//Start automatic production of Max soldiers.
function startMaxProduction(): void {
  let productionProgress = 0;
  let lastUpdateTime = performance.now();

  setInterval(() => {
    //Calculate the elapsed time in seconds.
    const currentTime = performance.now();
    const elapsedSeconds = (currentTime - lastUpdateTime) / 1000;

    lastUpdateTime = currentTime;

    //Accumulate production using the current BPS.
    productionProgress += elapsedSeconds * maxSoldierBPS;

    //Only add completed soldiers.
    const newSoldiers = Math.floor(productionProgress);

    if (newSoldiers > 0) {
      maxSoldierCount += newSoldiers;
      productionProgress -= newSoldiers;
      updateDisplay();
    }
  }, 100);
}

//Start automatic production of Salt soldiers.
function startSaltProduction(): void {
  let productionProgress = 0;
  let lastUpdateTime = performance.now();

  setInterval(() => {
    const currentTime = performance.now();
    const elapsedSeconds = (currentTime - lastUpdateTime) / 1000;

    lastUpdateTime = currentTime;
    productionProgress += elapsedSeconds * saltSoldierBPS;

    const newSoldiers = Math.floor(productionProgress);

    if (newSoldiers > 0) {
      saltSoldierCount += newSoldiers;
      productionProgress -= newSoldiers;
      updateDisplay();
    }
  }, 100);
}

//Start automatic production of Water Bottle soldiers.
function startWaterBottleProduction(): void {
  let productionProgress = 0;
  let lastUpdateTime = performance.now();

  setInterval(() => {
    const currentTime = performance.now();
    const elapsedSeconds = (currentTime - lastUpdateTime) / 1000;

    lastUpdateTime = currentTime;
    productionProgress += elapsedSeconds * waterBottleSoldierBPS;

    const newSoldiers = Math.floor(productionProgress);

    if (newSoldiers > 0) {
      waterBottleSoldierCount += newSoldiers;
      productionProgress -= newSoldiers;
      updateDisplay();
    }
  }, 100);
}

//Spend soldiers to defeat Max and start production.
maxUnlockButton.addEventListener("click", () => {
  if (maxUnlocked) {
    return;
  }

  if (!spendPower(maxReqPower)) {
    return;
  }

  maxUnlocked = true;
  startMaxProduction();
  updateDisplay();
});

//Spend soldiers to defeat Salt and start production.
saltUnlockButton.addEventListener("click", () => {
  if (!maxUnlocked || saltUnlocked) {
    return;
  }

  if (!spendPower(saltReqPower)) {
    return;
  }

  saltUnlocked = true;
  startSaltProduction();
  updateDisplay();
});

//Spend soldiers to defeat Water Bottle and start production.
waterBottleUnlockButton.addEventListener("click", () => {
  if (!saltUnlocked || waterBottleUnlocked) {
    return;
  }

  if (!spendPower(waterBottleReqPower)) {
    return;
  }

  waterBottleUnlocked = true;
  startWaterBottleProduction();
  updateDisplay();
});

//Update the displayed numbers.
function updateDisplay(): void {
  message.textContent = "Milk Dragons: " + milkDragonCount;

  soldierCountText.textContent = "Max Soldiers: " + maxSoldierCount +
    " | Salt Soldiers: " + saltSoldierCount +
    " | Water Bottle Soldiers: " + waterBottleSoldierCount;

  totalPowerText.textContent = "Current Total Power: " + calculateTotalPower();

  recruitButton.textContent = "Gain Soldiers! (+" + clickStart + ")";

  //Enable unlocking only when the required power is reached.
  maxUnlockButton.disabled = maxUnlocked || calculateTotalPower() < maxReqPower;

  //Show whether Max has been unlocked.
  if (maxUnlocked) {
    maxUnlockButton.textContent = "Max Defeated";
  } else {
    maxUnlockButton.textContent = "Attack Max (Requires " + maxReqPower +
      " Power)";
  }

  //Update the Salt attack button.
  saltUnlockButton.disabled = !maxUnlocked ||
    saltUnlocked ||
    calculateTotalPower() < saltReqPower;

  if (saltUnlocked) {
    saltUnlockButton.textContent = "Salt Defeated";
  } else if (!maxUnlocked) {
    saltUnlockButton.textContent = "Attack Salt (Defeat Max First)";
  } else {
    saltUnlockButton.textContent = "Attack Salt (Requires " + saltReqPower +
      " Power)";
  }

  //Update the Water Bottle attack button.
  waterBottleUnlockButton.disabled = !saltUnlocked ||
    waterBottleUnlocked ||
    calculateTotalPower() < waterBottleReqPower;

  if (waterBottleUnlocked) {
    waterBottleUnlockButton.textContent = "Water Bottle Defeated";
  } else if (!saltUnlocked) {
    waterBottleUnlockButton.textContent =
      "Attack Water Bottle (Defeat Salt First)";
  } else {
    waterBottleUnlockButton.textContent = "Attack Water Bottle (Requires " +
      waterBottleReqPower + " Power)";
  }
}

//Recruit Milk Dragons using the current click amount.
recruitButton.addEventListener("click", () => {
  milkDragonCount += clickStart;
  updateDisplay();
});

app.append(soldierCountText);

//Show the initial game state.
updateDisplay();
