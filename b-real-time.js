/**
 * File Information
 * =============================================================================
 * @overview  Partner Module Template
 * @version   1.5.x
 * @author    Index Exchange
 * @copyright Copyright (C) 2016 Index Exchange All Rights Reserved.
 *
 * The information contained within this document is confidential, copyrighted
 * and or a trade secret. No part of this document may be reproduced or
 * distributed in any form or by any means, in whole or in part, without the
 * prior written permission of Index Exchange.
 * -----------------------------------------------------------------------------
 */

window.headertag.partnerScopes.push(function() {
    'use strict';

    /* =============================================================================
     * SECTION A | Configure Module Name and Feature Support
     * -----------------------------------------------------------------------------
     *
     * Configure all of the following settings for this module.
     *
     * PARTNER_ID:
     *     Three or four character partner ID provided by Index Exchange.
     *
     * SUPPORTED_TARGETING_TYPES:
     *     The types of targeting that are supported by this module.
     *
     *          - page: targeting is set on the page as a whole.
     *          - slot: targeting is set on each slot individually.
     *
     * SUPPORTED_ANALYTICS:
     *     The types of analytics the wrapper should support for this module.
     *
     *          - time:   time between when this module's getDemand function is
     *                    called, and when it returns its retrieved demand.
     *          - demand: the targeting information returned from this module.
     *
     */

    var PARTNER_ID = 'BRT';

    var SUPPORTED_TARGETING_TYPES = {
        page: false,
        slot: true
    };

    var SUPPORTED_ANALYTICS = {
        time: true,
        demand: true
    };

    var SUPPORTED_OPTIONS = {};

    /* -------------------------------------------------------------------------- */

    var Utils = window.headertag.Utils;
    var Network = window.headertag.Network;
    var BidRoundingTransformer = window.headertag.BidRoundingTransformer;

    function validateTargetingType(tt) {
        return typeof tt === 'string' && SUPPORTED_TARGETING_TYPES[tt];
    }

    function init(config, callback) {
        //? if (DEBUG) {
        var err = [];

        if (!config.hasOwnProperty('targetingType') || !validateTargetingType(config.targetingType)) {
            err.push('targetingType either not provided or invalid.');
        }

        /* =============================================================================
         * SECTION B | Validate Module-Specific Configurations
         * -----------------------------------------------------------------------------
         *
         * Validate all the module-specific parameters in the `config` object.
         * Validation functions have been provided in the `Utils` object for
         * convenience. See ../lib/utils.js for more information.
         *
         * For required configurations use:
         *
         *     if (!config.hasOwnProperty(<parameter>) || ... || ...) {
         *         err.push(<error message>);
         *     }
         *
         * For optional configurations use:
         *
         *     if (config.hasOwnProperty(<parameters>)  && (... || ...)) {
         *         err.push(<error message>);
         *     }
         *
         */

        /* PUT CODE HERE */

        /* -------------------------------------------------------------------------- */

        var xSlotConfigValid = true;

        if (!config.hasOwnProperty('xSlots') || typeof config.xSlots !== 'object' || Utils.isArray(config.xSlots)) {
            err.push('xSlots either not provided or invalid.');
            xSlotConfigValid = false;
        } else {
            for(var xSlotName in config.xSlots){
                if(!config.xSlots.hasOwnProperty(xSlotName)){
                    continue;
                }

        /* =============================================================================
         * SECTION C | Validate Partner Slot Configurations
         * -----------------------------------------------------------------------------
         *
         * Validate the specific configurations that must appear in each xSlot.
         * An xSlot represents an ad slot as it is understood by the partner's end point.
         * Validation functions have been provided in the `Utils` object for
         * convenience. See ../lib/utils.js for more information.
         *
         * For required configurations use:
         *
         *     if (!config.hasOwnProperty(<parameter>) || ... || ...) {
         *         err.push(<error message>);
         *     }
         *
         * For optional configurations use:
         *
         *     if (config.hasOwnProperty(<parameters>)  && (... || ...)) {
         *         err.push(<error message>);
         *     }
         *
         */

        /* PUT CODE HERE */

        /* -------------------------------------------------------------------------- */

            }
        }

        if (!config.hasOwnProperty('mapping') || typeof config.xSlots !== 'object' || Utils.isArray(config.xSlots)) {
            err.push('mapping either not provided or invalid.');
        } else {
            var seenXSlots = {};

            for(var htSlotName in config.mapping){
                if(!config.mapping.hasOwnProperty(htSlotName)){
                    continue;
                }

                var htSlotMapping = config.mapping[htSlotName];

                if(!Utils.isArray(htSlotMapping) || !htSlotMapping.length){
                    err.push('slot mappings missing or invalid for htSlot ' + htSlotName);
                } else {
                    for(var k = 0; k < htSlotMapping.length; k++){
                        if(!Utils.validateNonEmptyString(htSlotMapping[k])){
                            err.push('slot mappings missing or invalid for htSlot ' + htSlotName);
                        } else if(xSlotConfigValid){
                            if(config.xSlots.hasOwnProperty(htSlotMapping[k])){
                                if(seenXSlots.hasOwnProperty(htSlotMapping[k])){
                                    err.push('xSlot ' + htSlotMapping[k] + ' mapped multiple times in ' + PARTNER_ID +' config');
                                } else {
                                    seenXSlots[htSlotMapping[k]] = true;
                                }
                            } else {
                                err.push('invalid xSlot ' + htSlotMapping[k] + ' in mapping for htSlot ' + htSlotName);
                            }
                        }
                    }
                }
            }
        }

        if (config.hasOwnProperty('targetKeyOverride')) {
            if (!Utils.validateNonEmptyObject(config.targetKeyOverride)) {
                err.push('targetKeyOverride must be a non-empty object');
            } else {
                if (config.targetKeyOverride.omKey && !Utils.validateNonEmptyString(config.targetKeyOverride.omKey)) {
                    err.push('targetKeyOverride.omKey must be a non-empty string');
                }

                if (config.targetKeyOverride.pmKey && !Utils.validateNonEmptyString(config.targetKeyOverride.pmKey)) {
                    err.push('targetKeyOverride.pmKey must be a non-empty string');
                }

                if (config.targetKeyOverride.idKey && !Utils.validateNonEmptyString(config.targetKeyOverride.idKey)) {
                    err.push('targetKeyOverride.idKey must be a non-empty string');
                }
            }
        }

        if(config.hasOwnProperty('roundingBuckets')){
            if (!Utils.validateNonEmptyObject(config.roundingBuckets)) {
                err.push('roundingBuckets must be a non-empty object');
            } else {
                var rConf = config.roundingBuckets;
                if(rConf.floor && (typeof rConf.floor !== 'number' || rConf.floor < 0)){
                    err.push('roundingBuckets.floor must be a non-negative number');
                }
                if(rConf.inputCentsMultiplier && (typeof rConf.inputCentsMultiplier !== 'number' || rConf.inputCentsMultiplier < 0)){
                    err.push('roundingBuckets.floor must be a non-negative number');
                }
                if(rConf.outputCentsDivisor && (typeof rConf.outputCentsDivisor !== 'number' || rConf.outputCentsDivisor < 0)){
                    err.push('roundingBuckets.floor must be a non-negative number');
                }
                if(rConf.outputPrecision && !Utils.validateInteger(rConf.outputPrecision)){
                    err.push('roundingBuckets.outputPrecision must be an integer');
                }
                if(rConf.roundingType && !Utils.validateInteger(rConf.roundingType, 0, 3)){
                    err.push('roundingBuckets.roundingType must be a valid rounding type');
                }
                if(rConf.buckets && (!Utils.isArray(rConf.buckets) || rConf.buckets.length === 0)){
                    err.push('roundingBuckets.buckets must be an array');
                } else {
                    for(var l = 0; l < rConf.buckets.length; l++){
                        if(!Utils.validateNonEmptyObject(rConf.buckets[l])){
                            err.push('roundingBuckets.buckets must contain non-empty objects');
                            break;
                        }
                    }
                }
            }
        }

        if (err.length) {
            callback(err);
            return;
        }

        //? }

        var yourBidder = new Partner(config);
        window.headertag[PARTNER_ID] = {};
        window.headertag[PARTNER_ID].callback = yourBidder.responseCallback;
        window.headertag[PARTNER_ID].render = yourBidder.renderAd;

        callback(null, yourBidder);
    }

    function Partner(config) {
        var _this = this;

        var __targetingType = config.targetingType;
        var __supportedAnalytics = SUPPORTED_ANALYTICS;
        var __supportedOptions = SUPPORTED_OPTIONS;

        var __creativeStore = {};

        /* =============================================================================
         * Set default targeting keys to be used for DFP. Values for omKey and idKey are
         * mandatory. pmKey/pmidKey(deals) is only necessary if the partner will use a private market.
         *
         * Standard values are:
         *
         * omKey: ix_(PARTNER ID)_cpm
         * pmKey: ix_(PARTNER ID)_cpm
         * idKey: ix_(PARTNER ID)_id
         * pmidKey: ix_(PARTNER ID)_dealid
         */
        var __targetingKeys = {
            omKey: 'ix_brt_cpm',
            pmKey: 'ix_brt_cpm',
            idKey: 'ix_brt_id',
            pmidKey: 'ix_brt_dealid'
        };

        if (config.targetKeyOverride) {
            if (config.targetKeyOverride.omKey) {
                __targetingKeys.omKey = config.targetKeyOverride.omKey;
            }

            if (config.targetKeyOverride.pmKey) {
                __targetingKeys.pmKey = config.targetKeyOverride.pmKey;
            }

            if (config.targetKeyOverride.idKey) {
                __targetingKeys.idKey = config.targetKeyOverride.idKey;
            }

            if (config.targetKeyOverride.pmidKey) {
                __targetingKeys.pmidKey = config.targetKeyOverride.pmidKey;
            }
        }

        var __bidTransformer;

        /* =============================================================================
         * Set the default parameters for interpreting the prices sent by the bidder
         * endpoint. The bid transformer library uses cents internally, so this object
         * specifies how to transform to and from the units provided by the bidder
         * endpoint and expected by the DFP line item targeting. See
         * bid-rounding-transformer.js for more information.
         */
        var __bidTransformConfig = {          // Default rounding configuration
            "floor": 0,                     // Minimum acceptable bid price
            "inputCentsMultiplier": 100,    // Multiply input bids by this to get cents
            "outputCentsDivisor": 100,      // Divide output bids in cents by this
            "outputPrecision": 2,           // Decimal places in output
            "roundingType": 1,              // Rounding method (1 is floor)
            "buckets": [{                   // Buckets specifying rounding steps
                "max": 2000,                // Maximum number of cents for this bucket
                "step": 5                   // Increments for this bucket in cents
            }, {
                "max": 5000,                // Maximum number of cents for this bucket
                "step": 100                 // Increments for this bucket in cents
            }]
        };

        if(config.roundingBuckets){
            __bidTransformConfig = config.roundingBuckets;
        }

        /* =============================================================================
         * Use the bidTransformer object to round bids received from the partner
         * endpoint. Usage:
         *
         * var roundedBid = bidTransformer.transformBid(rawBid);
         */
        __bidTransformer = BidRoundingTransformer(__bidTransformConfig);

        /* =============================================================================
         * SECTION E | Copy over the Configurations to Internal Variables
         * -----------------------------------------------------------------------------
         *
         * Assign all the required values from the `config` object to internal
         * variables. These values do not need to be validated here as they have already
         * been validated in `init`.
         *
         * Example:
         *
         *      var <internal parameter> = config.<corresponding parameter>;
         */

        /* PUT CODE HERE */

        /* -------------------------------------------------------------------------- */

        this.getPartnerTargetingType = function getPartnerTargetingType() {
            return __targetingType;
        };

        this.getSupportedAnalytics = function getSupportedAnalytics() {
            return __supportedAnalytics;
        };

        this.getSupportedOptions = function getSupportedOptions() {
            return __supportedOptions;
        };

        function __requestDemandForSlots(htSlotNames, callback){

            /* =============================================================================
             * SECTION F | Request demand from the Module's Ad Server
             * -----------------------------------------------------------------------------
             *
             * The `htSlotNames` argument is an array of HeaderTagSlot IDs for which demand
             * is requested. Look these up in the mapping object of the config to determine
             * the partner xSlots which should have demand requested for them.
             *
             * Make a request to the module's ad server to get demand. If there is an error
             * while doing so, then call `callback` as such:
             *
             *      callback(err);
             *
             * where `err` is a descriptive error message.
             *
             * If there are no errors, and demand is returned from the ad servers, call
             * `callback` as such:
             *
             *      callback(null, demand);
             *
             * where `demand` is an object containing the slot-level demand in the following
             * format:
             *
             *     {
             *         <htSlotId>: {
             *             demand: {
             *                 <key>: <value>,
             *                 <key>: <value>,
             *                 ...
             *             }
             *         },
             *         ...
             *     }
             */

            /* PUT CODE HERE */

            /* -------------------------------------------------------------------------- */

        }

        this.getDemand = function getDemand(correlator, slots, callback) {
            var htSlotNames = Utils.getDivIds(slots);

            __requestDemandForSlots(htSlotNames, function(err, demandForSlots){
                if (err) {
                    callback(err);
                    return;
                }

                if(!demandForSlots){
                    callback('Error: demandForSlots not set');
                    return;
                }

                for (var htSlotName in demandForSlots) {
                    if (!demandForSlots.hasOwnProperty(htSlotName)) {
                        continue;
                    }
                    demand.slot[htSlotName] = demandForSlots[htSlotName];
                    demand.slot[htSlotName].timestamp = Utils.now();
                }
                callback(null, demand);
            });
        };

        this.responseCallback = function(responseObj){
            /* =============================================================================
             * SECTION G | Parse Demand from the Module's Ad Server
             * -----------------------------------------------------------------------------
             *
             * Run this function as a callback when the ad server responds with demand.
             * Store creatives and demand in global objects as needed for processing.
             */

            /* PUT CODE HERE */

            /* -------------------------------------------------------------------------- */
        };

        this.renderAd = function(doc, targetingMap, width, height) {
            /* =============================================================================
             * SECTION H | Render function
             * -----------------------------------------------------------------------------
             *
             * This function will be called by the DFP creative to render the ad. It should
             * work as-is, but additions may be necessary here if there beacons, tracking
             * pixels etc. that need to be called as well.
             */

            if (doc && targetingMap && width && height) {
                try {
                    var id = targetingMap[__targetingKeys.idKey][0];
                    
                    var sizeKey = width + 'x' + height;
                    if (window.headertag.sizeRetargeting && window.headertag.sizeRetargeting[sizeKey]){
                        width = window.headertag.sizeRetargeting[sizeKey][0];
                        height = window.headertag.sizeRetargeting[sizeKey][1];
                    }

                    var ad = __creativeStore[id][width + 'x' + height].ad;

                    doc.write(ad);
                    doc.close();
                    if (doc.defaultView && doc.defaultView.frameElement) {
                        doc.defaultView.frameElement.width = width;
                        doc.defaultView.frameElement.height = height;
                    }
                } catch (e){
                    //? if (DEBUG)
                    console.log('Error trying to write ' + PARTNER_ID + ' ad to the page');
                }

            }
        };
    }

    window.headertag.registerPartner(PARTNER_ID, init);
});
