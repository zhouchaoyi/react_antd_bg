/**!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @version fusioncharts/3.3.1-sr3.21100
 */

FusionCharts(['private', 'modules.renderer.js-charts', function() {
        var global = this,
            lib = global.hcLib,
            R = lib.Raphael,
            win = window,
            doc = win.document,
            isVML = (R.type === 'VML'),
            //strings
            BLANKSTRING = lib.BLANKSTRING,
            createTrendLine = lib.createTrendLine,
            //add the tools thats are requared
            pluck = lib.pluck,
            getValidValue = lib.getValidValue,
            pluckNumber = lib.pluckNumber,
            defaultPaletteOptions = lib.defaultPaletteOptions,
            getFirstValue = lib.getFirstValue,
            getDefinedColor = lib.getDefinedColor,
            parseUnsafeString = lib.parseUnsafeString,
            FC_CONFIG_STRING = lib.FC_CONFIG_STRING,
            extend2 = lib.extend2, // old: jarendererExtend / margecolone
            getDashStyle = lib.getDashStyle, // returns dashed style of a line series
            toRaphaelColor = lib.toRaphaelColor,
            toPrecision = lib.toPrecision,
            stubFN = lib.stubFN,
            hasSVG = lib.hasSVG,
            isIE = lib.isIE,
            dropHash = lib.regex.dropHash,
            HASHSTRING = lib.HASHSTRING,
            extend = function(a, b) { 

                var n;
                if (!a) {
                    a = {};
                }
                for (n in b) {
                    a[n] = b[n];
                }
                return a;
            },
            each = lib.each,
            addEvent = lib.addEvent,
            TOUCH_THRESHOLD_PIXELS = 10,
            CLICK_THRESHOLD_PIXELS = 3,
            getTouchEvent = lib.getTouchEvent,
            hasTouch = lib.hasTouch,
            // hot/tracker threshold in pixels
            HTP = hasTouch ? TOUCH_THRESHOLD_PIXELS :
                CLICK_THRESHOLD_PIXELS,

            defined = function(obj) {
                return obj !== UNDEFINED && obj !== null;
            },
            pInt = function(s, mag) {
                return parseInt(s, mag || 10);
            },
            isObject = function(obj) {
                return typeof obj === 'object';
            },
            isString = function(s) {
                return typeof s === 'string';
            },
            docMode8 = document.documentMode === 8,
            UNDEFINED,
            TRACKER_FILL = 'rgba(192,192,192,' + (isIE ? 0.002 : 0.000001) + ')', // invisible but clickable
            NORMAL_STATE = '',
            SELECT_STATE = 'select',
            HIDDEN = 'hidden',
            VISIBLE = docMode8 ? 'visible' : '',
            SHOW = 'show',
            HIDE = 'hide',
            CRISP = 'crisp',
            PX = 'px',
            NONE = 'none',
            M = 'M',
            L = 'L',
            V = 'v',
            A = 'A',
            AT = 'AT',
            WA = 'WA',
            Z = 'Z',
            COMMA = ',',
            math = Math,
            mathSin = math.sin,
            mathCos = math.cos,
            mathATan2 = math.atan2,
            mathRound = math.round,
            mathMin = math.min,
            mathMax = math.max,
            mathAbs = math.abs,
            mathPI = math.PI,
            mathCeil = math.ceil,
            mathFloor = math.floor,
            mathSqrt = math.sqrt,
            mathLog = math.log,
            mathPow = math.pow,
            deg2rad = mathPI / 180,
            rad2deg = 180 / mathPI,
            pi = Math.PI,
            piBy2 = pi / 2,
            pi2 = 2 * pi,
            pi3By2 = pi + piBy2,
            pi4 = 4 * pi,
            getColumnColor = lib.graphics.getColumnColor,
            getFirstColor = lib.getFirstColor,
            setLineHeight = lib.setLineHeight,
            pluckFontSize = lib.pluckFontSize, // To get the valid font size (filters negative values)
            pluckColor = lib.pluckColor,
            getFirstAlpha = lib.getFirstAlpha,
            getDarkColor = lib.graphics.getDarkColor,
            getLightColor = lib.graphics.getLightColor,
            convertColor = lib.graphics.convertColor,
            COLOR_TRANSPARENT = lib.COLOR_TRANSPARENT,
            TRACKER_FILL = 'rgba(192,192,192,'+ (isIE ? 0.002 : 0.000001) +')',
            POSITION_CENTER = lib.POSITION_CENTER,
            POSITION_TOP = lib.POSITION_TOP,
            POSITION_BOTTOM = lib.POSITION_BOTTOM,
            POSITION_RIGHT = lib.POSITION_RIGHT,
            POSITION_LEFT = lib.POSITION_LEFT,
            POSITION_MIDDLE = 'middle',
            POSITION_START = 'start',
            POSITION_END = 'end',
            GUTTER_4 = 4,
            t = 't',
            r = 'r',
            INT_ZERO = 0,
            chartAPI = lib.chartAPI,
            titleSpaceManager = lib.titleSpaceManager,
            placeLegendBlockBottom = lib.placeLegendBlockBottom,
            placeLegendBlockRight = lib.placeLegendBlockRight,
            mapSymbolName = lib.graphics.mapSymbolName,
            singleSeriesAPI = chartAPI.singleseries,
            multiSeriesAPI = chartAPI.multiseries,
            COMMASTRING = lib.COMMASTRING,
            STRINGUNDEFINED = lib.STRINGUNDEFINED,
            ZEROSTRING = lib.ZEROSTRING,
            ONESTRING = lib.ONESTRING,
            HUNDREDSTRING = lib.HUNDREDSTRING,
            PXSTRING = lib.PXSTRING,
            COMMASPACE = lib.COMMASPACE,
            creditLabel = false && !/fusioncharts\.com$/i.test(location.hostname),

            /**
             * Reduces the pain of writing loads of object structures while creating
             * FusionCharts specific color configurations
             */
            colorize = function(original, obj) {
                if (!obj) {
                    return {
                        FCcolor: original
                    };
                }
                else {
                    return extend(original.FCcolor, obj);
                }

            };

        chartAPI('column2d', {
            standaloneInit: true,
            friendlyName: "Column Chart",
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.column2dbase);

        chartAPI('column3d', {
            friendlyName: "3D Column Chart",
            defaultSeriesType: 'column3d',
            defaultPlotShadow: 1,
            is3D: true,
            defaultZeroPlaneHighlighted: false
        }, chartAPI.column2d);

        chartAPI('bar2d', {
            friendlyName: "Bar Chart",
            isBar: true,
            defaultSeriesType: 'bar',
            spaceManager: chartAPI.barbase
        }, chartAPI.column2d);

        chartAPI('bar3d', {
            friendlyName: "3D Bar Chart",
            defaultSeriesType: 'bar3d',
            defaultPlotShadow: 1,
            is3D: true,
            defaultZeroPlaneHighlighted: false
        }, chartAPI.bar2d);

        chartAPI('line', {
            friendlyName: "Line Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.linebase);

        chartAPI('area2d', {
            friendlyName: "Area Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.area2dbase);

        chartAPI('pie2d', {
            friendlyName: "Pie Chart",
            standaloneInit: true,
            defaultSeriesType: 'pie',
            defaultPlotShadow: 1,
            sliceOnLegendClick: true,
            rendererId: 'pie',
            point: function(chartName, series, data, FCChartObj, HCObj) {
                var name, index, dataValue, dataObj, pointShadow,
                    conf = HCObj[FC_CONFIG_STRING],
                    is3D = conf.is3d,
                    setColor, setAlpha, setRatio, setPlotBorderColor, setPlotBorderAlpha,
                    totalValue = 0, displayValueText, labelText, toolText, pValue, value,
                    TTValue, dataIndex = 0, dataArr = [], displayValue,
                    // thickness of pie slice border
                    plotBorderThickness = pluckNumber(FCChartObj.plotborderthickness),
                    setBorderWidth = pluckNumber(plotBorderThickness, is3D ? 0.1 : 1),
                    // whether to use 3d lighing effect on pie
                    use3DLighting = pluckNumber(FCChartObj.use3dlighting, 1),
                    // radius of the pie 3d lighting effect
                    radius3D = use3DLighting ? pluckNumber(FCChartObj.radius3d,
                    FCChartObj['3dradius'], 90) : 100,
                    // whether to show the zero values on pie
                    showZeroPies = pluckNumber(FCChartObj.showzeropies, 1),
                    showPercentInToolTip = pluckNumber(FCChartObj.showpercentintooltip, 1),
                    showLabels = pluckNumber(FCChartObj.showlabels, 1),
                    showValuesDef = pluckNumber(FCChartObj.showvalues, 1),
                    showPercentValues = pluckNumber(FCChartObj.showpercentvalues, FCChartObj.showpercentagevalues, 0),
                    toolTipSepChar = pluck(FCChartObj.tooltipsepchar, FCChartObj.hovercapsepchar, COMMASPACE),
                    labelSepChar = pluck(FCChartObj.labelsepchar, toolTipSepChar),
                    piebordercolor = pluck(FCChartObj.plotbordercolor, FCChartObj.piebordercolor),
                    NumberFormatter = HCObj[FC_CONFIG_STRING].numberFormatter,
                    length = data.length, HcDataObj, isSliced,
                    pointDashStyle,
                    plotBorderDashed = pluckNumber(FCChartObj.plotborderdashed, 0),
                    // length of the dash
                    seriesDashLen = pluckNumber(FCChartObj.plotborderdashlen, 5),
                    // distance between dash
                    seriesDashGap = pluckNumber(FCChartObj.plotborderdashgap, 4),
                    showValue;

                // radius3d can not be greater than 100 and can not be less than 0
                if (radius3D > 100) {
                    radius3D = 100;
                }
                if (radius3D < 0) {
                    radius3D = 0;
                }

                //enable the legend for the pie
                if (pluckNumber(FCChartObj.showlegend, 0)) {
                    HCObj.legend.enabled = true;
                    HCObj.legend.reversed =
                        !Boolean(pluckNumber(FCChartObj.reverselegend, 0));
                    series.showInLegend = true;
                }

                // Filtering null and 0 values from data
                for (index = 0; index < length; index += 1) {
                    dataObj = data[index];

                    dataValue = NumberFormatter.getCleanValue(dataObj.value, true);

                    if (!(dataValue === null || (!showZeroPies && dataValue === 0))) {
                        dataArr.push(dataObj);
                        totalValue += dataValue;
                    }
                }
                //Issue #FCXT-175
                if (totalValue === 0) {
                    dataArr = [];
                }

                // Pass the configuration whether user wants to supprss rotation.
                series.enableRotation = dataArr.length > 1 ? pluckNumber(FCChartObj.enablerotation, 1) : 0;
                series.alphaAnimation = pluckNumber(FCChartObj.alphaanimation, 1);
                //requared in 3d
                series.is3D = is3D;
                series.use3DLighting = use3DLighting;
                series.pieYScale = pluckNumber(FCChartObj.pieyscale, 40);
                if (series.pieYScale < 1) {
                    series.pieYScale = 1;
                }
                //fix for FCXT-296
                if (series.pieYScale >= 100) {
                    series.pieYScale = 80;
                }
                series.pieYScale /= 100;

                series.pieSliceDepth = pluckNumber(FCChartObj.pieslicedepth, 15);
                if (series.pieSliceDepth < 1) {
                    series.pieSliceDepth = 1;
                }
                series.managedPieSliceDepth = series.pieSliceDepth;

                if (is3D && FCChartObj.showplotborder != ONESTRING && !plotBorderThickness) {
                        series.showBorderEffect = 1;
                    }

                for (index = dataArr.length - 1; index >= 0; index -= 1) {
                    // numberFormatter.getCleanValue(dataObj.value, true);
                    // individual data obj
                    // for further manipulation
                    dataObj = dataArr[index];

                    // Taking the value
                    // we multiply the value with 1 to convert it to integer
                    dataValue = NumberFormatter.getCleanValue(dataObj.value, true);


                    // Label provided with data point
                    name = parseUnsafeString(pluck(dataObj.label, dataObj.name, BLANKSTRING));

                    // parsing slice cosmetics attribute supplied in data points
                    // Color for each slice
                    setColor = pluck(dataObj.color,
                        HCObj.colors[index % HCObj.colors.length]);
                    // Alpha for each slice
                    setAlpha = pluck(dataObj.alpha, FCChartObj.plotfillalpha);
                    // each slice border color
                    setPlotBorderColor = pluck(dataObj.bordercolor, piebordercolor);
                    // each slice border alpha
                    setPlotBorderAlpha = pluck(dataObj.borderalpha, FCChartObj.plotborderalpha,
                        FCChartObj.pieborderalpha);
                    if (is3D && (setPlotBorderColor || setPlotBorderAlpha !== undefined)) {
                        series.showBorderEffect = 0;
                    }

                    setPlotBorderColor = pluck(setPlotBorderColor, getLightColor(setColor, is3D ? 90 : 25)).
                        split(COMMASTRING)[0];
                    setPlotBorderAlpha = FCChartObj.showplotborder == ZEROSTRING ?
                            ZEROSTRING : pluck(setPlotBorderAlpha, setAlpha, '80');
                    setAlpha = pluck(setAlpha, HUNDREDSTRING);



                    // Used to set alpha of the shadow
                    pointShadow = {
                        opacity: Math.max(setAlpha, setPlotBorderAlpha) / 100
                    };

                    // Check if pre-sliced
                    isSliced = Boolean(pluckNumber(dataObj.issliced, FCChartObj.issliced, 0));
                    if (isSliced) {
                        conf.preSliced = isSliced;
                    }

                    pointDashStyle = pluckNumber(dataObj.dashed, plotBorderDashed) ?
                        getDashStyle(pluck(dataObj.dashlen, seriesDashLen),
                        pluck(dataObj.dashgap, seriesDashGap), setBorderWidth) : undefined;

                    // Finally insert the value and other point cosmetics in HighChart's series.data array
                    series.data.push({
                        showInLegend: !(name === BLANKSTRING), // prevent legend item when no label
                        y: dataValue,
                        name: name,
                        shadow: pointShadow,
                        toolText: parseUnsafeString(getValidValue(dataObj.tooltext)),
                        color: this.getPointColor(setColor, setAlpha, radius3D),
                        _3dAlpha: setAlpha,
                        borderColor: convertColor(setPlotBorderColor,
                            setPlotBorderAlpha),
                        borderWidth: setBorderWidth,
                        link: getValidValue(dataObj.link),
                        sliced: isSliced,
                        dashStyle: pointDashStyle,
                        doNotSlice: pluck(FCChartObj.enableslicing, ONESTRING) != ONESTRING
                    });

                    // Adding label, tooltext, and display value
                    toolText = name;
                    pValue = NumberFormatter.percentValue(dataValue / totalValue * 100);
                    value = NumberFormatter.dataLabels(dataValue) || BLANKSTRING;
                    TTValue = showPercentInToolTip === 1 ? pValue : value;
                    labelText = pluckNumber(dataObj.showlabel, showLabels) === 1 ? toolText : BLANKSTRING;
                    displayValueText = (showValue = pluckNumber(dataObj.showvalue, showValuesDef)) === 1 ?
                        (showPercentValues === 1 ? pValue : value) : BLANKSTRING;

                    displayValue = getValidValue(parseUnsafeString(dataObj.displayvalue));

                    if (displayValue !== undefined && showValue) {
                        displayValueText = displayValue;
                    } else {
                        //create the datalabel str
                        if (displayValueText !== BLANKSTRING && labelText !== BLANKSTRING) {
                            displayValueText = labelText + labelSepChar + displayValueText;
                        }
                        else {
                            displayValueText = pluck(labelText, displayValueText);
                        }
                    }

                    // Create the Tooltext
                    if (toolText != BLANKSTRING) {
                        toolText = toolText + toolTipSepChar + TTValue;
                    }
                    else {
                        toolText = TTValue;
                    }
                    HcDataObj = series.data[dataIndex];
                    HcDataObj.displayValue = displayValueText;
                    HcDataObj.toolText = pluck(HcDataObj.toolText, toolText);
                    dataIndex += 1;
                }

                ///special conf for pie/doughnut
                series.valueTotal = totalValue;
                HCObj.legend.enabled = FCChartObj.showlegend == ONESTRING ? true : false;
                series.startAngle = pluckNumber(FCChartObj.startingangle, 0);
                HCObj.chart.startingAngle = pluck(dataArr.length > 1 ? FCChartObj.startingangle : 0, 0);

                //return series
                return series;
            },
            // Function that produce the point color
            getPointColor: function(color, alpha, radius3D) {
                var colorObj, shadowIntensity, shadowColor, highLightIntensity, highLight;
                color = getFirstColor(color);
                alpha = getFirstAlpha(alpha);
                if (radius3D < 100 && hasSVG) { //radial gradient is not supported in VML
                    shadowIntensity = Math.floor((0.85 * (100 - 0.35 * radius3D)) * 100) / 100;
                    shadowColor = getDarkColor(color, shadowIntensity);
                    highLightIntensity = Math.floor((0.5 * (100 + radius3D)) * 100) / 100;
                    highLight = getLightColor(color, highLightIntensity);
                    colorObj = {
                        FCcolor: {
                            color: highLight + COMMASTRING + shadowColor,
                            alpha: alpha + COMMASTRING + alpha,
                            ratio: radius3D + ',100',
                            radialGradient: true,
                            gradientUnits: 'userSpaceOnUse'

                        }
                    };
                }
                else {
                    colorObj = {
                        FCcolor: {
                            color: color + COMMASTRING + color,
                            alpha: alpha + COMMASTRING + alpha,
                            ratio: '0,100'
                        }
                    };
                }

                return colorObj;
            },
            //add the axis configurar function
            configureAxis: function(hcJSON, fcJSON) {
                var length = 0, conf = hcJSON[FC_CONFIG_STRING], labelArr, dataArr, index = 0;
                //fix for pie datalabels style issue
                hcJSON.plotOptions.series.dataLabels.style = hcJSON.xAxis.labels.style;
                hcJSON.plotOptions.series.dataLabels.color = hcJSON.xAxis.labels.style.color;


                delete conf.x;
                delete conf[0];
                delete conf[1];
                // Making plotBorder and plotBackground transpatent
                //temp: added color to border
                hcJSON.chart.plotBorderColor = hcJSON.chart.plotBackgroundColor = COLOR_TRANSPARENT;


                labelArr = conf.pieDATALabels = [];
                if (hcJSON.series.length === 1) {
                    if ((dataArr = hcJSON.series[0].data) && (length = hcJSON.series[0].data.length) > 0 &&
                        hcJSON.plotOptions.series.dataLabels.enabled) {
                        for (; length--; ) {
                            if (dataArr[length] && getValidValue(dataArr[length].displayValue) !== undefined) {
                                labelArr.push(dataArr[length].displayValue)
                            }
                        }
                    }
                }

            },
            spaceManager: function(hcJSON, fcJSON, width, height) {
                var conf = hcJSON[FC_CONFIG_STRING], textWidthArr = [],
                    is3D = conf.is3d,
                    FCchartName = this.name,
                    SmartLabel = conf.smartLabel, length = pluckNumber(conf.pieDATALabels && conf.pieDATALabels.length, 0), labelMaxW = 0,
                    textObj, fcJSONChart = fcJSON.chart,
                    manageLabelOverflow = pluckNumber(fcJSONChart.managelabeloverflow, 0),
                    slicingDistance = !conf.preSliced && (fcJSONChart.enableslicing == ZEROSTRING) &&
                    (fcJSONChart.showlegend != ONESTRING || fcJSONChart.interactivelegend == ZEROSTRING) ?
                    0 : pluckNumber(fcJSONChart.slicingdistance, 20),
                    pieRadius = pluckNumber(fcJSONChart.pieradius, 0),
                    enableSmartLabels = pluckNumber(fcJSONChart.enablesmartlabels, fcJSONChart.enablesmartlabel, 1),
                    skipOverlapLabels = enableSmartLabels ? pluckNumber(fcJSONChart.skipoverlaplabels, fcJSONChart.skipoverlaplabel, 1) : 0,
                    isSmartLineSlanted = pluckNumber(fcJSONChart.issmartlineslanted, 1),
                    labelDistance = pluckNumber(fcJSONChart.labeldistance, fcJSONChart.nametbdistance, 5),
                    smartLabelClearance = pluckNumber(fcJSONChart.smartlabelclearance, 5),
                    chartWorkingWidth = width - (hcJSON.chart.marginRight + hcJSON.chart.marginLeft),
                    chartWorkingHeight = height - (hcJSON.chart.marginTop + hcJSON.chart.marginBottom),
                    minOfWH = Math.min(chartWorkingHeight, chartWorkingWidth),
                    smartLineColor = pluck(fcJSONChart.smartlinecolor, defaultPaletteOptions.plotFillColor[hcJSON.chart.paletteIndex ]),
                    smartLineAlpha = pluckNumber(fcJSONChart.smartlinealpha, 100),
                    smartLineThickness = pluckNumber(fcJSONChart.smartlinethickness, 0.7),
                    dataLebelsOptions = hcJSON.plotOptions.series.dataLabels,
                    style = dataLebelsOptions.style,
                    lineHeight = pluckNumber(parseInt(style.lineHeight, 10), 12), //2px padding
                    series = hcJSON.series[0] || {}, //FCXT-230 fixecd
                    pieYScale = series.pieYScale,
                    pieSliceDepth = series.pieSliceDepth,
                    

                    pieMinRadius = pieRadius === 0 ? minOfWH * 0.15 : pieRadius,
                    avableRedius = 0, pieMinDia = 2 * pieMinRadius;

                dataLebelsOptions.connectorWidth = smartLineThickness;
                dataLebelsOptions.connectorPadding = pluckNumber(fcJSONChart.connectorpadding, 5);
                dataLebelsOptions.connectorColor = convertColor(smartLineColor, smartLineAlpha);


                

                chartWorkingHeight -= titleSpaceManager(hcJSON, fcJSON, chartWorkingWidth,
                    pieMinDia < chartWorkingHeight ? chartWorkingHeight - pieMinDia : chartWorkingHeight / 2);

                if (fcJSONChart.showlegend == ONESTRING) {
                    if (pluck(fcJSONChart.legendposition, POSITION_BOTTOM).toLowerCase() != POSITION_RIGHT) {
                        chartWorkingHeight -= placeLegendBlockBottom(hcJSON, fcJSON, chartWorkingWidth,
                            chartWorkingHeight / 2, true);
                    } else {
                        chartWorkingWidth -= placeLegendBlockRight(hcJSON, fcJSON,
                            chartWorkingWidth / 3, chartWorkingHeight, true);
                    }
                }



                //now get the max width requared for all display text
                //set the style
                SmartLabel.setStyle(style);
                if (length !== 1) { // Fix for single data in Pie makes pie very small in size.
                    for (; length--; ) {
                        textWidthArr[length] = textObj = SmartLabel.getOriSize(conf.pieDATALabels[length]);
                        labelMaxW = Math.max(labelMaxW, textObj.width);
                    }
                }

                //if the smart label is on then modify the label distance
                if (enableSmartLabels) {
                    labelDistance = smartLabelClearance + slicingDistance;
                }
                //if redius not supplyed then auto calculate it
                if (pieRadius === 0) {
                    if (is3D) {
                        chartWorkingHeight -= pieSliceDepth;
                        avableRedius = Math.min((chartWorkingWidth / 2) - labelMaxW, ((chartWorkingHeight / 2) - lineHeight) / pieYScale) - labelDistance;
                    }
                    else {
                        avableRedius = Math.min((chartWorkingWidth / 2) - labelMaxW, (chartWorkingHeight / 2) - lineHeight) - labelDistance;
                    }
                    if (avableRedius >= pieMinRadius) {//there has space for min width
                        pieMinRadius = avableRedius;
                    }
                    else {

                        var shortFall = pieMinRadius - avableRedius;
                        labelDistance = Math.max(labelDistance - shortFall, slicingDistance);
                    }
                }

                if (is3D) {
                    var avaiableMaxpieSliceDepth = chartWorkingHeight - (2 * ((pieMinRadius * pieYScale) + lineHeight));
                    if (pieSliceDepth > avaiableMaxpieSliceDepth) {
                        series.managedPieSliceDepth = pieSliceDepth - avaiableMaxpieSliceDepth;
                    }
                }

                //add the slicing distance
                hcJSON.plotOptions.pie3d.slicedOffset = hcJSON.plotOptions.pie.slicedOffset = slicingDistance;
                hcJSON.plotOptions.pie3d.size = hcJSON.plotOptions.pie.size = 2 * pieMinRadius;
                hcJSON.plotOptions.series.dataLabels.distance = labelDistance;
                hcJSON.plotOptions.series.dataLabels.isSmartLineSlanted = isSmartLineSlanted;
                hcJSON.plotOptions.series.dataLabels.enableSmartLabels = enableSmartLabels;
                hcJSON.plotOptions.series.dataLabels.skipOverlapLabels = skipOverlapLabels;
                hcJSON.plotOptions.series.dataLabels.manageLabelOverflow = manageLabelOverflow;


                //if the chart is a doughnut charts
                if (FCchartName === 'doughnut2d' || FCchartName === 'doughnut3d') {
                    var doughnutRadius = pluckNumber(fcJSONChart.doughnutradius, 0), x,
                        innerradius, innerpercentR, ratioStr, diff50Percent, radius3Dpercent,
                        use3DLighting = pluckNumber(fcJSONChart.use3dlighting, 1), poin2nd, point, data,
                        radius3D = use3DLighting ? pluckNumber(fcJSONChart.radius3d, fcJSONChart['3dradius'], 50) : 100;
                    if (radius3D > 100) {
                        radius3D = 100;
                    }
                    if (radius3D < 0) {
                        radius3D = 0;
                    }

                    /*
                     *decide inner redius
                     */
                    if (doughnutRadius === 0 || doughnutRadius >= pieMinRadius) {
                        innerradius = pieMinRadius / 2;
                    }
                    else {
                        innerradius = doughnutRadius;
                    }

                    hcJSON.plotOptions.pie3d.innerSize = hcJSON.plotOptions.pie.innerSize = 2 * innerradius;

                    /*
                     *create doughnut type 3d lighting
                     */
                    if (radius3D > 0 && hasSVG) { //radial gradient is not supported in VML
                        innerpercentR = parseInt(innerradius / pieMinRadius * 100, 10);
                        diff50Percent = (100 - innerpercentR) / 2;
                        radius3Dpercent = parseInt(diff50Percent * radius3D / 100, 10);
                        poin2nd = 2 * (diff50Percent - radius3Dpercent);
                        ratioStr = innerpercentR + COMMASTRING + radius3Dpercent + COMMASTRING + poin2nd + COMMASTRING + radius3Dpercent;
                        //loop for all points
                        if (hcJSON.series[0] && hcJSON.series[0].data) {
                            data = hcJSON.series[0].data;
                            for (x = 0, length = data.length; x < length; x += 1) {
                                point = data[x];
                                if (point.color.FCcolor) {
                                    point.color.FCcolor.ratio = ratioStr;
                                }
                            }
                        }

                    }
                }

            },
            creditLabel: creditLabel,
            eiMethods: {
                sliceDataItem: function(index) {
                    var vars = this.jsVars,
                        hcObj = vars.hcObj,
                        dataset,
                        data,
                        num;

                    if (hcObj && hcObj.datasets && (dataset = hcObj.datasets[0]) &&
                        (data = dataset.data) && (num = data.length) &&
                        data[index = num - index - 1] && data[index].plot) {

                        return hcObj.plotGraphicClick.call(data[index].plot);
                    }
                }
            }
        }, singleSeriesAPI);

        // add legacy function to pie 2d ieMethods
        chartAPI.pie2d.eiMethods.togglePieSlice =
            chartAPI.pie2d.eiMethods.sliceDataItem;

        chartAPI.pie2d.eiMethods.enableSlicingMovement =
        chartAPI.pie2d.eiMethods.enablelink = function () {
            global.raiseWarning(this, '1301081430', 'run', 'JSRenderer~enablelink()',
            'Method deprecated.');
        };


        chartAPI('pie3d', {
            friendlyName: "3D Pie Chart",
            defaultSeriesType: 'pie3d',
            rendererId: 'pie3d',
            creditLabel: creditLabel,
            getPointColor: function(color, alpha, radius3D) {
                return color;
            },
            // Pie2D (base) has defaultPlotShadow, but 3d does not.
            defaultPlotShadow: 0
        }, chartAPI.pie2d);

        chartAPI('doughnut2d', {
            friendlyName: "Doughnut Chart",
            getPointColor: function(color, alpha, radius3D) {
                var colorObj,
                    loLight,
                    hiLight;

                color = getFirstColor(color);
                alpha = getFirstAlpha(alpha);

                // Radial gradient is not supported in VML, hence we use for SVG
                // alone.
                if (radius3D < 100 && hasSVG) {
                    loLight = getDarkColor(color,
                        mathFloor((85 - 0.2 * (100 - radius3D)) * 100) / 100);

                    hiLight = getLightColor(color,
                        mathFloor((100 - 0.5 * radius3D) * 100) / 100);

                    colorObj = {
                        FCcolor: {
                            color: loLight + COMMA + hiLight + COMMA + hiLight +
                                COMMA + loLight,
                            alpha: alpha + COMMA + alpha + COMMA + alpha + COMMA + alpha,
                            radialGradient: true,
                            gradientUnits: 'userSpaceOnUse',
                            r: radius3D
                        }
                    };
                }
                else {
                    

                    colorObj = {
                        FCcolor: {
                            color: color + COMMA + color,
                            alpha: alpha + COMMA + alpha,
                            ratio: '0,100'
                        }
                    };
                }

                return colorObj;
            }
        }, chartAPI.pie2d);

        chartAPI('doughnut3d', {
            friendlyName: "3D Doughnut Chart",
            defaultSeriesType: 'pie3d',
            rendererId: 'pie3d',
            // Diughnut2D (base derived from Pie2D) has defaultPlotShadow,
            // but 3D does not.
            getPointColor: chartAPI.pie3d,
            defaultPlotShadow: 0
        }, chartAPI.doughnut2d);

        chartAPI('pareto2d', {
            friendlyName: "Pareto Chart",
            standaloneInit: true,
            point:
                function(chartName, series, data, FCChartObj, HCObj) {

                    var itemValue,
                        index,
                        setColor,
                        setAlpha,
                        setRatio,
                        dataLabel,
                        lineAlpha,
                        lineThickness,
                        lineDashed,
                        lineDashLen,
                        lineDashGap,
                        lineShadowOptions,
                        anchorBgColor,
                        anchorBgAlpha,
                        anchorAlpha,
                        anchorBorderColor,
                        dashStyle,
                        anchorBorderThickness,
                        anchorRadius,
                        anchorSides,
                        toolText,
                        countPoint,
                        displayValue,
                        columnDataObj,
                        dataObj,
                        colorArr,
                        lineColor,
                        showLabel,
                        pointShadow,
                        plotBorderAlpha,
                        drawAnchors,
                        displayValuePercent,
                        // length of the data
                        length = data.length,
                        sumValue = 0,
                        seriesLine = {},
                        paletteIndex = HCObj.chart.paletteIndex,
                        is3d = /3d$/.test(HCObj.chart.defaultSeriesType),
                        isBar = this.isBar,
                        setAngle = pluck(360 - FCChartObj.plotfillangle, 90),
                        setBorderWidth = pluckNumber(FCChartObj.plotborderthickness, 1),
                        isRoundEdges = HCObj.chart.useRoundEdges,
                        toolTipSepChar = pluck(FCChartObj.tooltipsepchar, ", "),
                        setPlotBorderColor = pluck(FCChartObj.plotbordercolor,
                        defaultPaletteOptions.plotBorderColor[paletteIndex])
                        .split(COMMASTRING)[0],
                        setPlotBorderAlpha = FCChartObj.showplotborder == ZEROSTRING ?
                        ZEROSTRING : pluck(FCChartObj.plotborderalpha,
                        FCChartObj.plotfillalpha, HUNDREDSTRING),
                        xAxisObj = HCObj.xAxis,
                        showCumulativeLine = pluckNumber(FCChartObj.showcumulativeline,
                        1),
                        conf = HCObj[FC_CONFIG_STRING],
                        axisGridManager = conf.axisGridManager,
                        xAxisConf = conf.x,
                        showtooltip = FCChartObj.showtooltip != ZEROSTRING,
                        dataOnlyArr = [],
                        tempLineSeries = [],
                        // use3DLighting to show gredient color effect in 3D Column
                        // charts
                        use3DLighting = pluckNumber(FCChartObj.use3dlighting, 1),
                        NumberFormatter = HCObj[FC_CONFIG_STRING].numberFormatter,
                        showLineValues = pluckNumber(FCChartObj.showlinevalues,
                        FCChartObj.showvalues),
                        plotBorderDashed = pluckNumber(FCChartObj.plotborderdashed, 0),
                        // length of the dash
                        seriesDashLen = pluckNumber(FCChartObj.plotborderdashlen, 5),
                        // distance between dash
                        seriesDashGap = pluckNumber(FCChartObj.plotborderdashgap, 4);

                    // Managing plot border color for 3D column chart
                    // 3D column chart doesn't show the plotborder by default
                    // until we set showplotborder true
                    setPlotBorderAlpha = is3d ? (FCChartObj.showplotborder ?
                        setPlotBorderAlpha : ZEROSTRING) : setPlotBorderAlpha;
                    // Default  plotBorderColor  is FFFFFF for this 3d chart
                    setPlotBorderColor = is3d ? pluck(FCChartObj.plotbordercolor,
                        '#FFFFFF') : setPlotBorderColor;

                    for (index = 0, countPoint = 0; index < length; index += 1) {
                        dataObj = data[index];
                        // vLine
                        if (data[index].vline) {
                            axisGridManager.addVline(xAxisObj, dataObj,
                                countPoint, HCObj);
                        }
                        else {
                            itemValue = NumberFormatter.getCleanValue(dataObj.value,
                                true);
                            //if valid data then only add the point
                            if (itemValue !== null) {
                                // Save the malid value so that no further
                                // parsePointValue needed
                                dataObj.value = itemValue;
                                dataOnlyArr.push(dataObj);
                                countPoint += 1;
                            }

                        }
                    }

                    length = dataOnlyArr.length;

                    //short the data
                    dataOnlyArr.sort(function(a, b) {
                        return b.value - a.value;
                    });

                    if (showCumulativeLine) {
                        // If line is a dashed line
                        lineDashed = pluckNumber(FCChartObj.linedashed, 0);
                        // Managing line series color
                        lineColor = getFirstColor(pluck(FCChartObj.linecolor,
                            defaultPaletteOptions.plotBorderColor[paletteIndex]));
                        // alpha of the line series
                        lineAlpha = pluck(FCChartObj.linealpha, 100);
                        // length of the dash
                        lineDashLen = pluckNumber(FCChartObj.linedashlen, 5);
                        // distance between dash
                        lineDashGap = pluckNumber(FCChartObj.linedashgap, 4);
                        // Thickness of the line
                        lineThickness = pluckNumber(FCChartObj.linethickness, 2);
                        // Line shadow options is created here once and this object
                        // is later passed on to every data-point of the line-series.
                        lineShadowOptions = {
                            opacity: lineAlpha / 100
                        };

                        // Whether to draw the anchors or not
                        drawAnchors = pluckNumber(FCChartObj.drawanchors,
                            FCChartObj.showanchors);
                        if (drawAnchors === undefined) {
                            drawAnchors = lineAlpha != ZEROSTRING;
                        }

                        // Anchor cosmetics
                        // Thickness of anchor border
                        anchorBorderThickness = pluckNumber(
                            FCChartObj.anchorborderthickness, 1);
                        // sides of the anchor
                        anchorSides = pluckNumber(FCChartObj.anchorsides, 0);
                        // radius of anchor
                        anchorRadius = pluckNumber(FCChartObj.anchorradius, 3);
                        anchorBorderColor = getFirstColor(
                            pluck(FCChartObj.anchorbordercolor, lineColor));
                        anchorBgColor = getFirstColor(pluck(FCChartObj.anchorbgcolor,
                            defaultPaletteOptions.anchorBgColor[paletteIndex]));
                        anchorAlpha = getFirstAlpha(pluck(FCChartObj.anchoralpha,
                            HUNDREDSTRING));
                        // anchorBGalpha should not inherit from anchoralpha.
                        // But to replicate flash comented
                        anchorBgAlpha = (getFirstAlpha(pluck(FCChartObj.anchorbgalpha,
                            anchorAlpha)) * anchorAlpha) / 100;

                        // Dash Style
                        dashStyle = lineDashed ? getDashStyle(lineDashLen, lineDashGap,
                            lineThickness) : undefined;

                        // Create line-series object
                        seriesLine = {
                            yAxis: 1,
                            data: [],
                            type: 'line',
                            color: {
                                FCcolor: {
                                    color: lineColor,
                                    alpha: lineAlpha
                                }
                            },
                            lineWidth: lineThickness,
                            marker: {
                                enabled: drawAnchors,
                                fillColor: {
                                    FCcolor: {
                                        color: anchorBgColor,
                                        alpha: anchorBgAlpha
                                    }
                                },
                                lineColor: {
                                    FCcolor: {
                                        color: anchorBorderColor,
                                        alpha: anchorAlpha
                                    }
                                },
                                lineWidth: anchorBorderThickness,
                                radius: anchorRadius,
                                symbol: mapSymbolName(anchorSides),
                                startAngle: pluck(FCChartObj.anchorstartangle, 90)
                            }
                        };
                    }
                    else {
                        if (FCChartObj.showsecondarylimits !== '1') {
                            FCChartObj.showsecondarylimits = '0';
                        }
                        if (FCChartObj.showdivlinesecondaryvalue !== '1') {
                            FCChartObj.showdivlinesecondaryvalue = '0';
                        }
                    }


                    // Iterate through all level data
                    for (index = 0; index < length; index += 1) {
                        // individual data obj
                        // for further manipulation
                        dataObj = dataOnlyArr[index];
                        // we check showLabel in individual data
                        // if its set to 0 than we do not show the particular label
                        showLabel = pluckNumber(dataObj.showlabel,
                            FCChartObj.showlabels, 1);

                        // Label of the data
                        // getFirstValue returns the first defined value in arguments
                        // we check if showLabel is not set to 0 in data
                        // then we take the label given in data, it can be given using
                        // label as well as name too
                        // we give priority to label if label is not there,
                        // we check the name attribute
                        // dataLabel = parseUnsafeString(!showLabel ? BLANKSTRING :
                        // getFirstValue(dataObj.label, dataObj.name));
                        dataLabel = parseUnsafeString(!showLabel ? BLANKSTRING :
                            getFirstValue(dataObj.label, dataObj.name));

                        // adding label in HighChart xAxis categories
                        // increase category counter by one
                        axisGridManager.addXaxisCat(xAxisObj, index, index, dataLabel);
                        sumValue += itemValue = dataObj.value;

                        // Color of the each data point
                        setColor = pluck(dataObj.color, HCObj.colors[index %
                            HCObj.colors.length]) +
                            COMMASTRING + (pluckNumber(
                            FCChartObj.useplotgradientcolor, 1) ?
                            getDefinedColor(FCChartObj.plotgradientcolor,
                            defaultPaletteOptions.plotGradientColor[paletteIndex]) :
                            BLANKSTRING);
                        // Alpha of the data
                        setAlpha = pluck(dataObj.alpha, FCChartObj.plotfillalpha,
                            HUNDREDSTRING);
                        // Fill ratio of the data
                        setRatio = pluck(dataObj.ratio, FCChartObj.plotfillratio);

                        // Used to set alpha of the shadow
                        pointShadow = {
                            opacity: setAlpha / 100
                        };
                        plotBorderAlpha = pluck(dataObj.alpha, setPlotBorderAlpha) +
                            BLANKSTRING;

                        //calculate the color object for the set
                        colorArr = getColumnColor(setColor, setAlpha, setRatio,
                            setAngle, isRoundEdges, setPlotBorderColor,
                            plotBorderAlpha, isBar, is3d);

                        // Finally add the data
                        // we call getPointStub function that manage displayValue,
                        // toolText and link
                        series.data.push(extend2(this.getPointStub(dataObj, itemValue,
                            dataLabel, HCObj), {
                            y: itemValue,
                            shadow: pointShadow,
                            color: colorArr[0],
                            borderColor: colorArr[1],
                            borderWidth: setBorderWidth,
                            use3DLighting: use3DLighting,
                            dashStyle: pluckNumber(dataObj.dashed, plotBorderDashed)
                                == 1 ? getDashStyle(seriesDashLen, seriesDashGap,
                                setBorderWidth) : '',
                            tooltipConstraint: this.tooltipConstraint
                        }));

                        // Set the maximum and minimum found in data
                        // pointValueWatcher use to calculate the maximum and
                        // minimum value of the Axis
                        this.pointValueWatcher(HCObj, itemValue);

                        // If we need we need to show the line series in pareto chart
                        if (showCumulativeLine) {
                            // add the data to temp Line series data for farther
                            // calculation
                            tempLineSeries.push({
                                value: sumValue,
                                dataLabel: dataLabel,
                                tooltext: getValidValue(dataObj.tooltext)
                            });
                        }
                    }
                    // set the xAxisConf catCount for further use
                    xAxisConf.catCount = length;
                    // create the dummy situation so that it work same as DYaxis with
                    // percentStacking, create the dummy axis conf object
                    if (!conf[1]) {
                        conf[1] = {};
                    }
                    // configure this axis to show this axis values as percent
                    conf[1].stacking100Percent = true;

                    // Line series on pareto
                    if (showCumulativeLine && sumValue > 0) {
                        // Iterate through line series and calculate the
                        // line series point values
                        for (index = 0, length = tempLineSeries.length; index < length;
                            index += 1) {
                            // individual data obj
                            dataObj = tempLineSeries [index];
                            // individual data object of column series
                            columnDataObj = series.data[index];
                            //value upto 2 decimal
                            itemValue = (dataObj.value / sumValue * 100);
                            displayValuePercent =
                                NumberFormatter.percentValue(itemValue);

                            // display value for the line series data point
                            displayValue = columnDataObj.displayValue !== BLANKSTRING ?
                                displayValuePercent : BLANKSTRING;

                            if (showLineValues == 1) {
                                displayValue = displayValuePercent;
                            }
                            if (showLineValues == 0) {
                                displayValue = BLANKSTRING;
                            }

                            dataLabel = dataObj.dataLabel;

                            // Manipulating tooltext of the line series
                            toolText = showtooltip ? (dataObj.tooltext !== undefined ?
                                dataObj.tooltext : ((dataLabel !== BLANKSTRING ?
                                dataLabel + toolTipSepChar : BLANKSTRING) +
                                displayValuePercent)) : BLANKSTRING;

                            seriesLine.data.push({
                                shadow: lineShadowOptions,
                                color: seriesLine.color,
                                marker: seriesLine.marker,
                                y: itemValue,
                                toolText: toolText,
                                displayValue: displayValue,
                                //retrive link from column series
                                link: columnDataObj.link,
                                dashStyle: dashStyle
                            });
                        }

                        //return series
                        return [series, seriesLine];
                    }
                    else {
                        //remove all s axis text
                        return series;
                    }
                },
            defaultSeriesType: 'column',
            isDual: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, singleSeriesAPI);

        chartAPI('pareto3d', {
            friendlyName: "3D Pareto Chart",
            defaultSeriesType: 'column3d',
            defaultPlotShadow: 1,
            is3D: true
        }, chartAPI.pareto2d);

        chartAPI('mscolumn2d', {
            friendlyName: "Multi-series Column Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.mscolumn2dbase);

        chartAPI('mscolumn3d', {
            friendlyName: "Multi-series 3D Column Chart",
            defaultSeriesType: 'column3d',
            // Default shadow is visible for 3D variant of MSColumn2D chart
            defaultPlotShadow: 1,
            is3D: true,
            defaultZeroPlaneHighlighted: false
        }, chartAPI.mscolumn2d);

        chartAPI('msbar2d', {
            friendlyName: "Multi-series Bar Chart",
            isBar: true,
            defaultSeriesType: 'bar',
            spaceManager: chartAPI.barbase
        }, chartAPI.mscolumn2d);

        chartAPI('msbar3d', {
            friendlyName: "Multi-series 3D Bar Chart",
            defaultSeriesType: 'bar3d',
            defaultPlotShadow: 1,
            is3D: true,
            defaultZeroPlaneHighlighted: false
        }, chartAPI.msbar2d);

        chartAPI('msline', {
            friendlyName: "Multi-series Line Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.mslinebase);

        chartAPI('msarea', {
            friendlyName: "Multi-series Area Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.msareabase);

        chartAPI('stackedcolumn2d', {
            friendlyName: "Stacked Column Chart",
            isStacked: true
        }, chartAPI.mscolumn2d);

        chartAPI('stackedcolumn3d', {
            friendlyName: "3D Stacked Column Chart",
            isStacked: true
        }, chartAPI.mscolumn3d);

        chartAPI('stackedbar2d', {
            friendlyName: "Stacked Bar Chart",
            isStacked: true
        }, chartAPI.msbar2d);

        chartAPI('stackedbar3d', {
            friendlyName: "3D Stacked Bar Chart",
            isStacked: true
        }, chartAPI.msbar3d);

        chartAPI('stackedarea2d', {
            friendlyName: "Stacked Area Chart",
            isStacked: true,
            areaAlpha: 100,
            showSum: 0
        }, chartAPI.msarea);

        chartAPI('marimekko', {
            friendlyName: "Marimekko Chart",
            isValueAbs: true,
            distributedColumns: true,
            isStacked: true,
            xAxisMinMaxSetter: stubFN,
            postSeriesAddition: function(HCObj, FCObj, width, height) {
                var conf = HCObj[FC_CONFIG_STRING],
                    total = 0,
                    xAxis = HCObj.xAxis,
                    volumeXratio = 100 / conf.marimekkoTotal,
                    catArr = [],
                    series = HCObj.series,
                    startPosition = 0,
                    plotBorderThickness = pluckNumber(FCObj.chart.plotborderthickness,
                    1),
                    rotateValues = HCObj.chart.rotateValues,
                    rotatePercentVals = pluckNumber(
                    FCObj.chart.rotatexaxispercentvalues, 0),
                    // this calculation is to properly align the vLine label border
                    // with plotbottom
                    vLineLabelYOffset = plotBorderThickness * -0.5 -
                    (plotBorderThickness % 2 + (rotatePercentVals ? 0 : 4)),
                    vLineLabelXOffset = rotatePercentVals ? 3 : 0,
                    vLineLabelRotation = rotateValues ? 270 : 0,
                    style = extend2({}, HCObj.plotOptions.series.dataLabels.style),
                    labelFontSize = parseInt(style.fontSize, 10),
                    // For the first y axis
                    axisStack = conf[0],
                    usePercentDistribution = axisStack.stacking100Percent,
                    isVline = !usePercentDistribution,
                    inCanvasStyle = conf.inCanvasStyle,
                    numberFormatter = this.numberFormatter,
                    categories = FCObj.categories && FCObj.categories[0]
                    && FCObj.categories[0].category || [],
                    catWidthPercent = 0,
                    widthPercentArr = [],
                    axisConfStack,
                    length,
                    stackArr,
                    point,
                    pointValue,
                    value,
                    catPosition,
                    y,
                    count,
                    catObj,
                    midposition,
                    xdistance,
                    endPosition,
                    stack,
                    vLinePos,
                    xPosPercentStore = [];

                conf.isXYPlot = true;
                conf.distributedColumns = true;

                xAxis.min = 0;
                xAxis.max = 100;

                // Remove all grid related conf
                xAxis.labels.enabled = false;
                xAxis.gridLineWidth = INT_ZERO;
                xAxis.alternateGridColor = COLOR_TRANSPARENT;

                axisConfStack = axisStack.stack;

                // Stop interactive legend for marimekko
                FCObj.chart.interactivelegend = '0';

                // Save the ref of the cat labels to set the position
                for (y = 0, length = HCObj.xAxis.plotLines.length;
                    y < length; y += 1) {
                    catObj = xAxis.plotLines[y];
                    if (catObj.isGrid) {
                        // Add the isCat attr so that it will work
                        // like scatter cat label
                        catObj.isCat = true;
                        catArr[catObj.value] = catObj;
                        catObj._hideLabel = true;
                    }
                }

                // find the sum of widthPercent in categories.
                for (y = count = 0; y < categories.length; y += 1) {
                    if (!categories[y].vline) {
                        catWidthPercent += widthPercentArr[count] =
                            numberFormatter.getCleanValue(categories[y].widthpercent
                            || 0);
                        count += 1;
                    }
                }

                // Creating dummy stackArr to avoid null value in data
                stackArr = axisConfStack.floatedcolumn && axisConfStack.floatedcolumn[0] || [];
                if (catWidthPercent === 100 && (stackArr && stackArr.length) !== count) {
                    while (count--) {
                        if (!stackArr[count]) {
                            stackArr[count] = {
                                p: null
                            };
                        }
                    }
                }

                catWidthPercent = mathRound(catWidthPercent);

                if (stackArr) {
                    for (catPosition = 0, length = stackArr.length;
                        catPosition < length; ) {
                        stack = stackArr[catPosition];
                        total += value = (stack && stack.p || 0);
                        xdistance = catWidthPercent === 100 ? widthPercentArr[catPosition] : value * volumeXratio;
                        midposition = startPosition + (xdistance / 2);
                        endPosition = startPosition + xdistance;
                        xPosPercentStore.push(endPosition);
                        for (y = 0; y < series.length; y += 1) {
                            point = HCObj.series[y].data[catPosition];
                            point._FCX = startPosition;
                            point._FCW = xdistance;

                            // scale data values to percentage
                            if (usePercentDistribution) {
                                if (point.y || point.y === 0) {
                                    pointValue = point.y / value * 100;
                                    point.y = pointValue;
                                    //set display value
                                    if (point.showPercentValues) {
                                        point.displayValue = this.numberFormatter.percentValue(pointValue);
                                    }
                                    //set tooltip
                                    if (point.showPercentInToolTip) {
                                        point.toolText = point.toolText + (parseInt(pointValue * 100, 10) / 100) + '%';
                                    }
                                }
                                if (point.previousY || point.previousY === 0) {
                                    point.previousY = point.previousY / value * 100;
                                }
                            }


                        }

                        // Add the total value
                        if (conf.showStackTotal) {
                            HCObj.xAxis.plotLines.push({
                                value: midposition,
                                width: 0,
                                isVline: isVline,
                                isTrend: !isVline,
                                _isStackSum : 1,
                                zIndex: 4,
                                label: {
                                    align: POSITION_CENTER,
                                    textAlign: vLineLabelRotation,
                                    rotation: rotateValues ? 270 : 0,
                                    style: style,
                                    verticalAlign: POSITION_TOP,
                                    offsetScale: isVline ? (value < 0 ? stack.n :
                                        stack.p) : undefined,
                                    offsetScaleIndex: 0,
                                    y: value < 0 ?
                                        (rotateValues === 270 ? 4 : labelFontSize)
                                        : -4,
                                    x: 0,
                                    text: numberFormatter.yAxis(
                                        toPrecision(value, 10))
                                }
                            });
                        }

                        // Position the cat labels
                        if (catArr[catPosition]) {
                            catArr[catPosition].value = midposition;
                            // In case of marimekko charts we need the width
                            // (xdistance) of each column also to render the
                            // horizontal axis. Hence saving here for future use.
                            catArr[catPosition]._weight = xdistance;
                            catArr[catPosition]._hideLabel = false;
                        }

                        catPosition += 1;

                        // Add the stack %
                        if (conf.showXAxisPercentValues && catPosition < length) {
                            HCObj.xAxis.plotLines.push({
                                value: endPosition,
                                width: 0,
                                isVine: true,
                                label: {
                                    align: POSITION_CENTER,
                                    textAlign: rotatePercentVals ? POSITION_LEFT
                                        : POSITION_CENTER,
                                    rotation: rotatePercentVals ? 270 : 0,
                                    backgroundColor: '#ffffff',
                                    backgroundOpacity: 1,
                                    borderWidth: '1px',
                                    borderType:  'solid',
                                    borderColor: inCanvasStyle.color,
                                    style: {
                                        color: inCanvasStyle.color,
                                        fontSize: inCanvasStyle.fontSize,
                                        fontFamily: inCanvasStyle.fontFamily,
                                        lineHeight: inCanvasStyle.lineHeight
                                    },
                                    verticalAlign: POSITION_BOTTOM,
                                    y: vLineLabelYOffset,
                                    x: vLineLabelXOffset,
                                    text: this.numberFormatter.percentValue(
                                        endPosition)
                                },
                                zIndex: 5
                            });
                        }
                        startPosition = endPosition;
                    }
                }
                // Hide the unwanged category labels
                for (catPosition = 0, length = catArr.length;
                    catPosition < length; catPosition += 1) {
                    if (catArr[catPosition] && catArr[catPosition]._hideLabel) {
                        catArr[catPosition].value = null;
                    }
                }
                // Adjust all vLine position
                for (y = 0, length = HCObj.xAxis.plotLines.length;
                    y < length; y += 1) {
                    catObj = xAxis.plotLines[y];
                    if (catObj.isVline && !catObj._isStackSum) {
                        vLinePos = catObj.value;
                        if (vLinePos){
                            vLinePos = mathRound(vLinePos - 0.5);
                            catObj.value = xPosPercentStore[vLinePos];
                        }
                    }
                }
            },
            defaultSeriesType: 'floatedcolumn'
        }, chartAPI.stackedcolumn2d);

        chartAPI('msstackedcolumn2d', {
            friendlyName: "Multi-series Stacked Column Chart",
            series: function(FCObj, HCObj, chartName, width, height) {
                var i, len, index, length,
                    conf = HCObj[FC_CONFIG_STRING], lineset, totalDataSets = 0,
                    series, minDataLength, seriesArr = [], innerDataSet;

                //enable the legend
                HCObj.legend.enabled = Boolean(pluckNumber(FCObj.chart.showlegend, 1));

                if (FCObj.dataset && FCObj.dataset.length > 0) {
                    // add category
                    this.categoryAdder(FCObj, HCObj);
                    //add data series
                    for (i = 0, len = FCObj.dataset.length; i < len; i += 1) {
                        if (innerDataSet = FCObj.dataset[i].dataset) {
                            for (index = 0, length = innerDataSet.length; index < length; index += 1, totalDataSets += 1) {
                                series = {
                                    visible: !!pluckNumber(innerDataSet.visible, 1),
                                    data: [],
                                    numColumns: len,
                                    columnPosition: i
                                };
                                minDataLength = Math.min(conf.oriCatTmp.length,
                                    innerDataSet[index].data && innerDataSet[index].data.length);
                                //add data to the series
                                seriesArr = this.point(chartName, series,
                                    innerDataSet[index], FCObj.chart, HCObj, minDataLength, totalDataSets, i);
                                // Turn of shadow for this chart in order to avoid series shadow
                                // overflow.
                                //seriesArr.shadow = false;
                                //push the data at the series array
                                HCObj.series.push(seriesArr);
                            }

                        }
                    }

                    // Adding lineset to HighChart series
                    //if dual then it is the combi series
                    if (this.isDual && FCObj.lineset && FCObj.lineset.length > 0) {
                        for (index = 0, length = FCObj.lineset.length; index < length; index += 1, totalDataSets += 1) {
                            series = {
                                visible: !!pluckNumber(FCObj.lineset[index].visible, 1),
                                data: [],
                                yAxis: 1,
                                type: 'line'
                            };
                            lineset = FCObj.lineset[index];
                            minDataLength = Math.min(conf.oriCatTmp.length,
                                lineset.data && lineset.data.length);

                            HCObj.series.push(chartAPI.msline.point.call(this, "msline", series,
                                lineset, FCObj.chart, HCObj, minDataLength, totalDataSets));
                        }
                    }

                    ///configure the axis
                    this.configureAxis(HCObj, FCObj);
                    ///////////Trend-lines /////////////////
                    if (FCObj.trendlines) {
                        createTrendLine(FCObj.trendlines, HCObj.yAxis, HCObj[FC_CONFIG_STRING], this.isDual, this.isBar);
                    }
                }
            },

            // Adjustment for MSStacked Column charts showSum if plotSpacePercent=20
            // we need to reduce the column width to 50px if its > 50
            postSpaceManager: function (hcObj, obj, width, height) {
                var conf = hcObj[FC_CONFIG_STRING],
                    chart,
                    xAxis,
                    plotLines,
                    canvasWidth,
                    plotSpacePercent,
                    groupWidthPercent,
                    axisConfStack,
                    totalStacks,
                    perStackWidth,
                    pxValueRatio,
                    perStackPxWidth,
                    newPerStackWidth,
                    len,
                    startStackIndex,
                    newValue,
                    plotLineObj,
                    i;

                //show the stack total if requared
                if (this.isStacked && conf.showStackTotal) {
                    chart = hcObj.chart;
                    xAxis = hcObj.xAxis;
                    plotLines = xAxis && xAxis.plotLines;
                    canvasWidth = width - chart.marginLeft - chart.marginRight;
                    plotSpacePercent = conf.plotSpacePercent;
                    groupWidthPercent = 1 - (2 * plotSpacePercent);
                    axisConfStack = conf[0].stack;
                    totalStacks = axisConfStack['column'] && axisConfStack['column'].length;
                    perStackWidth = groupWidthPercent / totalStacks;
                    pxValueRatio = canvasWidth / (xAxis.max - xAxis.min);
                    perStackPxWidth = pxValueRatio * perStackWidth;

                    if (perStackPxWidth > 50 && plotSpacePercent == 0.1) {
                        newPerStackWidth = 50 / pxValueRatio;
                        len = plotLines && plotLines.length;
                        startStackIndex = -((totalStacks - 1) / 2) *
                            newPerStackWidth;
                        for (i = 0; i < len; i += 1) {
                            plotLineObj = plotLines[i];
                            if (plotLineObj._isStackSum) {
                                newValue = plotLineObj._catPosition +
                                    (startStackIndex + (newPerStackWidth *
                                    plotLineObj._stackIndex));
                                plotLineObj.value = newValue;
                            }
                        }
                    }
                }
            }

        }, chartAPI.stackedcolumn2d);


        chartAPI('mscombi2d', {
            friendlyName: "Multi-series Combination Chart",
            standaloneInit: true,
            creditLabel: creditLabel,
            rendererId: 'cartesian'
        }, chartAPI.mscombibase);

        chartAPI('mscombi3d', {
            friendlyName: "Multi-series 3D Combination Chart",
            series: chartAPI.mscombi2d.series,
            eiMethods: (function (eiMethods) {
                var eiHandlers = {};
                each(eiMethods.split(','), function(method) {
                    eiHandlers[method] = function () {
                        global.raiseWarning(this, '1301081430', 'run',
                            'JSRenderer~'+ method+ '()',
                            'Method not applicable.');
                        };
                });
                return eiHandlers;
            }('view2D,view3D,resetView,rotateView,getViewAngles,fitToStage'))
        }, chartAPI.mscolumn3d);

        chartAPI('mscolumnline3d', {
            friendlyName: "Multi-series Column and Line Chart"
        }, chartAPI.mscombi3d);

        chartAPI('stackedcolumn2dline', {
            friendlyName: "Stacked Column and Line Chart",
            isStacked: true,
            stack100percent: 0
        }, chartAPI.mscombi2d);

        chartAPI('stackedcolumn3dline', {
            friendlyName: "Stacked 3D Column and Line Chart",
            isStacked: true,
            stack100percent: 0
        }, chartAPI.mscombi3d);

        chartAPI('mscombidy2d', {
            friendlyName: "Multi-series Dual Y-Axis Combination Chart",
            isDual: true,
            secondarySeriesType: undefined
        }, chartAPI.mscombi2d);

        chartAPI('mscolumn3dlinedy', {
            friendlyName: "Multi-series 3D Column and Line Chart",
            isDual: true,
            secondarySeriesType: 'line'
        }, chartAPI.mscolumnline3d);

        chartAPI('stackedcolumn3dlinedy', {
            friendlyName: "Stacked 3D Column and Line Chart",
            isDual: true,
            secondarySeriesType: 'line'
        }, chartAPI.stackedcolumn3dline);

        chartAPI('msstackedcolumn2dlinedy', {
            friendlyName: "Multi-series Dual Y-Axis Stacked Column and Line Chart",
            isDual: true,
            stack100percent: 0,
            secondarySeriesType: 'line'
        }, chartAPI.msstackedcolumn2d);


        chartAPI('scrollcolumn2d', {
            friendlyName: "Scrollable Multi-series Column Chart",
            postSeriesAddition: chartAPI.scrollbase.postSeriesAddition,
            tooltipConstraint: 'plot',
            canvasborderthickness: 1,
            avgScrollPointWidth: 40
        }, chartAPI.mscolumn2d);

        chartAPI('scrollline2d', {
            friendlyName: "Scrollable Multi-series Line Chart",
            postSeriesAddition: chartAPI.scrollbase.postSeriesAddition,
            tooltipConstraint: 'plot',
            canvasborderthickness: 1,
            avgScrollPointWidth: 75
        }, chartAPI.msline);

        chartAPI('scrollarea2d', {
            friendlyName: "Scrollable Multi-series Area Chart",
            postSeriesAddition: chartAPI.scrollbase.postSeriesAddition,
            tooltipConstraint: 'plot',
            canvasborderthickness: 1,
            avgScrollPointWidth: 75
        }, chartAPI.msarea);

        chartAPI('scrollstackedcolumn2d', {
            friendlyName: "Scrollable Stacked Column Chart",
            postSeriesAddition: function(hcObj, fcObj, width, height) {
                chartAPI.base.postSeriesAddition.call(this, hcObj, fcObj, width, height);
                chartAPI.scrollbase.postSeriesAddition.call(this, hcObj, fcObj, width, height);
            },
            canvasborderthickness: 1,
            tooltipConstraint: 'plot',
            avgScrollPointWidth: 75
        }, chartAPI.stackedcolumn2d);

        chartAPI('scrollcombi2d', {
            friendlyName: "Scrollable Combination Chart",
            postSeriesAddition: chartAPI.scrollbase.postSeriesAddition,
            tooltipConstraint: 'plot',
            canvasborderthickness: 1,
            avgScrollPointWidth: 40
        }, chartAPI.mscombi2d);

        chartAPI('scrollcombidy2d', {
            friendlyName: "Scrollable Dual Y-Axis Combination Chart",
            postSeriesAddition: chartAPI.scrollbase.postSeriesAddition,
            tooltipConstraint: 'plot',
            canvasborderthickness: 1,
            avgScrollPointWidth: 40
        }, chartAPI.mscombidy2d);


        chartAPI('scatter', {
            friendlyName: "Scatter Chart",
            standaloneInit: true,
            defaultSeriesType: 'scatter',
            defaultZeroPlaneHighlighted: false,
            creditLabel: creditLabel
        }, chartAPI.scatterbase);

        chartAPI('bubble', {
            friendlyName: "Bubble Chart",
            standaloneInit: true,
            standaloneInut: true,
            defaultSeriesType: 'bubble',
            rendererId: 'bubble',
            point: function(chartName, series, dataset, FCChartObj, HCObj, catLength, seriesIndex) {
                if (dataset.data) {
                    var itemValueY, index, drawAnchors, dataObj,
                        setColor, setAlpha,
                        plotFillAlpha,
                        showPlotBorder,
                        plotBorderColor,
                        plotBorderThickness,
                        plotBorderAlpha,
                        seriesAnchorBorderColor,
                        seriesAnchorSymbol,
                        hasValidPoint = false,
                        seriesAnchorBorderThickness, seriesAnchorBgColor,
                        itemValueX, itemValueZ, pointStub,
                        chartTypeConf = chartAPI[chartName],
                        // Data array in dataset object
                        data = dataset.data,
                        dataLength = data.length,
                        conf = HCObj[FC_CONFIG_STRING],
                        // showValues attribute in individual dataset
                        datasetShowValues = pluckNumber(dataset.showvalues, conf.showValues),
                        bubbleScale = pluckNumber(FCChartObj.bubblescale, 1),
                        negativeColor = pluck(FCChartObj.negativecolor, "FF0000"),
                        bubblePlotOptions = HCObj.plotOptions.bubble,
                        NumberFormatter = this.numberFormatter,
                        //Regratation line
                        showRegressionLine = pluckNumber(dataset.showregressionline,
                        FCChartObj.showregressionline, 0);

                    bubblePlotOptions.bubbleScale = bubbleScale;

                    // Dataset seriesname
                    series.name = getValidValue(dataset.seriesname);
                    // If showInLegend set to false
                    // We set series.name blank
                    if (pluckNumber(dataset.includeinlegend) === 0 || series.name === undefined) {
                        series.showInLegend = false;
                    }

                    // Managing line series markers
                    // Whether to drow the Anchor or not
                    drawAnchors = Boolean(pluckNumber(dataset.drawanchors, dataset.showanchors, FCChartObj.drawanchors, 1));

                    // Plot Border Cosmetics
                    plotFillAlpha = pluck(dataset.plotfillalpha, dataset.bubblefillalpha, FCChartObj.plotfillalpha, HUNDREDSTRING);
                    showPlotBorder = pluckNumber(dataset.showplotborder, FCChartObj.showplotborder, 1);
                    plotBorderColor = getFirstColor(pluck(dataset.plotbordercolor, FCChartObj.plotbordercolor, "666666"));
                    plotBorderThickness = pluck(dataset.plotborderthickness, FCChartObj.plotborderthickness, 1);
                    plotBorderAlpha = pluck(dataset.plotborderalpha, FCChartObj.plotborderalpha, "95");

                    // Anchor cosmetics
                    // We first look into dataset then chart obj and then default value.
                    seriesAnchorSymbol = 'circle';
                    seriesAnchorBorderColor = plotBorderColor;
                    seriesAnchorBorderThickness = showPlotBorder == 1 ? plotBorderThickness : 0;
                    seriesAnchorBgColor = pluck(dataset.color, dataset.plotfillcolor,
                        FCChartObj.plotfillcolor, HCObj.colors[seriesIndex % HCObj.colors.length]);

                    series.marker = {
                        enabled: drawAnchors,
                        fillColor: this.getPointColor(seriesAnchorBgColor, HUNDREDSTRING),
                        lineColor: {
                            FCcolor: {
                                color: seriesAnchorBorderColor,
                                alpha: plotBorderAlpha
                            }
                        },
                        lineWidth: seriesAnchorBorderThickness,
                        symbol: seriesAnchorSymbol
                    };

                    if (showRegressionLine) {
                        series.events = {
                            hide: this.hideRLine,
                            show: this.showRLine
                        };
                        //regration object used in XY chart
                        //create here to avoid checking always
                        var regrationObj = {
                            sumX: 0,
                            sumY: 0,
                            sumXY: 0,
                            sumXsqure: 0,
                            sumYsqure: 0,
                            xValues: [],
                            yValues: []
                        }, regSeries,
                            showYOnX = pluckNumber(dataset.showyonx, FCChartObj.showyonx, 1),
                            regressionLineColor = getFirstColor(pluck(dataset.regressionlinecolor,
                            FCChartObj.regressionlinecolor, seriesAnchorBgColor)),
                            regressionLineThickness = pluckNumber(dataset.regressionlinethickness,
                            FCChartObj.regressionlinethickness, 1),
                            regressionLineAlpha = getFirstAlpha(pluckNumber(dataset.regressionlinealpha,
                            FCChartObj.regressionlinealpha, 100)),
                            regLineColor = convertColor(regressionLineColor, regressionLineAlpha);
                    }

                    // Iterate through all level data
                    for (index = 0; index < dataLength; index += 1) {
                        // Individual data obj
                        // for further manipulation
                        dataObj = data[index];
                        if (dataObj) {
                            itemValueY = NumberFormatter.getCleanValue(dataObj.y);
                            itemValueX = NumberFormatter.getCleanValue(dataObj.x);
                            itemValueZ = NumberFormatter.getCleanValue(dataObj.z, true);

                            // If value is null we assign
                            if (itemValueY === null) {
                                series.data.push({
                                    y: null,
                                    x: itemValueX
                                });
                                continue;
                            }

                            hasValidPoint = true;

                            setColor = getFirstColor(pluck(dataObj.color, (dataObj.z < 0 ? negativeColor : seriesAnchorBgColor)));
                            setAlpha = pluck(dataObj.alpha, plotFillAlpha);

                            // Get the point stubs like disPlayValue, tooltext and link
                            pointStub = chartTypeConf
                                .getPointStub(dataObj, itemValueY, itemValueX, HCObj, dataset, datasetShowValues);

                            setColor = pluckNumber(FCChartObj.use3dlighting) === 0 ?
                                setColor : chartTypeConf.getPointColor(setColor, setAlpha);

                            // storing the absolute value of the z-value
                            // (since this will be used to calculate radius which can't be negative)
                            if (itemValueZ !== null) {
                                // getting the larger vaue
                                bubblePlotOptions.zMax = bubblePlotOptions.zMax > itemValueZ ? bubblePlotOptions.zMax : itemValueZ;
                                bubblePlotOptions.zMin = bubblePlotOptions.zMin < itemValueZ ? bubblePlotOptions.zMin : itemValueZ;
                            }

                            // Finally add the data
                            // we call getPointStub function that manage displayValue, toolText and link
                            series.data.push({
                                y: itemValueY,
                                x: itemValueX,
                                z: itemValueZ,
                                displayValue: pointStub.displayValue,
                                toolText: pointStub.toolText,
                                link: pointStub.link,
                                marker: {
                                    enabled: drawAnchors,
                                    fillColor: setColor,
                                    lineColor: {
                                        FCcolor: {
                                            color: seriesAnchorBorderColor,
                                            alpha: plotBorderAlpha
                                        }
                                    },
                                    lineWidth: seriesAnchorBorderThickness,
                                    symbol: seriesAnchorSymbol
                                }
                            });

                            // Set the maximum and minimum found in data
                            // pointValueWatcher use to calculate the maximum and minimum value of the Axis
                            this.pointValueWatcher(HCObj, itemValueY, itemValueX, showRegressionLine && regrationObj);
                        }
                        else {
                            // add the data
                            series.data.push({
                                y: null
                            });
                        }
                    }
                    if (showRegressionLine) {
                        regSeries = {
                            type: 'line',
                            color: regLineColor,
                            showInLegend: false,
                            lineWidth: regressionLineThickness,
                            enableMouseTracking: false,
                            marker: {
                                enabled: false
                            },
                            data: this.getRegressionLineSeries(regrationObj, showYOnX, dataLength),
                            zIndex: 0
                        };
                        series = [series, regSeries];
                    }
                }

                // If all the values in current dataset is null
                // we will not show its legend
                if (!hasValidPoint) {
                    series.showInLegend = false;
                }
                return series;
            },
            postSeriesAddition: function(HCObj, FCObj, width, height) {
                var HCChartObj = HCObj.chart,
                    FCChartObj = FCObj.chart;
                 HCChartObj.clipBubbles = pluckNumber(FCChartObj.clipbubbles, 1);
                //HCChartObj.hasScroll = pluckNumber(FCChartObj.clipbubbles, 1);
            },
            // Function to create tooltext for individual data points
            getPointStub: function(setObj, value, label, HCObj, dataset, datasetShowValues) {
                var toolText, displayValue, dataLink, HCConfig = HCObj[FC_CONFIG_STRING],
                    formatedVal = value === null ? value : HCConfig.numberFormatter.dataLabels(value),
                    seriesname, tooltipSepChar = HCConfig.tooltipSepChar;

                //create the tooltext
                if (!HCConfig.showTooltip) {
                    toolText = BLANKSTRING;
                }
                // if tooltext is given in data object
                else if (getValidValue(setObj.tooltext) !== undefined) {
                    toolText = parseUnsafeString(setObj.tooltext);
                }
                else {//determine the tooltext then
                    if (formatedVal === null) {
                        toolText = false;
                    } else {
                        if (HCConfig.seriesNameInToolTip) {
                            seriesname = pluck(dataset && dataset.seriesname);
                        }
                        toolText = seriesname ? seriesname + tooltipSepChar : BLANKSTRING;
                        toolText += label ? label + tooltipSepChar : BLANKSTRING;
                        toolText += formatedVal;
                        toolText += setObj.z ? tooltipSepChar + setObj.z : BLANKSTRING;
                    }
                }

                //create the displayvalue
                if (!pluckNumber(setObj.showvalue, datasetShowValues, HCConfig.showValues)) {
                    displayValue = BLANKSTRING;
                }
                else if (pluck(setObj.displayvalue, setObj.name, setObj.label) !== undefined) {
                    displayValue = parseUnsafeString(pluck(setObj.displayvalue, setObj.name, setObj.label));
                }
                else {//determine the dispalay value then
                    displayValue = formatedVal;
                }

                ////create the link
                dataLink = getValidValue(setObj.link);

                return {
                    displayValue: displayValue,
                    toolText: toolText,
                    link: dataLink
                };
            }

        }, chartAPI.scatter);

        chartAPI('ssgrid', {
            friendlyName: "Grid Component",
            standaloneInit: true,
            defaultSeriesType: 'ssgrid',
            rendererId: 'ssgrid',
            chart: function(width, height) {

                var container = this.containerElement,
                    obj = this.dataObj,
                    FCObj = this.chartInstance;
                //clone FC data so that any modiffication on it will not effect the original
                obj = extend2({}, obj);
                //clone the chart obj from graph or blank object
                obj.chart = obj.chart || obj.graph || {};
                delete obj.graph;

                // POINT FUNCTION

                // Declation of variables to be used
                var dataObj,
                    setColor,
                    setAlpha,
                    textStyle,
                    index = 0, itemValue,
                    label, dataArr = [],
                    FCChartObj = obj.chart,
                    data = obj.data,
                    length = data && data.length,
                    SmartLabelManager = this.smartLabel,
                    NumberFormatter = this.numberFormatter,
                    chartHeight = container.offsetHeight,
                    chartWidth = container.offsetWidth,
                    textSizeObj,
                    GParams = {},
                    maxHeight = 0,
                    numItems = 0,
                    fontSize,
                    // palette of the chart
                    paletteIndex = (FCChartObj.palette > 0 && FCChartObj.palette < 6 ?
                    FCChartObj.palette : pluckNumber(this.paletteIndex, 1)) - 1,
                    HCObj = {
                    '_FCconf': {
                        0 : {
                            stack : {}
                        },
                        1 : {
                            stack : {}
                        },
                        x : {
                            stack : {}
                        },
                        noWrap : false,//wrap a text if there has no space in width
                        marginLeftExtraSpace : 0,
                        marginRightExtraSpace : 0,
                        marginBottomExtraSpace : 0,
                        marginTopExtraSpace : 0,
                        marimekkoTotal : 0//total for marimekko charts
                    },
                    chart: {
                        renderTo: container,
                        ignoreHiddenSeries: false,
                        events: {
                        },
                        spacingTop: 0,
                        spacingRight: 0,
                        spacingBottom: 0,
                        spacingLeft: 0,
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        borderRadius: 0,
                        borderColor: '#000000',
                        borderWidth: 1,
                        defaultSeriesType: 'ssgrid',
                        style: {
                            fontFamily: pluck(FCChartObj.basefont, 'Verdana'),
                            fontSize: pluckFontSize(FCChartObj.basefontsize, 20) + PXSTRING,
                            color: pluck(FCChartObj.basefontcolor, defaultPaletteOptions.
                                baseFontColor[paletteIndex]).replace(/^#?([a-f0-9]+)/ig, '#$1')
                        },
                        plotBackgroundColor: COLOR_TRANSPARENT
                    },
                    labels: {
                        smartLabel: SmartLabelManager
                    },
                    

                    colors: ['AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
                        'D64646', '8E468E', '588526', 'B3AA00', '008ED6',
                        '9D080D', 'A186BE', 'CC6600', 'FDC689', 'ABA000',
                        'F26D7D', 'FFF200', '0054A6', 'F7941C', 'CC3300',
                        '006600', '663300', '6DCFF6'],
                    credits: {
                        href: 'http://www.fusioncharts.com?BS=FCHSEvalMark',
                        text: lib.CREDIT_STRING,
                        enabled: this.creditLabel
                    },
                    legend: {
                        enabled: false
                    },
                    series: [],
                    subtitle: {
                        text: BLANKSTRING
                    },
                    title: {
                        text: BLANKSTRING
                    },
                    tooltip: {
                        enabled: false
                    },
                    // DO the exporting module
                    exporting: {
                        buttons: {
                            exportButton: {},
                            printButton: {
                                enabled: false
                            }
                        }
                    }
                },
                conf = HCObj[FC_CONFIG_STRING],
                // Array of default colors (paletteColors)
                // We use it to specify the individual data point color
                defaultColors = HCObj.colors,
                    // Length of the default colors
                    defaultColLen = HCObj.colors.length,
                    //Total sum of values
                    sumOfValues = 0,
                    itemsPerPage = 0,
                    //Height for each data row
                    rowHeight = 0,
                    //Maximum width for value column
                    maxValWidth = 0,
                    //Label width and x position
                    maxLabelWidth = 0,
                    labelX = 0,
                    actualDataLen = 0,
                    HCChartObj,
                    configureObj = FCObj.jsVars.cfgStore;

                HCChartObj = HCObj.chart;

                setLineHeight(HCObj.chart.style);

                //save the FC Linkclick function
                HCChartObj.events.click = this.linkClickFN;

                //toolbar button parameters
                var toolbar = HCChartObj.toolbar = {button: {}},
                    button = toolbar.button,
                    bSymbolPadding,
                    bPosition,
                    bHAlign,
                    bVAlign,
                    vDirection,
                    hDirection;

                button.scale = pluckNumber(FCChartObj.toolbarbuttonscale, 1.15);
                button.width = pluckNumber(FCChartObj.toolbarbuttonwidth, 15);
                button.height = pluckNumber(FCChartObj.toolbarbuttonheight, 15);
                button.radius = pluckNumber(FCChartObj.toolbarbuttonradius, 2);
                button.spacing = pluckNumber(FCChartObj.toolbarbuttonspacing, 5);

                button.fill = convertColor(pluck(FCChartObj.toolbarbuttoncolor, 'ffffff'));
                button.labelFill = convertColor(pluck(FCChartObj.toolbarlabelcolor, 'cccccc'));
                button.symbolFill = convertColor(pluck(FCChartObj.toolbarsymbolcolor, 'ffffff'));
                button.hoverFill = convertColor(pluck(FCChartObj.toolbarbuttonhovercolor, 'ffffff'));
                button.stroke = convertColor(pluck(FCChartObj.toolbarbuttonbordercolor, 'bbbbbb'));
                button.symbolStroke = convertColor(pluck(FCChartObj.toolbarsymbolbordercolor, '9a9a9a'));

                button.strokeWidth = pluckNumber(FCChartObj.toolbarbuttonborderthickness, 1);
                button.symbolStrokeWidth = pluckNumber(FCChartObj.toolbarsymbolborderthickness, 1);
                bSymbolPadding = button.symbolPadding = pluckNumber(FCChartObj.toolbarsymbolpadding, 5);
                button.symbolHPadding = pluckNumber(FCChartObj.toolbarsymbolhpadding, bSymbolPadding);
                button.symbolVPadding = pluckNumber(FCChartObj.toolbarsymbolvpadding, bSymbolPadding);

                bPosition = toolbar.position = pluck(FCChartObj.toolbarposition, 'tr').toLowerCase();
                switch(bPosition) {
                    case "tr":
                    case "tl":
                    case "br":
                    case "bl":
                        break;
                    default:
                        bPosition = "tr";
                }
                bHAlign = toolbar.hAlign = (BLANKSTRING + FCChartObj.toolbarhalign).toLowerCase() === 'left' ? 'l': bPosition.charAt(1);
                bVAlign = toolbar.vAlign = (BLANKSTRING + FCChartObj.toolbarvalign).toLowerCase() === 'bottom' ? 'b' : bPosition.charAt(0);
                hDirection = toolbar.hDirection = pluckNumber(FCChartObj.toolbarhdirection, (bHAlign === 'r' ? -1 : 1));
                vDirection = toolbar.vDirection = pluckNumber(FCChartObj.toolbarvdirection, (bVAlign === 'b' ? -1 : 1));
                toolbar.vMargin = pluckNumber(FCChartObj.toolbarvmargin, 6);
                toolbar.hMargin = pluckNumber(FCChartObj.toolbarhmargin, 10);
                toolbar.x = pluckNumber(FCChartObj.toolbarx, bHAlign === 'l' ? 0: width);
                toolbar.y = pluckNumber(FCChartObj.toolbary, bVAlign === 't' ? 0: height);

                // Full Chart as a hotspot
                if (pluck(FCChartObj.clickurl) !== undefined) {
                    HCChartObj.link = FCChartObj.clickurl;
                    HCChartObj.style.cursor = 'pointer';
                }

                //Now, store all parameters
                //Whether to show percent values?
                GParams.showPercentValues = pluckNumber(configureObj.showpercentvalues, FCChartObj.showpercentvalues, 0);
                //Number of items per page
                GParams.numberItemsPerPage = pluck(configureObj.numberitemsperpage, FCChartObj.numberitemsperpage);
                //Whether to show shadow
                GParams.showShadow = pluckNumber(configureObj.showshadow, FCChartObj.showshadow, 0);
                //Font Properties
                GParams.baseFont = pluck(configureObj.basefont, FCChartObj.basefont, 'Verdana');
                fontSize = pluckFontSize(configureObj.basefontsize, FCChartObj.basefontsize, 10);
                GParams.baseFontSize = fontSize + PXSTRING;
                GParams.baseFontColor = getFirstColor(pluck(configureObj.basefontcolor, FCChartObj.basefontcolor,
                    defaultPaletteOptions.baseFontColor[paletteIndex]));

                //Alternate Row Color
                GParams.alternateRowBgColor = getFirstColor(pluck(configureObj.alternaterowbgcolor, FCChartObj.alternaterowbgcolor,
                    defaultPaletteOptions.altHGridColor[paletteIndex]));
                GParams.alternateRowBgAlpha = pluck(configureObj.alternaterowbgalpha, FCChartObj.alternaterowbgalpha,
                    defaultPaletteOptions.altHGridAlpha[paletteIndex]) + BLANKSTRING;

                //List divider properties
                GParams.listRowDividerThickness = pluckNumber(configureObj.listrowdividerthickness, FCChartObj.listrowdividerthickness, 1);
                GParams.listRowDividerColor = getFirstColor(pluck(configureObj.listrowdividercolor, FCChartObj.listrowdividercolor,
                    defaultPaletteOptions.borderColor[paletteIndex]));
                GParams.listRowDividerAlpha = (pluckNumber(configureObj.listrowdivideralpha, FCChartObj.listrowdivideralpha,
                    defaultPaletteOptions.altHGridAlpha[paletteIndex]) + 15) + BLANKSTRING;

                //Color box properties
                GParams.colorBoxWidth = pluckNumber(configureObj.colorboxwidth, FCChartObj.colorboxwidth, 8);
                GParams.colorBoxHeight = pluckNumber(configureObj.colorboxheight, FCChartObj.colorboxheight, 8);
                //Navigation Properties
                GParams.navButtonRadius = pluckNumber(configureObj.navbuttonradius, FCChartObj.navbuttonradius, 7);
                GParams.navButtonColor = getFirstColor(pluck(configureObj.navbuttoncolor, FCChartObj.navbuttoncolor,
                    defaultPaletteOptions.canvasBorderColor[paletteIndex]));
                GParams.navButtonHoverColor = getFirstColor(pluck(configureObj.navbuttonhovercolor, FCChartObj.navbuttonhovercolor,
                    defaultPaletteOptions.altHGridColor[paletteIndex]));

                //Paddings
                GParams.textVerticalPadding = pluckNumber(configureObj.textverticalpadding, FCChartObj.textverticalpadding, 3);
                GParams.navButtonPadding = pluckNumber(configureObj.navbuttonpadding, FCChartObj.navbuttonpadding, 5);
                GParams.colorBoxPadding = pluckNumber(configureObj.colorboxpadding, FCChartObj.colorboxpadding, 10);
                GParams.valueColumnPadding = pluckNumber(configureObj.valuecolumnpadding, FCChartObj.valuecolumnpadding, 10);
                GParams.nameColumnPadding = pluckNumber(configureObj.namecolumnpadding, FCChartObj.namecolumnpadding, 5);

                GParams.borderThickness = pluckNumber(configureObj.borderthickness, FCChartObj.borderthickness, 1);
                GParams.borderColor = getFirstColor(pluck(configureObj.bordercolor, FCChartObj.bordercolor,
                    defaultPaletteOptions.borderColor[paletteIndex]));
                GParams.borderAlpha = pluck(configureObj.borderalpha, FCChartObj.borderalpha,
                    defaultPaletteOptions.borderAlpha[paletteIndex]) + BLANKSTRING;

                GParams.bgColor = pluck(configureObj.bgcolor, FCChartObj.bgcolor, 'FFFFFF');
                GParams.bgAlpha = pluck(configureObj.bgalpha, FCChartObj.bgalpha, HUNDREDSTRING);
                GParams.bgRatio = pluck(configureObj.bgratio, FCChartObj.bgratio, HUNDREDSTRING);
                GParams.bgAngle = pluck(configureObj.bgangle, FCChartObj.bgangle, ZEROSTRING);

                // Setting the Chart border cosmetics
                // SSGrid shows a round edge in chart border
                // so we use borderThickness / 16 as a radius
                // to show the round edge
                HCChartObj.borderRadius = GParams.borderThickness / 16;
                HCChartObj.borderWidth = GParams.borderThickness;
                HCChartObj.borderColor = toRaphaelColor({
                    FCcolor: {
                        color: GParams.borderColor,
                        alpha: GParams.borderAlpha
                    }
                });

                // Setting the Chart background cosmetics
                HCChartObj.backgroundColor = {
                    FCcolor: {
                        color: GParams.bgColor,
                        alpha: GParams.bgAlpha,
                        ratio: GParams.bgRatio,
                        angle: GParams.bgAngle
                    }
                };

                HCChartObj.borderRadius = pluckNumber(FCChartObj.borderradius, 0);

                // Creating the text style for SSGrid
                textStyle = {
                    fontFamily: GParams.baseFont,
                    fontSize: GParams.baseFontSize,
                    color: GParams.baseFontColor
                };
                setLineHeight(textStyle);
                // setting the style to LabelManagement
                SmartLabelManager.setStyle(textStyle);

                for (index = 0; index < length; index += 1) {
                    dataObj = data[index];
                    itemValue = NumberFormatter.getCleanValue(dataObj.value);
                    label = parseUnsafeString(getFirstValue(dataObj.label, dataObj.name));
                    // Color of the particular data
                    setColor = getFirstColor(pluck(dataObj.color, defaultColors[index % defaultColLen]));
                    // Alpha of the data
                    setAlpha = pluck(dataObj.alpha, FCChartObj.plotfillalpha, HUNDREDSTRING);
                    if (label != BLANKSTRING || itemValue != null) {
                        dataArr.push({
                            value: itemValue,
                            label: label,
                            color: setColor
                        });
                        sumOfValues = sumOfValues + itemValue;
                        actualDataLen += 1;
                    }
                }

                /*
                 * calculates the various points on the chart.
                 */
                //Format all the numbers on the chart and store their display values
                //We format and store here itself, so that later, whenever needed,
                //we just access displayValue instead of formatting once again.
                for (index = 0; index < actualDataLen; index += 1) {
                    dataObj = dataArr[index];
                    itemValue = dataObj.value;
                    //Format and store
                    dataObj.dataLabel = dataObj.label;
                    //Display Value
                    dataObj.displayValue = GParams.showPercentValues ?
                        NumberFormatter.percentValue(itemValue / sumOfValues * 100) :
                        NumberFormatter.dataLabels(itemValue);
                    //Now, we need to iterate through the value fields to get the max width
                    //Simulate
                    textSizeObj = SmartLabelManager.getOriSize(dataObj.displayValue);
                    //Store maximum width
                    maxValWidth = Math.max(maxValWidth, (textSizeObj.width + GParams.valueColumnPadding));
                }


                //Now, there are two different flows from here on w.r.t calculation of height
                //Case 1: If the user has specified his own number of items per page
                if (GParams.numberItemsPerPage) {
                    //In this case, we simply divide the page into the segments chosen by user
                    //If all items are able to fit in this single page
                    if (GParams.numberItemsPerPage >= actualDataLen) {
                        //This height is perfectly alright and we can fit all
                        //items in a single page
                        //Set number items per page to total items.
                        GParams.numberItemsPerPage = actualDataLen;
                        //So, NO need to show the navigation buttons
                        rowHeight = chartHeight / GParams.numberItemsPerPage;
                        //End Index
                        itemsPerPage = actualDataLen;
                    }
                    else {
                        //We need to allot space for the navigation buttons
                        var cHeight = chartHeight;
                        //Deduct the radius and padding of navigation buttons from height
                        cHeight = cHeight - 2 * (GParams.navButtonPadding + GParams.navButtonRadius);
                        //Now, get the maximum possible number of items that we can fit in each page
                        itemsPerPage = GParams.numberItemsPerPage;
                        //Height for each row
                        rowHeight = cHeight / itemsPerPage;

                    }
                } else {
                    //Case 2: If we've to calculate best fit. We already have the maximum height
                    //required by each row of data.
                    //Storage for maximum height
                    //Now, get the height required for any single text field
                    //We do not consider wrapping.
                    //Create text box and get height
                    //textSizeObj = SmartLabelManager.getOriSize("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_=/*-+~`");
                    //Get the max of two
                    maxHeight = parseInt(textStyle.lineHeight, 10);
                    //Add text vertical padding (for both top and bottom)
                    maxHeight = maxHeight + 2 * GParams.textVerticalPadding;
                    //Also compare with color box height - as that's also an integral part
                    maxHeight = Math.max(maxHeight, GParams.colorBoxHeight);
                    //Now that we have the max possible height, we need to calculate the page length.
                    //First check if we can fit all items in a single page
                    numItems = chartHeight / maxHeight;
                    if (numItems >= actualDataLen) {
                        //We can fit all items in one page
                        rowHeight = (chartHeight / actualDataLen);
                        //Navigation buttons are not required.
                        //End Index
                        itemsPerPage = actualDataLen;
                    } else {
                        //We cannot fit all items in same page. So, need to show
                        //navigation buttons. Reserve space for them.
                        //We need to allot space for the navigation buttons
                        cHeight = chartHeight;
                        //Deduct the radius and padding of navigation buttons from height
                        cHeight = cHeight - 2 * (GParams.navButtonPadding + GParams.navButtonRadius);
                        //Now, get the maximum possible number of items that we can fit in each page
                        itemsPerPage = Math.floor(cHeight / maxHeight);
                        //Height for each row
                        rowHeight = cHeight / itemsPerPage;
                    }
                }
                //Now, we calculate the maximum avaiable width for data label column
                maxLabelWidth = chartWidth - GParams.colorBoxPadding -
                    GParams.colorBoxWidth - GParams.nameColumnPadding -
                    maxValWidth - GParams.valueColumnPadding;
                labelX = GParams.colorBoxPadding + GParams.colorBoxWidth + GParams.nameColumnPadding;

                //////////Chart font style////////////////////
                var inCanfontFamily = pluck(FCChartObj.basefont, 'Verdana'),
                inCanfontSize =  pluckFontSize(FCChartObj.basefontsize, 10),
                inCancolor = pluck(FCChartObj.basefontcolor, defaultPaletteOptions[
                    'baseFontColor'][paletteIndex]),
                outCanfontFamily = pluck(FCChartObj.outcnvbasefont, inCanfontFamily),
                fontSize = pluckFontSize(FCChartObj.outcnvbasefontsize, inCanfontSize),
                outCanfontSize = fontSize + PXSTRING,
                outCancolor = pluck(FCChartObj.outcnvbasefontcolor, inCancolor).
                replace(/^#?([a-f0-9]+)/ig, '#$1'),
                outCanLineHeight, inCanLineHeight, axisTitleLineHeight;

                inCanfontSize = inCanfontSize + PXSTRING;
                inCancolor = inCancolor.replace(/^#?([a-f0-9]+)/ig, '#$1');

                //create style for tredn tendtext
                //save it in the hc JSON for ferther refrence
                

                conf.trendStyle = conf.outCanvasStyle = {
                    fontFamily: outCanfontFamily,
                    color: outCancolor,
                    fontSize:  outCanfontSize
                };
                outCanLineHeight = setLineHeight(conf.trendStyle);

                conf.inCanvasStyle = {
                    fontFamily: inCanfontFamily,
                    fontSize:  inCanfontSize,
                    color: inCancolor
                };
                ///tooltip
                HCObj.tooltip.style = {
                    fontFamily: inCanfontFamily,
                    fontSize:  inCanfontSize,
                    lineHeight : inCanLineHeight,
                    color: inCancolor
                };
                HCObj.tooltip.shadow = false;

                // Storing series configuration options in HC Chart object
                HCChartObj.height = chartHeight;
                HCChartObj.width = chartWidth;
                HCChartObj.rowHeight = rowHeight;

                HCChartObj.labelX = labelX;

                HCChartObj.colorBoxWidth = GParams.colorBoxWidth;
                HCChartObj.colorBoxHeight = GParams.colorBoxHeight;
                HCChartObj.colorBoxX = GParams.colorBoxPadding;

                HCChartObj.valueX = GParams.colorBoxPadding + GParams.colorBoxWidth +
                    GParams.nameColumnPadding + maxLabelWidth + GParams.valueColumnPadding;
                HCChartObj.valueColumnPadding = GParams.valueColumnPadding;

                HCChartObj.textStyle = textStyle;


                HCChartObj.listRowDividerAttr = {
                    'stroke-width': GParams.listRowDividerThickness,
                    stroke: {
                        FCcolor: {
                            color: GParams.listRowDividerColor,
                            alpha: GParams.listRowDividerAlpha
                        }
                    }
                };

                HCChartObj.alternateRowColor = {
                    FCcolor: {
                        color: GParams.alternateRowBgColor,
                        alpha: GParams.alternateRowBgAlpha
                    }
                };

                HCChartObj.navButtonRadius = GParams.navButtonRadius;
                HCChartObj.navButtonPadding = GParams.navButtonPadding;
                HCChartObj.navButtonColor = GParams.navButtonColor;
                HCChartObj.navButtonHoverColor = GParams.navButtonHoverColor;

                HCChartObj.lineHeight = parseInt(textStyle.lineHeight, 10);


                // Now, we create render array page wise
                var dataRender = [], pageIndex = 0, smartText, visible = true;
                for (index = 0; index < actualDataLen & itemsPerPage != 0; index += 1) {
                    //Update indexes.
                    if (index % itemsPerPage == 0) {
                        dataRender.push({
                            data: [],
                            visible: visible

                        });
                        visible = false;
                        pageIndex += 1;
                    }
                    dataObj = dataArr[index];

                    smartText = SmartLabelManager.getSmartText(dataObj.dataLabel, maxLabelWidth, rowHeight);
                    dataRender[pageIndex - 1].data.push({
                        label: smartText.text,
                        originalText: smartText.tooltext,
                        displayValue: dataObj.displayValue,
                        y: dataObj.value,
                        color: dataObj.color
                    });
                }
                HCObj.series = dataRender;

                chartAPI.base.parseExportOptions.call(this, HCObj);
                HCObj.tooltip.enabled = !!HCObj.exporting.enabled;

                //call the chart conf function
                return HCObj;
            },
            creditLabel: creditLabel
        }, chartAPI.base);


        /******************************************************************************
         * Raphael Renderer Extension
         ******************************************************************************/
        var renderer = chartAPI;


        /**
         * The renderering definition for bubble series charts.
         * @id TypeAPI['renderer.bubble']
         * @returns TypeAPI
         */
        renderer('renderer.bubble', {
            drawPlotBubble: function (plot, dataOptions) {
                var  chart = this,
                     options = chart.options,
                     chartOptions = options.chart,
                     seriesOptions = options.plotOptions.series,
                     paper = chart.paper,
                     elements = chart.elements,
                     plotItems = plot.items,
                     plotIndex = plot.index,
                     plotItem,
                     datasetGraphics = plot.graphics = (plot.graphics || []),
                     xAxis = chart.xAxis[dataOptions.xAxis || 0],
                     yAxis = chart.yAxis[dataOptions.yAxis || 0],
                     data = plot.data,

                    // tooltip options
                    tooltipOptions = options.tooltip || {},
                    isTooltip = tooltipOptions.enabled !== false,
                    toolText,

                    animationDuration = isNaN(+seriesOptions.animation) &&
                            seriesOptions.animation.duration ||
                            seriesOptions.animation * 1000,

                     seriesVisibility = dataOptions.visible === false ?
                             'hidden': 'visible',

                     bubbleOptions = options.plotOptions.bubble,
                     zMax = bubbleOptions.zMax,
                     bubbleScale = bubbleOptions.bubbleScale,
                     // to have diameter of the largest bubble as 25% of the smaller of the two dimensions of canvas
                     radiusLimit = mathMin(chart.canvasHeight, chart.canvasWidth) / 8,
                     // taking square root of the maximum z-value of all bubbles
                     sqrtMaxZ = mathSqrt(zMax),
                     i,
                     ln,
                     set,
                     setLink,
                     x,
                     y,
                     xPos,
                     yPos,
                     canvasTop = chart.canvasTop,
                     canvasleft = chart.canvasLeft,
                     canvasWidth = chart.canvasWidth,
                     canvasHeight = chart.canvasTop,
                     anchor,
                     setElem,
                     hotElem,
                     trackerElem,
                     layers = chart.layers,
                     datasetLayer = layers.dataset = layers.dataset ||
                            paper.group('dataset-orphan'),
                     dataLabelsLayer = layers.datalabels = layers.datalabels ||
                            paper.group('datalables').insertAfter(datasetLayer),
                     trackerLayer = layers.tracker,

                     group,
                     anchorGroup,
                     sqrtBubbleZ,
                     bubbleRadius,
                     valEle;

                 // create series group
                 group = datasetLayer;
                 anchorGroup = group.bubble = (group.bubble || paper.group('bubble', group));

                 

                 if (chartOptions.clipBubbles && !anchorGroup.attrs['clip-rect']) {
                    anchorGroup.attr({
                        'clip-rect': elements['clip-canvas']
                    });
                 }


                //draw data
                for (i = 0, ln = data.length; i < ln; i += 1) {
                    set = data[i];

                    setElem = hotElem = valEle = null;
                    anchor = set.marker;

                    if (set.y !== null && anchor && anchor.enabled) {
                        setLink = set.link;
                        toolText = set.toolText;

                        x = pluckNumber(set.x, i);
                        y = set.y;

                        yPos = yAxis.getAxisPosition(y);
                        xPos = xAxis.getAxisPosition(x);
                        // taking square root of the z-value of the bubble
                        sqrtBubbleZ = mathSqrt(set.z);
                        // calculating radius with scaling
                        bubbleRadius = mathRound(sqrtBubbleZ * radiusLimit / sqrtMaxZ) * bubbleScale;

                        setElem = paper.circle(xPos, yPos, 0, anchorGroup)
                            .attr({
                            fill: toRaphaelColor(anchor.fillColor),
                            'stroke-width': anchor.lineWidth,
                            stroke: toRaphaelColor(anchor.lineColor),
                            'visibility': seriesVisibility

                        })
                        .animate({
                            r: bubbleRadius || 0
                        }, animationDuration, 'easeOut');

                        if (setLink || isTooltip) {
                            if (bubbleRadius < HTP) {
                                bubbleRadius = HTP;
                            }
                            hotElem = paper.circle(xPos, yPos, bubbleRadius, trackerLayer)
                            .attr({
                                'cursor': setLink ? 'pointer' : '',
                                stroke: TRACKER_FILL,
                                'stroke-width': anchor.lineWidth,
                                'fill': TRACKER_FILL,
                                'ishot': !!setLink,
                                'visibility': seriesVisibility
                            })
                            .tooltip(toolText)
                            .data("link", setLink)
                            .click( function () {
                                var link = this.data("link");
                                link && chart.linkClickFN.call({
                                        link: link
                                    }, chart);
                            });

                        }

                        plotItems[i] = {
                            index: i,
                            x: x,
                            y: y,
                            z: set.z,
                            value: y,
                            graphic: setElem,
                            dataLabel: valEle,
                            tracker: hotElem
                        };

                        valEle = chart.drawPlotLineLabel(plot, dataOptions, i,
                            xPos, yPos);

                    } else {
                        plotItems[i] = {
                            index: i,
                            x: x,
                            y: y
                        };
                    }

                    valEle && datasetGraphics.push(valEle);
                    setElem && datasetGraphics.push(setElem);
                    hotElem && datasetGraphics.push(hotElem);

                }

                plot.visible = (dataOptions.visible !== false);

                return plot;
             }


        }, renderer['renderer.cartesian']);

        /**
         * The renderering definition for SSGrid series charts.
         * @id TypeAPI['renderer.ssgrid']
         * @returns TypeAPI
         */
        renderer('renderer.ssgrid', {
            drawGraph: function() {
                var chart = this,
                    options = chart.options,
                    datasets = options.series,
                    elements = chart.elements,
                    plots = elements.plots,
                    paper = chart.paper,
                    l = datasets.length,
                    plot,
                    i;

                if (!plots) {
                    plots = chart.plots = (chart.plots || []);
                    

                    elements.plots = plots;
                }

                chart.drawSSGridNavButton();

                for (i = 0; i < l; i++) {
                    if (!(plot = plots[i])) {
                        plots.push(plot = {
                            items: [],
                            data: datasets[i].data
                        });
                    }
                    datasets[i].data && datasets[i].data.length &&
                            chart.drawPlot(plot, datasets[i]);
                }

                (l > 1) && chart.nenagitePage(0);
            },
            drawPlot: function(plot, dataOptions) {
                var chart = this,
                    series = {},
                    plotData = plot.data,
                    options = chart.options,
                    paper = chart.paper,
                    chartOptions = options.chart,
                    // Color Box drawing properties
                    colorBoxHeight = chartOptions.colorBoxHeight,
                    colorBoxWidth = chartOptions.colorBoxWidth,
                    colorBoxX = chartOptions.colorBoxX,
                    // Label drawing properties
                    labelX = chartOptions.labelX,
                    valueX = chartOptions.valueX,
                    rowHeight = chartOptions.rowHeight,
                    width = chartOptions.width,
                    elements = chart.elements,
                    listRowDividerAttr = chartOptions.listRowDividerAttr,
                    listRowDividerWidth = listRowDividerAttr['stroke-width'],
                    listRowDividerColor = toRaphaelColor(listRowDividerAttr.stroke),
                    halfW = (listRowDividerWidth % 2 / 2),
                    textStyle = chartOptions.textStyle,
                    layers = chart.layers,
                    datasetLayer = layers.dataset = layers.dataset ||
                            paper.group('dataset-orphan'),
                    group = datasetLayer,
                    alternateRowColor = toRaphaelColor(chartOptions.alternateRowColor),
                    plotItems = plot.items,
                    xPos = 0,
                    yPos = 0,
                    plotItem,
                    crispY,
                    labelTextEle,
                    valueTextEle,
                    listRowDivideElem,
                    alternateRowElem,
                    colorBoxElem,
                    set,
                    val,
                    displayValue,
                    sliced,
                    len,
                    i;

                // Spare the world if no data has been sent
                if (!(plotData && plotData.length)) {
                    plotData = [];
                }

                listRowDividerAttr = {
                    stroke: listRowDividerColor,
                    'stroke-width': listRowDividerWidth
                }

                for (i = 0, len = plotData.length; i < len; i += 1) {
                    set = plotData[i];
                    val = set.y;
                    displayValue = set.displayValue,
                    sliced = set.sliced;

                    plotItem = plotItems[i] = {
                        index: i,
                        value: val,
                        graphic: null,
                        dataLabel: null,
                        dataValue: null,
                        alternateRow: null,
                        listRowDivider: null,
                        hot: null
                    };

                    if (val === null || val === undefined) {
                        continue;
                    }

                    if(i % 2 === 0) {
                        alternateRowElem = plotItem.alternateRow = paper.rect(xPos, yPos, width, rowHeight, 0, group)
                        .attr({
                            fill: alternateRowColor,
                            'stroke-width': 0
                        });
                    }

                    crispY = mathRound(yPos) + halfW;
                    listRowDivideElem = plotItem.listRowDivider = paper.path([M, xPos, crispY, L, width, crispY], group)
                    .attr(listRowDividerAttr);

                    // Draw the color BOX
                    colorBoxElem = plotItem.graphic = paper.rect(colorBoxX, yPos + (rowHeight / 2) - (colorBoxHeight / 2),
                        colorBoxWidth, colorBoxHeight, 0, group)
                    .attr({
                        fill : set.color,
                        'stroke-width': 0,
                        stroke: '#000000'
                    });

                    // Draw label text
                    labelTextEle = plotItem.dataLabel = paper.text()
                    .attr({
                        text: set.label,
                        title: (set.originalText || ''),
                        x: labelX,
                        y: (yPos + (rowHeight / 2)),
                        fill: textStyle.color,
                        'text-anchor': POSITION_START // start, middle, end
                    })
                    .css(textStyle);
                    group.appendChild(labelTextEle);

                    // Draw label text
                    valueTextEle = plotItem.dataValue = paper.text()
                    .attr({
                        text: set.displayValue,
                        title: (set.originalText || ''),
                        x: valueX,
                        y: (yPos + (rowHeight / 2)),
                        fill: textStyle.color,
                        'text-anchor': POSITION_START // start, middle, end
                    })
                    .css(textStyle)
                    group.appendChild(valueTextEle);

                    yPos += rowHeight;
                }
                crispY = mathRound(yPos) + halfW;
                listRowDivideElem = paper.path([M, xPos, crispY, L, width, crispY], group)
                .attr(listRowDividerAttr);
            },
            drawSSGridNavButton: function (chart) {
                var chart = this,
                //paper = chart.paper,
                paper = chart.paper,
                options = chart.options,
                chartOptions = options.chart,
                datasets = options.series,
                width = chartOptions.width,
                // Navigation button drawing properties
                navButtonColor = chartOptions.navButtonColor,
                navButtonHoverColor = chartOptions.navButtonHoverColor,
                navButtonPadding = chartOptions.navButtonPadding,
                navButtonRadius = chartOptions.navButtonRadius,
                radius = navButtonRadius,
                radiusFregment = radius * 0.67,
                pageHeight = datasets && datasets[0].data &&
                    datasets[0].data.length * chartOptions.rowHeight,
                y = navButtonPadding + radiusFregment + pageHeight + radius * 0.5,
                x = 20,
                nextEleX = width-x,
                navElePrv,
                navEleNxt,
                navElePrvGroup,
                navEleNxtGroup,
                navTrackerPrv,
                navTrackerNxt;

                if (datasets.length > 1) {
                    //create the nevagitor group
                    var naviigatorGroup = chart.naviigator = paper.group('navigation');

                    chart.navElePrv = navElePrvGroup = paper.group(naviigatorGroup);

                    //DRAW THE ARROW
                    navElePrv = paper.path([
                        M, x, y,
                        L, x + radius + radiusFregment, y - radiusFregment,
                        x + radius, y,
                        x + radius + radiusFregment, y + radiusFregment, 'Z'
                        ])
                    .attr({
                        fill: navButtonColor,
                        'stroke-width': 0,
                        cursor: 'pointer'
                    });
                    //group.appendChild(alternateRowElem);
                    navElePrvGroup.appendChild(navElePrv);

                    // draw the click circle
                    navTrackerPrv = paper.circle(x+radius, y, radius)
                    .attr({
                        fill: COLOR_TRANSPARENT,
                        'stroke-width': 0,
                        cursor: 'pointer'
                    })
                    .mouseover(function() {
                        navElePrv.attr({
                            fill: navButtonHoverColor,
                            cursor: 'pointer'
                        });
                    }).mouseout(function() {
                        navElePrv.attr({
                            fill: navButtonColor
                        });
                    }).click(function() {
                        chart.nenagitePage(-1);
                    });
                    navElePrvGroup.appendChild(navTrackerPrv);


                    chart.navEleNxt = navEleNxtGroup = paper.group(naviigatorGroup);
                    //DRAW THE ARROW
                    navEleNxt = paper.path([
                        M, nextEleX, y,
                        L, nextEleX - radius - radiusFregment, y - radiusFregment,
                        nextEleX - radius, y,
                        nextEleX - radius - radiusFregment, y + radiusFregment, 'Z'
                        ])
                    .attr({
                        fill: navButtonColor,
                        'stroke-width': 0,
                        cursor: 'pointer'
                    });
                    navEleNxtGroup.appendChild(navEleNxt)


                    // draw the click circle
                    navTrackerNxt = paper.circle(nextEleX - radius, y, radius)
                    .attr({
                        fill: COLOR_TRANSPARENT,
                        'stroke-width': 0,
                        cursor: 'pointer'
                    })
                    .mouseover(function() {
                        navEleNxt.attr({
                            fill: navButtonHoverColor
                        });
                    }).mouseout(function() {
                        navEleNxt.attr({
                            fill: navButtonColor
                        });
                    }).click(function() {
                        chart.nenagitePage(1);
                    });
                    navEleNxtGroup.appendChild(navTrackerNxt);

                }

                //draw the border
            },
            nenagitePage: function (val) {
                val = val || 0;
                var chart = this,
                    currentIndex = chart.currentSeriesIndex || 0,
                    plots = chart.plots,
                    noOfSeries = plots.length,
                    wouldBeIndex = (currentIndex + val),
                    i;

                if (plots[wouldBeIndex]) {
                    i = noOfSeries;
                    while (i--) {
                        each(plots[i].items, function (item) {
                            item.graphic && item.graphic.hide();
                            item.dataLabel && item.dataLabel.hide();
                            item.dataValue && item.dataValue.hide();
                            item.alternateRow && item.alternateRow.hide();
                            item.listRowDivider && item.listRowDivider.hide();
                        });
                    }

                    each(plots[wouldBeIndex].items, function (item) {
                        item.graphic && item.graphic.show();
                        item.dataLabel && item.dataLabel.show();
                        item.dataValue && item.dataValue.show();
                        item.alternateRow && item.alternateRow.show();
                        item.listRowDivider && item.listRowDivider.show();
                    });

                    chart.currentSeriesIndex = wouldBeIndex;

                    if (wouldBeIndex === 0) {
                        chart.navElePrv.hide();
                    }
                    else {
                        chart.navElePrv.show();
                    }
                    if (wouldBeIndex === noOfSeries - 1) {
                        chart.navEleNxt.hide();
                    }else {
                        chart.navEleNxt.show();
                    }
                }
            }
        }, renderer['renderer.root']);

        /**
        * Loop up the node tree and add offsetWidth and offsetHeight to get the
        * total page offset for a given element. Used by Opera and iOS on hover and
        * all browsers on point click.
        *
        * @param {Object} el
        *
        */
        function getPosition (el) {
            var p = {
                left: el.offsetLeft,
                top: el.offsetTop
            };
            el = el.offsetParent;
            while (el) {
                p.left += el.offsetLeft;
                p.top += el.offsetTop;
                if (el !== doc.body && el !== doc.documentElement) {
                    p.left -= el.scrollLeft;
                    p.top -= el.scrollTop;
                }
                el = el.offsetParent;
            }
            return p;
        }

        function map (arr, fn) {
             //return jQuery.map(arr, fn);
             var results = [],
                 i = 0,
                 len = arr.length;

             for (; i < len; i++) {
                 results[i] = fn.call(arr[i], arr[i], i, arr);
             }
             return results;
         }

        /* Helper function */
        function normalizeAngle (angle) {
            angle = (angle || 0) % pi2;
            return angle < 0 ? pi2 + angle : angle;
        }

        function getFrontOuterIndex (endAngle, startAngle) {
            return endAngle <= pi ? endAngle : (startAngle <= pi ? startAngle :
                                    (startAngle > endAngle ? 0 : startAngle));
        }

        function getAbsScaleAngle (start, end) {
            return (start > end ? pi2 : 0) + end - start;
        }

        function getClickArcTangent (x, y, center, ref, pieYScale) {
           return mathATan2((y - center[1] - ref.top) / pieYScale, x - center[0] -
                                                                        ref.left);
        };

        // Pie 3D point class
        function pie3DManager (x, y, r, innerR, radiusYFactor, depth, seriesGroup,
                                            renderer, hasOnePoint, use3DLighting) {
            var arc1, arc2, arc3, arc4, arc5, arc6, arc7, arc8;

            if (isObject(x)) {
                y = x.y;
                r = x.r;
                innerR = x.innerR;
                radiusYFactor = x.radiusYFactor;
                depth = x.depth;
                seriesGroup = x.seriesGroup;
                renderer = x.renderer;
                x = x.x;
            }

            //set default value
            if (radiusYFactor < 0 || radiusYFactor >= 1){
                radiusYFactor = 0.6;
            }
            x = x || 0;
            y = y || 0;
            r = r || 1;
            innerR = innerR || 0;
            depth = depth || 0;

            //add the values to the instance
            this.renderer = renderer;
            this.hasOnePoint = hasOnePoint;
            this.use3DLighting = use3DLighting;
            this.cx = x;
            this.cy = y;
            this.rx = r;
            this.ry = r * radiusYFactor;
            this.radiusYFactor = radiusYFactor;
            this.isDoughnut = innerR > 0;
            this.innerRx = innerR;
            this.innerRy = innerR * radiusYFactor;
            this.depth = depth;
            this.leftX = x - r;
            this.rightX = x + r;
            this.leftInnerX = x - innerR;
            this.rightInnerX = x + innerR;
            this.depthY = y + depth;
            this.topY = y - this.ry;
            this.bottomY = this.depthY + this.ry;
            //create required groups
            

            this.bottomBorderGroup = renderer.group('bottom-border', seriesGroup)
                        .attr({
                            transform: 't0,' + depth
                        });
            this.outerBackGroup = renderer.group('outer-back-Side', seriesGroup),
            this.slicingWallsBackGroup = renderer.group('slicingWalls-back-Side',
                                                                    seriesGroup),
            this.innerBackGroup = renderer.group('inner-back-Side', seriesGroup),
            this.innerFrontGroup = renderer.group('inner-front-Side', seriesGroup),
            this.slicingWallsFrontGroup = renderer.group('slicingWalls-front-Side',
                                                                    seriesGroup),
            this.topGroup = renderer.group('top-Side', seriesGroup);

            //few reusable code
            this.moveCmdArr = [M];
            this.lineCmdArr = [L];
            this.closeCmdArr = [Z];
            this.centerPoint = [x, y];
            this.leftPoint = [this.leftX, y];
            this.topPoint = [x, this.topY];
            this.rightPoint = [this.rightX, y];
            this.bottomPoint = [x, y + this.ry];
            this.leftDepthPoint = [this.leftX, this.depthY];
            this.rightDepthPoint = [this.rightX, this.depthY];
            this.leftInnerPoint = [this.leftInnerX, y];
            this.rightInnerPoint = [this.rightInnerX, y];
            this.leftInnerDepthPoint = [this.leftInnerX, this.depthY];
            this.rightInnerDepthPoint = [this.rightInnerX, this.depthY];
            this.pointElemStore = [];
            this.slicingWallsArr = [];
            arc1 = [A, this.rx, this.ry, 0, 0, 1, this.rightX, y];
            arc2 = [A, this.rx, this.ry, 0, 0, 1, this.leftX, y];
            arc3 = [A, this.rx, this.ry, 0, 0, 0, this.rightX, this.depthY];
            arc4 = [A, this.rx, this.ry, 0, 0, 0, this.leftX, this.depthY];
            arc5 = [A, this.innerRx, this.innerRy, 0, 0, 0, this.rightInnerX, y];
            arc6 = [A, this.innerRx, this.innerRy, 0, 0, 0, this.leftInnerX, y];
            arc7 = [A, this.innerRx, this.innerRy, 0, 0, 1, this.rightInnerX,
                                                                    this.depthY];
            arc8 = [A, this.innerRx, this.innerRy, 0, 0, 1, this.leftInnerX,
                                                                    this.depthY];

            if (this.isDoughnut) {
                this.topBorderPath = this.moveCmdArr.concat(this.leftPoint, arc1,
                         arc2, this.moveCmdArr, this.leftInnerPoint, arc5, arc6);
                this.topPath = this.moveCmdArr.concat(this.leftPoint, arc1, arc2,
                               this.lineCmdArr, this.leftInnerPoint, arc5, arc6,
                               this.closeCmdArr);
                this.innerFrontPath = this.moveCmdArr.concat(this.leftInnerPoint,
                                      arc5, this.lineCmdArr, this.rightInnerDepthPoint,
                                      arc8, this.closeCmdArr)
                this.innerBackPath = this.moveCmdArr.concat(this.rightInnerPoint,
                                     arc6, this.lineCmdArr, this.leftInnerDepthPoint,
                                     arc7, this.closeCmdArr)
        }
            else {
                this.topPath = this.moveCmdArr.concat(this.leftPoint, arc1, arc2,
                                                                this.closeCmdArr);
                this.topBorderPath = this.topPath;
            }

            this.outerBackPath = this.moveCmdArr.concat(this.leftPoint, arc1,
                    this.lineCmdArr, this.rightDepthPoint, arc4, this.closeCmdArr);
            this.outerFrontPath = this.moveCmdArr.concat(this.rightPoint, arc2,
                    this.lineCmdArr, this.leftDepthPoint, arc3, this.closeCmdArr);
            this.clipPathforOuter = [M, this.leftX, this.topY, L, this.rightX, this.topY,
                        this.rightX, this.bottomY, this.leftX, this.bottomY, Z];
            this.clipPathforInner = [M, this.leftInnerX, this.topY, L, this.rightInnerX,
                        this.topY, this.rightInnerX, this.bottomY, this.leftInnerX,
                        this.bottomY, Z];
            this.clipPathforNoClip = [M, this.leftInnerX, this.topY, L, this.leftInnerX,
                                                                    this.bottomY, Z];


        }

        pie3DManager.prototype = {
            getArcPath : function (cX, cY, startX, startY, endX, endY, rX, rY, isClockWise, isLargeArc) {
                return (startX == endX && startY == endY) ? [] : [A, rX, rY, 0, isLargeArc, isClockWise, endX, endY];

            },
            parseColor : function (color, alpha) {
                var dark1,
                    dark2,
                    dark3,
                    dark4,
                    dark5,
                    dark6,
                    light1,
                    light2,
                    light3,
                    light4,
                    light5,
                    light6,
                    alpha1 = alpha / 2,
                    colorStr1,
                    colorStr2,
                    alphaStr1,
                    alphaStr2,
                    alphaStr3,
                    colorStr3,
                    colorStr4,
                    colorStr5,
                    topColor,
                    alphaFactor = 3;

                if (this.use3DLighting) {
                    dark1 = getDarkColor(color, 80);
                    dark2 = getDarkColor(color, 75);
                    light1 = getLightColor(color, 85);
                    light2 = getLightColor(color, 70);
                    light3 = getLightColor(color, 40);

                    light4 = getLightColor(color, 50);
                    light5 = getLightColor(color, 30);
                    light6 = getLightColor(color, 65);
                    dark3 = getDarkColor(color, 85);
                    dark4 = getDarkColor(color, 69);
                    dark5 = getDarkColor(color, 75);
                    dark6 = getDarkColor(color, 95);
                }
                else {
                    alphaFactor = 10;
                    dark1 = getDarkColor(color, 90);
                    dark2 = getDarkColor(color, 87);
                    light1 = getLightColor(color, 93);
                    light2 = getLightColor(color, 87);
                    light3 = getLightColor(color, 80);

                    light6 = light4 = getLightColor(color, 85);
                    light5 = getLightColor(color, 80);
                    dark6 = dark3 = getDarkColor(color, 85);
                    dark4 = getDarkColor(color, 75);
                    dark5 = getDarkColor(color, 80);
                }
                colorStr1 = dark2 + COMMASTRING + light1 + COMMASTRING + light2 +
                                      COMMASTRING + light1 + COMMASTRING + dark2;
                alphaStr1 = alpha + COMMASTRING + alpha + COMMASTRING + alpha +
                                        COMMASTRING + alpha + COMMASTRING + alpha;
                colorStr2 = dark2 + COMMASTRING + color + COMMASTRING + light1 +
                                      COMMASTRING + color + COMMASTRING + dark2;
                alphaStr2 = alpha1 + COMMASTRING + alpha1 + COMMASTRING + alpha1 +
                                     COMMASTRING + alpha1 + COMMASTRING + alpha1;
                colorStr3 = dark2 + COMMASTRING + color + COMMASTRING + light3 +
                                       COMMASTRING + color + COMMASTRING + dark2;

               colorStr4 = dark5 + COMMASTRING + light1 + COMMASTRING + light4 +
                                      COMMASTRING + light1 + COMMASTRING + dark4;

               colorStr5 = 'FFFFFF' + COMMASTRING + 'FFFFFF' + COMMASTRING + 'FFFFFF' +
                                      COMMASTRING + 'FFFFFF' + COMMASTRING + 'FFFFFF';
               alphaStr3 = 0 + COMMASTRING + alpha1/alphaFactor + COMMASTRING + alpha/alphaFactor +
                                     COMMASTRING + alpha1/alphaFactor + COMMASTRING + 0;

                if (hasSVG) {
                    topColor = {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            radialGradient : true,
                            cx : this.cx,
                            cy : this.cy,
                            r : this.rx,
                            fx : this.cx - 0.3 * this.rx,
                            fy : this.cy + this.ry * 1.2,
                            color : light6 + COMMASTRING + dark6,
                            alpha : alpha + COMMASTRING + alpha,
                            ratio : '0,100'
                        }
                    };
                }
                else {
                    topColor = {
                        FCcolor : {
                            gradientUnits : 'objectBoundingBox',
                            color : light2 + COMMASTRING + light2 + COMMASTRING + light1 + COMMASTRING + dark2,
                            alpha : alpha + COMMASTRING + alpha + COMMASTRING + alpha + COMMASTRING + alpha,
                            angle : -72,
                            ratio : '0,8,15,77'
                        }
                    };
                }

                return {
                    frontOuter : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftX,
                            y1 : 0,
                            x2 : this.rightX,
                            y2 : 0,
                            color : colorStr4,
                            alpha : alphaStr1,
                            angle : 0,
                            ratio : '0,20,15,15,50'
                        }
                    },
                    backOuter : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftX,
                            y1 : 0,
                            x2 : this.rightX,
                            y2 : 0,
                            color : colorStr3,
                            alpha : alphaStr2,
                            angle : 0,
                            ratio : '0,62,8,8,22'
                        }
                    },
                    frontInner : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftInnerX,
                            y1 : 0,
                            x2 : this.rightInnerX,
                            y2 : 0,
                            color : colorStr2,
                            alpha : alphaStr2,
                            angle : 0,
                            ratio : '0,25,5,5,65'
                        }
                    },
                    backInner : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftInnerX,
                            y1 : 0,
                            x2 : this.rightInnerX,
                            y2 : 0,
                            color : colorStr1,
                            alpha : alphaStr1,
                            angle : 0,
                            ratio : '0,62,8,8,22'
                        }
                    },
                    topBorder : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftX,
                            y1 : 0,
                            x2 : this.rightX,
                            y2 : 0,
                            color : colorStr5,
                            alpha : alphaStr3,
                            angle : 0,
                            ratio : '0,20,15,15,50'
                        }
                    },
                    topInnerBorder : {
                        FCcolor : {
                            gradientUnits : 'userSpaceOnUse',
                            x1 : this.leftInnerX,
                            y1 : 0,
                            x2 : this.rightInnerX,
                            y2 : 0,
                            color : colorStr5,
                            alpha : alphaStr3,
                            angle : 0,
                            ratio : '0,50,15,15,20'
                        }
                    },
                    top : topColor,
                    bottom :  toRaphaelColor(convertColor(color, alpha1)),
                    

                    startSlice : toRaphaelColor(convertColor(dark1, alpha)),
                    endSlice : toRaphaelColor(convertColor(dark1, alpha))
                };

            },

            rotate : function (angle) {
                if (!this.hasOnePoint) {
                    var pointElemStore = this.pointElemStore,
                    x = 0, ln = pointElemStore.length, point, confObject;
                    for (; x < ln; x += 1) {
                        point = pointElemStore[x];
                        confObject = point._confObject;
                        confObject.start += angle;
                        confObject.end += angle;
                        this.updateSliceConf(confObject);
                    }
                    this.refreshDrawing();
                }
            },

            refreshDrawing : (function () {
                var getStartIndex = function (array) {
                    var l,
                        i,
                        lastPos,
                        startIndex = array[0] && array[0]._conf.index,
                        currentPos,
                        index;

                    lastPos = startIndex <= pi;
                    for (i = 1, l = array.length; i < l; i += 1) {
                        index = array[i]._conf.index;
                        currentPos = index <= pi;
                        if (currentPos != lastPos || index < startIndex) {
                            return i;
                        }
                    }
                    return 0;

                };

                return function () {
                    var slicingWallsArr = this.slicingWallsArr,
                        x = 0,
                        sWall,
                        ln = slicingWallsArr.length,
                        startIndex,
                        lastElem2,
                        lastElem3,
                        index,
                        frontGroup = this.slicingWallsFrontGroup,
                        backGroup =  this.slicingWallsBackGroup;

                    startIndex = getStartIndex(slicingWallsArr);

                    for (; x < ln; x += 1, startIndex += 1) {
                        if (startIndex === ln) {
                            startIndex = 0;
                        }
                        sWall = slicingWallsArr[startIndex], index = sWall._conf.index;
                        if (index < piBy2) {

                            frontGroup.appendChild(sWall);
                        }
                        else if (index <= pi) {
                            if (lastElem2) {
                                sWall.insertBefore(lastElem2);
                            }
                            else {
                                frontGroup.appendChild(sWall);
                            }
                            lastElem2 = sWall;
                        }
                        else if (index < pi3By2) {
                            if (lastElem3) {
                                sWall.insertBefore(lastElem3);
                            }
                            else {
                                backGroup.appendChild(sWall);
                            }
                            lastElem3 = sWall;
                        }
                        else{
                            backGroup.appendChild(sWall);
                        }
                    }
                };
            })(),

            updateSliceConf : function (pointConf, doNotApply) {
                var pie3DManager = this,
                    getArcPath = pie3DManager.getArcPath,
                    startOri = pointConf.start, endOri = pointConf.end,
                    start = normalizeAngle(startOri), end = normalizeAngle(endOri),
                    scaleAngle,
                    startCos, startSin, endCos, endSin, startOuterX, startOuterY,
                    startOuterTopClipX, startOuterTopClipY, endOuterTopClipX, endOuterTopClipY,
                    startInnerX, startInnerY, endInnerX, endInnerY, startInnerY1, endInnerY1,
                    borderThickness = 1,

                    cx = this.cx,
                    cy = this.cy,
                    rx = this.rx,
                    ry = this.ry,
                    topCliprx = rx + (hasSVG ? -borderThickness : 2),
                    topClipry = ry + (hasSVG ? -borderThickness : 2),
                    innerRx = this.innerRx,
                    innerRy = this.innerRy,
                    depth = this.depth,
                    depthY = this.depthY,
                    renderer = this.renderer,
                    elements = pointConf.elements,
                    startOuterY1, endOuterX, endOuterY, endOuterY1;

                startCos = mathCos(start);
                startSin = mathSin(start);
                endCos = mathCos(end);
                endSin = mathSin(end);

                startOuterX = cx + (rx * startCos);
                startOuterY = cy + (ry * startSin);
                startOuterTopClipX = cx + (topCliprx * startCos);
                startOuterTopClipY = cy + (topClipry * startSin);
                startOuterY1 = startOuterY + depth;
                endOuterX = cx + (rx * endCos);
                endOuterY = cy + (ry * endSin);
                endOuterTopClipX = cx + (topCliprx * endCos);
                endOuterTopClipY = cy + (topClipry * endSin);
                endOuterY1 = endOuterY + depth;

                if (this.isDoughnut) {//doughnut like slice
                    startInnerX = cx + (innerRx * startCos);
                    startInnerY = cy + (innerRy * startSin);
                    startInnerY1 = startInnerY + depth;
                    endInnerX = cx + (innerRx * endCos);
                    endInnerY = cy + (innerRy * endSin);
                    endInnerY1 = endInnerY + depth;
                    pointConf.startSlice = [M, startOuterX, startOuterY, L, startOuterX, startOuterY1, startInnerX, startInnerY1, startInnerX, startInnerY, Z];
                    pointConf.endSlice = [M, endOuterX, endOuterY, L, endOuterX, endOuterY1, endInnerX, endInnerY1, endInnerX, endInnerY, Z];
                }
                else {
                    pointConf.startSlice = [M, startOuterX, startOuterY, L, startOuterX, startOuterY1, cx, depthY, cx, cy, Z];
                    pointConf.endSlice = [M, endOuterX, endOuterY, L, endOuterX, endOuterY1, cx, depthY, cx, cy, Z];
                }

                if (hasSVG) {
                    scaleAngle = getAbsScaleAngle (start, end);
                    //create the clip for top and bottom
                    if (!this.isDoughnut) {
                        pointConf.clipTopPath = [M, startOuterX, startOuterY,
                                                 A, rx, ry, 0, (scaleAngle > pi ? 1 : 0), 1, endOuterX, endOuterY,
                                                 L, this.cx, this.cy,
                                                 Z];
                    }
                    else {
                        pointConf.clipTopPath = [M, startOuterX, startOuterY,
                                                 A, rx, ry, 0, (scaleAngle > pi ? 1 : 0), 1, endOuterX, endOuterY,
                                                 L, endInnerX, endInnerY,
                                                 A, innerRx, innerRy, 0, (scaleAngle > pi ? 1 : 0), 0, startInnerX, startInnerY,
                                                 Z];
                    }

                    pointConf.clipOuterFrontPath1 = this.clipPathforNoClip;

                    pointConf.clipTopBorderPath = [M, startOuterTopClipX, startOuterTopClipY,
                                                   A, topCliprx, topClipry, 0, (scaleAngle > pi ? 1 : 0), 1, endOuterTopClipX, endOuterTopClipY,
                                                   L, endOuterX, endOuterY, endOuterX, endOuterY + borderThickness,
                                                   A, rx, ry, 0, (scaleAngle > pi ? 1 : 0), 0, startOuterX, startOuterY + borderThickness,
                                                   L, startOuterX, startOuterY, Z];

                    if (startOri != endOri) {
                        if(start > end) {//crossed the 0 deg line
                            if (start < pi){//crossed the 180 deg line also
                                pointConf.clipOuterFrontPath = [M, this.rightX, cy,
                                                                A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                                V, depth,
                                                                A, rx, ry, 0, 0, 0, this.rightX, cy + depth,
                                                                Z];
                                pointConf.clipOuterFrontPath1 = [M, this.leftX, cy,
                                                                 A, rx, ry, 0, 0, 0, startOuterX, startOuterY,
                                                                 V, depth,
                                                                 A, rx, ry, 0, 0, 1, this.leftX, cy + depth,
                                                                 Z];
                                pointConf.clipOuterBackPath = [M, this.rightX, cy,
                                                               A, rx, ry, 0, 1, 0, this.leftX, cy,
                                                               V, depth,
                                                               A, rx, ry, 0, 1, 1, this.rightX, cy + depth,
                                                               Z];
                                if (this.isDoughnut) {
                                    pointConf.clipInnerBackPath = [M, this.rightInnerX, cy,
                                                                   A, innerRx, innerRy, 0, 1, 0, this.leftInnerX, cy,
                                                                   V, depth,
                                                                   A, innerRx, innerRy, 0, 1, 1, this.rightInnerX, cy + depth,
                                                                   Z];

                                    pointConf.clipInnerFrontPath = [M, this.rightInnerX, cy,
                                                                    A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                                    V, depth,
                                                                    A, innerRx, innerRy, 0, 0, 0, this.rightInnerX, cy + depth,
                                                                    Z,
                                                                    M, this.leftInnerX, cy,
                                                                    A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY,
                                                                    V, depth,
                                                                    A, innerRx, innerRy, 0, 0, 1, this.leftInnerX, cy + depth,
                                                                    Z];

                                }
                            }
                            else if( end > pi) {//crossed the 180 deg line also
                                pointConf.clipOuterFrontPath = [M, this.rightX, cy,
                                                                A, rx, ry, 0, 1, 1, this.leftX, cy,
                                                                V, depth,
                                                                A, rx, ry, 0, 1, 0, this.rightX, cy + depth,
                                                                Z];
                                pointConf.clipOuterBackPath = [M, this.leftX, cy,
                                                               A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                               V, depth,
                                                               A, rx, ry, 0, 0, 0, this.leftX, cy + depth,
                                                               Z,
                                                               M, this.rightX, cy,
                                                               A, rx, ry, 0, 0, 0, startOuterX, startOuterY,
                                                               V, depth,
                                                               A, rx, ry, 0, 0, 1, this.rightX, cy + depth,
                                                               Z];
                                if (this.isDoughnut) {

                                    pointConf.clipInnerFrontPath = [M, this.rightInnerX, cy,
                                                                    A, innerRx, innerRy, 0, 1, 1, this.leftInnerX, cy,
                                                                    V, depth,
                                                                    A, innerRx, innerRy, 0, 1, 0, this.rightInnerX, cy + depth,
                                                                    Z];

                                    pointConf.clipInnerBackPath = [M, this.leftInnerX, cy,
                                                                   A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                                   V, depth,
                                                                   A, innerRx, innerRy, 0, 0, 0, this.leftInnerX, cy + depth,
                                                                   Z,
                                                                   M, this.rightInnerX, cy,
                                                                   A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY,
                                                                   V, depth,
                                                                   A, innerRx, innerRy, 0, 0, 1, this.rightInnerX, cy + depth,
                                                                   Z];
                                }
                            }
                            else {
                                pointConf.clipOuterFrontPath = [M, this.rightX, cy,
                                                                A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                                V, depth,
                                                                A, rx, ry, 0, 0, 0, this.rightX, cy + depth,
                                                                Z];
                                pointConf.clipOuterBackPath = [M, startOuterX, startOuterY,
                                                               A, rx, ry, 0, 0, 1, this.rightX, cy,
                                                               V, depth,
                                                               A, rx, ry, 0, 0, 0, startOuterX, startOuterY1,
                                                               Z];
                                if (this.isDoughnut) {

                                    pointConf.clipInnerFrontPath = [M, this.rightInnerX, cy,
                                                                    A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                                    V, depth,
                                                                    A, innerRx, innerRy, 0, 0, 0, this.rightInnerX, cy + depth,
                                                                    Z];

                                    pointConf.clipInnerBackPath = [M, startInnerX, startInnerY,
                                                                   A, innerRx, innerRy, 0, 0, 1, this.rightInnerX, cy,
                                                                   V, depth,
                                                                   A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY1,
                                                                   Z];
                                }
                            }
                        }
                        else if (start < pi){
                            if (end > pi) {//crossed the 180 deg line only
                                pointConf.clipOuterFrontPath = [M, startOuterX, startOuterY,
                                                                A, rx, ry, 0, 0, 1, this.leftX, cy,
                                                                V, depth,
                                                                A, rx, ry, 0, 0, 0, startOuterX, startOuterY1,
                                                                Z];
                                pointConf.clipOuterBackPath = [M, this.leftX, cy,
                                                               A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                               V, depth,
                                                               A, rx, ry, 0, 0, 0, this.leftX, cy + depth,
                                                               Z];
                                if (this.isDoughnut) {
                                        pointConf.clipInnerFrontPath = [M, startInnerX, startInnerY,
                                                                        A, innerRx, innerRy, 0, 0, 1, this.leftInnerX, cy,
                                                                        V, depth,
                                                                        A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY1,
                                                                        Z];
                                        pointConf.clipInnerBackPath = [M, this.leftInnerX, cy,
                                                                       A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                                       V, depth,
                                                                       A, innerRx, innerRy, 0, 0, 0, this.leftInnerX, cy + depth,
                                                                       Z];
                                }
                            }
                            else {//haven't crossed any thing
                                pointConf.clipOuterFrontPath = [M, startOuterX, startOuterY,
                                                                A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                                V, depth,
                                                                A, rx, ry, 0, 0, 0, startOuterX, startOuterY1,
                                                                Z];
                                pointConf.clipOuterBackPath = this.clipPathforNoClip;

                                if (this.isDoughnut) {

                                    pointConf.clipInnerFrontPath = [M, startInnerX, startInnerY,
                                                                    A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                                    V, depth,
                                                                    A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY1,
                                                                    Z];

                                    pointConf.clipInnerBackPath = this.clipPathforNoClip;

                                }
                            }
                        }
                        else {//haven't crossed any thing
                            pointConf.clipOuterFrontPath = this.clipPathforNoClip;
                            pointConf.clipOuterBackPath = [M, startOuterX, startOuterY,
                                                           A, rx, ry, 0, 0, 1, endOuterX, endOuterY,
                                                           V, depth,
                                                           A, rx, ry, 0, 0, 0, startOuterX, startOuterY1,
                                                           Z];
                            if (this.isDoughnut) {

                                pointConf.clipInnerFrontPath = this.clipPathforNoClip;

                                pointConf.clipInnerBackPath = [M, startInnerX, startInnerY,
                                                               A, innerRx, innerRy, 0, 0, 1, endInnerX, endInnerY,
                                                               V, depth,
                                                               A, innerRx, innerRy, 0, 0, 0, startInnerX, startInnerY1,
                                                               Z];
                            }
                        }
                    }
                    else {//zero Pie
                        pointConf.clipOuterFrontPath =
                        pointConf.clipOuterBackPath =
                        pointConf.clipInnerBackPath =
                        pointConf.clipInnerFrontPath = this.clipPathforNoClip;
                    }

                    //now apply the changes
                    if (!doNotApply) {
                        pointConf.elements.startSlice._conf.index = start;
                        pointConf.elements.endSlice._conf.index = end;
                        pointConf.elements.frontOuter._conf.index = getFrontOuterIndex(end, start);

                        if (pointConf.elements.frontOuter1) {
                            pointConf.elements.frontOuter1._conf.index = start;
                            pointConf.elements.frontOuter1.attr(
                                'litepath', [pointConf.clipOuterFrontPath1]
                            );
                        }
                        pointConf.thisElement.attr(
                            'litepath', [pointConf.clipTopPath]
                        );
                        pointConf.elements.bottom.attr(
                            'litepath', [pointConf.clipTopPath]
                        );
                        pointConf.elements.bottomBorder.attr(
                            'litepath', [pointConf.clipTopPath]
                        );

                        pointConf.elements.topBorder && pointConf.elements.topBorder.attr(
                            'litepath', [pointConf.clipTopBorderPath]
                        );
                        pointConf.elements.frontOuter.attr(
                            'litepath', [pointConf.clipOuterFrontPath]
                        );
                        pointConf.elements.backOuter.attr(
                            'litepath', [pointConf.clipOuterBackPath]
                        );

                        if (this.isDoughnut) {
                            pointConf.elements.backInner.attr(
                                'litepath', [pointConf.clipInnerBackPath]
                            );
                            pointConf.elements.frontInner.attr(
                                'litepath', [pointConf.clipInnerFrontPath]
                            );
                            pointConf.elements.backInner._conf.index = getFrontOuterIndex(end, start);

                        }

                        if (this.hasOnePoint) {
                            pointConf.elements.startSlice.hide();
                            pointConf.elements.endSlice.hide();
                        }
                        else {
                            pointConf.elements.startSlice.attr(
                                'litepath', [pointConf.startSlice]
                            ).show();
                            pointConf.elements.endSlice.attr(
                                'litepath', [pointConf.endSlice]
                            ).show();
                        }
                    }
                }
                else {//for VML
                    var tempArr1, tempArr2, tempArr3, tempArr4, tempArr5, tempArr6,
                    moveCmdArr = this.moveCmdArr,
                    lineCmdArr = this.lineCmdArr,
                    closeCmdArr = this.closeCmdArr,
                    centerPoint = this.centerPoint,
                    leftPoint = this.leftPoint,
                    topPoint = this.topPoint,
                    rightPoint = this.rightPoint,
                    bottomPoint = this.bottomPoint,
                    leftDepthPoint = this.leftDepthPoint,
                    rightDepthPoint = this.rightDepthPoint,
                    leftInnerPoint = this.leftInnerPoint,
                    rightInnerPoint = this.rightInnerPoint,
                    leftInnerDepthPoint = this.leftInnerDepthPoint,
                    rightInnerDepthPoint = this.rightInnerDepthPoint;
                    pointConf.clipOuterFrontPath1 = [];
                    if (startOri != endOri) {
                        if(start > end) {//crossed the 0 deg line
                            if (start < pi){//crossed the 180 deg line also
                                tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, this.leftX, cy, rx, ry, 1, 0);
                                tempArr3 = getArcPath(cx, cy, this.leftX, cy, this.rightX, cy, rx, ry, 1, 0);
                                tempArr5 = getArcPath(cx, cy, this.rightX, cy, endOuterX, endOuterY, rx, ry, 1, 0);
                                pointConf.clipOuterBackPath = moveCmdArr.concat(leftPoint, tempArr3, lineCmdArr, rightDepthPoint,
                                    getArcPath(cx, depthY, this.rightX,
                                        depthY, this.leftX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipOuterFrontPath1 = moveCmdArr.concat( [startOuterX, startOuterY], tempArr1, lineCmdArr,
                                    leftDepthPoint, getArcPath(cx, depthY, this.leftX, depthY, startOuterX, startOuterY1,
                                        rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipOuterFrontPath = moveCmdArr.concat(rightPoint,
                                    tempArr5, lineCmdArr, [endOuterX, endOuterY1], getArcPath(cx, depthY, endOuterX,
                                        endOuterY1, this.rightX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipTopBorderPath = moveCmdArr.concat([startOuterX, startOuterY], tempArr1, tempArr3, tempArr5);
                                if (this.isDoughnut) {
                                    tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, this.rightInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr4 = getArcPath(cx, cy, this.rightInnerX, cy, this.leftInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr6 = getArcPath(cx, cy, this.leftInnerX, cy, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                    pointConf.clipInnerBackPath = moveCmdArr.concat(rightInnerPoint, tempArr4, lineCmdArr, leftInnerDepthPoint,
                                        getArcPath(cx, depthY, this.leftInnerX, depthY, this.rightInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipInnerFrontPath = moveCmdArr.concat(leftInnerPoint, tempArr6,
                                        lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                            startInnerY1, this.leftInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr, moveCmdArr,
                                        [endInnerX, endInnerY], tempArr2, lineCmdArr, rightInnerDepthPoint, getArcPath(cx,
                                            depthY, this.rightInnerX, depthY, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, tempArr6, closeCmdArr);
                                    pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(moveCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, tempArr6);

                                }
                                else {
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                                }
                            }
                            else if( end > pi) {//crossed the 180 deg line also
                                tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, this.rightX, cy, rx, ry, 1, 0);
                                tempArr3 = getArcPath(cx, cy, this.rightX, cy, this.leftX, cy, rx, ry, 1, 0);
                                tempArr5 = getArcPath(cx, cy, this.leftX, cy, endOuterX, endOuterY, rx, ry, 1, 0);
                                pointConf.clipOuterFrontPath = moveCmdArr.concat(rightPoint, tempArr3, lineCmdArr, leftDepthPoint,
                                    getArcPath(cx, depthY, this.leftX,
                                        depthY, this.rightX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipOuterBackPath = moveCmdArr.concat( [startOuterX, startOuterY], tempArr1, lineCmdArr,
                                    rightDepthPoint, getArcPath(cx, depthY, this.rightX,
                                        depthY, startOuterX, startOuterY1, rx, ry, 0, 0), closeCmdArr, moveCmdArr, leftPoint,
                                    tempArr5, lineCmdArr, [endOuterX, endOuterY1], getArcPath(cx, depthY, endOuterX,
                                        endOuterY1, this.leftX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipTopBorderPath = moveCmdArr.concat([startOuterX, startOuterY], tempArr1, tempArr3, tempArr5);
                                if (this.isDoughnut) {
                                    tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, this.leftInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr4 = getArcPath(cx, cy, this.leftInnerX, cy, this.rightInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr6 = getArcPath(cx, cy, this.rightInnerX, cy, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                    pointConf.clipInnerFrontPath = moveCmdArr.concat(leftInnerPoint, tempArr4, lineCmdArr, rightInnerDepthPoint,
                                        getArcPath(cx, depthY, this.rightInnerX, depthY, this.leftInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipInnerBackPath = moveCmdArr.concat(rightInnerPoint, tempArr6,
                                        lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                            startInnerY1, this.rightInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr, moveCmdArr,
                                        [endInnerX, endInnerY], tempArr2, lineCmdArr, leftInnerDepthPoint, getArcPath(cx,
                                            depthY, this.leftInnerX, depthY, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);

                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, tempArr6, closeCmdArr);
                                    pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(moveCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, tempArr6);

                                }
                                else {
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                            }
                            }
                            else {
                                tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, this.rightX, cy, rx, ry, 1, 0);
                                tempArr3 = getArcPath(cx, cy, this.rightX, cy, endOuterX, endOuterY, rx, ry, 1, 0);
                                pointConf.clipOuterFrontPath = moveCmdArr.concat(rightPoint, tempArr3, lineCmdArr, [endOuterX, endOuterY1], getArcPath(cx, depthY, endOuterX, endOuterY1, this.rightX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipOuterBackPath = moveCmdArr.concat( [startOuterX, startOuterY], tempArr1, lineCmdArr, rightDepthPoint, getArcPath(cx, depthY, this.rightX, depthY, startOuterX, startOuterY1, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipTopBorderPath = moveCmdArr.concat([startOuterX, startOuterY], tempArr1, tempArr3);
                                if (this.isDoughnut) {
                                    tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, this.rightInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr4 = getArcPath(cx, cy, this.rightInnerX, cy, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                    pointConf.clipInnerFrontPath = moveCmdArr.concat([endInnerX, endInnerY], tempArr2, lineCmdArr, rightInnerDepthPoint,
                                        getArcPath(cx, depthY, this.rightInnerX, depthY, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipInnerBackPath = moveCmdArr.concat(rightInnerPoint, tempArr4,
                                        lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                            startInnerY1, this.rightInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, closeCmdArr);
                                    pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(moveCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4);

                                }
                                else {
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                            }
                        }
                        }
                        else if (start < pi){
                            if (end > pi) {//crossed the 180 deg line only
                                tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, this.leftX, cy, rx, ry, 1, 0);
                                tempArr3 = getArcPath(cx, cy, this.leftX, cy, endOuterX, endOuterY, rx, ry, 1, 0);
                                pointConf.clipOuterBackPath = moveCmdArr.concat(leftPoint, tempArr3, lineCmdArr, [endOuterX, endOuterY1],
                                    getArcPath(cx, depthY, endOuterX,
                                        endOuterY1, this.leftX, depthY, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipOuterFrontPath = moveCmdArr.concat( [startOuterX, startOuterY], tempArr1, lineCmdArr,
                                    leftDepthPoint, getArcPath(cx, depthY, this.leftX,
                                        depthY, startOuterX, startOuterY1, rx, ry, 0, 0), closeCmdArr);
                                pointConf.clipTopBorderPath = moveCmdArr.concat([startOuterX, startOuterY], tempArr1, tempArr3);
                                if (this.isDoughnut) {
                                    tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, this.leftInnerX, cy, innerRx, innerRy, 0, 0);
                                    tempArr4 = getArcPath(cx, cy, this.leftInnerX, cy, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                    pointConf.clipInnerBackPath = moveCmdArr.concat([endInnerX, endInnerY], tempArr2, lineCmdArr, leftInnerDepthPoint,
                                        getArcPath(cx, depthY, this.leftInnerX, depthY, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipInnerFrontPath = moveCmdArr.concat(leftInnerPoint, tempArr4,
                                        lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                            startInnerY1, this.leftInnerX, depthY, innerRx, innerRy, 1, 0), closeCmdArr);
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4, closeCmdArr);
                                    pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(moveCmdArr, [endInnerX, endInnerY], tempArr2, tempArr4);

                                }
                                else {
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                            }
                            }
                            else {//haven't crossed any thing
                                tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, endOuterX, endOuterY, rx, ry, 1, 0);
                                pointConf.clipOuterBackPath = moveCmdArr.concat([startOuterX, startOuterY]);
                                pointConf.clipTopBorderPath = pointConf.clipOuterBackPath.concat(tempArr1);
                                pointConf.clipOuterFrontPath = pointConf.clipTopBorderPath.concat( lineCmdArr,
                                    [endOuterX, endOuterY1], getArcPath(cx, depthY, endOuterX,
                                        endOuterY1, startOuterX, startOuterY1, rx, ry, 0, 0), closeCmdArr);
                                if (this.isDoughnut) {
                                    tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                    pointConf.clipInnerBackPath = moveCmdArr.concat([endInnerX, endInnerY]);
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, closeCmdArr);
                                    pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(moveCmdArr, [endInnerX, endInnerY], tempArr2);
                                    pointConf.clipInnerFrontPath = pointConf.clipInnerBackPath.concat(tempArr2,
                                        lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                            startInnerY1, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);

                                }
                                else {
                                    pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                            }
                        }
                        }
                        else {//haven't crossed any thing
                            tempArr1 = getArcPath(cx, cy, startOuterX, startOuterY, endOuterX, endOuterY, rx, ry, 1, 0);
                            pointConf.clipOuterFrontPath = moveCmdArr.concat([startOuterX, startOuterY]);
                            pointConf.clipTopBorderPath = pointConf.clipOuterFrontPath.concat(tempArr1);
                            pointConf.clipOuterBackPath = pointConf.clipTopBorderPath.concat( lineCmdArr,
                                [endOuterX, endOuterY1], getArcPath(cx, depthY, endOuterX,
                                    endOuterY1, startOuterX, startOuterY1, rx, ry, 0, 0), closeCmdArr);
                            if (this.isDoughnut) {
                                tempArr2 = getArcPath(cx, cy, endInnerX, endInnerY, startInnerX, startInnerY, innerRx, innerRy, 0, 0);
                                pointConf.clipInnerFrontPath = moveCmdArr.concat([endInnerX, endInnerY]);
                                pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, [endInnerX, endInnerY], tempArr2, closeCmdArr);
                                pointConf.clipTopBorderPath = pointConf.clipTopBorderPath.concat(pointConf.clipInnerFrontPath, tempArr2);
                                pointConf.clipInnerBackPath = pointConf.clipInnerFrontPath.concat(tempArr2,
                                    lineCmdArr, [startInnerX, startInnerY1], getArcPath(cx, depthY, startInnerX,
                                        startInnerY1, endInnerX, endInnerY1, innerRx, innerRy, 1, 0), closeCmdArr);

                            }
                            else {
                                pointConf.clipTopPath = pointConf.clipTopBorderPath.concat(lineCmdArr, centerPoint, closeCmdArr);
                            }
                        }
                        //enlarge the bounded box so that the gradient works perfactly
                        tempArr1 = moveCmdArr.concat(leftPoint, lineCmdArr, rightPoint);
                        tempArr2 = moveCmdArr.concat(topPoint, lineCmdArr, bottomPoint);
                        pointConf.clipTopPath = pointConf.clipTopPath.concat(tempArr1, tempArr2);
                        pointConf.clipOuterFrontPath = pointConf.clipOuterFrontPath.concat(tempArr1);
                        pointConf.clipOuterFrontPath1 = pointConf.clipOuterFrontPath1.concat(tempArr1);
                        pointConf.clipOuterBackPath = pointConf.clipOuterBackPath.concat(tempArr1);

                        if (this.isDoughnut) {
                            tempArr2 = moveCmdArr.concat(leftInnerPoint, lineCmdArr, rightInnerPoint);
                            pointConf.clipInnerFrontPath = pointConf.clipInnerFrontPath.concat(tempArr2);
                            pointConf.clipInnerBackPath = pointConf.clipInnerBackPath.concat(tempArr2);
                        }
                    }
                    else {//zero Pie
                        pointConf.clipTopPath =
                        pointConf.clipOuterFrontPath =
                        pointConf.clipOuterBackPath = [];
                        if (this.isDoughnut) {
                            pointConf.clipInnerFrontPath =
                            pointConf.clipInnerBackPath = [];
                        }
                    }

                    //now apply the changes
                    if (!doNotApply) {
                        pointConf.elements.startSlice._conf.index = start;
                        pointConf.elements.endSlice._conf.index = end;
                        pointConf.elements.frontOuter._conf.index = getFrontOuterIndex(end, start);
                        if (pointConf.elements.frontOuter1) {
                            pointConf.elements.frontOuter1._conf.index = start;
                            elements.frontOuter1.attr({
                                path: pointConf.clipOuterFrontPath1
                            });
                        }
                        pointConf.thisElement.attr({
                            path: pointConf.clipTopPath
                        });
                        elements.topBorder.attr({
                            path: pointConf.clipTopBorderPath
                        });
                        elements.bottom.attr({
                            path: pointConf.clipTopPath
                        });
                        elements.bottomBorder.attr({
                            path: pointConf.clipTopBorderPath
                        });
                        elements.frontOuter.attr({
                            path: pointConf.clipOuterFrontPath
                        });
                        elements.backOuter.attr({
                            path: pointConf.clipOuterBackPath
                        });
                        if (this.isDoughnut) {
                            elements.frontInner.attr({
                                path: pointConf.clipInnerFrontPath
                            });
                            elements.backInner.attr({
                                path: pointConf.clipInnerBackPath
                            });
                        }

                        if (this.hasOnePoint) {
                            pointConf.elements.startSlice.hide();
                            pointConf.elements.endSlice.hide();
                        }
                        else {
                            pointConf.elements.startSlice.attr({
                                path: pointConf.startSlice
                            }).show();
                            pointConf.elements.endSlice.attr({
                                path: pointConf.endSlice
                            }).show();
                        }
                    }
                }
            },

            

            createSlice: (function () {
                var attrKeyList = {
                    stroke: true,
                    strokeWidth: true,
                    'stroke-width': true,
                    dashstyle: true,
                    'stroke-dasharray': true,
                    translateX: true,
                    translateY: true,
                    'stroke-opacity': true,
                    transform: true,
                    //block following attribute
                    fill: true,
                    opacity: true,
                    ishot : true,
                    start: true,
                    end : true,
                    cursor: true
                },
                attrFN = function (hash, val) {
                    var key,
                        value,
                        slice = this,
                        confObject = slice._confObject,
                        attrObj,
                        elements = confObject.elements,
                        x,
                        updateSliceConf,
                        pie3DManager = confObject.pie3DManager;

                    // single key-value pair
                    if (isString(hash) && defined(val)) {
                        key = hash;
                        hash = {};
                        hash[key] = val;
                    }

                    // used as a getter: first argument is a string, second is undefined
                    if (!hash || isString(hash)) {
                        slice = slice._attr(hash);
                    // setter
                    }
                    else {
                        /* cx and cy have no use here, which are used to bypass Raphael animation limitation which use only Raphael attr attributes.
                         * Since start and end attributes can't work with in raphael animation, its hacked this way, as of now. */
                        if (hash.cx !== undefined) {
                           hash.start = hash.cx;
                        }
                        if (hash.cy !== undefined) {
                           hash.end = hash.cy;
                        }

                        for (key in hash) {
                            value = hash[key];

                            //if belongs from the list then handle here
                            if (attrKeyList[key]) {

                                //store the att in confObject for further use
                                confObject[key] = value;
                                if (key === 'ishot' || key === 'cursor') {
                                    attrObj = {};
                                    attrObj[key] = value;
                                    //other elements
                                    for (x in elements) {
                                        elements[x].attr(attrObj);
                                    }
                                    //main element
                                    slice._attr(attrObj);
                                }
                                else if (key === 'transform') {
                                    for (x in elements) {
                                      elements[x].attr({transform: hash[key]});
                                    }
                                    //main element
                                    slice._attr({transform: hash[key]});
                                }
                                else if (key === 'stroke' || key === 'strokeWidth'
                                    || key === 'stroke-width' || key === 'dashstyle'
                                    || key === 'stroke-dasharray') {
                                    //element that has stroke effect
                                    attrObj = {};
                                    attrObj[key] = value;
                                    elements.topBorder && elements.topBorder.attr(attrObj);
                                    elements.startSlice.attr(attrObj);
                                    elements.endSlice.attr(attrObj);
                                    elements.bottomBorder.attr(attrObj);
                                }
                                //if it is 'fill' or 'lighting3D' the redefine the colors for all the 3 elements
                                else if (key === 'fill') {
                                

                                }
                                else if (key === 'start' || key === 'end') {
                                    updateSliceConf = true;
                                }
                            }
                            else {//else leve for the original attr
                                slice._attr(key, value);
                            }
                        }
                        if (updateSliceConf) {
                            pie3DManager.updateSliceConf(confObject);
                            //refreash the drawinh for proper z lavel for elements
                            pie3DManager.refreshDrawing();
                        }
                    }
                    return slice;
                },
                onFN = function (eventType, handler, handler2, handler3) {
                    var confObject = this._confObject,
                    elements = confObject.elements, x;
                    //other elements
                    for (x in elements) {
                        if (!handler2) {
                            elements[x].on(eventType, handler);
                        }
                        else {
                            elements[x].drag(handler, handler2, handler3);
                        }
                    }
                    //main element
                    if (!handler2) {
                        return this._on(eventType, handler);
                    }
                    else {
                        return this.drag(handler, handler2, handler3);
                    }
                },
                hideFN = function () {
                    var confObject = this._confObject,
                    elements = confObject.elements, x;
                    //other elements
                    for (x in elements) {
                        elements[x].hide();
                    }
                    //main element
                    return this._hide();
                },
                showFN = function () {
                    var confObject = this._confObject,
                    elements = confObject.elements, x;
                    //other elements
                    for (x in elements) {
                        elements[x].show();
                    }
                    //main element
                    return this._show();
                },
                destroyFN = function () {
                    var confObject = this._confObject,
                    elements = confObject.elements, x;
                    //other elements
                    for (x in elements) {
                        elements[x].destroy();
                    }
                    if (hasSVG) {
                        //destory other element
                        

                        confObject.clipTop.destroy();
                        confObject.clipOuterFront.destroy();
                        confObject.clipOuterBack.destroy();
                        if (confObject.clipOuterFront1) {
                            confObject.clipOuterFront1.destroy();
                        }
                        if (confObject.clipInnerFront) {
                            confObject.clipInnerFront.destroy();
                        }
                        if (confObject.clipInnerBack) {
                            confObject.clipInnerBack.destroy();
                        }
                    }
                    //main element
                    return this._destroy();
                };


                return function (start, end, color, alpha, borderColor, borderWidth, positionIndex, toolText, showBorderEffect) {

                    var renderer = this.renderer,
                        colorObj = this.parseColor(color, alpha),
                        returnElement,
                        confObject = {
                            start : start,
                            end : end,
                            elements : {},
                            pie3DManager : this
                        },
                        slicingWallsArr = this.slicingWallsArr,
                        elements = confObject.elements,
                        startAngle,
                        endAngle,
                        scaleAngle,
                        topAttrObj,
                        i,
                        renderingPath = hasSVG ? 'litepath' : 'path';

                    //update the configuration
                    this.updateSliceConf(confObject, true);

                    if (hasSVG) {
                        topAttrObj = {fill: toRaphaelColor(colorObj.top), 'stroke-width': 0};
                        if (showBorderEffect !== 1) {
                            topAttrObj.stroke = borderColor;
                            topAttrObj['stroke-width'] = borderWidth;

                        }
                        // top
                        returnElement = renderer[renderingPath](confObject.clipTopPath, this.topGroup)
                        .attr(topAttrObj);

                        if (showBorderEffect) {
                            // top border
                            elements.topBorder = renderer[renderingPath](confObject.clipTopBorderPath, this.topGroup)
                            .attr({
                                fill: toRaphaelColor(colorObj.topBorder),
                                'stroke-width' : 0
                            });
                        }
                    }
                    else {
                        returnElement = renderer[renderingPath](confObject.clipTopPath, this.topGroup)
                        .attr({
                            fill: toRaphaelColor(colorObj.top),
                            'stroke-width' : 0
                        });
                        // top border
                        elements.topBorder = renderer[renderingPath](confObject.clipTopBorderPath, this.topGroup)
                        .attr({
                            stroke: borderColor,
                            'stroke-width' : borderWidth
                        });
                    }

                    // bottom
                    elements.bottom = renderer[renderingPath](confObject.clipTopPath, this.bottomBorderGroup)
                    .attr({
                        fill: toRaphaelColor(colorObj.bottom),
                        'stroke-width' : 0
                    });

                    // bottom
                    elements.bottomBorder = renderer[renderingPath](hasSVG ? confObject.clipTopPath : confObject.clipTopBorderPath, this.bottomBorderGroup)
                    .attr({
                        stroke: borderColor,
                        'stroke-width' : borderWidth
                    });

                    elements.frontOuter = renderer[renderingPath](confObject.clipOuterFrontPath, this.slicingWallsFrontGroup)
                    .attr({
                        fill: toRaphaelColor(colorObj.frontOuter),
                        'stroke-width' : 0
                    });

                    // outerback
                    elements.backOuter = renderer[renderingPath](confObject.clipOuterBackPath, this.outerBackGroup)
                    .attr({
                        fill: toRaphaelColor(colorObj.backOuter),
                        'stroke-width' : 0
                    });

                    // startSlice
                    //whenAtBack
                    elements.startSlice = renderer[renderingPath](confObject.startSlice, this.slicingWallsFrontGroup)
                    .attr({
                        fill: toRaphaelColor(colorObj.startSlice),
                        stroke: borderColor,
                        'stroke-width' : borderWidth
                    });

                    // ensSlice
                    //whenAtBack
                    elements.endSlice = renderer[renderingPath](confObject.endSlice, this.slicingWallsFrontGroup)
                    .attr({
                        fill: toRaphaelColor(colorObj.endSlice),
                        stroke: borderColor,
                        'stroke-width' : borderWidth
                    });

                    startAngle = normalizeAngle(confObject.start);
                    endAngle = normalizeAngle(confObject.end);
                    scaleAngle = getAbsScaleAngle (startAngle, endAngle);

                    if (scaleAngle > pi) {
                        // outerFront
                        elements.frontOuter1 = renderer[renderingPath](confObject.clipOuterFrontPath1, this.slicingWallsFrontGroup)
                        .attr({
                            fill: toRaphaelColor(colorObj.frontOuter),
                            'stroke-width' : 0
                        });

                        elements.frontOuter1._conf = {
                            index : startAngle,
                            isStart : 0.5,
                            pIndex : positionIndex
                        };
                        if (hasSVG) {
                            confObject.clipOuterFront1 = confObject.clipOuterFrontPath1;
                        }
                    }

                    elements.frontOuter._conf = {
                        index : getFrontOuterIndex(endAngle, startAngle),
                        isStart : 0.5,
                        pIndex : positionIndex
                    };
                    elements.startSlice._conf = {
                        index : startAngle,
                        isStart : 0,
                        pIndex : positionIndex
                    };
                    elements.endSlice._conf = {
                        index : endAngle,
                        isStart : 1,
                        pIndex : positionIndex
                    };

                    if (this.hasOnePoint) {
                        elements.startSlice.hide();
                        elements.endSlice.hide();
                    }

                    if (this.isDoughnut) {
                        // innerFront
                        elements.frontInner = renderer[renderingPath](confObject.clipInnerFrontPath, this.innerFrontGroup)
                        .attr({
                            fill: toRaphaelColor(colorObj.frontInner),
                            'stroke-width' : 0
                        });

                        elements.backInner = renderer[renderingPath](confObject.clipInnerBackPath, this.innerBackGroup)
                        .attr({
                            fill: toRaphaelColor(colorObj.backInner),
                            'stroke-width' : 0
                        });

                        elements.backInner._conf = {
                            index : getFrontOuterIndex(endAngle, startAngle),
                            isStart : 0.5,
                            pIndex : positionIndex
                        };

                        if (scaleAngle > pi) {
                            if (hasSVG) {
                                slicingWallsArr.push(elements.startSlice, elements.frontOuter1, elements.frontOuter, elements.backInner, elements.endSlice);
                            }
                            else {
                                slicingWallsArr.push(elements.startSlice, elements.frontOuter1, elements.frontOuter, elements.endSlice);
                            }
                        }
                        else {
                            if (hasSVG) {
                                slicingWallsArr.push(elements.startSlice, elements.frontOuter, elements.backInner, elements.endSlice);
                            }
                            else {
                                slicingWallsArr.push(elements.startSlice, elements.frontOuter, elements.endSlice);
                            }
                        }
                    }
                    else {
                        if (scaleAngle > pi) {
                            slicingWallsArr.push(elements.startSlice, elements.frontOuter1, elements.frontOuter, elements.endSlice);
                        }
                        else {
                            slicingWallsArr.push(elements.startSlice, elements.frontOuter, elements.endSlice);
                        }
                    }

                    if (toolText !== undefined) {
                        for (i in elements) {
                            elements[i].tooltip(toolText);
                        }
                        returnElement.tooltip(toolText);
                    }

                    if (hasSVG) {
                        confObject.clipTop = confObject.clipTopPath;
                        confObject.clipOuterFront = confObject.clipOuterFrontPath;
                        confObject.clipOuterBack = confObject.clipOuterBackPath;

                        if (this.isDoughnut) {
                            confObject.clipInnerFront = confObject.clipInnerFrontPath;
                            confObject.clipInnerBack = confObject.clipInnerBackPath;
                        }
                    }

                    //store the _confObject reference
                    returnElement._confObject = confObject;
                    confObject.thisElement = returnElement;
                    //modify few core function

                    returnElement._destroy = returnElement.destroy;
                    returnElement.destroy = destroyFN;

                    returnElement._show = returnElement.show;
                    returnElement.show = showFN;

                    returnElement._hide = returnElement.hide;
                    returnElement.hide = hideFN;

                    returnElement._on = returnElement.on;
                    returnElement.on = onFN;

                    returnElement._attr = returnElement.attr;
                    returnElement.attr = attrFN;

                    //add the element to the store
                    this.pointElemStore.push(returnElement);

                    return returnElement;

                };
            })()
        };

        pie3DManager.prototype.constructor = pie3DManager;

        renderer('renderer.pie3d', {
            type: 'pie3d',

            drawCaption: function () {
                var chart = this,
                    optionsChart = chart.options.chart,
                    optionsCap = chart.options.title,
                    optionsSubcap = chart.options.subtitle,
                    paper = chart.paper,
                    elements = chart.elements,
                    layers = chart.layers,
                    captionGroup = layers.caption,
                    caption = elements.caption,
                    subcaption = elements.subcaption,
                    interCaptionGap = 2,
                    hasCaption = (optionsCap && optionsCap.text),
                    hasSubcaption = (optionsSubcap && optionsSubcap.text),
                    canvasCentre = (paper.width / 2),
                    captionX = optionsCap.x,
                    subcaptionX = (optionsSubcap && optionsSubcap.x);

                // if captions are needed, then we need to ensure that it is placed
                // within a group.
                if (hasCaption || hasSubcaption) {
                    if (!captionGroup) {
                        captionGroup = layers.caption = paper.group('caption');

                        if (layers.tracker) {
                            captionGroup.insertBefore(layers.tracker);
                        }
                        else {
                            captionGroup.insertAfter(layers.dataset);
                        }
                    }
                }

                // if definition has caption, we proceed creating one and if there
                // is no caption we remove any previously created caption element.
                // captions are center aligned with respect to canvas and we
                // position them (cap and subcap) vertically one after another
                // and keep their v-align as top.
                if (hasCaption) {
                    if (!caption) {
                        caption = elements.caption = paper.text(captionGroup);
                    }

                    if (captionX === undefined) {
                        captionX = canvasCentre;
                        optionsCap.align = POSITION_MIDDLE;
                    }

                    caption.css(optionsCap.style).attr({
                        text: optionsCap.text,
                        fill: optionsCap.style.color,
                        x: captionX,
                        y: (optionsCap.y || optionsChart.spacingTop || 0),
                        'text-anchor': (optionsCap.align) || POSITION_MIDDLE,
                        'vertical-align': 'top',
                        visibility: 'visible',
                        title: (optionsCap.originalText || '')
                    });

                }
                else if (caption) {
                    caption = elements.caption = caption.remove();
                }

                if (hasSubcaption) {
                    if (!subcaption) {
                        subcaption = elements.subcaption = paper.text(captionGroup);
                    }

                    if (subcaptionX === undefined) {
                        subcaptionX = canvasCentre;
                        optionsSubcap.align = POSITION_MIDDLE;
                    }

                    subcaption.css(optionsSubcap.style).attr({
                        text: optionsSubcap.text,
                        title: (optionsSubcap.originalText || ''),
                        fill: optionsSubcap.style.color,
                        x: subcaptionX,
                        y: hasCaption ?
                            (caption.attrs.y + caption.getBBox().height + interCaptionGap) :
                            (optionsCap.y || optionsChart.spacingTop || 0),

                        'text-anchor': optionsSubcap.align || 'middle',
                        'vertical-align': 'top',
                        visibility: 'visible'
                    });
                }
                else if (subcaption) {
                    subcaption = elements.subcaption = subcaption.remove();
                }

                // if neither caption or subcaption is needed, we need to dump the
                // group as well.
                if (!(hasCaption || hasSubcaption || !captionGroup)) {
                    captionGroup = layers.caption = captionGroup.remove();
                }
            },

            translate: function() {
                var chart = this,
                    precision = 1000,
                    total = 0,
                    options = chart.options,
                    dataset = options.series[0],
                    dataLabelOptions = options.plotOptions.series.dataLabels,
                    pie3DOptions = options.plotOptions.pie3d,
                    startingAngle = (pluck(dataset.startAngle, 0) % 360),
                    fontSize,
                    managedPieSliceDepth = dataset.managedPieSliceDepth,
                    slicedOffset = dataset.slicedOffset = pie3DOptions.slicedOffset,
                    plotWidth = chart.canvasWidth,
                    plotHeight = chart.canvasHeight,
                    positions = [chart.canvasLeft + plotWidth * 0.5,
                                 chart.canvasTop + plotHeight * 0.5 - managedPieSliceDepth * 0.5],
                    start,
                    end,
                    angle,
                    lastEnd,
                    maxEnd,
                    data = dataset.data,
                    fraction,
                    smallestSize = mathMin(plotWidth, plotHeight),
                    isPercent,
                    radiusX, // the x component of the radius vector for a given point
                    radiusY,
                    labelDistance = dataLabelOptions.distance,
                    pieYScale = dataset.pieYScale,
                    pieSliceDepth = dataset.pieSliceDepth,

                    slicedOffsetY = dataset.slicedOffsetY = slicedOffset * pieYScale;

                // get positions - either an integer or a percentage string must be given
                positions.push(pie3DOptions.size, pie3DOptions.innerSize || 0);


                positions = map(positions, function(length, i) {
                    isPercent = /%$/.test(length);
                    return isPercent ?
                    // i == 0: centerX, relative to width
                    // i == 1: centerY, relative to height
                    // i == 2: size, relative to smallestSize
                    // i == 4: innerSize, relative to smallestSize
                    [plotWidth, plotHeight - managedPieSliceDepth, smallestSize, smallestSize][i] *
                    pInt(length) / 100:
                    length;
                });


                //convert all diameter into radius
                positions[2] /= 2;
                positions[3] /= 2;
                //Add the ry
                positions.push(positions[2] * pieYScale);
                //centerRadiusX
                positions.push((positions[2] + positions[3]) / 2);
                //centerRadiusY
                positions.push(positions[5] * pieYScale);

                // utility for getting the x value from a given y, used for anticollision logic in data labels
                dataset.getX = function(y, left) {

                    angle = math.asin((y - positions[1]) / (positions[2] + labelDistance));

                    return positions[0] +
                    (left ? -1 : 1) *
                    (mathCos(angle) * (positions[2] + labelDistance));
                };

                // set center for later use
                dataset.center = positions;

                // get the total sum
                each(data, function(point) {
                    total += point.y;
                });

                dataset.labelsRadius = positions[2] + labelDistance;
                dataset.labelsRadiusY = dataset.labelsRadius * pieYScale;
                dataset.quadrantHeight = (plotHeight - managedPieSliceDepth) / 2;
                dataset.quadrantWidth = plotWidth / 2;

                lastEnd = -startingAngle * deg2rad;

                lastEnd = mathRound(lastEnd * precision) / precision;
                maxEnd = lastEnd + pi2;

                fontSize = pluckNumber(parseInt(dataLabelOptions.style.fontSize, 10), 10) + 4,//2px padding
                dataset.maxLabels = mathFloor(dataset.quadrantHeight / fontSize); //max labels per quarter
                dataset.labelFontSize = fontSize;
                dataset.connectorPadding = pluckNumber(dataLabelOptions.connectorPadding, 5);
                dataset.isSmartLineSlanted = pluck(dataLabelOptions.isSmartLineSlanted, true);
                dataset.connectorWidth = pluckNumber(dataLabelOptions.connectorWidth, 1);
                dataset.enableSmartLabels = dataLabelOptions.enableSmartLabels;

                if (!dataset.pie3DManager) {
                    dataset.pie3DManager = new pie3DManager(positions[0], positions[1], positions[2], positions[3],
                        pieYScale, pieSliceDepth, chart.layers.dataset, chart.paper, dataset.data.length === 1, dataset.use3DLighting);
                }

                each(data, function(point) {
                    // set start and end angle
                    start = lastEnd;
                    fraction = total ? point.y / total : 0;

                    lastEnd = mathRound((lastEnd + (fraction * pi2)) * precision) / precision;
                    if (lastEnd > maxEnd) {
                        lastEnd = maxEnd;
                    }
                    end = lastEnd;

                    // set the shape
                    point.shapeArgs = {
                        start: mathRound(start * precision) / precision,
                        end: mathRound(end * precision) / precision
                    };

                    // center for the sliced out slice
                    point.centerAngle = angle = ((end + start) / 2) % pi2;
                    

                    point.slicedTranslation = [
                                                mathRound(mathCos(angle) * slicedOffset),
                                                mathRound(mathSin(angle) * slicedOffsetY)
                                            ];

                    // set the anchor point for tooltips
                    radiusX = mathCos(angle) * positions[2];
                    dataset.radiusY = radiusY = mathSin(angle) * positions[4];
                    point.tooltipPos = [
                    positions[0] + radiusX * 0.7,
                    positions[1] + radiusY//changed to reducr mouce on tooltip condition
                    ];

                    // API properties
                    point.percentage = fraction * 100;
                    point.total = total;
                });
            },

            drawPlotPie3d: function(plot, dataOptions) {
                this.translate();

                var chart = this,
                    plotItems = plot.items,
                    plotData = plot.data,
                    options = chart.options,
                    plotOptions = options.plotOptions,
                    piePlotOptions = plotOptions.pie,
                    plotSeries = plotOptions.series,
                    layers = chart.layers,
                    seriesData = chart.elements.plots[0],
                    dataset = chart.datasets[0],
                    dataLabelOptions = plotOptions.series.dataLabels,
                    plotAnimation = plotSeries.animation,
                    seriesDataLabelsStyle = plotSeries.dataLabels.style,
                    seriesShadow = plotSeries.shadow,
                    animationDuration = pluckNumber(plot.moveDuration,
                                                        plotAnimation.duration),
                    paper = chart.paper,
                    tooltipOptions = options.tooltip || {},
                    isTooltip = tooltipOptions && tooltipOptions.enabled !== false,
                    toolText,
                    slicedOffset = dataset.slicedOffset,
                    slicedOffsetY = dataset.slicedOffsetY,
                    factor = pi2 / dataOptions.valueTotal,
                    cx = chart.canvasLeft + chart.canvasWidth * 0.5,
                    cy = chart.canvasTop + chart.canvasHeight * 0.5,
                    r = piePlotOptions.size * 0.5,
                    r2 = (piePlotOptions.innerSize || 0) * 0.5,
                    plotGraphicClick = chart.plotGraphicClick,
                    plotDragMove = chart.plotDragMove,
                    plotDragStart = chart.plotDragStart,
                    plotDragEnd = chart.plotDragEnd,
                    plotMouseDown = chart.plotMouseDown,
                    plotMouseUp = chart.plotMouseUp,
                    enableRotation = !!chart.datasets[0].enableRotation,
                    showBorderEffect = dataOptions.showBorderEffect,
                    dataLength = plotData.length,
                    plotItem,
                    set,
                    val,
                    displayValue,
                    setLink,
                    sliced,
                    isHot,
                    angle,
                    connectorWidth,
                    shapeArgs,
                    i;

                // Spare the world if no data has been sent
                if (!(plotData && dataLength)) {
                    plotData = [];
                }

                seriesData.singletonCase = (dataLength == 1);
                // Log the chart position for calculating mouse xy.
                seriesData.chartPosition = getPosition(chart.container);
                seriesData.pieCenter = dataset.center;
                seriesData.timerThreshold = 30;

                i = -1;
                while (++i < dataLength) {
                    set = plotData[i];
                    val = set.y;
                    displayValue = set.displayValue;
                    sliced = set.sliced;
                    shapeArgs = set.shapeArgs;
                    angle = set.centerAngle;
                    toolText = set.toolText;
                    setLink = !!set.link;
                    isHot = setLink || enableRotation || !set.doNotSlice;

                    if (val === null || val === undefined) {
                        continue;
                    }

                    if (!(plotItem = plotItems[i])) {
                        dataOptions.data[i].plot = plotItem = plotItems[i] = {
                            chart: chart,
                            index: i,
                            seriesData: seriesData,
                            value: val,
                            angle: angle,
                            link: set.link,
                            shapeArgs: shapeArgs,
                            slicedX: sliced && !seriesData.singletonCase ? mathCos(angle) * slicedOffset : 0,
                            slicedY: sliced && !seriesData.singletonCase ? mathSin(angle) * slicedOffsetY : 0,
                            sliced: sliced,
                            labelText: displayValue,
                            name: set.name,
                            label: set.name,
                            percentage: set.percentage,
                            toolText: toolText,
                            originalIndex: dataLength - i - 1,

                            graphic: dataset.pie3DManager.createSlice(shapeArgs.start, shapeArgs.end, set.color, set._3dAlpha, set.borderColor, set.borderWidth, i, (isTooltip ? toolText : ''), showBorderEffect)
                        };

                        // attach legend click event handler for slice
                        dataOptions.data[i].legendClick = (function (plotItem) {
                            return function () {
                                chart.legendClick(plotItem, true, false);
                            };
                        }(plotItem));

                        plotItem.graphic.plotItem = plotItem;

                        

                        plotItem.transX = mathCos(angle) * slicedOffset;
                        plotItem.transY = mathSin(angle) * slicedOffsetY;

                        plotItem.slicedTranslation = 't' + plotItem.transX + ',' + plotItem.transY;

                        plotItem.graphic.attr({
                            transform: 't' + plotItem.slicedX + ',' + plotItem.slicedY,
                            ishot: isHot,
                            cursor: setLink ? 'pointer' : ''
                        });

                        if (!set.doNotSlice) {
                            plotItem.graphic.on("click", function (item) {
                                                            return function () {
                                                                plotGraphicClick.call(item);
                                                            };
                                                         }(plotItem));
                        }

                        plotItem.graphic.on("drag", function (item) {
                                                        return function (dx, dy, x, y, evt) {
                                                            plotDragMove.call(item, dx, dy, x, y, evt);
                                                        };
                                                     }(plotItem),

                                                     function (item) {
                                                        return function (x, y, evt) {
                                                            plotDragStart.call(item, x, y, evt);
                                                        };
                                                     }(plotItem),

                                                     function (item) {
                                                        return function () {
                                                            plotDragEnd.call(item);
                                                        };
                                                     }(plotItem)
                                               );

                        plotItem.graphic.on("mousedown", function (item) {
                                                            return function () {
                                                                plotMouseDown.call(item);
                                                            };
                                                         }(plotItem));

                        plotItem.graphic.on("mouseup", function (item) {
                                                        return function () {
                                                            plotMouseUp.call(item);
                                                        };
                                                      }(plotItem));

                        if (displayValue !== undefined) {
                            plotItem.dataLabel = paper.text(layers.dataset)
                                .css(seriesDataLabelsStyle)
                                .attr({
                                    text: displayValue,
                                    title: (set.originalText || ''),
                                    fill: seriesDataLabelsStyle.color || "#000000",
                                    visibility: HIDDEN,
                                    ishot: isHot,
                                    cursor: setLink ? 'pointer' : ''
                                });

                            plotItem.dataLabel.click(plotGraphicClick, plotItem);
                            /* @note : Blocked as of now for issue in touch devices, where event params cascading is unusual */
                            //plotItem.dataLabel.drag(plotDragMove, plotDragStart, plotDragEnd, plotItem, plotItem, plotItem);
                            plotItem.dataLabel.mousedown(plotMouseDown, plotItem);
                            plotItem.dataLabel.mouseup(plotMouseUp, plotItem);

                            if (dataLabelOptions.distance > 0 &&
                                (connectorWidth = dataLabelOptions.connectorWidth) &&
                                               dataLabelOptions.enableSmartLabels) {
                                 plotItem.connector = paper.path('M 0 0 l 0 0', layers.dataset).attr({
                                     'stroke-width': connectorWidth,
                                     stroke: dataLabelOptions.connectorColor || '#606060',
                                     visibility: HIDDEN,
                                     ishot: isHot,
                                     cursor: setLink ? 'pointer' : ''
                                 });

                                 plotItem.connector.click(plotGraphicClick, plotItem);
                                 /* @note : Blocked as of now for issue in touch devices, where event params cascading is unusual */
                                 //plotItem.connector.drag(plotDragMove, plotDragStart, plotDragEnd, plotItem, plotItem, plotItem);
                                 plotItem.connector.mousedown(plotMouseDown, plotItem);
                                 plotItem.connector.mouseup(plotMouseUp, plotItem);
                             }
                        }
                    }
                }
                dataset.pie3DManager.refreshDrawing();

                if (animationDuration > 0) {
                    chart.animate(plotItems, animationDuration);
                }
                else {
                    chart.placeDataLabels(false, plotItems);
                }
            },

            rotate: function (setAngle) {
                var chart = this,
                    dataset = chart.datasets[0],
                    data = chart.elements.plots[0].items,
                    slicedOffset = dataset.slicedOffset,
                    slicedOffsetY = dataset.slicedOffsetY,
                    startingAngle = dataset.startAngle,
                    angle;

                setAngle = setAngle || -dataset._lastAngle;

                angle = (setAngle - startingAngle) % 360;

                dataset.startAngle = pluckNumber(setAngle,
                    dataset.startAngle) % 360;

                angle = -(angle * mathPI) / 180;

                if (dataset.pie3DManager) {
                    dataset.pie3DManager.rotate(angle);
                }

                each(data, function(point) {
                    var graphic = point.graphic,
                    args = point.shapeArgs,
                    newAngleArgs = {
                        start: args.start = args.start + angle,
                        end: args.end = args.end + angle
                    },
                    pointAngle = point.angle = normalizeAngle((newAngleArgs.start + newAngleArgs.end) / 2),
                    sliced = point.sliced,
                    cosAngle = mathCos(pointAngle),
                    sinAngle = mathSin(pointAngle);

                    //set the  slicedTranslation
                    point.slicedTranslation = [
                        mathRound(cosAngle * slicedOffset),
                        mathRound(sinAngle * slicedOffsetY)
                        ];

                    point.transX = point.slicedTranslation[0];
                    point.transY = point.slicedTranslation[1];

                    point.slicedX = sliced ? mathCos(angle) * slicedOffset : 0;
                    point.slicedY = sliced ? mathSin(angle) * slicedOffsetY : 0;

                    if (graphic && sliced) {
                        point.graphic.attr({
                              transform: 't' + point.slicedTranslation[0] + ',' + point.slicedTranslation[1]
                        });

                    }

                });

                this.placeDataLabels(true, data);

            },

            plotMouseDown: function () {
                var plotItem = this;
                plotItem.seriesData.isRotating = false;
            },

            plotMouseUp: function () {
                var plotItem = this,
                    chart = plotItem.chart,
                    seriesData = plotItem.seriesData;

               !seriesData.isRotating && chart.linkClickFN.call({
                   link: seriesData.data[plotItem.index].link
               }, chart);

               if (R._supportsTouch && !seriesData.isRotating) {
                    chart.plotGraphicClick.call(plotItem);
               }
            },

            plotDragStart: function (x, y, evt) {
                var plotItem = this,
                    chart = plotItem.chart,
                    seriesData = plotItem.seriesData,
                    dataset = chart.datasets[0],
                    angle;

                if (!dataset.enableRotation) {
                    return;
                }

                angle = getClickArcTangent.call(evt, x, y, seriesData.pieCenter,
                                                         seriesData.chartPosition, dataset.pieYScale);
                dataset.dragStartAngle = angle;
                dataset._lastAngle = -dataset.startAngle;
            },

            plotDragEnd: function () {
                var plotItem = this,
                    chart = plotItem.chart,
                    // save state
                    reflowUpdate = {
                        hcJSON: {
                            series: [{
                                startAngle: chart.datasets[0].startAngle
                            }]
                        }
                    };
                if (!chart.disposed) {
                    extend2(chart.logic.chartInstance.jsVars._reflowData,
                                reflowUpdate, true);
                }
                /* The events mouseup, dragend and click are raised in order. In order
                 * to update the flag isRotating to false post click event, setTimeout
                 * called, to take immediate effect, is programmed to update the flag.
                 * Thus, the flag gets updated post the series of events, in effect.
                 * NB: Click event is subscribed conditionally.
                 */
                setTimeout(function () {
                    plotItem.seriesData.isRotating = false;
                }, 0);

            },

            plotDragMove: function (dx, dy, x, y, evt) {
                var plotItem = this,
                    chart = plotItem.chart,
                    dataset = chart.datasets[0],
                    seriesData = plotItem.seriesData,
                    datasets = chart.options.series,
                    angle,
                    currentTime,
                    deltaAngle;

                if (!datasets[0].enableRotation || seriesData.singletonCase) {
                    return;
                }
                seriesData.isRotating = true;

                angle = getClickArcTangent.call(evt, x, y, seriesData.pieCenter,
                                                          seriesData.chartPosition, dataset.pieYScale);

                deltaAngle = angle - dataset.dragStartAngle;

                dataset.dragStartAngle = angle;
                seriesData.moveDuration = 0;

                dataset._lastAngle += (deltaAngle * 180 / mathPI);
                currentTime = new Date().getTime();

                if (!dataset._lastTime || (dataset._lastTime + seriesData.timerThreshold < currentTime)) {
                    if(!dataset._lastTime){
                        chart.rotate();
                    }
                    seriesData.timerId  = setTimeout(function () {
                        if (!chart.disposed || !chart.disposing) {
                            chart.rotate();
                        }
                    }, seriesData.timerThreshold);
                    dataset._lastTime  = currentTime;
                }
            },

            animate: function(plotItems, animationDuration) {
                var i,
                    mainElm,
                    animObj,
                    len = plotItems.length,
                    point,
                    graphic,
                    args,
                    up,
                    chart = this,
                    start,
                    end,
                    alphaAnim = chart.datasets[0].alphaAnimation;

                if (alphaAnim) {
                    chart.layers.dataset.attr({opacity: 0});
                    chart.layers.dataset.animate({opacity: 1}, animationDuration, 'ease-in', function () {
                        if (chart.disposed || chart.disposing) {
                            return;
                        }
                        chart.placeDataLabels(false, plotItems);
                    });
                }
                else {
                    for (i = 0; i < len; i++) {
                        point = plotItems[i],
                        graphic = point.graphic,
                        args = point.shapeArgs,
                        up = 2 * mathPI;

                        // start values
                        if (graphic) {
                            graphic.attr({
                                start: up,
                                end: up
                            });

                           start = args.start;
                           end = args.end;

                           /* Raphael animation do not support start and end attributes.
                            * Since the attribute setting for Pie3D goes through attrFN
                            * method of Pie3DManager, we can safely use some unused
                            * attributes for pie3D to pass through Raphael animation module
                            * and trap the attributes to convert to start and end in attrFN */
                           if (!mainElm) {
                               animObj = R.animation({
                                    cx: start - up,
                                    cy: end - up
                                }, animationDuration, 'ease-in', function () {
                                            if (chart.disposed || chart.disposing) {
                                                return;
                                            }
                                            chart.placeDataLabels(false, plotItems);
                                        });

                               mainElm = graphic.animate(animObj);
                           }
                           else {
                               graphic.animateWith(mainElm, animObj, {
                                                        cx: start - up,
                                                        cy: end - up
                                                    }, animationDuration, 'ease-in');
                           }
                        }
                    };
                }
            },

            plotGraphicClick: function () {
               var plotItem = this,
                   seriesData = plotItem.seriesData,
                   chart = plotItem.chart,
                   index = plotItem.index,
                   graphic,
                   connector,
                   dataLabel,
                   sliced,
                   slicedTranslation,
                   connectorPath,
                   transX,
                   transY,
                   reflowData,
                   reflowUpdate;

               if (seriesData.isRotating  || seriesData.singletonCase) {
                   return;
               }

               graphic = plotItem.graphic;
               connector = plotItem.connector;
               dataLabel = plotItem.dataLabel;
               sliced = plotItem.sliced;
               slicedTranslation = plotItem.slicedTranslation;
               connectorPath = plotItem.connectorPath;
               transX = (sliced ? -1 : 1) * plotItem.transX;
               transY = (sliced ? -1 : 1) * plotItem.transY;

               graphic.animate({
                   transform: sliced ? 't0,0' : 't' + transX +','+ transY
               }, 200, 'easeIn');

               if (dataLabel && dataLabel.x) {
                   dataLabel.animate({
                       x: dataLabel.x + (sliced ? 0 : transX)
                   }, 200, 'easeIn');
               }

               if (connectorPath) {
                   connectorPath[1] += transX;
                   connectorPath[2] += transY;
                   connectorPath[4] += transX;
                   connectorPath[6] += transX;

                   connector.animate({
                       path: connectorPath
                   }, 200, 'easeIn');
               }

               sliced = plotItem.sliced = !sliced;

               // save state
                reflowUpdate = {
                    hcJSON: {
                        series: []
                    }
                };
                reflowUpdate.hcJSON.series[0] = {
                    data: reflowData = []
                };
                reflowData[index] = {sliced: sliced};
                extend2(chart.logic.chartInstance.jsVars._reflowData,
                            reflowUpdate, true);

                return sliced;
           },

            placeDataLabels: (function () {
                /*
                 * Pie Helper Functions.
                 */
                var sortArrayByPoint = function (a, b) {
                    return a.point.value - b.point.value;
                },
                sortArrayByAngle = function (a, b) {
                    return a.angle - b.angle;
                },
                alignments = ['start', 'start', 'end', 'end'],
                alignCenter = 'middle',
                ySign = [-1, 1, 1, -1],
                xSign = [1, 1, -1, -1];

                return function(isRotating, plotItems) {
                    var chart = this,
                        dataset = chart.datasets[0],
                        plotOptions = chart.options.plotOptions,
                        smartLabel = chart.smartLabel,
                        dataLabelsOptions = plotOptions.series.dataLabels,
                        style = dataLabelsOptions.style,
                        lineHeight = pluckNumber(mathCeil(parseFloat(style.lineHeight)), 12),
                        placeInside = getFirstValue(
                                        dataLabelsOptions.placeInside, false),
                        skipOverlapLabels = dataLabelsOptions.skipOverlapLabels,
                        manageLabelOverflow = dataLabelsOptions.manageLabelOverflow,
                        connectorPadding = dataLabelsOptions.connectorPadding,
                        distanceOption = dataLabelsOptions.distance,
                        

                        softConnector = getFirstValue(
                                            dataLabelsOptions.softConnector, true),
                        connectorWidth = dataLabelsOptions.connectorWidth,
                        connector,
                        connectorPath,
                        outside = distanceOption > 0,
                        remainingHeight,
                        center = dataset.center,
                        centerY = center[1],
                        centerX = center[0],
                        radius = center[2],
                        radiusY = center[4],
                        quarters = [// divide the points into quarters for anti collision
                            [], // top right
                            [], // bottom right
                            [], // bottom left
                            [] // top left
                        ],
                        quarter,
                        align,
                        i,
                        plotLeft = chart.canvasLeft,
                        plotTop = chart.canvasTop,
                        plotWidth = chart.canvasWidth,
                        labelWidth,
                        j,
                        oriY,
                        maxYmayHave,
                        spaceRequired,
                        length,
                        k,
                        sliced,
                        x1,
                        x2,
                        x3,
                        y1,
                        y2,
                        y3,
                        x4,
                        points,
                        point,
                        angle,
                        dataLabelsRadius = dataset.labelsRadius,
                        dataLabelsRadiusY = mathRound(dataset.labelsRadiusY * 100) / 100,
                        excess,
                        excessArr,
                        labelFontSize = dataset.labelFontSize,
                        labelHeight = labelFontSize,
                        halfLabelHeight = labelHeight / 2,
                        xDisplacement = [connectorPadding,
                                         connectorPadding,
                                         -connectorPadding,
                                         -connectorPadding],
                        maxLabels = dataset.maxLabels,
                        isSmartLineSlanted = dataset.isSmartLineSlanted,
                        enableSmartLabels = dataset.enableSmartLabels,
                        labelQuardentHeight,
                        maxQuardentLabel,
                        dataLabel,
                        pieSliceDepthHalf = dataset.pieSliceDepth / 2,
                        transX,
                        transY,
                        smartLabelObj;

                    if (!isRotating) {
                        //do not set the style every time
                        // Do it for first time
                        smartLabel.setStyle(style);
                    }

                    // arrange points for detection collision
                    // Creates an array of quarter containing labels of each quarter
                    //if there has only one label the draw it inside
                    if (plotItems.length == 1) {
                        point = plotItems[0];
                        dataLabel = point.dataLabel;
                        point.slicedTranslation = [plotLeft, plotTop];
                        if (dataLabel) {
                            dataLabel.attr({
                                visibility: VISIBLE,
                                "text-anchor": alignCenter,
                                x: centerX,
                                y: centerY + halfLabelHeight - 2
                            });
                            dataLabel.x = centerX;
                        }
                    }
                    else {
                        if (placeInside){
                            each(plotItems, function (point) {
                                dataLabel = point.dataLabel;
                                if (dataLabel) {
                                    angle = point.angle;
                                    y3 = centerY + (center[6] * mathSin(angle)) + halfLabelHeight - 2;
                                    x3 = centerX + (center[5] * mathCos(angle));
                                    dataLabel.x = x3;
                                    // storing original x value
                                    // to use while slicing in (IE Issue original x get changed form animate)
                                    dataLabel._x = x3;

                                    dataLabel.y = y3;
                                    if (point.sliced) {
                                        var slicedTranslation = point.slicedTranslation,
                                        transX = slicedTranslation[0] - plotLeft,
                                        transY = slicedTranslation[1] - plotTop;
                                        x3 = x3 + transX;
                                        y3 = y3 + transY;
                                    }
                                    dataLabel.attr({
                                        visibility: VISIBLE,
                                        align: alignCenter,
                                        x: x3,
                                        y: y3
                                    });
                                }
                            });
                        }
                        else {//outside
                            each(plotItems, function(point) {
                                dataLabel = point.dataLabel;
                                if (dataLabel) {
                                    angle = point.angle;

                                    if (angle < 0) {
                                        angle = pi2 + angle;
                                    }
                                    // Calculate top right quarter labels
                                    if (angle >= 0 && angle < piBy2) {
                                        quarter = 1;
                                    } else
                                    // Calculate bottom right quarter labels
                                    if (angle < pi) {
                                        quarter = 2;
                                    } else
                                    // Calculate bottom left quarter labels
                                    if (angle < (pi3By2)) {
                                        quarter = 3;
                                    }
                                    // Calculate bottom left quarter labels
                                    else {
                                        quarter = 0;
                                    }
                                    // Now put labels according to each quarter
                                    quarters[quarter].push({
                                        point : point,
                                        angle : angle
                                    });
                                }
                            });

                            i = k = 4;
                            //if excess then remove the low value slice first
                            while (i --) {
                                if (skipOverlapLabels) {
                                    // Find labels can fit into the quarters or not
                                    excess = quarters[i].length - maxLabels;
                                    if (excess > 0) {
                                        quarters[i].sort(sortArrayByPoint); // sort by point.y
                                        // remove extra data form the array
                                        // which labels can not be fitted into the quarters
                                        excessArr = quarters[i].splice(0, excess);
                                        //hide all removed labels
                                        for (j = 0, length = excessArr.length; j < length; j += 1) {
                                            point = excessArr[j].point;
                                            point.dataLabel.attr({
                                                visibility: HIDDEN
                                            });
                                            if (point.connector) {
                                                point.connector.attr({
                                                    visibility: HIDDEN
                                                });
                                            }
                                        }
                                    }
                                }
                                // now we sort the data labels by its label angle
                                quarters[i].sort(sortArrayByAngle);
                            }

                            maxQuardentLabel = mathMax(
                                    quarters[0].length,
                                    quarters[1].length,
                                    quarters[2].length,
                                    quarters[3].length
                                );
                            labelQuardentHeight = mathMax(
                                    mathMin(maxQuardentLabel, maxLabels) * labelHeight,
                                    dataLabelsRadiusY + labelHeight
                                );

                            // reverse 1st and 3rd quardent points
                            quarters[1].reverse();
                            quarters[3].reverse();
                            smartLabel.setStyle(style);

                            while (k --) {
                                points = quarters[k];
                                length = points.length;

                                if (!skipOverlapLabels) {
                                    if (length > maxLabels) {
                                        labelHeight = labelQuardentHeight / length;
                                    }
                                    else {
                                        labelHeight = labelFontSize;
                                    }
                                    halfLabelHeight = labelHeight / 2;
                                }

                                //1st pass
                                //place all labels at 1st quarter

                                // calculate the total available space to put labels
                                spaceRequired = length * labelHeight;
                                // calculate the remaining height
                                remainingHeight = labelQuardentHeight;
                                //place all child point
                                for (i = 0; i < length; i += 1, spaceRequired -= labelHeight) {
                                    // Get the y position of the label (radius where data label is to draw)
                                    oriY = mathAbs(labelQuardentHeight * mathSin(points[i].angle));
                                    if (remainingHeight < oriY) {
                                        oriY = remainingHeight;
                                    }
                                    else if (oriY < spaceRequired) {
                                        oriY = spaceRequired;
                                    }
                                    remainingHeight = (points[i].oriY = oriY) - labelHeight;
                                }

                                //2nd pass(reverse)
                                align = alignments[k];
                                //place all labels at 1st quarter
                                maxYmayHave = labelQuardentHeight - ((length - 1) * labelHeight);
                                remainingHeight = 0;

                                //place all child point
                                for (i = points.length - 1; i >= 0; i -= 1, maxYmayHave += labelHeight) {
                                    point = points[i].point;
                                    angle = points[i].angle;
                                    sliced = point.sliced;
                                    dataLabel = point.dataLabel;

                                    oriY = mathAbs(labelQuardentHeight * mathSin(angle));

                                    if (oriY < remainingHeight) {
                                        oriY = remainingHeight;
                                    }
                                    else if (oriY > maxYmayHave) {
                                        oriY = maxYmayHave;
                                    }

                                    remainingHeight = oriY + labelHeight;

                                    y1 = ((oriY + points[i].oriY) / 2);
                                    x1 = centerX + xSign[k] * dataLabelsRadius * mathCos(math.asin(y1 / labelQuardentHeight));

                                    y1 *= ySign[k];
                                    y1 += centerY;

                                    y2 = centerY + (radiusY * mathSin(angle));
                                    x2 = centerX + (radius * mathCos(angle));

                                    // Relation: centerX <= connectorStartX <= connectorEndX (for right half and vice versa for left half)
                                    (k < 2 && x1 < x2 || k > 1 && x1 > x2) && (x1 = x2);

                                    x3 = x1 + xDisplacement[k];
                                    y3 = y1 + halfLabelHeight - 2;
                                    x4 = x3 + xDisplacement[k];

                                    dataLabel.x = x4;
                                    // storing original x value
                                    // to use while slicing in (IE Issue original x get changed form animate)
                                    dataLabel._x = x4;

                                    if (manageLabelOverflow) {
                                        labelWidth = k > 1 ? x4 - chart.canvasLeft: chart.canvasLeft + plotWidth - x4;
                                        smartLabelObj = smartLabel.getSmartText(point.labelText, labelWidth, lineHeight);
                                        dataLabel.attr({
                                            text: smartLabelObj.text,
                                            title: (smartLabelObj.tooltext || '')
                                        });
                                    }

                                    //shift the labels at front pieSliceDepthHalf
                                    if (angle < pi) {
                                        y1 += pieSliceDepthHalf;
                                        y2 += pieSliceDepthHalf;
                                        y3 += pieSliceDepthHalf;
                                    }

                                    dataLabel.y = y3;
                                    if (sliced) {

                                        transX = point.transX;
                                        transY = point.transY;
                                        x3 = x3 + transX;
                                        x1 = x1 + transX;
                                        x2 = x2 + transX;
                                        y2 = y2 + transY;
                                        x4 = x4 + transX;
                                    }
                                    dataLabel.attr({
                                        visibility: VISIBLE,
                                        'text-anchor': align,
                                        x: x4,
                                        y: y1
                                    });

                                    //draw the connector
                                    // draw the connector
                                    if (outside && connectorWidth && enableSmartLabels) {
                                        connector = point.connector;

                                        point.connectorPath = connectorPath = [
                                        M,
                                        x2, y2, // base
                                        L,
                                        isSmartLineSlanted ? x1 : x2, y1, // first break, next to the label
                                        x3, y1  // end of the string at the label
                                        ];

                                        if (connector) {
                                            connector.attr({
                                                path: connectorPath
                                            });
                                            connector.attr('visibility', VISIBLE);

                                        } else {
                                            point.connector = connector = chart.paper.path(connectorPath).attr({
                                                'stroke-width': connectorWidth,
                                                stroke: dataLabelsOptions.connectorColor || '#606060',
                                                visibility: VISIBLE
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            }()),

            legendClick: function(plot, isVisible, restrainEvent) {
                var chart = plot.chart,
                    plots = plot.chart.elements.plots[0];
                plots.isRotating = false;
                chart.plotGraphicClick.call(plot);

                if (restrainEvent !== true) {
                    // fire legenditemclicked event
                    eventArgs = {
                        datasetName: plot.label,
                        datasetIndex: plot.originalIndex,
                        id: plot.userID,
                        visible: isVisible,
                        label: plot.label,
                        value: plot.value,
                        percentValue: plot.percentage,
                        tooltext: plot.toolText,
                        link: plot.link,
                        sliced: !plot.sliced
                    };
                    global.raiseEvent('legenditemclicked', eventArgs, chart.logic.chartInstance);
                }
            }
        }, renderer['renderer.root']);

        renderer('renderer.pie', {

            drawPlotPie: function(plot, dataOptions) {
                var chart = this,
                    plotItems = plot.items,
                    plotData = plot.data,
                    options = chart.options,
                    plotOptions = options.plotOptions,
                    piePlotOptions = plotOptions.pie,
                    plotSeries = plotOptions.series,
                    layers = chart.layers,
                    datasetLayer = layers.dataset,
                    seriesData = chart.elements.plots[0],
                    dataLabelOptions = plotOptions.series.dataLabels,
                    plotAnimation = plotSeries.animation,
                    seriesDataLabelsStyle = plotSeries.dataLabels.style,
                    seriesShadow = plotSeries.shadow,
                    animationDuration = pluckNumber(plot.moveDuration,
                                                        plotAnimation.duration),
                    paper = chart.paper,
                    tooltipOptions = options.tooltip || {},
                    isTooltip = tooltipOptions && tooltipOptions.enabled !== false,
                    toolText,
                    startAngle = ((dataOptions.startAngle *= -pi / 180) || 0) % pi2,
                    slicedOffset = piePlotOptions.slicedOffset,
                    valueTotal = dataOptions.valueTotal,
                    factor = pi2 / valueTotal,
                    cx = chart.canvasLeft + chart.canvasWidth * 0.5,
                    cy = chart.canvasTop + chart.canvasHeight * 0.5,
                    r = piePlotOptions.size * 0.5,
                    r2 = (piePlotOptions.innerSize || 0) * 0.5,
                    plotGraphicClick = chart.plotGraphicClick,
                    plotDragMove = chart.plotDragMove,
                    plotDragStart = chart.plotDragStart,
                    plotDragEnd = chart.plotDragEnd,
                    plotMouseDown = chart.plotMouseDown,
                    plotMouseUp = chart.plotMouseUp,
                    enableRotation = !!chart.datasets[0].enableRotation,
                    dataLength = plotData.length,
                    plotItem,
                    set,
                    color,
                    val,
                    displayValue,
                    setLink,
                    sliced,
                    isHot,
                    angle,
                    angle1,
                    angle2,
                    connectorWidth,
                    shadowGroup = plot.shadowGroup,
                    i,
                    mainElm,
                    animObj,
                    iniStartAngle,
                    iniEndAngle;

                // Spare the world if no data has been sent
                if (!(plotData && dataLength)) {
                    plotData = [];
                }

                if (!shadowGroup) {
                    shadowGroup = plot.shadowGroup = paper.group(datasetLayer).toBack();
                }

                seriesData.singletonCase = (dataLength == 1);
                // Log the chart position for calculating mouse xy.
                seriesData.chartPosition || (seriesData.chartPosition = getPosition(chart.container));
                seriesData.pieCenter = [cx, cy];
                seriesData.timerThreshold = 30;

                angle1 = startAngle;
                angle2 = startAngle;

                i = dataLength;
                while (i--) {
                    set = plotData[i];
                    val = set.y;
                    displayValue = set.displayValue;
                    sliced = set.sliced;
                    toolText = set.toolText;
                    setLink = !!set.link;
                    isHot = setLink || enableRotation || !set.doNotSlice;

                    if (val === null || val === undefined) {
                        continue;
                    }

                    color = set.color.FCcolor;
                    color.r = r;
                    color.cx = cx;
                    color.cy = cy;

                    angle2 = angle1;
                    // This conditional assignment of value 2 * pi is to by-pass a
                    // computational error inherent to any computer system, which
                    // happens here for certain values in singleton cases.
                    angle1 -= !seriesData.singletonCase ? val * factor : pi2;
                    angle = (angle1 + angle2) * 0.5;

                    if (animationDuration) {
                        iniStartAngle = iniEndAngle = startAngle;
                    }
                    else {
                        iniStartAngle = angle1;
                        iniEndAngle = angle2;
                    }
                    if (!(plotItem = plotItems[i])) {
                        dataOptions.data[i].plot = plotItem = plotItems[i] = {
                            chart: chart,
                            index: i,
                            seriesData: seriesData,
                            value: val,
                            angle: angle,
                            slicedX: mathCos(angle) * slicedOffset,
                            slicedY: mathSin(angle) * slicedOffset,
                            sliced: sliced,
                            labelText: displayValue,
                            toolText: toolText,
                            label: set.name,
                            link: set.link,
                            percentage: valueTotal ? val * valueTotal / 100 : 0,
                            originalIndex: dataLength - i - 1,

                            graphic: paper.ringpath(cx, cy, r, r2, iniStartAngle, iniEndAngle, layers.dataset).attr({
                                    'stroke-width': set.borderWidth,
                                    'stroke-linejoin': 'round',
                                    'stroke': set.borderColor,
                                    fill: toRaphaelColor(set.color),
                                    'stroke-dasharray': set.dashStyle,
                                    redrawDataLabels: startAngle,
                                    ishot: isHot,
                                    cursor: setLink ? 'pointer' : ''
                                })
                                .shadow(seriesShadow && set.shadow, shadowGroup)
                                .drag(plotDragMove, plotDragStart, plotDragEnd)
                                .mousedown(plotMouseDown)
                                .mouseup(plotMouseUp)
                        };

                        if (!set.doNotSlice) {
                            plotItem.graphic.click(plotGraphicClick);
                        }

                        isTooltip && plotItem.graphic.tooltip(toolText);

                        // attach legend click event handler for slice
                        dataOptions.data[i].legendClick = (function (plotItem) {
                            return function () {
                                chart.legendClick(plotItem, true, false);
                            };
                        }(plotItem));

                        plotItem.graphic.data('plotItem', plotItem);

                        if (displayValue !== undefined) {
                            plotItem.dataLabel = paper.text(datasetLayer)
                                .css(seriesDataLabelsStyle)
                                .attr({
                                    text: displayValue,
                                    fill: seriesDataLabelsStyle.color || "#000000",
                                    ishot: isHot
                                })
                                .click(plotGraphicClick)
                                .drag(plotDragMove, plotDragStart, plotDragEnd)
                                .mousedown(plotMouseDown)
                                .mouseup(plotMouseUp)
                                .hide();

                            plotItem.dataLabel.data('plotItem', plotItem);

                            if (dataLabelOptions.distance > 0 &&
                                (connectorWidth = dataLabelOptions.connectorWidth) &&
                                               dataLabelOptions.enableSmartLabels) {
                                plotItem.connector = paper.path('M 0 0 l 0 0', datasetLayer).attr({
                                    'stroke-width': connectorWidth,
                                    stroke: dataLabelOptions.connectorColor || '#606060',
                                    visibility: VISIBLE,
                                    ishot: true
                                })
                                .click(plotGraphicClick)
                                .drag(plotDragMove, plotDragStart, plotDragEnd)
                                .mousedown(plotMouseDown)
                                .mouseup(plotMouseUp);

                                plotItem.connector.data('plotItem', plotItem);
                             }
                        }
                    }

                    plotItem.angle = angle;
                    plotItem.transX = mathCos(angle) * slicedOffset;
                    plotItem.transY = mathSin(angle) * slicedOffset;

                    plotItem.slicedTranslation = 't' +
                        (mathCos(angle) * slicedOffset) + ',' +
                        (mathSin(angle) * slicedOffset);


                    if (animationDuration) {
                        if (!mainElm) {
                            animObj = R.animation({
                                ringpath: [cx, cy, r, r2, angle1, angle2],
                                redrawDataLabels: chart,
                                transform: plotItem.sliced ? plotItem.slicedTranslation : ''
                            }, animationDuration, 'easeIn', function () {
                                if (chart.disposed || chart.disposing) {
                                    return;
                                }
                                if (!chart.paper.ca.redrawDataLabels) {
                                    chart.placeDataLabels(false, plotItems, plot);
                                    chart.paper.ca.redrawDataLabels = chart.redrawDataLabels;
                                }
                            });
                            mainElm = plotItem.graphic.animate(animObj);
                        }
                        else {
                            plotItem.graphic.animateWith(mainElm, animObj, {
                                ringpath: [cx, cy, r, r2, angle1, angle2],
                                transform: plotItem.sliced ? plotItem.slicedTranslation : ''
                            }, animationDuration, 'easeIn');
                        }
                    }
                    else {
                        plotItem.graphic.attr({transform: plotItem.sliced ? plotItem.slicedTranslation : ''});
                    }
                }
                if (!animationDuration) {
                    chart.placeDataLabels(false, plotItems, plot);
                }
            },

            rotate: function (plot, dataOptions) {
                var chart = this,
                    plotItems = plot.items,
                    plotData = plot.data,
                    options = chart.options,
                    plotOptions = options.plotOptions,
                    piePlotOptions = plotOptions.pie,
                    layers = chart.layers,
                    startAngle = (dataOptions.startAngle || 0) % pi2,
                    slicedOffset = piePlotOptions.slicedOffset,
                    factor = pi2 / dataOptions.valueTotal,
                    cx = chart.canvasLeft + chart.canvasWidth * 0.5,
                    cy = chart.canvasTop + chart.canvasHeight * 0.5,
                    r = piePlotOptions.size * 0.5,
                    r2 = (piePlotOptions.innerSize || 0) * 0.5,
                    plotItem,
                    set,
                    val,
                    angle,
                    angle1,
                    angle2,
                    i;

                angle1 = angle2 = startAngle;

                i = plotData.length;
                while (i--) {
                    set = plotData[i];
                    val = set.y;

                    if (val === null || val === undefined) {
                        continue;
                    }

                    plotItem = plotItems[i];

                    angle2 = angle1;
                    // This conditional assignment of value 2 * pi is to by-pass a
                    // computational error inherent to any computer system, which
                    // happens here for certain values in singleton cases.
                    angle1 -= !plotItem.seriesData.singletonCase ? val * factor : pi2;
                    angle = (angle1 + angle2) * 0.5;

                    plotItem.angle = angle;
                    plotItem.transX = mathCos(angle) * slicedOffset;
                    plotItem.transY = mathSin(angle) * slicedOffset;

                    plotItem.slicedTranslation = 't' +
                        (mathCos(angle) * slicedOffset) + ',' +
                        (mathSin(angle) * slicedOffset);

                    plotItem.graphic.attr({
                        ringpath: [cx, cy, r, r2, angle1, angle2],
                        transform: plotItem.sliced ? plotItem.slicedTranslation : ''
                    });
                }

                chart.placeDataLabels(true, plotItems, plot);
            }

        }, renderer['renderer.piebase']);

    }, [3, 2, 2, 'sr4']]);
/*jslint forin: true, regexp: true, todo: true, white: false, browser: true,
 sloppy: true, white: true, eqeq: false, newcap: true, nomen: true */
/*global window: true, FusionCharts, parseFloat:true, Math:true */

/**
 * FusionCharts JavaScript Library
 * ZoomLine visualization module extension comprising visualization logic as
 * well as renderer adapter.
 */
FusionCharts(['private', 'modules.renderer.js-zoomline', function () {
    var global = this,
        lib = global.hcLib,
        userAgent = navigator.userAgent,
        win = window,
        isIE = /msie/i.test(userAgent) && !win.opera,
        chartapi = lib.chartAPI,
        renderer = lib.chartAPI,
        extend2 = lib.extend2,
        raiseEvent = lib.raiseEvent,
        pluck = lib.pluck,
        pluckNumber = lib.pluckNumber,
        getFirstColor = lib.getFirstColor,
        convertColor = lib.graphics.convertColor,
        defaultPalette = lib.defaultPaletteOptions,
        bindSelectionEvent = lib.bindSelectionEvent,
        parseTrendlines = lib.createTrendLine,
        parseUnsafeString = lib.parseUnsafeString,
        R = lib.Raphael,

        CONFIGKEY = lib.FC_CONFIG_STRING,
        G = 'g',
        PIPE = '|',
        DOT = '.',
        BLANK = '',
        TRACKER_FILL = 'rgba(192,192,192,'+ (isIE ? 0.002 : 0.000001) +')', // invisible but clickable
        UNDEF,

        math = Math,
        mathCeil = math.ceil,
        mathFloor = math.floor,
        mathMax = math.max,
        mathMin = math.min,
        mathCos = math.cos,
        mathSin = math.sin,
        toStr = String,
        toFloat = parseFloat,
        toInt = parseInt,

        regescape = function(text) {
            return text && text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        },

        CrossLine; // function (constructor)

    // Add events to the legacy event list
    extend2(lib.eventList, {
        zoomed: 'FC_Zoomed',
        pinned: 'FC_Pinned',
        resetzoomchart: 'FC_ResetZoomChart'
    });

    chartapi('zoomline', {
        friendlyName: "Zoomable and Panable Multi-series Line Chart",
        rendererId: 'zoomline',
        standaloneInit: true,
        hasVDivLine : true,
        defaultSeriesType : 'stepzoom',
        canvasborderthickness: 1,
        defaultPlotShadow: 1,

        chart: function () {
            var hc = this.base.chart.apply(this, arguments),
                chartDef = this.dataObj.chart,
                canvasBorderColor = defaultPalette.canvasBorderColor[this.paletteIndex],
                optionsChart = hc.chart;

            // Copy and prepare some configurations for zoom charts
            extend2(optionsChart, {
                animation: false,
                zoomType: 'x',
                canvasPadding: pluckNumber(chartDef.canvaspadding, 0),
                scrollColor: getFirstColor(pluck(chartDef.scrollcolor,
                    defaultPalette.altHGridColor[optionsChart.paletteIndex])),
                scrollBtnWidth: pluckNumber(chartDef.scrollbtnwidth,
                    chartDef.scrollheight, 16),
                scrollHeight: pluckNumber(chartDef.scrollheight, 16) || 16,

                allowPinMode: pluckNumber(chartDef.allowpinmode, 1),
                skipOverlapPoints: pluckNumber(chartDef.skipoverlappoints, 1),
                showToolBarButtonTooltext: pluckNumber(chartDef.showtoolbarbuttontooltext, 1),
                btnResetChartTooltext: pluck(chartDef.btnresetcharttooltext, 'Reset Chart'),
                btnZoomOutTooltext: pluck(chartDef.btnzoomouttooltext, 'Zoom out one level'),
                btnSwitchToZoomModeTooltext: pluck(chartDef.btnswitchtozoommodetooltext,
                    '<strong>Switch to Zoom Mode</strong><br/>Select a subset of data to zoom into it for detailed view'),
                btnSwitchToPinModeTooltext: pluck(chartDef.btnswitchtopinmodetooltext,
                    '<strong>Switch to Pin Mode</strong><br/>Select a subset of data and compare with the rest of the view'),
                /* @note pinPaneStroke related attribute parsing is unused in
                 * present JS ZoomLine implementation.
                pinPaneStrokeWidth: pluckNumber(chartDef.pinpaneborderthickness, 1),
                pinPaneStroke: convertColor(pluck(chartDef.pinpanebordercolor,
                    canvasBorderColor), pluckNumber(chartDef.pinpaneborderalpha, 15)),
                 */
                pinPaneFill: convertColor(pluck(chartDef.pinpanebgcolor,
                    canvasBorderColor), pluckNumber(chartDef.pinpanebgalpha, 15)),
                zoomPaneFill: convertColor(pluck(chartDef.zoompanebgcolor,
                    '#b9d5f1'), pluckNumber(chartDef.zoompanebgalpha, 30)),
                zoomPaneStroke: convertColor(pluck(chartDef.zoompanebordercolor,
                    '#3399ff'), pluckNumber(chartDef.zoompaneborderalpha, 80))
            });

            return hc;
        },

        preSeriesAddition: function () {
            var definition = this.dataObj,
                chartDef = definition.chart,

                categories = (categories = definition.categories) &&
                    categories[0] || {},
                categoryItems = categories.category,

                hc = this.hcJSON,
                conf = hc[CONFIGKEY],
                smartLabel = this.smartLabel,

                cdm = pluckNumber(chartDef.compactdatamode, 0),
                cdmchar = pluck(chartDef.dataseparator, PIPE),

                showLabels = pluckNumber(chartDef.showlabels, 1),
                labelDisplayMode = chartDef.labeldisplay &&
                    chartDef.labeldisplay.toLowerCase(),
                labelHeight = showLabels && pluckNumber(chartDef.labelheight),
                rotateLabels = (labelDisplayMode === 'rotate') ? 270 :
                    (pluckNumber(chartDef.rotatelabels, 1) ? 270 : 0),
                labelStyle = hc.xAxis.labels.style,
                lineHeight = toFloat(labelStyle.lineHeight),
                labelPadding = hc.chart.labelPadding =
                    pluckNumber(chartDef.labelpadding, 2) + hc.chart.plotBorderWidth,

                data,
                cats,
                clen,
                label,
                maxlen = 0,
                maxlenindex = -1,
                i,
                l,
                elm,
                mle,
                key;

            // Copy the categories into vlogic. Use same detach and re-attach
            // method of original category array while merging.
            delete categories.category;
            hc.categories = cats = extend2({
                data: data = cdm && categoryItems &&
                    categoryItems.split && categoryItems.split(cdmchar) ||
                    categoryItems || [],
                rotate: rotateLabels,
                wrap: (labelDisplayMode !== 'none')
            }, categories);
            (categoryItems !== UNDEF) && (categories.category = categoryItems);
            clen = data.length || 0;

            // For non-compact mode clean up categories and that is not needed
            // when user asked to not show labels.
            if ((i = !cdm && showLabels && (labelHeight !== 0) && clen || 0)) {
                while (i--) {
                    data[i] = data[i] && (label = data[i].label || BLANK) &&
                            (((l = label.length) > maxlen) &&
                            (maxlen = l, maxlenindex = i, label) || label) || BLANK;
                }
                if (maxlen) { // fetch the label with maximum length
                    label = data[maxlenindex];
                }
            }
            // For compact data mode, the previous loop will not run, thus the
            // max label width needs to be calculated.
            else if (cdm && clen) {
                 // hen labels are not rotated, this will be useless.
                if (rotateLabels) {
                    elm = win.document.createElement('div');
                    mle = win.document.createElement('span');
                    elm.setAttribute("class", "fusioncharts-zoomline-localsmartlabel");
                    elm.style.cssText = "display:block;width:1px;position:absolute;";
                    for (key in labelStyle) {
                        elm.style[key] = labelStyle[key];
                    }
                    mle.appendChild(win.document.createTextNode(categoryItems.replace(/\s*/g, '').replace(/\|/g, ' ')));
                    elm.appendChild(mle);
                    win.document.body.appendChild(elm);
                    labelHeight = mle.offsetWidth || UNDEF;
                    elm.parentNode.removeChild(elm);
                }
                // For non rotated labels, we choose the last or first label.
                

                else {
                    label = data[clen - 1] || data[0];
                }
            }

            // Check the size of first label and set the default height
            if ((labelHeight === UNDEF || labelHeight === 0) && showLabels) {
                // In case label is enabled, calculate the label height from the
                // first and last label.
                if (label) {
                    smartLabel.setStyle(labelStyle);
                    label = smartLabel.getSmartText(label);
                    labelHeight = rotateLabels ? label.width : label.height;
                }
                else {
                    labelHeight = lineHeight * (rotateLabels && 3 || 1);
                }
            }

            // Validate final labelHeight
            if (labelHeight > conf.height * 0.3) {
                labelHeight = conf.height * 0.3;
            }

            cats.labelHeight = labelHeight && (labelHeight + 10) || 0;
            cats.show = labelHeight && showLabels || 0;
            cats.css = extend2({}, labelStyle);
            if (rotateLabels) {
                cats.css.rotation = rotateLabels;
                cats.css['text-anchor'] = 'end';
                // Set label rotation for slant labels
//                if (rotateLabels && chartDef.slantlabels === '1') {
//                    cats.css.rotation += 45;
//                }
            }
            else {
                cats.css['vertical-align'] = 'top';
            }

            hc.xAxis.min = 0;
            hc.xAxis.max = clen && clen - 1 || 0;

            // Do some space management to include scroller and labels,
            labelHeight += (pluckNumber(chartDef.scrollheight, 16) || 16);
            // compensate space manager for increased height of padding
            hc.chart.marginBottom += labelPadding;
            conf.marginBottomExtraSpace += labelHeight + 5; // extra padding

            // Add space for buttons if caption/subcaption is not defined
            if (!pluck(chartDef.caption, chartDef.subcaption)) {
                conf.marginTopExtraSpace += 16;
            }
        },

        series: function () {
            var definition = this.dataObj,
                chartDef = definition.chart,
                datasets = definition.dataset,

                hc = this.hcJSON,
                conf = hc[CONFIGKEY],
                legacyYAxisConf = conf[0],
                series = hc.series,

                userYMax = pluckNumber(chartDef.yaxismaxvalue),
                userYMin = pluckNumber(chartDef.yaxisminvalue),
                forceLimits = pluckNumber(chartDef.forceyaxislimits, 0),
                cdm = pluckNumber(chartDef.compactdatamode, 0),
                cdmchar = pluck(chartDef.dataseparator, PIPE),
                inxchar = regescape(chartDef.indecimalseparator),
                inmchar = regescape(chartDef.inthousandseparator),

                showAnchors = pluckNumber(chartDef.drawanchors, chartDef.showanchors, 1),
                showLegend = !!pluckNumber(chartDef.showlegend, 1),
                anchorAttrs,

                dataset,
                serie,
                dataDef,
                data,
                val,
                ppp,
                ppl,
                dsi,
                dei,
                clen,
                dmin = Infinity,
                dmax = -Infinity,
                i,
                ii,
                j;

            // Expecting pre-series addition to have parsed categories by now.
            clen = hc.categories.data.length; // Get actual category length

            // Validate presence of categories and datasets.
            if (!(datasets && datasets.length && clen)) {
                return;
            }

            // Prepare regexes for decimal and thousand separator
            inxchar && (inxchar = new RegExp(inxchar, G));
            inmchar && (inmchar = new RegExp(inmchar, G));

            // Check whether user specified options allow skipping of axis
            // min-max calculation. InThousandSeparator, inDecimalSeparator and
            // non-compact mode will override forceability.
            if (!inmchar && !inxchar && cdm && forceLimits &&
                    userYMax !== UNDEF && userYMin !== UNDEF) {
                forceLimits = true;
                dmax = mathMax(userYMax, userYMin);
                dmin = mathMin(userYMin, userYMax);
            }
            else {
                forceLimits = false;
            }

            // Iterate over dataset definition and create plot objects for future
            // use. During copy, perform extension while keeping the heavy
            // data out of the dataset. Later, after merging, put it back in.
            

            for (i = 0, ii = datasets.length; i < ii; i++) {
                dataset = datasets[i];
                dataDef = dataset.data;
                delete dataset.data; // put aside data from def for fast extend

                // Depending upon CDM status, we parse the data as a text or
                // as an array.
                if (cdm) {
                    data = dataDef || BLANK;
                    // In CDM, we do a check for indecimal and in-thousand
                    // separator at the string-level.
                    inmchar && (data = data.replace(inmchar, BLANK));
                    inxchar && (data = data.replace(inxchar, DOT));
                    data = data.split(cdmchar);
                }
                else {
                    // for non CDM, we simply re-use the definition as source
                    // and perform all formatting later.
                    data = dataDef || [];
                }

                // If data length is greater than category, we normalize it.
                // We do not normalize here in case categories are more to save
                // iteration.
                if (data.length > clen) {
                    data.length = clen;
                };

                // Iterate on data and normalize it. While doing that, find out
                // min and max and replace all non number entries with undefined.
                j = data.length;
                if (cdm) {
                    if (!forceLimits) while (j--) {
                        val = toFloat(data[j]);
                        if (isNaN(val)) { 

                            val = UNDEF;
                        }
                        if (val > dmax) { dmax = val; }
                        if (val <= dmin) { dmin = val; }
                        data[j] = val;
                    }
                }
                // using separate loop for non cdm to save logical checks in loop.
                else {
                    while (j--) {
                        val = data[j] && data[j].value || BLANK;
                        // Perform in decimal and in thousand sanitizations.
                        inmchar && (val = val.replace(inmchar, BLANK));
                        inxchar && (val = val.replace(inxchar, DOT));
                        val = toFloat(val);

                        if (isNaN(val)) {
                            val = UNDEF;
                        }

                        if (val > dmax) { dmax = val; }
                        if (val <= dmin) { dmin = val; }
                        data[j] = val;
                    }
                }

                series.push(serie = {
                    index: i,
                    type: 'zoomline',
                    data: data,
                    name: dataset.seriesname || BLANK,

                    showInLegend: dataset.seriesname &&
                        pluckNumber(dataset.includeinlegend, 1) && showLegend || false,
                    showAnchors: pluckNumber(dataset.drawanchors,
                        dataset.showanchors, showAnchors),
                    visible: !!pluckNumber(dataset.initiallyvisible, 1),
                    lineWidth: 2 // for legend
                });

                data.length = clen; // Normalize array size
                (dataDef !== UNDEF) && (dataset.data = dataDef); // restore def

                // Set some attributes in series, needed by drawing.
                serie.attrs = this.seriesGraphicsAttrs(dataset, i);
                anchorAttrs = serie.attrs.anchors;
                serie.color = serie.attrs.graphics.stroke;
                serie.ancorRadius = anchorAttrs.r + anchorAttrs['stroke-width'] / 2;
                serie.marker = { // for legend
                    fillColor: anchorAttrs.fill,
                    lineColor: anchorAttrs.stroke,
                    lineWidth: 1,
                    symbol: 'circle'
                };
            }

            // In case min-max has not been detected from data and not even
            // provided by user, we set it to undefined as default.
            (dmax === -Infinity || dmin === Infinity) && (dmax = dmin = undefined);

            // Validate and parse the data display indices and also calculate
            // initial pixels-per-point.
            dsi = toInt(pluckNumber(chartDef.displaystartindex, 1), 10) - 1;
            dei = toInt(pluckNumber(chartDef.displayendindex, clen || 2), 10) - 1;
            ((ppp = pluckNumber(chartDef.pixelsperpoint, 15)) < 5) && (ppp = 5);
            ((ppl = pluckNumber(chartDef.pixelsperlabel, hc.categories.rotate ?
                20 : 60)) < ppp) && (ppl = ppp);

            // start index must be positive and less than end. last index must
            // not be greater than category count.
            (dsi < 0 || dsi >= ((clen - 1) || 1)) && (dsi = 0);
            (dei <= dsi || dei > ((clen - 1) || 1)) && (dei = (clen - 1) || 1);

            hc.stepZoom = {
                cnd: pluckNumber(chartDef.connectnulldata, 0), // connectNullData
                amrd: pluckNumber(chartDef.anchorminrenderdistance, 20), // anchor render distance
                nvl: pluckNumber(chartDef.numvisiblelabels, 0), // num visible labels
                cdm: cdm, // compact data mode
                oppp: ppp, // original pixels per point
                oppl: ppl, // original pixels per label
                dsi: dsi, // dislay start index
                dei: dei, // display end index
                vdl: dei - dsi, // visible display length
                dmax: legacyYAxisConf.max = dmax, // max value of all data
                dmin: legacyYAxisConf.min = dmin, // min value of all data
                clen: clen, // category length and data length

                // Internal variables required for zoom state.
                offset: 0, // (internal) drawing offset for smooth scroll,
                step: 1, // (internal) default stepping or skipping,
                llen: 0, // (internal) number of labels
                alen: 0, // (internal) length of anchors already drawn
                ddsi: dsi, // (internal) dynamic display start as per scroll
                ddei: dei, // (internal) dynamic display end as per scroll
                ppc: 0 // (internal) pixels per category
            };

            hc.crossline = {
                style: {
                    lineHeight: conf.inCanvasStyle.lineHeight,
                    fontSize: conf.inCanvasStyle.fontSize,
                    fontFamily: conf.inCanvasStyle.fontFamily
                }
            };

            // Configure divlines and alternate grids.
            this.configureAxis(hc, definition);

            // Parse trendlines
            if (definition.trendlines) {
                parseTrendlines(definition.trendlines, hc.yAxis, conf,
                    false, this.isBar);
            }
        },

        seriesGraphicsAttrs: function (dataset, index) {
            var cdef = this.dataObj.chart,
                colors = this.hcJSON.colors,
                dashed = (dataset.dashed || cdef.linedashed || '0') != 0,
                graphics,
                pin,
                pgsw; // pinGraphicsStrokeWidth

            graphics = {
                'stroke-width': pluckNumber(dataset.linethickness,
                    cdef.linethickness, 2),
                stroke: getFirstColor(pluck(dataset.color, cdef.linecolor,
                    colors[index % colors.length])),
                'stroke-opacity': pluckNumber(dataset.alpha,
                    cdef.linealpha, 100) / 100,
                'stroke-dasharray': dashed ? [pluckNumber(dataset.linedashlen,
                    cdef.linedashlen, 5), pluckNumber(dataset.linedashgap,
                    cdef.linedashgap, 4)] : 'none',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round'
            };

            // pin line graphics is same as main graphics except a few changes
            pin = extend2({}, graphics);
            pgsw = graphics['stroke-width'] + pluckNumber(cdef.pinlinethicknessdelta, 1);
            pin['stroke-width'] = pgsw > 0 && pgsw || 0;
            pin['stroke-dasharray'] = [3, 2];

            return {
                graphics: graphics,
                pin: pin,
                shadow: {
                    opacity: graphics['stroke-opacity'],
                    apply: pluckNumber(cdef.showshadow, +!R.vml)
                },
                anchors: {
                    'stroke-linejoin': 'round',
                    'stroke-linecap': 'round',
                    r: pluckNumber(dataset.anchorradius, cdef.anchorradius, graphics['stroke-width'] + 2),
                    stroke: getFirstColor(pluck(dataset.anchorbordercolor,
                        cdef.anchorbordercolor, graphics.stroke)),
                    'stroke-opacity': pluckNumber(dataset.anchorborderalpha,
                        cdef.anchorborderalpha, 100) / 100,
                    'stroke-width': pluckNumber(dataset.anchorborderthickness,
                        cdef.anchorborderthickness, graphics['stroke-width']),
                    fill: getFirstColor(pluck(dataset.anchorbgcolor,
                        cdef.anchorbgcolor, '#ffffff')),
                    'fill-opacity': pluckNumber(dataset.anchorbgalpha,
                        cdef.anchorbgalpha, 100) / 100,
                    'opacity': pluckNumber(dataset.anchoralpha, cdef.anchoralpha,
                        100) / 100
                },
                anchorShadow: pluckNumber(cdef.anchorshadow, cdef.showshadow, +!R.vml) && {
                    apply: true,
                    opacity: pluckNumber(dataset.anchoralpha, cdef.anchoralpha,
                        100) / 100
                }
            };
        },

        eiMethods: {
            zoomOut: function () {
                var vars = this.jsVars,
                    chart;

                if (!(vars && (chart = vars.hcObj))) {
                    return;
                }

                return chart.zoomOut && vars.hcObj.zoomOut();
            },

            zoomTo: function (dsi, dei) {
                var vars = this.jsVars,
                    chart;

                if (!(vars && (chart = vars.hcObj))) {
                    return;
                }

                return chart.zoomRange && vars.hcObj.zoomRange(dsi, dei-2);
            },

            resetChart: function () {
                var vars = this.jsVars,
                    chart;

                if (!(vars && (chart = vars.hcObj))) {
                    return;
                }

                chart.pinRangePixels && vars.hcObj.pinRangePixels();
                chart.resetZoom && vars.hcObj.resetZoom();
            },

            setZoomMode: function (yes) {
                var vars = this.jsVars,
                    chart;

                if (!(vars && (chart = vars.hcObj))) {
                    return;
                }

                if (yes) {
                    chart.pinRangePixels && vars.hcObj.pinRangePixels();
                }
                else {

                }
            },

            getViewStartIndex: function () {
                var vars = this.jsVars,
                     zi;

                if (!(vars && vars.hcObj && (zi = vars.hcObj._zoominfo))) {
                    return;
                }
                return zi.ddsi + 1;

            },

            getViewEndIndex: function () {
                var vars = this.jsVars,
                     zi,
                     vei;

                if (!(vars && vars.hcObj && (zi = vars.hcObj._zoominfo))) {
                    return;
                }

                vei = zi.ddei - 1;
                return vei > zi.clen ? zi.clen : vei;
            }
        }

    }, chartapi.msline);

    renderer('renderer.zoomline', {

        resetZoom: function () {
            var chart = this,
                history = chart._zoomhistory,
                origInfo = chart.options.stepZoom;

            // cannot reset twice!
            if (!history.length) {
                return false;
            }

            history.length = 0; // clear history
            if (chart.zoomTo(origInfo.dsi, origInfo.dei)) {
                raiseEvent('resetzoomchart', chart._zoomargs,
                    chart.fusionCharts, [chart.fusionCharts.id]);
            }

            return true;
        },

        zoomOut: function () {
            var chart = this,
                history = chart._zoomhistory,
                lastinfo = history.pop(), // access the last history
                origInfo = chart.options.stepZoom,
                dsi,
                dei,
                args;

            if (lastinfo) {
                dsi = lastinfo.dsi;
                dei = lastinfo.dei;
            }
            // If zoom level is less than 1, it is equivalent to reset.
            else {
                // But, in case chart was initially zoomed, we need to zoom out
                // to full view.
                if (chart._prezoomed) {
                    dsi = 0;
                    dei = origInfo.clen - 1;
                }
            }

            if (args = chart.zoomTo(dsi, dei)) {
                global.raiseEvent('zoomedout', args, chart.fusionCharts);
            }

            return true;
        },

        zoomRangePixels: function (pxs, pxe) {
            var chart =  this,
                history = chart._zoomhistory,
                info = chart._zoominfo,
                ppp = info.ppp,
                start = info.ddsi,
                args;

            history.push(chart._zoominfo); // push current state to history

            // Peform function equvalent to this.getValuePixel().
            // Code repeated here for lesser performance penalty of function
            // call.
            if (args = chart.zoomTo(start + mathFloor(pxs / ppp),
                    start + mathFloor(pxe / ppp))) {
                // Raise event on successful zoom.
                global.raiseEvent('zoomedin', args, chart.fusionCharts);
            }
            else {
                // If zooming has failed then pop the history state that we
                // pushed earlier.
                history.pop();
            }

        },

        zoomRange: function (dsi, dei) {
            var chart =  this,
                history = chart._zoomhistory,
                args;

            history.push(chart._zoominfo); // push current state to history

            if (args = chart.zoomTo(+dsi - 1, +dei + 1)) {
                // Raise event on successful zoom.
                global.raiseEvent('zoomedin', args, chart.fusionCharts);
            }
            else {
                // If zooming has failed then pop the history state that we
                // pushed earlier.
                history.pop();
            }
        },

        zoomTo: function (dsi, dei) {
            var chart = this,
                labels = chart.xlabels.data,
                info = chart._zoominfo,
                newinfo,
                history = chart._zoomhistory,
                clen = info.clen,
                args;

            // Detect max zoom and update the zoom history.
            // start index must be positive and less than end. last index must
            // not be greater than category count.
            (dsi < 0) && (dsi = 0);
            (dsi >= clen - 1) && (dsi = clen - 1);
            (dei <= dsi) && (dei = dsi + 1);
            (dei > clen - 1) && (dei = clen - 1);

            // Find the final zoom level and bail out.
            if (dsi === dei || (dsi === info.dsi && dei === info.dei)) {
                return false;
            }

            // Revert pin mode, in case it is active.
            chart.pinRangePixels();

            // Derive new zoom state from existing state.
            newinfo = extend2({}, info);
            newinfo.dsi = dsi;
            newinfo.dei = dei;
            info = chart._zoominfo = newinfo; // set current state

            chart.updatePlotZoomline();

            // Show reset button when zoom history is long enough and always show
            // zoom out button on every zoom-in.
            chart.zoomOutButton[info.vdl === info.clen - 1 ? 'hide' : 'show']();
            chart.resetButton[history.length ? 'show' : 'hide']();

            chart.elements.zoomscroller.attr({
                'scroll-ratio': info.vdl / (clen - !!clen),
                'scroll-position': [info.dsi / (clen - info.vdl - 1), true]
            });

            // Raise "Zoomed" event
            args = {
                level: history.length + 1,
                startIndex: dsi,
                startLabel: labels[dsi],
                endIndex: dei,
                endLabel: labels[dei]
            };

            raiseEvent('zoomed', args, chart.fusionCharts, [
                chart.fusionCharts.id, dsi, dei, args.startLabel, args.endLabel,
                args.level]);

            return args;
        },

        activatePin: function (yes) {
            var chart =  this,
                info = chart._zoominfo,
                options = chart.options,
                optionsChart = options.chart,
                button = chart.pinButton;

            // Checking for button is an indirect way to check if pinning is
            // allowed.
            if (!button) {
                return;
            }

            // If pin is already active and "yes" is true then we get lost.
            if (!(info.pinned ^ (yes = !!yes))) {
                return;
            }

            if (!yes) {
                // Call pin range with no range to deactivate pin.
                chart.pinRangePixels();
            }

            optionsChart.showToolBarButtonTooltext &&
                    button.tooltip(optionsChart[yes &&
                    'btnSwitchToZoomModeTooltext' ||
                    'btnSwitchToPinModeTooltext'] || BLANK);
            button.attr('button-active', yes);

            return (info.pinned = yes);
        },

        pinRangePixels: function (pxs, pxe) {
            var chart = this,
                paper = chart.paper,
                layers = chart.layers,
                elements = chart.elements,
                labels = chart.xlabels.data,
                optionsChart = chart.options.chart,
                info = chart._zoominfo,
                pingroup = layers.zoompin,
                pinrect = elements.pinrect,
                pinclip = elements['clip-pinrect'],
                pingrouptransform = chart._pingrouptransform,
                plots = chart.plots,
                pxw = pxe - pxs,
                plot,
                pinline,
                i;

            // Find the no-pin situation and bailout.
            if (!info || !pingroup || !pinrect) {
                return;
            }

            // Hide
            if (pxs === pxe) {
                pingroup.hide();
                elements.pintracker.hide();
                chart.pinButton.attr('button-active', false);
                return info.pinned = false;
            }

            // Iterate over plots and copy the lines.
            i = plots.length;
            while (i--) {
                plot = plots[i];
                pinline = plot.pinline;
                if (!pinline) {
                    pinline = plot.pinline = paper.path(UNDEF, pingroup)
                        .attr(plot.attrPin);
                }
                pinline.attr('path', plot.graphic.attrs.path);
            }

            // Adjust the cliprect to the new x amd width.
            

            pinclip[0] = pxs + (R.svg ? chart.canvasLeft : 0);
            pinclip[2] = pxw;
            pingroup.attr({
                'clip-rect': pinclip,
                'transform': pingrouptransform
            }).show();
            elements.pintracker.__pindragdelta = 0; // dragging helper
            elements.pintracker.show().attr({
                transform: pingrouptransform,
                x: pxs,
                width: pxw
            });

            // store the dsi and dei in px variables for raising in events
            pxs = chart.getValuePixel(pxs);
            pxe = chart.getValuePixel(pxe);
            raiseEvent('pinned', {
                startIndex: pxs,
                endIndex: pxe,
                startLabel: labels[pxs],
                endLabel: labels[pxe]
            }, chart.fusionCharts, [chart.fusionCharts.id, pxs, pxe,
                labels[pxs], labels[pxe]]);

            // state pin state in meta.
            return info.pinned = true;
        },

        getValuePixel: function (px) {
            var info = this._zoominfo;
            return info.ddsi + mathFloor(px / info.ppp);
        },

        getParsedLabel: function (index) {
            var xlabels = this.xlabels;
            return xlabels.parsed[index] ||
                (xlabels.parsed[index] =
                    parseUnsafeString(xlabels.data[index] || BLANK));
        },

        drawGraph: function () {
            var chart = this,
                paper = chart.paper,
                plotX = chart.canvasLeft,
                plotY = chart.canvasTop,
                plotW = chart.canvasWidth,
                plotH = chart.canvasHeight,
                options = chart.options,
                optionsChart = options.chart,
                plotBW = optionsChart.plotBorderWidth,
                roundEdges = optionsChart.useRoundEdges,
                tooltip = optionsChart.showToolBarButtonTooltext,
                layers = chart.layers,
                toolbar = chart.toolbar,
                elements = chart.elements,
                allowpin = optionsChart.allowPinMode,
                yzero,
                cats = options.categories,
                preZoomed = false,
                pinclip,
                pinrect,
                pingroup,
                datalayer,
                scrollerLayer,
                visx,
                visw,
                info,
                tAtt;

            // Set initial zoom information
            info = chart._zoominfo = extend2({}, options.stepZoom);
            chart._zoomhistory = [];

            // If yAxis is not built for any reason, we know that there is
            // something wrong with data source and most probably there is no
            // data. Thus we exit
            if (!info.clen) {
                return;
            }

            // Do a check whether user has initially zoomed. That would
            // mean to keep zoomOut button visible and also to create a
            // fake first zoom level.
            preZoomed = chart._prezoomed = (info.dei - info.dsi < info.clen - 1);

            // Set the visual dimensions of plot inside canvas.
            visw = chart._visw = chart.canvasWidth - optionsChart.canvasPadding * 2;
            visx = chart._visx = chart.canvasLeft + optionsChart.canvasPadding;
            chart._visout = -(chart.chartHeight + chart.canvasHeight + 1e3);

            // Call the original drawgraph to perform series level common
            // actions and prepare axis.
            chart.base.drawGraph.apply(chart, arguments);

            // Get the y-axis pixel value ratio and store for later use.
            chart._ypvr = chart.yAxis[0] && chart.yAxis[0].pixelValueRatio || 0;
            yzero = chart._yzero || 0;

            // Clip the dataset layer to required dimension. This layer will be
            // scrolled by the scroller
            datalayer = layers.dataset.attr('clip-rect', [chart._visx, chart.canvasTop,
                chart._visw, chart.canvasHeight]);
            scrollerLayer = layers.scroll || (layers.scroll =
                paper.group('scroll').insertAfter(layers.layerAboveDataset));

            // Prepare groups and other related items for x-axis labels.
            chart.xlabels = [];
            chart.xlabels.show = cats.show;
            chart.xlabels.height = cats.labelHeight;
            chart.xlabels.wrap = cats.wrap;
            chart.xlabels.rotate = cats.rotate;
            chart.xlabels.data = cats.data || [];
            chart.xlabels.parsed = []; // store texts parsed for {br}
            chart.xlabels.css = cats.css;
            chart.xlabels.group = paper.group('zoomline-plot-xlabels',
                layers.datalabels);
            layers.datalabels.transform(['T', visx, plotY + plotH +
                        optionsChart.scrollHeight + optionsChart.labelPadding]);
            chart._lcmd = cats.rotate ? 'y' : 'x';

            // Create the group to store pinlines. We do it here as it is easier
            // to transform that way.
            if (allowpin)  {
                // Create the pin graphics. We create a background that sits atop the
                // canvas and is clipped to match size later.
                tAtt = R.crispBound(0, plotY - yzero, 0, plotH, plotBW);
                

                pinclip = elements['clip-pinrect'] =
                    [tAtt.x, R.svg ? plotY : tAtt.y, tAtt.width, tAtt.height];
                pingroup = layers.zoompin = paper.group('zoompin')
                    .insertBefore(datalayer)
                    .transform(chart._pingrouptransform = ['T', visx, yzero]).hide();

                pinrect = elements.pinrect = paper.rect(0, plotY - yzero,
                    chart._visw, plotH, layers.zoompin).attr({
                    'stroke-width': 0,
                    stroke: 'none',
                    fill: optionsChart.pinPaneFill,
                    'shape-rendering': 'crisp',
                    ishot: true
                });

                // draw pin tracker
                elements.pintracker = paper.rect(layers.tracker).attr({
                    transform: pingroup.transform(),
                    x: 0,
                    y: plotY - yzero,
                    width: 0,
                    height: plotH,
                    stroke: 'none',
                    fill: TRACKER_FILL,
                    ishot: true,
                    cursor: R.svg && 'ew-resize' || 'e-resize'
                }).drag(function (_dx) {
                    var offset = visx + _dx + this.__pindragdelta,
                        pbl = this.__pinboundleft,
                        pbr = this.__pinboundright;

                    // Restrict to boundaries.
                    if (offset < pbl) {
                        offset = pbl;
                    }
                    else if (offset > pbr) {
                        offset = pbr;
                    }

                    pingroup.transform(['T', offset, yzero]);
                    elements.pintracker.transform(pingroup.transform());
                    this.__pindragoffset = _dx;
                }, function () {
                    // Calculate the pin bounds.
                    

                    this.__pinboundleft = 0 - pinclip[0] + visx + (R.svg && plotX || 0);
                    this.__pinboundright = this.__pinboundleft + visw - pinclip[2];

                    // temporarily mark the group as if it is a clip path and
                    // not a clip rect. This is to prevent raphael's internal
                    // matrix inversion on clipping.
                    pingroup._.clipispath = true;
                }, function () {
                    pingroup._.clipispath = false; // reset clip behaviour
                    // store the last delta movement so that dragging can be
                    // resumed on next drag on same pin instance.
                    this.__pindragdelta = this.__pindragoffset;

                    // delete unneeded flags and accumulators;
                    delete this.__pindragoffset;
                    delete this.__pinboundleft;
                    delete this.__pinboundright;
                });

                // Draw the button for pin mode
                chart.pinButton = toolbar.add('pinModeIcon', function () {
                    var info = chart._zoominfo;
                    chart.activatePin(!info.pinned);
                }, {
                    tooltip: tooltip && optionsChart.btnSwitchToPinModeTooltext || BLANK
                });
            }

            // Draw the scrollbars and perform the initial configuration of
            // the scrollbars.
            // First crispen the scroller position to keep it in sync with the
            // canvas. We temporarily increment plotborderwidth to account for
            // the 1 pixel stroke width of scrollbar.
            plotBW++;
            tAtt = R.crispBound(plotX - plotBW, plotY + plotH + plotBW,
                plotW + plotBW + plotBW, optionsChart.scrollHeight, plotBW);
            plotBW--; // revert the temporary increment
            // During creation of the scroller element, we check for the
            // "useRoundEdges" options and based on that, match the visuals and
            // positioning of the scrollbar with the canvas. We shift it up
            // slightly when useRoundEdges is on; so that it covers the lower
            // round edges of the canvas.
            elements.zoomscroller = paper.scroller(tAtt.x + (roundEdges && -1 ||
                    (plotBW % 2)), tAtt.y - (roundEdges && 4 || 2),
                    tAtt.width - (!roundEdges && 2 || 0), tAtt.height, true, {
                showButtons: true,
                scrollRatio: info.vdl / (info.clen - !!info.clen), // standard
                scrollPosition: [info.dsi / (info.clen - info.vdl - 1), false]
            }, scrollerLayer).attr({
                'fill': optionsChart.scrollColor,
                r: roundEdges && 2 || 0
            }).scroll(chart.updatePlotZoomline, chart);
            roundEdges && elements.zoomscroller.shadow(true);

            // Bind pin and zoom selection events.
            bindSelectionEvent(chart, function (o) {
                // Calculate the pixel start and pixel end of the selection.
                var pxs = o.selectionLeft - plotX,
                    pxe = pxs + o.selectionWidth;

                // In case chart crossline is available and visible, we hide it.
                // In all cases, on selection end, the crossline is not needed
                // to be visible.
                chart.crossline && chart.crossline.hide();
                // Based on the flag status of pin mode, we send the selection
                // pixels to either pinRange or zoomRange functions.
                chart[chart._zoominfo.pinned ?
                    'pinRangePixels' : 'zoomRangePixels'](pxs, pxe);
            }, {
                attr: {
                    stroke: optionsChart.zoomPaneStroke,
                    fill: optionsChart.zoomPaneFill,
                    strokeWidth: 0
                }
            });

            // Draw the buttons for zoom and add the on click event handlers.
            // These are teeny weeny handlers and as such is not prematurely
            // optimised.
            chart.zoomOutButton = toolbar.add('zoomOutIcon', function () {
                chart.zoomOut();
            }, {
                tooltip: tooltip && optionsChart.btnZoomOutTooltext || BLANK
            })[preZoomed && 'show' || 'hide']();

            chart.resetButton = toolbar.add('resetIcon', function () {
                chart.resetZoom();
            }, {
                tooltip: tooltip && optionsChart.btnResetChartTooltext || BLANK
            }).hide();

            // Remove fill from reset button
            tAtt = chart.resetButton.attr('fill');
            tAtt[2] = 'rgba(255,255,255,0)';
            chart.resetButton.attr('fill', [tAtt[0], tAtt[1], tAtt[2], tAtt[3]]);

            // Create the crosshair and its related events. The crossline
            // constructor is self aware and independently configures itself
            // from the chart options.
            chart.crossline = new CrossLine(chart);

            // Create the plots based on defult values.
            chart.updatePlotZoomline();
        },

        /**
         * This is the plot drawing function that is executed by the
         * root/cartesian renderer. For ZoomLine chart, the nature of this
         * function is not to draw the plots. Rather, its jobs is to prepare
         * relevant layers (groups) and initial graphics required by the actual
         * plot drawing function.
         *
         * @param {object} plot
         * @param {object} options
         * @returns {undefined}
         */
        drawPlotZoomline: function (plot, options) {
            var chart = this,
                paper = chart.paper,
                yZero = chart._yzero ||
                    (chart._yzero = chart.yAxis[0].getAxisPosition(0)),
                attrs = options.attrs,
                visible = options.visible,
                showOrHide = visible ? 'show' : 'hide',

                // Locate the layer where this dataset needs be inserted.
                layers = chart.layers,
                layer = layers.dataset,
                plotgroup = plot.group ||
                    (plot.group = paper.group('plot-zoomline-dataset', layer)),
                anchorgroup = plot.anchorGroup ||
                    (plot.anchorGroup = paper.group('plot-zoomline-anchors', layer)),
                graphic = plot.graphic ||
                    (plot.graphic = paper.path(UNDEF, plotgroup)),

                groupTransform = ['T', chart._visx, yZero];

            // Translate the plot and anchors to the zero-plane position of axis.
            plotgroup.transform(groupTransform)[showOrHide]();
            anchorgroup.transform(groupTransform)[showOrHide]();

            // Cosmetic attributes for the plot lines
            plot.graphic = graphic.attr(attrs.graphics).shadow(attrs.shadow);
            plot.attrPin = attrs.pin;

            // Create an array to store anchor elements,
            plot.visible = visible;
            plot.anchors = [];
            plot.anchors.show = options.showAnchors;
            plot.anchors.attrs = attrs.anchors; // store attrs for later
            plot.anchors.attrsShadow = attrs.anchorShadow;
            // Calculate the left and right bounds of the canvas accounting for
            // the anchor radius.
            plot.anchors.left = -(attrs.anchors.r +
                attrs.anchors['stroke-width'] * 0.5);
            plot.anchors.right = chart._visw - plot.anchors.right;
        },

        /**
         *
         * @param {type} pos
         * @param {type} info
         * @returns {undefined}
         */
        updatePlotZoomline: function (pos, info) {
            var chart = this,
                paper = chart.paper,
                ypvr = chart._ypvr,
                visW = chart._visw,

                labels = chart.xlabels,
                cssLabel = labels.css,
                labelGroup = labels.group,
                plots = chart.plots,
                plot,
                label,
                anchors,
                anchorGroup,
                attrAnchor,

                oppp, // target pixels-per-point
                vdl, // visible display length
                ppl, // num visible labels
                ppp, // current pixels-per-point
                step, // stepping on vdl to reach target ppp
                lskip, // label stepping
                norm, // normalizer of vdl to allow smooth scrolling
                dsi, // display start index
                dei, // display end index
                ddsi, // dynamic dsi post normalization
                ddei, // dynamic dei post normalization
                len, // divisions of vdl derived from stepping
                oldlen, // previous divs
                deltalen, // change in divisions
                ppc, // pixels per category
                i,
                j,
                jj;

            // Use default config if none has been provided else extend current
            // state.
            !info && (info = chart._zoominfo);

            // Calculate stepping values here. This is required so that the
            // number of anchors can be recalculated prior to updating plot.
            oppp = info.oppp,
            ppl = info.nvl,
            dsi = info.dsi,
            dei = info.dei,
            vdl = info.vdl = dei - dsi;
            ppl = info.ppl = info.nvl ? visW / info.nvl : info.oppl;

            // Calculate label and anchor stepping.
            step = info.step = ((ppp = info.ppp = visW / vdl) < oppp) ?
                mathCeil(oppp / ppp) : 1;
            lskip = info.lskip = mathCeil(ppl / ppp / step);

            // If scroll position is provided, we recalculate indices and
            // ignore what has been sent via zoom info.
            // We do not put position calculation in a separate function to
            // avoid repeated recalculations
            if (pos !== UNDEF) {
                ddsi = (info.clen - vdl - 1) * pos ;
                info.offset = (ddsi - (ddsi = toInt(ddsi))) * ppp;
                ddei = ddsi + vdl;
            }
            else {
                ddsi = info.dsi;
                ddei = info.dei;
                info.offset = 0;
            }
            norm = info.norm = ddsi % step;

            // normalize the indices
            info.ddsi = (ddsi = ddsi - norm);
            info.ddei = (ddei = ddei + 2 * step - norm);
            info.pvr = ypvr;

            // Calculate the label length
            len = labels.show ? mathCeil((ddei - ddsi) / step / lskip) : 0;
            oldlen = info.llen - 1;
            info.llen = len;
            ppc = info.ppc = ppp * lskip * step; // pixels between two x-labels

            // Iterate over the labels and update them.
            // Add new anchor elements or if added, show them.
            if (len > oldlen) {
                for (j = oldlen, jj = len; j < jj; j++) {
                    (label = labels[j]) && label.show() ||
                        (labels[j] = paper.text(0, 0, BLANK, labelGroup).css(cssLabel));
                }
            }
            // Hide extra label elements.
            else {
                for (j = len, jj = oldlen + 1; j < jj; j++) {
                    labels[j].hide();
                }
            }
            // Calculate amount of anchors that will be visible. Until amrd is reached,
            // all labels should be hidden. (re-use the previous len variables)
            len = (ppp * step < info.amrd) ? 0 : mathCeil((ddei - ddsi) / step);
            deltalen = len - info.alen;
            oldlen = info.alen - 1;
            info.alen = len; // Update anchor length.

            // store category label dimensions for faster access later
            if (labels.wrap) {
                if (labels.rotate) {
                    labels._width = labels.height;
                    labels._height = ppc;
                }
                else {
                    labels._width = ppc;
                    labels._height = labels.height;
                }
            }

            i = plots.length;
            // Iterate on the plots and set its graphics based on current
            // zoom level.
            while (i--) {
                plot = plots[i];
                anchors = plot.anchors;

                // Process anchors only when it is destined to be shown.
                if (anchors.show && deltalen) {
                    anchorGroup = plot.anchorGroup;
                    attrAnchor = anchors.attrs;

                    // Add new anchor elements or if added, show them.
                    for (j = 0, jj = len; j < jj; j++) {
                        anchors[j] = anchors[j] && anchors[j].show() ||
                            paper.circle(0, 0, 0, plot.anchorGroup).attr(attrAnchor);
                    }
                    // Hide extra anchor elements.
                    for (j = len, jj = anchors.length; j < jj; j++) {
                        anchors[j] && anchors[j].hide();
                    }
                }
                chart.drawPlotZoomlineGraphics(info, plot.data, plot.graphic,
                    anchors, !i && labels);
            }

            if (window.FC_DEV_ENVIRONMENT) {
                if (FusionCharts.debugMode.enabled()) {
                    this.debug = this.debug || ($('#fc-zoominfo').length || $('body').append('<pre id="fc-zoominfo">'), $('#fc-zoominfo').css({
                        position: 'absolute',
                        left: '10px', top: '0',
                        'pointer-events': 'none',
                        opacity: 0.7,
                        width: '250px',
                        zIndex: '999',
                        border: '1px solid #cccccc',
                        'box-shadow': '1px 1px 3px #cccccc',
                        background: '#ffffff'
                    }));
                    this.debug.text(JSON.stringify(info, 0, 2));
                }
                else {
                    $('#fc-zoominfo').remove();
                    delete this.debug;
                }
            }

        },

        drawPlotZoomlineGraphics: function (info, data, element, anchors, labels) {
            var smartLabel = this.smartLabel,
                path = [],
                ncnd = !info.cnd, // connectNullData
                ddsi = info.ddsi, // dynamic display start index (pos based)
                ddei = info.ddei, // dynamic display end index (pos based)
                clen = info.clen, // number of data points
                step = info.step, // stepping that can fit target pixels per point
                lskip = info.lskip, // label stepping
                ppp = info.ppp, // pixels per point
                norm = info.norm, // normalizer to have uniform stepping
                offset = info.offset, // scroll offset
                pvr = info.pvr, // pixel value ratio for y-axis
                visw = this._visw,
                outside = this._visout, // a value that puts poit out of area

                // A gazillion counters!
                lcmd = this._lcmd,
                lx,
                cmd = "M",
                val,
                text,
                label = labels && labels[0],
                labelTexts = label && labels.data,
                labelHeight,
                labelWidth,
                anchor = anchors[0],
                attr = {},
                attrLabel = {},
                ax,
                //amin = anchors.left, // left unused since anchors are clipped
                //amax = anchors.right, // left unused since anchors are clipped
                x,
                px,
                y,
                c = 0,
                d,
                attrs,
                wrap,
                p = -norm,
                i = ddsi,
                ii = ddei,
                nulls = 0;


            // Transform the label group to the offset for smooth scrolling
            if (label) {
                labels.group.transform(['T', -offset, 0]);
                wrap = labels.wrap;
                labelHeight = labels._height;
                labelWidth = labels._width;
            }

            // Iterate between the specified start and end index.
            for (; i <= ii; i += step, p += step) {
                d = c / 3 + nulls;
                px = p * ppp;
                lx = px - offset;
                if ((val = data[i]) === UNDEF) {
                    // Account for connecting null data
                    ncnd && (cmd = "M");
                    // Shift null anchors outside plot.
                    x = ax = outside;
                    lx = px - offset; // but keep labels inside
                    y = outside;
                    nulls++;
                }
                else {
                    path[c++] = cmd;
                    path[c++] = x = ax = lx = px - offset;
                    path[c++] = y = val * pvr;
                    cmd = "L";
                }

                // Update anchor position and point to the next anchor.
                // (ax < amin || ax > amax) && (ax = outside)
                anchor && (anchor = anchor.attr((attr.cx = ax, attr.cy = y, attr)).next);

                // Compute label position and stepping
                if (label && !(d % lskip)) {
                    attrs = label.attrs;
                    text = this.getParsedLabel(i);
                    lx = (lx < 0 || lx > visw) ? outside : px; // calculate bounds

                    (label._prevtext === text) ?
                        (delete attrLabel.text) : (attrLabel.text = label._prevtext = text);
                    attrs[lcmd] === lx ?
                        (delete attrLabel[lcmd]) : (attrLabel[lcmd] = lx);

                    wrap && text && (attrLabel.text =
                        smartLabel.getSmartText(text, labelWidth, labelHeight).text);
                    label = label.attr(attrLabel).next;
                }
            }

            // Add the right padding for continuing the lines spilt outside the
            // stepping range.
            if (ddei >= clen) {
                if ((val = data[clen - 1]) !== UNDEF) {
                    p -= (ddei - clen); 

                    path[c++] = "L";
                    path[c++] = p * ppp - offset;
                    path[c++] = val * pvr;
                }
                anchor && anchor.attr((attr.cx = outside, attr.cy = outside, attr));
            }

            element.attr('path', path);
        },

        legendClick: function (plot) {
            var visible = !plot.visible,
                showOrHide = visible ? 'show' : 'hide';

            plot.group[showOrHide]();
            plot.anchorGroup[showOrHide]();
            this.base.legendClick.apply(this, arguments);

            return plot.visible = visible;

        }

    }, renderer['renderer.cartesian']);

    CrossLine = function (chart)  {
        // Create the tracker for crosshair. This is needed for mouse
        // tracking.
        var paper = chart.paper,
            plotX = this.left = chart._visx,
            plotW = this.width = chart._visw,
            plotY = chart.canvasTop,
            plotH = chart.canvasHeight,
            plotO = this._visout = chart._visout,
            plots = this.plots = chart.plots,
            datalayer = chart.layers.dataset,
            group = this.group = paper.group('crossline-labels', datalayer).attr({
                transform: ['T', plotX, chart._yzero]
            }),
            tracker = this.tracker = paper.rect(plotX, plotY, plotW, plotH, datalayer).attr({
                    stroke: 'none',
                    'stroke-width': 0,
                    fill: TRACKER_FILL
                }).toFront()
                    .mousedown(this.onMouseDown, this)
                    .mouseup(this.onMouseUp, this, true)
                    .mouseout(this.onMouseOut, this)
                    .mousemove(this.onMouseMove, this),
            line = this.line = paper.path(UNDEF, datalayer).attr({
                    path: ['M', plotX, plotY, 'l', 0, plotH],
                    'stroke-opacity': 0.2
                }).toBack(),
            labels = this.labels = paper.set(),
            labelStyle = chart.options.crossline.style,
            plot,
            plotColor,
            i,
            ii;

        // initially hidden
        this.hide();
        this.pixelRatio = chart._ypvr;

        this.positionLabels = chart.xlabels || {
            data: [],
            parsed: []
        };

        // Open closed function to access chart variables.
        this.getZoomInfo = function () {
            return chart._zoominfo;
        };

        this.getDataIndexFromPixel = function (px) {
            return chart.getValuePixel(px);
        };

        this.getPositionLabel = function (index) {
            return chart.getParsedLabel(index);
        };

        for (i = 0, ii = plots.length; i < ii; i++) {
            plot = plots[i];
            plotColor = plot.graphic.attrs.stroke;
            labels.push(paper.text(0, plotO, BLANK, group).css(labelStyle).attr({
                fill: plotColor,
                'text-bound': ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.2)', 1, 2]
            }));
        }
    };

    CrossLine.prototype.onMouseOut = function () {
        this.hide();
    };

    CrossLine.prototype.onMouseDown = function () {
        this.hide();
        this._mouseIsDown = true;
    };

    CrossLine.prototype.onMouseUp = function () {
        this.hide();
        delete this._mouseIsDown;
    };

    CrossLine.prototype.onMouseMove = function (e) {
        if (this._mouseIsDown) {
            return;
        }

        var info = this.getZoomInfo(),
            line = this.line,
            plotX = this.left,
            step = info.step,
            stepw = info.ppp * step,
            x = (e.layerX || e.x) - plotX,
            pos;

        x = (x += (stepw / 2) + info.offset) - x % (stepw);
        pos = (pos = this.getDataIndexFromPixel(x)) + pos % step;
        x -= info.offset;

        line.transform(['T', mathFloor(x), 0]);

        if (pos !== this.position || this.hidden) {
            this.position = pos;
            this.lineX = x;
            this.updateLabels();
        }
        this.hidden && this.show();
    };

    CrossLine.prototype.updateLabels = function () {
        var labels = this.labels,
            positionLabels = this.positionLabels,
            plots = this.plots,
            visw = this.width,
            position = this.position,
            x = this.lineX,
            flooredX = mathFloor(x),
            pvr = this.pixelRatio,
            plotOut = this._visout,
            plot,
            value;

        labels.forEach(function (label, i) {
            plot = plots[i];
            value = plot.data[position];
            label.attr({
                text: value + BLANK,
                x:  flooredX,
                y: (value === UNDEF || !plot.visible) ? plotOut : value * pvr,
                'text-anchor': (x <= 0) && 'start' || (x >= visw) && 'end' || 'middle'
            });
        });

        

        this.positionLabel && this.positionLabel.attr({
            x: x + this.left,
            text: this.getPositionLabel(position)
        });

    };

    CrossLine.prototype.show = function () {
        this.hidden = false;
        this.group.attr('visibility', 'visible');
        this.line.attr('visibility', 'visible');
        this.positionLabel && this.positionLabel.attr('visibility', 'visible');
    };

    CrossLine.prototype.hide = function () {
        this.hidden = true;
        this.group.hide();
        this.line.hide();
    };

    R.addSymbol({
        pinModeIcon: function (posx, posy, rad) {
            var x = posx,
                y = posy,
                r = rad,
                r1 = r * 0.5,
                r2 = r - r1,
                x1 = x - r,
                x2 = x + r,
                x3 = x - r1,
                x4 = x + r1,
                x5 = x - 0.5,
                x6 = x + 0.5,
                x7 = x6 + 1,
                x8 = x6 + 1.5,
                y1 = y - r,
                y2 = y + r1,
                y3 = y - r1,
                y4 = y + r2,
                y5 = y + r  + 0.5;

            return ['M', x1, y1, "L", x3, y3, x3, y4, x1, y2, x5, y2, x, y5, x6,
                y2, x2, y2, x4, y4, x4, y3, x2, y1, x8, y1, x8, y3, x8, y4, x7,
                y4, x7, y3, x8, y3, x8, y1, 'Z'];
        },

        zoomOutIcon: function (x, y, radius) {

            var
            icoX = x - radius * 0.2,
            icoY = y - radius * 0.2,
            rad = radius * 0.8,
            startAngle = R.rad(43),
            endAngle = R.rad(48), // to prevent cos and sin of start and end from becoming equal on 360 arcs
            startX = icoX + rad * mathCos(startAngle),
            startY = icoY + rad * mathSin(startAngle),
            endX = icoX + rad * mathCos(endAngle),
            endY = icoY + rad * mathSin(endAngle),
            handleHeight = radius, // the height of the handle
            handAngle = R.rad(45),
            handX1 = startX + handleHeight * mathCos(handAngle),
            handY1 = startY + handleHeight * mathSin(handAngle),
            handX2 = endX + handleHeight * mathCos(handAngle),
            handY2 = endY + handleHeight * mathSin(handAngle),
            semiW = 2;

            return ['M', startX , startY,
                'A', rad, rad, 0, 1, 0, endX, endY, 'Z', 'M', startX + 1 , startY + 1 , 'L',
                handX1, handY1, handX2, handY2, endX + 1,
                endY + 1, 'Z', 'M', icoX - semiW, icoY, 'L', icoX + semiW,
                icoY, 'Z'];

        },

        resetIcon: function (x, y, radius) {
            var r = radius,
            startX = x - r, startY = y,
            endAngle = (math.PI / 2 + math.PI) / 2,
            endX = x + r * mathCos(endAngle),
            endY = y + r * mathSin(endAngle),
            arrowLength = r * 2 / 3,

            paths = ['M', startX, startY, "A",
                r, r, 0, 1, 1, endX, endY, "L", endX + arrowLength,
                endY - 1, endX + 2, endY + arrowLength - 0.5, endX, endY];

            return paths;
        }
    });

}]);