/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    illnesses = require('./illnesses');

var APP_ID = 'amzn1.echo-sdk-ams.app.ab9841cb-b766-442e-a2f0-39f82458ba45'; //replace with 'amzn1.echo-sdk-ams.app.ab9841cb-b766-442e-a2f0-39f82458ba45';

/**
 * MySkillHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MySkillHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MySkillHelper.prototype = Object.create(AlexaSkill.prototype);
MySkillHelper.prototype.constructor = MySkillHelper;

MySkillHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to MyDoctor. You can ask a question like, what's asthma? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

MySkillHelper.prototype.intentHandlers = {
    "IllnessIntent": function (intent, session, response) {
        var illnessSlot = intent.slots.Illness,
            illnessName;
        if (illnessSlot && illnessSlot.value){
            illnessName = illnessSlot.value.toLowerCase();
        }

        var cardTitle = "Recipe for " + illnessName,
            illness = illnesses[illnessName],
            speechOutput,
            repromptOutput;
        if (illness) {
            speechOutput = {
                speech: illness,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, illness);
        } else {
            var speech;
            if (illnessName) {
                speech = "I'm sorry, I currently do not know the illness for " + illnessName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that illness. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions about MyDoctor such as, what's ashtma, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's asthma, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var minecraftHelper = new MySkillHelper();
    minecraftHelper.execute(event, context);
};
