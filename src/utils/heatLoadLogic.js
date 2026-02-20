export const MANUAL_J_STATE = {
    // Basic Info
    buildingArea: '',
    ceilingHeight: 8,
    occupancy: 4,
    orientation: 'south',
    // Building Details
    windowPercentage: 15,
    insulationLevel: 'average',
    windowType: 'double',
    foundationType: 'slab',
    // Climate
    climateZone: 'mixed-humid',
    // Advanced / Calculated (Inputs)
    outdoorDesignTempWinter: 15,
    outdoorDesignTempSummer: 90,
    humidityRatio: 90,
    airChanges: 0.5,
    ventilationCFM: 0,
    // Calculated Areas (Read-only in UI but stored here)
    wallArea: 0,
    windowArea: 0,
    roofArea: 0,
    doorArea: 40,
    floorArea: 0,
    // Calculated U-Values
    wallUValue: 0.08,
    roofUValue: 0.03,
    floorUValue: 0.05,
    windowUValue: 0.45,
    windowSHGC: 0.4,
    doorUValue: 0.2,
    // Loads
    applianceLoad: 0,
    lightingLoad: 0,
    // Hidden constants
    indoorDesignTempWinter: 70,
    indoorDesignTempSummer: 75
}

export const SOLAR_HEAT_GAIN_FACTORS = {
    north: 15,
    south: 50,
    east: 120,
    west: 120,
    northeast: 80,
    northwest: 80,
    southeast: 100,
    southwest: 100,
    mixed: 80
};

export const FOUNDATION_FACTORS = {
    slab: 0.8,      // F-factor for slab edge
    basement: 1.0,  // Below-grade wall factor
    crawlspace: 1.2 // Exposed floor factor
};

export const CLIMATE_ZONES = {
    'hot-humid': { winterTemp: 30, summerTemp: 95, humidity: 100 },
    'hot-dry': { winterTemp: 25, summerTemp: 105, humidity: 60 },
    'mixed-humid': { winterTemp: 15, summerTemp: 90, humidity: 90 },
    'mixed-dry': { winterTemp: 5, summerTemp: 95, humidity: 70 },
    'cold': { winterTemp: -5, summerTemp: 85, humidity: 80 },
    'very-cold': { winterTemp: -15, summerTemp: 80, humidity: 75 }
};

export const BUILDING_PRESETS = {
    'new-construction': {
        insulationLevel: 'good',
        windowType: 'double-low-e',
        airChanges: 0.3
    },
    'existing-home': {
        insulationLevel: 'average',
        windowType: 'double',
        airChanges: 0.5
    },
    'older-home': {
        insulationLevel: 'poor',
        windowType: 'single',
        airChanges: 0.8
    }
};

export const INSULATION_U_VALUES = {
    poor: { wall: 0.15, roof: 0.08, floor: 0.08 },
    average: { wall: 0.08, roof: 0.03, floor: 0.05 },
    good: { wall: 0.05, roof: 0.025, floor: 0.03 },
    excellent: { wall: 0.03, roof: 0.018, floor: 0.02 }
};

export const WINDOW_TYPES = {
    single: { uValue: 0.9, shgc: 0.6 },
    double: { uValue: 0.45, shgc: 0.4 },
    'double-low-e': { uValue: 0.3, shgc: 0.3 },
    triple: { uValue: 0.2, shgc: 0.25 }
};

export const EQUIPMENT_STANDARD_SIZES = [1.5, 2, 2.5, 3, 3.5, 4, 5];

export class ManualJFieldConstants {
    constructor() {
        this.STATE = {
            // Basic Info
            buildingArea: '',
            ceilingHeight: 8,
            occupancy: 4,
            orientation: 'south',
            // Building Details
            windowPercentage: 15,
            insulationLevel: 'average',
            windowType: 'double',
            foundationType: 'slab',
            // Climate
            climateZone: 'mixed-humid',
            // Advanced / Calculated (Inputs)
            outdoorDesignTempWinter: 15,
            outdoorDesignTempSummer: 90,
            humidityRatio: 90,
            airChanges: 0.5,
            ventilationCFM: 0,
            // Calculated Areas (Read-only in UI but stored here)
            wallArea: 0,
            windowArea: 0,
            roofArea: 0,
            doorArea: 40,
            floorArea: 0,
            // Calculated U-Values
            wallUValue: 0.08,
            roofUValue: 0.03,
            floorUValue: 0.05,
            windowUValue: 0.45,
            windowSHGC: 0.4,
            doorUValue: 0.2,
            // Loads
            applianceLoad: 0,
            lightingLoad: 0,
            // Hidden constants
            indoorDesignTempWinter: 70,
            indoorDesignTempSummer: 75
        }
        this.SOLAR_HEAT_GAIN_FACTORS = {
            north: 15,
            south: 50,
            east: 120,
            west: 120,
            northeast: 80,
            northwest: 80,
            southeast: 100,
            southwest: 100,
            mixed: 80
        };
        this.FOUNDATION_FACTORS = {
            slab: 0.8,      // F-factor for slab edge
            basement: 1.0,  // Below-grade wall factor
            crawlspace: 1.2 // Exposed floor factor
        };
        this.CLIMATE_ZONES = {
            'hot-humid': { winterTemp: 30, summerTemp: 95, humidity: 100 },
            'hot-dry': { winterTemp: 25, summerTemp: 105, humidity: 60 },
            'mixed-humid': { winterTemp: 15, summerTemp: 90, humidity: 90 },
            'mixed-dry': { winterTemp: 5, summerTemp: 95, humidity: 70 },
            'cold': { winterTemp: -5, summerTemp: 85, humidity: 80 },
            'very-cold': { winterTemp: -15, summerTemp: 80, humidity: 75 }
        };
        this.BUILDING_PRESETS = {
            'new-construction': {
                insulationLevel: 'good',
                windowType: 'double-low-e',
                airChanges: 0.3
            },
            'existing-home': {
                insulationLevel: 'average',
                windowType: 'double',
                airChanges: 0.5
            },
            'older-home': {
                insulationLevel: 'poor',
                windowType: 'single',
                airChanges: 0.8
            }
        };
        this.INSULATION_U_VALUES = {
            poor: { wall: 0.15, roof: 0.08, floor: 0.08 },
            average: { wall: 0.08, roof: 0.03, floor: 0.05 },
            good: { wall: 0.05, roof: 0.025, floor: 0.03 },
            excellent: { wall: 0.03, roof: 0.018, floor: 0.02 }
        };
        this.WINDOW_TYPES = {
            single: { uValue: 0.9, shgc: 0.6 },
            double: { uValue: 0.45, shgc: 0.4 },
            'double-low-e': { uValue: 0.3, shgc: 0.3 },
            triple: { uValue: 0.2, shgc: 0.25 }
        };
        this.EQUIPMENT_STANDARD_SIZES = [1.5, 2, 2.5, 3, 3.5, 4, 5];
    }
}


export class HeatLoadCalculator {
    static calculateDerivedValues(data) {
        const area = parseFloat(data.buildingArea) || 0;
        
        if (area <= 0) return null;

        // Calculate areas
        const perimeter = Math.sqrt(area) * 4; // Assume square house
        const height = parseFloat(data.ceilingHeight) || 8;
        const wallAreaTotal = perimeter * height - 40; // Subtract door area
        const winPct = parseFloat(data.windowPercentage) || 15;
        const winArea = wallAreaTotal * (winPct / 100);
        const adjustedWallArea = wallAreaTotal - winArea;
        const roofArea = Math.round(area * 1.15); // Account for roof pitch

        // Get U-values
        const insLevel = data.insulationLevel;
        const uValues = INSULATION_U_VALUES[insLevel] || INSULATION_U_VALUES.average;

        // Get Window properties
        const winType = data.windowType;
        const winProps = WINDOW_TYPES[winType] || WINDOW_TYPES.double;

        // Calculate appliance and lighting loads
        const appLoad = Math.max(800, area * 0.5);
        const lightLoad = area * 0.3;

        return {
            wallArea: Math.round(adjustedWallArea),
            windowArea: Math.round(winArea),
            roofArea: roofArea,
            floorArea: area,
            wallUValue: uValues.wall,
            roofUValue: uValues.roof,
            floorUValue: uValues.floor,
            windowUValue: winProps.uValue,
            windowSHGC: winProps.shgc,
            applianceLoad: Math.round(appLoad),
            lightingLoad: Math.round(lightLoad)
        };
    }

    static calculateHeatLoad(data) {
        const results = {
            heatingLoad: 0,
            coolingSensible: 0,
            coolingLatent: 0,
            coolingTotal: 0,
            breakdown: []
        };

        // Calculate temperature differences
        const heatingDeltaT = data.indoorDesignTempWinter - data.outdoorDesignTempWinter;
        const coolingDeltaT = data.outdoorDesignTempSummer - data.indoorDesignTempSummer;

        // Building volume for infiltration calculations
        const buildingVolume = data.buildingArea * data.ceilingHeight;

        // 1. CONDUCTION LOADS
        // Walls
        const wallHeatingLoad = data.wallUValue * data.wallArea * heatingDeltaT;
        const wallCoolingLoad = data.wallUValue * data.wallArea * coolingDeltaT;
        results.heatingLoad += wallHeatingLoad;
        results.coolingSensible += wallCoolingLoad;
        results.breakdown.push({
            component: 'Walls (Conduction)',
            heating: Math.round(wallHeatingLoad),
            cooling: Math.round(wallCoolingLoad)
        });

        // Windows - conduction only
        const windowHeatingLoad = data.windowUValue * data.windowArea * heatingDeltaT;
        const windowConductionCooling = data.windowUValue * data.windowArea * coolingDeltaT;
        results.heatingLoad += windowHeatingLoad;
        results.coolingSensible += windowConductionCooling;
        results.breakdown.push({
            component: 'Windows (Conduction)',
            heating: Math.round(windowHeatingLoad),
            cooling: Math.round(windowConductionCooling)
        });

        // Windows - solar gain (cooling only)
        const solarHeatGainFactor = SOLAR_HEAT_GAIN_FACTORS[data.orientation] || 80;
        const windowSolarGain = data.windowArea * data.windowSHGC * solarHeatGainFactor;
        results.coolingSensible += windowSolarGain;
        results.breakdown.push({
            component: 'Windows (Solar Gain)',
            heating: 0,
            cooling: Math.round(windowSolarGain)
        });

        // Doors
        const doorHeatingLoad = data.doorUValue * data.doorArea * heatingDeltaT;
        const doorCoolingLoad = data.doorUValue * data.doorArea * coolingDeltaT;
        results.heatingLoad += doorHeatingLoad;
        results.coolingSensible += doorCoolingLoad;
        results.breakdown.push({
            component: 'Doors',
            heating: Math.round(doorHeatingLoad),
            cooling: Math.round(doorCoolingLoad)
        });

        // Roof/Ceiling
        const roofHeatingLoad = data.roofUValue * data.roofArea * heatingDeltaT;
        const roofCoolingLoad = data.roofUValue * data.roofArea * coolingDeltaT;
        results.heatingLoad += roofHeatingLoad;
        results.coolingSensible += roofCoolingLoad;
        results.breakdown.push({
            component: 'Roof/Ceiling',
            heating: Math.round(roofHeatingLoad),
            cooling: Math.round(roofCoolingLoad)
        });

        // Foundation/Floor
        const foundationFactor = FOUNDATION_FACTORS[data.foundationType] || 1.0;
        const floorHeatingLoad = data.floorUValue * data.floorArea * heatingDeltaT * foundationFactor;
        const floorCoolingLoad = data.floorUValue * data.floorArea * coolingDeltaT * foundationFactor * 0.5;
        results.heatingLoad += floorHeatingLoad;
        results.coolingSensible += floorCoolingLoad;
        results.breakdown.push({
            component: `Floor (${data.foundationType})`,
            heating: Math.round(floorHeatingLoad),
            cooling: Math.round(floorCoolingLoad)
        });

        // 2. INFILTRATION & VENTILATION LOADS
        const infiltrationCFM = (data.airChanges * buildingVolume) / 60;
        const totalCFM = infiltrationCFM + (parseFloat(data.ventilationCFM) || 0);

        // Sensible infiltration load
        const infiltrationHeating = totalCFM * 1.08 * heatingDeltaT;
        const infiltrationCooling = totalCFM * 1.08 * coolingDeltaT;
        results.heatingLoad += infiltrationHeating;
        results.coolingSensible += infiltrationCooling;
        results.breakdown.push({
            component: `Air Infiltration & Ventilation (${Math.round(totalCFM)} CFM)`,
            heating: Math.round(infiltrationHeating),
            cooling: Math.round(infiltrationCooling)
        });

        // Latent infiltration load (cooling only)
        const outdoorHumidityRatio = data.humidityRatio / 7000;
        const indoorHumidityRatio = 60 / 7000;
        const humidityDifference = outdoorHumidityRatio - indoorHumidityRatio;
        const latentInfiltration = totalCFM * 0.68 * humidityDifference * 1076;
        results.coolingLatent += Math.max(0, latentInfiltration);
        results.breakdown.push({
            component: 'Latent Load (Moisture Removal)',
            heating: 0,
            cooling: Math.round(Math.max(0, latentInfiltration))
        });

        // 3. INTERNAL HEAT GAINS (cooling season only)
        // Occupant loads
        const occupantSensible = data.occupancy * 230;
        const occupantLatent = data.occupancy * 190;
        results.coolingSensible += occupantSensible;
        results.coolingLatent += occupantLatent;
        results.breakdown.push({
            component: `Occupants (${data.occupancy} people) - Sensible`,
            heating: 0,
            cooling: Math.round(occupantSensible)
        });
        results.breakdown.push({
            component: `Occupants (${data.occupancy} people) - Latent`,
            heating: 0,
            cooling: Math.round(occupantLatent)
        });

        // Appliance loads
        const appLoadBtu = data.applianceLoad * 3.413;
        results.coolingSensible += appLoadBtu;
        results.breakdown.push({
            component: 'Appliances',
            heating: 0,
            cooling: Math.round(appLoadBtu)
        });

        // Lighting loads
        const lightLoadBtu = data.lightingLoad * 3.413;
        results.coolingSensible += lightLoadBtu;
        results.breakdown.push({
            component: 'Lighting',
            heating: 0,
            cooling: Math.round(lightLoadBtu)
        });

        // Totals & Safety Factors
        results.heatingLoad *= 1.1;
        results.coolingSensible *= 1.1;
        results.coolingLatent *= 1.1;
        results.coolingTotal = results.coolingSensible + results.coolingLatent;

        // Rounding
        results.heatingLoad = Math.round(results.heatingLoad);
        results.coolingSensible = Math.round(results.coolingSensible);
        results.coolingLatent = Math.round(results.coolingLatent);
        results.coolingTotal = Math.round(results.coolingTotal);

        return results;
    }
}