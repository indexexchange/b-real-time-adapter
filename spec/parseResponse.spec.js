/**
 * @author:    Index Exchange
 * @license:   UNLICENSED
 *
 * @copyright: Copyright (C) 2017 by Index Exchange. All rights reserved.
 *
 * The information contained within this document is confidential, copyrighted
 *  and or a trade secret. No part of this document may be reproduced or
 * distributed in any form or by any means, in whole or in part, without the
 * prior written permission of Index Exchange.
 */
// jshint ignore: start

'use strict';

/* =====================================
 * Utilities
 * ---------------------------------- */

/**
 * Returns an array of parcels based on all of the xSlot/htSlot combinations defined
 * in the partnerConfig (simulates a session in which all of them were requested).
 *
 * @param {object} profile
 * @param {object} partnerConfig
 * @returns []
 */
function generateReturnParcels(profile, partnerConfig) {
    var returnParcels = [];

    for (var htSlotName in partnerConfig.mapping) {
        if (partnerConfig.mapping.hasOwnProperty(htSlotName)) {
            var xSlotsArray = partnerConfig.mapping[htSlotName];
            for (var i = 0; i < xSlotsArray.length; i++) {
                var xSlotName = xSlotsArray[i];
                returnParcels.push({
                    partnerId: profile.partnerId,
                    htSlot: {
                        getId: function () {
                            return htSlotName
                        }
                    },
                    ref: "",
                    xSlotRef: partnerConfig.xSlots[xSlotName],
                    requestId: '_' + Date.now()
                });
            }
        }
    }

    return returnParcels;
}

/* =====================================
 * Testing
 * ---------------------------------- */

describe('parseResponse', function () {

    /* Setup and Library Stub
     * ------------------------------------------------------------- */
    var inspector = require('schema-inspector');
    var proxyquire = require('proxyquire').noCallThru();
    var libraryStubData = require('./support/libraryStubData.js');
    var partnerModule = proxyquire('../b-real-time-htb.js', libraryStubData);
    var partnerConfig = require('./support/mockPartnerConfig.json');
    var expect = require('chai').expect;
    /* -------------------------------------------------------------------- */

    /* Instatiate your partner module */
    var partnerModule = partnerModule(partnerConfig);
    var partnerProfile = partnerModule.profile;

    /* Generate dummy return parcels based on MRA partner profile */
    var returnParcels;

    describe('should correctly parse bids:', function () {
        var returnParcels1 = generateReturnParcels(partnerModule.profile, partnerConfig);

        /* ---------- MODIFY THIS TO MATCH YOUR AD RESPONSE FORMAT ---------------*/
        /* This is your mock response data.
         * Should contain a bid for every parcel in the returnParcels array.
         *
         *  For example:
         * [{
         *     "placementId": "54321",
         *     "sizes": [
         *         [300, 250]
         *     ],
         *     "pass": false,
         *     "price": 2,
         *     "adm": "<img src=''/>"
         * },
         * {
         *     "placementId": "12345",
         *     "sizes": [
         *         [300, 600]
         *     ],
         *     "pass": false,
         *     "price": 3,
         *     "adm": "<img src=''/>"
         * }]
         *
         *
         * The response should contain the response for all of the parcels in the array.
         * For SRA, this could be mulitple items, for MRA it will always be a single item.
         */

        var adResponseMock1 = []
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock1, returnParcels1);

        /* Simple type checking on the returned objects, should always pass */
        it('each parcel should have the required fields set', function () {
            for (var i = 0; i < returnParcels1.length; i++) {

                /* IF MRA, parse one parcel at a time */
                if (!partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock1, [returnParcels1[i]]);

                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        targetingType: {
                            type: 'string',
                            eq: 'slot'
                        },
                        targeting: {
                            type: 'object',
                            properties: {
                                [partnerModule.profile.targetingKeys.id]: {
                                    type: 'array',
                                    exactLength: 1,
                                    items: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                [partnerModule.profile.targetingKeys.om]: {
                                    type: 'array',
                                    exactLength: 1,
                                    items: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                pubKitAdId: {
                                    type: 'string',
                                    minLength: 1
                                }
                            }
                        },
                        price: {
                            type: 'number'
                        },
                        size: {
                            type: 'array',
                        },
                        adm: {
                            type: 'string',
                            minLength: 1
                        }
                    }
                }, returnParcels1[i]);

                expect(result.valid, result.format()).to.be.true;
            }
        });

        /* ---------- ADD MORE TEST CASES TO TEST AGAINST REAL VALUES ------------*/
        it('each parcel should have the correct values set', function () {
            for (var i = 0; i < returnParcels1.length; i++) {

                /* Add test cases to test against each of the parcel's set fields
                 * to make sure the response was parsed correctly.
                 *
                 * The parcels have already been parsed and should contain all the
                 * necessary demand.
                 */

                expect(returnParcels1[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });

    describe('should correctly parse passes: ', function () {
        var returnParcels2 = generateReturnParcels(partnerModule.profile, partnerConfig);

        /* ---------- MODIFY THIS TO MATCH YOUR AD RESPONSE FORMAT ---------------*/
        /* This is your mock response data.
         * Should contain an explicit pass in the response and set the pass field
         * for each of the return parcels.
         *
         *  For example:
         * [{
         *     "placementId": "54321",
         *     "sizes": [
         *         [300, 250]
         *     ],
         *     "pass": true,
         * },
         * {
         *     "placementId": "12345",
         *     "sizes": [
         *         [300, 600]
         *     ],
         *     "pass": true
         * }]
         *
         * The response should contain the response for all of the parcels in the array.
         * For SRA, this could be mulitple items, for MRA it will always be a single item.
         */

        var adResponseMock2 = [];
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock2, returnParcels2);

        it('each parcel should have the required fields set', function () {
            for (var i = 0; i < returnParcels2.length; i++) {

                /* IF MRA, parse one parcel at a time */
                if (!partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock2, [returnParcels2[i]]);

                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        pass: {
                            type: 'boolean',
                            eq: true,

                        }
                    }
                }, returnParcels2[i]);

                expect(result.valid, result.format()).to.be.true;
            }
        });

        /* ---------- ADD MORE TEST CASES TO TEST AGAINST REAL VALUES ------------*/
        it('each parcel should have the correct values set', function () {
            for (var i = 0; i < returnParcels2.length; i++) {

                /* Add test cases to test against each of the parcel's set fields
                 * to make sure the response was parsed correctly.
                 *
                 * The parcels have already been parsed and should contain all the
                 * necessary demand.
                 */

                expect(returnParcels2[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });

    describe('should correctly parse deals: ', function () {
        var returnParcels3 = generateReturnParcels(partnerModule.profile, partnerConfig);

        /* ---------- MODIFY THIS TO MATCH YOUR AD RESPONSE FORMAT ---------------*/
        /* This is your mock response data.
         * Should contain an explicit deal id in the response and set the deal targeting key field
         * for each of the return parcels.
         *
         *  For example:
         * [{
         *     "placementId": "54321",
         *     "sizes": [
         *         [300, 250]
         *     ],
         *     "pass": false,
         *     "price": 2,
         *     "adm": "<img src=''/>",
         *     "dealId": 'megaDeal'
         * },
         * {
         *     "placementId": "12345",
         *     "sizes": [
         *         [300, 600]
         *     ],
         *     "pass": false,
         *     "price": 3,
         *     "adm": "<img src=''/>",
         *     "dealId": 'megaDeal'
         * }]
         *
         * The response should contain the response for all of the parcels in the array.
         * For SRA, this could be mulitple items, for MRA it will always be a single item.
         */

        var adResponseMock3 = [];
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock3, returnParcels3);

        /* Simple type checking on the returned objects, should always pass */
        it('each parcel should have the required fields set', function () {
            for (var i = 0; i < returnParcels3.length; i++) {

                /* IF MRA, parse one parcel at a time */
                if (!partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock3, [returnParcels3[i]]);

                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        targetingType: {
                            type: 'string',
                            eq: 'slot'
                        },
                        targeting: {
                            type: 'object',
                            properties: {
                                [partnerModule.profile.targetingKeys.id]: {
                                    type: 'array',
                                    exactLength: 1,
                                    items: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                [partnerModule.profile.targetingKeys.om]: {
                                    type: 'array',
                                    exactLength: 1,
                                    items: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                [partnerModule.profile.targetingKeys.pm]: {
                                    type: 'array',
                                    exactLength: 1,
                                    items: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                pubKitAdId: {
                                    type: 'string',
                                    minLength: 1
                                }
                            }
                        },
                        price: {
                            type: 'number'
                        },
                        size: {
                            type: 'array',
                        },
                        adm: {
                            type: 'string',
                            minLength: 1
                        },
                    }
                }, returnParcels3[i]);

                expect(result.valid, result.format()).to.be.true;
            }
        });

        /* ---------- ADD MORE TEST CASES TO TEST AGAINST REAL VALUES ------------*/
        it('each parcel should have the correct values set', function () {
            for (var i = 0; i < returnParcels3.length; i++) {

                /* Add test cases to test against each of the parcel's set fields
                 * to make sure the response was parsed correctly.
                 *
                 * The parcels have already been parsed and should contain all the
                 * necessary demand.
                 */

                expect(returnParcels3[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });
});