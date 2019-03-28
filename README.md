# Visualizing Data with Leaflet

## Background

The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.
Here we will try to visualize earthquakes for past 7 days as published from USGS site.

### Level 1: Basic Visualization

First task is to visualize an earthquake data set.

1. **Get the data set**
    We will choose the 'All Earthquakes from the Past 7 Days', the site will be provide a JSON representation of that data. The URL will be used to pull in the JSON data for our visualization.

   
2. **Import & Visualize the Data**

   Create a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for the map data.

- - -

### Level 2: More Data 

In level 2, we try to illustrate the relationship between tectonic plates and seismic activity. We will need to pull in a second data set and visualize it along side your original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

In this step we are going to..

* Plot a second data set on our map.

* Add a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

* Add layer controls to our map.

- - -

## Copyright

Data Boot Camp (C) 2018. All Rights Reserved.
