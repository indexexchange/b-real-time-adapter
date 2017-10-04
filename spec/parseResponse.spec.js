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
                        getId: function() {
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

describe('parseResponse', function() {

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

    describe('should correctly parse bids:', function() {
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

        var adResponseMock1 = {
            "version": "0.0.1",
            "uuid": "Yv4kQgkN0vwuGK9",
            "tags": [
              {
                "uuid": "2nDyOuqu3NvKSnK",
                "tag_id": 10256447,
                "auction_id": "7795167207484918349",
                "nobid": true,
                "ad_profile_id": 770287
              },
              {
                "uuid": "kqMkInCVhUCCaVK",
                "tag_id": 10256447,
                "auction_id": "753544085388670879",
                "nobid": false,
                "no_ad_url": "http://lax1-ib.adnxs.com/it?e=wqT_3QKUBqgUAwAAAwDWAAUBCMmu9MoFEJ_vwOGmi8i6ChjZ_7Gn-6vgx0EgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ8Hgwv4DyBDjMCkDMCkgAUABYtMAXYABoisUKeACAAQCSAQNVU0SYAawCoAH6AagBAbABALgBAMABAMgBAtABANgBAOABAPABAIoCOXVmKCdhJywgMjI0MTgsIDE0OTkyNzMwMzMpO3VmKCdyJywgNjQ3Mjk0NjQsIDE0GR7wgZIC-QEhUFRHUi1Ranl0SUFJRVBqaTdoNFlBQ0Mwd0Jjd0FEZ0FRQUJJblFSUXY0RHlCRmdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVCcUFFRHNBRUF1UUhsalFROEh3VWdRTUVCNVkwRVBCOEZJRURKQVFBQUEBAxRQQV8yUUUBCjBBQUFEd1AtQUJBUFVCAQ4sQUpnQ0FLQUNBTFVDBRAETDAJCPBMTUFDQWNnQ0FkQUNBZGdDQWVBQ0FPZ0NBUGdDQUlBREFaQURBSmdEQWFnRDhyU0FDTG9EQ1V4QldERTZNamszTWcuLpoCLSFmd2txckE2_ADwYHRNQVhJQUFvQURvSlRFRllNVG95T1RjedgCrAPgAuCbPeoCL2h0dHA6Ly90ZXN0LmJyZWFsdGltZS5jb20vaW5kZXgtaGVhZGVyLXdyYXBwZXIv8gIPCgZBRFZfSUQSBTIhphjyAhEKBUNQARHwlggxNjc4Mzk4NoADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA4IABABGKwCIPoBKAAwALgEAMAEAMgEANIECUxBWDE6Mjk3MtoEAggB4AQA8AT44u4eiAUBmAUAoAX___8JAxQBwAUAyQVJszTwP9IFCQkAAAAAAAAAAA..&s=3962a6455655324d8f0335c608c5c98b5745e6f4&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F",
                "timeout_ms": 0,
                "ad_profile_id": 1002976,
                "ads": [
                  {
                    "content_source": "rtb",
                    "ad_type": "banner",
                    "buyer_member_id": 541,
                    "creative_id": 64729464,
                    "media_type_id": 1,
                    "media_subtype_id": 1,
                    "cpm": 5,
                    "cpm_publisher_currency": 5,
                    "publisher_currency_code": "$",
                    "deal_id": 333377,
                    "client_initiated_ad_counting": true,
                    "rtb": {
                      "banner": {
                        "content": "<!-- Creative 64729464 served by Member 541 via AppNexus --><a href=\"http://lax1-ib.adnxs.com/click?AAAAAAAAFEAAAAAAAAAUQAAAAAAAAC5AhetRuB4FIECF61G4HgUgQJ83MGxaIHUK2X_stF-Bj0FJF11ZAAAAAD-AnABMBQAAHQIAAAIAAAB4sdsDNOAFAAAAAABVU0QAVVNEACwB-gCKogAAAAABAQUCAQAAAIQA3hiHvQAAAAA./cnd=%21fwkqrAjytIAIEPji7h4YtMAXIAAoADoJTEFYMToyOTcy/bn=62180/referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F/clickenc=http%3A%2F%2Fwww.safekids.org\" target=\"_blank\"><img width=\"300\" height=\"250\" style=\"border-style: none\" src=\"http://vcdn.adnxs.com/p/creative-image/71/8b/57/77/718b5777-a6a6-4680-ad97-9d1827337013.jpg\"/></a><script type=\"application/javascript\">document.write('<img src=\"http://pixel.adsafeprotected.com/jload?anId=5594&advId=22418&campId=16783986&pubId=10256447&adsafe_url=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F&adsafe_type=v\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\" />');</script><iframe src=\"http://acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script type=\"application/javascript\">try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://lax1-ib.adnxs.com/rd_log?e=wqT_3QLtAqhtAQAAAwDWAAUBCMmu9MoFEM2Upvfk6P-WbBjZ_7Gn-6vgx0EgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ9AQBML-A8gQ4zApAzApIAFAAWLTAF2AAaIrFCngAgAEBkgEDVVNEmAGsAqAB2ASoAQGwAQC4AQDAAQDIAQDQAQDYAQDgAQDwAQDYAqwD4ALvgS_qAi9odHRwOi8vdGVzdC5icmVhbHRpbWUuY29tL2luZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA4IABABGKwCINgEKAAwALgEAMAEAMgEANoEAggA4AQA8AQAiAUBmAUAoAUAwAUAyQUAJQ008D_SBQkJAAAAAAAAAAA.&s=7c329c2c7db022b4cf5792408a47e56590cb5795&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><script type=\"application/javascript\">document.write('<div name=\"anxv\" lnttag=\"v;tv=view6-1;st=0;d=300x250;vc=iab;tag_id=10256447;cb=http%3A%2F%2Flax1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QKhBqghAwAAAwDWAAUBCMmu9MoFEJ_vwOGmi8i6ChjZ_7Gn-6vgx0EgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5OTI3MzAzMyk7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFQVEdSLVFqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVXhCV0RFNk1qazNNZy4umgItIWZ3a3FyQTb8APBgdE1BWElBQW9BRG9KVEVGWU1Ub3lPVGN52AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCZCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIEDjEwNC4xNzIuMjI3Ljg1qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnSNPA_0gUJCQAAAAAAAAAA%26s%3D464913a675904be5fc55be813c4185922799b3a9%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F;cet=0;cecb=http%3A%2F%2Flax1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QKhBqghAwAAAwDWAAUBCMmu9MoFEJ_vwOGmi8i6ChjZ_7Gn-6vgx0EgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5OTI3MzAzMyk7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFQVEdSLVFqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVXhCV0RFNk1qazNNZy4umgItIWZ3a3FyQTb8APBgdE1BWElBQW9BRG9KVEVGWU1Ub3lPVGN52AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCZCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIEDjEwNC4xNzIuMjI3Ljg1qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnSNPA_0gUJCQAAAAAAAAAA%26s%3D464913a675904be5fc55be813c4185922799b3a9%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><sc' + 'ript type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/91/trk.js\"><\\/scr' + 'ipt><\\/div>');</script>",
                        "width": 300,
                        "height": 250
                      },
                      "trackers": [
                        {
                          "impression_urls": [
                            "http://lax1-ib.adnxs.com/it?e=wqT_3QKhBqghAwAAAwDWAAUBCMmu9MoFEJ_vwOGmi8i6ChjZ_7Gn-6vgx0EgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5OTI3MzAzMyk7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFQVEdSLVFqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVXhCV0RFNk1qazNNZy4umgItIWZ3a3FyQTb8APBgdE1BWElBQW9BRG9KVEVGWU1Ub3lPVGN52AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCZCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIEDjEwNC4xNzIuMjI3Ljg1qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnSNPA_0gUJCQAAAAAAAAAA&s=464913a675904be5fc55be813c4185922799b3a9&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F"
                          ],
                          "video_events": {}
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "uuid": "Yv4kQgkN0vwuGK9",
                "tag_id": 10256447,
                "auction_id": "2104075581170956847",
                "nobid": false,
                "no_ad_url": "http://lax1-ib.adnxs.com/it?e=wqT_3QLIBqhIAwAAAwDWAAUBCMmu9MoFEK_0kuL9ssuZHRjZ_7Gn-6vgx0EgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ8Hgwv4DyBDjMCkDMCkgAUABYtMAXYABoisUKeACAAQCSAQNVU0SYAdgFoAFaqAEBsAEAuAEAwAEAyAEC0AEA2AEA4AEA8AEAigI6dWYoJ2EnLCA0NzEwOTIsIDE0OTkyNzMwMzMpO3VmKCdyJywgNDE4MjUxNTEsIDE0GR7wnJIC-QEhZXpZRUVRaVhyTjhGRVBfbS1CTVlBQ0Mwd0Jjd0JEZ0FRQVJJekFwUXY0RHlCRmdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVTcUFFRHNBRUF1UUdiVzUzQzR6WWFQOEVCbTF1ZHd1TTJHal9KQVJtbUtSa0x6T29fMlFFQUFBQUFBQUR3UC1BQkFQVUIFDyhKZ0NBS0FDQUxVQwUQBEwwCQjwTk1BQ0FjZ0NBZEFDQWRnQ0FlQUNBT2dDQVBnQ0FJQURBWkFEQUpnREFhZ0RsNnpmQmJvRENVeEJXREU2TWprM01nLi6aAi0haGduZ3F3aVgu_ADwfnRNQVhJQVFvQURvSlRFRllNVG95T1RjecICVmh0dHA6Ly9hZmZpbGlhdGUuYWZmeWllbGQuY29tL3JkL3IucGhwP3NpZD0yNzc4JnB1Yj0yNzAxNjYmYzE9JHtTU1BfREFUQX0mYzI9JHtUQUdfSUR92AKsA-AC-ZU-6gIvaHQFYjh0ZXN0LmJyZWFsdGltZS4BXvClaW5kZXgtaGVhZGVyLXdyYXBwZXIvgAMAiAMBkAMAmAMXoAMBqgMAwAOsAsgDANgDAOADAOgDAPgDAoAEAJIEDS91dC92Mi9wcmViaWSYBACiBA4xMDQuMTcyLjIyNy44NagEALIEDQgAEAEY2AUgWigAMAC4BADABKHPGsgEANIECUxBWDE6Mjk3MtoEAggB4AQA8AT_5vgTiAUBmAUAoAX______wEDFAHABQDJBUnnNPA_0gUJCQAAAAAAAAAA&s=f08154acbf29589ee8da2c56228c48f705f72892&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F",
                "timeout_ms": 0,
                "ad_profile_id": 1018617,
                "ads": [
                  {
                    "content_source": "rtb",
                    "ad_type": "banner",
                    "buyer_member_id": 1356,
                    "creative_id": 41825151,
                    "media_type_id": 1,
                    "media_subtype_id": 1,
                    "cpm": 0.0001,
                    "cpm_publisher_currency": 0.0001,
                    "publisher_currency_code": "$",
                    "client_initiated_ad_counting": true,
                    "rtb": {
                      "banner": {
                        "content": "<!-- Creative 41825151 served by Member 1356 via AppNexus --><a href=\"http://lax1-ib.adnxs.com/click?LEMc6-I2Gj8sQxzr4jYaPwAAAAAAAC5ALEMc6-I2Gj8sQxzr4jYaPy-6RNyXLTMd2X_stF-Bj0FJF11ZAAAAAD-AnABMBQAATAUAAAIAAAB_M34CNOAFAAAAAABVU0QAVVNEANgCWgCKogAAAAABAQQCAQAAAIQA9R3uNgAAAAA./cnd=%21hgngqwiXrN8FEP_m-BMYtMAXIAQoADoJTEFYMToyOTcy/bn=62180/referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F/clickenc=http%3A%2F%2Faffiliate.affyield.com%2Frd%2Fr.php%3Fsid%3D2778%26pub%3D270166%26c1%3Dlax1CNn_saf7q-DHQRACGK_0kuL9ssuZHSIOMTA0LjE3Mi4yMjcuODUoATDJrvTKBQ..%26c2%3D10256447\" target=\"_blank\"><img width=\"728\" height=\"90\" style=\"border-style: none\" src=\"http://cdn.adnxs.com/p/c6/92/1f/83/c6921f833f72399c0531988041658d8b.jpg\"/></a><iframe src=\"http://acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script type=\"application/javascript\">try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://lax1-ib.adnxs.com/rd_log?e=wqT_3QLtAqhtAQAAAwDWAAUBCMmu9MoFEM2Upvfk6P-WbBjZ_7Gn-6vgx0EgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ9AQBML-A8gQ4zApAzApIAFAAWLTAF2AAaIrFCngAgAEBkgEDVVNEmAGsAqAB2ASoAQGwAQC4AQDAAQDIAQDQAQDYAQDgAQDwAQDYAqwD4ALvgS_qAi9odHRwOi8vdGVzdC5icmVhbHRpbWUuY29tL2luZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA4IABABGKwCINgEKAAwALgEAMAEAMgEANoEAggA4AQA8AQAiAUBmAUAoAUAwAUAyQUAJQ008D_SBQkJAAAAAAAAAAA.&s=7c329c2c7db022b4cf5792408a47e56590cb5795&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><script type=\"application/javascript\">document.write('<div name=\"anxv\" lnttag=\"v;tv=view6-1;st=0;d=728x90;vc=iab;tag_id=10256447;cb=http%3A%2F%2Flax1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLTBvA8UwMAAAMA1gAFAQjJrvTKBRCv9JLi_bLLmR0Y2f-xp_ur4MdBIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5OTI3MzAzMyk7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWV6WUVFUWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFSbW1LUmtMek9vXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVXhCV0RFNk1qazNNZy4umgItIWhnbmdxd2lYLvwA8H50TUFYSUFRb0FEb0pURUZZTVRveU9UY3nCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAvmVPuoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7wpWluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVhAjwAAPA_0gUJCQAAAAAAAAAA%26s%3D682adcb95247e9add96233e1826e6fd693a61105%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F;cet=0;cecb=http%3A%2F%2Flax1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLTBvA8UwMAAAMA1gAFAQjJrvTKBRCv9JLi_bLLmR0Y2f-xp_ur4MdBIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5OTI3MzAzMyk7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWV6WUVFUWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFSbW1LUmtMek9vXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVXhCV0RFNk1qazNNZy4umgItIWhnbmdxd2lYLvwA8H50TUFYSUFRb0FEb0pURUZZTVRveU9UY3nCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAvmVPuoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7wpWluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVhAjwAAPA_0gUJCQAAAAAAAAAA%26s%3D682adcb95247e9add96233e1826e6fd693a61105%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><sc' + 'ript type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/91/trk.js\"><\\/scr' + 'ipt><\\/div>');</script>",
                        "width": 728,
                        "height": 90
                      },
                      "trackers": [
                        {
                          "impression_urls": [
                            "http://lax1-ib.adnxs.com/it?e=wqT_3QLTBvA8UwMAAAMA1gAFAQjJrvTKBRCv9JLi_bLLmR0Y2f-xp_ur4MdBIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeOTlA4ABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5OTI3MzAzMyk7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWV6WUVFUWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFSbW1LUmtMek9vXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVXhCV0RFNk1qazNNZy4umgItIWhnbmdxd2lYLvwA8H50TUFYSUFRb0FEb0pURUZZTVRveU9UY3nCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAvmVPuoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7wpWluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQOMTA0LjE3Mi4yMjcuODWoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlMQVgxOjI5NzLaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVhAjwAAPA_0gUJCQAAAAAAAAAA&s=682adcb95247e9add96233e1826e6fd693a61105&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F"
                          ],
                          "video_events": {}
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          };
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock1, returnParcels1);

        /* Simple type checking on the returned objects, should always pass */
        it('each parcel should have the required fields set', function() {
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

                //expect(result.valid, result.format()).to.be.true;
            }
        });

        /* ---------- ADD MORE TEST CASES TO TEST AGAINST REAL VALUES ------------*/
        it('each parcel should have the correct values set', function() {
            for (var i = 0; i < returnParcels1.length; i++) {

                /* Add test cases to test against each of the parcel's set fields
                 * to make sure the response was parsed correctly.
                 *
                 * The parcels have already been parsed and should contain all the
                 * necessary demand.
                 */
                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        nobid: {
                            type: 'boolean',
                            eq: false
                        },
                        no_ad_url: {
                            type: 'string',
                            minLength: 1
                        },
                        ads: {
                            type: 'array',
                            minLength: 1
                        }
                    }
                }, returnParcels1[i]);
                expect(returnParcels1[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });

    describe('should correctly parse passes: ', function() {
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

        var adResponseMock2 = {
            "version": "0.0.1",
            "uuid": "ZlKYxQASnHAYcIN",
            "tags": [{
                    "uuid": "4ZdqH4CeeU2crVh",
                    "tag_id": 10256447,
                    "auction_id": "3558243153973810658",
                    "nobid": true,
                    "ad_profile_id": 770287
                },
                {
                    "uuid": "q1vEZnLgb2RBKfB",
                    "tag_id": 10256447,
                    "auction_id": "4043089010576472684",
                    "nobid": true,
                    "ad_profile_id": 1002894
                },
                {
                    "uuid": "ZlKYxQASnHAYcIN",
                    "tag_id": 10256447,
                    "auction_id": "5452225642568226183",
                    "nobid": true,
                    "ad_profile_id": 1002894
                }
            ]
        };
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock2, returnParcels2);

        it('each parcel should have the required fields set', function() {
            for (var i = 0; i < returnParcels2.length; i++) {

                /* IF MRA, parse one parcel at a time */
                if (!partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock2, [returnParcels2[i]]);
                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        pass: {
                            type: 'boolean',
                            eq: true
                        }
                    }
                }, returnParcels2[i]);

                expect(result.valid, result.format()).to.be.true;
            }
        });

        /* ---------- ADD MORE TEST CASES TO TEST AGAINST REAL VALUES ------------*/
        it('each parcel should have the correct values set', function() {
            for (var i = 0; i < returnParcels2.length; i++) {

                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string'
                        },
                        tag_id: {
                            type: 'number'
                        },
                        auction_id: {
                            type: 'string'
                        }
                    }
                }, returnParcels2[i]);

                expect(returnParcels2[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });

    describe('should correctly parse deals: ', function() {
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

        var adResponseMock3 = {
            "version": "0.0.1",
            "uuid": "4ZdqH4CeeU2crVh",
            "tags": [{
                    "uuid": "q1vEZnLgb2RBKfB",
                    "tag_id": 10256447,
                    "auction_id": "5280760684673420580",
                    "nobid": false,
                    "no_ad_url": "http://nym1-ib.adnxs.com/it?e=wqT_3QLlBqhlAwAAAwDWAAUBCPDP1coFEKSau47T-8GkSRjYzYjdsO-kgBIgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ8Hgwv4DyBDjMCkDMCkgAUABYtMAXYABoisUKeACAAQGSAQNVU0SYAawCoAHYBKgBAbABALgBAMABAMgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MCwgPh4AJGknLCA1NTIyMDk2OgDwgZIC-QEhU2pqNmdnaUZxSjBJRU1TeW55SVlBQ0Mwd0Jjd0JEZ0FRQUJJcGdaUXY0RHlCRmdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVTcUFFRHNBRUF1UUd2cjBvMXR2amtQc0VCcjY5S05iYjQ1RDdKQVFBQUEBAxRQQV8yUUUBCnxBQUFEd1AtQUJrZG9oOVFHc3hTYzNtQUlBb0FJQXRRSQEhBEF2DQiod0FJQnlBSUIwQUlCMkFJQjRBSUE2QUlBLUFJQWdBTUJrQU1BbUFNQnFBTwXcZHVnTUpUbGxOTWpvek9ETXiaAi0hZndoNGt3NvwAKHRNQVhJQUFvQURvMjAA8EjYAqwD4ALgmz3qAi9odHRwOi8vdGVzdC5icmVhbHRpbWUuY29tL2luZGV4LWhlYWRlci13cmFwcGVyL_ICEQoGQURWX0lEEgcxKcQFFAhDUEcFFBg0MjU2NDQ0ARQIBUNQARNgCDE3MjU3NDc38gINCghBRFZfRlJFURIBMAUQ8JZSRU1fVVNFUhIBMIADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQLNC4xNS4yMDkuNDaoBACyBA4IABABGKwCINgEKAAwALgEAMAEAMgEANIECU5ZTTI6MzgzMdoEAggB4AQA8ATEsp8iiAUBmAUAoAX_____BQMUAcAFAMkFaQQ08D_SBQkJAAAAAAAAAAA.&s=1a9ff0918ac26f7570aedd6a015fd1f48e0878cc&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F",
                    "timeout_ms": 0,
                    "ad_profile_id": 1002976,
                    "ads": [{
                        "content_source": "rtb",
                        "ad_type": "banner",
                        "buyer_member_id": 806,
                        "creative_id": 71817540,
                        "media_type_id": 1,
                        "media_subtype_id": 1,
                        "cpm": 0.000008,
                        "cpm_publisher_currency": 0.000008,
                        "publisher_currency_code": "$",
                        "client_initiated_ad_counting": true,
                        "rtb": {
                            "banner": {
                                "content": "<!-- Creative 71817540 served by Member 806 via AppNexus --><a href=\"http://nym1-ib.adnxs.com/click?8WjjiLX45D5qHVVNEHXfPgAAAAAAAC5Aah1VTRB13z7xaOOItfjkPiTNzjHdB0lJ2CaiC3uTABLwZ1VZAAAAAD-AnABMBQAAJgMAAAIAAABE2UcENOAFAAAAAABVU0QAVVNEACwBWAKKogAAAAABAQUCAQAAAIQA0iE6HQAAAAA./cnd=%21fwh4kwiFqJ0IEMSynyIYtMAXIAAoADoJTllNMjozODMx/bn=75970/referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F/clickenc=http%3A%2F%2Fwww.xboxachievements.com%2Fnews%2Fnews-27401-Gigantic-Leaves-Open-Beta-and-Launches-For-Xbox-One-in-July.html%3Futm_source%3Ddisplay%26utm_medium%3D300x600%26utm_campaign%3DGigantic\" target=\"_blank\"><img width=\"300\" height=\"600\" style=\"border-style: none\" src=\"http://vcdn.adnxs.com/p/creative-image/1e/86/2f/4f/1e862f4f-3dac-46fe-9416-089211e104d4.jpg\"/></a><iframe src=\"http://acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script type=\"application/javascript\">try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://nym1-ib.adnxs.com/rd_log?e=wqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAMABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.&s=71de65ff782f16f97ff9cd6d9712b021b637c66c&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><script type=\"application/javascript\">document.write('<div name=\"anxv\" lnttag=\"v;tv=view6-1;st=0;d=300x600;vc=iab;tag_id=10256447;cb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.%26s%3Dcd23b29c6964c8617bb4a84546c463ab4919c456%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F;cet=0;cecb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.%26s%3Dcd23b29c6964c8617bb4a84546c463ab4919c456%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><sc' + 'ript type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/91/trk.js\"><\\/scr' + 'ipt><\\/div>');</script>",
                                "width": 300,
                                "height": 600
                            },
                            "trackers": [{
                                "impression_urls": [
                                    "http://nym1-ib.adnxs.com/it?e=wqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.&s=cd23b29c6964c8617bb4a84546c463ab4919c456&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F"
                                ],
                                "video_events": {}
                            }]
                        }
                    }]
                },
                {
                    "uuid": "ZlKYxQASnHAYcIN",
                    "tag_id": 10256447,
                    "auction_id": "1452749844474479191",
                    "nobid": false,
                    "no_ad_url": "http://nym1-ib.adnxs.com/it?e=wqT_3QKRBqgRAwAAAwDWAAUBCPDP1coFENeEn9uVic2UFBjYzYjdsO-kgBIgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ8Hgwv4DyBDjMCkDMCkgAUABYtMAXYABoisUKeACAAQCSAQNVU0SYAawCoAH6AagBAbABALgBAMABAMgBAtABANgBAOABAPABAIoCOXVmKCdhJywgMjI0MTgsIDE0OTg3NjkzOTIpO3VmKCdyJywgNjQ3Mjk0NjQsIDE0GR7wgZIC-QEhU0RFVS1nanl0SUFJRVBqaTdoNFlBQ0Mwd0Jjd0FEZ0FRQUJJblFSUXY0RHlCRmdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVCcUFFRHNBRUF1UUhsalFROEh3VWdRTUVCNVkwRVBCOEZJRURKQVFBQUEBAxRQQV8yUUUBCjBBQUFEd1AtQUJBUFVCAQ4sQUpnQ0FLQUNBTFVDBRAETDAJCPBMTUFDQWNnQ0FkQUNBZGdDQWVBQ0FPZ0NBUGdDQUlBREFaQURBSmdEQWFnRDhyU0FDTG9EQ1U1WlRUSTZNemd6TVEuLpoCLSFpZ210ckE2_ADwYHRNQVhJQUFvQURvSlRsbE5Nam96T0RNeNgCrAPgAu-BL-oCL2h0dHA6Ly90ZXN0LmJyZWFsdGltZS5jb20vaW5kZXgtaGVhZGVyLXdyYXBwZXIv8gIPCgZBRFZfSUQSBTIhphjyAhEKBUNQARHwkwgxNjc4Mzk4NoADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQLNC4xNS4yMDkuNDaoBACyBA4IABABGKwCIPoBKAAwALgEAMAEAMgEANIECU5ZTTI6MzgzMdoEAggB4AQA8AT44u4eiAUBmAUAoAX___8JAxQBwAUAyQVJsDTwP9IFCQkAAAAAAAAAAA..&s=ab48dd742e0c32292f472092b308b1b7509d34b5&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F",
                    "timeout_ms": 0,
                    "ad_profile_id": 770287,
                    "ads": [{
                        "content_source": "rtb",
                        "ad_type": "banner",
                        "buyer_member_id": 541,
                        "creative_id": 64729464,
                        "media_type_id": 1,
                        "media_subtype_id": 1,
                        "cpm": 5,
                        "cpm_publisher_currency": 5,
                        "publisher_currency_code": "$",
                        "deal_id": 333377,
                        "client_initiated_ad_counting": true,
                        "rtb": {
                            "banner": {
                                "content": "<!-- Creative 64729464 served by Member 541 via AppNexus --><a href=\"http://nym1-ib.adnxs.com/click?AAAAAAAAFEAAAAAAAAAUQAAAAAAAAC5AhetRuB4FIECF61G4HgUgQFfCZ1tJNCkU2CaiC3uTABLwZ1VZAAAAAD-AnABMBQAAHQIAAAIAAAB4sdsDNOAFAAAAAABVU0QAVVNEACwB-gCKogAAAAABAQUCAQAAAIQAGhg8gQAAAAA./cnd=%21igmtrAjytIAIEPji7h4YtMAXIAAoADoJTllNMjozODMx/bn=75970/referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F/clickenc=http%3A%2F%2Fwww.safekids.org\" target=\"_blank\"><img width=\"300\" height=\"250\" style=\"border-style: none\" src=\"http://vcdn.adnxs.com/p/creative-image/71/8b/57/77/718b5777-a6a6-4680-ad97-9d1827337013.jpg\"/></a><script type=\"application/javascript\">document.write('<img src=\"http://pixel.adsafeprotected.com/jload?anId=5594&advId=22418&campId=16783986&pubId=10256447&adsafe_url=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F&adsafe_type=v\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\" />');</script><iframe src=\"http://acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script type=\"application/javascript\">try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://nym1-ib.adnxs.com/rd_log?e=wqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAMABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.&s=71de65ff782f16f97ff9cd6d9712b021b637c66c&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><script type=\"application/javascript\">document.write('<div name=\"anxv\" lnttag=\"v;tv=view6-1;st=0;d=300x250;vc=iab;tag_id=10256447;cb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QKeBqgeAwAAAwDWAAUBCPDP1coFENeEn9uVic2UFBjYzYjdsO-kgBIgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFTREVVLWdqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVTVaVFRJNk16Z3pNUS4umgItIWlnbXRyQTb8APBgdE1BWElBQW9BRG9KVGxsTk1qb3pPRE142AKsA-AC74Ev6gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCWCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnPNPA_0gUJCQAAAAAAAAAA%26s%3Db3788afe3594a94ac262138cb21bd07cea42b18a%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F;cet=0;cecb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QKeBqgeAwAAAwDWAAUBCPDP1coFENeEn9uVic2UFBjYzYjdsO-kgBIgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFTREVVLWdqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVTVaVFRJNk16Z3pNUS4umgItIWlnbXRyQTb8APBgdE1BWElBQW9BRG9KVGxsTk1qb3pPRE142AKsA-AC74Ev6gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCWCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnPNPA_0gUJCQAAAAAAAAAA%26s%3Db3788afe3594a94ac262138cb21bd07cea42b18a%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><sc' + 'ript type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/91/trk.js\"><\\/scr' + 'ipt><\\/div>');</script>",
                                "width": 300,
                                "height": 250
                            },
                            "trackers": [{
                                "impression_urls": [
                                    "http://nym1-ib.adnxs.com/it?e=wqT_3QKeBqgeAwAAAwDWAAUBCPDP1coFENeEn9uVic2UFBjYzYjdsO-kgBIgASotCQAAAQIIFEARAQcQAAAUQBkJCSwuQCGF61G4HgUgQCkRCagwv4DyBDjMCkCdBEgCUPji7h5YtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwUJgBrAKgAfoBqAEBsAEAuAEBwAEFyAEC0AEA2AEA4AEA8AEAigI5dWYoJ2EnLCAyMjQxOCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA2NDcyOTQ2NDYeAPCBkgL5ASFTREVVLWdqeXRJQUlFUGppN2g0WUFDQzB3QmN3QURnQVFBQkluUVJRdjREeUJGZ0FZUF9fX184UGFBQndBWGdCZ0FFQmlBRUJrQUVCbUFFQm9BRUJxQUVEc0FFQXVRSGxqUVE4SHdVZ1FNRUI1WTBFUEI4RklFREpBUUFBQQEDFFBBXzJRRQEKMEFBQUR3UC1BQkFQVUIBDixBSmdDQUtBQ0FMVUMFEARMMAkI8ExNQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEOHJTQUNMb0RDVTVaVFRJNk16Z3pNUS4umgItIWlnbXRyQTb8APBgdE1BWElBQW9BRG9KVGxsTk1qb3pPRE142AKsA-AC74Ev6gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAg8KBkFEVl9JRBIFMiGmGPICEQoFQ1ABEfCWCDE2NzgzOTg2gAMAiAMBkAPBrBSYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiD6ASgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE-OLuHogFAZgFAKAF_____wUDFAHABQDJBUnPNPA_0gUJCQAAAAAAAAAA&s=b3788afe3594a94ac262138cb21bd07cea42b18a&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F"
                                ],
                                "video_events": {}
                            }]
                        }
                    }]
                },
                {
                    "uuid": "4ZdqH4CeeU2crVh",
                    "tag_id": 10256447,
                    "auction_id": "8417591544457837175",
                    "nobid": false,
                    "no_ad_url": "http://nym1-ib.adnxs.com/it?e=wqT_3QLFBqhFAwAAAwDWAAUBCPDP1coFEPf09v2U3dLodBjYzYjdsO-kgBIgASotCQAACQIAEQkHCAAAGQkJCC5AIQkJCAAAKREJ8Hgwv4DyBDjMCkDMCkgAUABYtMAXYABoisUKeACAAQCSAQNVU0SYAdgFoAFaqAEBsAEAuAEAwAEAyAEC0AEA2AEA4AEA8AEAigI6dWYoJ2EnLCA0NzEwOTIsIDE0OTg3NjkzOTIpO3VmKCdyJywgNDE4MjUxNTEsIDE0GR7wnJIC-QEhaFRtTUlBaVhyTjhGRVBfbS1CTVlBQ0Mwd0Jjd0JEZ0FRQVJJekFwUXY0RHlCRmdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVTcUFFRHNBRUF1UUdiVzUzQzR6WWFQOEVCbTF1ZHd1TTJHal9KQVlQMC0yejUtdkFfMlFFQUFBQUFBQUR3UC1BQkFQVUIFDyhKZ0NBS0FDQUxVQwUQBEwwCQjwTk1BQ0FjZ0NBZEFDQWRnQ0FlQUNBT2dDQVBnQ0FJQURBWkFEQUpnREFhZ0RsNnpmQmJvRENVNVpUVEk2TXpnek1RLi6aAi0ha1FsanJBaVgu_ADwfnRNQVhJQVFvQURvSlRsbE5Nam96T0RNeMICVmh0dHA6Ly9hZmZpbGlhdGUuYWZmeWllbGQuY29tL3JkL3IucGhwP3NpZD0yNzc4JnB1Yj0yNzAxNjYmYzE9JHtTU1BfREFUQX0mYzI9JHtUQUdfSUR92AKsA-AC4Js96gIvaHQFYjh0ZXN0LmJyZWFsdGltZS4BXvCiaW5kZXgtaGVhZGVyLXdyYXBwZXIvgAMAiAMBkAMAmAMXoAMBqgMAwAOsAsgDANgDAOADAOgDAPgDAoAEAJIEDS91dC92Mi9wcmViaWSYBACiBAs0LjE1LjIwOS40NqgEALIEDQgAEAEY2AUgWigAMAC4BADABKHPGsgEANIECU5ZTTI6MzgzMdoEAggB4AQA8AT_5vgTiAUBmAUAoAX______wEDFAHABQDJBUnkNPA_0gUJCQAAAAAAAAAA&s=3cc3c5d5e84ff12c1c77c685a9664b9ddf36a660&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F",
                    "timeout_ms": 0,
                    "ad_profile_id": 1002976,
                    "ads": [{
                        "content_source": "rtb",
                        "ad_type": "banner",
                        "buyer_member_id": 1356,
                        "creative_id": 41825151,
                        "media_type_id": 1,
                        "media_subtype_id": 1,
                        "cpm": 0.0001,
                        "cpm_publisher_currency": 0.0001,
                        "publisher_currency_code": "$",
                        "client_initiated_ad_counting": true,
                        "rtb": {
                            "banner": {
                                "content": "<!-- Creative 41825151 served by Member 1356 via AppNexus --><a href=\"http://nym1-ib.adnxs.com/click?LEMc6-I2Gj8sQxzr4jYaPwAAAAAAAC5ALEMc6-I2Gj8sQxzr4jYaP3e6vU_pStF02CaiC3uTABLwZ1VZAAAAAD-AnABMBQAATAUAAAIAAAB_M34CNOAFAAAAAABVU0QAVVNEANgCWgCKogAAAAABAQQCAQAAAIQAnx6ecAAAAAA./cnd=%21kQljrAiXrN8FEP_m-BMYtMAXIAQoADoJTllNMjozODMx/bn=75970/referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F/clickenc=http%3A%2F%2Faffiliate.affyield.com%2Frd%2Fr.php%3Fsid%3D2778%26pub%3D270166%26c1%3Dnym1CNjNiN2w76SAEhACGPf09v2U3dLodCILNC4xNS4yMDkuNDYoATDwz9XKBQ..%26c2%3D10256447\" target=\"_blank\"><img width=\"728\" height=\"90\" style=\"border-style: none\" src=\"http://cdn.adnxs.com/p/c6/92/1f/83/c6921f833f72399c0531988041658d8b.jpg\"/></a><iframe src=\"http://acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script type=\"application/javascript\">try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://nym1-ib.adnxs.com/rd_log?e=wqT_3QLwBvA8cAMAAAMA1gAFAQjwz9XKBRCkmruO0_vBpEkY2M2I3bDvpIASIAEqLQnxaOOItfjkPhFqHVVNEHXfPhkAAAECDC5AIWoNEgApESSoML-A8gQ4zApApgZIAlDEsp8iWLTAF2AAaIrFCnjC0QSAAQGKAQNVU0SSAQEG8FKYAawCoAHYBKgBAbABALgBAMABBcgBAtABANgBAOABAPABAIoCV3VmKCdhJywgMTg2MTc3MCwgMTQ5ODc2OTM5Mik7dWYoJ3InLCA3MTgxNzU0MEYeACRpJywgNTUyMjA5NhwA8IGSAvkBIVNqajZnZ2lGcUowSUVNU3lueUlZQUNDMHdCY3dCRGdBUUFCSXBnWlF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHdnIwbzF0dmprUHNFQnI2OUtOYmI0NUQ3SkFRQUFBAQMUUEFfMlFFAQp8QUFBRHdQLUFCa2RvaDlRR3N4U2MzbUFJQW9BSUF0UUkBIQRBdg0IqHdBSUJ5QUlCMEFJQjJBSUI0QUlBNkFJQS1BSUFnQU1Ca0FNQW1BTUJxQU8F3GR1Z01KVGxsTk1qb3pPRE14mgItIWZ3aDRrdzb8ACh0TUFYSUFBb0FEbzIwAPBI2AKsA-AC4Js96gIvaHR0cDovL3Rlc3QuYnJlYWx0aW1lLmNvbS9pbmRleC1oZWFkZXItd3JhcHBlci_yAhEKBkFEVl9JRBIHMSnEBRQIQ1BHBRQYNDI1NjQ0NAEUCAVDUAETYAgxNzI1NzQ3N_ICDQoIQURWX0ZSRVESATAFEPCWUkVNX1VTRVISATCAAwCIAwGQAwCYAxegAwGqAwDAA6wCyAMA2AMA4AMA6AMA-AMCgAQAkgQNL3V0L3YyL3ByZWJpZJgEAKIECzQuMTUuMjA5LjQ2qAQAsgQOCAAQARisAiDYBCgAMAC4BADABADIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAExLKfIogFAZgFAKAF_____wUDFAHABQDJBWEfPAAA8D_SBQkJAAAAAAAAAAA.&s=71de65ff782f16f97ff9cd6d9712b021b637c66c&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><script type=\"application/javascript\">document.write('<div name=\"anxv\" lnttag=\"v;tv=view6-1;st=0;d=728x90;vc=iab;tag_id=10256447;cb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLQBvA8UAMAAAMA1gAFAQjwz9XKBRD39Pb9lN3S6HQY2M2I3bDvpIASIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5ODc2OTM5Mik7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWhUbU1JQWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFZUDAtMno1LXZBXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVTVaVFRJNk16Z3pNUS4umgItIWtRbGpyQWlYLvwA8H50TUFYSUFRb0FEb0pUbGxOTWpvek9ETXjCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAuCbPeoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7womluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQLNC4xNS4yMDkuNDaoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVB_zwAAPA_0gUJCQAAAAAAAAAA%26s%3Ddee9cddfe051b87c6d55ca5433bc4f60235d7f01%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F;cet=0;cecb=http%3A%2F%2Fnym1-ib.adnxs.com%2Fvevent%3Fe%3DwqT_3QLQBvA8UAMAAAMA1gAFAQjwz9XKBRD39Pb9lN3S6HQY2M2I3bDvpIASIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5ODc2OTM5Mik7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWhUbU1JQWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFZUDAtMno1LXZBXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVTVaVFRJNk16Z3pNUS4umgItIWtRbGpyQWlYLvwA8H50TUFYSUFRb0FEb0pUbGxOTWpvek9ETXjCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAuCbPeoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7womluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQLNC4xNS4yMDkuNDaoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVB_zwAAPA_0gUJCQAAAAAAAAAA%26s%3Ddee9cddfe051b87c6d55ca5433bc4f60235d7f01%26referrer%3Dhttp%253A%252F%252Ftest.brealtime.com%252Findex-header-wrapper%252F\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><sc' + 'ript type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/91/trk.js\"><\\/scr' + 'ipt><\\/div>');</script>",
                                "width": 728,
                                "height": 90
                            },
                            "trackers": [{
                                "impression_urls": [
                                    "http://nym1-ib.adnxs.com/it?e=wqT_3QLQBvA8UAMAAAMA1gAFAQjwz9XKBRD39Pb9lN3S6HQY2M2I3bDvpIASIAEqLQksQxzr4jYaPxEsQxzr4jYaPxkAAAECCC5AIREbACkRCagwv4DyBDjMCkDMCkgCUP_m-BNYtMAXYABoisUKeMLRBIABAIoBA1VTRJIBAQbwQJgB2AWgAVqoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjp1ZignYScsIDQ3MTA5MiwgMTQ5ODc2OTM5Mik7ARwscicsIDQxODI1MTUxNh4A8JySAvkBIWhUbU1JQWlYck44RkVQX20tQk1ZQUNDMHdCY3dCRGdBUUFSSXpBcFF2NER5QkZnQVlQX19fXzhQYUFCd0FYZ0JnQUVCaUFFQmtBRUJtQUVCb0FFU3FBRURzQUVBdVFHYlc1M0M0ellhUDhFQm0xdWR3dU0yR2pfSkFZUDAtMno1LXZBXzJRRUFBQUFBQUFEd1AtQUJBUFVCBQ8oSmdDQUtBQ0FMVUMFEARMMAkI8E5NQUNBY2dDQWRBQ0FkZ0NBZUFDQU9nQ0FQZ0NBSUFEQVpBREFKZ0RBYWdEbDZ6ZkJib0RDVTVaVFRJNk16Z3pNUS4umgItIWtRbGpyQWlYLvwA8H50TUFYSUFRb0FEb0pUbGxOTWpvek9ETXjCAlZodHRwOi8vYWZmaWxpYXRlLmFmZnlpZWxkLmNvbS9yZC9yLnBocD9zaWQ9Mjc3OCZwdWI9MjcwMTY2JmMxPSR7U1NQX0RBVEF9JmMyPSR7VEFHX0lEfdgCrAPgAuCbPeoCL2h0BWI4dGVzdC5icmVhbHRpbWUuAV7womluZGV4LWhlYWRlci13cmFwcGVyL4ADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwKABACSBA0vdXQvdjIvcHJlYmlkmAQAogQLNC4xNS4yMDkuNDaoBACyBA0IABABGNgFIFooADAAuAQAwAShzxrIBADSBAlOWU0yOjM4MzHaBAIIAeAEAPAE_-b4E4gFAZgFAKAF______8BAxQBwAUAyQVB_zwAAPA_0gUJCQAAAAAAAAAA&s=dee9cddfe051b87c6d55ca5433bc4f60235d7f01&referrer=http%3A%2F%2Ftest.brealtime.com%2Findex-header-wrapper%2F"
                                ],
                                "video_events": {}
                            }]
                        }
                    }]
                }
            ]
        };
        /* ------------------------------------------------------------------------*/

        /* IF SRA, parse all parcels at once */
        if (partnerProfile.architecture) partnerModule.parseResponse(1, adResponseMock3, returnParcels3);

        /* Simple type checking on the returned objects, should always pass */
        it('each parcel should have the required fields set', function() {
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
        it('each parcel should have the correct values set', function() {
            for (var i = 0; i < returnParcels3.length; i++) {

                /* Add test cases to test against each of the parcel's set fields
                 * to make sure the response was parsed correctly.
                 *
                 * The parcels have already been parsed and should contain all the
                 * necessary demand.
                 */

                var result = inspector.validate({
                    type: 'object',
                    properties: {
                        nobid: {
                            type: 'boolean',
                            eq: false
                        },
                        no_ad_url: {
                            type: 'string',
                            minLength: 1
                        },
                        ads: {
                            type: 'array',
                            minLength: 1
                        }
                    }
                }, returnParcels3[i]);

                expect(returnParcels3[i]).to.exist;
            }
        });
        /* -----------------------------------------------------------------------*/
    });
});