import React, { useState, useEffect, useRef } from 'react';
import {
    ManualJFieldConstants as Constants,
    HeatLoadCalculator as Calculator
} from '../../utils/heatLoadLogic';
import './styles.scss'

var {
    CLIMATE_ZONES,
    BUILDING_PRESETS,
    EQUIPMENT_STANDARD_SIZES,
    STATE
} = new Constants();

const HeatLoadCalculator = () => {
    // --- State ---
    const [theme, setTheme] = useState('dark');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [activePreset, setActivePreset] = useState(null);
    const resultsRef = useRef(null);

    const [formData, setFormData] = useState(STATE);

    // --- Effects ---

    // Initialize Theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
    }, []);

    // Auto-calculate values when inputs change
    useEffect(() => {
        calculateDerivedValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formData.buildingArea,
        formData.ceilingHeight,
        formData.windowPercentage,
        formData.insulationLevel,
        formData.windowType,
        formData.occupancy
    ]);

    // --- Logic ---

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const calculateDerivedValues = () => {
        const derived = Calculator.calculateDerivedValues(formData);
        if (derived) {
            setFormData(prev => ({
                ...prev,
                ...derived
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let val = value;
        if (type === 'number') {
            val = value === '' ? '' : parseFloat(value);
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: val };

            // Handle Climate Zone Change specifically
            if (name === 'climateZone') {
                const climate = CLIMATE_ZONES[val];
                if (climate) {
                    newData.outdoorDesignTempWinter = climate.winterTemp;
                    newData.outdoorDesignTempSummer = climate.summerTemp;
                    newData.humidityRatio = climate.humidity;
                }
            }
            return newData;
        });
    };

    const applyPreset = (presetType) => {
        setActivePreset(presetType);
        const preset = BUILDING_PRESETS[presetType];
        if (preset) {
            setFormData(prev => ({
                ...prev,
                insulationLevel: preset.insulationLevel,
                windowType: preset.windowType,
                airChanges: preset.airChanges
            }));
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate calculation delay
        setTimeout(() => {
            try {
                const res = Calculator.calculateHeatLoad(formData);
                setResults(res);
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } catch (error) {
                console.error('Calculation error:', error);
                alert('An error occurred during calculation. Please check your inputs.');
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const getEquipmentRecommendations = (res) => {
        const heatingTons = Math.ceil(res.heatingLoad / 12000 * 10) / 10;
        const coolingTons = Math.ceil(res.coolingTotal / 12000 * 10) / 10;
        
        const recommendedCoolingSize = EQUIPMENT_STANDARD_SIZES.find(size => size >= coolingTons) || Math.ceil(coolingTons);
        const recommendedHeatingSize = EQUIPMENT_STANDARD_SIZES.find(size => size >= heatingTons) || Math.ceil(heatingTons);

        return (
            <div className="breakdown-item" style={{ gridColumn: '1 / -1', marginTop: '20px', backgroundColor: '#e8f5e8', borderLeftColor: '#27ae60' }}>
                <h4>Equipment Sizing Recommendations</h4>
                <div className="breakdown-value" style={{ color: '#27ae60' }}>
                    Heating Capacity: {heatingTons} tons ({res.heatingLoad.toLocaleString()} Btu/hr)<br />
                    Cooling Capacity: {coolingTons} tons ({res.coolingTotal.toLocaleString()} Btu/hr)<br /><br />
                    Recommended Heat Pump/AC: {recommendedCoolingSize} ton unit<br />
                    Recommended Furnace: {recommendedHeatingSize} ton ({Math.round(recommendedHeatingSize * 12000).toLocaleString()} Btu/hr) unit<br /><br />
                    <small>Note: These are preliminary sizing estimates. Final equipment selection should be verified by a qualified HVAC professional and may need adjustment based on specific equipment performance data, ductwork design, and local codes.</small>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                <svg className="theme-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {theme === 'dark' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    )}
                </svg>
            </button>

            <header>
                <h1>Manual J Load Calculator</h1>
                <p>Calculate heating and cooling loads for residential buildings</p>
            </header>

            <div className="quick-setup">
                <h2>Quick Setup</h2>
                <div className="preset-buttons">
                    {Object.keys(BUILDING_PRESETS).map(key => (
                        <button 
                            key={key}
                            type="button" 
                            className={`preset-btn ${activePreset === key ? 'active' : ''}`}
                            onClick={() => applyPreset(key)}
                        >
                            {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>
                <div className="climate-selector">
                    <label htmlFor="climate-zone">Climate Zone:</label>
                    <select id="climate-zone" name="climateZone" value={formData.climateZone} onChange={handleInputChange}>
                        <option value="hot-humid">Hot-Humid (South, Southeast)</option>
                        <option value="hot-dry">Hot-Dry (Southwest)</option>
                        <option value="mixed-humid">Mixed-Humid (Mid-Atlantic, Ohio Valley)</option>
                        <option value="mixed-dry">Mixed-Dry (Central Plains)</option>
                        <option value="cold">Cold (Northern States)</option>
                        <option value="very-cold">Very Cold (Northern Border, Mountains)</option>
                    </select>
                </div>
            </div>

            <form id="manual-j-form" onSubmit={handleCalculate}>
                {/* Basic Information */}
                <section className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="building-area">Floor Area (sq ft):</label>
                            <input type="number" id="building-area" name="buildingArea" min="100" max="10000" placeholder="e.g. 2000" required value={formData.buildingArea} onChange={handleInputChange} />
                            <small>Total conditioned living space</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ceiling-height">Ceiling Height (ft):</label>
                            <input type="number" id="ceiling-height" name="ceilingHeight" min="7" max="12" step="0.5" required value={formData.ceilingHeight} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="occupancy">Number of People:</label>
                            <input type="number" id="occupancy" name="occupancy" min="1" max="10" required value={formData.occupancy} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="orientation">Main Window Direction:</label>
                            <select id="orientation" name="orientation" required value={formData.orientation} onChange={handleInputChange}>
                                <option value="south">Mostly South</option>
                                <option value="north">Mostly North</option>
                                <option value="east">Mostly East</option>
                                <option value="west">Mostly West</option>
                                <option value="mixed">Mixed/Multiple</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Building Details */}
                <section className="form-section">
                    <h2>Building Details</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="window-percentage">Windows (% of wall area):</label>
                            <input type="number" id="window-percentage" name="windowPercentage" min="5" max="40" required value={formData.windowPercentage} onChange={handleInputChange} />
                            <small>Typical: 10-20%</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="insulation-level">Insulation Level:</label>
                            <select id="insulation-level" name="insulationLevel" required value={formData.insulationLevel} onChange={handleInputChange}>
                                <option value="poor">Poor (Minimal/Old)</option>
                                <option value="average">Average (Code Minimum)</option>
                                <option value="good">Good (Above Code)</option>
                                <option value="excellent">Excellent (High Performance)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="window-type">Window Type:</label>
                            <select id="window-type" name="windowType" required value={formData.windowType} onChange={handleInputChange}>
                                <option value="single">Single Pane</option>
                                <option value="double">Double Pane</option>
                                <option value="double-low-e">Double Pane Low-E</option>
                                <option value="triple">Triple Pane</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="foundation-type">Foundation Type:</label>
                            <select id="foundation-type" name="foundationType" required value={formData.foundationType} onChange={handleInputChange}>
                                <option value="slab">Slab on Grade</option>
                                <option value="basement">Basement</option>
                                <option value="crawlspace">Crawlspace</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="advanced-toggle">
                    <button type="button" id="advanced-toggle-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                    </button>
                </div>

                {/* Advanced Settings */}
                {showAdvanced && (
                    <section className="form-section advanced-section">
                        <h2>Advanced Settings</h2>
                        
                        <h3>Climate Settings (Override Defaults)</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="outdoor-design-temp-winter">Winter Design Temp (°F):</label>
                                <input type="number" id="outdoor-design-temp-winter" name="outdoorDesignTempWinter" min="-40" max="50" value={formData.outdoorDesignTempWinter} onChange={handleInputChange} />
                                <small>Set by climate zone, can override here</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="outdoor-design-temp-summer">Summer Design Temp (°F):</label>
                                <input type="number" id="outdoor-design-temp-summer" name="outdoorDesignTempSummer" min="70" max="120" value={formData.outdoorDesignTempSummer} onChange={handleInputChange} />
                                <small>Set by climate zone, can override here</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="humidity-ratio-display">Summer Humidity Ratio (grains/lb):</label>
                                <input type="number" id="humidity-ratio-display" name="humidityRatio" min="40" max="120" step="0.1" value={formData.humidityRatio} onChange={handleInputChange} />
                                <small>Set by climate zone, can override here</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="air-changes">Air Changes per Hour:</label>
                                <input type="number" id="air-changes" name="airChanges" min="0.1" max="1.0" step="0.1" value={formData.airChanges} onChange={handleInputChange} />
                                <small>Infiltration rate: 0.1-1.0</small>
                            </div>
                        </div>

                        <h3>Building Areas (Auto-calculated)</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="wall-area-display">Wall Area (sq ft):</label>
                                <input type="number" id="wall-area-display" name="wallArea" min="100" max="5000" readOnly value={formData.wallArea} />
                                <small>Auto-calculated from floor area</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="window-area-display">Window Area (sq ft):</label>
                                <input type="number" id="window-area-display" name="windowArea" min="0" max="1000" readOnly value={formData.windowArea} />
                                <small>Auto-calculated from wall % setting</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="roof-area-display">Roof Area (sq ft):</label>
                                <input type="number" id="roof-area-display" name="roofArea" min="100" max="5000" readOnly value={formData.roofArea} />
                                <small>Auto-calculated with pitch factor</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="door-area-display">Door Area (sq ft):</label>
                                <input type="number" id="door-area-display" name="doorArea" min="0" max="200" value={formData.doorArea} onChange={handleInputChange} />
                                <small>Typical: 20-40 sq ft</small>
                            </div>
                        </div>

                        <h3>Building Performance Values</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="wall-u-value-display">Wall U-Value (Btu/hr·sq ft·°F):</label>
                                <input type="number" id="wall-u-value-display" name="wallUValue" min="0.01" max="1.0" step="0.01" readOnly value={formData.wallUValue} />
                                <small>Set by insulation level</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="roof-u-value-display">Roof U-Value (Btu/hr·sq ft·°F):</label>
                                <input type="number" id="roof-u-value-display" name="roofUValue" min="0.01" max="0.5" step="0.01" readOnly value={formData.roofUValue} />
                                <small>Set by insulation level</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="window-u-value-display">Window U-Value (Btu/hr·sq ft·°F):</label>
                                <input type="number" id="window-u-value-display" name="windowUValue" min="0.1" max="1.5" step="0.01" readOnly value={formData.windowUValue} />
                                <small>Set by window type</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="window-shgc-display">Window SHGC:</label>
                                <input type="number" id="window-shgc-display" name="windowSHGC" min="0.1" max="1.0" step="0.01" readOnly value={formData.windowSHGC} />
                                <small>Solar Heat Gain Coefficient</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="floor-u-value-display">Floor U-Value (Btu/hr·sq ft·°F):</label>
                                <input type="number" id="floor-u-value-display" name="floorUValue" min="0.01" max="0.5" step="0.01" readOnly value={formData.floorUValue} />
                                <small>Set by insulation level</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ventilation-cfm">Mechanical Ventilation (CFM):</label>
                                <input type="number" id="ventilation-cfm" name="ventilationCFM" min="0" max="500" value={formData.ventilationCFM} onChange={handleInputChange} />
                                <small>Additional fresh air system</small>
                            </div>
                        </div>

                        <h3>Internal Heat Gains (Auto-calculated)</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="appliance-load-display">Appliance Load (Watts):</label>
                                <input type="number" id="appliance-load-display" name="applianceLoad" min="500" max="5000" readOnly value={formData.applianceLoad} />
                                <small>Based on floor area</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lighting-load-display">Lighting Load (Watts):</label>
                                <input type="number" id="lighting-load-display" name="lightingLoad" min="200" max="2000" readOnly value={formData.lightingLoad} />
                                <small>Based on floor area</small>
                            </div>
                        </div>
                    </section>
                )}

                <button type="submit" className={`calculate-btn ${loading ? 'loading' : ''}`}>
                    {loading ? '' : 'Calculate Load'}
                </button>
            </form>

            {/* Results */}
            {results && (
                <div id="results" className="results-section show" ref={resultsRef} style={{ display: 'block' }}>
                    <h2>Calculation Results</h2>
                    <div className="results-grid">
                        <div className="result-item">
                            <h3>Heating Load</h3>
                            <div className="result-value" id="heating-load">{results.heatingLoad.toLocaleString()} Btu/hr</div>
                        </div>
                        <div className="result-item">
                            <h3>Cooling Load (Sensible)</h3>
                            <div className="result-value" id="cooling-sensible">{results.coolingSensible.toLocaleString()} Btu/hr</div>
                        </div>
                        <div className="result-item">
                            <h3>Cooling Load (Latent)</h3>
                            <div className="result-value" id="cooling-latent">{results.coolingLatent.toLocaleString()} Btu/hr</div>
                        </div>
                        <div className="result-item">
                            <h3>Total Cooling Load</h3>
                            <div className="result-value" id="cooling-total">{results.coolingTotal.toLocaleString()} Btu/hr</div>
                        </div>
                    </div>
                    
                    <div className="breakdown-section">
                        <h3>Load Breakdown</h3>
                        <div id="load-breakdown">
                            {results.breakdown.map((item, index) => (
                                (item.heating > 0 || item.cooling > 0) && (
                                    <div key={index} className="breakdown-item">
                                        <h4>{item.component}</h4>
                                        <div className="breakdown-value">
                                            Heating: {item.heating.toLocaleString()} Btu/hr<br />
                                            Cooling: {item.cooling.toLocaleString()} Btu/hr
                                        </div>
                                    </div>
                                )
                            ))}
                            {getEquipmentRecommendations(results)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeatLoadCalculator;