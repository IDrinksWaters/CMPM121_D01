// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
// this is a test

const app = document.querySelector<HTMLElement>("#app")!;

const message = document.createElement("p");
message.textContent = "Milk Dragons: 0";

//-------------------- VARIABLES HERE
//For number count
let milkDragonCount = 0;
let maxSoldierCount = 0;
let saltSoldierCount = 0;
let waterBottleSoldierCount = 0;

//For click counter
const clickStart = 1;

//For required power
const maxReqPower = 100;
const saltReqPower = 500;
const waterBottleReqPower = 1000;

//For base_power
const milkDragonBasePower = 1;
const maxSoldierBasePower = 10;
const saltSoldierBasePower = 50;
const waterBottleSoldierBasePower = 100;

//Use the original base power as the bonus requirement.
const maxMilkRequirement = maxSoldierBasePower;
const saltMilkRequirement = saltSoldierBasePower;
const waterBottleMilkRequirement = waterBottleSoldierBasePower;

const maxSoldierBPS = 0.1;
const saltSoldierBPS = 0.1;
const waterBottleSoldierBPS = 0.1;

//Track Milk Dragons produced after each troop is unlocked.
let maxMilkProgress = 0;
let saltMilkProgress = 0;
let waterBottleMilkProgress = 0;

//-----------

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

    productionProgress += elapsedSeconds * maxSoldierBPS;

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

//Produce Milk Dragons and award unlocked bonus soldiers.
function produceMilkDragons(amount: number): void {
  milkDragonCount += amount;

  if (maxUnlocked) {
    maxMilkProgress += amount;

    const bonusSoldiers = Math.floor(maxMilkProgress / maxMilkRequirement);

    maxSoldierCount += bonusSoldiers;
    maxMilkProgress %= maxMilkRequirement;
  }

  if (saltUnlocked) {
    saltMilkProgress += amount;

    const bonusSoldiers = Math.floor(saltMilkProgress / saltMilkRequirement);

    saltSoldierCount += bonusSoldiers;
    saltMilkProgress %= saltMilkRequirement;
  }

  if (waterBottleUnlocked) {
    waterBottleMilkProgress += amount;

    const bonusSoldiers = Math.floor(
      waterBottleMilkProgress / waterBottleMilkRequirement,
    );

    waterBottleSoldierCount += bonusSoldiers;
    waterBottleMilkProgress %= waterBottleMilkRequirement;
  }

  updateDisplay();
}

//Recruit Milk Dragons using the current click amount.
recruitButton.addEventListener("click", () => {
  produceMilkDragons(clickStart);
});

app.append(message, soldierCountText);

updateDisplay();
