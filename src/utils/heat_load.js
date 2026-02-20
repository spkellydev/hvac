// Manual J Load Calculator
class ManualJCalculator {
    constructor() {
        this.form = document.getElementById('manual-j-form');
        this.resultsSection = document.getElementById('results');
        this.initializeEventListeners();
        this.initializePresets();
        
        // Solar heat gain factors by orientation (Btu/hr·sq ft) - typical values for summer
        this.solarHeatGainFactors = {
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
        
        // Foundation heat loss factors
        this.foundationFactors = {
            slab: 0.8,      // F-factor for slab edge
            basement: 1.0,  // Below-grade wall factor
            crawlspace: 1.2 // Exposed floor factor
        };

        // Climate zone data
        this.climateZones = {
            'hot-humid': { winterTemp: 30, summerTemp: 95, humidity: 100 },
            'hot-dry': { winterTemp: 25, summerTemp: 105, humidity: 60 },
            'mixed-humid': { winterTemp: 15, summerTemp: 90, humidity: 90 },
            'mixed-dry': { winterTemp: 5, summerTemp: 95, humidity: 70 },
            'cold': { winterTemp: -5, summerTemp: 85, humidity: 80 },
            'very-cold': { winterTemp: -15, summerTemp: 80, humidity: 75 }
        };

        // Building presets
        this.buildingPresets = {
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

        // Insulation level U-values
        this.insulationUValues = {
            poor: { wall: 0.15, roof: 0.08, floor: 0.08 },
            average: { wall: 0.08, roof: 0.03, floor: 0.05 },
            good: { wall: 0.05, roof: 0.025, floor: 0.03 },
            excellent: { wall: 0.03, roof: 0.018, floor: 0.02 }
        };

        // Window type properties
        this.windowTypes = {
            single: { uValue: 0.9, shgc: 0.6 },
            double: { uValue: 0.45, shgc: 0.4 },
            'double-low-e': { uValue: 0.3, shgc: 0.3 },
            triple: { uValue: 0.2, shgc: 0.25 }
        };
    }

    initializePresets() {
        // Handle preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.applyPreset(btn.dataset.preset);
            });
        });

        // Handle climate zone changes
        const climateZone = document.getElementById('climate-zone');
        climateZone.addEventListener('change', () => {
            this.applyClimateZone(climateZone.value);
        });

        // Auto-calculate values when inputs change
        const buildingArea = document.getElementById('building-area');
        const windowPercentage = document.getElementById('window-percentage');
        const insulationLevel = document.getElementById('insulation-level');
        const windowType = document.getElementById('window-type');
        const occupancy = document.getElementById('occupancy');

        [buildingArea, windowPercentage, insulationLevel, windowType, occupancy].forEach(input => {
            input.addEventListener('input', () => this.updateCalculatedValues());
        });

        // Advanced settings toggle
        const advancedToggleBtn = document.getElementById('advanced-toggle-btn');
        const advancedSection = document.querySelector('.advanced-section');
        
        if (advancedToggleBtn && advancedSection) {
            advancedToggleBtn.addEventListener('click', () => {
                const isHidden = advancedSection.style.display === 'none';
                advancedSection.style.display = isHidden ? 'block' : 'none';
                advancedToggleBtn.textContent = isHidden ? 'Hide Advanced Settings' : 'Show Advanced Settings';
            });
        }

        // Set initial climate zone after DOM is loaded
        setTimeout(() => {
            this.applyClimateZone('mixed-humid');
            this.updateCalculatedValues();
        }, 100);
    }

    applyPreset(presetType) {
        const preset = this.buildingPresets[presetType];
        if (preset) {
            document.getElementById('insulation-level').value = preset.insulationLevel;
            document.getElementById('window-type').value = preset.windowType;
            document.getElementById('air-changes').value = preset.airChanges;
            this.updateCalculatedValues();
        }
    }

    applyClimateZone(zone) {
        const climate = this.climateZones[zone];
        if (climate) {
            document.getElementById('outdoor-design-temp-winter').value = climate.winterTemp;
            document.getElementById('outdoor-design-temp-summer').value = climate.summerTemp;
            document.getElementById('humidity-ratio').value = climate.humidity;
            
            // Also update display fields if they exist
            const humidityDisplay = document.getElementById('humidity-ratio-display');
            if (humidityDisplay) {
                humidityDisplay.value = climate.humidity;
            }
        }
    }

    updateCalculatedValues() {
        const buildingArea = parseFloat(document.getElementById('building-area').value) || 0;
        const windowPercentage = parseFloat(document.getElementById('window-percentage').value) || 15;
        const insulationLevel = document.getElementById('insulation-level').value;
        const windowType = document.getElementById('window-type').value;
        const occupancy = parseFloat(document.getElementById('occupancy').value) || 4;

        if (buildingArea > 0) {
            // Calculate areas
            const perimeter = Math.sqrt(buildingArea) * 4; // Assume square house
            const ceilingHeight = parseFloat(document.getElementById('ceiling-height').value) || 8;
            const wallArea = perimeter * ceilingHeight - 40; // Subtract door area
            const windowArea = wallArea * (windowPercentage / 100);
            const adjustedWallArea = wallArea - windowArea;
            const roofArea = Math.round(buildingArea * 1.15); // Account for roof pitch

            // Set calculated values in hidden fields
            document.getElementById('wall-area').value = Math.round(adjustedWallArea);
            document.getElementById('window-area').value = Math.round(windowArea);
            document.getElementById('roof-area').value = roofArea;
            document.getElementById('floor-area').value = buildingArea;

            // Also update display fields if they exist
            const wallAreaDisplay = document.getElementById('wall-area-display');
            const windowAreaDisplay = document.getElementById('window-area-display');
            const roofAreaDisplay = document.getElementById('roof-area-display');
            
            if (wallAreaDisplay) wallAreaDisplay.value = Math.round(adjustedWallArea);
            if (windowAreaDisplay) windowAreaDisplay.value = Math.round(windowArea);
            if (roofAreaDisplay) roofAreaDisplay.value = roofArea;

            // Set U-values based on insulation level
            if (insulationLevel && this.insulationUValues[insulationLevel]) {
                const uValues = this.insulationUValues[insulationLevel];
                document.getElementById('wall-u-value').value = uValues.wall;
                document.getElementById('roof-u-value').value = uValues.roof;
                document.getElementById('floor-u-value').value = uValues.floor;

                // Also update display fields
                const wallUDisplay = document.getElementById('wall-u-value-display');
                const roofUDisplay = document.getElementById('roof-u-value-display');
                const floorUDisplay = document.getElementById('floor-u-value-display');
                
                if (wallUDisplay) wallUDisplay.value = uValues.wall;
                if (roofUDisplay) roofUDisplay.value = uValues.roof;
                if (floorUDisplay) floorUDisplay.value = uValues.floor;
            }

            // Set window properties
            if (windowType && this.windowTypes[windowType]) {
                const windowProps = this.windowTypes[windowType];
                document.getElementById('window-u-value').value = windowProps.uValue;
                document.getElementById('window-shgc').value = windowProps.shgc;

                // Also update display fields
                const windowUDisplay = document.getElementById('window-u-value-display');
                const windowSHGCDisplay = document.getElementById('window-shgc-display');
                
                if (windowUDisplay) windowUDisplay.value = windowProps.uValue;
                if (windowSHGCDisplay) windowSHGCDisplay.value = windowProps.shgc;
            }

            // Calculate appliance and lighting loads based on floor area
            const applianceLoad = Math.max(800, buildingArea * 0.5); // 0.5 watts per sq ft, minimum 800W
            const lightingLoad = buildingArea * 0.3; // 0.3 watts per sq ft
            document.getElementById('appliance-load').value = Math.round(applianceLoad);
            document.getElementById('lighting-load').value = Math.round(lightingLoad);

            // Also update display fields
            const applianceDisplay = document.getElementById('appliance-load-display');
            const lightingDisplay = document.getElementById('lighting-load-display');
            
            if (applianceDisplay) applianceDisplay.value = Math.round(applianceLoad);
            if (lightingDisplay) lightingDisplay.value = Math.round(lightingLoad);
        }
    }
    
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateLoad();
        });
        
        // Auto-calculate floor area based on building area
        const buildingAreaInput = document.getElementById('building-area');
        const floorAreaInput = document.getElementById('floor-area');
        
        buildingAreaInput.addEventListener('input', () => {
            if (!floorAreaInput.value || floorAreaInput.value == buildingAreaInput.value) {
                floorAreaInput.value = buildingAreaInput.value;
            }
        });
        
        // Auto-calculate roof area based on building area (with typical multiplier for pitch)
        const roofAreaInput = document.getElementById('roof-area');
        buildingAreaInput.addEventListener('input', () => {
            if (!roofAreaInput.value) {
                // Assume 1.2 multiplier for typical roof pitch
                roofAreaInput.value = Math.round(parseFloat(buildingAreaInput.value) * 1.2);
            }
        });
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Convert numeric fields to numbers
            if (value && !isNaN(value)) {
                data[key] = parseFloat(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }
    
    calculateLoad() {
        const data = this.getFormData();
        
        // Show loading state
        const calculateBtn = document.querySelector('.calculate-btn');
        calculateBtn.classList.add('loading');
        calculateBtn.textContent = '';
        
        // Calculate loads with a small delay to show loading state
        setTimeout(() => {
            try {
                const results = this.performCalculations(data);
                this.displayResults(results);
            } catch (error) {
                console.error('Calculation error:', error);
                alert('An error occurred during calculation. Please check your inputs.');
            } finally {
                calculateBtn.classList.remove('loading');
                calculateBtn.textContent = 'Calculate Load';
            }
        }, 500);
    }
    
    performCalculations(data) {
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
        const solarHeatGainFactor = this.solarHeatGainFactors[data.orientation] || 80;
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
        const foundationFactor = this.foundationFactors[data.foundationType] || 1.0;
        const floorHeatingLoad = data.floorUValue * data.floorArea * heatingDeltaT * foundationFactor;
        const floorCoolingLoad = data.floorUValue * data.floorArea * coolingDeltaT * foundationFactor * 0.5; // Reduced for below-grade
        results.heatingLoad += floorHeatingLoad;
        results.coolingSensible += floorCoolingLoad;
        results.breakdown.push({
            component: `Floor (${data.foundationType})`,
            heating: Math.round(floorHeatingLoad),
            cooling: Math.round(floorCoolingLoad)
        });
        
        // 2. INFILTRATION & VENTILATION LOADS
        
        // Calculate total CFM
        const infiltrationCFM = (data.airChanges * buildingVolume) / 60;
        const totalCFM = infiltrationCFM + data.ventilationCFM;
        
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
        const outdoorHumidityRatio = data.humidityRatio / 7000; // Convert grains to lb/lb
        const indoorHumidityRatio = 60 / 7000; // Assume 60 grains/lb indoors
        const humidityDifference = outdoorHumidityRatio - indoorHumidityRatio;
        const latentInfiltration = totalCFM * 0.68 * humidityDifference * 1076; // 1076 = latent heat of vaporization
        results.coolingLatent += Math.max(0, latentInfiltration);
        results.breakdown.push({
            component: 'Latent Load (Moisture Removal)',
            heating: 0,
            cooling: Math.round(Math.max(0, latentInfiltration))
        });
        
        // 3. INTERNAL HEAT GAINS (cooling season only)
        
        // Occupant loads
        const occupantSensible = data.occupancy * 230; // 230 Btu/hr per person (sensible)
        const occupantLatent = data.occupancy * 190;   // 190 Btu/hr per person (latent)
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
        const applianceLoad = data.applianceLoad * 3.413; // Convert watts to Btu/hr
        results.coolingSensible += applianceLoad;
        results.breakdown.push({
            component: 'Appliances',
            heating: 0,
            cooling: Math.round(applianceLoad)
        });
        
        // Lighting loads
        const lightingLoad = data.lightingLoad * 3.413; // Convert watts to Btu/hr
        results.coolingSensible += lightingLoad;
        results.breakdown.push({
            component: 'Lighting',
            heating: 0,
            cooling: Math.round(lightingLoad)
        });
        
        // Calculate totals
        results.coolingTotal = results.coolingSensible + results.coolingLatent;
        
        // Apply safety factors (typically 10-20% for Manual J)
        results.heatingLoad *= 1.1;  // 10% safety factor
        results.coolingSensible *= 1.1;
        results.coolingLatent *= 1.1;
        results.coolingTotal = results.coolingSensible + results.coolingLatent;
        
        // Round final results
        results.heatingLoad = Math.round(results.heatingLoad);
        results.coolingSensible = Math.round(results.coolingSensible);
        results.coolingLatent = Math.round(results.coolingLatent);
        results.coolingTotal = Math.round(results.coolingTotal);
        
        return results;
    }
    
    displayResults(results) {
        // Update result values
        document.getElementById('heating-load').textContent = `${results.heatingLoad.toLocaleString()} Btu/hr`;
        document.getElementById('cooling-sensible').textContent = `${results.coolingSensible.toLocaleString()} Btu/hr`;
        document.getElementById('cooling-latent').textContent = `${results.coolingLatent.toLocaleString()} Btu/hr`;
        document.getElementById('cooling-total').textContent = `${results.coolingTotal.toLocaleString()} Btu/hr`;
        
        // Create breakdown display
        const breakdownContainer = document.getElementById('load-breakdown');
        breakdownContainer.innerHTML = '';
        
        results.breakdown.forEach(item => {
            if (item.heating > 0 || item.cooling > 0) {
                const breakdownItem = document.createElement('div');
                breakdownItem.className = 'breakdown-item';
                breakdownItem.innerHTML = `
                    <h4>${item.component}</h4>
                    <div class="breakdown-value">
                        Heating: ${item.heating.toLocaleString()} Btu/hr<br>
                        Cooling: ${item.cooling.toLocaleString()} Btu/hr
                    </div>
                `;
                breakdownContainer.appendChild(breakdownItem);
            }
        });
        
        // Add equipment sizing recommendations
        const recommendations = this.getEquipmentRecommendations(results);
        if (recommendations) {
            const recDiv = document.createElement('div');
            recDiv.className = 'breakdown-item';
            recDiv.style.gridColumn = '1 / -1'; // Span full width
            recDiv.style.marginTop = '20px';
            recDiv.style.backgroundColor = '#e8f5e8';
            recDiv.style.borderLeftColor = '#27ae60';
            recDiv.innerHTML = `
                <h4>Equipment Sizing Recommendations</h4>
                <div class="breakdown-value" style="color: #27ae60;">
                    ${recommendations}
                </div>
            `;
            breakdownContainer.appendChild(recDiv);
        }
        
        // Show results section with animation
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('show');
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    getEquipmentRecommendations(results) {
        const heatingTons = Math.ceil(results.heatingLoad / 12000 * 10) / 10; // Round to nearest 0.1 ton
        const coolingTons = Math.ceil(results.coolingTotal / 12000 * 10) / 10;
        
        let recommendations = `
            Heating Capacity: ${heatingTons} tons (${results.heatingLoad.toLocaleString()} Btu/hr)<br>
            Cooling Capacity: ${coolingTons} tons (${results.coolingTotal.toLocaleString()} Btu/hr)<br><br>
        `;
        
        // Standard equipment sizes
        const standardSizes = [1.5, 2, 2.5, 3, 3.5, 4, 5];
        const recommendedCoolingSize = standardSizes.find(size => size >= coolingTons) || Math.ceil(coolingTons);
        const recommendedHeatingSize = standardSizes.find(size => size >= heatingTons) || Math.ceil(heatingTons);
        
        recommendations += `
            Recommended Heat Pump/AC: ${recommendedCoolingSize} ton unit<br>
            Recommended Furnace: ${recommendedHeatingSize} ton (${Math.round(recommendedHeatingSize * 12000).toLocaleString()} Btu/hr) unit<br><br>
            <small>Note: These are preliminary sizing estimates. Final equipment selection should be verified by a qualified HVAC professional and may need adjustment based on specific equipment performance data, ductwork design, and local codes.</small>
        `;
        
        return recommendations;
    }
    
    formatNumber(num) {
        return Math.round(num).toLocaleString();
    }
}

// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-toggle-icon');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.initializeTheme();
        this.bindEvents();
    }
    
    initializeTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
    }
    
    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
    }
    
    updateIcon() {
        const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
        const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
        
        this.themeIcon.innerHTML = this.currentTheme === 'dark' ? sunIcon : moonIcon;
    }
}

// Initialize calculator and theme manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ManualJCalculator();
    new ThemeManager();
});
