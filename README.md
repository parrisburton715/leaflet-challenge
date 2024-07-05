# leaflet-challenge
This repository contains the implementation of a visualization project using Leaflet to map earthquake data and tectonic plate boundaries.

## Overview

The project is divided into two parts:
- **Part 1: Earthquake Visualization**
- **Part 2: Tectonic Plates and Seismic Activity**

### Part 1: Earthquake Visualization

#### Task
Visualize earthquake data provided by the USGS using Leaflet.

#### Steps Taken
- **Data Source**: Obtained earthquake data from the USGS GeoJSON Feed.
- **Visualization**:
  - Plotted earthquakes on a map based on their coordinates.
  - Adjusted marker size to reflect earthquake magnitude.
  - Used color gradient to indicate earthquake depth.
  - Implemented popups for detailed earthquake information.
  - Created a legend to provide context for map data.

### Part 2: Tectonic Plates and Seismic Activity

#### Task
Enhance the visualization by plotting tectonic plate boundaries alongside earthquake data.

#### Steps Taken
- **Data Source**: Integrated tectonic plates data from [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates) repository.
- **Features**:
  - Displayed tectonic plate boundaries on the map.
  - Added additional base maps for user selection.
  - Implemented layer controls to toggle earthquake and tectonic plates overlays independently.

### Files Included
- `index.html`: Main HTML file for displaying the Leaflet map.
- `static/js/logic.js`: JavaScript file containing the logic for fetching earthquake and tectonic plate data, as well as configuring the Leaflet map.

## Usage
To run the visualization:
1. Clone this repository to your local machine.
2. Open `index.html` in a web browser.

## Dependencies
- [Leaflet](https://leafletjs.com/): Open-source JavaScript library for interactive maps.
- [D3.js](https://d3js.org/): JavaScript library for manipulating documents based on data.

## Credits
- Earthquake data sourced from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/).
- Tectonic plates data sourced from [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates).

## License
This project is licensed under the MIT License - see the LICENSE file for details.
