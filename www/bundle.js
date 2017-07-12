(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DotaHeroCalculatorTable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var ko = require('./herocalc_knockout');
var abilityData = require("./herocalc_abilitydata");
var TalentController = require("./hero/TalentController");

var AbilityModel = function (a, h) {
    var self = this;
    self.hero = h;
    self.abilityData = abilityData;
    self.hasScepter = ko.observable(false);
    self.isShapeShiftActive = ko.observable(false);
    self.abilities = a;
    self._abilities = self.abilities();
    for (var i = 0; i < self.abilities().length; i++) {
        self._abilities[i].level = ko.observable(0);
        self._abilities[i].isActive = ko.observable(false);
        self._abilities[i].isDetail = ko.observable(false);
        self._abilities[i].baseDamage = ko.observable(0);
        self._abilities[i].baseDamageReductionPct = ko.observable(0);
        self._abilities[i].baseDamageMultiplier = ko.observable(0);
        self._abilities[i].bash = ko.observable(0);
        self._abilities[i].bashBonusDamage = ko.observable(0);
        self._abilities[i].bonusDamage = ko.observable(0);
        self._abilities[i].bonusDamageOrb = ko.observable(0);
        self._abilities[i].bonusDamagePct = ko.observable(0);
        self._abilities[i].bonusDamagePrecisionAura = ko.observable(0);
        self._abilities[i].bonusDamageReduction = ko.observable(0);
        self._abilities[i].bonusHealth = ko.observable(0);
        self._abilities[i].bonusStrength = ko.observable(0);
        self._abilities[i].bonusStrength2 = ko.observable(0);
        self._abilities[i].bonusAgility = ko.observable(0);
        self._abilities[i].bonusAgility2 = ko.observable(0);
        self._abilities[i].bonusInt = ko.observable(0);
        self._abilities[i].bonusAllStatsReduction = ko.observable(0);
        self._abilities[i].damageAmplification = ko.observable(0);
        self._abilities[i].damageReduction = ko.observable(0);
        self._abilities[i].evasion = ko.observable(0);
        self._abilities[i].magicResist = ko.observable(0);
        self._abilities[i].manaregen = ko.observable(0);
        self._abilities[i].manaregenreduction = ko.observable(0);
        self._abilities[i].missChance = ko.observable(0);
        self._abilities[i].movementSpeedFlat = ko.observable(0);
        self._abilities[i].movementSpeedPct = ko.observable(0);
        self._abilities[i].movementSpeedPctReduction = ko.observable(0);
        self._abilities[i].turnRateReduction = ko.observable(0);
        self._abilities[i].attackrange = ko.observable(0);
        self._abilities[i].attackspeed = ko.observable(0);
        self._abilities[i].attackspeedreduction = ko.observable(0);
        self._abilities[i].armor = ko.observable(0);
        self._abilities[i].armorReduction = ko.observable(0);
        self._abilities[i].healthregen = ko.observable(0);
        self._abilities[i].lifesteal = ko.observable(0);
        self._abilities[i].visionnight = ko.observable(0);
        self._abilities[i].visionday = ko.observable(0);
    }
    self.abilityControlData = {};
    self.abilitySettingsData = function (data, parent, index) {
        if (self.abilityControlData[data] == undefined) {
            return self.processAbility(data, parent, index, self.abilityData[data]);
        }
        else {
            return self.abilityControlData[data];
        }
    }
    
    self.processAbility = function (data, parent, index, args) {
        var result = {};
        result.data = [];
        var v;
        var v_list = [];
        for (var i=0; i < args.length; i++) {
            switch (args[i].controlType) {
                case 'input':
                    v = ko.observable(0).extend({ numeric: 2 });
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + ':', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                break;
                case 'checkbox':
                    v = ko.observable(false);
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                break;
                case 'radio':
                    v = ko.observable(args[i].controlOptions[0].value);
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display, controlOptions: args[i].controlOptions });
                break;
                case 'method':
                case 'text':
                    // single input abilities
                    if (args[i].controls == undefined) {
                        if (args[i].noLevel) {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    var _ability = self.abilities().find(function(b) {
                                        return b.name == data;
                                    });
                                    return self.getAbilityAttributeValue(_ability.attributes, attributeName, 0);
                                })};
                            };
                        }
                        else {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    var _ability = self.abilities().find(function(b) {
                                        return b.name == data;
                                    });
                                    return self.getAbilityAttributeValue(_ability.attributes, attributeName, _ability.level());
                                })};
                            };
                        }
                        var g = attributeValue(args[i].attributeName)
                        var r = self.getComputedFunction(v, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, undefined, data);
                        if (args[i].ignoreTooltip) {
                            var tooltip = args[i].label || args[i].attributeName;
                        }
                        else {
                            var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes, args[i].attributeName) || args[i].label || args[i].attributeName;
                        }
                        result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                    }
                    // multi input abilities
                    else {
                        if (args[i].noLevel) {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    return self.getAbilityAttributeValue(self.abilities()[index].attributes, attributeName, 0);
                                })};
                            };
                        }
                        else {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    return self.getAbilityAttributeValue(self.abilities()[index].attributes, attributeName, self.abilities()[index].level());
                                })};
                            };
                        }
                        var g = attributeValue(args[i].attributeName)
                        var r = self.getComputedFunction(v_list, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, args[i].controls, data);
                        if (args[i].ignoreTooltip) {
                            var tooltip = args[i].label || args[i].attributeName;
                        }
                        else {
                            var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes, args[i].attributeName) || args[i].label || args[i].attributeName;
                        }
                        result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                    }
                    
                    if (args[i].controlType == 'method') {
                        v_list.push(r);
                    }
                break;
            }
        }
        self.abilityControlData[data] = result;
        return result;
    }

    self.getComputedFunction = function (v, attributeValue, fn, parent, index, abilityModel, returnProperty, controls, abilityName) {
        var _ability = abilityModel.abilities().find(function(b) {
            return b.name == abilityName;
        });
        return ko.pureComputed(function () {                
            var inputValue;
            if (controls == undefined) {
                if (v == undefined) {
                    inputValue = v;
                }
                else if (typeof v() == 'boolean') {
                    inputValue = v();
                }
                else if (v.controlValueType == undefined) {
                    inputValue = parseFloat(v());
                }
                else if (v.controlValueType == 'string') {
                    inputValue = v();
                }
                else {
                    inputValue = parseFloat(v());
                }
            }
            else {
                var v_list = [];
                for (var i=0;i<controls.length;i++) {
                    switch (typeof v[controls[i]]()) {
                        case 'boolean':
                        case 'object':
                            v_list.push(v[controls[i]]());
                        break;
                        default:
                            v_list.push(parseFloat(v[controls[i]]()));
                        break;
                    }
                }
                inputValue = v_list;
            }
            
            var returnVal = fn.call(this, inputValue, attributeValue(), parent, index, abilityModel, _ability, TalentController);
            if (returnProperty != undefined) {
                _ability[returnProperty](returnVal);
            }
            return returnVal;
        }, this);
    }
    
    self.getAbilityLevelByAbilityName = function (abilityName) {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == abilityName) {
                return self._abilities[i].level();
            }
        }
        return -1;
    }

    self.getAbilityByName = function (abilityName) {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == abilityName) {
                return self._abilities[i];
            }
        }
        return undefined;
    }

    self.getAbilityPropertyValue = function (ability, property) {
        return parseFloat(ko.utils.unwrapObservable(ability[property])[ability.level()-1]);
    }
    
    self.getAttributeBonusLevel = function () {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == 'attribute_bonus') {
                return self._abilities[i].level();
            }
        }
        return 0;        
    }
    
    self.getAllStatsReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {                    
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        /*switch(attribute.name) {
                            // invoker_quas
                            case 'bonus_strength':
                                totalAttribute += parseInt(attribute.value[ability.level()-1]);
                            break;
                        }*/
                    }
                }
                else if (ability.bonusAllStatsReduction != undefined) {
                    // slark_essence_shift
                    totalAttribute+=ability.bonusAllStatsReduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getStrengthReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {                    
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        /*switch(attribute.name) {
                            // invoker_quas
                            case 'bonus_strength':
                                totalAttribute += parseInt(attribute.value[ability.level()-1]);
                            break;
                        }*/
                    }
                }
                else if (ability.bonusStrength != undefined && ability.name == 'undying_decay') {
                    // undying_decay
                    totalAttribute-=ability.bonusStrength();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getStrength = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // sven_gods_strength
                                case 'gods_strength_bonus_str':
                                    totalAttribute += parseInt(attribute.value[ability.level()-1]);
                                break;
                            }
                        }
                    }
                }
                else {
                    if (ability.bonusStrength != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // pudge_flesh_heap,morphling_morph_str,morphling_morph_agi,undying_decay
                            totalAttribute+=ability.bonusStrength();
                        }
                    }
                    if (ability.bonusStrength2 != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // morphling_morph_str
                            totalAttribute+=ability.bonusStrength2();
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAgility = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // drow_ranger_marksmanship
                                case 'marksmanship_agility_bonus':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                            }
                        }
                    }
                }
                else {
                    if (ability.bonusAgility != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility();
                        }
                    }
                    if (ability.bonusAgility2 != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility2();
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getIntelligence = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // invoker_exort
                            /*    case 'bonus_intelligence':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;*/
                            }
                        }
                    }
                }
                /*else if (ability.bonusInt != undefined) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name == 'invoker_exort') {
                        // invoker_exort
                        totalAttribute+=ability.bonusInt();
                    }
                }*/
            }
        }
        return totalAttribute;
    });
    
    self.getArmor = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // axe_berserkers_call,dragon_knight_dragon_blood,troll_warlord_berserkers_rage,lycan_shapeshift,enraged_wildkin_toughness_aura
                            case 'bonus_armor':
                                if (ability.name != 'templar_assassin_meld') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // sven_warcry
                            case 'warcry_armor':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // lich_frost_armor,ogre_magi_frost_armor
                            case 'armor_bonus':
                                if (ability.name == 'lich_frost_armor' || ability.name == 'ogre_magi_frost_armor') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.armor != undefined) {
                    // shredder_reactive_armor,visage_gravekeepers_cloak
                    totalAttribute+=ability.armor();
                }
            }
        }
        return totalAttribute;
    });

    self.getArmorBaseReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        //elder_titan_natural_order
                        case 'elder_titan_natural_order':
                            totalAttribute *= (1-self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_reduction_pct', ability.level())/100);
                        break;
                    }
                //}
            }
        }
        return totalAttribute;
    });
    
    self.getArmorReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        //templar_assassin_meld
                        case 'templar_assassin_meld':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_armor', ability.level());
                        break;
                        // tidehunter_gush
                        case 'tidehunter_gush':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_bonus', ability.level());
                        break;
                        // naga_siren_rip_tide
                        case 'naga_siren_rip_tide':
                        // slardar_amplify_damage
                        case 'slardar_amplify_damage':
                        // vengefulspirit_wave_of_terror
                        case 'vengefulspirit_wave_of_terror':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_reduction', ability.level());
                        break;
                        // nevermore_dark_lord
                        case 'nevermore_dark_lord':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'presence_armor_reduction', ability.level());
                        break;
                    }
                }
                else if (ability.armorReduction != undefined) {
                    // alchemist_acid_spray
                    totalAttribute+=ability.armorReduction();
                }
            }
        }
        return totalAttribute;
    });

    self.getHealth = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // lone_druid_true_form,lycan_shapeshift,troll_warlord_berserkers_rage
                            case 'bonus_hp':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // lone_druid_synergy
                            case 'true_form_hp_bonus':
                                if (self.isTrueFormActive()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.bonusHealth != undefined) {
                    // clinkz_death_pact
                    totalAttribute+=ability.bonusHealth();
                }
            }
        }
        return totalAttribute;
    });
    
    self.isTrueFormActive = function () {
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.isActive() && ability.name == 'lone_druid_true_form') {
                return true;
            }
        }
        return false;
    }

    self.getHealthRegen = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage, dragon_knight_dragon_blood
                            case 'bonus_health_regen':
                            // broodmother_spin_web
                            case 'heath_regen':
                            // omniknight_guardian_angel,treant_living_armor,satyr_hellcaller_unholy_aura
                            case 'health_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // legion_commander_press_the_attack
                            case 'hp_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.healthregen != undefined) {
                    // shredder_reactive_armor,invoker_quas,necrolyte_sadist
                    totalAttribute+=ability.healthregen();
                }
            }
        }
        return totalAttribute;
    });

    self.getMana = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // obsidian_destroyer_essence_aura
                            case 'bonus_mana':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                //}
            }
        }
        return totalAttribute;
    });
    
    self.getManaRegen = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage
                            case 'bonus_mana_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.manaregen != undefined) {
                    // necrolyte_sadist
                    totalAttribute+=ability.manaregen();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getManaRegenArcaneAura = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // crystal_maiden_brilliance_aura
                            case 'mana_regen':
                                if (ability.name == 'crystal_maiden_brilliance_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                //}
            }
        }
        return totalAttribute;
    });

    self.getManaRegenReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                /*if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        //switch(attribute.name) {
                        //    // 
                        //    case '':
                        //        totalAttribute += parseInt(attribute.value[ability.level()-1]);
                        //    break;
                        //}
                    }
                }
                else*/ if (ability.manaregenreduction != undefined) {
                    // pugna_nether_ward
                    totalAttribute+=ability.manaregenreduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackRange = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // winter_wyvern_arctic_burn
                                case 'attack_range_bonus':
                                // templar_assassin_psi_blades,sniper_take_aim
                                case 'bonus_attack_range':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                                // terrorblade_metamorphosis,troll_warlord_berserkers_rage
                                case 'bonus_range':
                                    if (ability.name == 'terrorblade_metamorphosis') {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                    if (ability.name == 'troll_warlord_berserkers_rage') {
                                        totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                                // tiny_grow
                                case 'bonus_range_scepter':
                                    if (ability.name == 'tiny_grow' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                                // enchantress_impetus
                                case 'bonus_attack_range_scepter':
                                    if (ability.name == 'enchantress_impetus' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                            }
                        }
                        // lone_druid_true_form
                        if (ability.name == 'lone_druid_true_form') {
                            totalAttribute -= 422;
                        }
                    }
                    else if (ability.name == 'enchantress_impetus' && self.hasScepter()) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                              case 'bonus_attack_range_scepter':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                              break;
                            }
                        }
                    }
                }
                else if (ability.attackrange != undefined) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        // dragon_knight_elder_dragon_form
                        totalAttribute+=ability.attackrange();
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackSpeed = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // abaddon_frostmourne,troll_warlord_battle_trance
                            case 'attack_speed':
                            // visage_grave_chill
                            case 'attackspeed_bonus':
                            // mirana_leap
                            case 'leap_speedbonus_as':
                            // life_stealer
                            case 'attack_speed_bonus':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // clinkz_strafe,ursa_overpower
                            case 'attack_speed_bonus_pct':
                                if (ability.name == 'clinkz_strafe' || ability.name == 'ursa_overpower') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // axe_culling_blade,necronomicon_archer_aoe
                            case 'speed_bonus':
                                if (ability.name == 'axe_culling_blade' || ability.name == 'necronomicon_archer_aoe') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // ancient_apparition_chilling_touch
                            case 'attack_speed_pct':
                                if (ability.name == 'ancient_apparition_chilling_touch') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // beastmaster_inner_beast,lycan_feral_impulse,lone_druid_rabid,tiny_grow,phantom_assassin_phantom_strike,windrunner_focusfire,ogre_magi_bloodlust,centaur_khan_endurance_aura
                            case 'bonus_attack_speed':
                                if (ability.name == 'beastmaster_inner_beast' 
                                 || ability.name == 'lycan_feral_impulse' 
                                 || ability.name == 'lone_druid_rabid' 
                                 || ability.name == 'tiny_grow' 
                                 || ability.name == 'phantom_assassin_phantom_strike' 
                                 || ability.name == 'windrunner_focusfire' 
                                 || ability.name == 'ogre_magi_bloodlust'
                                 || ability.name == 'centaur_khan_endurance_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.attackspeed != undefined) {
                    // troll_warlord_fervor,wisp_overcharge,lina_fiery_soul,invoker_alacrity,invoker_wex,huskar_berserkers_blood
                    totalAttribute+=ability.attackspeed();
                }
            }
        }
        return totalAttribute;
    });

    self.getAttackSpeedReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                            case 'attackspeed_slow':
                            // lich_frost_armor,lich_frost_nova,enchantress_untouchable
                            case 'slow_attack_speed':
                            // beastmaster_primal_roar
                            case 'slow_attack_speed_pct':
                            // storm_spirit_overload
                            case 'overload_attack_slow':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // omniknight_degen_aura
                            case 'speed_bonus':
                                if (ability.name == 'omniknight_degen_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // tusk_frozen_sigil,crystal_maiden_freezing_field
                            case 'attack_slow':
                                if (ability.name == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                                else if (ability.name == 'tusk_frozen_sigil') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            case 'attack_slow_scepter':
                                if (ability.name == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // faceless_void_time_walk
                            case 'attack_speed_pct':
                                if (ability.name == 'faceless_void_time_walk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // bounty_hunter_jinada
                            case 'bonus_attackspeed':
                                if (ability.name == 'bounty_hunter_jinada') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // brewmaster_thunder_clap
                            case 'attack_speed_slow':
                                if (ability.name == 'brewmaster_thunder_clap') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // medusa_stone_gaze
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // visage_grave_chill
                            case 'attackspeed_bonus':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // abaddon_frostmourne
                            case 'attack_slow_tooltip':
                                if (ability.name == 'abaddon_frostmourne') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                    if (ability.name == 'enraged_wildkin_tornado') {
                        totalAttribute -= 15;
                    }
                }
                else if (ability.attackspeedreduction != undefined) {
                    // viper_viper_strike,viper_corrosive_skin,jakiro_liquid_fire,lich_chain_frost,sandking_epicenter,earth_spirit_rolling_boulder
                    totalAttribute+=ability.attackspeedreduction();
                }
            }
        }
        return totalAttribute;
    });
    self.getBash = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // slardar_bash
                            case 'chance':
                            // sniper_headshot
                            case 'proc_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
                else if (ability.bash != undefined) {
                    // spirit_breaker_greater_bash,faceless_void_time_lock
                    totalAttribute *= (1 - ability.bash()/100);
                }
            }
        }
        return totalAttribute;
    });    
    self.getBaseDamage = ko.computed(function () {
        var totalAttribute = 0;
        var totalMultiplier = 1;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // tiny_grow,terrorblade_metamorphosis
                            case 'bonus_damage':
                                if (ability.name == 'tiny_grow' || ability.name == 'terrorblade_metamorphosis') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else {
                    if (ability.baseDamageMultiplier != undefined) {
                        // earthshaker_enchant_totem
                        totalMultiplier += ability.baseDamageMultiplier()/100;
                        /*totalAttribute += ability.baseDamage();
                        sources[ability.name] = {
                            'damage': ability.baseDamage(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        }*/
                    }
                    if (ability.baseDamage != undefined) {
                        // clinkz_death_pact
                        totalAttribute += ability.baseDamage();
                        sources[ability.name] = {
                            'damage': ability.baseDamage(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }
        return { sources: sources, total: totalAttribute, multiplier: totalMultiplier };
    });
    
    self.getSelfBaseDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_split_shot
                            case 'damage_modifier':
                                totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // windrunner_focusfire
                            case 'focusfire_damage_reduction':
                                if (!self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            case 'focusfire_damage_reduction_scepter':
                                if (self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBaseDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // vengefulspirit_command_aura
                            case 'bonus_damage_pct':
                                if (ability.name == 'vengefulspirit_command_aura') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
                else if (ability.baseDamageReductionPct != undefined) {
                    // nevermore_requiem
                    totalAttribute *= (1 + ability.baseDamageReductionPct()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBAT = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // troll_warlord_berserkers_rage,alchemist_chemical_rage,lone_druid_true_form,lycan_shapeshift
                            case 'base_attack_time':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    self.getBonusDamage = ko.computed(function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // broodmother_insatiable_hunger,luna_lunar_blessing,templar_assassin_refraction,templar_assassin_meld,troll_warlord_berserkers_rage,lone_druid_true_form_battle_cry
                            case 'bonus_damage':
                                if (ability.name == 'broodmother_insatiable_hunger' || ability.name == 'luna_lunar_blessing'
                                 || ability.name == 'templar_assassin_refraction' || ability.name == 'templar_assassin_meld'
                                 || ability.name == 'troll_warlord_berserkers_rage' || ability.name == 'lone_druid_true_form_battle_cry') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // lycan_howl
                            case 'hero_bonus_damage':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                sources[ability.name] = {
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                }
                            break;
                        }
                    }
                    if (ability.name == 'storm_spirit_overload') {
                        totalAttribute += self.getAbilityPropertyValue(ability, 'damage');
                        sources[ability.name] = {
                            'damage': self.getAbilityPropertyValue(ability, 'damage'),
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }                        
                    }
                }
                else if (ability.bonusDamage != undefined && ability.bonusDamage() != 0) {
                    // nevermore_necromastery,ursa_fury_swipes,ursa_enrage,invoker_alacrity,invoker_exort,elder_titan_ancestral_spirit,spectre_desolate,razor_static_link
                    totalAttribute+=ability.bonusDamage();
                    sources[ability.name] = {
                        'damage': ability.bonusDamage(),
                        'damageType': ability.name == 'spectre_desolate' ? 'pure' : 'physical',
                        'displayname': ability.displayname
                    }
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    });

    self.getBonusDamagePercent = ko.computed(function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bloodseeker_bloodrage
                            case 'damage_increase_pct':
                                if (ability.name == 'bloodseeker_bloodrage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // magnataur_empower,vengefulspirit_command_aura,alpha_wolf_command_aura
                            case 'bonus_damage_pct':
                                if (ability.name == 'magnataur_empower' || ability.name == 'vengefulspirit_command_aura' || ability.name == 'alpha_wolf_command_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // sven_gods_strength
                            case 'gods_strength_damage':
                                if (ability.name == 'sven_gods_strength' && self.hero != undefined && self.hero.heroId() == 'sven') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            case 'gods_strength_damage_scepter':
                                if (ability.name == 'sven_gods_strength' && self.hero == undefined) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                /*else if (ability.bonusDamagePct != undefined && ability.bonusDamagePct() != 0) {
                    // bloodseeker_bloodrage
                    // totalAttribute+=ability.bonusDamagePct()/100;
                    // sources[ability.name] = {
                        // 'damage': ability.bonusDamagePct()/100,
                        // 'damageType': 'physical',
                        // 'displayname': ability.displayname
                    // }
                }*/
            }
        }
        return { sources: sources, total: totalAttribute };
    });

    self.getBonusDamageBackstab = ko.computed(function () {
        var totalAttribute1 = 0;
        var totalAttribute2 = 0;
        var sources = [];
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.name == 'riki_backstab') {
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // riki_backstab
                            case 'damage_multiplier':
                                totalAttribute1 += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                sources.push({
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                });
                            break;
                        }
                    }/*
                    if (ability.bonusDamageBackstab != undefined) {
                        // damage_multiplier
                        totalAttribute2+=ability.bonusDamageBackstab();
                        sources.push({
                            'damage': ability.bonusDamageBackstab(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        });
                    }
                    */
                }
            }
        }
        return { sources: sources, total: [totalAttribute1,totalAttribute2] };
    });
    
    self.getBonusDamagePrecisionAura = ko.computed(function () {
        var totalAttribute1 = 0;
        var totalAttribute2 = 0;
        var sources = [];
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.name == 'drow_ranger_trueshot') {
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // drow_ranger_trueshot
                            case 'trueshot_ranged_damage':
                                totalAttribute1 += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                sources.push({
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                });
                            break;
                        }
                    }
                    if (ability.bonusDamagePrecisionAura != undefined) {
                        // drow_ranger_trueshot
                        totalAttribute2+=ability.bonusDamagePrecisionAura();
                        sources.push({
                            'damage': ability.bonusDamagePrecisionAura(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        });
                    }
                }
            }
        }
        return { sources: sources, total: [totalAttribute1,totalAttribute2] };
    });
    
    self.getBonusDamageReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bane_enfeeble
                            case 'enfeeble_attack_reduction':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.bonusDamageReduction != undefined) {
                    // rubick_fade_bolt,razor_static_link
                    totalAttribute+=ability.bonusDamageReduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBonusDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_split_shot
                            case 'damage_modifier':
                                totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // windrunner_focusfire
                            case 'focusfire_damage_reduction':
                                if (!self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            case 'focusfire_damage_reduction_scepter':
                                if (self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getDamageAmplification = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                /*if (!(ability.name in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // bane_enfeeble
                                case 'enfeeble_attack_reduction':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                            }
                        }
                    }
                }
                else*/ if (ability.damageAmplification != undefined) {
                        // undying_flesh_golem
                        totalAttribute *= (1 + ability.damageAmplification()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getDamageReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bloodseeker_bloodrage
                            case 'damage_increase_pct':
                                if (ability.name == 'bloodseeker_bloodrage') {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                    // kunkka_ghostship
                    if (ability.name == 'kunkka_ghostship') {
                        totalAttribute *= (1 - 50/100);
                    }
                }
                else if (ability.damageReduction != undefined) {
                    // wisp_overcharge,bristleback_bristleback,spectre_dispersion,medusa_mana_shield,ursa_enrage,visage_gravekeepers_cloak
                    totalAttribute *= (1 + ability.damageReduction()/100);
                }
            }
        }
        return totalAttribute;
    });

    self.getCritSource = ko.computed(function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike,juggernaut_blade_dance,alpha_wolf_critical_strike,giant_wolf_critical_strike
                        case 'phantom_assassin_coup_de_grace':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_bonus', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'brewmaster_drunken_brawler':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_multiplier', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'chaos_knight_chaos_strike':
                        case 'lycan_shapeshift':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_multiplier', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'skeleton_king_mortal_strike':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'juggernaut_blade_dance':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'blade_dance_crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'blade_dance_crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'alpha_wolf_critical_strike':
                        case 'giant_wolf_critical_strike':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                    }
                }
            }
        }
        return sources;
    });    

    self.getCleaveSource = ko.computed(function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        // magnataur_empower
                        case 'magnataur_empower':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'cleave_radius', ability.level()),
                                    'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'cleave_damage_pct', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // sven_great_cleave
                        case 'sven_great_cleave':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'great_cleave_radius', ability.level()),
                                    'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'great_cleave_damage', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // kunkka_tidebringer
                        case 'kunkka_tidebringer':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'radius', ability.level()),
                                    'magnitude': 1,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // tiny_grow
                        case 'tiny_grow':
                            if (self.hasScepter()) {
                                if (sources[ability.name] == undefined) {
                                    sources[ability.name] = {
                                        'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_cleave_radius_scepter', ability.level()),
                                        'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_cleave_damage_scepter', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname
                                    }
                                }
                                else {
                                    sources[ability.name].count += 1;
                                }
                            }
                        break;
                    }
                }
            }
        }
        return sources;
    });    
    
    self.getCritChance = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike
                            case 'crit_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });            
    
    self.getEvasion = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // phantom_assassin_blur
                            case 'bonus_evasion':
                            // brewmaster_drunken_brawler
                            case 'dodge_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getEvasionBacktrack = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // faceless_void_backtrack
                            case 'dodge_chance_pct':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMissChance = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // broodmother_incapacitating_bite,brewmaster_drunken_haze
                            case 'miss_chance':
                            // riki_smoke_screen,keeper_of_the_light_blinding_light,tinker_laser
                            case 'miss_rate':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
                else if (ability.missChance != undefined) {
                    // night_stalker_crippling_fear
                    totalAttribute*=(1-ability.missChance()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getLifesteal = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // skeleton_king_vampiric_aura
                            case 'vampiric_aura':
                            // broodmother_insatiable_hunger
                            case 'lifesteal_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.lifesteal != undefined) {
                    // life_stealer_open_wounds
                    totalAttribute+=ability.lifesteal();
                }
            }
        }
        return totalAttribute;
    });

    self.getSpellAmp = ko.computed(function () {
        var totalAttribute = 0;
        /*for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // keeper_of_the_light_chakra_magic
                            case 'cooldown_reduction':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
            }
        }*/
        return totalAttribute;
    });
    
    self.getCooldownReductionFlat = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // keeper_of_the_light_chakra_magic
                            case 'cooldown_reduction':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getCooldownReductionPercent = ko.computed(function () {
        var totalAttribute = 1;
        return totalAttribute;
    });

    self.getCooldownIncreaseFlat = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // faceless_void_time_dilation
                            case 'duration':
                                if (ability.name == 'faceless_void_time_dilation') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getCooldownIncreasePercent = ko.computed(function () {
        var totalAttribute = 1;
        return totalAttribute;
    });
    
    self.getMagicResist = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // antimage_spell_shield
                            case 'spell_shield_resistance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // phantom_lancer_phantom_edge
                            case 'magic_resistance_pct':
                                if (ability.name == 'phantom_lancer_phantom_edge') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            // rubick_null_field
                            case 'magic_damage_reduction_pct':
                                if (ability.name == 'rubick_null_field') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
                else if (ability.magicResist != undefined) {
                    // huskar_berserkers_blood,viper_corrosive_skin,visage_gravekeepers_cloak
                    totalAttribute *= (1 - ability.magicResist()/100);
                }
            }
        }
        return totalAttribute;
    });

    self.getMagicResistReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // ancient_apparition_ice_vortex
                            case 'spell_resist_pct':
                            // pugna_decrepify
                            case 'bonus_spell_damage_pct':
                            // skywrath_mage_ancient_seal
                            case 'resist_debuff':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // elder_titan_natural_order
                            case 'magic_resistance_pct':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMovementSpeedFlat = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage
                            case 'bonus_movespeed':
                                if (ability.name == 'alchemist_chemical_rage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // tiny_grow
                            case 'bonus_movement_speed':
                                if (ability.name == 'tiny_grow') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // troll_warlord_berserkers_rage
                            case 'bonus_move_speed':
                                if (ability.name == 'troll_warlord_berserkers_rage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }                                
                            break;
                            // lone_druid_true_form
                            case 'speed_loss':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.movementSpeedFlat != undefined) {
                // dragon_knight_elder_dragon_form
                    totalAttribute+=ability.movementSpeedFlat();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMovementSpeedPercent = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // abaddon_frostmourne 
                            case 'move_speed_pct':
                            // bounty_hunter_track 
                            case 'bonus_move_speed_pct':
                            // mirana_leap 
                            case 'leap_speedbonus':
                            // sven_warcry 
                            case 'warcry_movespeed':
                            // clinkz_wind_walk
                            case 'move_speed_bonus_pct':
                            // windrunner_windrun
                            case 'movespeed_bonus_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // broodmother_spin_web,spectre_spectral_dagger
                            case 'bonus_movespeed':
                                if (ability.name == 'broodmother_spin_web' || ability.name == 'spectre_spectral_dagger') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // axe_culling_blade,necronomicon_archer_aoe
                            case 'speed_bonus':
                                if (ability.name == 'axe_culling_blade' || ability.name == 'necronomicon_archer_aoe') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // nyx_assassin_vendetta 
                            case 'movement_speed':
                                if (ability.name == 'nyx_assassin_vendetta') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // spirit_breaker_empowering_haste
                            case 'bonus_movespeed_pct':
                                if (ability.name == 'spirit_breaker_empowering_haste') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // ogre_magi_bloodlust,death_prophet_witchcraft,kobold_taskmaster_speed_aura
                            case 'bonus_movement_speed':
                                if (ability.name == 'ogre_magi_bloodlust' || ability.name == 'death_prophet_witchcraft' || ability.name == 'kobold_taskmaster_speed_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // razor_unstable_current,phantom_lancer_doppelwalk
                            case 'movement_speed_pct':
                                if (ability.name == 'razor_unstable_current' || ability.name == 'phantom_lancer_doppelwalk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // treant_natures_guise,lone_druid_rabid
                            case 'bonus_move_speed':
                                if (ability.name == 'treant_natures_guise' || ability.name == 'lone_druid_rabid') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // wisp_tether
                            case 'movespeed':
                                if (ability.name == 'wisp_tether') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // kunkka_ghostship,visage_grave_chill
                            case 'movespeed_bonus':
                                if (ability.name == 'kunkka_ghostship' || ability.name == 'visage_grave_chill') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }                                
                            break;
                        }
                    }
                }
                else if (ability.movementSpeedPct != undefined) {
                // axe_battle_hunger,bristleback_warpath,spirit_breaker_greater_bash,lina_fiery_soul,invoker_ghost_walk,invoker_wex,elder_titan_ancestral_spirit
                    totalAttribute+=ability.movementSpeedPct()/100;
                }
            }
        }
        return totalAttribute;
    });

    self.getMovementSpeedPercentReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // crystal_maiden_freezing_field
                            case 'movespeed_slow':
                                if (ability.name == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            case 'movespeed_slow_scepter':
                                if (ability.name == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // elder_titan_earth_splitter,magnataur_skewer,abaddon_frostmourne 
                            case 'slow_pct':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                            case 'movespeed_slow':
                                if (ability.name != 'crystal_maiden_freezing_field') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // lich_frost_armor,lich_frost_nova,enchantress_enchant
                            case 'slow_movement_speed':
                            // beastmaster_primal_roar
                            case 'slow_movement_speed_pct':
                            // drow_ranger_frost_arrows
                            case 'frost_arrows_movement_speed':
                            // skeleton_king_hellfire_blast
                            case 'blast_slow':
                            // slardar_slithereen_crush
                            case 'crush_extra_slow':
                            // storm_spirit_overload:
                            case 'overload_move_slow':
                            // windrunner_windrun
                            case 'enemy_movespeed_bonus_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // phantom_assassin_stifling_dagger,tusk_frozen_sigil
                            case 'move_slow':
                                if (ability.name == 'phantom_assassin_stifling_dagger') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'tusk_frozen_sigil') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // invoker_ice_wall,medusa_stone_gaze,wisp_tether
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // broodmother_incapacitating_bite,bounty_hunter_jinada,spectre_spectral_dagger,winter_wyvern_arctic_burn
                            case 'bonus_movespeed':
                                if (ability.name == 'broodmother_incapacitating_bite' || ability.name == 'bounty_hunter_jinada' || ability.name == 'winter_wyvern_arctic_burn' || ability.name == 'winter_wyvern_splinter_blast') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'spectre_spectral_dagger') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // omniknight_degen_aura
                            case 'speed_bonus':
                                if (ability.name == 'omniknight_degen_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // tidehunter_gush
                            case 'movement_speed':
                                if (ability.name == 'tidehunter_gush') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // pugna_decrepify,chen_penitence
                            case 'bonus_movement_speed':
                                if (ability.name == 'pugna_decrepify' || ability.name == 'chen_penitence') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // ancient_apparition_ice_vortex,phantom_lancer_spirit_lance,skywrath_mage_concussive_shot,faceless_void_time_walk
                            case 'movement_speed_pct':
                                if (ability.name == 'ancient_apparition_ice_vortex' || ability.name == 'phantom_lancer_spirit_lance' || ability.name == 'faceless_void_time_walk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'skywrath_mage_concussive_shot') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // razor_unstable_current
                            case 'slow_amount':
                                if (ability.name == 'razor_unstable_current') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // brewmaster_drunken_haze,brewmaster_thunder_clap,treant_leech_seed
                            case 'movement_slow':
                                if (ability.name == 'brewmaster_drunken_haze' || ability.name == 'brewmaster_thunder_clap') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'ursa_earthshock' || ability.name == 'treant_leech_seed') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // skeleton_king_reincarnation
                            case 'movespeed':
                                if (ability.name == 'skeleton_king_reincarnation') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // kunkka_torrent,visage_grave_chill
                            case 'movespeed_bonus':
                                if (ability.name == 'kunkka_torrent') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'visage_grave_chill') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                        }
                    }
                    if (ability.name == 'satyr_trickster_purge') {
                        totalAttribute -= 80/100;
                    }
                    else if (ability.name == 'enraged_wildkin_tornado') {
                        totalAttribute -= 15/100;
                    }
                }
                else if (ability.movementSpeedPctReduction != undefined) {
                    // axe_battle_hunger,batrider_sticky_napalm,shredder_chakram,meepo_geostrike,life_stealer_open_wounds,
                    // venomancer_poison_sting,viper_viper_strike,viper_corrosive_skin,viper_poison_attack,venomancer_venomous_gale,treant_leech_seed
                    // lich_chain_frost,sniper_shrapnel,centaur_stampede,huskar_life_break,jakiro_dual_breath,meepo_geostrike,sandking_epicenter
                    // earth_spirit_rolling_boulder,invoker_ghost_walk,invoker_ice_wall,elder_titan_earth_splitter
                    // undying_flesh_golem,templar_assassin_psionic_trap,nevermore_requiem,queenofpain_shadow_strike
                    totalAttribute+=ability.movementSpeedPctReduction()/100;
                }
            }
        }
        return totalAttribute;
    });

    self.getTurnRateReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_stone_gaze
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                        }
                    }
                }
                else if (ability.turnRateReduction != undefined) {
                    // batrider_sticky_napalm
                    totalAttribute+=ability.turnRateReduction()/100;
                }
            }
        }
        return totalAttribute;
    });
    
    self.getVisionRangeNight = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // winter_wyvern_arctic_burn
                            case 'night_vision_bonus':
                            // lycan_shapeshift,luna_lunar_blessing
                            case 'bonus_night_vision':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.visionnight != undefined) {
                    // 
                    totalAttribute+=ability.visionnight();
                }
            }
        }
        return totalAttribute;
    });

    self.getVisionRangePctReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // night_stalker_darkness
                            case 'blind_percentage':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.setEvasion = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (ability.name == 'windrunner_windrun') {
                    return 1;
                }
            }
        }
        return totalAttribute;
    });
    
    self.setMovementSpeed = ko.computed(function () {
        var MAX_MOVESPEED = 522;
        var MIN_MOVESPEED = 100;
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (ability.name == 'spirit_breaker_charge_of_darkness') {
                    return self.getAbilityAttributeValue(ability.attributes, 'movement_speed', ability.level());
                }
                if (ability.name == 'dark_seer_surge') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'centaur_stampede') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'lycan_shapeshift') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'lion_voodoo' || ability.name == 'shadow_shaman_voodoo') {
                    return MIN_MOVESPEED;
                }
            }
        }
        return totalAttribute;
    });

    self.getBashSource = function (attacktype) {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // sniper_headshot
                            case 'proc_chance':
                                if (sources[ability.name] == undefined && ability.name == 'sniper_headshot') {
                                    sources[ability.name] = {
                                        'chance': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100,
                                        'damage': self.getAbilityPropertyValue(ability, 'damage'),
                                        'count': 1,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // slardar_bash
                            case 'chance':
                                if (sources[ability.name] == undefined && ability.name == 'slardar_bash') {
                                    sources[ability.name] = {
                                        'chance': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100,
                                        'damage': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage', ability.level()),
                                        'count': 1,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else if (ability.bashBonusDamage != undefined) {
                    // faceless_void_time_lock
                    if (sources[ability.name] == undefined && ability.name == 'faceless_void_time_lock') {
                        sources[ability.name] = {
                            'chance': ability.bash()/100,
                            'damage': ability.bashBonusDamage(),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }
                    }
                    // spirit_breaker_greater_bash
                    if (sources[ability.name] == undefined && ability.name == 'spirit_breaker_greater_bash') {
                        sources[ability.name] = {
                            'chance': ability.bash()/100,
                            'damage': ability.bashBonusDamage()/100,
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }

        return sources;
    };
    
    self.getOrbSource = function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // antimage_mana_break
                            case 'mana_per_hit':
                                if (sources[ability.name] == undefined && ability.name == 'antimage_mana_break') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level()) 
                                                * self.getAbilityAttributeValue(ability.attributes, 'damage_per_burn', ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // clinkz_searing_arrows
                            case 'damage_bonus':
                                if (sources[ability.name] == undefined && ability.name == 'clinkz_searing_arrows') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            // silencer_glaives_of_wisdom
                            case 'intellect_damage_pct':
                                if (sources[ability.name] == undefined && ability.name == 'silencer_glaives_of_wisdom') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100 * self.hero.totalInt(),
                                        'damageType': 'pure',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else if (ability.bonusDamageOrb != undefined) {
                    // obsidian_destroyer_arcane_orb
                    if (sources[ability.name] == undefined && ability.name == 'obsidian_destroyer_arcane_orb') {
                        sources[ability.name] = {
                            'damage': ability.bonusDamageOrb(),
                            'damageType': 'pure',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }
        
        return sources;
    };
    
    self.toggleAbility = function (index, data, event) {
        if (self.abilities()[index()].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
            if (self.abilities()[index()].isActive()) {
                self.abilities()[index()].isActive(false);
            }
            else {
                self.abilities()[index()].isActive(true);
            }
            
            if (self.abilities()[index()].name == 'lycan_shapeshift') {
                self.isShapeShiftActive(self.abilities()[index()].isActive());
            }
        }
    }.bind(this);

    self.toggleAbilityDetail = function (index, data, event) {
        if (self.abilities()[index()].isDetail()) {
            self.abilities()[index()].isDetail(false);
        }
        else {
            self.abilities()[index()].isDetail(true);
        }
    }.bind(this);
    
    self.getAbility = function (abilityName) {
        return self.abilities().find(function(b) {
            return b.name == abilityName;
        });
    }
}

AbilityModel.prototype.levelUpAbility = function (index, data, event, hero) {
    var self = this;
    if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data) && hero.availableSkillPoints() > 0 ) {
        switch(self.abilities()[index()].abilitytype) {
            case 'DOTA_ABILITY_TYPE_ULTIMATE':
                if (hero.heroId() == 'invoker') {
                    if (
                        (self.abilities()[index()].level() == 0) && (parseInt(hero.selectedHeroLevel()) >= 2) ||
                        (self.abilities()[index()].level() == 1) && (parseInt(hero.selectedHeroLevel()) >= 7) ||
                        (self.abilities()[index()].level() == 2) && (parseInt(hero.selectedHeroLevel()) >= 11) ||
                        (self.abilities()[index()].level() == 3) && (parseInt(hero.selectedHeroLevel()) >= 17)
                    ) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
                else if (hero.heroId() == 'meepo') {
                    if (self.abilities()[index()].level() * 7 + 3 <= parseInt(hero.selectedHeroLevel())) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
                else {
                    if ((self.abilities()[index()].level()+1) * 5 + 1 <= parseInt(hero.selectedHeroLevel())) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
            break;
            default:
                if (self.abilities()[index()].level() * 2 + 1 <= parseInt(hero.selectedHeroLevel())) {
                    self.abilities()[index()].level(self.abilities()[index()].level()+1);
                    hero.skillPointHistory.push(index());
                }
            break;
        }
        switch (self.abilities()[index()].name) {
            case 'beastmaster_call_of_the_wild':
            case 'chen_test_of_faith':
            case 'morphling_morph_agi':
            case 'shadow_demon_shadow_poison':
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
            break;
            case 'morphling_morph_str':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
            case 'keeper_of_the_light_spirit_form':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() - 2].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze1':
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
                self.abilities()[index() + 2].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze2':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze3':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() - 2].level(self.abilities()[index()].level());
            break;
            case 'ember_spirit_fire_remnant':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
            case 'lone_druid_true_form':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
            case 'monkey_king_tree_dance':
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
            break;
        }
    }
};
AbilityModel.prototype.levelDownAbility = function (index, data, event, hero) {
    var i = ko.utils.unwrapObservable(index);
    var self = this;
    if (self.abilities()[i].level() > 0) {
        self.abilities()[i].level(self.abilities()[i].level() - 1);
        hero.skillPointHistory.splice(hero.skillPointHistory().lastIndexOf(i), 1);
        switch (self.abilities()[i].name) {
            case 'beastmaster_call_of_the_wild':
            case 'chen_test_of_faith':
            case 'morphling_morph_agi':
            case 'shadow_demon_shadow_poison':
                self.abilities()[i + 1].level(self.abilities()[i].level());
            break;
            case 'morphling_morph_str':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
            case 'keeper_of_the_light_spirit_form':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i - 2].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze1':
                self.abilities()[i + 1].level(self.abilities()[i].level());
                self.abilities()[i + 2].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze2':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i + 1].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze3':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i - 2].level(self.abilities()[i].level());
            break;
            case 'ember_spirit_fire_remnant':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
            case 'lone_druid_true_form':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
            case 'monkey_king_tree_dance':
                self.abilities()[i + 1].level(self.abilities()[i].level());
            break;
        }
    }
};
AbilityModel.prototype.getAbilityAttributeValue = function (attributes, attributeName, level) {
    for (var i=0; i < attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (level == 0) {
                return parseFloat(attributes[i].value[0]);
            }
            else if (level > attributes[i].value.length) {
                return parseFloat(attributes[i].value[0]);
            }
            else {
                return parseFloat(attributes[i].value[level-1]);
            }
        }
    }
}
AbilityModel.prototype.getAbilityAttributeTooltip = function (attributes, attributeName) {
    for (var i=0; i<attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (attributes[i].hasOwnProperty('tooltip')) {
                var d = attributes[i].tooltip.replace(/\\n/g, '');
                return d;
            }
            else {
                return '';
            }
        }
    }
    return '';
}

module.exports = AbilityModel;
},{"./hero/TalentController":14,"./herocalc_abilitydata":20,"./herocalc_knockout":21}],2:[function(require,module,exports){
'use strict';
var ko = require('./herocalc_knockout');

var AbilityModel = require("./AbilityModel");
var InventoryViewModel = require("./inventory/InventoryViewModel");
var findWhere = require("./util/findWhere");
var buffOptionsArray = require("./buffs/buffOptionsArray");
var debuffOptionsArray = require("./buffs/debuffOptionsArray");

var BuffViewModel = function (itemData, a) {
    var self = this;
    AbilityModel.call(this, ko.observableArray([]));
    self.availableBuffs = ko.observableArray(buffOptionsArray.items);
    self.availableDebuffs = ko.observableArray(debuffOptionsArray.items);
    self.selectedBuff = ko.observable(self.availableBuffs()[0]);
    
    self.buffs = ko.observableArray([]);
    self.itemBuffs = new InventoryViewModel(itemData);
    
    self.addBuff = function (data, event) {
        if (findWhere(self.buffs(), { name: self.selectedBuff().buffName }) == undefined) {
            var a = JSON.parse(JSON.stringify(self.selectedBuff().abilityData));
            a.level = ko.observable(0);
            a.isActive = ko.observable(false);
            a.isDetail = ko.observable(false);
            a.baseDamage = ko.observable(0);
            a.bash = ko.observable(0);
            a.bashBonusDamage = ko.observable(0);
            a.bonusDamage = ko.observable(0);
            a.bonusDamageOrb = ko.observable(0);
            a.bonusDamagePct = ko.observable(0);
            a.bonusDamagePrecisionAura = ko.observable(0);
            a.bonusDamageReduction = ko.observable(0);
            a.bonusHealth = ko.observable(0);
            a.bonusStrength = ko.observable(0);
            a.bonusStrength2 = ko.observable(0);
            a.bonusAgility = ko.observable(0);
            a.bonusAgility2 = ko.observable(0);
            a.bonusInt = ko.observable(0);
            a.bonusAllStatsReduction = ko.observable(0);
            a.damageAmplification = ko.observable(0);
            a.damageReduction = ko.observable(0);
            a.evasion = ko.observable(0);
            a.magicResist = ko.observable(0);
            a.manaregen = ko.observable(0);
            a.manaregenreduction = ko.observable(0);
            a.missChance = ko.observable(0);
            a.movementSpeedFlat = ko.observable(0);
            a.movementSpeedPct = ko.observable(0);
            a.movementSpeedPctReduction = ko.observable(0);
            a.turnRateReduction = ko.observable(0);
            a.attackrange = ko.observable(0);
            a.attackspeed = ko.observable(0);
            a.attackspeedreduction = ko.observable(0);
            a.armor = ko.observable(0);
            a.armorReduction = ko.observable(0);
            a.healthregen = ko.observable(0);
            a.lifesteal = ko.observable(0);
            a.visionnight = ko.observable(0);
            a.visionday = ko.observable(0);
            switch (a.name) {
                case 'invoker_cold_snap':
                case 'invoker_ghost_walk':
                case 'invoker_tornado':
                case 'invoker_emp':
                case 'invoker_alacrity':
                case 'invoker_chaos_meteor':
                case 'invoker_sun_strike':
                case 'invoker_forge_spirit':
                case 'invoker_ice_wall':
                case 'invoker_deafening_blast':
                    a.level(1);
                break;
            }
            self.abilities.push(a);
            self.buffs.push({ name: self.selectedBuff().buffName, hero: self.selectedBuff().hero, data: a });
        }
    };
    
    self.removeBuff = function (data, event, abilityName) {
        if (findWhere(self.buffs(), { name: abilityName })  != undefined) {
                self.buffs.remove(findWhere(self.buffs(), { name: abilityName }));
                if (self.abilityControlData[abilityName] != undefined) {
                    for (var i = 0; i < self.abilityControlData[abilityName].data.length; i++) {
                        if (self.abilityControlData[abilityName].data[i].controlVal.dispose != undefined) {
                            self.abilityControlData[abilityName].data[i].controlVal.dispose();
                        }
                        if (self.abilityControlData[abilityName].data[i].clean != undefined) {
                            self.abilityControlData[abilityName].data[i].clean.dispose();
                        }
                    }
                    self.abilityControlData[abilityName] = undefined;
                }
                for (var i = 0; i < self.abilities().length; i++) {
                    if (self.abilities()[i].name == abilityName) {
                        self.abilities()[i].level(0);
                        self.abilities.remove(self.abilities()[i]);
                        break;
                    }
                }
        }
    };
    self.toggleBuff = function (index, data, event) {
        if (self.buffs()[index()].data.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
            if (self.buffs()[index()].data.isActive()) {
                self.buffs()[index()].data.isActive(false);
                self.abilities()[index()].isActive(false);
            }
            else {
                self.buffs()[index()].data.isActive(true);
                self.abilities()[index()].isActive(true);
            }
        }
    }.bind(this);

    self.toggleBuffDetail = function (index, data, event) {
        if (self.buffs()[index()].data.isDetail()) {
            self.buffs()[index()].data.isDetail(false);
        }
        else {
            self.buffs()[index()].data.isDetail(true);
        }
    }.bind(this);

    // Overrides the ability module function to remove available skill point check
    self.levelUpAbility = function (index, data, event, hero) {
        if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data)) {
            switch(self.abilities()[index()].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                break;
                default:
                    self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                break;
            }
            switch (self.abilities()[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 2].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                break;
            }
        }
    };
    self.levelDownAbility = function (index, data, event, hero) {
        if (self.abilities()[index()].level() > 0) {
            self.abilities()[index()].level(self.abilities()[index()].level() - 1);
            switch (self.abilities()[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 2].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                break;
                case 'ember_spirit_fire_remnant':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'lone_druid_true_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
            }
        }
    };
    
    return self;
}
BuffViewModel.prototype = Object.create(AbilityModel.prototype);
BuffViewModel.prototype.constructor = BuffViewModel;

module.exports = BuffViewModel;
},{"./AbilityModel":1,"./buffs/buffOptionsArray":4,"./buffs/debuffOptionsArray":5,"./herocalc_knockout":21,"./inventory/InventoryViewModel":25,"./util/findWhere":36}],3:[function(require,module,exports){
var findWhere = require("../util/findWhere");

var BuffModel = function (heroData, unitData, hero, ability) {
    this.buffName = ability;
    if (heroData['npc_dota_hero_' + hero] == undefined) {
        this.hero = hero;
        this.abilityData = findWhere(unitData[hero].abilities, {name: ability})
        this.buffDisplayName = unitData[hero].displayname + ' - ' + this.abilityData.displayname;
    }
    else {
        this.hero = 'npc_dota_hero_' + hero;
        this.abilityData = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: ability})
        this.buffDisplayName = heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
        if (ability == 'sven_gods_strength') {
            this.buffDisplayName += ' (Aura for allies)';
        }
    }

};

module.exports = BuffModel;
},{"../util/findWhere":36}],4:[function(require,module,exports){
var BuffModel = require("./BuffModel");

var buffOptionsArray = {};

var init = function (heroData, unitData) {
    buffOptionsArray.items = [
        new BuffModel(heroData, unitData, 'abaddon', 'abaddon_frostmourne'),
        new BuffModel(heroData, unitData, 'axe', 'axe_culling_blade'),
        new BuffModel(heroData, unitData, 'beastmaster', 'beastmaster_inner_beast'),
        new BuffModel(heroData, unitData, 'bloodseeker', 'bloodseeker_bloodrage'),
        new BuffModel(heroData, unitData, 'bounty_hunter', 'bounty_hunter_track'),
        new BuffModel(heroData, unitData, 'centaur', 'centaur_stampede'),
        new BuffModel(heroData, unitData, 'crystal_maiden', 'crystal_maiden_brilliance_aura'),
        new BuffModel(heroData, unitData, 'dark_seer', 'dark_seer_surge'),
        new BuffModel(heroData, unitData, 'dazzle', 'dazzle_weave'),
        new BuffModel(heroData, unitData, 'drow_ranger', 'drow_ranger_trueshot'),
        new BuffModel(heroData, unitData, 'invoker', 'invoker_alacrity'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_tether'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_overcharge'),
        new BuffModel(heroData, unitData, 'kunkka', 'kunkka_ghostship'),
        new BuffModel(heroData, unitData, 'lich', 'lich_frost_armor'),
        new BuffModel(heroData, unitData, 'life_stealer', 'life_stealer_open_wounds'),
        new BuffModel(heroData, unitData, 'luna', 'luna_lunar_blessing'),
        new BuffModel(heroData, unitData, 'lycan', 'lycan_howl'),
        new BuffModel(heroData, unitData, 'magnataur', 'magnataur_empower'),
        new BuffModel(heroData, unitData, 'mirana', 'mirana_leap'),
        new BuffModel(heroData, unitData, 'ogre_magi', 'ogre_magi_bloodlust'),
        new BuffModel(heroData, unitData, 'omniknight', 'omniknight_guardian_angel'),
        new BuffModel(heroData, unitData, 'rubick', 'rubick_null_field'),
        new BuffModel(heroData, unitData, 'skeleton_king', 'skeleton_king_vampiric_aura'),
        new BuffModel(heroData, unitData, 'spirit_breaker', 'spirit_breaker_empowering_haste'),
        new BuffModel(heroData, unitData, 'sven', 'sven_warcry'),
        new BuffModel(heroData, unitData, 'sven', 'sven_gods_strength'),
        new BuffModel(heroData, unitData, 'treant', 'treant_living_armor'),
        new BuffModel(heroData, unitData, 'troll_warlord', 'troll_warlord_battle_trance'),
        new BuffModel(heroData, unitData, 'vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_critical_strike'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_command_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_polar_furbolg_ursa_warrior', 'centaur_khan_endurance_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_kobold_taskmaster', 'kobold_taskmaster_speed_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_satyr_hellcaller', 'satyr_hellcaller_unholy_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_toughness_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_necronomicon_archer_1', 'necronomicon_archer_aoe')
    ];
    return buffOptionsArray.items;
}

buffOptionsArray.init = init;

module.exports = buffOptionsArray;
},{"./BuffModel":3}],5:[function(require,module,exports){
var BuffModel = require("./BuffModel");

var debuffOptionsArray = {};

var init = function (heroData, unitData) {
    debuffOptionsArray.items = [
        new BuffModel(heroData, unitData, 'abaddon', 'abaddon_frostmourne'),
        new BuffModel(heroData, unitData, 'alchemist', 'alchemist_acid_spray'),
        new BuffModel(heroData, unitData, 'ancient_apparition', 'ancient_apparition_ice_vortex'),
        new BuffModel(heroData, unitData, 'axe', 'axe_battle_hunger'),
        new BuffModel(heroData, unitData, 'bane', 'bane_enfeeble'),
        new BuffModel(heroData, unitData, 'batrider', 'batrider_sticky_napalm'),
        new BuffModel(heroData, unitData, 'beastmaster', 'beastmaster_primal_roar'),
        new BuffModel(heroData, unitData, 'bounty_hunter', 'bounty_hunter_jinada'),
        new BuffModel(heroData, unitData, 'brewmaster', 'brewmaster_thunder_clap'),
        new BuffModel(heroData, unitData, 'brewmaster', 'brewmaster_drunken_haze'),
        new BuffModel(heroData, unitData, 'bristleback', 'bristleback_viscous_nasal_goo'),
        new BuffModel(heroData, unitData, 'broodmother', 'broodmother_incapacitating_bite'),
        new BuffModel(heroData, unitData, 'centaur', 'centaur_stampede'),
        new BuffModel(heroData, unitData, 'chen', 'chen_penitence'),
        new BuffModel(heroData, unitData, 'crystal_maiden', 'crystal_maiden_crystal_nova'),
        new BuffModel(heroData, unitData, 'crystal_maiden', 'crystal_maiden_freezing_field'),
        new BuffModel(heroData, unitData, 'dazzle', 'dazzle_weave'),
        new BuffModel(heroData, unitData, 'drow_ranger', 'drow_ranger_frost_arrows'),
        new BuffModel(heroData, unitData, 'earth_spirit', 'earth_spirit_rolling_boulder'),
        new BuffModel(heroData, unitData, 'elder_titan', 'elder_titan_natural_order'),
        new BuffModel(heroData, unitData, 'elder_titan', 'elder_titan_earth_splitter'),
        new BuffModel(heroData, unitData, 'enchantress', 'enchantress_untouchable'),
        new BuffModel(heroData, unitData, 'enchantress', 'enchantress_enchant'),
        new BuffModel(heroData, unitData, 'faceless_void', 'faceless_void_time_walk'),
        new BuffModel(heroData, unitData, 'huskar', 'huskar_life_break'),
        new BuffModel(heroData, unitData, 'invoker', 'invoker_ghost_walk'),
        new BuffModel(heroData, unitData, 'invoker', 'invoker_ice_wall'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_tether'),
        new BuffModel(heroData, unitData, 'jakiro', 'jakiro_dual_breath'),
        new BuffModel(heroData, unitData, 'jakiro', 'jakiro_liquid_fire'),
        new BuffModel(heroData, unitData, 'keeper_of_the_light', 'keeper_of_the_light_blinding_light'),
        new BuffModel(heroData, unitData, 'kunkka', 'kunkka_torrent'),
        new BuffModel(heroData, unitData, 'lich', 'lich_frost_nova'),
        new BuffModel(heroData, unitData, 'lich', 'lich_frost_armor'),
        new BuffModel(heroData, unitData, 'lich', 'lich_chain_frost'),
        new BuffModel(heroData, unitData, 'life_stealer', 'life_stealer_open_wounds'),
        new BuffModel(heroData, unitData, 'lion', 'lion_voodoo'),
        new BuffModel(heroData, unitData, 'magnataur', 'magnataur_skewer'),
        new BuffModel(heroData, unitData, 'medusa', 'medusa_stone_gaze'),
        new BuffModel(heroData, unitData, 'meepo', 'meepo_geostrike'),
        new BuffModel(heroData, unitData, 'naga_siren', 'naga_siren_rip_tide'),
        new BuffModel(heroData, unitData, 'night_stalker', 'night_stalker_void'),
        new BuffModel(heroData, unitData, 'night_stalker', 'night_stalker_crippling_fear'),
        new BuffModel(heroData, unitData, 'night_stalker', 'night_stalker_darkness'),
        new BuffModel(heroData, unitData, 'ogre_magi', 'ogre_magi_ignite'),
        new BuffModel(heroData, unitData, 'omniknight', 'omniknight_degen_aura'),
        new BuffModel(heroData, unitData, 'phantom_assassin', 'phantom_assassin_stifling_dagger'),
        new BuffModel(heroData, unitData, 'phantom_lancer', 'phantom_lancer_spirit_lance'),
        new BuffModel(heroData, unitData, 'pudge', 'pudge_rot'),
        new BuffModel(heroData, unitData, 'pugna', 'pugna_decrepify'),
        new BuffModel(heroData, unitData, 'queenofpain', 'queenofpain_shadow_strike'),
        new BuffModel(heroData, unitData, 'riki', 'riki_smoke_screen'),
        new BuffModel(heroData, unitData, 'rubick', 'rubick_fade_bolt'),
        new BuffModel(heroData, unitData, 'sand_king', 'sandking_epicenter'),
        new BuffModel(heroData, unitData, 'nevermore', 'nevermore_dark_lord'),
        new BuffModel(heroData, unitData, 'shadow_shaman', 'shadow_shaman_voodoo'),
        new BuffModel(heroData, unitData, 'skeleton_king', 'skeleton_king_hellfire_blast'),
        new BuffModel(heroData, unitData, 'skeleton_king', 'skeleton_king_reincarnation'),
        new BuffModel(heroData, unitData, 'skywrath_mage', 'skywrath_mage_concussive_shot'),
        new BuffModel(heroData, unitData, 'skywrath_mage', 'skywrath_mage_ancient_seal'),
        new BuffModel(heroData, unitData, 'slardar', 'slardar_slithereen_crush'),
        new BuffModel(heroData, unitData, 'slardar', 'slardar_amplify_damage'),
        new BuffModel(heroData, unitData, 'slark', 'slark_essence_shift'),
        new BuffModel(heroData, unitData, 'sniper', 'sniper_shrapnel'),
        new BuffModel(heroData, unitData, 'spectre', 'spectre_spectral_dagger'),
        new BuffModel(heroData, unitData, 'storm_spirit', 'storm_spirit_overload'),
        new BuffModel(heroData, unitData, 'templar_assassin', 'templar_assassin_meld'),
        new BuffModel(heroData, unitData, 'tidehunter', 'tidehunter_gush'),
        new BuffModel(heroData, unitData, 'tinker', 'tinker_laser'),
        new BuffModel(heroData, unitData, 'treant', 'treant_leech_seed'),
        new BuffModel(heroData, unitData, 'tusk', 'tusk_frozen_sigil'),
        new BuffModel(heroData, unitData, 'undying', 'undying_flesh_golem'),
        new BuffModel(heroData, unitData, 'ursa', 'ursa_earthshock'),
        new BuffModel(heroData, unitData, 'vengefulspirit', 'vengefulspirit_wave_of_terror'),
        new BuffModel(heroData, unitData, 'vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel(heroData, unitData, 'venomancer', 'venomancer_venomous_gale'),
        new BuffModel(heroData, unitData, 'venomancer', 'venomancer_poison_sting'),
        new BuffModel(heroData, unitData, 'viper', 'viper_poison_attack'),
        new BuffModel(heroData, unitData, 'viper', 'viper_corrosive_skin'),
        new BuffModel(heroData, unitData, 'viper', 'viper_viper_strike'),
        new BuffModel(heroData, unitData, 'visage', 'visage_grave_chill'),
        new BuffModel(heroData, unitData, 'warlock', 'warlock_upheaval'),
        new BuffModel(heroData, unitData, 'weaver', 'weaver_the_swarm'),
        new BuffModel(heroData, unitData, 'windrunner', 'windrunner_windrun'),
        new BuffModel(heroData, unitData, 'winter_wyvern', 'winter_wyvern_arctic_burn'),
        new BuffModel(heroData, unitData, 'winter_wyvern', 'winter_wyvern_splinter_blast'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_ghost', 'ghost_frost_attack'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_polar_furbolg_ursa_warrior', 'polar_furbolg_ursa_warrior_thunder_clap'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_satyr_trickster', 'satyr_trickster_purge'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_tornado')
    ];
    return debuffOptionsArray.items;
}

debuffOptionsArray.init = init;

module.exports = debuffOptionsArray;
},{"./BuffModel":3}],6:[function(require,module,exports){
var HeroCalcData = {
    heroData: {},
    itemData: {},
    unitData: {}
};

module.exports = HeroCalcData;
},{}],7:[function(require,module,exports){
var HeroCalcData = require('./HeroCalcData') || {};
var getJSON = require("../util/getJSON");
var isEmpty = require("../util/isEmpty");
var isString = require("../util/isString");
var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

var resourceCounter = 0;

var onResourceLoaded = function (callback) {
    resourceCounter--;
    if (resourceCounter === 0) {
        fixHeroData(HeroCalcData.heroData);
        modifyItemData(HeroCalcData.itemData);
        if (callback) callback();
    }
}

var modifyItemData = function (itemData) {
    itemData["item_bottle_doubledamage"] = {
        displayname: "Double Damage",
        name: "item_bottle_doubledamage",
        attributes: [{
            "name": "bottle_doubledamage", 
            "tooltip": "%BONUS ATTACK DAMAGE:", 
            "value": [
                100
            ]
        }]
    }
}

var fixHeroData = function (heroData) {
    heroData['npc_dota_hero_invoker'].abilities[5].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_chen'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_nevermore'].abilities[1].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_nevermore'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_morphling'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_ogre_magi'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_techies'].abilities[4].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_beastmaster'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');

    var index = heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN');
    heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.splice(index, 1);

    index = heroData['npc_dota_hero_abaddon'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
    heroData['npc_dota_hero_abaddon'].abilities[2].behavior.splice(index, 1);

    index = heroData['npc_dota_hero_riki'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
    heroData['npc_dota_hero_riki'].abilities[2].behavior.splice(index, 1);
}

var init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    resourceCounter = 3;
    
    if (!HeroCalcData.heroData || isEmpty(HeroCalcData.heroData)) {
        if (isString(HERODATA_PATH)) {
            getJSON(HERODATA_PATH, function (data) {
                HeroCalcData.heroData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(HERODATA_PATH)) {
            HeroCalcData.heroData = HERODATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.itemData || isEmpty(HeroCalcData.itemData)) {
        if (isString(ITEMDATA_PATH)) {
            getJSON(ITEMDATA_PATH, function (data) {
                HeroCalcData.itemData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(ITEMDATA_PATH)) {
            HeroCalcData.itemData = ITEMDATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.unitData || isEmpty(HeroCalcData.unitData)) {
        if (isString(UNITDATA_PATH)) {
            getJSON(UNITDATA_PATH, function (data) {
                HeroCalcData.unitData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(UNITDATA_PATH)) {
            HeroCalcData.unitData = UNITDATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
}
    
HeroCalcData.init = init;

module.exports = HeroCalcData;
},{"../util/getJSON":37,"../util/isEmpty":38,"../util/isString":39,"./HeroCalcData":6}],8:[function(require,module,exports){
'use strict';
var HeroModel = require("./HeroModel");

var CloneModel = function (heroData, itemData, h,p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.parent = p;
    return self;
}
CloneModel.prototype = Object.create(HeroModel.prototype);
CloneModel.prototype.constructor = CloneModel;

module.exports = CloneModel;
},{"./HeroModel":11}],9:[function(require,module,exports){
var DamageTypeColor = {
    'physical': '#979aa2',
    'pure': 'goldenrod',
    'magic': '#428bca',
    'default': '#979aa2'
}

module.exports = DamageTypeColor;
},{}],10:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');
    
var DamageTypeColor = require("./DamageTypeColor");
var extend = require("../util/extend");
var TalentController = require("./TalentController");

var HeroDamageMixin = function (self, itemData) {
    self.critInfo = ko.pureComputed(function () {
        var critSources = self.inventory.getCritSource();
        extend(critSources, self.ability().getCritSource());
        extend(critSources, self.buffs.getCritSource());
        var critSourcesArray = [];
        for (var prop in critSources) {
            var el = critSources[prop];
            el.name = prop
            critSourcesArray.push(el);
        }
        function compareByMultiplier(a,b) {
            if (a.multiplier < b.multiplier)
                return 1;
            if (a.multiplier > b.multiplier)
                return -1;
            return 0;
        }

        critSourcesArray.sort(compareByMultiplier);
        
        var result = [];
        var critTotal = 0;
        for (var i = 0; i < critSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k <critSourcesArray[j].count; k++) {
                    total *= (1 - critSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < critSourcesArray[i].count; k++) {
                total2 *= (1 - critSourcesArray[i].chance);
            }
            total *= (1 - total2);
            critTotal += total;
            if (critSourcesArray[i].count > 1) {
                result.push({
                    'name':critSourcesArray[i].displayname + ' x' + critSourcesArray[i].count,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':critSourcesArray[i].displayname,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: critTotal };
    });

    self.cleaveInfo = ko.pureComputed(function () {
        var cleaveSources = self.inventory.getCleaveSource();
        extend(cleaveSources, self.ability().getCleaveSource());
        extend(cleaveSources, self.buffs.getCleaveSource());
        var cleaveSourcesArray = [];
        for (var prop in cleaveSources) {
            var el = cleaveSources[prop];
            el.name = prop
            cleaveSourcesArray.push(el);
        }
        function compareByRadius(a,b) {
            if (a.radius < b.radius)
                return 1;
            if (a.radius > b.radius)
                return -1;
            return 0;
        }

        cleaveSourcesArray.sort(compareByRadius);
        var cleaveSourcesByRadius = {};
        for (var i = 0; i < cleaveSourcesArray.length; i++) {
            var total = 0;
            for (var j = 0; j <cleaveSourcesArray.length; j++) {
                if (cleaveSourcesArray[j].radius >= cleaveSourcesArray[i].radius) {
                    total += cleaveSourcesArray[j].magnitude * cleaveSourcesArray[j].count;
                }
            }
            cleaveSourcesByRadius[cleaveSourcesArray[i].radius] = total;
        }
        var result = [];
        for (var prop in cleaveSourcesByRadius) {
            result.push({
                'radius':prop,
                'magnitude':cleaveSourcesByRadius[prop]
            });
        }
        return result;
    });
    
    self.bashInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var bashSources = self.inventory.getBashSource(attacktype);
        extend(bashSources, self.ability().getBashSource());
        var bashSourcesArray = [];
        for (var prop in bashSources) {
            var el = bashSources[prop];
            el.name = prop
            bashSourcesArray.push(el);
        }
        function compareByDuration(a, b) {
            if (a.duration < b.duration)
                return 1;
            if (a.duration > b.duration)
                return -1;
            return 0;
        }

        //bashSourcesArray.sort(compareByDuration);
        
        var result = [];
        var bashTotal = 0;
        for (var i = 0;i < bashSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < bashSourcesArray[j].count; k++) {
                    total *= (1 - bashSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < bashSourcesArray[i].count; k++) {
                total2 *= (1 - bashSourcesArray[i].chance);
            }
            total *= (1 - total2);
            bashTotal += total;
            if (bashSourcesArray[i].name === 'spirit_breaker_greater_bash') {
                var d = bashSourcesArray[i].damage * self.totalMovementSpeed();
            }
            else {
                var d = bashSourcesArray[i].damage;
            }
            if (bashSourcesArray[i].count > 1) {
                result.push({
                    'name':bashSourcesArray[i].displayname, // + ' x' + bashSourcesArray[i].count,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':bashSourcesArray[i].displayname,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }

        }
        return { sources: result, total: bashTotal };
    });
    
    self.orbProcInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var damageSources = self.inventory.getOrbProcSource();
        var damageSourcesArray = [];
        for (var prop in damageSources) {
            var el = damageSources[prop];
            el.name = prop
            damageSourcesArray.push(el);
        }
        function compareByDamage(a, b) {
            if (a.priority > b.priority) {
                return 1;
            }
            if (a.priority < b.priority) {
                return -1;
            }
            if (a.damage < b.damage)
                return 1;
            if (a.damage > b.damage)
                return -1;
            return 0;
        }

        damageSourcesArray.sort(compareByDamage);
        
        var result = [];
        var damageTotal = 0;
        for (var i=0 ; i < damageSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < damageSourcesArray[j].count; k++) {
                    total *= (1 - damageSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < damageSourcesArray[i].count; k++) {
                total2 *= (1 - damageSourcesArray[i].chance);
            }
            total *= (1 - total2);
            damageTotal += total;
            if (damageSourcesArray[i].count > 1) {
                result.push({
                    'name':damageSourcesArray[i].displayname + ' x' + damageSourcesArray[i].count,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':damageSourcesArray[i].displayname,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: damageTotal };
    });
    
    self.getReducedDamage = function (value, type) {
        var result = value;
        switch (type) {
            case 'physical':
                result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
            break;
            case 'magic':
                result = value * (1 - self.enemy().totalMagicResistance() / 100);
            break;
            case 'pure':
                result = value;
            break;
            case 'composite':
                result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
                result *= (1 - self.enemy().totalMagicResistance() / 100);
            break;
        }
        result *= self.ability().getDamageAmplification() * self.debuffs.getDamageAmplification();
        result *= self.enemy().ability().getDamageReduction() * self.enemy().buffs.getDamageReduction();
        return result;
    }
    
    self.damageTotalInfo = ko.pureComputed(function () {
        var bonusDamageArray = [
            self.ability().getBonusDamage().sources,
            self.buffs.getBonusDamage().sources,
            TalentController.getBonusDamage(self.selectedTalents()).sources
        ],
        bonusDamagePctArray = [
            self.ability().getBonusDamagePercent().sources,
            self.buffs.getBonusDamagePercent().sources
        ],
        itemBonusDamage = self.inventory.getBonusDamage().sources,
        itemBonusDamagePct = self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).sources,
        critSources = self.critInfo(),
        abilityOrbSources = self.ability().getOrbSource(),
        itemOrbSources = self.inventory.getOrbSource(),
        itemProcOrbSources = self.orbProcInfo(),
        bashSources = self.bashInfo(),
        
        attackSources = [];
        
        attackSources.push({
            name: 'Base Attack',
            cooldown: 1
        });
        
        // weaver_geminate_attack
        if (self.heroId() === 'weaver') {
            var a = self.ability().abilities().find(function (ability) {
                return ability.name === 'weaver_geminate_attack';
            });
            if (a) {
                if (a.level() > 0) {
                    var cd = a.cooldown[a.level() - 1];
                    attackSources.push({
                        name: a.displayname,
                        cooldown: (1/cd)
                    });
                }
            }
        }
        
        // echo_sabre
        var item = self.inventory.items().find(function (o) { return o.item === "echo_sabre" && o.enabled(); });
        if (item && self.heroData().attacktype === 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var item_echo_sabre = itemData['item_echo_sabre'];
            attackSources.push({
                name: item_echo_sabre.displayname,
                cooldown: (1/item_echo_sabre.cooldown)
            });
        }

        var attacks = attackSources.map(function (a) {
            var baseDamage = (self.baseDamage()[0] + self.baseDamage()[1]) / 2,
            totalDamage = 0,
            totalCritableDamage = 0,
            totalCrit = 0,
            geminateAttack = { damage: 0, damageReduced: 0, cooldown: 6, active: false },
            echoSabreAttack = { damage: 0, damageReduced: 0, cooldown: itemData['item_echo_sabre'].cooldown[0], active: false },
            damage = {
                pure: 0,
                physical: 0,
                magic: 0
            },
            result = [],
            crits = [];
            
            // base damage
            result.push({
                name: 'Base Damage',
                damage: baseDamage,
                damageType: 'physical',
                damageReduced: self.getReducedDamage(baseDamage, 'physical'),
                enabled: ko.observable(true)
            });
            totalDamage += baseDamage;
            totalCritableDamage += baseDamage;
            damage.physical += baseDamage;
            
            // bonus damage from items
            for (i in itemBonusDamage) {
                var d = itemBonusDamage[i].damage*itemBonusDamage[i].count * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct();
                result.push({
                    name: itemBonusDamage[i].displayname + (itemBonusDamage[i].count > 1 ? ' x' + itemBonusDamage[i].count : ''),
                    damage: d,
                    damageType: itemBonusDamage[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamage[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamage[i].damageType] += d;
            }

            // bonus damage percent from items
            for (i in itemBonusDamagePct) {
                var d = baseDamage * itemBonusDamagePct[i].damage;
                result.push({
                    name: itemBonusDamagePct[i].displayname,
                    damage: d,
                    damageType: itemBonusDamagePct[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamagePct[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamagePct[i].damageType] += d;
            }
            
            // bonus damage from abilities and buffs
            for (var i = 0; i < bonusDamageArray.length; i++) {
                for (j in bonusDamageArray[i]) {
                    var d = bonusDamageArray[i][j].damage;
                    result.push({
                        name: bonusDamageArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamageArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamageArray[i][j].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamageArray[i][j].damageType] += d;
                }
            }
            
            // bonus damage percent from abilities and buffs
            for (var i = 0; i < bonusDamagePctArray.length; i++) {
                for (j in bonusDamagePctArray[i]) {
                    var d = baseDamage * bonusDamagePctArray[i][j].damage;
                    result.push({
                        name: bonusDamagePctArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamagePctArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamagePctArray[i][j].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamagePctArray[i][j].damageType] += d;
                }
            }
            // drow_ranger_trueshot
            if (self.heroData().attacktype === 'DOTA_UNIT_CAP_RANGED_ATTACK') {
                if (self.heroId() === 'drow_ranger') {
                    var s = self.ability().getBonusDamagePrecisionAura().sources;
                    var index = 0;
                }
                else {
                    var s = self.buffs.getBonusDamagePrecisionAura().sources;
                    var index = 1;
                }
                if (s[index] != undefined) {
                    if (self.heroId() === 'drow_ranger') {
                        var d = s[index].damage * self.totalAgi();
                    }
                    else {
                        var d = s[index].damage;
                    }
                    result.push({
                        name: s[index].displayname,
                        damage: d,
                        damageType: 'physical',
                        damageReduced: self.getReducedDamage(d, 'physical'),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage.physical += d;                    
                }
            }
            
            // riki_backstab
            if (self.heroId() === 'riki') {
                var s = self.ability().getBonusDamageBackstab().sources;
                var index = 0;
            }
            else {
                var s = self.buffs.getBonusDamageBackstab().sources;
                var index = 1;
            }
            if (s[index] != undefined) {
                if (self.heroId() === 'riki') {
                    var d = s[index].damage * self.totalAgi();
                }
                else {
                    var d = s[index].damage;
                }
                result.push({
                    name: s[index].displayname,
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                //totalCritableDamage += d;
                damage.physical += d;                    
            }

            // bash damage
            for (var i = 0; i < bashSources.sources.length; i++) {
                var o = bashSources.sources[i];
                var d = bashSources.sources[i].damage;
                var cd = self.attacksPerSecond();
                if (o.cooldown) {
                    cd = Math.max(1/o.cooldown, cd);
                }
                for (var j = 0; j < bashSources.sources[i].count; j++) {
                    result.push({
                        name: bashSources.sources[i].name,
                        damage: d,
                        damageType: bashSources.sources[i].damageType,
                        damageReduced: self.getReducedDamage(d, bashSources.sources[i].damageType),
                        dps: d * cd * bashSources.sources[i].chance,
                        dpsReduced: self.getReducedDamage(d, bashSources.sources[i].damageType) * cd * bashSources.sources[i].chance,
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[bashSources.sources[i].damageType] += d;
                }

            }
            
            // %-based orbs
            for (var i = 0; i < itemProcOrbSources.sources.length; i++) {
                var d = itemProcOrbSources.sources[i].damage * (1 - Math.pow(1 - itemProcOrbSources.sources[i].chance, itemProcOrbSources.sources[i].count));
                result.push({
                    name: itemProcOrbSources.sources[i].name,
                    damage: d,
                    damageType: itemProcOrbSources.sources[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemProcOrbSources.sources[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[itemProcOrbSources.sources[i].damageType] += d;
            }
            
            // ability orbs
            for (var orb in abilityOrbSources) {
                var d = abilityOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                result.push({
                    name: abilityOrbSources[orb].displayname,
                    damage: d,
                    damageType: abilityOrbSources[orb].damageType,
                    damageReduced: self.getReducedDamage(d, abilityOrbSources[orb].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[abilityOrbSources[orb].damageType] += d;
            }
            
            // item orbs
            if (Object.keys(abilityOrbSources).length === 0) {
                for (var orb in itemOrbSources) {
                    var d = itemOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                    result.push({
                        name: itemOrbSources[orb].displayname,
                        damage: d,
                        damageType: itemOrbSources[orb].damageType,
                        damageReduced: self.getReducedDamage(d, itemOrbSources[orb].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[itemOrbSources[orb].damageType] += d;
                }            
            }
            
            // crit damage
            for (var i = 0; i < critSources.sources.length; i++) {
                var d = totalCritableDamage * (critSources.sources[i].multiplier - 1);// * critSources.sources[i].totalChance;
                crits.push({
                    name: critSources.sources[i].name + ', ' + critSources.sources[i].multiplier + 'x, ' + (critSources.sources[i].totalChance * 100).toFixed(1) + '%',
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true),
                    chance: critSources.sources[i].totalChance
                });
                totalCrit += d;
            }

            var totalReduced = self.getReducedDamage(damage.pure, 'pure') 
                    + self.getReducedDamage(damage.physical, 'physical')
                    + self.getReducedDamage(damage.magic, 'magic'),
                totalCritReduced = self.getReducedDamage(totalCrit, 'physical'),
                dps = {
                    base: totalDamage * self.attacksPerSecond(),
                    crit: totalCrit * self.attacksPerSecond(),
                    geminateAttack: geminateAttack.active ? geminateAttack.damage / geminateAttack.cooldown : 0,
                    reduced: {
                        base: totalReduced * self.attacksPerSecond(),
                        crit: totalCritReduced * self.attacksPerSecond(),
                        geminateAttack: geminateAttack.active ? self.getReducedDamage(geminateAttack.damage, 'physical') / geminateAttack.cooldown : 0,
                    }
                }
                
            crits.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
            });
                
            result.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond());
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond());
                }
            });
            
            var totalCritChance = crits.reduce(function (memo, o) { return memo + o.chance }, 0);
                
            var t1Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damage : 0;
            });
            var t2Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damageReduced : 0;
            });
            var t3Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0);
            });
            var t4Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0);
            });
                
            var t1 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damage }, 0) + t1Crit();
            });
            var t2 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damageReduced }, 0) + t2Crit();
            });
            var t3 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0) + t3Crit()) * a.cooldown;
            });
            var t4 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0) + t4Crit()) * a.cooldown;
            });
            
            var totalCritRow = [t1Crit, t2Crit, t3Crit, t4Crit];
            
            var totalRow = [t1, t2, t3, t4];

            return {
                name: a.name + ' Subtotal',
                cooldown: a.cooldown,
                enabled: ko.observable(true),
                visible: ko.observable(true),
                totalCritChance: totalCritChance,
                totalCritRow: totalCritRow,
                totalRow: totalRow,
                sources: result,
                sourcesCrit: crits,
                total: totalDamage,
                totalCrit: totalCrit,
                totalGeminateAttack: totalDamage + geminateAttack.damage,
                totalGeminateAttackReduced: totalReduced + geminateAttack.damageReduced,
                geminateAttack: geminateAttack,
                totalCritReduced: totalCritReduced,
                totalReduced: totalReduced,
                sumTotal: totalDamage + totalCrit,
                sumTotalReduced: totalReduced + totalCritReduced,
                dps: {
                    base: dps.base,
                    crit: dps.base + dps.crit,
                    geminateAttack: dps.base + dps.geminateAttack,
                    total: dps.base + dps.crit + dps.geminateAttack,
                    reduced: {
                        base: dps.reduced.base,
                        crit: dps.reduced.base + dps.reduced.crit,
                        geminateAttack: dps.reduced.base + dps.reduced.geminateAttack,
                        total: dps.reduced.base + dps.reduced.crit + dps.reduced.geminateAttack
                    }
                }
            };
        });
        
        var t1 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[0]() }, 0);
        });
        var t2 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[1]() }, 0);
        });
        var t3 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[2]() }, 0);
        });
        var t4 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[3]() }, 0);
        });
            
        return {
            attacks: attacks,
            totalRow: [t1, t2, t3, t4]
        }
    });
    
    self.getDamageTypeColor = function (damageType) {
        return DamageTypeColor[damageType] || DamageTypeColor['default'];
    }
    
}

module.exports = HeroDamageMixin;
},{"../herocalc_knockout":21,"../util/extend":35,"./DamageTypeColor":9,"./TalentController":14}],11:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var AbilityModel = require("../AbilityModel");
var BuffViewModel = require("../BuffViewModel");
var InventoryViewModel = require("../inventory/InventoryViewModel");
var diffProperties = require("./diffProperties");
var HeroDamageMixin = require("./HeroDamageMixin");
var TalentController = require("./TalentController");
var totalExp = require("./totalExp");
var nextLevelExp = require("./nextLevelExp");

var HeroModel = function (heroData, itemData, h) {
    var self = this;
    self.heroId = ko.observable(h);
    self.selectedHeroLevel = ko.observable(1);
    self.inventory = new InventoryViewModel(itemData, self);
    self.selectedInventory = ko.observable(-1);
    self.buffs = new BuffViewModel(itemData);
    self.buffs.hasScepter = self.inventory.hasScepter;
    self.debuffs = new BuffViewModel(itemData);
    self.heroData = ko.computed(function () {
      return heroData['npc_dota_hero_' + self.heroId()];
    });
    self.heroCompare = ko.observable(self);
    self.enemy = ko.observable(self);
    self.unit = ko.observable(self);
    self.clone = ko.observable(self);
    
    self.talents = [
        ko.observable(-1),
        ko.observable(-1),
        ko.observable(-1),
        ko.observable(-1)
    ];
    
    self.selectedTalents = ko.computed(function () {
        var arr = [];
        for (var i = 0; i < 4; i++) {
            if (self.talents[i]() !== -1) {
                arr.push(self.heroData().talents[i][self.talents[i]()]);
            }
        }
        return arr;
    });
    
    self.skillPointHistory = ko.observableArray();
    
    self.ability = ko.computed(function () {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        switch (self.heroId()) {
            case 'earth_spirit':
            case 'ogre_magi':
                a._abilities[3].level(1);
            break;
            case 'monkey_king':
                a._abilities[5].level(1);
            break;
            case 'invoker':
                for (var i = 5; i < 16; i++) {
                    a._abilities[i].level(1);
                }
            break;
        }
        self.skillPointHistory.removeAll();
        a.hasScepter = self.inventory.hasScepter
        return a;
    });

    self.availableSkillPoints = ko.computed(function () {
        var c = self.selectedHeroLevel();
        for (var i = 0; i < 4; i++) {
            if (self.selectedHeroLevel() < i * 5 + 10) self.talents[i](-1);
        }
        c -= self.talents.filter(function (talent) { return talent() !== -1 }).length;
        for (var i = 0; i < self.ability().abilities().length; i++) {
            switch(self.ability().abilities()[i].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    if (self.heroId() === 'invoker') {
                        /*while (
                            ((self.ability().abilities()[i].level() == 1) && (parseInt(self.selectedHeroLevel()) < 2)) ||
                            ((self.ability().abilities()[i].level() == 2) && (parseInt(self.selectedHeroLevel()) < 7)) ||
                            ((self.ability().abilities()[i].level() == 3) && (parseInt(self.selectedHeroLevel()) < 11)) ||
                            ((self.ability().abilities()[i].level() == 4) && (parseInt(self.selectedHeroLevel()) < 17))
                        ) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }*/
                    }
                    else if (self.heroId() === 'meepo') {
                        while ((self.ability().abilities()[i].level()-1) * 7 + 3 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                    else {
                        while (self.ability().abilities()[i].level() * 5 + 1 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                break;
                default:
                    while (self.ability().abilities()[i].level() * 2 - 1 > parseInt(self.selectedHeroLevel())) {
                        self.ability().levelDownAbility(i, null, null, self);
                    }
                break;
            }
        }
        while (self.skillPointHistory().length > c) {
            self.ability().levelDownAbility(self.skillPointHistory()[self.skillPointHistory().length-1], null, null, self);
        }
        return c-self.skillPointHistory().length;
    }, this);
    self.primaryAttribute = ko.pureComputed(function () {
        var v = self.heroData().attributeprimary;
        if (v === 'DOTA_ATTRIBUTE_AGILITY') return 'agi';
        if (v === 'DOTA_ATTRIBUTE_INTELLECT') return 'int';
        if (v === 'DOTA_ATTRIBUTE_STRENGTH') return 'str';
        return '';
    });
    self.totalExp = ko.pureComputed(function () {
        return totalExp[self.selectedHeroLevel() - 1];
    });
    self.nextLevelExp = ko.pureComputed(function () {
        return nextLevelExp[self.selectedHeroLevel() - 1];
    });
    self.startingArmor = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility * .14 + self.heroData().armorphysical).toFixed(2);
    });
    self.respawnTime = ko.pureComputed(function () {
        var level = self.selectedHeroLevel();
        var reduction = TalentController.getRespawnReduction(self.selectedTalents());
        if (level >= 1 && level <= 5) {
            return (level - 1) * 2 + 8 - reduction;
        }
        else if (level >= 6 && level <= 11) {
            return (level - 6) * 2 + 26 - reduction;
        }
        else if (level >= 12 && level <= 17) {
            return (level - 12) * 2 + 46 - reduction;
        }
        else if (level >= 18 && level <= 24) {
            return (level - 18) * 4 + 66 - reduction;
        }
        else if (level == 25) {
            return 100 - reduction;
        }
    });
    self.totalAttribute = function (a) {
        if (a === 'agi') return parseFloat(self.totalAgi());
        if (a === 'int') return parseFloat(self.totalInt());
        if (a === 'str') return parseFloat(self.totalStr());
        return 0;
    };
    self.totalAgi = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + TalentController.getAgility(self.selectedTalents())
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.pureComputed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + TalentController.getIntelligence(self.selectedTalents())
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.pureComputed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + TalentController.getStrength(self.selectedTalents())
                + self.enemy().ability().getStrengthReduction()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.health = ko.pureComputed(function () {
        return (self.heroData().statushealth + Math.floor(self.totalStr()) * 20 
                + self.inventory.getHealth()
                + self.ability().getHealth()
                + TalentController.getHealth(self.selectedTalents())
                ).toFixed(2);
    });
    self.healthregen = ko.pureComputed(function () {
        var healthRegenAura = [self.inventory.getHealthRegenAura, self.buffs.itemBuffs.getHealthRegenAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.heroData().statushealthregen + self.totalStr() * .06 
                + self.inventory.getHealthRegen() 
                + self.ability().getHealthRegen()
                + TalentController.getHealthRegen(self.selectedTalents())
                + self.buffs.getHealthRegen()
                + healthRegenAura.value
                ).toFixed(2);
    });
    self.mana = ko.pureComputed(function () {
        return (self.heroData().statusmana
                + self.totalInt() * 11
                + self.inventory.getMana()
                + TalentController.getMana(self.selectedTalents())
                + self.ability().getMana()).toFixed(2);
    });
    self.manaregen = ko.pureComputed(function () {
        return ((self.heroData().statusmanaregen 
                + self.totalInt() * .04 
                + self.ability().getManaRegen()
                + TalentController.getManaRegen(self.selectedTalents())
                ) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.heroId() === 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                + self.inventory.getManaRegen()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.pureComputed(function () {
        var armorAura = [self.inventory.getArmorAura, self.buffs.itemBuffs.getArmorAura].reduce(function (memo, fn) {
            var obj = fn(memo.attributes);
            return obj;
        }, {value:0, attributes:[]});
        var armorReduction = [self.enemy().inventory.getArmorReduction, self.debuffs.itemBuffs.getArmorReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (self.heroData().armorphysical + self.totalAgi() * .14)
                + self.inventory.getArmor()
                //+ self.inventory.getArmorAura().value
                //+ self.enemy().inventory.getArmorReduction()
                + self.ability().getArmor()
                + TalentController.getArmor(self.selectedTalents())
                + self.enemy().ability().getArmorReduction()
                + self.buffs.getArmor()
                //+ self.buffs.itemBuffs.getArmor()
                + self.debuffs.getArmorReduction()
                //+ self.buffs.itemBuffs.getArmorAura().value
                + armorAura.value
                + armorReduction.value
                //+ self.debuffs.getArmorReduction()
                ).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.pureComputed(function () {
        var totalArmor = self.totalArmorPhysical();
        if (totalArmor >= 0) {
            return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
        }
        else {
            return -((0.06 * -self.totalArmorPhysical()) / (1 + 0.06 * -self.totalArmorPhysical()) * 100).toFixed(2);
        }
    });
    self.spellAmp = ko.pureComputed(function () {
        return (self.totalInt() / 14
                + self.inventory.getSpellAmp()
                + self.ability().getSpellAmp()
                + TalentController.getSpellAmp(self.selectedTalents())
                + self.buffs.getSpellAmp()
                ).toFixed(2);
    });
    self.cooldownReductionFlat = ko.pureComputed(function () {
        return self.inventory.getCooldownReductionFlat()
                + self.ability().getCooldownReductionFlat()
                + TalentController.getCooldownReductionFlat(self.selectedTalents())
                + self.buffs.getCooldownReductionFlat()
                - self.enemy().inventory.getCooldownIncreaseFlat()
                - self.enemy().ability().getCooldownIncreaseFlat()
                - self.debuffs.getCooldownIncreaseFlat()
                - self.debuffs.itemBuffs.getCooldownIncreaseFlat();
    });
    self.cooldownReductionProduct = ko.pureComputed(function () {
        return self.inventory.getCooldownReductionPercent().value
                * self.ability().getCooldownReductionPercent()
                * TalentController.getCooldownReductionPercent(self.selectedTalents())
                * self.buffs.getCooldownReductionPercent()
                * self.enemy().inventory.getCooldownIncreasePercent()
                * self.enemy().ability().getCooldownIncreasePercent()
                * self.debuffs.getCooldownIncreasePercent()
                * self.debuffs.itemBuffs.getCooldownIncreasePercent();
    });
    self.cooldownReductionPercent = ko.pureComputed(function () {
        return ((1 - self.cooldownReductionProduct()) * 100).toFixed(2);
    });
    self.totalMovementSpeed = ko.pureComputed(function () {
        var MIN_MOVESPEED = 100;
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            var movementSpeedFlat = [self.inventory.getMovementSpeedFlat, self.buffs.itemBuffs.getMovementSpeedFlat].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            var movementSpeedPercent = [self.inventory.getMovementSpeedPercent, self.buffs.itemBuffs.getMovementSpeedPercent].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            var movementSpeedPercentReduction = [self.enemy().inventory.getMovementSpeedPercentReduction, self.debuffs.itemBuffs.getMovementSpeedPercentReduction].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            return Math.max(
                self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 140 :
                (self.heroData().movementspeed + movementSpeedFlat.value + self.ability().getMovementSpeedFlat() + TalentController.getMovementSpeedFlat(self.selectedTalents())) * 
                (1 //+ self.inventory.getMovementSpeedPercent() 
                   + movementSpeedPercent.value
                   + movementSpeedPercentReduction.value
                   + self.ability().getMovementSpeedPercent() 
                   //+ self.enemy().inventory.getMovementSpeedPercentReduction() 
                   + self.enemy().ability().getMovementSpeedPercentReduction() 
                   + self.buffs.getMovementSpeedPercent() 
                   + self.debuffs.getMovementSpeedPercentReduction()
                   + self.unit().ability().getMovementSpeedPercent() 
                )
            , MIN_MOVESPEED).toFixed(2);
        }
    });
    self.totalTurnRate = ko.pureComputed(function () {
        return (self.heroData().movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    self.baseDamage = ko.pureComputed(function () {
        var totalAttribute = self.totalAttribute(self.primaryAttribute()),
            abilityBaseDamage = self.ability().getBaseDamage(),
            minDamage = self.heroData().attackdamagemin,
            maxDamage = self.heroData().attackdamagemax;
        return [Math.floor((minDamage + totalAttribute + abilityBaseDamage.total) * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct() * abilityBaseDamage.multiplier),
                Math.floor((maxDamage + totalAttribute + abilityBaseDamage.total) * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct() * abilityBaseDamage.multiplier)];
    });
    self.baseDamageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2;
    });
    self.baseDamageMin = ko.pureComputed(function () {
        return self.baseDamage()[0];
    });
    self.baseDamageMax = ko.pureComputed(function () {
        return self.baseDamage()[1];
    });
    self.bonusDamage = ko.pureComputed(function () {
        return ((self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + TalentController.getBonusDamage(self.selectedTalents()).total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1]) / 2 
                              * (self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.heroData().attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.heroId() == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  )
                + Math.floor(
                    ((self.heroId() == 'riki') ? self.ability().getBonusDamageBackstab().total[0] * self.totalAgi() : 0)
                  )
                ) * self.ability().getSelfBaseDamageReductionPct()
                  * self.enemy().ability().getBaseDamageReductionPct()
                  * self.debuffs.itemBuffs.getBaseDamageReductionPct());
    });
    self.bonusDamageReduction = ko.pureComputed(function () {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2 + self.bonusDamage();
    });
    self.damageMin = ko.pureComputed(function () {
        return self.baseDamage()[0] + self.bonusDamage();
    });
    self.damageMax = ko.pureComputed(function () {
        return self.baseDamage()[1] + self.bonusDamage();
    });
    self.damage = ko.pureComputed(function () {
        return [self.baseDamage()[0] + self.bonusDamage(),
                self.baseDamage()[1] + self.bonusDamage()];
    });
    self.totalMagicResistanceProduct = ko.pureComputed(function () {
        return (1 - self.heroData().magicalresistance / 100) 
                * self.inventory.getMagicResist()
                * self.ability().getMagicResist()
                * TalentController.getMagicResist(self.selectedTalents())
                * self.buffs.getMagicResist()
                * self.inventory.getMagicResistReductionSelf()
                * self.enemy().inventory.getMagicResistReduction()
                * self.enemy().ability().getMagicResistReduction()
                * self.debuffs.getMagicResistReduction()
                * self.debuffs.itemBuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.pureComputed(function () {
        return ((1 - self.totalMagicResistanceProduct()) * 100).toFixed(2);
    });
    self.bat = ko.pureComputed(function () {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return self.heroData().attackrate;
    });
    self.ias = ko.pureComputed(function () {
        var attackSpeed = [self.inventory.getAttackSpeed].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList:[]});
        var attackSpeedAura = [self.inventory.getAttackSpeedAura, self.buffs.itemBuffs.getAttackSpeedAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        var attackSpeedReduction = [self.enemy().inventory.getAttackSpeedReduction, self.debuffs.itemBuffs.getAttackSpeedReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList: []});
        var val = parseFloat(self.totalAgi()) 
                //+ self.inventory.getAttackSpeed() 
                + attackSpeed.value
                + attackSpeedAura.value
                + attackSpeedReduction.value
                //+ self.enemy().inventory.getAttackSpeedReduction() 
                + self.ability().getAttackSpeed() 
                + TalentController.getAttackSpeed(self.selectedTalents()) 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 500) {
            return 500;
        }
        return val.toFixed(2);
    });
    self.attackTime = ko.pureComputed(function () {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.pureComputed(function () {
        return ((1 + self.ias() / 100) / self.bat()).toFixed(2);
    });
    self.evasion = ko.pureComputed(function () {
        if (self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped()) return 0;
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2);
        }
        else {
            return (
                (
                    1 - (
                        self.inventory.getEvasion()
                        * self.ability().getEvasion()
                        * self.ability().getEvasionBacktrack()
                        * TalentController.getEvasion(self.selectedTalents())
                        * self.buffs.itemBuffs.getEvasion()
                    )
                ) * 100
            ).toFixed(2);
        }
    });
    self.ehpPhysical = ko.pureComputed(function () {
        var evasion = self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 1 : self.inventory.getEvasion() * self.ability().getEvasion() * self.buffs.itemBuffs.getEvasion();
        if (self.totalArmorPhysical() >= 0) {
            var ehp = self.health() * (1 + .06 * self.totalArmorPhysical());
        }
        else {
            var ehp = self.health() * (1 - .06 * self.totalArmorPhysical()) / (1 - .12 * self.totalArmorPhysical());
        }
        ehp /= (1 - (1 - (evasion * self.ability().getEvasionBacktrack())));
        ehp /= (1 - parseFloat(self.enemy().missChance()) / 100);
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.pureComputed(function () {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.ability().getEvasionBacktrack());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        return ehp.toFixed(2);
    });
    self.bash = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return ((1 - (self.inventory.getBash(attacktype) * self.ability().getBash())) * 100).toFixed(2);
    });
    
    self.critChance = ko.pureComputed(function () {
        return ((1 - (self.inventory.getCritChance() * self.ability().getCritChance())) * 100).toFixed(2);
    });

    HeroDamageMixin(self, itemData);
    
    /*self.critDamage = ko.computed(function () {
        self.critInfo();
        return 0;
    });*/
    self.missChance = ko.pureComputed(function () {
        var missDebuff = [self.enemy().inventory.getMissChance, self.debuffs.itemBuffs.getMissChance].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value *= memo.value;
            return obj;
        }, {value:1, excludeList:[]});
        return ((1 - (self.enemy().ability().getMissChance() * self.debuffs.getMissChance() * missDebuff.value)) * 100).toFixed(2);
    });
    self.totalattackrange = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return self.heroData().attackrange
             + self.ability().getAttackRange()
             + TalentController.getAttackRange(self.selectedTalents())
             + self.inventory.getAttackRange(attacktype).value;
    });
    self.visionrangeday = ko.pureComputed(function () {
        return (self.heroData().visiondaytimerange) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.visionrangenight = ko.pureComputed(function () {
        return (self.heroData().visionnighttimerange + self.inventory.getVisionRangeNight() + self.ability().getVisionRangeNight()) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.lifesteal = ko.pureComputed(function () {
        var total = self.inventory.getLifesteal()
                  + self.ability().getLifesteal()
                  + TalentController.getLifesteal(self.selectedTalents())
                  + self.buffs.getLifesteal();
        if (self.heroData().attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var lifestealAura = [self.inventory.getLifestealAura, self.buffs.itemBuffs.getLifestealAura].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value: 0, excludeList: []});
            total += lifestealAura.value;
        }
        return (total).toFixed(2);
    });
    
    self.diffProperties = diffProperties;
    self.diff = {};

    for (var i = 0; i < self.diffProperties.length; i++) {
        var index = i;
        self.diff[self.diffProperties[index]] = self.getDiffFunction(self.diffProperties[index]);
    }
};

HeroModel.prototype.getDiffFunction = function (prop) {
    var self = this;
    return ko.computed(function () {
        if (prop == 'baseDamage') {
            return [self[prop]()[0] - self.heroCompare()[prop]()[0], self[prop]()[1] - self.heroCompare()[prop]()[1]];
        }
        else {
            return self[prop]() - self.heroCompare()[prop]();
        }
    }, this, { deferEvaluation: true });
}

HeroModel.prototype.getAbilityLevelMax = function (data) {
    if (data.abilitytype === 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
        return 1;
    }
    else if (data.name === 'invoker_quas' || data.name === 'invoker_wex' || data.name === 'invoker_exort') {
        return 7;
    }
    else if (data.name === 'invoker_invoke') {
        return 1;
    }
    else if (data.name === 'earth_spirit_stone_caller' || data.name === 'ogre_magi_unrefined_fireblast' || data.name === 'monkey_king_mischief') {
        return 1;
    }
    else if (data.abilitytype === 'DOTA_ABILITY_TYPE_ULTIMATE' || data.name === 'keeper_of_the_light_recall' ||
             data.name === 'keeper_of_the_light_blinding_light' || data.name === 'ember_spirit_activate_fire_remnant' ||
             data.name === 'lone_druid_true_form_battle_cry') {
        return 3;
    }
    else if (data.name === 'puck_ethereal_jaunt'  || data.name === 'shadow_demon_shadow_poison_release' ||
             data.name === 'templar_assassin_trap' || data.name === 'spectre_reality') {
        return 0;
    }
    else if (data.name === 'invoker_cold_snap'  || data.name === 'invoker_ghost_walk' || data.name === 'invoker_tornado' || 
             data.name === 'invoker_emp' || data.name === 'invoker_alacrity' || data.name === 'invoker_chaos_meteor' || 
             data.name === 'invoker_sun_strike' || data.name === 'invoker_forge_spirit' || data.name === 'invoker_ice_wall' || 
             data.name === 'invoker_deafening_blast') {
        return 0;
    }
    else if (data.name === 'techies_minefield_sign' || data.name === 'techies_focused_detonate') {
        return 0;
    }
    else {
        return 4;
    }
};

HeroModel.prototype.toggleTalent = function (talentTier, talentIndex) {
    if (this.talents[talentTier]() === talentIndex) {
        this.talents[talentTier](-1);
    }
    else if (this.availableSkillPoints() > 0 || this.talents[talentTier]() == 1 - talentIndex) {
        if (parseInt(this.selectedHeroLevel()) >= talentTier * 5 + 10) {
            this.talents[talentTier](talentIndex);
        }
    }
}

module.exports = HeroModel;
},{"../AbilityModel":1,"../BuffViewModel":2,"../herocalc_knockout":21,"../inventory/InventoryViewModel":25,"./HeroDamageMixin":10,"./TalentController":14,"./diffProperties":16,"./nextLevelExp":18,"./totalExp":19}],12:[function(require,module,exports){
var HeroOption = function (name, displayname, hero) {
    this.heroName = name;
    this.heroDisplayName = displayname;
    this.hero = hero;
};

module.exports = HeroOption;
},{}],13:[function(require,module,exports){
'use strict';
var HeroModel = require("./HeroModel");
var illusionData = require("../illusion/illusionData");
var findWhere = require("../util/findWhere");

var IllusionModel = function (heroData, itemData, h,p, abilityLevel) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.illusionAbilityLevel = ko.observable(abilityLevel);
    self.parent = p;
    
    self.totalAgi = ko.computed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.computed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    
    self.getAbilityAttributeValue = function(hero, ability, attributeName, level) {
        if (ability == 'item_manta') {
            var abilityObj = itemData[ability];
        }
        else {
            var abilityObj = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: ability});
        }
        var attribute = findWhere(abilityObj.attributes, {name: attributeName});
        if (level == 0) {
            return parseFloat(attribute.value[0]);
        }
        else if (level > attribute.length) {
            return parseFloat(attribute.value[0]);
        }
        else {
            return parseFloat(attribute.value[level - 1]);
        }
    }
    
    self.getIncomingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_melee, self.illusionAbilityLevel())/100)
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_ranged, self.illusionAbilityLevel())/100)
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage, self.illusionAbilityLevel())/100)
        }
    }
    self.getOutgoingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_melee, self.illusionAbilityLevel())/100);
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_ranged, self.illusionAbilityLevel())/100);
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage, self.illusionAbilityLevel())/100);
        }
    }

    self.baseDamage = ko.computed(function() {
        return [Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype),
                Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype)];
    });
    
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0],
                self.baseDamage()[1]];
    });
    
    self.ehpPhysical = ko.computed(function() {
        var ehp = (self.health() * (1 + .06 * self.totalArmorPhysical())) / (1 - (1 - (self.inventory.getEvasion() * self.ability().getEvasion())))
        ehp *= (self.inventory.activeItems().some(function(item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (heroData['npc_dota_hero_' + self.heroId()].armorphysical + self.totalAgi() * .14)
                + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return val.toFixed(2);
    });
    
    return self;
}
IllusionModel.prototype = Object.create(HeroModel.prototype);
IllusionModel.prototype.constructor = IllusionModel;

module.exports = IllusionModel;
},{"../illusion/illusionData":23,"../util/findWhere":36,"./HeroModel":11}],14:[function(require,module,exports){
module.exports = {
    getTalentById: function (talents, talentId) {
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name == talentId) {
                return ability;
            }
        }
    },
    getBonusDamage: function (talents) {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_damage_')) {
                totalAttribute += ability.attributes[0].value[0];
                sources[ability.name] = {
                    'damage': ability.attributes[0].value[0],
                    'damageType': 'physical',
                    'displayname': ability.displayname
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    },
    getHealth: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_') && !ability.name.startsWith('special_bonus_hp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getHealthRegen: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getMana: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_') && !ability.name.startsWith('special_bonus_mp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getManaRegen: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getArmor: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_armor_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getSpellAmp: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_spell_amplify_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getCooldownReductionFlat: function (talents) {
        var totalAttribute = 0;
        return totalAttribute;
    },
    getCooldownReductionPercent: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_cooldown_reduction_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getCooldownIncreaseFlat: function (talents) {
        var totalAttribute = 0;
        return totalAttribute;
    },
    getCooldownIncreasePercent: function (talents) {
        var totalAttribute = 1;
        return totalAttribute;
    },
    getMovementSpeedFlat: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_movement_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackRange: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_range_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackSpeed: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getLifesteal: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_lifesteal_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getEvasion: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_evasion_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getMagicResist: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_magic_resistance_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getRespawnReduction: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_respawn_reduction_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getStrength: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_strength_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAgility: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_agility_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getIntelligence: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_intelligence_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    }
}
},{}],15:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var AbilityModel = require("../AbilityModel");
var HeroModel = require("./HeroModel");

var UnitModel = function (heroData, itemData, unitData, h, p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, 'abaddon');
    self.parent = p;
    self.unitId = ko.observable(h);
    self.unitLevel = ko.observable(1);

    self.heroData = ko.computed(function() {
        return unitData[self.unitId()];
    });
    self.getAbilityLevelMax = function(data) {
        if (data.abilitytype == 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
            return 10;
        }
        else if (data.name == 'necronomicon_archer_mana_burn' || data.name == 'necronomicon_archer_aoe'
            || data.name == 'necronomicon_warrior_mana_burn' || data.name == 'necronomicon_warrior_last_will') {
            return 3;
        }
        else if (data.name == 'necronomicon_warrior_sight') {
            return 1;
        }
        else {
            return 4;
        }
    };
    self.availableSkillPoints.dispose();
    self.ability = ko.computed(function() {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        a.hasScepter = self.inventory.hasScepter
        switch (self.unitId()) {
            case 'npc_dota_necronomicon_archer_1':
            case 'npc_dota_necronomicon_warrior_1':
                a.abilities()[0].level(1);
                a.abilities()[1].level(1);
            break;
            case 'npc_dota_necronomicon_archer_2':
            case 'npc_dota_necronomicon_warrior_2':
                a.abilities()[0].level(2);
                a.abilities()[1].level(2);
            break;
            case 'npc_dota_necronomicon_archer_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
            break;
            case 'npc_dota_necronomicon_warrior_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
                a.abilities()[2].level(1);
            break;
        }
        a.levelUpAbility = function(index, data, event, hero) {
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level() < hero.getAbilityLevelMax(data)) {
                        a.abilities()[i].level(a.abilities()[i].level()+1);
                    }                    
                break;
            }

        };
        a.levelDownAbility = function(index, data, event, hero) {            
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level()>0) {
                        a.abilities()[i].level(a.abilities()[i].level()-1);
                    }
                break;
            }
        };
        return a;
    });        
    self.primaryAttribute = ko.computed(function() {
        //var v = unitData[self.unitId()].attributeprimary;
        var v = 0;
        if (v == 'DOTA_ATTRIBUTE_AGILITY') {
            return 'agi'
        }
        else if (v == 'DOTA_ATTRIBUTE_INTELLECT') {
            return 'int'
        }
        else if (v == 'DOTA_ATTRIBUTE_STRENGTH') {
            return 'str'
        }
        else {
            return ''
        }
    });
    self.totalAttribute = function(a) {
        if (a == 'agi') {
            return parseFloat(self.totalAgi());
        }
        if (a == 'int') {
            return parseFloat(self.totalInt());
        }
        if (a == 'str') {
            return parseFloat(self.totalStr());
        }
        return 0;
    };
    self.totalAgi = ko.computed(function() {
        return (unitData[self.unitId()].attributebaseagility
                + unitData[self.unitId()].attributeagilitygain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalInt = ko.computed(function() {
        return (unitData[self.unitId()].attributebaseintelligence 
                + unitData[self.unitId()].attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function() {
        return (unitData[self.unitId()].attributebasestrength 
                + unitData[self.unitId()].attributestrengthgain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    /*self.health = ko.computed(function() {
        return (unitData[self.unitId()].statushealth + self.totalStr()*19 
                + self.inventory.getHealth()
                + self.ability().getHealth()).toFixed(2);
    });
    self.healthregen = ko.computed(function() {
        return (unitData[self.unitId()].statushealthregen + self.totalStr()*.03 
                + self.inventory.getHealthRegen() 
                + self.ability().getHealthRegen()
                + self.buffs.getHealthRegen()).toFixed(2);
    });
    self.mana = ko.computed(function() {
        return (unitData[self.unitId()].statusmana + self.totalInt()*13 + self.inventory.getMana()).toFixed(2);
    });
    self.manaregen = ko.computed(function() {
        return ((unitData[self.unitId()].statusmanaregen 
                + self.totalInt()*.04 
                + self.ability().getManaRegen()) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.selectedHero().heroName == 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (unitData[self.unitId()].armorphysical + self.totalAgi()*.14)
                + self.inventory.getArmor() + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.computed(function() {
        return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
    });
    self.totalMovementSpeed = ko.computed(function() {
        if (self.parent.ability().isShapeShiftActive()) {
            return 522;
        }
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            return ((unitData[self.unitId()].movementspeed + self.inventory.getMovementSpeedFlat()+ self.ability().getMovementSpeedFlat()) * 
                    (1 + self.inventory.getMovementSpeedPercent() 
                       + self.ability().getMovementSpeedPercent() 
                       + self.enemy().inventory.getMovementSpeedPercentReduction() 
                       + self.enemy().ability().getMovementSpeedPercentReduction() 
                       + self.buffs.getMovementSpeedPercent() 
                       + self.debuffs.getMovementSpeedPercentReduction()
                    )).toFixed(2);
        }
    });
    self.totalTurnRate = ko.computed(function() {
        return (unitData[self.unitId()].movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    */
    self.baseDamage = ko.computed(function() {
        return [Math.floor(unitData[self.unitId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total),
                Math.floor(unitData[self.unitId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)];
    });
    /*self.bonusDamage = ko.computed(function() {
        return self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1])/2 
                              * (self.inventory.getBonusDamagePercent().total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.hero().attacktype() == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.selectedHero().heroName == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  );
    });*/
    /*self.bonusDamageReduction = ko.computed(function() {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0] + self.bonusDamage()[0],
                self.baseDamage()[1] + self.bonusDamage()[1]];
    });*/
    self.totalMagicResistanceProduct = ko.computed(function() {
        return (1 - unitData[self.unitId()].magicalresistance / 100) 
                   * (1 - self.inventory.getMagicResist() / 100) 
                   * (1 - self.ability().getMagicResist() / 100) 
                   * (1 - self.buffs.getMagicResist() / 100) 
                   * self.enemy().inventory.getMagicResistReduction()
                   * self.enemy().ability().getMagicResistReduction() 
                   * self.debuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.computed(function() {
        return (1 - self.totalMagicResistanceProduct());
    });
    self.bat = ko.computed(function() {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return unitData[self.unitId()].attackrate;
    });
    /*
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.inventory.getAttackSpeed() 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction();
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return (val).toFixed(2);
    });*/
    self.attackTime = ko.computed(function() {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.computed(function() {
        return (1 + self.ias() / 100) / self.bat();
    });
    self.evasion = ko.computed(function() {
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2) + '%';
        }
        else {
            return ((1-(self.inventory.getEvasion() * self.ability().getEvasion())) * 100).toFixed(2) + '%';
        }
    });
    self.ehpPhysical = ko.computed(function() {
        return ((self.health() * (1 + .06 * self.totalArmorPhysical())) / (1-(1-(self.inventory.getEvasion() * self.ability().getEvasion())))).toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        return (self.health() / self.totalMagicResistanceProduct()).toFixed(2);
    });
    self.heroId(h);
    self.unitId.subscribe(function (newValue) {
        self.heroId(newValue);
    });
    return self;
}
UnitModel.prototype = Object.create(HeroModel.prototype);
UnitModel.prototype.constructor = UnitModel;

module.exports = UnitModel;
},{"../AbilityModel":1,"../herocalc_knockout":21,"./HeroModel":11}],16:[function(require,module,exports){
var diffProperties = [
    'totalAgi',
    'totalInt',
    'totalStr',
    'health',
    'healthregen',
    'mana',
    'manaregen',
    'totalArmorPhysical',
    'totalArmorPhysicalReduction',
    'totalMovementSpeed',
    'totalTurnRate',
    'spellAmp',
    'cooldownReductionPercent',
    'baseDamage',
    'bonusDamage',
    'bonusDamageReduction',
    'damage',
    'totalMagicResistanceProduct',
    'totalMagicResistance',
    'bat',
    'ias',
    'attackTime',
    'attacksPerSecond',
    'evasion',
    'ehpPhysical',
    'ehpMagical',
    'bash',
    'critChance',
    //'critDamage',
    'missChance',
    'totalattackrange',
    'visionrangeday',
    'visionrangenight',
    'lifesteal'
];

module.exports = diffProperties;
},{}],17:[function(require,module,exports){
var HeroOption = require("./HeroOption");

var heroOptionsArray = {};

var init = function (heroData) {
    heroOptionsArray.items = [];
    for (var h in heroData) {
        heroOptionsArray.items.push(new HeroOption(h.replace('npc_dota_hero_', ''), heroData[h].displayname));
    }
    return heroOptionsArray.items;
}

heroOptionsArray.init = init;

module.exports = heroOptionsArray;
},{"./HeroOption":12}],18:[function(require,module,exports){
var nextLevelExp = [200, 300, 400, 500, 600, 615, 630, 645, 660, 675, 775, 1175, 1200, 1225, 1250, 1275, 1375, 1400, 1425, 1600, 1900, 2200, 2500, 2975, '&mdash;'];

module.exports = nextLevelExp;
},{}],19:[function(require,module,exports){
var totalExp = [0, 200, 500, 900, 1400, 2000, 2615, 3425, 3890, 4550, 5225, 6000, 7175, 8375, 9600, 10850, 12125, 13500, 14900, 16325, 17925, 19825, 22025, 24525, 27500];

module.exports = totalExp;
},{}],20:[function(require,module,exports){
var abilityData = {
    'alchemist_acid_spray': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'alchemist_unstable_concoction': [
        {
            label: 'Brew Time',
            controlType: 'input'
        },
        {
            attributeName: 'max_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/5;
            }
        },
        {
            attributeName: 'max_stun',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/5;
            }
        }
    ],
    'ancient_apparition_cold_feet': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            }
        }
    ],
    'ancient_apparition_ice_blast': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dot_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')+v*a;
            }
        }
    ],
    'antimage_mana_void': [
        {
            label: 'Enemy Missing Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_void_damage_per_mana',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'axe_battle_hunger': [
        {
            label: 'Battle Hungered Enemies',
            controlType: 'input'
        },
        {
            attributeName: 'speed_bonus',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'slow',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bane_nightmare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'bane_fiends_grip': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'fiend_grip_damage',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_damage_scepter',ability.level());
                }
                else {
                    return v[0]*a;
                }
            }
        },
        {
            attributeName: 'fiend_grip_mana_drain',
            label: 'Total Mana Drain',
            controlType: 'text',
            controls: [0,1],
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*v[1]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_mana_drain_scepter',ability.level())/100;
                }
                else {
                    return v[0]*v[1]*a/100;
                }
            }
        }
    ],
    'batrider_sticky_napalm': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Bonus Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'movement_speed_pct',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'turn_rate_pct',
            label: 'Enemy Turn Rate Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'turnRateReduction'
        }
    ],
    'batrider_firefly': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'bloodseeker_rupture': [
        {
            label: 'Enemy Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'movement_damage_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage') + v*a/100;
            }
        }
    ],
    'bristleback_viscous_nasal_goo': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_stack',
            label: 'Enemy Armor Reduction',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        },
        {
            attributeName: 'move_slow_per_stack',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -(abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_slow',0)+v*a);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bristleback_quill_spray': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'quill_stack_damage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'quill_base_damage',ability.level())+v*a,
                damage_cap = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_damage',0);
                if (total > damage_cap) {
                    total = damage_cap;
                }
                return total;
            }
        }
    ],
    'bristleback_bristleback': [
        {
            label: 'Damage From',
            controlType: 'radio',
            controlValueType: 'string',
            controlOptions: [
                {text: 'Back', value: 'back'},
                {text: 'Side', value: 'side'}
            ]
        },
        {
            attributeName: 'back_damage_reduction',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var ability = abilityModel.abilities().find(function(b) {
                    return b.name == 'bristleback_bristleback';
                });
                if (v == 'back') {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'back_damage_reduction', ability.level());
                }
                else {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'side_damage_reduction', ability.level());
                }
                return -total;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'bristleback_warpath': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'BONUS DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_damage',ability.level())+(v-1)*a;
                }
            }
        },
        {
            attributeName: 'move_speed_per_stack',
            label: '%MOVEMENT:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_speed',ability.level())+(v-1)*a;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'centaur_return': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_pct',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'return_damage',ability.level()) + v*a/100;
            }
        }
    ],
    'centaur_stampede': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'clinkz_death_pact': [
        {
            label: 'Consumed Unit HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_gain_pct',
            label: 'BASE DAMAGE GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            },
            returnProperty: 'baseDamage'
        },
        {
            attributeName: 'health_gain_pct',
            label: 'HEALTH GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            },
            returnProperty: 'bonusHealth'
        }
    ],
    'crystal_maiden_frostbite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dark_seer_ion_shell': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'dazzle_shadow_wave': [
        {
            label: 'Targets',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dazzle_weave': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'death_prophet_exorcism': [
        {
            label: 'Damage Dealt',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Armor',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            }
        }
    ],
    'disruptor_static_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damagevalue = 0.25 * (130 + 40 * ability.level()) * (1/20),
                mult = (v*4)*((v*4)+1)/2;
                return damagevalue * mult;
            }
        }
    ],
    'doom_bringer_scorched_earth': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'damage_per_second',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'doom_bringer_doom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (parent.inventory.hasScepter()) {
                    return v*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_scepter',ability.level());
                }
                else {
                    return v*a;
                }
            }
        }
    ],
    'dragon_knight_elder_dragon_form': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_range',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackrange'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedFlat'
        }
    ],
    'drow_ranger_trueshot': [
        {
            label: 'Drow\'s Agility',
            controlType: 'input',
            display: 'buff'
        },
        {
            attributeName: 'trueshot_ranged_damage',
            label: 'DAMAGE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'buff',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            },
            returnProperty: 'bonusDamagePrecisionAura'
        }
    ],
    'earth_spirit_rolling_boulder': [
        {
            label: 'Using Stone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'move_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return -a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'earthshaker_enchant_totem': [
        {
            label: 'Activated',
            controlType: 'checkbox'
        },
        {
            attributeName: 'totem_damage_percentage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'baseDamageMultiplier'
        }
    ],
    'earthshaker_echo_slam': [
        {
            label: 'Enemies in Range',
            controlType: 'input'
        },
        {
            attributeName: 'echo_slam_echo_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'elder_titan_ancestral_spirit': [
        {
            label: 'HEROES PASSED THROUGH',
            controlType: 'input'
        },
        {
            label: 'CREEPS PASSED THROUGH',
            controlType: 'input'
        },
        {
            attributeName: 'damage_creeps',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'move_pct_creeps',
            label: '%BONUS SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'move_pct_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'elder_titan_earth_splitter': [
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            }
        },
        {
            attributeName: 'slow_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'enchantress_natures_attendants': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'wisp_count',ability.level())*v*a;
            }
        }
    ],
    'enigma_malefice': [
        {
            label: 'Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'enigma_midnight_pulse': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_percent',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'enigma_black_hole': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'far_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'near_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'faceless_void_time_lock': [
        {
            attributeName: 'bonus_damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            }
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bash'
        }
    ],
    'gyrocopter_rocket_barrage': [
        {
            label: 'Rockets',
            controlType: 'input'
        },
        {
            attributeName: 'rockets_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
/*        'gyrocopter_homing_missile': [
        {
            label: 'Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'gyrocopter_flak_cannon': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],*/
    'huskar_burning_spear': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'huskar_berserkers_blood': [
        {
            label: '%HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Health at given %HP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return parent.health()*v/100;
            }
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            }
        },
        {
            attributeName: 'maximum_resistance',
            label: 'MAGIC RESISTANCE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'magicResist'
        },
        {
            attributeName: 'maximum_attack_speed',
            label: 'ATTACK SPEED BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'huskar_life_break': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            label: 'Huskar Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost_percent',
            label: 'DAMAGE TAKEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'invoker_quas': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        /*{
            attributeName: 'bonus_strength',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusStrength'
        },*/
        {
            attributeName: 'health_regen_per_instance',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'invoker_wex': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        /*{
            attributeName: 'bonus_agility',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusAgility'
        },*/
        {
            attributeName: 'move_speed_per_instance',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'attack_speed_per_instance',
            label: '%ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'invoker_exort': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        /*{
            attributeName: 'bonus_intelligence',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusInt'
        },*/
        {
            attributeName: 'bonus_damage_per_instance',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ghost_walk': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'enemy_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'enemy_slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Wex Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'self_slow',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'self_slow',v);
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'invoker_alacrity': [
        {
            label: 'Wex Level',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_attack_speed',v);
            },
            returnProperty: 'attackspeed'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_damage',v);
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ice_wall': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            label: 'Duration',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'ability',
            controls: [1,2],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v[0] == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_per_second',v[0])*v[1];
            }
        }
    ],
    'jakiro_dual_breath': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*2 + 
                abilityModel.getAbilityAttributeValue(ability.attributes, 'burn_damage',ability.level())*v;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_liquid_fire': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_macropyre': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'juggernaut_blade_fury': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'juggernaut_healing_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'healing_ward_heal_amount',
            label: 'HEAL OVER TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'juggernaut_omni_slash': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            label: 'MIN DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',1)*v;
            }
        },
        {
            label: 'MAX DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',2)*v;
            }
        }
    ],
    'keeper_of_the_light_illuminate': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'keeper_of_the_light_mana_leak': [
        {
            label: 'Distance Moved',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_leak_pct',
            label: 'MANA LEAKED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]/100*v[1]*a/100;
            }
        }
    ],
    'legion_commander_duel': [
        {
            label: 'Duel Wins',
            controlType: 'input'
        },
        {
            attributeName: 'reward_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'leshrac_pulse_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'lich_chain_frost': [
        {
            label: 'Bounce Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'life_stealer_feast': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_leech_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'life_stealer_open_wounds': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'lifesteal'
        },
        {
            attributeName: 'slow_steps',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow_steps',v+1);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'lina_fiery_soul': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'fiery_soul_move_speed_bonus',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'fiery_soul_attack_speed_bonus',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'lion_mana_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'luna_moon_glaive': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reduction_percent',
            label: 'BOUNCE DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var result = [];
                for (var i = 1; i < 6; i++) {
                    result.push((v*Math.pow(a/100,i)).toFixed(2))
                }
                return result.join('<br>');
            }
        }
    ],
    'luna_eclipse': [
        {
            label: 'Beam Count',
            controlType: 'input'
        },
        {
            attributeName: 'beams',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var lucentBeamAbility = abilityModel.abilities().find(function(b) {
                    return b.name == 'luna_lucent_beam';
                });
                if (lucentBeamAbility.level() == 0) return 0;
                var damage = abilityModel.getAbilityPropertyValue(lucentBeamAbility, 'damage');
                return v*damage;
            }
        }
    ],
    'medusa_mystic_snake': [
        {
            label: 'Jump Count',
            controlType: 'input'
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'method',
            display: 'none',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var snake_jumps = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_jumps',ability.level());
                var snake_scale = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_scale',0);
                var damage = [];
                for (var i = 0; i < snake_jumps; i++) {
                    damage.push(a + a * i * snake_scale/100);
                }
                return damage;
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[1].join(' / ');
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[1].slice(0, v[0]).reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Max Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[1].reduce(function (memo, o) { return memo + o }, 0);
            }
        }
    ],
    'medusa_mana_shield': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_mana',
            label: 'MANA USED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return (v/a).toFixed(2);
            }
        },
        {
            attributeName: 'absorption_tooltip',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'meepo_poof': [
        {
            label: 'Meepo Count',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'meepo_geostrike': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'slow',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',ability.level())*v;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'mirana_arrow': [
        {
            label: 'Arrow Travel Distance',
            controlType: 'input'
        },
        {
            attributeName: 'arrow_max_stun',
            label: 'STUN DURATION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var arrow_min_stun = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_min_stun',0);
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                return Math.max(arrow_min_stun, Math.floor(a * scale / 0.1) * 0.1);
            }
        },
        {
            attributeName: 'arrow_bonus_damage',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var ability = ability;
                var damage = ko.utils.unwrapObservable(ability.damage)[ability.level()-1];
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                var bonus_damage = Math.floor(a * scale / 2.8) * 2.8;
                return damage + ' + ' + bonus_damage + ' = ' + (damage + bonus_damage);
            }
        }
    ],
    'morphling_morph_agi': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusAgility2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'morphling_morph_str': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusStrength2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'furion_wrath_of_nature': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'necrolyte_heartstopper_aura': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'aura_damage',
            label: 'HEALTH LOST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'necrolyte_sadist': [
        {
            label: 'Unit Kills',
            controlType: 'input'
        },
        {
            label: 'Hero Kills',
            controlType: 'input'
        },
        {
            attributeName: 'health_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'manaregen'
        }
    ],
    'night_stalker_crippling_fear': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'miss_rate_night',
            label: '%CHANCE TO MISS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_night',ability.level());
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_day',ability.level());
                }
            },
            returnProperty: 'missChance'
        }
    ],    
    'night_stalker_hunter_in_the_night': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_attack_speed_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_movement_speed_pct_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],    
    'obsidian_destroyer_arcane_orb': [
        {
            label: 'Current Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_pool_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            },
            returnProperty: 'bonusDamageOrb'
        }
    ],
    'ogre_magi_ignite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'burn_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_rot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'rot_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_flesh_heap': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'flesh_heap_strength_buff_amount',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'flesh_heap_magic_resist',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'pudge_dismember': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dismember_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'pugna_nether_ward': [
        {
            label: 'Enemy Mana Spent',
            controlType: 'input'
        },
        {
            attributeName: 'mana_multiplier',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'manaregenreduction'
        }
    ],
    'pugna_life_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'health_drain',
            label: 'HEALTH DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'queenofpain_shadow_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'strike_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var duration_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_damage',ability.level());
                var ticks = Math.floor(v/3);
                return a + duration_damage * ticks;
            }
        }
    ],
    'razor_plasma_field': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'radius',
            label: 'MIN DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return 200;
            }
        },
        {
            attributeName: 'radius',
            label: 'MAX DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return 200 + a;
            }
        },
        {
            attributeName: 'radius',
            label: 'Instance Damage',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var max_radius = a + 200;
                var scale = (Math.min(Math.max(v, 200), max_radius) - 200) / (max_radius - 200);
                var damage_min = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_min',ability.level());
                var damage_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_max',ability.level());
                return damage_min + (damage_max - damage_min) * scale;
            }
        }
    ],
    'razor_static_link': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'drain_length',
            label: 'Damage Drained:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'drain_length',
            label: 'Enemy Damage Lost:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'hidden',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'razor_eye_of_the_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'rubick_fade_bolt': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a * (1 - v*abilityModel.getAbilityAttributeValue(ability.attributes, 'jump_damage_reduction_pct',ability.level())/100);
            }
        },
        {
            attributeName: 'hero_attack_damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'sandking_sand_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'sandking_epicenter': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'epicenter_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'epicenter_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'epicenter_slow_as',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'shadow_demon_shadow_poison': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'stack_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var stackmult = [1,2,4,8];
                if (v > 4) {
                    return a * stackmult[3] + 50 * (v - 4);
                }
                else if (v <= 0) {
                    return 0
                }
                else {
                    return a * stackmult[v-1]
                }
            }
        }
    ],
    'nevermore_necromastery': [
        {
            label: 'Souls',
            controlType: 'input'
        },
        {
            attributeName: 'necromastery_damage_per_soul',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var talent = TalentController.getTalentById(parent.selectedTalents(), 'special_bonus_unique_nevermore_1');
                if (talent) {
                    return v * (a + talent.attributes[0].value[0]);
                }
                else {
                    return v * a;
                }
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'nevermore_requiem': [
        {
            label: 'Line Hit Count',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: 'Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            label: 'Return Line Hit Count (Scepter)',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Damage/Heal:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v*a/100;
            }
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage*v[0] + damage*v[1]*a/100;
            }
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'baseDamageReductionPct'
        },
        {
            attributeName: 'requiem_reduction_ms',
            label: '%DAMAGE REDUCTION:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shadow_shaman_shackles': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'silencer_curse_of_the_silent': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return Math.floor(v)*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
/*        'silencer_glaives_of_wisdom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],*/
    'skywrath_mage_mystic_flare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'slark_essence_shift': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'agi_gain',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'stat_loss',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'bonusAllStatsReduction'
        }
    ],
    'slark_shadow_dance': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'TOTAL HEALTH REGENERATED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*parent.health()*a/100;
            }
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'HEALTH GAINED PER SECOND:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return parent.health()*a/100;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'sniper_shrapnel': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'shrapnel_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spectre_desolate': [
        {
            label: 'Enemy Alone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'spectre_dispersion': [
        {
            label: 'Damage Taken',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'damageReduction'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            }
        }
    ],
    'storm_spirit_ball_lightning': [
        {
            label: 'MAX MANA',
            controlType: 'input'
        },
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')/100*v[1];
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'FLAT MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_base = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_base',0);
                return a + distance_intervals * travel_cost_base;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_percentage',
            label: '%MAX MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_percent = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_percent',0);
                return a + distance_intervals * travel_cost_percent;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'TOTAL MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1, 2, 3],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[2] + ' + ' + (v[3]/100 * v[0]) + ' (' + v[3] + '% of max) = ' + (v[2] + v[3]/100 * v[0]);
            }
        }
    ],
    'templar_assassin_psionic_trap': [
        {
            label: 'Charge Time',
            controlType: 'input'
        },
        {
            attributeName: 'movement_speed_min_tooltip',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'movement_speed_max_tooltip',0);
                var slow_per_tick = (max_slow - a)/40;
                return -(a + slow_per_tick * Math.min(Math.max(0, v), 4) * 10);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shredder_reactive_armor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_armor',
            label: 'Total Armor Bonus',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'bonus_hp_regen',
            label: 'Total HP Regen Bonus',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'shredder_chakram': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            label: 'ENEMY %HP',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'MANA COST:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var ticks = 20 - Math.floor(Math.min(Math.max(v-1, 0), 99) / 5);
                return -a*ticks;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spirit_breaker_greater_bash': [
        {
            label: 'Bash Proc',
            controlType: 'checkbox'
        },
        {
            attributeName: 'damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'bonus_movespeed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a
            },
            returnProperty: 'bash'
        }
    ],
    'techies_land_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'techies_suicide': [
        {
            attributeName: 'damage',
            label: 'FULL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'partial_damage',
            label: 'PARTIAL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'damage',
            label: 'RESPAWN TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return (parent.respawnTime() / 2).toFixed(0) + ' seconds';
            }
        }
    ],
    'techies_remote_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'tinker_march_of_the_machines': [
        {
            label: 'Robot Explosions',
            controlType: 'input'
        },
        {
            attributeName: 'machines_per_sec',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'treant_leech_seed': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'leech_damage',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'troll_warlord_fervor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'attack_speed',
            label: 'ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'undying_decay': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'str_steal',
            label: 'STRENGTH STOLEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                if (parent.inventory.hasScepter()) {
                    var str_steal_scepter = abilityModel.getAbilityAttributeValue(ability.attributes, 'str_steal_scepter',0);
                    return v*str_steal_scepter;
                }
                else {
                    return v*a;
                }
            },
            returnProperty: 'bonusStrength'
        },
    ],
    'undying_soul_rip': [
        {
            label: 'Units',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_unit',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'undying_flesh_golem': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'max_speed_slow',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var min_speed_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_speed_slow', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return -Math.max(scale * a, min_speed_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'max_damage_amp',
            label: '%DAMAGE AMP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var min_damage_amp = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_damage_amp', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return Math.max(scale * a, min_damage_amp);
            },
            returnProperty: 'damageAmplification'
        },
        {
            label: 'MAX HP',
            controlType: 'input'
        },
        {
            label: 'Hero Death Count',
            controlType: 'input'
        },
        {
            label: 'Creep Death Count',
            controlType: 'input'
        },
        {
            attributeName: 'death_heal',
            label: 'DEATH HEAL (HEROES):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 2],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'DEATH HEAL (CREEPS):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 3],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'TOTAL DEATH HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [4, 5],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v[0]+v[1];
            }
        }
    ],
    'ursa_fury_swipes': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var enrageAbility = abilityModel.abilities().find(function(b) {
                    return b.name == 'ursa_enrage';
                });
                if (enrageAbility.isActive() && enrageAbility.level() > 0) {
                    var enrage_multiplier = abilityModel.getAbilityAttributeValue(enrageAbility.attributes, 'enrage_multiplier', enrageAbility.level());
                    return v*a*enrage_multiplier;
                }
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'ursa_enrage': [
        {
            attributeName: 'damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'venomancer_venomous_gale': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'tick_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'strike_damage',ability.level()) + Math.floor(v/3)*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_sting': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'viper_poison_attack': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'viper_corrosive_skin': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        },
        {
            attributeName: 'bonus_magic_resistance',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'viper_viper_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'visage_soul_assumption': [
        {
            label: 'Charges',
            controlType: 'input'
        },
        {
            attributeName: 'soul_charge_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var soul_base_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'soul_base_damage',0);
                var stack_limit = abilityModel.getAbilityAttributeValue(ability.attributes, 'stack_limit', ability.level());
                stack_limit = Math.max(Math.min(v, stack_limit), 0);
                return soul_base_damage + stack_limit*a;
            }
        }
    ],
    'visage_gravekeepers_cloak': [
        {
            label: 'Layers',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reduction',
            label: 'DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'warlock_shadow_word': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'warlock_upheaval': [
        {
            label: 'Channel Duration',
            controlType: 'input'
        },
        {
            attributeName: 'slow_rate_duration',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_slow',0);
                var slow_per_tick = max_slow / (a - 0.5) / 2;
                var ticks = Math.max(Math.floor(v * 2) - 1, 0);
                return -Math.min(ticks * slow_per_tick, max_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'weaver_the_swarm': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'windrunner_powershot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'winter_wyvern_cold_embrace': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Ally Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percentage',
            label: 'TOTAL HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var base_heal = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_additive',ability.level());
                return (base_heal + v[1] * a/100) * v[0];
            }
        }
    ],
    'wisp_spirits': [
        {
            label: 'Collision Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'creep_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'wisp_overcharge': [
        {
            label: 'Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'HP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            label: 'Current MP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'MP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'witch_doctor_paralyzing_cask': [
        {
            label: 'Hero Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                return Math.min(Math.max(v, 0), bounces)*a;
            }
        },
        {
            label: 'Creep Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'CREEP DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return Math.min(Math.max(v, 0), bounces)*damage;
            }
        }
    ],
    'witch_doctor_voodoo_restoration': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var heal_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return heal_per_tick * ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var mana_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return mana_per_tick * ticks;
            }
        }
    ],
    'witch_doctor_maledict': [
        {
            label: 'damage 0-4s',
            controlType: 'input'
        },
        {
            label: 'damage 4-8s',
            controlType: 'input'
        },
        {
            label: 'damage 8-12s',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 3s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 3*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 4s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 3],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 7s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 7*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 8s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 4, 5],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 11s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 11*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 12s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 2, 4, 6, 7],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Burst Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [4, 6, 8],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v.reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Maledict Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [9],
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage * duration + v[0];
            }
        },
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'DOT Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*Math.min(Math.max(v, 0), duration);
            }
        }
    ],
    'witch_doctor_death_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a;
            }
        }
    ],
    'zuus_static_field': [
        {
            label: 'Enemy HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_health_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability, TalentController) {
                return v*a/100;
            }
        }
    ]
}

module.exports = abilityData;
},{}],21:[function(require,module,exports){
(function (global){
'use strict';
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);

ko.mapping = require('../lib/knockout.mapping');
ko.wrap = require('../lib/knockout.wrap');

ko.extenders.numeric = function(target, opts) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, (opts === Object(opts) ? opts.precision : opts) || 0),
                newValueAsNum = isNaN(newValue) ? (opts.defaultValue || 0) : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
 
            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });
 
    //initialize with current value to make sure it is rounded appropriately
    result(target());
 
    //return the new computed observable
    return result;
};

module.exports = ko;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../lib/knockout.mapping":44,"../lib/knockout.wrap":45}],22:[function(require,module,exports){
(function (global){
'use strict';
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var itemtooltipdata = {};
var ability_vars = {
    '$health': 'Health',
    '$mana': 'Mana',
    '$armor': 'Armor',
    '$damage': 'Damage',
    '$str': 'Strength',
    '$int': 'Intelligence',
    '$agi': 'Agility',
    '$all': 'All Attributes',
    '$attack': 'Attack Speed',
    '$hp_regen': 'HP Regeneration',
    '$mana_regen': 'Mana Regeneration',
    '$move_speed': 'Movement Speed',
    '$evasion': 'Evasion',
    '$spell_resist': 'Spell Resistance',
    '$selected_attribute': 'Selected Attribute',
    '$selected_attrib': 'Selected Attribute',
    '$cast_range': 'Cast Range',
    '$attack_range': 'Attack Range'
}

var getTooltipItemDescription = function (item) {
    var d = item.description;
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].name != null) {
            var attributeName = item.attributes[i].name;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            var regexp = new RegExp('%' + attributeName + '%', 'gi');
            d = d.replace(regexp, attributeValue );
        }
    }
    var regexp = new RegExp('%%', 'gi');
    d = d.replace(regexp,'%');
    regexp = new RegExp('\n', 'gi');
    d = d.replace(/\\n/g, '<br>');
    return d;
}

var getTooltipItemAttributes = function (item) {
    var a = '';
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].tooltip != null) {
            var attributeTooltip = item.attributes[i].tooltip;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            var p = attributeTooltip.indexOf('%');
            if (p == 0) {
                attributeValue = attributeValue + '%';
                attributeTooltip = attributeTooltip.slice(1);
            }
            var d = attributeTooltip.indexOf('$');
            if (d != -1) {
                a = a + attributeTooltip.slice(0, d) + ' ' + attributeValue + ' ' + ability_vars[attributeTooltip.slice(d)] + '<br>';
            }
            else {
                a = a + attributeTooltip + ' ' + attributeValue + '<br>';
            }
        }
    }
    return a.trim('<br>');
}

var getTooltipItemCooldown = function (item) {
    var c = '';
    for (var i = 0; i < item.cooldown.length; i++) {
        c = c + ' ' + item.cooldown[i];
    }
    return c;
}

var getTooltipItemManaCost = function (item) {
    var c = '';
    for (var i = 0; i < item.manacost.length; i++) {
        if (item.manacost[i] > 0) {
            c = c + ' ' + item.manacost[i];
        }
    }
    return c;
}

var getItemTooltipData = function(itemData, el) {
    if (itemData['item_' + el] == undefined) {
        return undefined;
    }
    if (itemtooltipdata[el] == undefined) {
        var item = itemData['item_' + el];
        var data = $('<div>');
        data.append($('<span>').html(item.displayname).addClass('item_field item_name'));
        data.append($('<span>').html(item.itemcost).addClass('item_field item_cost'));
        data.append($('<hr>'));
        if (item.description != null) {
            data.append($('<div>').html(getTooltipItemDescription(item)).addClass('item_field item_description'));
        }
        var attributedata = getTooltipItemAttributes(item);
        if (attributedata != '') {
            data.append($('<div>').html(attributedata).addClass('item_field item_attributes'));
        }
        var cd = getTooltipItemCooldown(item);
        var mana = getTooltipItemManaCost(item);
        if (cd != '' || mana != '') {
            var cdmanacost = $('<div>').addClass('item_cdmana');
            if (cd != '') {
                cdmanacost.append($('<span>').html(cd).addClass('item_field item_cooldown'));
            }
            if (mana != '') {
                cdmanacost.append($('<span>').html(mana).addClass('item_field item_manacost'));
            }
            data.append(cdmanacost);
        }
        if (item.lore != null) {
            data.append($('<div>').html(item.lore).addClass('item_field item_lore'));
        }
        itemtooltipdata[el] = data.html();
        return data.html();
    }
    else {
        return itemtooltipdata[el];
    }
}

module.exports = getItemTooltipData;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],23:[function(require,module,exports){
var illusionData = {
    chaos_knight_phantasm: {
        hero: 'chaos_knight',
        displayName: 'Chaos Knight Phantasm',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    naga_siren_mirror_image: {
        hero: 'naga_siren',
        displayName: 'Naga Siren Mirror Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    dark_seer_wall_of_replica: {
        hero: 'dark_seer',
        displayName: 'Dark Seer Wall of Replica',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'replica_damage_outgoing',
        incoming_damage: 'replica_damage_incoming',
        outgoing_damage_scepter: 'replica_damage_outgoing_scepter'
    },
    morphling_replicate: {
        hero: 'morphling',
        displayName: 'Morphling Replicate',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'
    },
    phantom_lancer_doppelwalk: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Doppelwalk',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_juxtapose: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Juxtapose',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_spirit_lance: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Spirit Lance',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    shadow_demon_disruption: {
        hero: 'shadow_demon',
        displayName: 'Shadow Demon Disruption',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    spectre_haunt: {
        hero: 'spectre',
        displayName: 'Spectre Haunt',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'illusion_damage_outgoing',
        incoming_damage: 'illusion_damage_incoming'        
    },
    terrorblade_conjure_image: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Conjure Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    terrorblade_reflection: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Reflection',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage'     
    },
    item_manta: {
        hero: '',
        is_item: true,
        displayName: 'Manta Style Illusion',
        use_selected_hero: true,
        max_level: 1,
        outgoing_damage_melee: 'images_do_damage_percent_melee',
        incoming_damage_melee: 'images_take_damage_percent_melee',
        outgoing_damage_ranged: 'images_do_damage_percent_ranged',
        incoming_damage_ranged: 'images_take_damage_percent_ranged'
    }
}

module.exports = illusionData;
},{}],24:[function(require,module,exports){
(function (global){
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
var stackableItems = require("./stackableItems");
var levelItems = require("./levelItems");
var itemsWithActive = require("./itemsWithActive");

var BasicInventoryViewModel = function (h) {
    var self = this;
    self.items = ko.observableArray([]);
    self.activeItems = ko.observableArray([]);
    self.addItem = function (data, event) {
        if (data.selectedItem() != undefined) {
            var new_item = {
                item: data.selectedItem().split('|')[0],
                state: ko.observable(0),
                size: data.itemInputValue(),
                enabled: ko.observable(true)
            }
            switch (new_item.item) {
                case 'dagon':
                    new_item.size = Math.min(new_item.size, 5);
                break;
                break;
                case 'travel_boots':
                case 'diffusal_blade':
                    new_item.size = Math.min(new_item.size, 2);
                break;
                case 'necronomicon':
                    new_item.size = Math.min(new_item.size, 3);
                break;
            }
            this.items.push(new_item);
            if (data.selectedItem() === 'ring_of_aquila' || data.selectedItem() === 'ring_of_basilius' || data.selectedItem() === 'heart') {
                this.toggleItem(undefined, new_item, undefined);
            }
        }
    }.bind(this);
    self.toggleItem = function (index, data, event) {
        if (itemsWithActive.indexOf(data.item) >= 0) {
            if (this.activeItems.indexOf(data) < 0) {
                this.activeItems.push(data);
            }
            else {
                this.activeItems.remove(data);
            }
            switch (data.item) {
                case 'power_treads':
                    if (data.state() < 2) {
                        data.state(data.state() + 1);
                    }
                    else {
                        data.state(0);
                    }                
                break;
                default:
                    if (data.state() == 0) {
                        data.state(1);
                    }
                    else {
                        data.state(0);
                    }                
                break;
            }
        }
    }.bind(this);
    self.removeItem = function (item) {
        this.activeItems.remove(item);
        this.items.remove(item);
    }.bind(this);
    self.toggleMuteItem = function (item) {
        item.enabled(!item.enabled());
    }.bind(this);
    self.removeAll = function () {
        this.activeItems.removeAll();
        this.items.removeAll();
    }.bind(this);
}
BasicInventoryViewModel.prototype.getItemImage = function (data) {
    var state = ko.utils.unwrapObservable(data.state);
    switch (data.item) {
        case 'power_treads':
            if (state == 0) {
                return '/media/images/items/' + data.item + '_str.png';
            }
            else if (state == 1) {
                return '/media/images/items/' + data.item + '_int.png';
            }
            else {
                return '/media/images/items/' + data.item + '_agi.png';
            }
        break;
        case 'tranquil_boots':
        case 'ring_of_basilius':
            if (state == 0) {
                return '/media/images/items/' + data.item + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '_active.png';
            }
        break;
        case 'armlet':
            if (state == 0) {
                return '/media/images/items/' + data.item + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '_active.png';
            }
        break;
        case 'ring_of_aquila':
            if (state == 0) {
                return '/media/images/items/' + data.item + '_active.png';
            }
            else {
                return '/media/images/items/' + data.item + '.png';
            }
        break;
        case 'dagon':
        case 'diffusal_blade':
        case 'travel_boots':
        case 'necronomicon':
            if (data.size > 1) {
                return '/media/images/items/' + data.item + '_' + data.size + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '.png';
            }
        break;
        default:
            return '/media/images/items/' + data.item + '.png';            
        break;
    }
};
BasicInventoryViewModel.prototype.getItemSizeLabel = function (data) {
    if (stackableItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Qty: </span>' + data.size;
    }
    else if (levelItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Lvl: </span>' + data.size;
    }
    else if (data.item == 'bloodstone') {
        return '<span style="font-size:10px">Charges: </span>' + data.size;
    }
    else {
        return '';
    }
};
BasicInventoryViewModel.prototype.getActiveBorder = function (data) {
    switch (data.item) {
        case 'power_treads':
        case 'tranquil_boots':
        case 'ring_of_basilius':
        case 'ring_of_aquila':
        case 'armlet':
            return 0;
        break;
        default:
            return ko.utils.unwrapObservable(data.state);    
        break;
    }
}
BasicInventoryViewModel.prototype.getItemAttributeValue = function (attributes, attributeName, level) {
    for (var i = 0; i < attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (level == 0) {
                return parseFloat(attributes[i].value[0]);
            }
            else if (level > attributes[i].value.length) {
                return parseFloat(attributes[i].value[0]);
            }
            else {
                return parseFloat(attributes[i].value[level - 1]);
            }
        }
    }
}

module.exports = BasicInventoryViewModel;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./itemsWithActive":30,"./levelItems":31,"./stackableItems":32}],25:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var stackableItems = require("./stackableItems");
var levelItems = require("./levelItems");
var BasicInventoryViewModel = require("./BasicInventoryViewModel");
var itemOptionsArray = require("./itemOptionsArray");
var itemBuffOptions = require("./itemBuffOptions");
var itemDebuffOptions = require("./itemDebuffOptions");

var InventoryViewModel = function (itemData, h) {
    var self = this;
    BasicInventoryViewModel.call(this, h);
    self.hero = h;
    self.hasInventory = ko.observable(true);
    self.items = ko.observableArray([]);
    self.activeItems = ko.observableArray([]);
    self.hasScepter = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (item === 'ultimate_scepter' && self.items()[i].enabled()) {
                return true;
            }
            
        }
        return false;
    }, this);
    self.isEthereal = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if ((item === 'ghost' || item === 'ethereal_blade') && self.items()[i].enabled() && isActive) {
                return true;
            }
        }
        return false;
    }, this);
    self.isSheeped = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (item === 'sheepstick' && self.items()[i].enabled() && isActive) {
                return true;
            }
        }
        return false;
    }, this);
    self.totalCost = ko.computed(function () {
        var c = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            if (stackableItems.indexOf(item) != -1) {
                c += itemData['item_' + item].itemcost * self.items()[i].size;
            }
            else if (levelItems.indexOf(item) != -1) {
                switch(item) {
                    case 'travel_boots':
                    case 'diffusal_blade':
                    case 'necronomicon':
                    case 'dagon':
                        c += itemData['item_' + item].itemcost + (self.items()[i].size - 1) * itemData['item_recipe_' + item].itemcost;
                    break;
                    default:
                        c += itemData['item_' + item].itemcost;
                    break;
                }
            }
            else {
                c += itemData['item_' + item].itemcost;
            }
            
        }
        return c;
    }, this);
    self.addItemBuff = function (data, event) {
        if (self.hasInventory() && self.selectedItemBuff() != undefined) {
            var new_item = {
                item: self.selectedItemBuff(),
                state: ko.observable(0),
                size: 1,
                enabled: ko.observable(true)
            }
            self.items.push(new_item);
            if (self.selectedItemBuff() === 'ring_of_aquila' || self.selectedItemBuff() === 'ring_of_basilius') {
                self.toggleItem(undefined, new_item, undefined);
            }
        }
    };
    self.addItemDebuff = function (data, event) {
        if (self.hasInventory() && self.selectedItemDebuff() != undefined) {
            var new_item = {
                item: self.selectedItemDebuff().split('|')[0],
                state: ko.observable(0),
                size: 1,
                enabled: ko.observable(true)
            }
            if (self.selectedItemDebuff().split('|').length == 2) {
                new_item.debuff = self.selectedItemDebuff().split('|')[1]
            }
            self.items.push(new_item);
            if (self.selectedItemDebuff() === 'ring_of_aquila' || self.selectedItemDebuff() === 'ring_of_basilius') {
                self.toggleItem(undefined, new_item, undefined);
            }
        }
    };
    
    self.getAttributes = function (attributetype) {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            var size = self.items()[i].size;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_all_stats':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'bonus_stats':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
                switch(attributetype) {
                    case 'agi':
                        if (attribute.name == 'bonus_agility') {
                            if (item == 'diffusal_blade') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 2) {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_agi') {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                    case 'int':
                        if (attribute.name == 'bonus_intellect') {
                            if (item == 'necronomicon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else if (item == 'diffusal_blade') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else if (item == 'dagon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_intelligence') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_int') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 1) {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                    case 'str':
                        if (attribute.name == 'bonus_strength') {
                            if (item == 'necronomicon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 0) {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_str') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'unholy_bonus_strength' && isActive) {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getBash = function (attacktype) {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bash_chance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'bash_chance_melee':
                        if (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                    break;
                    case 'bash_chance_ranged':
                        if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getCritChance = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'crit_chance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getCritSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'lesser_crit':
                case 'greater_crit':
                case 'bloodthorn':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'crit_chance', 0) / 100,
                            'multiplier': self.getItemAttributeValue(itemData['item_' + item].attributes, 'crit_multiplier', 0) / 100,
                            'count': 1,
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }
            if (item === 'bloodthorn' && isActive) {
                if (sources['soul_rend'] == undefined) {
                    sources['soul_rend'] = {
                        'chance': 1,
                        'multiplier': self.getItemAttributeValue(itemData['item_' + item].attributes, 'target_crit_multiplier', 0) / 100,
                        'count': 1,
                        'displayname': 'Soul Rend'
                    }
                }
                else {
                    sources['soul_rend'].count += 1;
                }
            }
        }
        return sources;
    };

    self.getCleaveSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'bfury':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'radius': self.getItemAttributeValue(itemData['item_' + item].attributes, 'cleave_radius', 0),
                            'magnitude': self.getItemAttributeValue(itemData['item_' + item].attributes, 'cleave_damage_percent', 0) / 100,
                            'count': 1,
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getBashSource = function (attacktype) {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'javelin':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance_damage', 1),
                            'damageType': 'magic',
                            'count': 1,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance', 1) / 100,
                            'displayname': itemData['item_' + item].displayname + ' Pierce'
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
                case 'monkey_king_bar':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'item': item,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_chance', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_damage', 0),
                            'duration': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_stun', 0),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': 'Mini-Bash' //itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
                case 'abyssal_blade':
                case 'basher':
                    if (!sources.hasOwnProperty('bash')) {
                        sources['bash'] = {
                            'item': item,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') ?'bash_chance_melee' : 'bash_chance_ranged', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance_damage', 0),
                            'duration': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_duration', 0),
                            'count': 1,
                            'damageType': 'physical',
                            'displayname': 'Bash' //itemData['item_' + item].displayname
                        }
                    }
                    else {
                        //sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getOrbProcSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'maelstrom':
                case 'mjollnir':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'chain_chance', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'chain_damage', 0),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };

    self.getOrbSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'diffusal_blade':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': 1,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'feedback_mana_burn', self.items()[i].size),
                            'count': 1,
                            'damageType': 'physical',
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getHealth = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_health':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getHealthRegen = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'health_regen':
                    case 'bonus_regen':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'bonus_health_regen':
                        if (item == 'tranquil_boots' && !isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                        else if (item != 'tranquil_boots') {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'hp_regen':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'health_regen_rate':
                        if (item == 'heart' && isActive) {
                            totalAttribute += (parseInt(attribute.value[0]) / 100) * self.hero.health();
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getHealthRegenAura = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(item + attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'aura_health_regen':
                    case 'hp_regen_aura':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(item + attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getMana = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_mana':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getManaRegen = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'aura_mana_regen':
                    case 'mana_regen_aura':
                        totalAttribute += parseFloat(attribute.value[0]);
                    break;
                    case 'mana_regen':
                        if (item == 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;    
    };
    self.getManaRegenPercent = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_mana_regen':
                    case 'mana_regen':
                    case 'bonus_mana_regen_pct':
                        if (item != 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute / 100;    
    };
    self.getManaRegenBloodstone = function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            if (item.indexOf('bloodstone') != -1) {
                return parseInt(self.items()[i].size);
            }
        }
        return 0;
    };
    
    self.getArmor = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_armor':
                        if (!isActive || (item != 'medallion_of_courage' && item != 'solar_crest')) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                    case 'unholy_bonus_armor':
                        if (isActive && item == 'armlet') { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getArmorAura = function (aList) {
        var totalAttribute = 0,
            attributeList = aList || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0;j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                switch(attribute.name) {
                    // buckler
                    case 'bonus_aoe_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                    // assault
                    case 'aura_positive_armor':
                        attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                    // ring_of_aquila,ring_of_basilius
                    case 'aura_bonus_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                    // vladmir
                    case 'armor_aura':
                        attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                    // mekansm
                    case 'heal_bonus_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                }
            }
        }
        // remove buckler if there is a mekansm
        if (attributeList.find(function (attribute) { return attribute.name == 'heal_bonus_armor'; })) {
            attributeList = attributeList.filter(function (attribute) {
                return attribute.name !== 'bonus_aoe_armor';
            });
        }
        // remove ring_of_aquila,ring_of_basilius if there is a vladmir
        if (attributeList.find(function (attribute) { return attribute.name == 'armor_aura'; })) {
            attributeList = attributeList.filter(function (attribute) {
                return attribute.name !== 'aura_bonus_armor';
            });
        }
        
        totalAttribute = attributeList.reduce(function (memo, attribute) {
            return memo += attribute.value;
        }, 0);
        return {value: totalAttribute, attributes: attributeList};
    };
    self.getArmorReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [],
            selfExcludeList = [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1 || excludeList.indexOf(item + '_' + attribute.name) > -1) continue;
                // self exclusion check only for hero items, not buff items
                if (self.hero && (selfExcludeList.indexOf(attribute.name) > -1 || selfExcludeList.indexOf(item + '_' + attribute.name) > -1)) continue;
                switch(attribute.name) {
                    case 'armor_reduction':
                        if (isActive || (item != 'medallion_of_courage' && item != 'solar_crest')) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(item + '_' + attribute.name);
                        }
                    break;
                    case 'aura_negative_armor':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                    case 'corruption_armor':
                        totalAttribute += parseInt(attribute.value[0]);
                        // allow blight_stone and desolator corruption_armor stacking from different sources, but not from same source
                        excludeList.push(item + '_' + attribute.name);
                        selfExcludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getEvasion = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_evasion':
                        if (!isActive || (item != 'butterfly' && item != 'solar_crest')) { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getMovementSpeedFlat = function (e) {
        var totalAttribute = 0,
        excludeList = e || [],
        hasBoots = false,
        hasEuls = false,
        hasWindLace = false,
        hasDrums = false,
        bootItems = ['boots','phase_boots','arcane_boots','travel_boots','power_treads','tranquil_boots','guardian_greaves'];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'bonus_movement_speed':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            if (item != 'tranquil_boots' || (item == 'tranquil_boots' && !isActive)) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasBoots = true;
                            }
                        }
                        //else if (!hasEuls && item == 'cyclone') {
                        else if (item == 'cyclone') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasEuls = true;
                        }
                    break;
                    case 'broken_movement_speed':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            if (item == 'tranquil_boots' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasBoots = true;
                            }
                        }
                    break;
                    case 'bonus_movement':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasBoots = true;
                        }
                    break;
                    case 'movement_speed':
                        if (!hasWindLace && item == 'wind_lace') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasWindLace = true;
                        }
                    break;
                    case 'bonus_aura_movement_speed':
                        if (!hasDrums && item == 'ancient_janggo') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasDrums = true;
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getMovementSpeedPercent = function (e) {
        var totalAttribute = 0,
            excludeList = e || [],
            hasYasha = false,
            hasDrumsActive = false,
            hasPhaseActive = false,
            hasShadowBladeActive = false,
            hasButterflyActive = false,
            hasMoMActive = false,
            yashaItems = ['manta','yasha','sange_and_yasha'];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'movement_speed_percent_bonus':
                        if (!hasYasha && yashaItems.indexOf(item) >= 0) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasYasha = true;
                        }
                    break;
                    case 'phase_movement_speed':
                        if (isActive && !hasPhaseActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasPhaseActive = true;
                        }
                    break;
                    case 'bonus_movement_speed_pct':
                        if (isActive && !hasDrumsActive && item == 'ancient_janggo') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasDrumsActive = true;
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'windwalk_movement_speed':
                        if (isActive && !hasShadowBladeActive && (item == 'invis_sword' || item == 'silver_edge')) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasShadowBladeActive = true;
                        }
                    break;
                    case 'berserk_bonus_movement_speed':
                        if (isActive && !hasMoMActive && item == 'mask_of_madness') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasMoMActive = true;
                        }
                    break;
                    case 'bonus_movement_speed': //manta
                        if (!hasYasha && item == 'manta') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasYasha = true;
                        }
                        else if (item == 'smoke_of_deceit' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'bonus_move_speed':
                        if (isActive && !hasButterflyActive && item == 'butterfly') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasButterflyActive = true;
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute/100, excludeList: excludeList};
    };
    
    self.getMovementSpeedPercentReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'movespeed':
                        if (item == 'dust' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    case 'blast_movement_speed':
                        if (item == 'shivas_guard' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    case 'cold_movement_speed':
                        if (item == 'skadi') {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'maim_movement_speed':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute/100, excludeList: excludeList};
    };
    
    self.getBonusDamage = function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_damage':
                        totalAttribute += parseInt(attribute.value[0]);
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'damage': parseInt(attribute.value[0]),
                                'damageType': 'physical',
                                'count':1,
                                'displayname': itemData['item_' + item].displayname
                            }                            
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                    case 'unholy_bonus_damage':
                        if (isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            if (sources[item + '_active'] == undefined) {
                                sources[item + '_active'] = {
                                    'damage': parseInt(attribute.value[0]),
                                    'damageType': 'physical',
                                    'count':1,
                                    'displayname': itemData['item_' + item].displayname + ' Unholy Strength'
                                }                            
                            }
                            else {
                                sources[item].count += 1;
                            }
                        }
                    break;
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    };
    self.getBonusDamagePercent = function (s) {
        s = s || {sources:{},total:0};
        var totalAttribute = s.total || 0;
        var sources = s.sources || {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'damage_aura':
                        if (sources[item] == undefined) {
                            totalAttribute += parseInt(attribute.value[0]) / 100;
                            sources[item] = {
                                'damage': parseInt(attribute.value[0]) / 100,
                                'damageType': 'physical',
                                'count':1,
                                'displayname': itemData['item_' + item].displayname
                            }
                        }
                        // else {
                            // sources[item].count += 1;
                        // }
                    break;
                    case 'bottle_doubledamage':
                        if (sources[item] == undefined) {
                            totalAttribute += parseInt(attribute.value[0]) / 100;
                            sources[item] = {
                                'damage': parseInt(attribute.value[0]) / 100,
                                'damageType': 'physical',
                                'count':1,
                                'displayname': itemData['item_' + item].displayname
                            }
                        }
                    break;
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    };
    self.getAttackSpeed = function (e) {
        var totalAttribute = 0,
            hasPowerTreads = false,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'bonus_attack_speed':
                        if (item == 'power_treads') {
                            if (!hasPowerTreads) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasPowerTreads = true;
                            }
                        }
                        else if (item == 'moon_shard') {
                            if (!isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        else if (item == 'hurricane_pike') {
                            if (isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        else {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'consumed_bonus':
                        if (item == 'moon_shard' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    break;
                    case 'bonus_speed':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    // helm_of_the_dominator
                    case 'attack_speed':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                    case 'unholy_bonus_attack_speed':
                        if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                    case 'berserk_bonus_attack_speed':
                        if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getAttackSpeedAura = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(item + attribute.name) > -1) continue;
                switch(attribute.name) {
                    // helm_of_the_dominator
                    case 'attack_speed_aura':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(item + attribute.name);
                    break;
                    // assault_cuirass
                    case 'aura_attack_speed':
                        if (item != 'shivas_guard') { totalAttribute += parseInt(attribute.value[0]); };
                        excludeList.push(item + attribute.name);
                    break;
                    // ancient_janggo
                    case 'bonus_attack_speed_pct':
                        if (isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getAttackSpeedReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'aura_attack_speed':
                        if (item == 'shivas_guard') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'cold_attack_speed':
                        if (item == 'skadi') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'maim_attack_speed':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getLifesteal = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'lifesteal_percent':
                        if (item == 'satanic') {
                            if (!isActive) { return parseInt(attribute.value[0]); };
                        }
                        else {
                            return parseInt(attribute.value[0]);
                        }
                    break;
                    case 'unholy_lifesteal_percent':
                        if (isActive) { return parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getLifestealAura = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'vampiric_aura':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getSpellAmp = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'spell_amp':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;
    });
    self.getCooldownReductionFlat = ko.computed(function () {
        var totalAttribute = 0;
        /*for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_night_vision':
                        if (item != 'moon_shard' || !isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                }
            }
        }*/
        return totalAttribute;
    });
    self.getCooldownReductionPercent = function (aList) {        
        var totalAttribute = 1,
            attributeList = aList || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0;j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                switch(attribute.name) {
                    // octarine_core
                    case 'bonus_cooldown':
                        attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                }
            }
        }
        
        totalAttribute = attributeList.reduce(function (memo, attribute) {
            return memo *= (1 - attribute.value / 100);
        }, 1);
        return {value: totalAttribute, attributes: attributeList};
    };
    self.getCooldownIncreaseFlat = ko.computed(function () {
        var totalAttribute = 0;
        return totalAttribute;
    });
    self.getCooldownIncreasePercent = function () {
        var totalAttribute = 1;
        return totalAttribute;
    };
    self.getMagicResist = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_magical_armor':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'bonus_spell_resist':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'magic_resistance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getMagicResistReductionSelf = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            if (isActive) {
                for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                    var attribute = itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'extra_spell_damage_percent':
                        case 'ethereal_damage_bonus':
                            return (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
        }
        return totalAttribute;
    };   
    self.getMagicResistReduction = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            if (isActive) {
                for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                    var attribute = itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'ethereal_damage_bonus':
                            if (!self.isEthereal()) totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        case 'resist_debuff':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
        }
        return totalAttribute;
    };        

    self.getVisionRangeNight = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_night_vision':
                        if (item != 'moon_shard' || !isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    // moon_shard
                    case 'consumed_bonus_night_vision':
                        if (item == 'moon_shard' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackRange = function (attacktype, aList) {
        var totalAttribute = 0,
            attributeList = aList || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0;j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                switch(attribute.name) {
                    // dragon_lance
                    case 'base_attack_range':
                        if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                }
            }
        }
        
        totalAttribute = attributeList.reduce(function (memo, attribute) {
            return memo += attribute.value;
        }, 0);
        return {value: totalAttribute, attributes: attributeList};
    };
    
    self.getMissChance = function (e) {
        var totalAttribute = 1,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'miss_chance':
                        if (item === 'solar_crest' && isActive) {
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'blind_pct':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        excludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getBaseDamageReductionPct = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'backstab_reduction':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                            totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };    
    self.getBonusDamageReductionPct = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'backstab_reduction':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                            totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.itemOptions = ko.observableArray(itemOptionsArray.items);
    
    self.itemBuffOptions = ko.observableArray(itemBuffOptions.items);
    self.selectedItemBuff = ko.observable('assault');

    self.itemDebuffOptions = ko.observableArray(itemDebuffOptions.items);
    self.selectedItemDebuff = ko.observable('assault');
    
    return self;
};
InventoryViewModel.prototype = Object.create(BasicInventoryViewModel.prototype);
InventoryViewModel.prototype.constructor = InventoryViewModel;

module.exports = InventoryViewModel;
},{"../herocalc_knockout":21,"./BasicInventoryViewModel":24,"./itemBuffOptions":27,"./itemDebuffOptions":28,"./itemOptionsArray":29,"./levelItems":31,"./stackableItems":32}],26:[function(require,module,exports){
(function (global){
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);

var ItemInput = function (itemData, value, name, debuff) {
    if (itemData['item_' + value].ItemAliases instanceof Array) {
        var itemAlias = itemData['item_' + value].ItemAliases.join(' ');
    }
    else {
        var itemAlias = itemData['item_' + value].ItemAliases;
    }
    this.value = ko.observable(value);
    this.debuff = ko.observable(debuff);
    if (this.debuff()) {
        this.value = ko.observable(value + '|' + debuff.id);
        this.name = ko.observable(name + ' (' + debuff.name + ')');
        this.displayname = ko.observable(name + ' (' + debuff.name + ') <span style="display:none">' + ';' + itemAlias + '</span>');
    }
    else {
        this.value = ko.observable(value);
        this.name = ko.observable(name);
        this.displayname = ko.observable(name + ' <span style="display:none">' + ';' + itemAlias + '</span>');
    }
};

module.exports = ItemInput;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(require,module,exports){
var ItemInput = require("./ItemInput");
var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest', 'bottle_doubledamage', 'helm_of_the_dominator'];
var itemBuffOptions = {};

var init = function (itemData) {
    itemBuffOptions.items = itemBuffs.map(function(item) {
        return new ItemInput(itemData, item, itemData['item_' + item].displayname);
    }).sort(function (a, b) {
        if (a.displayname() < b.displayname()) return -1;
        if (a.displayname() > b.displayname()) return 1;
        return 0;
    });
    return itemBuffOptions.items;
}

itemBuffOptions.init = init;

module.exports = itemBuffOptions;
},{"./ItemInput":26}],28:[function(require,module,exports){
var ItemInput = require("./ItemInput");
var itemDebuffs = [
    {item: 'assault', debuff: null},
    {item: 'shivas_guard', debuff: null},
    {item: 'desolator', debuff: null},
    {item: 'blight_stone', debuff: null},
    {item: 'medallion_of_courage', debuff: null},
    {item: 'radiance', debuff: null},
    {item: 'sheepstick', debuff: null},
    {item: 'veil_of_discord', debuff: null},
    {item: 'solar_crest', debuff: null},
    {item: 'silver_edge', debuff: {id: 'shadow_walk', name: 'Shadow Walk'}},
    {item: 'silver_edge', debuff: {id: 'maim', name: 'Lesser Maim'}}
]
var itemDebuffOptions = {};

var init = function (itemData) {
    itemDebuffOptions.items = itemDebuffs.map(function(item) {
        return new ItemInput(itemData, item.item, itemData['item_' + item.item].displayname, item.debuff);
    }).sort(function (a, b) {
        if (a.displayname() < b.displayname()) return -1;
        if (a.displayname() > b.displayname()) return 1;
        return 0;
    });
    return itemDebuffOptions.items;
}

itemDebuffOptions.init = init;

module.exports = itemDebuffOptions;
},{"./ItemInput":26}],29:[function(require,module,exports){
var validItems = require("./validItems");
var ItemInput = require("./ItemInput");

var itemOptionsArray = {};

var init = function (itemData) {
    itemOptionsArray.items = [];
    for (var i = 0; i < validItems.length; i++) {
        itemOptionsArray.items.push(new ItemInput(itemData, validItems[i], itemData['item_' + validItems[i]].displayname));
    }
    return itemOptionsArray.items;
}

itemOptionsArray.init = init;

module.exports = itemOptionsArray;
},{"./ItemInput":26,"./validItems":33}],30:[function(require,module,exports){
module.exports = ['solar_crest', 'heart','smoke_of_deceit','dust','ghost','tranquil_boots','phase_boots','power_treads','buckler','medallion_of_courage','ancient_janggo','mekansm','pipe','veil_of_discord','rod_of_atos','orchid','sheepstick','armlet','invis_sword','ethereal_blade','shivas_guard','manta','mask_of_madness','diffusal_blade','mjollnir','satanic','ring_of_basilius','ring_of_aquila', 'butterfly', 'moon_shard', 'silver_edge','bloodthorn','hurricane_pike'];
},{}],31:[function(require,module,exports){
module.exports = ['necronomicon','dagon','diffusal_blade','travel_boots'];
},{}],32:[function(require,module,exports){
module.exports = ['clarity','flask','dust','ward_observer','ward_sentry','tango','tpscroll','smoke_of_deceit'];
},{}],33:[function(require,module,exports){
module.exports = ["abyssal_blade","ultimate_scepter","courier","arcane_boots","armlet","assault","boots_of_elves","bfury","belt_of_strength","black_king_bar","blade_mail","blade_of_alacrity","blades_of_attack","blink","bloodstone","boots","travel_boots","bottle","bracer","broadsword","buckler","butterfly","chainmail","circlet","clarity","claymore","cloak","lesser_crit","greater_crit","dagon","demon_edge","desolator","diffusal_blade","rapier","ancient_janggo","dust","eagle","energy_booster","ethereal_blade","cyclone","skadi","flying_courier","force_staff","gauntlets","gem","ghost","gloves","hand_of_midas","headdress","flask","heart","heavens_halberd","helm_of_iron_will","helm_of_the_dominator","hood_of_defiance","hyperstone","branches","javelin","sphere","maelstrom","magic_stick","magic_wand","manta","mantle","mask_of_madness","medallion_of_courage","mekansm","mithril_hammer","mjollnir","monkey_king_bar","lifesteal","mystic_staff","necronomicon","null_talisman","oblivion_staff","ward_observer","ogre_axe","orb_of_venom","orchid","pers","phase_boots","pipe","platemail","point_booster","poor_mans_shield","power_treads","quarterstaff","quelling_blade","radiance","reaver","refresher","ring_of_aquila","ring_of_basilius","ring_of_health","ring_of_protection","ring_of_regen","robe","rod_of_atos","relic","sobi_mask","sange","sange_and_yasha","satanic","sheepstick","ward_sentry","shadow_amulet","invis_sword","shivas_guard","basher","slippers","smoke_of_deceit","soul_booster","soul_ring","staff_of_wizardry","stout_shield","talisman_of_evasion","tango","tpscroll","tranquil_boots","ultimate_orb","urn_of_shadows","vanguard","veil_of_discord","vitality_booster","vladmir","void_stone","wraith_band","yasha","crimson_guard","enchanted_mango","lotus_orb","glimmer_cape","guardian_greaves","moon_shard","silver_edge","solar_crest","octarine_core","aether_lens","faerie_fire","iron_talon","dragon_lance","echo_sabre","infused_raindrop","blight_stone","wind_lace","tome_of_knowledge","bloodthorn","hurricane_pike"];
},{}],34:[function(require,module,exports){
'use strict';

var core = {};
core.InventoryViewModel = require("./inventory/InventoryViewModel");
core.AbilityModel = require("./AbilityModel");
core.BuffViewModel = require("./BuffViewModel");
core.HeroModel = require("./hero/HeroModel");
core.CloneModel = require("./hero/CloneModel");
core.UnitModel = require("./hero/UnitModel");
core.IllusionModel = require("./hero/IllusionModel");
core.Data = require("./data/main");
core.Util = require("./util/main");

core.init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    core.Data.init(HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, function () {
        core.HeroOptions = require("./hero/heroOptionsArray").init(core.Data.heroData);
        core.BuffOptions = require("./buffs/buffOptionsArray").init(core.Data.heroData, core.Data.unitData);
        core.DebuffOptions = require("./buffs/debuffOptionsArray").init(core.Data.heroData, core.Data.unitData);
        core.ItemOptions = require("./inventory/itemOptionsArray").init(core.Data.itemData);
        core.ItemBuffOptions = require("./inventory/itemBuffOptions").init(core.Data.itemData);
        core.ItemDebuffOptions = require("./inventory/itemDebuffOptions").init(core.Data.itemData);
        callback();
    });
}

module.exports = core;
},{"./AbilityModel":1,"./BuffViewModel":2,"./buffs/buffOptionsArray":4,"./buffs/debuffOptionsArray":5,"./data/main":7,"./hero/CloneModel":8,"./hero/HeroModel":11,"./hero/IllusionModel":13,"./hero/UnitModel":15,"./hero/heroOptionsArray":17,"./inventory/InventoryViewModel":25,"./inventory/itemBuffOptions":27,"./inventory/itemDebuffOptions":28,"./inventory/itemOptionsArray":29,"./util/main":40}],35:[function(require,module,exports){
var extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];

        if (!obj)
            continue;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    out[key] = extend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }

    return out;
};

module.exports = extend;
},{}],36:[function(require,module,exports){
var findWhere = function (arr, obj) {
    arrLoop: for (var i = 0; i < arr.length; i++) {
        objLoop: for (var key in obj) {
            if (arr[i][key] != obj[key]) {
                continue arrLoop;
            }
        }
        return arr[i];
    }
}

module.exports = findWhere;
},{}],37:[function(require,module,exports){
"use strict";

var getJSON = function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            successCallback(data);
        } else {
            // We reached our target server, but it returned an error
            errorCallback();
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        errorCallback();
    };

    request.send();
}

module.exports = getJSON;
},{}],38:[function(require,module,exports){
var isEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

module.exports = isEmpty;
},{}],39:[function(require,module,exports){
var isString = function (myVar) {
    return typeof myVar === 'string' || myVar instanceof String;
}

module.exports = isString;
},{}],40:[function(require,module,exports){
'use strict';

var util = {};
util.extend = require("./extend");
util.findWhere = require("./findWhere");
util.getJSON = require("./getJSON");
util.union = require("./union");
util.uniqueId = require("./uniqueId");
util.uniques = require("./uniques");

module.exports = util;
},{"./extend":35,"./findWhere":36,"./getJSON":37,"./union":41,"./uniqueId":42,"./uniques":43}],41:[function(require,module,exports){
"use strict";
var uniques = require("./uniques");

var union = function (a, b) {
    var arr = a.concat(b);
    return uniques(arr);
}

module.exports = union;
},{"./uniques":43}],42:[function(require,module,exports){
"use strict";

var idCounter = 0;
var uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

module.exports = uniqueId;
},{}],43:[function(require,module,exports){
"use strict";
var uniques = function (arr) {
    var a = [];
    for (var i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

module.exports = uniques;
},{}],44:[function(require,module,exports){
(function (global){
(function (factory) {
	// Module systems magic dance.

	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory((typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null), exports);
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout", "exports"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `mapping` property
		factory(ko, ko.mapping = {});
	}
}(function (ko, exports) {
	var DEBUG=true;
	var mappingProperty = "__ko_mapping__";
	var realKoDependentObservable = ko.dependentObservable;
	var mappingNesting = 0;
	var dependentObservables;
	var visitedObjects;
	var recognizedRootProperties = ["create", "update", "key", "arrayChanged"];
	var emptyReturn = {};

	var _defaultOptions = {
		include: ["_destroy"],
		ignore: [],
		copy: [],
		observe: []
	};
	var defaultOptions = _defaultOptions;

	// Author: KennyTM @ StackOverflow
	function unionArrays (x, y) {
		var obj = {};
		for (var i = x.length - 1; i >= 0; -- i) obj[x[i]] = x[i];
		for (var i = y.length - 1; i >= 0; -- i) obj[y[i]] = y[i];
		var res = [];

		for (var k in obj) {
			res.push(obj[k]);
		};

		return res;
	}

	function extendObject(destination, source) {
		var destType;

		for (var key in source) {
			if (source.hasOwnProperty(key) && source[key]) {
				destType = exports.getType(destination[key]);
				if (key && destination[key] && destType !== "array" && destType !== "string") {
					extendObject(destination[key], source[key]);
				} else {
					var bothArrays = exports.getType(destination[key]) === "array" && exports.getType(source[key]) === "array";
					if (bothArrays) {
						destination[key] = unionArrays(destination[key], source[key]);
					} else {
						destination[key] = source[key];
					}
				}
			}
		}
	}

	function merge(obj1, obj2) {
		var merged = {};
		extendObject(merged, obj1);
		extendObject(merged, obj2);

		return merged;
	}

	exports.isMapped = function (viewModel) {
		var unwrapped = ko.utils.unwrapObservable(viewModel);
		return unwrapped && unwrapped[mappingProperty];
	}

	exports.fromJS = function (jsObject /*, inputOptions, target*/ ) {
		if (arguments.length == 0) throw new Error("When calling ko.fromJS, pass the object you want to convert.");

		try {
			if (!mappingNesting++) {
				dependentObservables = [];
				visitedObjects = new objectLookup();
			}

			var options;
			var target;

			if (arguments.length == 2) {
				if (arguments[1][mappingProperty]) {
					target = arguments[1];
				} else {
					options = arguments[1];
				}
			}
			if (arguments.length == 3) {
				options = arguments[1];
				target = arguments[2];
			}

			if (target) {
				options = merge(options, target[mappingProperty]);
			}
			options = fillOptions(options);

			var result = updateViewModel(target, jsObject, options);
			if (target) {
				result = target;
			}

			// Evaluate any dependent observables that were proxied.
			// Do this after the model's observables have been created
			if (!--mappingNesting) {
				while (dependentObservables.length) {
					var DO = dependentObservables.pop();
					if (DO) {
						DO();
						
						// Move this magic property to the underlying dependent observable
						DO.__DO["throttleEvaluation"] = DO["throttleEvaluation"];
					}
				}
			}

			// Save any new mapping options in the view model, so that updateFromJS can use them later.
			result[mappingProperty] = merge(result[mappingProperty], options);

			return result;
		} catch(e) {
			mappingNesting = 0;
			throw e;
		}
	};

	exports.fromJSON = function (jsonString /*, options, target*/ ) {
		var parsed = ko.utils.parseJson(jsonString);
		arguments[0] = parsed;
		return exports.fromJS.apply(this, arguments);
	};

	exports.updateFromJS = function (viewModel) {
		throw new Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");
	};

	exports.updateFromJSON = function (viewModel) {
		throw new Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!");
	};

	exports.toJS = function (rootObject, options) {
		if (!defaultOptions) exports.resetDefaultOptions();

		if (arguments.length == 0) throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");
		if (exports.getType(defaultOptions.ignore) !== "array") throw new Error("ko.mapping.defaultOptions().ignore should be an array.");
		if (exports.getType(defaultOptions.include) !== "array") throw new Error("ko.mapping.defaultOptions().include should be an array.");
		if (exports.getType(defaultOptions.copy) !== "array") throw new Error("ko.mapping.defaultOptions().copy should be an array.");

		// Merge in the options used in fromJS
		options = fillOptions(options, rootObject[mappingProperty]);

		// We just unwrap everything at every level in the object graph
		return exports.visitModel(rootObject, function (x) {
			return ko.utils.unwrapObservable(x)
		}, options);
	};

	exports.toJSON = function (rootObject, options) {
		var plainJavaScriptObject = exports.toJS(rootObject, options);
		return ko.utils.stringifyJson(plainJavaScriptObject);
	};

	exports.defaultOptions = function () {
		if (arguments.length > 0) {
			defaultOptions = arguments[0];
		} else {
			return defaultOptions;
		}
	};

	exports.resetDefaultOptions = function () {
		defaultOptions = {
			include: _defaultOptions.include.slice(0),
			ignore: _defaultOptions.ignore.slice(0),
			copy: _defaultOptions.copy.slice(0)
		};
	};

	exports.getType = function(x) {
		if ((x) && (typeof (x) === "object")) {
			if (x.constructor === Date) return "date";
			if (x.constructor === Array) return "array";
		}
		return typeof x;
	}

	function fillOptions(rawOptions, otherOptions) {
		var options = merge({}, rawOptions);

		// Move recognized root-level properties into a root namespace
		for (var i = recognizedRootProperties.length - 1; i >= 0; i--) {
			var property = recognizedRootProperties[i];
			
			// Carry on, unless this property is present
			if (!options[property]) continue;
			
			// Move the property into the root namespace
			if (!(options[""] instanceof Object)) options[""] = {};
			options[""][property] = options[property];
			delete options[property];
		}

		if (otherOptions) {
			options.ignore = mergeArrays(otherOptions.ignore, options.ignore);
			options.include = mergeArrays(otherOptions.include, options.include);
			options.copy = mergeArrays(otherOptions.copy, options.copy);
			options.observe = mergeArrays(otherOptions.observe, options.observe);
		}
		options.ignore = mergeArrays(options.ignore, defaultOptions.ignore);
		options.include = mergeArrays(options.include, defaultOptions.include);
		options.copy = mergeArrays(options.copy, defaultOptions.copy);
		options.observe = mergeArrays(options.observe, defaultOptions.observe);

		options.mappedProperties = options.mappedProperties || {};
		options.copiedProperties = options.copiedProperties || {};
		return options;
	}

	function mergeArrays(a, b) {
		if (exports.getType(a) !== "array") {
			if (exports.getType(a) === "undefined") a = [];
			else a = [a];
		}
		if (exports.getType(b) !== "array") {
			if (exports.getType(b) === "undefined") b = [];
			else b = [b];
		}

		return ko.utils.arrayGetDistinctValues(a.concat(b));
	}

	// When using a 'create' callback, we proxy the dependent observable so that it doesn't immediately evaluate on creation.
	// The reason is that the dependent observables in the user-specified callback may contain references to properties that have not been mapped yet.
	function withProxyDependentObservable(dependentObservables, callback) {
		var localDO = ko.dependentObservable;
		ko.dependentObservable = function (read, owner, options) {
			options = options || {};

			if (read && typeof read == "object") { // mirrors condition in knockout implementation of DO's
				options = read;
			}

			var realDeferEvaluation = options.deferEvaluation;

			var isRemoved = false;

			// We wrap the original dependent observable so that we can remove it from the 'dependentObservables' list we need to evaluate after mapping has
			// completed if the user already evaluated the DO themselves in the meantime.
			var wrap = function (DO) {
				// Temporarily revert ko.dependentObservable, since it is used in ko.isWriteableObservable
				var tmp = ko.dependentObservable;
				ko.dependentObservable = realKoDependentObservable;
				var isWriteable = ko.isWriteableObservable(DO);
				ko.dependentObservable = tmp;

				var wrapped = realKoDependentObservable({
					read: function () {
						if (!isRemoved) {
							ko.utils.arrayRemoveItem(dependentObservables, DO);
							isRemoved = true;
						}
						return DO.apply(DO, arguments);
					},
					write: isWriteable && function (val) {
						return DO(val);
					},
					deferEvaluation: true
				});
				if (DEBUG) wrapped._wrapper = true;
				wrapped.__DO = DO;
				return wrapped;
			};
			
			options.deferEvaluation = true; // will either set for just options, or both read/options.
			var realDependentObservable = new realKoDependentObservable(read, owner, options);

			if (!realDeferEvaluation) {
				realDependentObservable = wrap(realDependentObservable);
				dependentObservables.push(realDependentObservable);
			}

			return realDependentObservable;
		}
		ko.dependentObservable.fn = realKoDependentObservable.fn;
		ko.computed = ko.dependentObservable;
		var result = callback();
		ko.dependentObservable = localDO;
		ko.computed = ko.dependentObservable;
		return result;
	}

	function updateViewModel(mappedRootObject, rootObject, options, parentName, parent, parentPropertyName, mappedParent) {
		var isArray = exports.getType(ko.utils.unwrapObservable(rootObject)) === "array";

		parentPropertyName = parentPropertyName || "";

		// If this object was already mapped previously, take the options from there and merge them with our existing ones.
		if (exports.isMapped(mappedRootObject)) {
			var previousMapping = ko.utils.unwrapObservable(mappedRootObject)[mappingProperty];
			options = merge(previousMapping, options);
		}

		var callbackParams = {
			data: rootObject,
			parent: mappedParent || parent
		};

		var hasCreateCallback = function () {
			return options[parentName] && options[parentName].create instanceof Function;
		};

		var createCallback = function (data) {
			return withProxyDependentObservable(dependentObservables, function () {
				
				if (ko.utils.unwrapObservable(parent) instanceof Array) {
					return options[parentName].create({
						data: data || callbackParams.data,
						parent: callbackParams.parent,
						skip: emptyReturn
					});
				} else {
					return options[parentName].create({
						data: data || callbackParams.data,
						parent: callbackParams.parent
					});
				}				
			});
		};

		var hasUpdateCallback = function () {
			return options[parentName] && options[parentName].update instanceof Function;
		};

		var updateCallback = function (obj, data) {
			var params = {
				data: data || callbackParams.data,
				parent: callbackParams.parent,
				target: ko.utils.unwrapObservable(obj)
			};

			if (ko.isWriteableObservable(obj)) {
				params.observable = obj;
			}

			return options[parentName].update(params);
		}

		var alreadyMapped = visitedObjects.get(rootObject);
		if (alreadyMapped) {
			return alreadyMapped;
		}

		parentName = parentName || "";

		if (!isArray) {
			// For atomic types, do a direct update on the observable
			if (!canHaveProperties(rootObject)) {
				switch (exports.getType(rootObject)) {
				case "function":
					if (hasUpdateCallback()) {
						if (ko.isWriteableObservable(rootObject)) {
							rootObject(updateCallback(rootObject));
							mappedRootObject = rootObject;
						} else {
							mappedRootObject = updateCallback(rootObject);
						}
					} else {
						mappedRootObject = rootObject;
					}
					break;
				default:
					if (ko.isWriteableObservable(mappedRootObject)) {
						if (hasUpdateCallback()) {
							var valueToWrite = updateCallback(mappedRootObject);
							mappedRootObject(valueToWrite);
							return valueToWrite;
						} else {
							var valueToWrite = ko.utils.unwrapObservable(rootObject);
							mappedRootObject(valueToWrite);
							return valueToWrite;
						}
					} else {
						var hasCreateOrUpdateCallback = hasCreateCallback() || hasUpdateCallback();
						
						if (hasCreateCallback()) {
							mappedRootObject = createCallback();
						} else {
							mappedRootObject = ko.observable(ko.utils.unwrapObservable(rootObject));
						}

						if (hasUpdateCallback()) {
							mappedRootObject(updateCallback(mappedRootObject));
						}
						
						if (hasCreateOrUpdateCallback) return mappedRootObject;
					}
				}

			} else {
				mappedRootObject = ko.utils.unwrapObservable(mappedRootObject);
				if (!mappedRootObject) {
					if (hasCreateCallback()) {
						var result = createCallback();

						if (hasUpdateCallback()) {
							result = updateCallback(result);
						}

						return result;
					} else {
						if (hasUpdateCallback()) {
							return updateCallback(result);
						}

						mappedRootObject = {};
					}
				}

				if (hasUpdateCallback()) {
					mappedRootObject = updateCallback(mappedRootObject);
				}

				visitedObjects.save(rootObject, mappedRootObject);
				if (hasUpdateCallback()) return mappedRootObject;

				// For non-atomic types, visit all properties and update recursively
				visitPropertiesOrArrayEntries(rootObject, function (indexer) {
					var fullPropertyName = parentPropertyName.length ? parentPropertyName + "." + indexer : indexer;

					if (ko.utils.arrayIndexOf(options.ignore, fullPropertyName) != -1) {
						return;
					}

					if (ko.utils.arrayIndexOf(options.copy, fullPropertyName) != -1) {
						mappedRootObject[indexer] = rootObject[indexer];
						return;
					}

					if(typeof rootObject[indexer] != "object" && typeof rootObject[indexer] != "array" && options.observe.length > 0 && ko.utils.arrayIndexOf(options.observe, fullPropertyName) == -1)
					{
						mappedRootObject[indexer] = rootObject[indexer];
						options.copiedProperties[fullPropertyName] = true;
						return;
					}
					
					// In case we are adding an already mapped property, fill it with the previously mapped property value to prevent recursion.
					// If this is a property that was generated by fromJS, we should use the options specified there
					var prevMappedProperty = visitedObjects.get(rootObject[indexer]);
					var retval = updateViewModel(mappedRootObject[indexer], rootObject[indexer], options, indexer, mappedRootObject, fullPropertyName, mappedRootObject);
					var value = prevMappedProperty || retval;
					
					if(options.observe.length > 0 && ko.utils.arrayIndexOf(options.observe, fullPropertyName) == -1)
					{
						mappedRootObject[indexer] = value();
						options.copiedProperties[fullPropertyName] = true;
						return;
					}
					
					if (ko.isWriteableObservable(mappedRootObject[indexer])) {
						value = ko.utils.unwrapObservable(value);
						if (mappedRootObject[indexer]() !== value) {
							mappedRootObject[indexer](value);
						}
					} else {
						value = mappedRootObject[indexer] === undefined ? value : ko.utils.unwrapObservable(value);
						mappedRootObject[indexer] = value;
					}

					options.mappedProperties[fullPropertyName] = true;
				});
			}
		} else { //mappedRootObject is an array
			var changes = [];

			var hasKeyCallback = false;
			var keyCallback = function (x) {
				return x;
			}
			if (options[parentName] && options[parentName].key) {
				keyCallback = options[parentName].key;
				hasKeyCallback = true;
			}

			if (!ko.isObservable(mappedRootObject)) {
				// When creating the new observable array, also add a bunch of utility functions that take the 'key' of the array items into account.
				mappedRootObject = ko.observableArray([]);

				mappedRootObject.mappedRemove = function (valueOrPredicate) {
					var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === keyCallback(valueOrPredicate);
						};
					return mappedRootObject.remove(function (item) {
						return predicate(keyCallback(item));
					});
				}

				mappedRootObject.mappedRemoveAll = function (arrayOfValues) {
					var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
					return mappedRootObject.remove(function (item) {
						return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
					});
				}

				mappedRootObject.mappedDestroy = function (valueOrPredicate) {
					var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === keyCallback(valueOrPredicate);
						};
					return mappedRootObject.destroy(function (item) {
						return predicate(keyCallback(item));
					});
				}

				mappedRootObject.mappedDestroyAll = function (arrayOfValues) {
					var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
					return mappedRootObject.destroy(function (item) {
						return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
					});
				}

				mappedRootObject.mappedIndexOf = function (item) {
					var keys = filterArrayByKey(mappedRootObject(), keyCallback);
					var key = keyCallback(item);
					return ko.utils.arrayIndexOf(keys, key);
				}

				mappedRootObject.mappedGet = function (item) {
					return mappedRootObject()[mappedRootObject.mappedIndexOf(item)];
				}

				mappedRootObject.mappedCreate = function (value) {
					if (mappedRootObject.mappedIndexOf(value) !== -1) {
						throw new Error("There already is an object with the key that you specified.");
					}

					var item = hasCreateCallback() ? createCallback(value) : value;
					if (hasUpdateCallback()) {
						var newValue = updateCallback(item, value);
						if (ko.isWriteableObservable(item)) {
							item(newValue);
						} else {
							item = newValue;
						}
					}
					mappedRootObject.push(item);
					return item;
				}
			}

			var currentArrayKeys = filterArrayByKey(ko.utils.unwrapObservable(mappedRootObject), keyCallback).sort();
			var newArrayKeys = filterArrayByKey(rootObject, keyCallback);
			if (hasKeyCallback) newArrayKeys.sort();
			var editScript = ko.utils.compareArrays(currentArrayKeys, newArrayKeys);

			var ignoreIndexOf = {};
			
			var i, j;

			var unwrappedRootObject = ko.utils.unwrapObservable(rootObject);
			var itemsByKey = {};
			var optimizedKeys = true;
			for (i = 0, j = unwrappedRootObject.length; i < j; i++) {
				var key = keyCallback(unwrappedRootObject[i]);
				if (key === undefined || key instanceof Object) {
					optimizedKeys = false;
					break;
				}
				itemsByKey[key] = unwrappedRootObject[i];
			}

			var newContents = [];
			var passedOver = 0;
			for (i = 0, j = editScript.length; i < j; i++) {
				var key = editScript[i];
				var mappedItem;
				var fullPropertyName = parentPropertyName + "[" + i + "]";
				switch (key.status) {
				case "added":
					var item = optimizedKeys ? itemsByKey[key.value] : getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
					mappedItem = updateViewModel(undefined, item, options, parentName, mappedRootObject, fullPropertyName, parent);
					if(!hasCreateCallback()) {
						mappedItem = ko.utils.unwrapObservable(mappedItem);
					}

					var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
					
					if (mappedItem === emptyReturn) {
						passedOver++;
					} else {
						newContents[index - passedOver] = mappedItem;
					}
						
					ignoreIndexOf[index] = true;
					break;
				case "retained":
					var item = optimizedKeys ? itemsByKey[key.value] : getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
					mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
					updateViewModel(mappedItem, item, options, parentName, mappedRootObject, fullPropertyName, parent);

					var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
					newContents[index] = mappedItem;
					ignoreIndexOf[index] = true;
					break;
				case "deleted":
					mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
					break;
				}

				changes.push({
					event: key.status,
					item: mappedItem
				});
			}

			mappedRootObject(newContents);

			if (options[parentName] && options[parentName].arrayChanged) {
				ko.utils.arrayForEach(changes, function (change) {
					options[parentName].arrayChanged(change.event, change.item);
				});
			}
		}

		return mappedRootObject;
	}

	function ignorableIndexOf(array, item, ignoreIndices) {
		for (var i = 0, j = array.length; i < j; i++) {
			if (ignoreIndices[i] === true) continue;
			if (array[i] === item) return i;
		}
		return null;
	}

	function mapKey(item, callback) {
		var mappedItem;
		if (callback) mappedItem = callback(item);
		if (exports.getType(mappedItem) === "undefined") mappedItem = item;

		return ko.utils.unwrapObservable(mappedItem);
	}

	function getItemByKey(array, key, callback) {
		array = ko.utils.unwrapObservable(array);
		for (var i = 0, j = array.length; i < j; i++) {
			var item = array[i];
			if (mapKey(item, callback) === key) return item;
		}

		throw new Error("When calling ko.update*, the key '" + key + "' was not found!");
	}

	function filterArrayByKey(array, callback) {
		return ko.utils.arrayMap(ko.utils.unwrapObservable(array), function (item) {
			if (callback) {
				return mapKey(item, callback);
			} else {
				return item;
			}
		});
	}

	function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
		if (exports.getType(rootObject) === "array") {
			for (var i = 0; i < rootObject.length; i++)
			visitorCallback(i);
		} else {
			for (var propertyName in rootObject)
			visitorCallback(propertyName);
		}
	};

	function canHaveProperties(object) {
		var type = exports.getType(object);
		return ((type === "object") || (type === "array")) && (object !== null);
	}

	// Based on the parentName, this creates a fully classified name of a property

	function getPropertyName(parentName, parent, indexer) {
		var propertyName = parentName || "";
		if (exports.getType(parent) === "array") {
			if (parentName) {
				propertyName += "[" + indexer + "]";
			}
		} else {
			if (parentName) {
				propertyName += ".";
			}
			propertyName += indexer;
		}
		return propertyName;
	}

	exports.visitModel = function (rootObject, callback, options) {
		options = options || {};
		options.visitedObjects = options.visitedObjects || new objectLookup();

		var mappedRootObject;
		var unwrappedRootObject = ko.utils.unwrapObservable(rootObject);

		if (!canHaveProperties(unwrappedRootObject)) {
			return callback(rootObject, options.parentName);
		} else {
			options = fillOptions(options, unwrappedRootObject[mappingProperty]);

			// Only do a callback, but ignore the results
			callback(rootObject, options.parentName);
			mappedRootObject = exports.getType(unwrappedRootObject) === "array" ? [] : {};
		}

		options.visitedObjects.save(rootObject, mappedRootObject);

		var parentName = options.parentName;
		visitPropertiesOrArrayEntries(unwrappedRootObject, function (indexer) {
			if (options.ignore && ko.utils.arrayIndexOf(options.ignore, indexer) != -1) return;

			var propertyValue = unwrappedRootObject[indexer];
			options.parentName = getPropertyName(parentName, unwrappedRootObject, indexer);

			// If we don't want to explicitly copy the unmapped property...
			if (ko.utils.arrayIndexOf(options.copy, indexer) === -1) {
				// ...find out if it's a property we want to explicitly include
				if (ko.utils.arrayIndexOf(options.include, indexer) === -1) {
					// The mapped properties object contains all the properties that were part of the original object.
					// If a property does not exist, and it is not because it is part of an array (e.g. "myProp[3]"), then it should not be unmapped.
				    if (unwrappedRootObject[mappingProperty]
				        && unwrappedRootObject[mappingProperty].mappedProperties && !unwrappedRootObject[mappingProperty].mappedProperties[indexer]
				        && unwrappedRootObject[mappingProperty].copiedProperties && !unwrappedRootObject[mappingProperty].copiedProperties[indexer]
				        && !(exports.getType(unwrappedRootObject) === "array")) {
						return;
					}
				}
			}

			var outputProperty;
			switch (exports.getType(ko.utils.unwrapObservable(propertyValue))) {
			case "object":
			case "array":
			case "undefined":
				var previouslyMappedValue = options.visitedObjects.get(propertyValue);
				mappedRootObject[indexer] = (exports.getType(previouslyMappedValue) !== "undefined") ? previouslyMappedValue : exports.visitModel(propertyValue, callback, options);
				break;
			default:
				mappedRootObject[indexer] = callback(propertyValue, options.parentName);
			}
		});

		return mappedRootObject;
	}

	function simpleObjectLookup() {
		var keys = [];
		var values = [];
		this.save = function (key, value) {
			var existingIndex = ko.utils.arrayIndexOf(keys, key);
			if (existingIndex >= 0) values[existingIndex] = value;
			else {
				keys.push(key);
				values.push(value);
			}
		};
		this.get = function (key) {
			var existingIndex = ko.utils.arrayIndexOf(keys, key);
			var value = (existingIndex >= 0) ? values[existingIndex] : undefined;
			return value;
		};
	};
	
	function objectLookup() {
		var buckets = {};
		
		var findBucket = function(key) {
			var bucketKey;
			try {
				bucketKey = key;//JSON.stringify(key);
			}
			catch (e) {
				bucketKey = "$$$";
			}

			var bucket = buckets[bucketKey];
			if (bucket === undefined) {
				bucket = new simpleObjectLookup();
				buckets[bucketKey] = bucket;
			}
			return bucket;
		};
		
		this.save = function (key, value) {
			findBucket(key).save(key, value);
		};
		this.get = function (key) {
			return findBucket(key).get(key);
		};
	};
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],45:[function(require,module,exports){
(function (global){
// Knockout Fast Mapping v0.1
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function (factory) {
	// Module systems magic dance.

	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory((typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null), exports);
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout", "exports"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `wrap` property
		factory(ko, ko.wrap = {});
	}
}(function (ko, exports) {
    
    // this function mimics ko.mapping
    exports.fromJS = function(jsObject, computedFunctions)
    {
        reset();
	return wrap(jsObject, computedFunctions);
    }

    // this function unwraps the outer for assigning the result to an observable
    // see https://github.com/SteveSanderson/knockout/issues/517
    exports.updateFromJS = function(observable, jsObject, computedFunctions)
    {
        reset();
	return observable(ko.utils.unwrapObservable(wrap(jsObject, computedFunctions)));
    }

    exports.fromJSON = function (jsonString, computedFunctions) {
	var parsed = ko.utils.parseJson(jsonString);
	arguments[0] = parsed;
	return exports.fromJS.apply(this, computedFunctions);
    };
    
    exports.toJS = function (observable) {
	return unwrap(observable);
    }

    exports.toJSON = function (observable) {
	var plainJavaScriptObject = exports.toJS(observable);
	return ko.utils.stringifyJson(plainJavaScriptObject);
    };

    function typeOf(value) {
	var s = typeof value;
	if (s === 'object') {
            if (value) {
                if (value.constructor == Date)
                    s = 'date';
		else if (Object.prototype.toString.call(value) == '[object Array]')
                    s = 'array';
            } else {
		s = 'null';
            }
	}
	return s;
    }

    // unwrapping
    function unwrapObject(o)
    {
	var t = {};

	for (var k in o)
	{
	    var v = o[k];

	    if (ko.isComputed(v))
		continue;

	    t[k] = unwrap(v);
	}

	return t;
    }

    function unwrapArray(a)
    {
	var r = [];

	if (!a || a.length == 0)
	    return r;
	
	for (var i = 0, l = a.length; i < l; ++i)
	    r.push(unwrap(a[i]));

	return r;
    }

    function unwrap(v)
    {
	var isObservable = ko.isObservable(v);

	if (isObservable)
	{
	    var val = v();

	    return unwrap(val);
	}
	else
	{
	    if (typeOf(v) == "array")
	    {
		return unwrapArray(v);
	    }
	    else if (typeOf(v) == "object")
	    {
		return unwrapObject(v);
	    }
	    else
	    {
		return v;
	    }
	}
    }

    function reset()
    {
        parents = [{obj: null, wrapped: null, lvl: ""}];
    }    
    
    // wrapping

    function wrapObject(o, computedFunctions)
    {
        // check for infinite recursion
        for (var i = 0; i < parents.length; ++i) {
            if (parents[i].obj === o) {
                return parents[i].wrapped;
            }
        }

	var t = {};

	for (var k in o)
	{
	    var v = o[k];

            parents.push({obj: o, wrapped: t, lvl: currentLvl() + "/" + k});

	    t[k] = wrap(v, computedFunctions);

            parents.pop();
	}

	if (computedFunctions && computedFunctions[currentLvl()])
	    t = computedFunctions[currentLvl()](t);

        if (hasES5Plugin())
            ko.track(t);

	return t;
    }

    function wrapArray(a, computedFunctions)
    {
	var r = ko.observableArray();

	if (!a || a.length == 0)
	    return r;

	for (var i = 0, l = a.length; i < l; ++i)
	    r.push(wrap(a[i], computedFunctions));

	return r;
    }

    // a stack, used for two purposes:
    //  - circular reference checking
    //  - computed functions
    var parents;

    function currentLvl()
    {
	return parents[parents.length-1].lvl;
    }

    function wrap(v, computedFunctions)
    {
	if (typeOf(v) == "array")
	{
	    return wrapArray(v, computedFunctions);
	}
	else if (typeOf(v) == "object")
	{
	    return wrapObject(v, computedFunctions);
	}
	else
	{
            if (!hasES5Plugin() && typeof v !== 'function')
            {
	        var t = ko.observable();
	        t(v);
	        return t;
            } else
                return v;
	}
    }

    function hasES5Plugin()
    {
        return ko.track != null;
    }
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],46:[function(require,module,exports){
/*!
 * jQuery UI :data 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :data Selector
//>>group: Core
//>>description: Selects elements which have data stored under the specified key.
//>>docs: http://api.jqueryui.com/data-selector/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo( function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		} ) :

		// Support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		}
} );
} ) );

},{}],47:[function(require,module,exports){
/*!
 * jQuery UI Disable Selection 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: disableSelection
//>>group: Core
//>>description: Disable selection of text content within the set of matched elements.
//>>docs: http://api.jqueryui.com/disableSelection/

// This file is deprecated
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

return $.fn.extend( {
	disableSelection: ( function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.on( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			} );
		};
	} )(),

	enableSelection: function() {
		return this.off( ".ui-disableSelection" );
	}
} );

} ) );

},{}],48:[function(require,module,exports){
/*!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

// Selectors
$.ui.focusable = function( element, hasTabindex ) {
	var map, mapName, img, focusableIfVisible, fieldset,
		nodeName = element.nodeName.toLowerCase();

	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" );
		return img.length > 0 && img.is( ":visible" );
	}

	if ( /^(input|select|textarea|button|object)$/.test( nodeName ) ) {
		focusableIfVisible = !element.disabled;

		if ( focusableIfVisible ) {

			// Form controls within a disabled fieldset are disabled.
			// However, controls within the fieldset's legend do not get disabled.
			// Since controls generally aren't placed inside legends, we skip
			// this portion of the check.
			fieldset = $( element ).closest( "fieldset" )[ 0 ];
			if ( fieldset ) {
				focusableIfVisible = !fieldset.disabled;
			}
		}
	} else if ( "a" === nodeName ) {
		focusableIfVisible = element.href || hasTabindex;
	} else {
		focusableIfVisible = hasTabindex;
	}

	return focusableIfVisible && $( element ).is( ":visible" ) && visible( $( element ) );
};

// Support: IE 8 only
// IE 8 doesn't resolve inherit to visible/hidden for computed values
function visible( element ) {
	var visibility = element.css( "visibility" );
	while ( visibility === "inherit" ) {
		element = element.parent();
		visibility = element.css( "visibility" );
	}
	return visibility !== "hidden";
}

$.extend( $.expr[ ":" ], {
	focusable: function( element ) {
		return $.ui.focusable( element, $.attr( element, "tabindex" ) != null );
	}
} );

return $.ui.focusable;

} ) );

},{}],49:[function(require,module,exports){
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

// This file is deprecated
return $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );
} ) );

},{}],50:[function(require,module,exports){
/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
};

} ) );

},{}],51:[function(require,module,exports){
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
return $.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode ||
				instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

} ) );

},{}],52:[function(require,module,exports){
/*!
 * jQuery UI Position 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

//>>label: Position
//>>group: Core
//>>description: Positions elements relative to other elements.
//>>docs: http://api.jqueryui.com/position/
//>>demos: http://jqueryui.com/position/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {
( function() {
var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[ 0 ];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div " +
				"style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
				"<div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[ 0 ];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[ 0 ].clientWidth;
		}

		div.remove();

		return ( cachedScrollbarWidth = w1 - w2 );
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[ 0 ].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[ 0 ].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[ 0 ] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9,
			hasOffset = !isWindow && !isDocument;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: hasOffset ? $( element ).offset() : { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: withinElement.outerWidth(),
			height: withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// Make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[ 0 ].preventDefault ) {

		// Force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;

	// Clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// Force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1 ) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// Calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// Reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	} );

	// Normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each( function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) +
				scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) +
				scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				} );
			}
		} );

		if ( options.using ) {

			// Adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	} );
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// Element is wider than within
			if ( data.collisionWidth > outerWidth ) {

				// Element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
						withinOffset;
					position.left += overLeft - newOverRight;

				// Element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;

				// Element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}

			// Too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;

			// Too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;

			// Adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// Element is taller than within
			if ( data.collisionHeight > outerHeight ) {

				// Element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
						withinOffset;
					position.top += overTop - newOverBottom;

				// Element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;

				// Element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}

			// Too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;

			// Too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;

			// Adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
					outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
					atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
					outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
					offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

} )();

return $.ui.position;

} ) );

},{}],53:[function(require,module,exports){
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.ui.safeActiveElement = function( document ) {
	var activeElement;

	// Support: IE 9 only
	// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
	try {
		activeElement = document.activeElement;
	} catch ( error ) {
		activeElement = document.body;
	}

	// Support: IE 9 - 11 only
	// IE may return null instead of an element
	// Interestingly, this only seems to occur when NOT in an iframe
	if ( !activeElement ) {
		activeElement = document.body;
	}

	// Support: IE 11 only
	// IE11 returns a seemingly empty object in some cases when accessing
	// document.activeElement from an <iframe>
	if ( !activeElement.nodeName ) {
		activeElement = document.body;
	}

	return activeElement;
};

} ) );

},{}],54:[function(require,module,exports){
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.ui.safeBlur = function( element ) {

	// Support: IE9 - 10 only
	// If the <body> is blurred, IE will switch windows, see #9420
	if ( element && element.nodeName.toLowerCase() !== "body" ) {
		$( element ).trigger( "blur" );
	}
};

} ) );

},{}],55:[function(require,module,exports){
/*!
 * jQuery UI Scroll Parent 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: scrollParent
//>>group: Core
//>>description: Get the closest ancestor element that is scrollable.
//>>docs: http://api.jqueryui.com/scrollParent/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

return $.fn.scrollParent = function( includeHidden ) {
	var position = this.css( "position" ),
		excludeStaticParent = position === "absolute",
		overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
		scrollParent = this.parents().filter( function() {
			var parent = $( this );
			if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
				return false;
			}
			return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
				parent.css( "overflow-x" ) );
		} ).eq( 0 );

	return position === "fixed" || !scrollParent.length ?
		$( this[ 0 ].ownerDocument || document ) :
		scrollParent;
};

} ) );

},{}],56:[function(require,module,exports){
/*!
 * jQuery UI Tabbable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :tabbable Selector
//>>group: Core
//>>description: Selects elements which can be tabbed to.
//>>docs: http://api.jqueryui.com/tabbable-selector/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version", "./focusable" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

return $.extend( $.expr[ ":" ], {
	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			hasTabindex = tabIndex != null;
		return ( !hasTabindex || tabIndex >= 0 ) && $.ui.focusable( element, hasTabindex );
	}
} );

} ) );

},{}],57:[function(require,module,exports){
/*!
 * jQuery UI Unique ID 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

return $.fn.extend( {
	uniqueId: ( function() {
		var uuid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			} );
		};
	} )(),

	removeUniqueId: function() {
		return this.each( function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		} );
	}
} );

} ) );

},{}],58:[function(require,module,exports){
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

$.ui = $.ui || {};

return $.ui.version = "1.12.1";

} ) );

},{}],59:[function(require,module,exports){
/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

return $.widget;

} ) );

},{}],60:[function(require,module,exports){
/*!
 * jQuery UI Autocomplete 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Autocomplete
//>>group: Widgets
//>>description: Lists suggested words as the user is typing.
//>>docs: http://api.jqueryui.com/autocomplete/
//>>demos: http://jqueryui.com/autocomplete/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/autocomplete.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./menu",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.autocomplete", {
	version: "1.12.1",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// Callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {

		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[ 0 ].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		// Textareas are always multi-line
		// Inputs are always single-line, even if inside a contentEditable element
		// IE also treats inputs as contentEditable
		// All other element types are determined by whether or not they're contentEditable
		this.isMultiLine = isTextarea || !isInput && this._isContentEditable( this.element );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this._addClass( "ui-autocomplete-input" );
		this.element.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:

					// when menu is open and has focus
					if ( this.menu.active ) {

						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						if ( !this.isMultiLine ) {
							this._value( this.term );
						}
						this.close( event );

						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;

					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// Replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		} );

		this._initSource();
		this.menu = $( "<ul>" )
			.appendTo( this._appendTo() )
			.menu( {

				// disable ARIA support, the live region takes care of that
				role: null
			} )
			.hide()
			.menu( "instance" );

		this._addClass( this.menu.element, "ui-autocomplete", "ui-front" );
		this._on( this.menu.element, {
			mousedown: function( event ) {

				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay( function() {
					delete this.cancelBlur;

					// Support: IE 8 only
					// Right clicking a menu item or selecting text from the menu items will
					// result in focus moving out of the input. However, we've already received
					// and ignored the blur event because of the cancelBlur flag set above. So
					// we restore focus to ensure that the menu closes properly based on the user's
					// next actions.
					if ( this.element[ 0 ] !== $.ui.safeActiveElement( this.document[ 0 ] ) ) {
						this.element.trigger( "focus" );
					}
				} );
			},
			menufocus: function( event, ui ) {
				var label, item;

				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						} );

						return;
					}
				}

				item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {

					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				}

				// Announce the value in the liveRegion
				label = ui.item.attr( "aria-label" ) || item.value;
				if ( label && $.trim( label ).length ) {
					this.liveRegion.children().hide();
					$( "<div>" ).text( label ).appendTo( this.liveRegion );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// Only trigger when focus was lost (click on menu)
				if ( this.element[ 0 ] !== $.ui.safeActiveElement( this.document[ 0 ] ) ) {
					this.element.trigger( "focus" );
					this.previous = previous;

					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay( function() {
						this.previous = previous;
						this.selectedItem = item;
					} );
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}

				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		} );

		this.liveRegion = $( "<div>", {
			role: "status",
			"aria-live": "assertive",
			"aria-relevant": "additions"
		} )
			.appendTo( this.document[ 0 ].body );

		this._addClass( this.liveRegion, null, "ui-helper-hidden-accessible" );

		// Turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		} );
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_isEventTargetInWidget: function( event ) {
		var menuElement = this.menu.element[ 0 ];

		return event.target === this.element[ 0 ] ||
			event.target === menuElement ||
			$.contains( menuElement, event.target );
	},

	_closeOnClickOutside: function( event ) {
		if ( !this._isEventTargetInWidget( event ) ) {
			this.close();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front, dialog" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax( {
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				} );
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay( function() {

			// Search if the value has changed, or if the user retypes the same value (see #7434)
			var equalValues = this.term === this._value(),
				menuVisible = this.menu.element.is( ":visible" ),
				modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

			if ( !equalValues || ( equalValues && !menuVisible && !modifierKey ) ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// Always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this._addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy( function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this._removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {

			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {

		// Remove the handler that closes the menu on outside clicks
		this._off( this.document, "mousedown" );

		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {

		// assume all items have the right format when the first item is complete
		if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend( {}, item, {
				label: item.label || item.value,
				value: item.value || item.label
			} );
		} );
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// Size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend( {
			of: this.element
		}, this.options.position ) );

		if ( this.options.autoFocus ) {
			this.menu.next();
		}

		// Listen for interactions outside of the widget (#6642)
		this._on( this.document, {
			mousedown: "_closeOnClickOutside"
		} );
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(

			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		} );
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<div>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {

			if ( !this.isMultiLine ) {
				this._value( this.term );
			}

			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// Prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	},

	// Support: Chrome <=50
	// We should be able to just use this.element.prop( "isContentEditable" )
	// but hidden elements always report false in Chrome.
	// https://code.google.com/p/chromium/issues/detail?id=313082
	_isContentEditable: function( element ) {
		if ( !element.length ) {
			return false;
		}

		var editable = element.prop( "contentEditable" );

		if ( editable === "inherit" ) {
		  return this._isContentEditable( element.parent() );
		}

		return editable === "true";
	}
} );

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
	},
	filter: function( array, term ) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
		return $.grep( array, function( value ) {
			return matcher.test( value.label || value.value || value );
		} );
	}
} );

// Live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.children().hide();
		$( "<div>" ).text( message ).appendTo( this.liveRegion );
	}
} );

return $.ui.autocomplete;

} ) );

},{}],61:[function(require,module,exports){
/*!
 * jQuery UI Button 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Button
//>>group: Widgets
//>>description: Enhances a form with themeable buttons.
//>>docs: http://api.jqueryui.com/button/
//>>demos: http://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",

			// These are only for backcompat
			// TODO: Remove after 1.12
			"./controlgroup",
			"./checkboxradio",

			"../keycode",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.button", {
	version: "1.12.1",
	defaultElement: "<button>",
	options: {
		classes: {
			"ui-button": "ui-corner-all"
		},
		disabled: null,
		icon: null,
		iconPosition: "beginning",
		label: null,
		showLabel: true
	},

	_getCreateOptions: function() {
		var disabled,

			// This is to support cases like in jQuery Mobile where the base widget does have
			// an implementation of _getCreateOptions
			options = this._super() || {};

		this.isInput = this.element.is( "input" );

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		this.originalLabel = this.isInput ? this.element.val() : this.element.html();
		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_create: function() {
		if ( !this.option.showLabel & !this.options.icon ) {
			this.options.showLabel = true;
		}

		// We have to check the option again here even though we did in _getCreateOptions,
		// because null may have been passed on init which would override what was set in
		// _getCreateOptions
		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled || false;
		}

		this.hasTitle = !!this.element.attr( "title" );

		// Check to see if the label needs to be set or if its already correct
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			if ( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}
		this._addClass( "ui-button", "ui-widget" );
		this._setOption( "disabled", this.options.disabled );
		this._enhance();

		if ( this.element.is( "a" ) ) {
			this._on( {
				"keyup": function( event ) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						event.preventDefault();

						// Support: PhantomJS <= 1.9, IE 8 Only
						// If a native click is available use it so we actually cause navigation
						// otherwise just trigger a click event
						if ( this.element[ 0 ].click ) {
							this.element[ 0 ].click();
						} else {
							this.element.trigger( "click" );
						}
					}
				}
			} );
		}
	},

	_enhance: function() {
		if ( !this.element.is( "button" ) ) {
			this.element.attr( "role", "button" );
		}

		if ( this.options.icon ) {
			this._updateIcon( "icon", this.options.icon );
			this._updateTooltip();
		}
	},

	_updateTooltip: function() {
		this.title = this.element.attr( "title" );

		if ( !this.options.showLabel && !this.title ) {
			this.element.attr( "title", this.options.label );
		}
	},

	_updateIcon: function( option, value ) {
		var icon = option !== "iconPosition",
			position = icon ? this.options.iconPosition : value,
			displayBlock = position === "top" || position === "bottom";

		// Create icon
		if ( !this.icon ) {
			this.icon = $( "<span>" );

			this._addClass( this.icon, "ui-button-icon", "ui-icon" );

			if ( !this.options.showLabel ) {
				this._addClass( "ui-button-icon-only" );
			}
		} else if ( icon ) {

			// If we are updating the icon remove the old icon class
			this._removeClass( this.icon, null, this.options.icon );
		}

		// If we are updating the icon add the new icon class
		if ( icon ) {
			this._addClass( this.icon, null, value );
		}

		this._attachIcon( position );

		// If the icon is on top or bottom we need to add the ui-widget-icon-block class and remove
		// the iconSpace if there is one.
		if ( displayBlock ) {
			this._addClass( this.icon, null, "ui-widget-icon-block" );
			if ( this.iconSpace ) {
				this.iconSpace.remove();
			}
		} else {

			// Position is beginning or end so remove the ui-widget-icon-block class and add the
			// space if it does not exist
			if ( !this.iconSpace ) {
				this.iconSpace = $( "<span> </span>" );
				this._addClass( this.iconSpace, "ui-button-icon-space" );
			}
			this._removeClass( this.icon, null, "ui-wiget-icon-block" );
			this._attachIconSpace( position );
		}
	},

	_destroy: function() {
		this.element.removeAttr( "role" );

		if ( this.icon ) {
			this.icon.remove();
		}
		if ( this.iconSpace ) {
			this.iconSpace.remove();
		}
		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_attachIconSpace: function( iconPosition ) {
		this.icon[ /^(?:end|bottom)/.test( iconPosition ) ? "before" : "after" ]( this.iconSpace );
	},

	_attachIcon: function( iconPosition ) {
		this.element[ /^(?:end|bottom)/.test( iconPosition ) ? "append" : "prepend" ]( this.icon );
	},

	_setOptions: function( options ) {
		var newShowLabel = options.showLabel === undefined ?
				this.options.showLabel :
				options.showLabel,
			newIcon = options.icon === undefined ? this.options.icon : options.icon;

		if ( !newShowLabel && !newIcon ) {
			options.showLabel = true;
		}
		this._super( options );
	},

	_setOption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value ) {
				this._updateIcon( key, value );
			} else if ( this.icon ) {
				this.icon.remove();
				if ( this.iconSpace ) {
					this.iconSpace.remove();
				}
			}
		}

		if ( key === "iconPosition" ) {
			this._updateIcon( key, value );
		}

		// Make sure we can't end up with a button that has neither text nor icon
		if ( key === "showLabel" ) {
				this._toggleClass( "ui-button-icon-only", null, !value );
				this._updateTooltip();
		}

		if ( key === "label" ) {
			if ( this.isInput ) {
				this.element.val( value );
			} else {

				// If there is an icon, append it, else nothing then append the value
				// this avoids removal of the icon when setting label text
				this.element.html( value );
				if ( this.icon ) {
					this._attachIcon( this.options.iconPosition );
					this._attachIconSpace( this.options.iconPosition );
				}
			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this._toggleClass( null, "ui-state-disabled", value );
			this.element[ 0 ].disabled = value;
			if ( value ) {
				this.element.blur();
			}
		}
	},

	refresh: function() {

		// Make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isDisabled = this.element.is( "input, button" ) ?
			this.element[ 0 ].disabled : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { disabled: isDisabled } );
		}

		this._updateTooltip();
	}
} );

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// Text and Icons options
	$.widget( "ui.button", $.ui.button, {
		options: {
			text: true,
			icons: {
				primary: null,
				secondary: null
			}
		},

		_create: function() {
			if ( this.options.showLabel && !this.options.text ) {
				this.options.showLabel = this.options.text;
			}
			if ( !this.options.showLabel && this.options.text ) {
				this.options.text = this.options.showLabel;
			}
			if ( !this.options.icon && ( this.options.icons.primary ||
					this.options.icons.secondary ) ) {
				if ( this.options.icons.primary ) {
					this.options.icon = this.options.icons.primary;
				} else {
					this.options.icon = this.options.icons.secondary;
					this.options.iconPosition = "end";
				}
			} else if ( this.options.icon ) {
				this.options.icons.primary = this.options.icon;
			}
			this._super();
		},

		_setOption: function( key, value ) {
			if ( key === "text" ) {
				this._super( "showLabel", value );
				return;
			}
			if ( key === "showLabel" ) {
				this.options.text = value;
			}
			if ( key === "icon" ) {
				this.options.icons.primary = value;
			}
			if ( key === "icons" ) {
				if ( value.primary ) {
					this._super( "icon", value.primary );
					this._super( "iconPosition", "beginning" );
				} else if ( value.secondary ) {
					this._super( "icon", value.secondary );
					this._super( "iconPosition", "end" );
				}
			}
			this._superApply( arguments );
		}
	} );

	$.fn.button = ( function( orig ) {
		return function() {
			if ( !this.length || ( this.length && this[ 0 ].tagName !== "INPUT" ) ||
					( this.length && this[ 0 ].tagName === "INPUT" && (
						this.attr( "type" ) !== "checkbox" && this.attr( "type" ) !== "radio"
					) ) ) {
				return orig.apply( this, arguments );
			}
			if ( !$.ui.checkboxradio ) {
				$.error( "Checkboxradio widget missing" );
			}
			if ( arguments.length === 0 ) {
				return this.checkboxradio( {
					"icon": false
				} );
			}
			return this.checkboxradio.apply( this, arguments );
		};
	} )( $.fn.button );

	$.fn.buttonset = function() {
		if ( !$.ui.controlgroup ) {
			$.error( "Controlgroup widget missing" );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" && arguments[ 2 ] ) {
			return this.controlgroup.apply( this,
				[ arguments[ 0 ], "items.button", arguments[ 2 ] ] );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" ) {
			return this.controlgroup.apply( this, [ arguments[ 0 ], "items.button" ] );
		}
		if ( typeof arguments[ 0 ] === "object" && arguments[ 0 ].items ) {
			arguments[ 0 ].items = {
				button: arguments[ 0 ].items
			};
		}
		return this.controlgroup.apply( this, arguments );
	};
}

return $.ui.button;

} ) );

},{}],62:[function(require,module,exports){
/*!
 * jQuery UI Dialog 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Dialog
//>>group: Widgets
//>>description: Displays customizable dialog windows.
//>>docs: http://api.jqueryui.com/dialog/
//>>demos: http://jqueryui.com/dialog/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/dialog.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./button",
			"./draggable",
			"./mouse",
			"./resizable",
			"../focusable",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../safe-blur",
			"../tabbable",
			"../unique-id",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.dialog", {
	version: "1.12.1",
	options: {
		appendTo: "body",
		autoOpen: true,
		buttons: [],
		classes: {
			"ui-dialog": "ui-corner-all",
			"ui-dialog-titlebar": "ui-corner-all"
		},
		closeOnEscape: true,
		closeText: "Close",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: null,
		maxWidth: null,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",

			// Ensure the titlebar is always visible
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// Callbacks
		beforeClose: null,
		close: null,
		drag: null,
		dragStart: null,
		dragStop: null,
		focus: null,
		open: null,
		resize: null,
		resizeStart: null,
		resizeStop: null
	},

	sizeRelatedOptions: {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},

	resizableRelatedOptions: {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},

	_create: function() {
		this.originalCss = {
			display: this.element[ 0 ].style.display,
			width: this.element[ 0 ].style.width,
			minHeight: this.element[ 0 ].style.minHeight,
			maxHeight: this.element[ 0 ].style.maxHeight,
			height: this.element[ 0 ].style.height
		};
		this.originalPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.originalTitle = this.element.attr( "title" );
		if ( this.options.title == null && this.originalTitle != null ) {
			this.options.title = this.originalTitle;
		}

		// Dialogs can't be disabled
		if ( this.options.disabled ) {
			this.options.disabled = false;
		}

		this._createWrapper();

		this.element
			.show()
			.removeAttr( "title" )
			.appendTo( this.uiDialog );

		this._addClass( "ui-dialog-content", "ui-widget-content" );

		this._createTitlebar();
		this._createButtonPane();

		if ( this.options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( this.options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._isOpen = false;

		this._trackFocus();
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;
		if ( element && ( element.jquery || element.nodeType ) ) {
			return $( element );
		}
		return this.document.find( element || "body" ).eq( 0 );
	},

	_destroy: function() {
		var next,
			originalPosition = this.originalPosition;

		this._untrackInstance();
		this._destroyOverlay();

		this.element
			.removeUniqueId()
			.css( this.originalCss )

			// Without detaching first, the following becomes really slow
			.detach();

		this.uiDialog.remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = originalPosition.parent.children().eq( originalPosition.index );

		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			originalPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	disable: $.noop,
	enable: $.noop,

	close: function( event ) {
		var that = this;

		if ( !this._isOpen || this._trigger( "beforeClose", event ) === false ) {
			return;
		}

		this._isOpen = false;
		this._focusedElement = null;
		this._destroyOverlay();
		this._untrackInstance();

		if ( !this.opener.filter( ":focusable" ).trigger( "focus" ).length ) {

			// Hiding a focused element doesn't trigger blur in WebKit
			// so in case we have nothing to focus on, explicitly blur the active element
			// https://bugs.webkit.org/show_bug.cgi?id=47182
			$.ui.safeBlur( $.ui.safeActiveElement( this.document[ 0 ] ) );
		}

		this._hide( this.uiDialog, this.options.hide, function() {
			that._trigger( "close", event );
		} );
	},

	isOpen: function() {
		return this._isOpen;
	},

	moveToTop: function() {
		this._moveToTop();
	},

	_moveToTop: function( event, silent ) {
		var moved = false,
			zIndices = this.uiDialog.siblings( ".ui-front:visible" ).map( function() {
				return +$( this ).css( "z-index" );
			} ).get(),
			zIndexMax = Math.max.apply( null, zIndices );

		if ( zIndexMax >= +this.uiDialog.css( "z-index" ) ) {
			this.uiDialog.css( "z-index", zIndexMax + 1 );
			moved = true;
		}

		if ( moved && !silent ) {
			this._trigger( "focus", event );
		}
		return moved;
	},

	open: function() {
		var that = this;
		if ( this._isOpen ) {
			if ( this._moveToTop() ) {
				this._focusTabbable();
			}
			return;
		}

		this._isOpen = true;
		this.opener = $( $.ui.safeActiveElement( this.document[ 0 ] ) );

		this._size();
		this._position();
		this._createOverlay();
		this._moveToTop( null, true );

		// Ensure the overlay is moved to the top with the dialog, but only when
		// opening. The overlay shouldn't move after the dialog is open so that
		// modeless dialogs opened after the modal dialog stack properly.
		if ( this.overlay ) {
			this.overlay.css( "z-index", this.uiDialog.css( "z-index" ) - 1 );
		}

		this._show( this.uiDialog, this.options.show, function() {
			that._focusTabbable();
			that._trigger( "focus" );
		} );

		// Track the dialog immediately upon openening in case a focus event
		// somehow occurs outside of the dialog before an element inside the
		// dialog is focused (#10152)
		this._makeFocusTarget();

		this._trigger( "open" );
	},

	_focusTabbable: function() {

		// Set focus to the first match:
		// 1. An element that was focused previously
		// 2. First element inside the dialog matching [autofocus]
		// 3. Tabbable element inside the content element
		// 4. Tabbable element inside the buttonpane
		// 5. The close button
		// 6. The dialog itself
		var hasFocus = this._focusedElement;
		if ( !hasFocus ) {
			hasFocus = this.element.find( "[autofocus]" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.element.find( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogTitlebarClose.filter( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialog;
		}
		hasFocus.eq( 0 ).trigger( "focus" );
	},

	_keepFocus: function( event ) {
		function checkFocus() {
			var activeElement = $.ui.safeActiveElement( this.document[ 0 ] ),
				isActive = this.uiDialog[ 0 ] === activeElement ||
					$.contains( this.uiDialog[ 0 ], activeElement );
			if ( !isActive ) {
				this._focusTabbable();
			}
		}
		event.preventDefault();
		checkFocus.call( this );

		// support: IE
		// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
		// so we check again later
		this._delay( checkFocus );
	},

	_createWrapper: function() {
		this.uiDialog = $( "<div>" )
			.hide()
			.attr( {

				// Setting tabIndex makes the div focusable
				tabIndex: -1,
				role: "dialog"
			} )
			.appendTo( this._appendTo() );

		this._addClass( this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front" );
		this._on( this.uiDialog, {
			keydown: function( event ) {
				if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE ) {
					event.preventDefault();
					this.close( event );
					return;
				}

				// Prevent tabbing out of dialogs
				if ( event.keyCode !== $.ui.keyCode.TAB || event.isDefaultPrevented() ) {
					return;
				}
				var tabbables = this.uiDialog.find( ":tabbable" ),
					first = tabbables.filter( ":first" ),
					last = tabbables.filter( ":last" );

				if ( ( event.target === last[ 0 ] || event.target === this.uiDialog[ 0 ] ) &&
						!event.shiftKey ) {
					this._delay( function() {
						first.trigger( "focus" );
					} );
					event.preventDefault();
				} else if ( ( event.target === first[ 0 ] ||
						event.target === this.uiDialog[ 0 ] ) && event.shiftKey ) {
					this._delay( function() {
						last.trigger( "focus" );
					} );
					event.preventDefault();
				}
			},
			mousedown: function( event ) {
				if ( this._moveToTop( event ) ) {
					this._focusTabbable();
				}
			}
		} );

		// We assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if ( !this.element.find( "[aria-describedby]" ).length ) {
			this.uiDialog.attr( {
				"aria-describedby": this.element.uniqueId().attr( "id" )
			} );
		}
	},

	_createTitlebar: function() {
		var uiDialogTitle;

		this.uiDialogTitlebar = $( "<div>" );
		this._addClass( this.uiDialogTitlebar,
			"ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix" );
		this._on( this.uiDialogTitlebar, {
			mousedown: function( event ) {

				// Don't prevent click on close button (#8838)
				// Focusing a dialog that is partially scrolled out of view
				// causes the browser to scroll it into view, preventing the click event
				if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {

					// Dialog isn't getting focus when dragging (#8063)
					this.uiDialog.trigger( "focus" );
				}
			}
		} );

		// Support: IE
		// Use type="button" to prevent enter keypresses in textboxes from closing the
		// dialog in IE (#9312)
		this.uiDialogTitlebarClose = $( "<button type='button'></button>" )
			.button( {
				label: $( "<a>" ).text( this.options.closeText ).html(),
				icon: "ui-icon-closethick",
				showLabel: false
			} )
			.appendTo( this.uiDialogTitlebar );

		this._addClass( this.uiDialogTitlebarClose, "ui-dialog-titlebar-close" );
		this._on( this.uiDialogTitlebarClose, {
			click: function( event ) {
				event.preventDefault();
				this.close( event );
			}
		} );

		uiDialogTitle = $( "<span>" ).uniqueId().prependTo( this.uiDialogTitlebar );
		this._addClass( uiDialogTitle, "ui-dialog-title" );
		this._title( uiDialogTitle );

		this.uiDialogTitlebar.prependTo( this.uiDialog );

		this.uiDialog.attr( {
			"aria-labelledby": uiDialogTitle.attr( "id" )
		} );
	},

	_title: function( title ) {
		if ( this.options.title ) {
			title.text( this.options.title );
		} else {
			title.html( "&#160;" );
		}
	},

	_createButtonPane: function() {
		this.uiDialogButtonPane = $( "<div>" );
		this._addClass( this.uiDialogButtonPane, "ui-dialog-buttonpane",
			"ui-widget-content ui-helper-clearfix" );

		this.uiButtonSet = $( "<div>" )
			.appendTo( this.uiDialogButtonPane );
		this._addClass( this.uiButtonSet, "ui-dialog-buttonset" );

		this._createButtons();
	},

	_createButtons: function() {
		var that = this,
			buttons = this.options.buttons;

		// If we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( $.isEmptyObject( buttons ) || ( $.isArray( buttons ) && !buttons.length ) ) {
			this._removeClass( this.uiDialog, "ui-dialog-buttons" );
			return;
		}

		$.each( buttons, function( name, props ) {
			var click, buttonOptions;
			props = $.isFunction( props ) ?
				{ click: props, text: name } :
				props;

			// Default to a non-submitting button
			props = $.extend( { type: "button" }, props );

			// Change the context for the click callback to be the main element
			click = props.click;
			buttonOptions = {
				icon: props.icon,
				iconPosition: props.iconPosition,
				showLabel: props.showLabel,

				// Deprecated options
				icons: props.icons,
				text: props.text
			};

			delete props.click;
			delete props.icon;
			delete props.iconPosition;
			delete props.showLabel;

			// Deprecated options
			delete props.icons;
			if ( typeof props.text === "boolean" ) {
				delete props.text;
			}

			$( "<button></button>", props )
				.button( buttonOptions )
				.appendTo( that.uiButtonSet )
				.on( "click", function() {
					click.apply( that.element[ 0 ], arguments );
				} );
		} );
		this._addClass( this.uiDialog, "ui-dialog-buttons" );
		this.uiDialogButtonPane.appendTo( this.uiDialog );
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable( {
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				that._addClass( $( this ), "ui-dialog-dragging" );
				that._blockFrames();
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				var left = ui.offset.left - that.document.scrollLeft(),
					top = ui.offset.top - that.document.scrollTop();

				options.position = {
					my: "left top",
					at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
						"top" + ( top >= 0 ? "+" : "" ) + top,
					of: that.window
				};
				that._removeClass( $( this ), "ui-dialog-dragging" );
				that._unblockFrames();
				that._trigger( "dragStop", event, filteredUi( ui ) );
			}
		} );
	},

	_makeResizable: function() {
		var that = this,
			options = this.options,
			handles = options.resizable,

			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
			resizeHandles = typeof handles === "string" ?
				handles :
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable( {
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				that._addClass( $( this ), "ui-dialog-resizing" );
				that._blockFrames();
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				var offset = that.uiDialog.offset(),
					left = offset.left - that.document.scrollLeft(),
					top = offset.top - that.document.scrollTop();

				options.height = that.uiDialog.height();
				options.width = that.uiDialog.width();
				options.position = {
					my: "left top",
					at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
						"top" + ( top >= 0 ? "+" : "" ) + top,
					of: that.window
				};
				that._removeClass( $( this ), "ui-dialog-resizing" );
				that._unblockFrames();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
			}
		} )
			.css( "position", position );
	},

	_trackFocus: function() {
		this._on( this.widget(), {
			focusin: function( event ) {
				this._makeFocusTarget();
				this._focusedElement = $( event.target );
			}
		} );
	},

	_makeFocusTarget: function() {
		this._untrackInstance();
		this._trackingInstances().unshift( this );
	},

	_untrackInstance: function() {
		var instances = this._trackingInstances(),
			exists = $.inArray( this, instances );
		if ( exists !== -1 ) {
			instances.splice( exists, 1 );
		}
	},

	_trackingInstances: function() {
		var instances = this.document.data( "ui-dialog-instances" );
		if ( !instances ) {
			instances = [];
			this.document.data( "ui-dialog-instances", instances );
		}
		return instances;
	},

	_minHeight: function() {
		var options = this.options;

		return options.height === "auto" ?
			options.minHeight :
			Math.min( options.minHeight, options.height );
	},

	_position: function() {

		// Need to show the dialog to get the actual offset in the position plugin
		var isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( this.options.position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resize = false,
			resizableOptions = {};

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in that.sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in that.resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		} );

		if ( resize ) {
			this._size();
			this._position();
		}
		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		if ( key === "disabled" ) {
			return;
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.uiDialog.appendTo( this._appendTo() );
		}

		if ( key === "buttons" ) {
			this._createButtons();
		}

		if ( key === "closeText" ) {
			this.uiDialogTitlebarClose.button( {

				// Ensure that we always pass a string
				label: $( "<a>" ).text( "" + this.options.closeText ).html()
			} );
		}

		if ( key === "draggable" ) {
			isDraggable = uiDialog.is( ":data(ui-draggable)" );
			if ( isDraggable && !value ) {
				uiDialog.draggable( "destroy" );
			}

			if ( !isDraggable && value ) {
				this._makeDraggable();
			}
		}

		if ( key === "position" ) {
			this._position();
		}

		if ( key === "resizable" ) {

			// currently resizable, becoming non-resizable
			isResizable = uiDialog.is( ":data(ui-resizable)" );
			if ( isResizable && !value ) {
				uiDialog.resizable( "destroy" );
			}

			// Currently resizable, changing handles
			if ( isResizable && typeof value === "string" ) {
				uiDialog.resizable( "option", "handles", value );
			}

			// Currently non-resizable, becoming resizable
			if ( !isResizable && value !== false ) {
				this._makeResizable();
			}
		}

		if ( key === "title" ) {
			this._title( this.uiDialogTitlebar.find( ".ui-dialog-title" ) );
		}
	},

	_size: function() {

		// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var nonContentHeight, minContentHeight, maxContentHeight,
			options = this.options;

		// Reset content sizing
		this.element.show().css( {
			width: "auto",
			minHeight: 0,
			maxHeight: "none",
			height: 0
		} );

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// Reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css( {
			height: "auto",
			width: options.width
		} )
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		maxContentHeight = typeof options.maxHeight === "number" ?
			Math.max( 0, options.maxHeight - nonContentHeight ) :
			"none";

		if ( options.height === "auto" ) {
			this.element.css( {
				minHeight: minContentHeight,
				maxHeight: maxContentHeight,
				height: "auto"
			} );
		} else {
			this.element.height( Math.max( 0, options.height - nonContentHeight ) );
		}

		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	},

	_blockFrames: function() {
		this.iframeBlocks = this.document.find( "iframe" ).map( function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( {
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight()
				} )
				.appendTo( iframe.parent() )
				.offset( iframe.offset() )[ 0 ];
		} );
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_allowInteraction: function( event ) {
		if ( $( event.target ).closest( ".ui-dialog" ).length ) {
			return true;
		}

		// TODO: Remove hack when datepicker implements
		// the .ui-front logic (#8989)
		return !!$( event.target ).closest( ".ui-datepicker" ).length;
	},

	_createOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		// We use a delay in case the overlay is created from an
		// event that we're going to be cancelling (#2804)
		var isOpening = true;
		this._delay( function() {
			isOpening = false;
		} );

		if ( !this.document.data( "ui-dialog-overlays" ) ) {

			// Prevent use of anchors and inputs
			// Using _on() for an event handler shared across many instances is
			// safe because the dialogs stack and must be closed in reverse order
			this._on( this.document, {
				focusin: function( event ) {
					if ( isOpening ) {
						return;
					}

					if ( !this._allowInteraction( event ) ) {
						event.preventDefault();
						this._trackingInstances()[ 0 ]._focusTabbable();
					}
				}
			} );
		}

		this.overlay = $( "<div>" )
			.appendTo( this._appendTo() );

		this._addClass( this.overlay, null, "ui-widget-overlay ui-front" );
		this._on( this.overlay, {
			mousedown: "_keepFocus"
		} );
		this.document.data( "ui-dialog-overlays",
			( this.document.data( "ui-dialog-overlays" ) || 0 ) + 1 );
	},

	_destroyOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		if ( this.overlay ) {
			var overlays = this.document.data( "ui-dialog-overlays" ) - 1;

			if ( !overlays ) {
				this._off( this.document, "focusin" );
				this.document.removeData( "ui-dialog-overlays" );
			} else {
				this.document.data( "ui-dialog-overlays", overlays );
			}

			this.overlay.remove();
			this.overlay = null;
		}
	}
} );

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for dialogClass option
	$.widget( "ui.dialog", $.ui.dialog, {
		options: {
			dialogClass: ""
		},
		_createWrapper: function() {
			this._super();
			this.uiDialog.addClass( this.options.dialogClass );
		},
		_setOption: function( key, value ) {
			if ( key === "dialogClass" ) {
				this.uiDialog
					.removeClass( this.options.dialogClass )
					.addClass( value );
			}
			this._superApply( arguments );
		}
	} );
}

return $.ui.dialog;

} ) );

},{}],63:[function(require,module,exports){
/*!
 * jQuery UI Draggable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Draggable
//>>group: Interactions
//>>description: Enables dragging functionality for any element.
//>>docs: http://api.jqueryui.com/draggable/
//>>demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../data",
			"../plugin",
			"../safe-active-element",
			"../safe-blur",
			"../scroll-parent",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.draggable", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// Callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setPositionRelative();
		}
		if ( this.options.addClasses ) {
			this._addClass( "ui-draggable" );
		}
		this._setHandleClassName();

		this._mouseInit();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyOnClear = true;
			return;
		}
		this._removeHandleClassName();
		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var o = this.options;

		// Among others, prevent a drag on a resizable-handle
		if ( this.helper || o.disabled ||
				$( event.target ).closest( ".ui-resizable-handle" ).length > 0 ) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle( event );
		if ( !this.handle ) {
			return false;
		}

		this._blurActiveElement( event );

		this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map( function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		} );
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActiveElement: function( event ) {
		var activeElement = $.ui.safeActiveElement( this.document[ 0 ] ),
			target = $( event.target );

		// Don't blur if the event occurred on an element that is within
		// the currently focused element
		// See #10527, #12472
		if ( target.closest( activeElement ).length ) {
			return;
		}

		// Blur any element that currently has focus, see #4261
		$.ui.safeBlur( activeElement );
	},

	_mouseStart: function( event ) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper( event );

		this._addClass( this.helper, "ui-draggable-dragging" );

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent( true );
		this.offsetParent = this.helper.offsetParent();
		this.hasFixedAncestor = this.helper.parents().filter( function() {
				return $( this ).css( "position" ) === "fixed";
			} ).length > 0;

		//The element's absolute position on the page minus margins
		this.positionAbs = this.element.offset();
		this._refreshOffsets( event );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		( o.cursorAt && this._adjustOffsetFromHelper( o.cursorAt ) );

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if ( this._trigger( "start", event ) === false ) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ( $.ui.ddmanager && !o.dropBehaviour ) {
			$.ui.ddmanager.prepareOffsets( this, event );
		}

		// Execute the drag once - this causes the helper not to be visible before getting its
		// correct position
		this._mouseDrag( event, true );

		// If the ddmanager is used for droppables, inform the manager that dragging has started
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart( this, event );
		}

		return true;
	},

	_refreshOffsets: function( event ) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.margins.left,
			scroll: false,
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	},

	_mouseDrag: function( event, noPropagation ) {

		// reset any necessary cached properties (see #5009)
		if ( this.hasFixedAncestor ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition( event, true );
		this.positionAbs = this._convertPositionTo( "absolute" );

		//Call plugins and callbacks and use the resulting position if something is returned
		if ( !noPropagation ) {
			var ui = this._uiHash();
			if ( this._trigger( "drag", event, ui ) === false ) {
				this._mouseUp( new $.Event( "mouseup", event ) );
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.drag( this, event );
		}

		return false;
	},

	_mouseStop: function( event ) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ( $.ui.ddmanager && !this.options.dropBehaviour ) {
			dropped = $.ui.ddmanager.drop( this, event );
		}

		//if a drop comes from outside (a sortable)
		if ( this.dropped ) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ( ( this.options.revert === "invalid" && !dropped ) ||
				( this.options.revert === "valid" && dropped ) ||
				this.options.revert === true || ( $.isFunction( this.options.revert ) &&
				this.options.revert.call( this.element, dropped ) )
		) {
			$( this.helper ).animate(
				this.originalPosition,
				parseInt( this.options.revertDuration, 10 ),
				function() {
					if ( that._trigger( "stop", event ) !== false ) {
						that._clear();
					}
				}
			);
		} else {
			if ( this._trigger( "stop", event ) !== false ) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		// If the ddmanager is used for droppables, inform the manager that dragging has stopped
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop( this, event );
		}

		// Only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {

			// The interaction is over; whether or not the click resulted in a drag,
			// focus the element
			this.element.trigger( "focus" );
		}

		return $.ui.mouse.prototype._mouseUp.call( this, event );
	},

	cancel: function() {

		if ( this.helper.is( ".ui-draggable-dragging" ) ) {
			this._mouseUp( new $.Event( "mouseup", { target: this.element[ 0 ] } ) );
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function( event ) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleElement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this._addClass( this.handleElement, "ui-draggable-handle" );
	},

	_removeHandleClassName: function() {
		this._removeClass( this.handleElement, "ui-draggable-handle" );
	},

	_createHelper: function( event ) {

		var o = this.options,
			helperIsFunction = $.isFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeAttr( "id" ) :
					this.element );

		if ( !helper.parents( "body" ).length ) {
			helper.appendTo( ( o.appendTo === "parent" ?
				this.element[ 0 ].parentNode :
				o.appendTo ) );
		}

		// Http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setPositionRelative();
		}

		if ( helper[ 0 ] !== this.element[ 0 ] &&
				!( /(fixed|absolute)/ ).test( helper.css( "position" ) ) ) {
			helper.css( "position", "absolute" );
		}

		return helper;

	},

	_setPositionRelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function( obj ) {
		if ( typeof obj === "string" ) {
			obj = obj.split( " " );
		}
		if ( $.isArray( obj ) ) {
			obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
		}
		if ( "left" in obj ) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ( "right" in obj ) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ( "top" in obj ) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ( "bottom" in obj ) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_isRootNode: function( element ) {
		return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset(),
			document = this.document[ 0 ];

		// This is a special case where we need to modify a offset calculated on start, since the
		// following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the
		// next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
		// the document, which means that the scroll is included in the initial calculation of the
		// offset of the parent, and never recalculated upon drag
		if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== document &&
				$.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
			left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
		};

	},

	_getRelativeOffset: function() {
		if ( this.cssPosition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
				( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
			left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
				( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
		};

	},

	_cacheMargins: function() {
		this.margins = {
			left: ( parseInt( this.element.css( "marginLeft" ), 10 ) || 0 ),
			top: ( parseInt( this.element.css( "marginTop" ), 10 ) || 0 ),
			right: ( parseInt( this.element.css( "marginRight" ), 10 ) || 0 ),
			bottom: ( parseInt( this.element.css( "marginBottom" ), 10 ) || 0 )
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativeContainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() -
					this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() +
					( $( window ).height() || document.body.parentNode.scrollHeight ) -
					this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document" ) {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) -
					this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) +
				( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) +
				( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
			( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
				( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
				( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	},

	_convertPositionTo: function( d, pos ) {

		if ( !pos ) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: (

				// The absolute mouse position
				pos.top	+

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top * mod -
				( ( this.cssPosition === "fixed" ?
					-this.offset.scroll.top :
					( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod )
			),
			left: (

				// The absolute mouse position
				pos.left +

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left * mod	-
				( ( this.cssPosition === "fixed" ?
					-this.offset.scroll.left :
					( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod )
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop(),
				left: this.scrollParent.scrollLeft()
			};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ) {
					co = this.relativeContainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if ( event.pageX - this.offset.click.left < containment[ 0 ] ) {
					pageX = containment[ 0 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top < containment[ 1 ] ) {
					pageY = containment[ 1 ] + this.offset.click.top;
				}
				if ( event.pageX - this.offset.click.left > containment[ 2 ] ) {
					pageX = containment[ 2 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top > containment[ 3 ] ) {
					pageY = containment[ 3 ] + this.offset.click.top;
				}
			}

			if ( o.grid ) {

				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid
				// argument errors in IE (see ticket #6950)
				top = o.grid[ 1 ] ? this.originalPageY + Math.round( ( pageY -
					this.originalPageY ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalPageY;
				pageY = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
					top - this.offset.click.top > containment[ 3 ] ) ?
						top :
						( ( top - this.offset.click.top >= containment[ 1 ] ) ?
							top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

				left = o.grid[ 0 ] ? this.originalPageX +
					Math.round( ( pageX - this.originalPageX ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
					this.originalPageX;
				pageX = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
					left - this.offset.click.left > containment[ 2 ] ) ?
						left :
						( ( left - this.offset.click.left >= containment[ 0 ] ) ?
							left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
			}

			if ( o.axis === "y" ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}

		return {
			top: (

				// The absolute mouse position
				pageY -

				// Click offset (relative to the element)
				this.offset.click.top -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top +
				( this.cssPosition === "fixed" ?
					-this.offset.scroll.top :
					( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
			),
			left: (

				// The absolute mouse position
				pageX -

				// Click offset (relative to the element)
				this.offset.click.left -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left +
				( this.cssPosition === "fixed" ?
					-this.offset.scroll.left :
					( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this._removeClass( this.helper, "ui-draggable-dragging" );
		if ( this.helper[ 0 ] !== this.element[ 0 ] && !this.cancelHelperRemoval ) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if ( this.destroyOnClear ) {
			this.destroy();
		}
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uiHash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// Absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionAbs = this._convertPositionTo( "absolute" );
			ui.offset = this.positionAbs;
		}
		return $.Widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

} );

$.ui.plugin.add( "draggable", "connectToSortable", {
	start: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.sortables = [];
		$( draggable.options.connectToSortable ).each( function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// RefreshPositions is called at drag start to refresh the containerCache
				// which is used in drag. This ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshPositions();
				sortable._trigger( "activate", event, uiSortable );
			}
		} );
	},
	stop: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.cancelHelperRemoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isOver ) {
				sortable.isOver = 0;

				// Allow this sortable to handle removing the helper
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS To restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mouseStop( event );

				// Once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {

				// Prevent this Sortable from removing the helper.
				// However, don't set the draggable to remove the helper
				// either as another connected Sortable may yet handle the removal.
				sortable.cancelHelperRemoval = true;

				sortable._trigger( "deactivate", event, uiSortable );
			}
		} );
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostIntersecting = false,
				sortable = this;

			// Copy over variables that sortable's _intersectsWith uses
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectsWith( sortable.containerCache ) ) {
				innermostIntersecting = true;

				$.each( draggable.sortables, function() {

					// Copy over variables that sortable's _intersectsWith uses
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectsWith( this.containerCache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting = false;
					}

					return innermostIntersecting;
				} );
			}

			if ( innermostIntersecting ) {

				// If it intersects, we use a little isOver variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isOver ) {
					sortable.isOver = 1;

					// Store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentItem = ui.helper
						.appendTo( sortable.element )
						.data( "ui-sortable-item", true );

					// Store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// Fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentItem[ 0 ];
					sortable._mouseCapture( event, true );
					sortable._mouseStart( event, true, true );

					// Because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "toSortable", event );

					// Inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					} );

					// Hack so receive/update callbacks work (mostly)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = draggable;
				}

				if ( sortable.currentItem ) {
					sortable._mouseDrag( event );

					// Copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {

				// If it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelHelperRemoval.
				if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's mouseStop would trigger a revert,
					// so revert must be temporarily false until after mouseStop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uiHash( sortable ) );
					sortable._mouseStop( event, true );

					// Restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// Need to refreshPositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					} );
				}
			}
		} );
	}
} );

$.ui.plugin.add( "draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if ( t.css( "cursor" ) ) {
			o._cursor = t.css( "cursor" );
		}
		t.css( "cursor", o.cursor );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._cursor ) {
			$( "body" ).css( "cursor", o._cursor );
		}
	}
} );

$.ui.plugin.add( "draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if ( t.css( "opacity" ) ) {
			o._opacity = t.css( "opacity" );
		}
		t.css( "opacity", o.opacity );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._opacity ) {
			$( ui.helper ).css( "opacity", o._opacity );
		}
	}
} );

$.ui.plugin.add( "draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollParentNotHidden ) {
			i.scrollParentNotHidden = i.helper.scrollParent( false );
		}

		if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] &&
				i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
			i.overflowOffset = i.scrollParentNotHidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY <
						o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX <
						o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if ( !o.axis || o.axis !== "x" ) {
				if ( event.pageY - $( document ).scrollTop() < o.scrollSensitivity ) {
					scrolled = $( document ).scrollTop( $( document ).scrollTop() - o.scrollSpeed );
				} else if ( $( window ).height() - ( event.pageY - $( document ).scrollTop() ) <
						o.scrollSensitivity ) {
					scrolled = $( document ).scrollTop( $( document ).scrollTop() + o.scrollSpeed );
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( event.pageX - $( document ).scrollLeft() < o.scrollSensitivity ) {
					scrolled = $( document ).scrollLeft(
						$( document ).scrollLeft() - o.scrollSpeed
					);
				} else if ( $( window ).width() - ( event.pageX - $( document ).scrollLeft() ) <
						o.scrollSensitivity ) {
					scrolled = $( document ).scrollLeft(
						$( document ).scrollLeft() + o.scrollSpeed
					);
				}
			}

		}

		if ( scrolled !== false && $.ui.ddmanager && !o.dropBehaviour ) {
			$.ui.ddmanager.prepareOffsets( i, event );
		}

	}
} );

$.ui.plugin.add( "draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapElements = [];

		$( o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap )
			.each( function() {
				var $t = $( this ),
					$o = $t.offset();
				if ( this !== i.element[ 0 ] ) {
					i.snapElements.push( {
						item: this,
						width: $t.outerWidth(), height: $t.outerHeight(),
						top: $o.top, left: $o.left
					} );
				}
			} );

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for ( i = inst.snapElements.length - 1; i >= 0; i-- ) {

			l = inst.snapElements[ i ].left - inst.margins.left;
			r = l + inst.snapElements[ i ].width;
			t = inst.snapElements[ i ].top - inst.margins.top;
			b = t + inst.snapElements[ i ].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d ||
					!$.contains( inst.snapElements[ i ].item.ownerDocument,
					inst.snapElements[ i ].item ) ) {
				if ( inst.snapElements[ i ].snapping ) {
					( inst.options.snap.release &&
						inst.options.snap.release.call(
							inst.element,
							event,
							$.extend( inst._uiHash(), { snapItem: inst.snapElements[ i ].item } )
						) );
				}
				inst.snapElements[ i ].snapping = false;
				continue;
			}

			if ( o.snapMode !== "inner" ) {
				ts = Math.abs( t - y2 ) <= d;
				bs = Math.abs( b - y1 ) <= d;
				ls = Math.abs( l - x2 ) <= d;
				rs = Math.abs( r - x1 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: t - inst.helperProportions.height,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: b,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: l - inst.helperProportions.width
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: r
					} ).left;
				}
			}

			first = ( ts || bs || ls || rs );

			if ( o.snapMode !== "outer" ) {
				ts = Math.abs( t - y1 ) <= d;
				bs = Math.abs( b - y2 ) <= d;
				ls = Math.abs( l - x1 ) <= d;
				rs = Math.abs( r - x2 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: t,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: b - inst.helperProportions.height,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: l
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: r - inst.helperProportions.width
					} ).left;
				}
			}

			if ( !inst.snapElements[ i ].snapping && ( ts || bs || ls || rs || first ) ) {
				( inst.options.snap.snap &&
					inst.options.snap.snap.call(
						inst.element,
						event,
						$.extend( inst._uiHash(), {
							snapItem: inst.snapElements[ i ].item
						} ) ) );
			}
			inst.snapElements[ i ].snapping = ( ts || bs || ls || rs || first );

		}

	}
} );

$.ui.plugin.add( "draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makeArray( $( o.stack ) ).sort( function( a, b ) {
				return ( parseInt( $( a ).css( "zIndex" ), 10 ) || 0 ) -
					( parseInt( $( b ).css( "zIndex" ), 10 ) || 0 );
			} );

		if ( !group.length ) { return; }

		min = parseInt( $( group[ 0 ] ).css( "zIndex" ), 10 ) || 0;
		$( group ).each( function( i ) {
			$( this ).css( "zIndex", min + i );
		} );
		this.css( "zIndex", ( min + group.length ) );
	}
} );

$.ui.plugin.add( "draggable", "zIndex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if ( t.css( "zIndex" ) ) {
			o._zIndex = t.css( "zIndex" );
		}
		t.css( "zIndex", o.zIndex );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if ( o._zIndex ) {
			$( ui.helper ).css( "zIndex", o._zIndex );
		}
	}
} );

return $.ui.draggable;

} ) );

},{}],64:[function(require,module,exports){
/*!
 * jQuery UI Menu 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Menu
//>>group: Widgets
//>>description: Creates nestable menus.
//>>docs: http://api.jqueryui.com/menu/
//>>demos: http://jqueryui.com/menu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/menu.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../unique-id",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

return $.widget( "ui.menu", {
	version: "1.12.1",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-caret-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// Callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;

		// Flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.attr( {
				role: this.options.role,
				tabIndex: 0
			} );

		this._addClass( "ui-menu", "ui-widget ui-widget-content" );
		this._on( {

			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				var active = $( $.ui.safeActiveElement( this.document[ 0 ] ) );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) &&
							active.closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {

				// Ignore mouse events while typeahead is active, see #10458.
				// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
				// is over an item in the menu
				if ( this.previousFilter ) {
					return;
				}

				var actualTarget = $( event.target ).closest( ".ui-menu-item" ),
					target = $( event.currentTarget );

				// Ignore bubbled events on parent items, see #11641
				if ( actualTarget[ 0 ] !== target[ 0 ] ) {
					return;
				}

				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				this._removeClass( target.siblings().children( ".ui-state-active" ),
					null, "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {

				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.find( this.options.items ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay( function() {
					var notContained = !$.contains(
						this.element[ 0 ],
						$.ui.safeActiveElement( this.document[ 0 ] )
					);
					if ( notContained ) {
						this.collapseAll( event );
					}
				} );
			},
			keydown: "_keydown"
		} );

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeOnDocumentClick( event ) ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		} );
	},

	_destroy: function() {
		var items = this.element.find( ".ui-menu-item" )
				.removeAttr( "role aria-disabled" ),
			submenus = items.children( ".ui-menu-item-wrapper" )
				.removeUniqueId()
				.removeAttr( "tabIndex role aria-haspopup" );

		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeAttr( "role aria-labelledby aria-expanded aria-hidden aria-disabled " +
					"tabIndex" )
				.removeUniqueId()
				.show();

		submenus.children().each( function() {
			var elem = $( this );
			if ( elem.data( "ui-menu-submenu-caret" ) ) {
				elem.remove();
			}
		} );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventDefault = true;

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			skip = false;

			// Support number pad values
			character = event.keyCode >= 96 && event.keyCode <= 105 ?
				( event.keyCode - 96 ).toString() : String.fromCharCode( event.keyCode );

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filterMenuItems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				match = this._filterMenuItems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousFilter = character;
				this.filterTimer = this._delay( function() {
					delete this.previousFilter;
				}, 1000 );
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items, newSubmenus, newItems, newWrappers,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this._toggleClass( "ui-menu-icons", null, !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		newSubmenus = submenus.filter( ":not(.ui-menu)" )
			.hide()
			.attr( {
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			} )
			.each( function() {
				var menu = $( this ),
					item = menu.prev(),
					submenuCaret = $( "<span>" ).data( "ui-menu-submenu-caret", true );

				that._addClass( submenuCaret, "ui-menu-icon", "ui-icon " + icon );
				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCaret );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			} );

		this._addClass( newSubmenus, "ui-menu", "ui-widget ui-widget-content ui-front" );

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// Initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each( function() {
			var item = $( this );
			if ( that._isDivider( item ) ) {
				that._addClass( item, "ui-menu-divider", "ui-widget-content" );
			}
		} );

		// Don't refresh list items that are already adapted
		newItems = items.not( ".ui-menu-item, .ui-menu-divider" );
		newWrappers = newItems.children()
			.not( ".ui-menu" )
				.uniqueId()
				.attr( {
					tabIndex: -1,
					role: this._itemRole()
				} );
		this._addClass( newItems, "ui-menu-item" )
			._addClass( newWrappers, "ui-menu-item-wrapper" );

		// Add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			var icons = this.element.find( ".ui-menu-icon" );
			this._removeClass( icons, null, this.options.icons.submenu )
				._addClass( icons, null, value.submenu );
		}
		this._super( key, value );
	},

	_setOptionDisabled: function( value ) {
		this._super( value );

		this.element.attr( "aria-disabled", String( value ) );
		this._toggleClass( null, "ui-state-disabled", !!value );
	},

	focus: function( event, item ) {
		var nested, focused, activeParent;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();

		focused = this.active.children( ".ui-menu-item-wrapper" );
		this._addClass( focused, null, "ui-state-active" );

		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		activeParent = this.active
			.parent()
				.closest( ".ui-menu-item" )
					.children( ".ui-menu-item-wrapper" );
		this._addClass( activeParent, null, "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay( function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening( nested );
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[ 0 ], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[ 0 ], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.outerHeight();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this._removeClass( this.active.children( ".ui-menu-item-wrapper" ),
			null, "ui-state-active" );

		this._trigger( "blur", event, { item: this.active } );
		this.active = null;
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the caret icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay( function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend( {
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay( function() {

			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all
			// sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );

			// Work around active item staying active after menu is blurred
			this._removeClass( currentMenu.find( ".ui-state-active" ), null, "ui-state-active" );

			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu.find( ".ui-menu" )
			.hide()
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	},

	_closeOnDocumentClick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isDivider: function( item ) {

		// Match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
					.find( this.options.items )
						.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay( function() {
				this.focus( event, newItem );
			} );
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each( function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			} );

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each( function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			} );

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {

		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filterMenuItems: function( character ) {
		var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new RegExp( "^" + escapedCharacter, "i" );

		return this.activeMenu
			.find( this.options.items )

				// Only match on items, not dividers or other content (#10571)
				.filter( ".ui-menu-item" )
					.filter( function() {
						return regex.test(
							$.trim( $( this ).children( ".ui-menu-item-wrapper" ).text() ) );
					} );
	}
} );

} ) );

},{}],65:[function(require,module,exports){
/*!
 * jQuery UI Mouse 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../ie",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

var mouseHandled = false;
$( document ).on( "mouseup", function() {
	mouseHandled = false;
} );

return $.widget( "ui.mouse", {
	version: "1.12.1",
	options: {
		cancel: "input, textarea, button, select, option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.on( "mousedown." + this.widgetName, function( event ) {
				return that._mouseDown( event );
			} )
			.on( "click." + this.widgetName, function( event ) {
				if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
					$.removeData( event.target, that.widgetName + ".preventClickEvent" );
					event.stopImmediatePropagation();
					return false;
				}
			} );

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.off( "." + this.widgetName );
		if ( this._mouseMoveDelegate ) {
			this.document
				.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.off( "mouseup." + this.widgetName, this._mouseUpDelegate );
		}
	},

	_mouseDown: function( event ) {

		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// We may have missed mouseup (out of window)
		( this._mouseStarted && this._mouseUp( event ) );

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = ( event.which === 1 ),

			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
				$( event.target ).closest( this.options.cancel ).length : false );
		if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if ( !this.mouseDelayMet ) {
			this._mouseDelayTimer = setTimeout( function() {
				that.mouseDelayMet = true;
			}, this.options.delay );
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted = ( this._mouseStart( event ) !== false );
			if ( !this._mouseStarted ) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
			$.removeData( event.target, this.widgetName + ".preventClickEvent" );
		}

		// These delegates are required to keep context
		this._mouseMoveDelegate = function( event ) {
			return that._mouseMove( event );
		};
		this._mouseUpDelegate = function( event ) {
			return that._mouseUp( event );
		};

		this.document
			.on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.on( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function( event ) {

		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {

			// IE mouseup check - mouseup happened when mouse was out of window
			if ( $.ui.ie && ( !document.documentMode || document.documentMode < 9 ) &&
					!event.button ) {
				return this._mouseUp( event );

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {

				// Support: Safari <=8 - 9
				// Safari sets which to 0 if you press any of the following keys
				// during a drag (#14461)
				if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
						event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
					this.ignoreMissingWhich = true;
				} else if ( !this.ignoreMissingWhich ) {
					return this._mouseUp( event );
				}
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if ( this._mouseStarted ) {
			this._mouseDrag( event );
			return event.preventDefault();
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted =
				( this._mouseStart( this._mouseDownEvent, event ) !== false );
			( this._mouseStarted ? this._mouseDrag( event ) : this._mouseUp( event ) );
		}

		return !this._mouseStarted;
	},

	_mouseUp: function( event ) {
		this.document
			.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.off( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if ( this._mouseStarted ) {
			this._mouseStarted = false;

			if ( event.target === this._mouseDownEvent.target ) {
				$.data( event.target, this.widgetName + ".preventClickEvent", true );
			}

			this._mouseStop( event );
		}

		if ( this._mouseDelayTimer ) {
			clearTimeout( this._mouseDelayTimer );
			delete this._mouseDelayTimer;
		}

		this.ignoreMissingWhich = false;
		mouseHandled = false;
		event.preventDefault();
	},

	_mouseDistanceMet: function( event ) {
		return ( Math.max(
				Math.abs( this._mouseDownEvent.pageX - event.pageX ),
				Math.abs( this._mouseDownEvent.pageY - event.pageY )
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function( /* event */ ) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function( /* event */ ) {},
	_mouseDrag: function( /* event */ ) {},
	_mouseStop: function( /* event */ ) {},
	_mouseCapture: function( /* event */ ) { return true; }
} );

} ) );

},{}],66:[function(require,module,exports){
/*!
 * jQuery UI Resizable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Resizable
//>>group: Interactions
//>>description: Enables resize functionality for any element.
//>>docs: http://api.jqueryui.com/resizable/
//>>demos: http://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../disable-selection",
			"../plugin",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.resizable", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		classes: {
			"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
		},
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,

		// See #7960
		zIndex: 90,

		// Callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parseFloat( value ) || 0;
	},

	_isNumber: function( value ) {
		return !isNaN( parseFloat( value ) );
	},

	_hasScroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden" ) {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	_create: function() {

		var margins,
			o = this.options,
			that = this;
		this._addClass( "ui-resizable" );

		$.extend( this, {
			_aspectRatio: !!( o.aspectRatio ),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		} );

		// Wrap the element if it cannot hold child nodes
		if ( this.element[ 0 ].nodeName.match( /^(canvas|textarea|input|select|button|img)$/i ) ) {

			this.element.wrap(
				$( "<div class='ui-wrapper' style='overflow: hidden;'></div>" ).css( {
					position: this.element.css( "position" ),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css( "top" ),
					left: this.element.css( "left" )
				} )
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementIsWrapper = true;

			margins = {
				marginTop: this.originalElement.css( "marginTop" ),
				marginRight: this.originalElement.css( "marginRight" ),
				marginBottom: this.originalElement.css( "marginBottom" ),
				marginLeft: this.originalElement.css( "marginLeft" )
			};

			this.element.css( margins );
			this.originalElement.css( "margin", 0 );

			// support: Safari
			// Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css( "resize" );
			this.originalElement.css( "resize", "none" );

			this._proportionallyResizeElements.push( this.originalElement.css( {
				position: "static",
				zoom: 1,
				display: "block"
			} ) );

			// Support: IE9
			// avoid IE jump (hard set the margin)
			this.originalElement.css( margins );

			this._proportionallyResize();
		}

		this._setupHandles();

		if ( o.autoHide ) {
			$( this.element )
				.on( "mouseenter", function() {
					if ( o.disabled ) {
						return;
					}
					that._removeClass( "ui-resizable-autohide" );
					that._handles.show();
				} )
				.on( "mouseleave", function() {
					if ( o.disabled ) {
						return;
					}
					if ( !that.resizing ) {
						that._addClass( "ui-resizable-autohide" );
						that._handles.hide();
					}
				} );
		}

		this._mouseInit();
	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function( exp ) {
				$( exp )
					.removeData( "resizable" )
					.removeData( "ui-resizable" )
					.off( ".resizable" )
					.find( ".ui-resizable-handle" )
						.remove();
			};

		// TODO: Unwrap at same DOM position
		if ( this.elementIsWrapper ) {
			_destroy( this.element );
			wrapper = this.element;
			this.originalElement.css( {
				position: wrapper.css( "position" ),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css( "top" ),
				left: wrapper.css( "left" )
			} ).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css( "resize", this.originalResizeStyle );
		_destroy( this.originalElement );

		return this;
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		switch ( key ) {
		case "handles":
			this._removeHandles();
			this._setupHandles();
			break;
		default:
			break;
		}
	},

	_setupHandles: function() {
		var o = this.options, handle, i, n, hname, axis, that = this;
		this.handles = o.handles ||
			( !$( ".ui-resizable-handle", this.element ).length ?
				"e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				} );

		this._handles = $();
		if ( this.handles.constructor === String ) {

			if ( this.handles === "all" ) {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split( "," );
			this.handles = {};

			for ( i = 0; i < n.length; i++ ) {

				handle = $.trim( n[ i ] );
				hname = "ui-resizable-" + handle;
				axis = $( "<div>" );
				this._addClass( axis, "ui-resizable-handle " + hname );

				axis.css( { zIndex: o.zIndex } );

				this.handles[ handle ] = ".ui-resizable-" + handle;
				this.element.append( axis );
			}

		}

		this._renderAxis = function( target ) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for ( i in this.handles ) {

				if ( this.handles[ i ].constructor === String ) {
					this.handles[ i ] = this.element.children( this.handles[ i ] ).first().show();
				} else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
					this.handles[ i ] = $( this.handles[ i ] );
					this._on( this.handles[ i ], { "mousedown": that._mouseDown } );
				}

				if ( this.elementIsWrapper &&
						this.originalElement[ 0 ]
							.nodeName
							.match( /^(textarea|input|select|button)$/i ) ) {
					axis = $( this.handles[ i ], this.element );

					padWrapper = /sw|ne|nw|se|n|s/.test( i ) ?
						axis.outerHeight() :
						axis.outerWidth();

					padPos = [ "padding",
						/ne|nw|n/.test( i ) ? "Top" :
						/se|sw|s/.test( i ) ? "Bottom" :
						/^e$/.test( i ) ? "Right" : "Left" ].join( "" );

					target.css( padPos, padWrapper );

					this._proportionallyResize();
				}

				this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// TODO: make renderAxis a prototype function
		this._renderAxis( this.element );

		this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
		this._handles.disableSelection();

		this._handles.on( "mouseover", function() {
			if ( !that.resizing ) {
				if ( this.className ) {
					axis = this.className.match( /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i );
				}
				that.axis = axis && axis[ 1 ] ? axis[ 1 ] : "se";
			}
		} );

		if ( o.autoHide ) {
			this._handles.hide();
			this._addClass( "ui-resizable-autohide" );
		}
	},

	_removeHandles: function() {
		this._handles.remove();
	},

	_mouseCapture: function( event ) {
		var i, handle,
			capture = false;

		for ( i in this.handles ) {
			handle = $( this.handles[ i ] )[ 0 ];
			if ( handle === event.target || $.contains( handle, event.target ) ) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function( event ) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy();

		curleft = this._num( this.helper.css( "left" ) );
		curtop = this._num( this.helper.css( "top" ) );

		if ( o.containment ) {
			curleft += $( o.containment ).scrollLeft() || 0;
			curtop += $( o.containment ).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizeDiff = {
			width: el.outerWidth() - el.width(),
			height: el.outerHeight() - el.height()
		};

		this.originalPosition = { left: curleft, top: curtop };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		this.aspectRatio = ( typeof o.aspectRatio === "number" ) ?
			o.aspectRatio :
			( ( this.originalSize.width / this.originalSize.height ) || 1 );

		cursor = $( ".ui-resizable-" + this.axis ).css( "cursor" );
		$( "body" ).css( "cursor", cursor === "auto" ? this.axis + "-resize" : cursor );

		this._addClass( "ui-resizable-resizing" );
		this._propagate( "start", event );
		return true;
	},

	_mouseDrag: function( event ) {

		var data, props,
			smp = this.originalMousePosition,
			a = this.axis,
			dx = ( event.pageX - smp.left ) || 0,
			dy = ( event.pageY - smp.top ) || 0,
			trigger = this._change[ a ];

		this._updatePrevProperties();

		if ( !trigger ) {
			return false;
		}

		data = trigger.apply( this, [ event, dx, dy ] );

		this._updateVirtualBoundaries( event.shiftKey );
		if ( this._aspectRatio || event.shiftKey ) {
			data = this._updateRatio( data, event );
		}

		data = this._respectSize( data, event );

		this._updateCache( data );

		this._propagate( "resize", event );

		props = this._applyChanges();

		if ( !this._helper && this._proportionallyResizeElements.length ) {
			this._proportionallyResize();
		}

		if ( !$.isEmptyObject( props ) ) {
			this._updatePrevProperties();
			this._trigger( "resize", event, this.ui() );
			this._applyChanges();
		}

		return false;
	},

	_mouseStop: function( event ) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if ( this._helper ) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName );
			soffseth = ista && this._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = {
				width: ( that.helper.width()  - soffsetw ),
				height: ( that.helper.height() - soffseth )
			};
			left = ( parseFloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalPosition.left ) ) || null;
			top = ( parseFloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalPosition.top ) ) || null;

			if ( !o.animate ) {
				this.element.css( $.extend( s, { top: top, left: left } ) );
			}

			that.helper.height( that.size.height );
			that.helper.width( that.size.width );

			if ( this._helper && !o.animate ) {
				this._proportionallyResize();
			}
		}

		$( "body" ).css( "cursor", "auto" );

		this._removeClass( "ui-resizable-resizing" );

		this._propagate( "stop", event );

		if ( this._helper ) {
			this.helper.remove();
		}

		return false;

	},

	_updatePrevProperties: function() {
		this.prevPosition = {
			top: this.position.top,
			left: this.position.left
		};
		this.prevSize = {
			width: this.size.width,
			height: this.size.height
		};
	},

	_applyChanges: function() {
		var props = {};

		if ( this.position.top !== this.prevPosition.top ) {
			props.top = this.position.top + "px";
		}
		if ( this.position.left !== this.prevPosition.left ) {
			props.left = this.position.left + "px";
		}
		if ( this.size.width !== this.prevSize.width ) {
			props.width = this.size.width + "px";
		}
		if ( this.size.height !== this.prevSize.height ) {
			props.height = this.size.height + "px";
		}

		this.helper.css( props );

		return props;
	},

	_updateVirtualBoundaries: function( forceAspectRatio ) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: this._isNumber( o.minWidth ) ? o.minWidth : 0,
			maxWidth: this._isNumber( o.maxWidth ) ? o.maxWidth : Infinity,
			minHeight: this._isNumber( o.minHeight ) ? o.minHeight : 0,
			maxHeight: this._isNumber( o.maxHeight ) ? o.maxHeight : Infinity
		};

		if ( this._aspectRatio || forceAspectRatio ) {
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if ( pMinWidth > b.minWidth ) {
				b.minWidth = pMinWidth;
			}
			if ( pMinHeight > b.minHeight ) {
				b.minHeight = pMinHeight;
			}
			if ( pMaxWidth < b.maxWidth ) {
				b.maxWidth = pMaxWidth;
			}
			if ( pMaxHeight < b.maxHeight ) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function( data ) {
		this.offset = this.helper.offset();
		if ( this._isNumber( data.left ) ) {
			this.position.left = data.left;
		}
		if ( this._isNumber( data.top ) ) {
			this.position.top = data.top;
		}
		if ( this._isNumber( data.height ) ) {
			this.size.height = data.height;
		}
		if ( this._isNumber( data.width ) ) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if ( this._isNumber( data.height ) ) {
			data.width = ( data.height * this.aspectRatio );
		} else if ( this._isNumber( data.width ) ) {
			data.height = ( data.width / this.aspectRatio );
		}

		if ( a === "sw" ) {
			data.left = cpos.left + ( csize.width - data.width );
			data.top = null;
		}
		if ( a === "nw" ) {
			data.top = cpos.top + ( csize.height - data.height );
			data.left = cpos.left + ( csize.width - data.width );
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = this._isNumber( data.width ) && o.maxWidth && ( o.maxWidth < data.width ),
			ismaxh = this._isNumber( data.height ) && o.maxHeight && ( o.maxHeight < data.height ),
			isminw = this._isNumber( data.width ) && o.minWidth && ( o.minWidth > data.width ),
			isminh = this._isNumber( data.height ) && o.minHeight && ( o.minHeight > data.height ),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.originalPosition.top + this.originalSize.height,
			cw = /sw|nw|w/.test( a ), ch = /nw|ne|n/.test( a );
		if ( isminw ) {
			data.width = o.minWidth;
		}
		if ( isminh ) {
			data.height = o.minHeight;
		}
		if ( ismaxw ) {
			data.width = o.maxWidth;
		}
		if ( ismaxh ) {
			data.height = o.maxHeight;
		}

		if ( isminw && cw ) {
			data.left = dw - o.minWidth;
		}
		if ( ismaxw && cw ) {
			data.left = dw - o.maxWidth;
		}
		if ( isminh && ch ) {
			data.top = dh - o.minHeight;
		}
		if ( ismaxh && ch ) {
			data.top = dh - o.maxHeight;
		}

		// Fixing jump error on top/left - bug #2330
		if ( !data.width && !data.height && !data.left && data.top ) {
			data.top = null;
		} else if ( !data.width && !data.height && !data.top && data.left ) {
			data.left = null;
		}

		return data;
	},

	_getPaddingPlusBorderDimensions: function( element ) {
		var i = 0,
			widths = [],
			borders = [
				element.css( "borderTopWidth" ),
				element.css( "borderRightWidth" ),
				element.css( "borderBottomWidth" ),
				element.css( "borderLeftWidth" )
			],
			paddings = [
				element.css( "paddingTop" ),
				element.css( "paddingRight" ),
				element.css( "paddingBottom" ),
				element.css( "paddingLeft" )
			];

		for ( ; i < 4; i++ ) {
			widths[ i ] = ( parseFloat( borders[ i ] ) || 0 );
			widths[ i ] += ( parseFloat( paddings[ i ] ) || 0 );
		}

		return {
			height: widths[ 0 ] + widths[ 2 ],
			width: widths[ 1 ] + widths[ 3 ]
		};
	},

	_proportionallyResize: function() {

		if ( !this._proportionallyResizeElements.length ) {
			return;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		for ( ; i < this._proportionallyResizeElements.length; i++ ) {

			prel = this._proportionallyResizeElements[ i ];

			// TODO: Seems like a bug to cache this.outerDimensions
			// considering that we are in a loop.
			if ( !this.outerDimensions ) {
				this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
			}

			prel.css( {
				height: ( element.height() - this.outerDimensions.height ) || 0,
				width: ( element.width() - this.outerDimensions.width ) || 0
			} );

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if ( this._helper ) {

			this.helper = this.helper || $( "<div style='overflow:hidden;'></div>" );

			this._addClass( this.helper, this._helper );
			this.helper.css( {
				width: this.element.outerWidth(),
				height: this.element.outerHeight(),
				position: "absolute",
				left: this.elementOffset.left + "px",
				top: this.elementOffset.top + "px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			} );

			this.helper
				.appendTo( "body" )
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function( event, dx ) {
			return { width: this.originalSize.width + dx };
		},
		w: function( event, dx ) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function( event, dx, dy ) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function( event, dx, dy ) {
			return { height: this.originalSize.height + dy };
		},
		se: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		sw: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		},
		ne: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		nw: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		}
	},

	_propagate: function( n, event ) {
		$.ui.plugin.call( this, n, [ event, this.ui() ] );
		( n !== "resize" && this._trigger( n, event, this.ui() ) );
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

} );

/*
 * Resizable Extensions
 */

$.ui.plugin.add( "resizable", "animate", {

	stop: function( event ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName ),
			soffseth = ista && that._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = {
				width: ( that.size.width - soffsetw ),
				height: ( that.size.height - soffseth )
			},
			left = ( parseFloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalPosition.left ) ) || null,
			top = ( parseFloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalPosition.top ) ) || null;

		that.element.animate(
			$.extend( style, top && left ? { top: top, left: left } : {} ), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseFloat( that.element.css( "width" ) ),
						height: parseFloat( that.element.css( "height" ) ),
						top: parseFloat( that.element.css( "top" ) ),
						left: parseFloat( that.element.css( "left" ) )
					};

					if ( pr && pr.length ) {
						$( pr[ 0 ] ).css( { width: data.width, height: data.height } );
					}

					// Propagating resize, and updating values for each animation step
					that._updateCache( data );
					that._propagate( "resize", event );

				}
			}
		);
	}

} );

$.ui.plugin.add( "resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = ( oc instanceof $ ) ?
				oc.get( 0 ) :
				( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

		if ( !ce ) {
			return;
		}

		that.containerElement = $( ce );

		if ( /document/.test( oc ) || oc === document ) {
			that.containerOffset = {
				left: 0,
				top: 0
			};
			that.containerPosition = {
				left: 0,
				top: 0
			};

			that.parentData = {
				element: $( document ),
				left: 0,
				top: 0,
				width: $( document ).width(),
				height: $( document ).height() || document.body.parentNode.scrollHeight
			};
		} else {
			element = $( ce );
			p = [];
			$( [ "Top", "Right", "Left", "Bottom" ] ).each( function( i, name ) {
				p[ i ] = that._num( element.css( "padding" + name ) );
			} );

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = {
				height: ( element.innerHeight() - p[ 3 ] ),
				width: ( element.innerWidth() - p[ 1 ] )
			};

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
			height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

			that.parentData = {
				element: ce,
				left: co.left,
				top: co.top,
				width: width,
				height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerElement,
			continueResize = true;

		if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
			cop = co;
		}

		if ( cp.left < ( that._helper ? co.left : 0 ) ) {
			that.size.width = that.size.width +
				( that._helper ?
					( that.position.left - co.left ) :
					( that.position.left - cop.left ) );

			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if ( cp.top < ( that._helper ? co.top : 0 ) ) {
			that.size.height = that.size.height +
				( that._helper ?
					( that.position.top - co.top ) :
					that.position.top );

			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
		isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

		if ( isParent && isOffsetRelative ) {
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
		} else {
			that.offset.left = that.element.offset().left;
			that.offset.top = that.element.offset().top;
		}

		woset = Math.abs( that.sizeDiff.width +
			( that._helper ?
				that.offset.left - cop.left :
				( that.offset.left - co.left ) ) );

		hoset = Math.abs( that.sizeDiff.height +
			( that._helper ?
				that.offset.top - cop.top :
				( that.offset.top - co.top ) ) );

		if ( woset + that.size.width >= that.parentData.width ) {
			that.size.width = that.parentData.width - woset;
			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
		}

		if ( hoset + that.size.height >= that.parentData.height ) {
			that.size.height = that.parentData.height - hoset;
			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
		}

		if ( !continueResize ) {
			that.position.left = that.prevPosition.left;
			that.position.top = that.prevPosition.top;
			that.size.width = that.prevSize.width;
			that.size.height = that.prevSize.height;
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $( that.helper ),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}

		if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}
	}
} );

$.ui.plugin.add( "resizable", "alsoResize", {

	start: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options;

		$( o.alsoResize ).each( function() {
			var el = $( this );
			el.data( "ui-resizable-alsoresize", {
				width: parseFloat( el.width() ), height: parseFloat( el.height() ),
				left: parseFloat( el.css( "left" ) ), top: parseFloat( el.css( "top" ) )
			} );
		} );
	},

	resize: function( event, ui ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: ( that.size.height - os.height ) || 0,
				width: ( that.size.width - os.width ) || 0,
				top: ( that.position.top - op.top ) || 0,
				left: ( that.position.left - op.left ) || 0
			};

			$( o.alsoResize ).each( function() {
				var el = $( this ), start = $( this ).data( "ui-resizable-alsoresize" ), style = {},
					css = el.parents( ui.originalElement[ 0 ] ).length ?
							[ "width", "height" ] :
							[ "width", "height", "top", "left" ];

				$.each( css, function( i, prop ) {
					var sum = ( start[ prop ] || 0 ) + ( delta[ prop ] || 0 );
					if ( sum && sum >= 0 ) {
						style[ prop ] = sum || null;
					}
				} );

				el.css( style );
			} );
	},

	stop: function() {
		$( this ).removeData( "ui-resizable-alsoresize" );
	}
} );

$.ui.plugin.add( "resizable", "ghost", {

	start: function() {

		var that = $( this ).resizable( "instance" ), cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost.css( {
			opacity: 0.25,
			display: "block",
			position: "relative",
			height: cs.height,
			width: cs.width,
			margin: 0,
			left: 0,
			top: 0
		} );

		that._addClass( that.ghost, "ui-resizable-ghost" );

		// DEPRECATED
		// TODO: remove after 1.12
		if ( $.uiBackCompat !== false && typeof that.options.ghost === "string" ) {

			// Ghost option
			that.ghost.addClass( this.options.ghost );
		}

		that.ghost.appendTo( that.helper );

	},

	resize: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost ) {
			that.ghost.css( {
				position: "relative",
				height: that.size.height,
				width: that.size.width
			} );
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost && that.helper ) {
			that.helper.get( 0 ).removeChild( that.ghost.get( 0 ) );
		}
	}

} );

$.ui.plugin.add( "resizable", "grid", {

	resize: function() {
		var outerDimensions,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
			gridX = ( grid[ 0 ] || 1 ),
			gridY = ( grid[ 1 ] || 1 ),
			ox = Math.round( ( cs.width - os.width ) / gridX ) * gridX,
			oy = Math.round( ( cs.height - os.height ) / gridY ) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && ( o.maxWidth < newWidth ),
			isMaxHeight = o.maxHeight && ( o.maxHeight < newHeight ),
			isMinWidth = o.minWidth && ( o.minWidth > newWidth ),
			isMinHeight = o.minHeight && ( o.minHeight > newHeight );

		o.grid = grid;

		if ( isMinWidth ) {
			newWidth += gridX;
		}
		if ( isMinHeight ) {
			newHeight += gridY;
		}
		if ( isMaxWidth ) {
			newWidth -= gridX;
		}
		if ( isMaxHeight ) {
			newHeight -= gridY;
		}

		if ( /^(se|s|e)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if ( /^(ne)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if ( /^(sw)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY <= 0 || newWidth - gridX <= 0 ) {
				outerDimensions = that._getPaddingPlusBorderDimensions( this );
			}

			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				newHeight = gridY - outerDimensions.height;
				that.size.height = newHeight;
				that.position.top = op.top + os.height - newHeight;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				newWidth = gridX - outerDimensions.width;
				that.size.width = newWidth;
				that.position.left = op.left + os.width - newWidth;
			}
		}
	}

} );

return $.ui.resizable;

} ) );

},{}],67:[function(require,module,exports){
/*!
 * jQuery UI Spinner 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Spinner
//>>group: Widgets
//>>description: Displays buttons to easily input numbers via the keyboard or mouse.
//>>docs: http://api.jqueryui.com/spinner/
//>>demos: http://jqueryui.com/spinner/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/spinner.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./button",
			"../version",
			"../keycode",
			"../safe-active-element",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

function spinnerModifer( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.12.1",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		classes: {
			"ui-spinner": "ui-corner-all",
			"ui-spinner-down": "ui-corner-br",
			"ui-spinner-up": "ui-corner-tr"
		},
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {

		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// Only format if there is a value, prevents the field from being marked
		// as invalid in Firefox, see #9573.
		if ( this.value() !== "" ) {

			// Format the value, but don't constrain.
			this._value( this.element.val(), true );
		}

		this._draw();
		this._on( this._events );
		this._refresh();

		// Turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		} );
	},

	_getCreateOptions: function() {
		var options = this._super();
		var element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value != null && value.length ) {
				options[ option ] = value;
			}
		} );

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._stop();
			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( ( delta > 0 ? 1 : -1 ) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay( function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[ 0 ] === $.ui.safeActiveElement( this.document[ 0 ] ) ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[ 0 ] === $.ui.safeActiveElement( this.document[ 0 ] );
				if ( !isActive ) {
					this.element.trigger( "focus" );
					this.previous = previous;

					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay( function() {
						this.previous = previous;
					} );
				}
			}

			// Ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// Support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay( function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			} );

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget )
				.hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {

			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget )
				.hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},

		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	// Support mobile enhanced option and make backcompat more sane
	_enhance: function() {
		this.uiSpinner = this.element
			.attr( "autocomplete", "off" )
			.wrap( "<span>" )
			.parent()

				// Add buttons
				.append(
					"<a></a><a></a>"
				);
	},

	_draw: function() {
		this._enhance();

		this._addClass( this.uiSpinner, "ui-spinner", "ui-widget ui-widget-content" );
		this._addClass( "ui-spinner-input" );

		this.element.attr( "role", "spinbutton" );

		// Button bindings
		this.buttons = this.uiSpinner.children( "a" )
			.attr( "tabIndex", -1 )
			.attr( "aria-hidden", true )
			.button( {
				classes: {
					"ui-button": ""
				}
			} );

		// TODO: Right now button does not support classes this is already updated in button PR
		this._removeClass( this.buttons, "ui-corner-all" );

		this._addClass( this.buttons.first(), "ui-spinner-button ui-spinner-up" );
		this._addClass( this.buttons.last(), "ui-spinner-button ui-spinner-down" );
		this.buttons.first().button( {
			"icon": this.options.icons.up,
			"showLabel": false
		} );
		this.buttons.last().button( {
			"icon": this.options.icons.down,
			"showLabel": false
		} );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( this.uiSpinner.height() * 0.5 ) &&
				this.uiSpinner.height() > 0 ) {
			this.uiSpinner.height( this.uiSpinner.height() );
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay( function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false ) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// Make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;

		// - round to the nearest step
		aboveMin = Math.round( aboveMin / options.step ) * options.step;

		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// Fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// Clamp the value
		if ( options.max !== null && value > options.max ) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		var prevValue, first, last;

		if ( key === "culture" || key === "numberFormat" ) {
			prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}
		if ( key === "icons" ) {
			first = this.buttons.first().find( ".ui-icon" );
			this._removeClass( first, null, this.options.icons.up );
			this._addClass( first, null, value.up );
			last = this.buttons.last().find( ".ui-icon" );
			this._removeClass( last, null, this.options.icons.down );
			this._addClass( last, null, value.down );
		}

		this._super( key, value );
	},

	_setOptionDisabled: function( value ) {
		this._super( value );

		this._toggleClass( this.uiSpinner, null, "ui-state-disabled", !!value );
		this.element.prop( "disabled", !!value );
		this.buttons.button( value ? "disable" : "enable" );
	},

	_setOptions: spinnerModifer( function( options ) {
		this._super( options );
	} ),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr( {
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,

			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		} );
	},

	isValid: function() {
		var value = this.value();

		// Null is invalid
		if ( value === null ) {
			return false;
		}

		// If value gets adjusted, it's invalid
		return value === this._adjustValue( value );
	},

	// Update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.prop( "disabled", false )
			.removeAttr( "autocomplete role aria-valuemin aria-valuemax aria-valuenow" );

		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: spinnerModifer( function( steps ) {
		this._stepUp( steps );
	} ),
	_stepUp: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * this.options.step );
			this._stop();
		}
	},

	stepDown: spinnerModifer( function( steps ) {
		this._stepDown( steps );
	} ),
	_stepDown: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * -this.options.step );
			this._stop();
		}
	},

	pageUp: spinnerModifer( function( pages ) {
		this._stepUp( ( pages || 1 ) * this.options.page );
	} ),

	pageDown: spinnerModifer( function( pages ) {
		this._stepDown( ( pages || 1 ) * this.options.page );
	} ),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		spinnerModifer( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
} );

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for spinner html extension points
	$.widget( "ui.spinner", $.ui.spinner, {
		_enhance: function() {
			this.uiSpinner = this.element
				.attr( "autocomplete", "off" )
				.wrap( this._uiSpinnerHtml() )
				.parent()

					// Add buttons
					.append( this._buttonHtml() );
		},
		_uiSpinnerHtml: function() {
			return "<span>";
		},

		_buttonHtml: function() {
			return "<a></a><a></a>";
		}
	} );
}

return $.ui.spinner;

} ) );

},{}],68:[function(require,module,exports){
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.1.2
 * Copyright (C) 2017 Oliver Nightingale
 * @license MIT
 */

;(function(){

/**
 * A convenience function for configuring and constructing
 * a new lunr Index.
 *
 * A lunr.Builder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function.
 *
 * @example
 * var idx = lunr(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * @see {@link lunr.Builder}
 * @see {@link lunr.Pipeline}
 * @see {@link lunr.trimmer}
 * @see {@link lunr.stopWordFilter}
 * @see {@link lunr.stemmer}
 * @namespace {function} lunr
 */
var lunr = function (config) {
  var builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  config.call(builder, builder)
  return builder.build()
}

lunr.version = "2.1.2"
/*!
 * lunr.utils
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  /* eslint-disable no-console */
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
  /* eslint-enable no-console */
})(this)

/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
lunr.utils.asString = function (obj) {
  if (obj === void 0 || obj === null) {
    return ""
  } else {
    return obj.toString()
  }
}
lunr.FieldRef = function (docRef, fieldName) {
  this.docRef = docRef
  this.fieldName = fieldName
  this._stringValue = fieldName + lunr.FieldRef.joiner + docRef
}

lunr.FieldRef.joiner = "/"

lunr.FieldRef.fromString = function (s) {
  var n = s.indexOf(lunr.FieldRef.joiner)

  if (n === -1) {
    throw "malformed field ref string"
  }

  var fieldRef = s.slice(0, n),
      docRef = s.slice(n + 1)

  return new lunr.FieldRef (docRef, fieldRef)
}

lunr.FieldRef.prototype.toString = function () {
  return this._stringValue
}
/**
 * A function to calculate the inverse document frequency for
 * a posting. This is shared between the builder and the index
 *
 * @private
 * @param {object} posting - The posting for a given term
 * @param {number} documentCount - The total number of documents.
 */
lunr.idf = function (posting, documentCount) {
  var documentsWithTerm = 0

  for (var fieldName in posting) {
    if (fieldName == '_index') continue // Ignore the term index, its not a field
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)

  return Math.log(1 + Math.abs(x))
}

/**
 * A token wraps a string representation of a token
 * as it is passed through the text processing pipeline.
 *
 * @constructor
 * @param {string} [str=''] - The string token being wrapped.
 * @param {object} [metadata={}] - Metadata associated with this token.
 */
lunr.Token = function (str, metadata) {
  this.str = str || ""
  this.metadata = metadata || {}
}

/**
 * Returns the token string that is being wrapped by this object.
 *
 * @returns {string}
 */
lunr.Token.prototype.toString = function () {
  return this.str
}

/**
 * A token update function is used when updating or optionally
 * when cloning a token.
 *
 * @callback lunr.Token~updateFunction
 * @param {string} str - The string representation of the token.
 * @param {Object} metadata - All metadata associated with this token.
 */

/**
 * Applies the given function to the wrapped string token.
 *
 * @example
 * token.update(function (str, metadata) {
 *   return str.toUpperCase()
 * })
 *
 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.update = function (fn) {
  this.str = fn(this.str, this.metadata)
  return this
}

/**
 * Creates a clone of this token. Optionally a function can be
 * applied to the cloned token.
 *
 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.clone = function (fn) {
  fn = fn || function (s) { return s }
  return new lunr.Token (fn(this.str, this.metadata), this.metadata)
}
/*!
 * lunr.tokenizer
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * This tokenizer will convert its parameter to a string by calling `toString` and
 * then will split this string on the character in `lunr.tokenizer.separator`.
 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
 *
 * @static
 * @param {?(string|object|object[])} obj - The object to convert into tokens
 * @returns {lunr.Token[]}
 */
lunr.tokenizer = function (obj) {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(lunr.utils.asString(t).toLowerCase())
    })
  }

  var str = obj.toString().trim().toLowerCase(),
      len = str.length,
      tokens = []

  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
    var char = str.charAt(sliceEnd),
        sliceLength = sliceEnd - sliceStart

    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {

      if (sliceLength > 0) {
        tokens.push(
          new lunr.Token (str.slice(sliceStart, sliceEnd), {
            position: [sliceStart, sliceLength],
            index: tokens.length
          })
        )
      }

      sliceStart = sliceEnd + 1
    }

  }

  return tokens
}

/**
 * The separator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.separator = /[\s\-]+/
/*!
 * lunr.Pipeline
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = Object.create(null)

/**
 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
 * string as well as all known metadata. A pipeline function can mutate the token string
 * or mutate (or add) metadata for a given token.
 *
 * A pipeline function can indicate that the passed token should be discarded by returning
 * null. This token will not be passed to any downstream pipeline functions and will not be
 * added to the index.
 *
 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
 * to any downstream pipeline functions and all will returned tokens will be added to the index.
 *
 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
 *
 * @interface lunr.PipelineFunction
 * @param {lunr.Token} token - A token from the document being processed.
 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
 * @param {lunr.Token[]} tokens - All tokens for this document/field.
 * @returns {(?lunr.Token|lunr.Token[])}
 */

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @param {String} label - The label to register this function with
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @private
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised - The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load unregistered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var stackLength = this._stack.length

  for (var i = 0; i < stackLength; i++) {
    var fn = this._stack[i]

    tokens = tokens.reduce(function (memo, token, j) {
      var result = fn(token, j, tokens)

      if (result === void 0 || result === '') return memo

      return memo.concat(result)
    }, [])
  }

  return tokens
}

/**
 * Convenience method for passing a string through a pipeline and getting
 * strings out. This method takes care of wrapping the passed string in a
 * token and mapping the resulting tokens back to strings.
 *
 * @param {string} str - The string to pass through the pipeline.
 * @returns {string[]}
 */
lunr.Pipeline.prototype.runString = function (str) {
  var token = new lunr.Token (str)

  return this.run([token]).map(function (t) {
    return t.toString()
  })
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A vector is used to construct the vector space of documents and queries. These
 * vectors support operations to determine the similarity between two documents or
 * a document and a query.
 *
 * Normally no parameters are required for initializing a vector, but in the case of
 * loading a previously dumped vector the raw elements can be provided to the constructor.
 *
 * For performance reasons vectors are implemented with a flat array, where an elements
 * index is immediately followed by its value. E.g. [index, value, index, value]. This
 * allows the underlying array to be as sparse as possible and still offer decent
 * performance when being used for vector calculations.
 *
 * @constructor
 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
 */
lunr.Vector = function (elements) {
  this._magnitude = 0
  this.elements = elements || []
}


/**
 * Calculates the position within the vector to insert a given index.
 *
 * This is used internally by insert and upsert. If there are duplicate indexes then
 * the position is returned as if the value for that index were to be updated, but it
 * is the callers responsibility to check whether there is a duplicate at that index
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @returns {Number}
 */
lunr.Vector.prototype.positionForIndex = function (index) {
  // For an empty vector the tuple can be inserted at the beginning
  if (this.elements.length == 0) {
    return 0
  }

  var start = 0,
      end = this.elements.length / 2,
      sliceLength = end - start,
      pivotPoint = Math.floor(sliceLength / 2),
      pivotIndex = this.elements[pivotPoint * 2]

  while (sliceLength > 1) {
    if (pivotIndex < index) {
      start = pivotPoint
    }

    if (pivotIndex > index) {
      end = pivotPoint
    }

    if (pivotIndex == index) {
      break
    }

    sliceLength = end - start
    pivotPoint = start + Math.floor(sliceLength / 2)
    pivotIndex = this.elements[pivotPoint * 2]
  }

  if (pivotIndex == index) {
    return pivotPoint * 2
  }

  if (pivotIndex > index) {
    return pivotPoint * 2
  }

  if (pivotIndex < index) {
    return (pivotPoint + 1) * 2
  }
}

/**
 * Inserts an element at an index within the vector.
 *
 * Does not allow duplicates, will throw an error if there is already an entry
 * for this index.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 */
lunr.Vector.prototype.insert = function (insertIdx, val) {
  this.upsert(insertIdx, val, function () {
    throw "duplicate index"
  })
}

/**
 * Inserts or updates an existing index within the vector.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 * @param {function} fn - A function that is called for updates, the existing value and the
 * requested value are passed as arguments
 */
lunr.Vector.prototype.upsert = function (insertIdx, val, fn) {
  this._magnitude = 0
  var position = this.positionForIndex(insertIdx)

  if (this.elements[position] == insertIdx) {
    this.elements[position + 1] = fn(this.elements[position + 1], val)
  } else {
    this.elements.splice(position, 0, insertIdx, val)
  }
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elementsLength = this.elements.length

  for (var i = 1; i < elementsLength; i += 2) {
    var val = this.elements[i]
    sumOfSquares += val * val
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
 * @returns {Number}
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var dotProduct = 0,
      a = this.elements, b = otherVector.elements,
      aLen = a.length, bLen = b.length,
      aVal = 0, bVal = 0,
      i = 0, j = 0

  while (i < aLen && j < bLen) {
    aVal = a[i], bVal = b[j]
    if (aVal < bVal) {
      i += 2
    } else if (aVal > bVal) {
      j += 2
    } else if (aVal == bVal) {
      dotProduct += a[i + 1] * b[j + 1]
      i += 2
      j += 2
    }
  }

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector - The other vector to calculate the
 * similarity with.
 * @returns {Number}
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

/**
 * Converts the vector to an array of the elements within the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toArray = function () {
  var output = new Array (this.elements.length / 2)

  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
    output[j] = this.elements[i]
  }

  return output
}

/**
 * A JSON serializable representation of the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toJSON = function () {
  return this.elements
}
/* eslint-disable */
/*!
 * lunr.stemmer
 * Copyright (C) 2017 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token - The string to stem
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) { w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return function (token) {
    return token.update(porterStemmer);
  }
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @param {Array} token The token to pass through the filter
 * @returns {lunr.PipelineFunction}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */
lunr.generateStopWordFilter = function (stopWords) {
  var words = stopWords.reduce(function (memo, stopWord) {
    memo[stopWord] = stopWord
    return memo
  }, {})

  return function (token) {
    if (token && words[token.toString()] !== token.toString()) return token
  }
}

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @implements {lunr.PipelineFunction}
 * @params {lunr.Token} token - A token to check for being a stop word.
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stopWordFilter = lunr.generateStopWordFilter([
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
])

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the beginning and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token The token to pass through the filter
 * @returns {lunr.Token}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  return token.update(function (s) {
    return s.replace(/^\W+/, '').replace(/\W+$/, '')
  })
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.TokenSet
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A token set is used to store the unique list of all tokens
 * within an index. Token sets are also used to represent an
 * incoming query to the index, this query token set and index
 * token set are then intersected to find which tokens to look
 * up in the inverted index.
 *
 * A token set can hold multiple tokens, as in the case of the
 * index token set, or it can hold a single token as in the
 * case of a simple query token set.
 *
 * Additionally token sets are used to perform wildcard matching.
 * Leading, contained and trailing wildcards are supported, and
 * from this edit distance matching can also be provided.
 *
 * Token sets are implemented as a minimal finite state automata,
 * where both common prefixes and suffixes are shared between tokens.
 * This helps to reduce the space used for storing the token set.
 *
 * @constructor
 */
lunr.TokenSet = function () {
  this.final = false
  this.edges = {}
  this.id = lunr.TokenSet._nextId
  lunr.TokenSet._nextId += 1
}

/**
 * Keeps track of the next, auto increment, identifier to assign
 * to a new tokenSet.
 *
 * TokenSets require a unique identifier to be correctly minimised.
 *
 * @private
 */
lunr.TokenSet._nextId = 1

/**
 * Creates a TokenSet instance from the given sorted array of words.
 *
 * @param {String[]} arr - A sorted array of strings to create the set from.
 * @returns {lunr.TokenSet}
 * @throws Will throw an error if the input array is not sorted.
 */
lunr.TokenSet.fromArray = function (arr) {
  var builder = new lunr.TokenSet.Builder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

/**
 * Creates a token set from a query clause.
 *
 * @private
 * @param {Object} clause - A single clause from lunr.Query.
 * @param {string} clause.term - The query clause term.
 * @param {number} [clause.editDistance] - The optional edit distance for the term.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromClause = function (clause) {
  if ('editDistance' in clause) {
    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)
  } else {
    return lunr.TokenSet.fromString(clause.term)
  }
}

/**
 * Creates a token set representing a single string with a specified
 * edit distance.
 *
 * Insertions, deletions, substitutions and transpositions are each
 * treated as an edit distance of 1.
 *
 * Increasing the allowed edit distance will have a dramatic impact
 * on the performance of both creating and intersecting these TokenSets.
 * It is advised to keep the edit distance less than 3.
 *
 * @param {string} str - The string to create the token set from.
 * @param {number} editDistance - The allowed edit distance to match.
 * @returns {lunr.Vector}
 */
lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
  var root = new lunr.TokenSet

  var stack = [{
    node: root,
    editsRemaining: editDistance,
    str: str
  }]

  while (stack.length) {
    var frame = stack.pop()

    // no edit
    if (frame.str.length > 0) {
      var char = frame.str.charAt(0),
          noEditNode

      if (char in frame.node.edges) {
        noEditNode = frame.node.edges[char]
      } else {
        noEditNode = new lunr.TokenSet
        frame.node.edges[char] = noEditNode
      }

      if (frame.str.length == 1) {
        noEditNode.final = true
      } else {
        stack.push({
          node: noEditNode,
          editsRemaining: frame.editsRemaining,
          str: frame.str.slice(1)
        })
      }
    }

    // deletion
    // can only do a deletion if we have enough edits remaining
    // and if there are characters left to delete in the string
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var char = frame.str.charAt(1),
          deletionNode

      if (char in frame.node.edges) {
        deletionNode = frame.node.edges[char]
      } else {
        deletionNode = new lunr.TokenSet
        frame.node.edges[char] = deletionNode
      }

      if (frame.str.length <= 2) {
        deletionNode.final = true
      } else {
        stack.push({
          node: deletionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(2)
        })
      }
    }

    // deletion
    // just removing the last character from the str
    if (frame.editsRemaining > 0 && frame.str.length == 1) {
      frame.node.final = true
    }

    // substitution
    // can only do a substitution if we have enough edits remaining
    // and if there are characters left to substitute
    if (frame.editsRemaining > 0 && frame.str.length >= 1) {
      if ("*" in frame.node.edges) {
        var substitutionNode = frame.node.edges["*"]
      } else {
        var substitutionNode = new lunr.TokenSet
        frame.node.edges["*"] = substitutionNode
      }

      if (frame.str.length == 1) {
        substitutionNode.final = true
      } else {
        stack.push({
          node: substitutionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        })
      }
    }

    // insertion
    // can only do insertion if there are edits remaining
    if (frame.editsRemaining > 0) {
      if ("*" in frame.node.edges) {
        var insertionNode = frame.node.edges["*"]
      } else {
        var insertionNode = new lunr.TokenSet
        frame.node.edges["*"] = insertionNode
      }

      if (frame.str.length == 0) {
        insertionNode.final = true
      } else {
        stack.push({
          node: insertionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str
        })
      }
    }

    // transposition
    // can only do a transposition if there are edits remaining
    // and there are enough characters to transpose
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var charA = frame.str.charAt(0),
          charB = frame.str.charAt(1),
          transposeNode

      if (charB in frame.node.edges) {
        transposeNode = frame.node.edges[charB]
      } else {
        transposeNode = new lunr.TokenSet
        frame.node.edges[charB] = transposeNode
      }

      if (frame.str.length == 1) {
        transposeNode.final = true
      } else {
        stack.push({
          node: transposeNode,
          editsRemaining: frame.editsRemaining - 1,
          str: charA + frame.str.slice(2)
        })
      }
    }
  }

  return root
}

/**
 * Creates a TokenSet from a string.
 *
 * The string may contain one or more wildcard characters (*)
 * that will allow wildcard matching when intersecting with
 * another TokenSet.
 *
 * @param {string} str - The string to create a TokenSet from.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromString = function (str) {
  var node = new lunr.TokenSet,
      root = node,
      wildcardFound = false

  /*
   * Iterates through all characters within the passed string
   * appending a node for each character.
   *
   * As soon as a wildcard character is found then a self
   * referencing edge is introduced to continually match
   * any number of any characters.
   */
  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i],
        final = (i == len - 1)

    if (char == "*") {
      wildcardFound = true
      node.edges[char] = node
      node.final = final

    } else {
      var next = new lunr.TokenSet
      next.final = final

      node.edges[char] = next
      node = next

      // TODO: is this needed anymore?
      if (wildcardFound) {
        node.edges["*"] = root
      }
    }
  }

  return root
}

/**
 * Converts this TokenSet into an array of strings
 * contained within the TokenSet.
 *
 * @returns {string[]}
 */
lunr.TokenSet.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop(),
        edges = Object.keys(frame.node.edges),
        len = edges.length

    if (frame.node.final) {
      words.push(frame.prefix)
    }

    for (var i = 0; i < len; i++) {
      var edge = edges[i]

      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words
}

/**
 * Generates a string representation of a TokenSet.
 *
 * This is intended to allow TokenSets to be used as keys
 * in objects, largely to aid the construction and minimisation
 * of a TokenSet. As such it is not designed to be a human
 * friendly representation of the TokenSet.
 *
 * @returns {string}
 */
lunr.TokenSet.prototype.toString = function () {
  // NOTE: Using Object.keys here as this.edges is very likely
  // to enter 'hash-mode' with many keys being added
  //
  // avoiding a for-in loop here as it leads to the function
  // being de-optimised (at least in V8). From some simple
  // benchmarks the performance is comparable, but allowing
  // V8 to optimize may mean easy performance wins in the future.

  if (this._str) {
    return this._str
  }

  var str = this.final ? '1' : '0',
      labels = Object.keys(this.edges).sort(),
      len = labels.length

  for (var i = 0; i < len; i++) {
    var label = labels[i],
        node = this.edges[label]

    str = str + label + node.id
  }

  return str
}

/**
 * Returns a new TokenSet that is the intersection of
 * this TokenSet and the passed TokenSet.
 *
 * This intersection will take into account any wildcards
 * contained within the TokenSet.
 *
 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.prototype.intersect = function (b) {
  var output = new lunr.TokenSet,
      frame = undefined

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    frame = stack.pop()

    // NOTE: As with the #toString method, we are using
    // Object.keys and a for loop instead of a for-in loop
    // as both of these objects enter 'hash' mode, causing
    // the function to be de-optimised in V8
    var qEdges = Object.keys(frame.qNode.edges),
        qLen = qEdges.length,
        nEdges = Object.keys(frame.node.edges),
        nLen = nEdges.length

    for (var q = 0; q < qLen; q++) {
      var qEdge = qEdges[q]

      for (var n = 0; n < nLen; n++) {
        var nEdge = nEdges[n]

        if (nEdge == qEdge || qEdge == '*') {
          var node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge],
              final = node.final && qNode.final,
              next = undefined

          if (nEdge in frame.output.edges) {
            // an edge already exists for this character
            // no need to create a new node, just set the finality
            // bit unless this node is already final
            next = frame.output.edges[nEdge]
            next.final = next.final || final

          } else {
            // no edge exists yet, must create one
            // set the finality bit and insert it
            // into the output
            next = new lunr.TokenSet
            next.final = final
            frame.output.edges[nEdge] = next
          }

          stack.push({
            qNode: qNode,
            output: next,
            node: node
          })
        }
      }
    }
  }

  return output
}
lunr.TokenSet.Builder = function () {
  this.previousWord = ""
  this.root = new lunr.TokenSet
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.TokenSet.Builder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.TokenSet,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.TokenSet.Builder.prototype.finish = function () {
  this.minimize(0)
}

lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i],
        childKey = node.child.toString()

    if (childKey in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[childKey]
    } else {
      // Cache the key for this node since
      // we know it can't change anymore
      node.child._str = childKey

      this.minimizedNodes[childKey] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
/*!
 * lunr.Index
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * An index contains the built index of all documents and provides a query interface
 * to the index.
 *
 * Usually instances of lunr.Index will not be created using this constructor, instead
 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
 * used to load previously built and serialized indexes.
 *
 * @constructor
 * @param {Object} attrs - The attributes of the built search index.
 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
 * @param {Object<string, lunr.Vector>} attrs.documentVectors - Document vectors keyed by document reference.
 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
 * @param {string[]} attrs.fields - The names of indexed document fields.
 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
 */
lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.fieldVectors = attrs.fieldVectors
  this.tokenSet = attrs.tokenSet
  this.fields = attrs.fields
  this.pipeline = attrs.pipeline
}

/**
 * A result contains details of a document matching a search query.
 * @typedef {Object} lunr.Index~Result
 * @property {string} ref - The reference of the document this result represents.
 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
 */

/**
 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
 * query language which itself is parsed into an instance of lunr.Query.
 *
 * For programmatically building queries it is advised to directly use lunr.Query, the query language
 * is best used for human entered text rather than program generated text.
 *
 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
 * or 'world', though those that contain both will rank higher in the results.
 *
 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
 * wildcards will increase the number of documents that will be found but can also have a negative
 * impact on query performance, especially with wildcards at the beginning of a term.
 *
 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
 * hello in the title field will match this query. Using a field not present in the index will lead
 * to an error being thrown.
 *
 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
 * Avoid large values for edit distance to improve query performance.
 *
 * To escape special characters the backslash character '\' can be used, this allows searches to include
 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
 * of attempting to apply a boost of 2 to the search term "foo".
 *
 * @typedef {string} lunr.Index~QueryString
 * @example <caption>Simple single term query</caption>
 * hello
 * @example <caption>Multiple term query</caption>
 * hello world
 * @example <caption>term scoped to a field</caption>
 * title:hello
 * @example <caption>term with a boost of 10</caption>
 * hello^10
 * @example <caption>term with an edit distance of 2</caption>
 * hello~2
 */

/**
 * Performs a search against the index using lunr query syntax.
 *
 * Results will be returned sorted by their score, the most relevant results
 * will be returned first.
 *
 * For more programmatic querying use lunr.Index#query.
 *
 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.search = function (queryString) {
  return this.query(function (query) {
    var parser = new lunr.QueryParser(queryString, query)
    parser.parse()
  })
}

/**
 * A query builder callback provides a query object to be used to express
 * the query to perform on the index.
 *
 * @callback lunr.Index~queryBuilder
 * @param {lunr.Query} query - The query object to build up.
 * @this lunr.Query
 */

/**
 * Performs a query against the index using the yielded lunr.Query object.
 *
 * If performing programmatic queries against the index, this method is preferred
 * over lunr.Index#search so as to avoid the additional query parsing overhead.
 *
 * A query object is yielded to the supplied function which should be used to
 * express the query to be run against the index.
 *
 * Note that although this function takes a callback parameter it is _not_ an
 * asynchronous operation, the callback is just yielded a query object to be
 * customized.
 *
 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.query = function (fn) {
  // for each query clause
  // * process terms
  // * expand terms from token set
  // * find matching documents and metadata
  // * get document vectors
  // * score documents

  var query = new lunr.Query(this.fields),
      matchingFields = Object.create(null),
      queryVectors = Object.create(null)

  fn.call(query, query)

  for (var i = 0; i < query.clauses.length; i++) {
    /*
     * Unless the pipeline has been disabled for this term, which is
     * the case for terms with wildcards, we need to pass the clause
     * term through the search pipeline. A pipeline returns an array
     * of processed terms. Pipeline functions may expand the passed
     * term, which means we may end up performing multiple index lookups
     * for a single query term.
     */
    var clause = query.clauses[i],
        terms = null

    if (clause.usePipeline) {
      terms = this.pipeline.runString(clause.term)
    } else {
      terms = [clause.term]
    }

    for (var m = 0; m < terms.length; m++) {
      var term = terms[m]

      /*
       * Each term returned from the pipeline needs to use the same query
       * clause object, e.g. the same boost and or edit distance. The
       * simplest way to do this is to re-use the clause object but mutate
       * its term property.
       */
      clause.term = term

      /*
       * From the term in the clause we create a token set which will then
       * be used to intersect the indexes token set to get a list of terms
       * to lookup in the inverted index
       */
      var termTokenSet = lunr.TokenSet.fromClause(clause),
          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

      for (var j = 0; j < expandedTerms.length; j++) {
        /*
         * For each term get the posting and termIndex, this is required for
         * building the query vector.
         */
        var expandedTerm = expandedTerms[j],
            posting = this.invertedIndex[expandedTerm],
            termIndex = posting._index

        for (var k = 0; k < clause.fields.length; k++) {
          /*
           * For each field that this query term is scoped by (by default
           * all fields are in scope) we need to get all the document refs
           * that have this term in that field.
           *
           * The posting is the entry in the invertedIndex for the matching
           * term from above.
           */
          var field = clause.fields[k],
              fieldPosting = posting[field],
              matchingDocumentRefs = Object.keys(fieldPosting)

          /*
           * To support field level boosts a query vector is created per
           * field. This vector is populated using the termIndex found for
           * the term and a unit value with the appropriate boost applied.
           *
           * If the query vector for this field does not exist yet it needs
           * to be created.
           */
          if (!(field in queryVectors)) {
            queryVectors[field] = new lunr.Vector
          }

          /*
           * Using upsert because there could already be an entry in the vector
           * for the term we are working with. In that case we just add the scores
           * together.
           */
          queryVectors[field].upsert(termIndex, 1 * clause.boost, function (a, b) { return a + b })

          for (var l = 0; l < matchingDocumentRefs.length; l++) {
            /*
             * All metadata for this term/field/document triple
             * are then extracted and collected into an instance
             * of lunr.MatchData ready to be returned in the query
             * results
             */
            var matchingDocumentRef = matchingDocumentRefs[l],
                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),
                documentMetadata, matchData

            documentMetadata = fieldPosting[matchingDocumentRef]
            matchData = new lunr.MatchData (expandedTerm, field, documentMetadata)

            if (matchingFieldRef in matchingFields) {
              matchingFields[matchingFieldRef].combine(matchData)
            } else {
              matchingFields[matchingFieldRef] = matchData
            }

          }
        }
      }
    }
  }

  var matchingFieldRefs = Object.keys(matchingFields),
      results = {}

  for (var i = 0; i < matchingFieldRefs.length; i++) {
    /*
     * Currently we have document fields that match the query, but we
     * need to return documents. The matchData and scores are combined
     * from multiple fields belonging to the same document.
     *
     * Scores are calculated by field, using the query vectors created
     * above, and combined into a final document score using addition.
     */
    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),
        docRef = fieldRef.docRef,
        fieldVector = this.fieldVectors[fieldRef],
        score = queryVectors[fieldRef.fieldName].similarity(fieldVector)

    if (docRef in results) {
      results[docRef].score += score
      results[docRef].matchData.combine(matchingFields[fieldRef])
    } else {
      results[docRef] = {
        ref: docRef,
        score: score,
        matchData: matchingFields[fieldRef]
      }
    }
  }

  /*
   * The results object needs to be converted into a list
   * of results, sorted by score before being returned.
   */
  return Object.keys(results)
    .map(function (key) {
      return results[key]
    })
    .sort(function (a, b) {
      return b.score - a.score
    })
}

/**
 * Prepares the index for JSON serialization.
 *
 * The schema for this JSON blob will be described in a
 * separate JSON schema file.
 *
 * @returns {Object}
 */
lunr.Index.prototype.toJSON = function () {
  var invertedIndex = Object.keys(this.invertedIndex)
    .sort()
    .map(function (term) {
      return [term, this.invertedIndex[term]]
    }, this)

  var fieldVectors = Object.keys(this.fieldVectors)
    .map(function (ref) {
      return [ref, this.fieldVectors[ref].toJSON()]
    }, this)

  return {
    version: lunr.version,
    fields: this.fields,
    fieldVectors: fieldVectors,
    invertedIndex: invertedIndex,
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Loads a previously serialized lunr.Index
 *
 * @param {Object} serializedIndex - A previously serialized lunr.Index
 * @returns {lunr.Index}
 */
lunr.Index.load = function (serializedIndex) {
  var attrs = {},
      fieldVectors = {},
      serializedVectors = serializedIndex.fieldVectors,
      invertedIndex = {},
      serializedInvertedIndex = serializedIndex.invertedIndex,
      tokenSetBuilder = new lunr.TokenSet.Builder,
      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)

  if (serializedIndex.version != lunr.version) {
    lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'")
  }

  for (var i = 0; i < serializedVectors.length; i++) {
    var tuple = serializedVectors[i],
        ref = tuple[0],
        elements = tuple[1]

    fieldVectors[ref] = new lunr.Vector(elements)
  }

  for (var i = 0; i < serializedInvertedIndex.length; i++) {
    var tuple = serializedInvertedIndex[i],
        term = tuple[0],
        posting = tuple[1]

    tokenSetBuilder.insert(term)
    invertedIndex[term] = posting
  }

  tokenSetBuilder.finish()

  attrs.fields = serializedIndex.fields

  attrs.fieldVectors = fieldVectors
  attrs.invertedIndex = invertedIndex
  attrs.tokenSet = tokenSetBuilder.root
  attrs.pipeline = pipeline

  return new lunr.Index(attrs)
}
/*!
 * lunr.Builder
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.Builder performs indexing on a set of documents and
 * returns instances of lunr.Index ready for querying.
 *
 * All configuration of the index is done via the builder, the
 * fields to index, the document reference, the text processing
 * pipeline and document scoring parameters are all set on the
 * builder before indexing.
 *
 * @constructor
 * @property {string} _ref - Internal reference to the document reference field.
 * @property {string[]} _fields - Internal reference to the document fields to index.
 * @property {object} invertedIndex - The inverted index maps terms to document fields.
 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
 * @property {number} documentCount - Keeps track of the total number of documents indexed.
 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
 */
lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = Object.create(null)
  this.fieldTermFrequencies = {}
  this.fieldLengths = {}
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.searchPipeline = new lunr.Pipeline
  this.documentCount = 0
  this._b = 0.75
  this._k1 = 1.2
  this.termIndex = 0
  this.metadataWhitelist = []
}

/**
 * Sets the document field used as the document reference. Every document must have this field.
 * The type of this field in the document should be a string, if it is not a string it will be
 * coerced into a string by calling toString.
 *
 * The default ref is 'id'.
 *
 * The ref should _not_ be changed during indexing, it should be set before any documents are
 * added to the index. Changing it during indexing can lead to inconsistent results.
 *
 * @param {string} ref - The name of the reference field in the document.
 */
lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

/**
 * Adds a field to the list of document fields that will be indexed. Every document being
 * indexed should have this field. Null values for this field in indexed documents will
 * not cause errors but will limit the chance of that document being retrieved by searches.
 *
 * All fields should be added before adding documents to the index. Adding fields after
 * a document has been indexed will have no effect on already indexed documents.
 *
 * @param {string} field - The name of a field to index in all documents.
 */
lunr.Builder.prototype.field = function (field) {
  this._fields.push(field)
}

/**
 * A parameter to tune the amount of field length normalisation that is applied when
 * calculating relevance scores. A value of 0 will completely disable any normalisation
 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
 * will be clamped to the range 0 - 1.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.b = function (number) {
  if (number < 0) {
    this._b = 0
  } else if (number > 1) {
    this._b = 1
  } else {
    this._b = number
  }
}

/**
 * A parameter that controls the speed at which a rise in term frequency results in term
 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
 * slower saturation levels, a lower value will result in quicker saturation.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.k1 = function (number) {
  this._k1 = number
}

/**
 * Adds a document to the index.
 *
 * Before adding fields to the index the index should have been fully setup, with the document
 * ref and all fields to index already having been specified.
 *
 * The document must have a field name as specified by the ref (by default this is 'id') and
 * it should have all fields defined for indexing, though null or undefined values will not
 * cause errors.
 *
 * @param {object} doc - The document to add to the index.
 */
lunr.Builder.prototype.add = function (doc) {
  var docRef = doc[this._ref]

  this.documentCount += 1

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i],
        field = doc[fieldName],
        tokens = this.tokenizer(field),
        terms = this.pipeline.run(tokens),
        fieldRef = new lunr.FieldRef (docRef, fieldName),
        fieldTerms = Object.create(null)

    this.fieldTermFrequencies[fieldRef] = fieldTerms
    this.fieldLengths[fieldRef] = 0

    // store the length of this field for this document
    this.fieldLengths[fieldRef] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (fieldTerms[term] == undefined) {
        fieldTerms[term] = 0
      }

      fieldTerms[term] += 1

      // add to inverted index
      // create an initial posting if one doesn't exist
      if (this.invertedIndex[term] == undefined) {
        var posting = Object.create(null)
        posting["_index"] = this.termIndex
        this.termIndex += 1

        for (var k = 0; k < this._fields.length; k++) {
          posting[this._fields[k]] = Object.create(null)
        }

        this.invertedIndex[term] = posting
      }

      // add an entry for this term/fieldName/docRef to the invertedIndex
      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
        this.invertedIndex[term][fieldName][docRef] = Object.create(null)
      }

      // store all whitelisted metadata about this token in the
      // inverted index
      for (var l = 0; l < this.metadataWhitelist.length; l++) {
        var metadataKey = this.metadataWhitelist[l],
            metadata = term.metadata[metadataKey]

        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
          this.invertedIndex[term][fieldName][docRef][metadataKey] = []
        }

        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)
      }
    }

  }
}

/**
 * Calculates the average document length for this index
 *
 * @private
 */
lunr.Builder.prototype.calculateAverageFieldLengths = function () {

  var fieldRefs = Object.keys(this.fieldLengths),
      numberOfFields = fieldRefs.length,
      accumulator = {},
      documentsWithField = {}

  for (var i = 0; i < numberOfFields; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName

    documentsWithField[field] || (documentsWithField[field] = 0)
    documentsWithField[field] += 1

    accumulator[field] || (accumulator[field] = 0)
    accumulator[field] += this.fieldLengths[fieldRef]
  }

  for (var i = 0; i < this._fields.length; i++) {
    var field = this._fields[i]
    accumulator[field] = accumulator[field] / documentsWithField[field]
  }

  this.averageFieldLength = accumulator
}

/**
 * Builds a vector space model of every document using lunr.Vector
 *
 * @private
 */
lunr.Builder.prototype.createFieldVectors = function () {
  var fieldVectors = {},
      fieldRefs = Object.keys(this.fieldTermFrequencies),
      fieldRefsLength = fieldRefs.length

  for (var i = 0; i < fieldRefsLength; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName,
        fieldLength = this.fieldLengths[fieldRef],
        fieldVector = new lunr.Vector,
        termFrequencies = this.fieldTermFrequencies[fieldRef],
        terms = Object.keys(termFrequencies),
        termsLength = terms.length

    for (var j = 0; j < termsLength; j++) {
      var term = terms[j],
          tf = termFrequencies[term],
          termIndex = this.invertedIndex[term]._index,
          idf = lunr.idf(this.invertedIndex[term], this.documentCount),
          score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[field])) + tf),
          scoreWithPrecision = Math.round(score * 1000) / 1000
          // Converts 1.23456789 to 1.234.
          // Reducing the precision so that the vectors take up less
          // space when serialised. Doing it now so that they behave
          // the same before and after serialisation. Also, this is
          // the fastest approach to reducing a number's precision in
          // JavaScript.

      fieldVector.insert(termIndex, scoreWithPrecision)
    }

    fieldVectors[fieldRef] = fieldVector
  }

  this.fieldVectors = fieldVectors
}

/**
 * Creates a token set of all tokens in the index using lunr.TokenSet
 *
 * @private
 */
lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

/**
 * Builds the index, creating an instance of lunr.Index.
 *
 * This completes the indexing process and should only be called
 * once all documents have been added to the index.
 *
 * @private
 * @returns {lunr.Index}
 */
lunr.Builder.prototype.build = function () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new lunr.Index({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: this._fields,
    pipeline: this.searchPipeline
  })
}

/**
 * Applies a plugin to the index builder.
 *
 * A plugin is a function that is called with the index builder as its context.
 * Plugins can be used to customise or extend the behaviour of the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied when building the index.
 *
 * The plugin function will be called with the index builder as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index builder as its context.
 *
 * @param {Function} plugin The plugin to apply.
 */
lunr.Builder.prototype.use = function (fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  fn.apply(this, args)
}
/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 * @property {object} metadata - A cloned collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData = function (term, field, metadata) {
  var clonedMetadata = Object.create(null),
      metadataKeys = Object.keys(metadata)

  // Cloning the metadata to prevent the original
  // being mutated during match data combination.
  // Metadata is kept in an array within the inverted
  // index so cloning the data can be done with
  // Array#slice
  for (var i = 0; i < metadataKeys.length; i++) {
    var key = metadataKeys[i]
    clonedMetadata[key] = metadata[key].slice()
  }

  this.metadata = Object.create(null)
  this.metadata[term] = Object.create(null)
  this.metadata[term][field] = clonedMetadata
}

/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData.prototype.combine = function (otherMatchData) {
  var terms = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i],
        fields = Object.keys(otherMatchData.metadata[term])

    if (this.metadata[term] == undefined) {
      this.metadata[term] = Object.create(null)
    }

    for (var j = 0; j < fields.length; j++) {
      var field = fields[j],
          keys = Object.keys(otherMatchData.metadata[term][field])

      if (this.metadata[term][field] == undefined) {
        this.metadata[term][field] = Object.create(null)
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]

        if (this.metadata[term][field][key] == undefined) {
          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]
        } else {
          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])
        }

      }
    }
  }
}
/**
 * A lunr.Query provides a programmatic way of defining queries to be performed
 * against a {@link lunr.Index}.
 *
 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
 * so the query object is pre-initialized with the right index fields.
 *
 * @constructor
 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
 */
lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

/**
 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
 *
 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
 * concatenation.
 *
 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
 *
 * @constant
 * @default
 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with trailing wildcard</caption>
 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
 * @example <caption>query term with leading and trailing wildcard</caption>
 * query.term('foo', {
 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
 * })
 */
lunr.Query.wildcard = new String ("*")
lunr.Query.wildcard.NONE = 0
lunr.Query.wildcard.LEADING = 1
lunr.Query.wildcard.TRAILING = 2

/**
 * A single clause in a {@link lunr.Query} contains a term and details on how to
 * match that term against a {@link lunr.Index}.
 *
 * @typedef {Object} lunr.Query~Clause
 * @property {string[]} fields - The fields in an index this clause should be matched against.
 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
 * @property {number} [wildcard=0] - Whether the term should have wildcards appended or prepended.
 */

/**
 * Adds a {@link lunr.Query~Clause} to this query.
 *
 * Unless the clause contains the fields to be matched all fields will be matched. In addition
 * a default boost of 1 is applied to the clause.
 *
 * @param {lunr.Query~Clause} clause - The clause to add to this query.
 * @see lunr.Query~Clause
 * @returns {lunr.Query}
 */
lunr.Query.prototype.clause = function (clause) {
  if (!('fields' in clause)) {
    clause.fields = this.allFields
  }

  if (!('boost' in clause)) {
    clause.boost = 1
  }

  if (!('usePipeline' in clause)) {
    clause.usePipeline = true
  }

  if (!('wildcard' in clause)) {
    clause.wildcard = lunr.Query.wildcard.NONE
  }

  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {
    clause.term = "*" + clause.term
  }

  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {
    clause.term = "" + clause.term + "*"
  }

  this.clauses.push(clause)

  return this
}

/**
 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
 * to the list of clauses that make up this query.
 *
 * @param {string} term - The term to add to the query.
 * @param {Object} [options] - Any additional properties to add to the query clause.
 * @returns {lunr.Query}
 * @see lunr.Query#clause
 * @see lunr.Query~Clause
 * @example <caption>adding a single term to a query</caption>
 * query.term("foo")
 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
 * query.term("foo", {
 *   fields: ["title"],
 *   boost: 10,
 *   wildcard: lunr.Query.wildcard.TRAILING
 * })
 */
lunr.Query.prototype.term = function (term, options) {
  var clause = options || {}
  clause.term = term

  this.clause(clause)

  return this
}
lunr.QueryParseError = function (message, start, end) {
  this.name = "QueryParseError"
  this.message = message
  this.start = start
  this.end = end
}

lunr.QueryParseError.prototype = new Error
lunr.QueryLexer = function (str) {
  this.lexemes = []
  this.str = str
  this.length = str.length
  this.pos = 0
  this.start = 0
  this.escapeCharPositions = []
}

lunr.QueryLexer.prototype.run = function () {
  var state = lunr.QueryLexer.lexText

  while (state) {
    state = state(this)
  }
}

lunr.QueryLexer.prototype.sliceString = function () {
  var subSlices = [],
      sliceStart = this.start,
      sliceEnd = this.pos

  for (var i = 0; i < this.escapeCharPositions.length; i++) {
    sliceEnd = this.escapeCharPositions[i]
    subSlices.push(this.str.slice(sliceStart, sliceEnd))
    sliceStart = sliceEnd + 1
  }

  subSlices.push(this.str.slice(sliceStart, this.pos))
  this.escapeCharPositions.length = 0

  return subSlices.join('')
}

lunr.QueryLexer.prototype.emit = function (type) {
  this.lexemes.push({
    type: type,
    str: this.sliceString(),
    start: this.start,
    end: this.pos
  })

  this.start = this.pos
}

lunr.QueryLexer.prototype.escapeCharacter = function () {
  this.escapeCharPositions.push(this.pos - 1)
  this.pos += 1
}

lunr.QueryLexer.prototype.next = function () {
  if (this.pos >= this.length) {
    return lunr.QueryLexer.EOS
  }

  var char = this.str.charAt(this.pos)
  this.pos += 1
  return char
}

lunr.QueryLexer.prototype.width = function () {
  return this.pos - this.start
}

lunr.QueryLexer.prototype.ignore = function () {
  if (this.start == this.pos) {
    this.pos += 1
  }

  this.start = this.pos
}

lunr.QueryLexer.prototype.backup = function () {
  this.pos -= 1
}

lunr.QueryLexer.prototype.acceptDigitRun = function () {
  var char, charCode

  do {
    char = this.next()
    charCode = char.charCodeAt(0)
  } while (charCode > 47 && charCode < 58)

  if (char != lunr.QueryLexer.EOS) {
    this.backup()
  }
}

lunr.QueryLexer.prototype.more = function () {
  return this.pos < this.length
}

lunr.QueryLexer.EOS = 'EOS'
lunr.QueryLexer.FIELD = 'FIELD'
lunr.QueryLexer.TERM = 'TERM'
lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'
lunr.QueryLexer.BOOST = 'BOOST'

lunr.QueryLexer.lexField = function (lexer) {
  lexer.backup()
  lexer.emit(lunr.QueryLexer.FIELD)
  lexer.ignore()
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexTerm = function (lexer) {
  if (lexer.width() > 1) {
    lexer.backup()
    lexer.emit(lunr.QueryLexer.TERM)
  }

  lexer.ignore()

  if (lexer.more()) {
    return lunr.QueryLexer.lexText
  }
}

lunr.QueryLexer.lexEditDistance = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexBoost = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.BOOST)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexEOS = function (lexer) {
  if (lexer.width() > 0) {
    lexer.emit(lunr.QueryLexer.TERM)
  }
}

// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
lunr.QueryLexer.termSeparator = lunr.tokenizer.separator

lunr.QueryLexer.lexText = function (lexer) {
  while (true) {
    var char = lexer.next()

    if (char == lunr.QueryLexer.EOS) {
      return lunr.QueryLexer.lexEOS
    }

    // Escape character is '\'
    if (char.charCodeAt(0) == 92) {
      lexer.escapeCharacter()
      continue
    }

    if (char == ":") {
      return lunr.QueryLexer.lexField
    }

    if (char == "~") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexEditDistance
    }

    if (char == "^") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexBoost
    }

    if (char.match(lunr.QueryLexer.termSeparator)) {
      return lunr.QueryLexer.lexTerm
    }
  }
}

lunr.QueryParser = function (str, query) {
  this.lexer = new lunr.QueryLexer (str)
  this.query = query
  this.currentClause = {}
  this.lexemeIdx = 0
}

lunr.QueryParser.prototype.parse = function () {
  this.lexer.run()
  this.lexemes = this.lexer.lexemes

  var state = lunr.QueryParser.parseFieldOrTerm

  while (state) {
    state = state(this)
  }

  return this.query
}

lunr.QueryParser.prototype.peekLexeme = function () {
  return this.lexemes[this.lexemeIdx]
}

lunr.QueryParser.prototype.consumeLexeme = function () {
  var lexeme = this.peekLexeme()
  this.lexemeIdx += 1
  return lexeme
}

lunr.QueryParser.prototype.nextClause = function () {
  var completedClause = this.currentClause
  this.query.clause(completedClause)
  this.currentClause = {}
}

lunr.QueryParser.parseFieldOrTerm = function (parser) {
  var lexeme = parser.peekLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.type) {
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expected either a field or a term, found " + lexeme.type

      if (lexeme.str.length >= 1) {
        errorMessage += " with value '" + lexeme.str + "'"
      }

      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }
}

lunr.QueryParser.parseField = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  if (parser.query.allFields.indexOf(lexeme.str) == -1) {
    var possibleFields = parser.query.allFields.map(function (f) { return "'" + f + "'" }).join(', '),
        errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields

    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.fields = [lexeme.str]

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseTerm = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  parser.currentClause.term = lexeme.str.toLowerCase()

  if (lexeme.str.indexOf("*") != -1) {
    parser.currentClause.usePipeline = false
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseEditDistance = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var editDistance = parseInt(lexeme.str, 10)

  if (isNaN(editDistance)) {
    var errorMessage = "edit distance must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.editDistance = editDistance

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseBoost = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var boost = parseInt(lexeme.str, 10)

  if (isNaN(boost)) {
    var errorMessage = "boost must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.boost = boost

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();

},{}],69:[function(require,module,exports){
(function (global){
'use strict';
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

ko.bindingHandlers.stopBinding = {
    init: function() {
        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.stopBinding = true;

ko.bindingHandlers.lazyBinding = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.utils.domData.set(element, 'isBound', false)
        
        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
        return { controlsDescendantBindings: true };
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var val = ko.unwrap(valueAccessor()),
            isBound = ko.utils.domData.get(element, 'isBound');
        if (val && !isBound) {
            ko.utils.domData.set(element, 'isBound', true);
            ko.applyBindingsToDescendants(bindingContext, element);
        }
    }
};

ko.virtualElements.allowedBindings.lazyBinding = true;

ko.bindingHandlers.itemBuildTable = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var buildExplorer = ko.unwrap(valueAccessor()),
            $el = $(element);

        var pressedKeys = {};
        ko.utils.domData.set(element, 'pressedKeys', pressedKeys);
        
        var keyDownHandler = function(e) {
            var pressedKeys = ko.utils.domData.get(element, 'pressedKeys');
            pressedKeys[e.which] = true;
            ko.utils.domData.set(element, 'pressedKeys', pressedKeys);
        }
        ko.utils.domData.set(element, 'keyDownHandler', keyDownHandler);
        
        var keyUpHandler = function(e) {
            var pressedKeys = ko.utils.domData.get(element, 'pressedKeys');
            if ((pressedKeys[17] && pressedKeys[67]) || (pressedKeys[17] && pressedKeys[86])) { // ctrl + c
                var $hoveredRows = $(element).find('.hover-cursor:hover');
                if ($hoveredRows.length == 1) {
                    if (pressedKeys[67]) {
                        buildExplorer.copyInventoryToClipBoard($("tr", $(element)).index($hoveredRows[0]));
                    }
                    else {
                        buildExplorer.pasteInventoryFromClipBoard($("tr", $(element)).index($hoveredRows[0]));
                    }
                    $hoveredRows.fadeOut(50).fadeIn(50);
                }
            }
            delete pressedKeys[e.which];
            ko.utils.domData.set(element, 'pressedKeys', pressedKeys);
        }
        ko.utils.domData.set(element, 'keyUpHandler', keyUpHandler);
        
        $(document).bind( "keydown", keyDownHandler );
        $(document).bind( "keyup", keyUpHandler );

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            var keyDownHandler = ko.utils.domData.get(element, 'keyDownHandler');
            var keyUpHandler = ko.utils.domData.get(element, 'keyUpHandler');
            $(document).unbind( "keydown", keyDownHandler );
            $(document).unbind( "keyup", keyUpHandler );
        });
    }
};

ko.bindingHandlers.preventBubble = {
    init: function(element, valueAccessor) {
        var eventName = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.registerEventHandler(element, eventName, function(event) {
           event.cancelBubble = true;
           if (event.stopPropagation) {
                event.stopPropagation();
           }                
        });
    }        
};

ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.applyBindingsToNode(element, {
            click: function () {
                value(!value());
            }
        });
    }
};

ko.bindingHandlers.shopDockStyle = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (bindingContext.$data.shopDock() && !bindingContext.$data.shopPopout()) {
            ko.applyBindingsToNode(element, { style: { height: (bindingContext.$data.windowHeight() - 52) + 'px', position: 'fixed', right: 0, top: '52px', 'overflow-y': 'auto' } });
        }
        else {
            ko.applyBindingsToNode(element, { style: { height: 'auto', position: 'relative', right: 'initial', top: 'initial', 'overflow-y': 'initial' } });
        }
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (bindingContext.$data.shopDock() && !bindingContext.$data.shopPopout()) {
            ko.applyBindingsToNode(element, { style: { height: (bindingContext.$data.windowHeight() - 52) + 'px', position: 'fixed', right: 0, top: '52px', 'overflow-y': 'auto' } });
        }
        else {
            ko.applyBindingsToNode(element, { style: { height: 'auto', position: 'relative', right: 'initial', top: 'initial', 'overflow-y': 'initial' } });
        }
    }
};

ko.bindingHandlers.logger = {
    update: function(element, valueAccessor, allBindings) {
        //store a counter with this element
        var count = ko.utils.domData.get(element, "_ko_logger") || 0,
            data = ko.toJS(valueAccessor() || allBindings());

        ko.utils.domData.set(element, "_ko_logger", ++count);

        if (window.console && console.log) {
            console.log(count, element, data);
        }
    }
};

ko.bindingHandlers.tooltip = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element, options, tooltip;
        options = ko.utils.unwrapObservable(valueAccessor());
        $element = $(element);

        // If the title is an observable, make it auto-updating.
        if (ko.isObservable(options.title)) {
            var isToolTipVisible = false;

            $element.on('show.bs.tooltip', function () {
                isToolTipVisible = true;
            });
            $element.on('hide.bs.tooltip', function () {
                isToolTipVisible = false;
            });

            // "true" is the bootstrap default.
            var origAnimation = options.animation || true;
            options.title.subscribe(function () {
                if (isToolTipVisible) {
                    $element.data('bs.tooltip').options.animation = false; // temporarily disable animation to avoid flickering of the tooltip
                    $element.tooltip('fixTitle') // call this method to update the title
                        .tooltip('show');
                    $element.data('bs.tooltip').options.animation = origAnimation;
                }
            });
        }

        tooltip = $element.data('bs.tooltip');
        if (tooltip) {
            $.extend(tooltip.options, options);
        } else {
            $element.tooltip(options);
        }
    }
};

ko.bindingHandlers.popover = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);
        var popoverBindingValues = ko.utils.unwrapObservable(valueAccessor());
        var template = popoverBindingValues.template || false;
        var options = popoverBindingValues.options || {title: 'popover'};
        var data = popoverBindingValues.data || false;
        if (template !== false) {
            if (data) {
                options.content = "<!-- ko template: { name: template, if: data, data: data } --><!-- /ko -->";
            }
            else {
                options.content = $('#' + template).html();
            }
            options.html = true;
        }
        $element.on('shown.bs.popover', function(event) {

            var popoverData = $(event.target).data();
            var popoverEl = popoverData['bs.popover'].$tip;
            var options = popoverData['bs.popover'].options || {};
            var button = $(event.target);
            var buttonPosition = button.position();
            var buttonDimensions = {
                x: button.outerWidth(),
                y: button.outerHeight()
            };

            if (data) {
                ko.applyBindingsToNode(popoverEl[0], { template: { name: template, data: data } }, bindingContext);
                //ko.applyBindings({template: template, data: data}, popoverEl[0]);
                //ko.renderTemplate(template, data, {}, popoverEl[0], 'replaceChildren');
            }
            else {
                //ko.renderTemplate(template, data, {}, popoverEl[0], 'replaceChildren');
                //ko.applyBindings(viewModel, popoverEl[0]);
            }

            var popoverDimensions = {
                x: popoverEl.outerWidth(),
                y: popoverEl.outerHeight()
            };

            popoverEl.find('button[data-dismiss="popover"]').click(function() {
                button.popover('hide');
            });

            switch (options.placement) {
                case 'right':
                    popoverEl.css({
                        left: buttonDimensions.x + buttonPosition.left,
                        top: (buttonDimensions.y / 2 + buttonPosition.top) - popoverDimensions.y / 2
                    });
                    break;
                case 'left':
                    popoverEl.css({
                        left: buttonPosition.left - popoverDimensions.x,
                        top: (buttonDimensions.y / 2 + buttonPosition.top) - popoverDimensions.y / 2
                    });
                    break;
                case 'top':
                    popoverEl.css({
                        left: buttonPosition.left + (buttonDimensions.x / 2 - popoverDimensions.x / 2),
                        top: buttonPosition.top - popoverDimensions.y
                    });
                    break;
                case 'bottom':
                    popoverEl.css({
                        left: buttonPosition.left + (buttonDimensions.x / 2 - popoverDimensions.x / 2),
                        top: buttonPosition.top + buttonDimensions.y
                    });
                    break;
            }
        });

        $element.popover(options);

        return { controlsDescendantBindings: true };

    }
};

ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newCanvas = $('<canvas/>'),
      data = ko.utils.unwrapObservable(valueAccessor()),
      ctx = newCanvas[0].getContext("2d"),
      chartType = allBindingsAccessor().chartType,
      options = allBindingsAccessor().chartOptions || {},
      chartContext = allBindingsAccessor().chartContext;
            
        $(element).append(newCanvas);
        var myChart = new Chart(ctx)[chartType](data, options);
        ko.utils.domData.set(element, 'myChart', myChart);
        
  //handle disposal (if KO removes by the template binding)
  ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
    var myChart = ko.utils.domData.get(element, 'myChart');
    myChart.clear();
    myChart.destroy();
  });
        
  if (chartContext) {
    chartContext(ctx);
  }
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newCanvas = $('<canvas/>').width(730).height(365),
      data = ko.utils.unwrapObservable(valueAccessor()),
      ctx = newCanvas[0].getContext("2d"),
      chartType = allBindingsAccessor().chartType,
      options = allBindingsAccessor().chartOptions || {},
      chartContext = allBindingsAccessor().chartContext,
      myChart = ko.utils.domData.get(element, 'myChart');
        
  if (myChart) {
    myChart.clear();
    myChart.destroy();
  }
        bindingContext.$root.displayShop();
        bindingContext.$root.sideView();
        bindingContext.$root.shopDock();
        $(element).empty();
        $(element).append(newCanvas);
  if (data.datasets.length > 0) {
            myChart = new Chart(ctx)[chartType](data, options);
            ko.utils.domData.set(element, 'myChart', myChart);
  }
  
  if (chartContext) {
    chartContext(ctx);
  }
    }
};

ko.bindingHandlers.spinner = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().spinnerOptions || {};
        options.icons = options.icons || { down: "glyphicon glyphicon-triangle-bottom", up: "glyphicon glyphicon-triangle-top" };
        $(element).spinner(options);

        //handle the field changing
        ko.utils.registerEventHandler(element, "spinchange", function () {
            var observable = valueAccessor();
            observable($(element).spinner("value"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).spinner("destroy");
        });

    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).spinner("value");

        if (value !== current) {
            $(element).spinner("value", value);
        }
    }
};

ko.bindingHandlers.secondTab = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $root = bindingContext.$root,
            value = ko.utils.unwrapObservable(valueAccessor());
        ko.applyBindingsToNode(element, { css: {'second-tab': $root.isSecondTab(value) && $root.sideView()} });
    }
};

ko.bindingHandlers.hoverTab = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $root = bindingContext.$root,
            value = ko.utils.unwrapObservable(valueAccessor());
            
        ko.utils.registerEventHandler(element, "mouseover", function() {
            $root.highlightTab(value);
        });  

        ko.utils.registerEventHandler(element, "mouseout", function() {
            $root.unhighlightTab(value);
        });      
    }
};

ko.bindingHandlers.hoverPaneStyle = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $root = bindingContext.$root,
            value = ko.utils.unwrapObservable(valueAccessor());
        ko.applyBindingsToNode(element, { style: { opacity: !($root.sideView()) || $root.highlightedTab() == value || $root.highlightedTab() == '' ? 1 : .5 } });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $root = bindingContext.$root,
            value = ko.utils.unwrapObservable(valueAccessor());
        ko.applyBindingsToNode(element, { style: { opacity: !($root.sideView()) || $root.highlightedTab() == value || $root.highlightedTab() == '' ? 1 : .5 } });
    }
};

ko.bindingHandlers.diffStyle = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.applyBindingsToNode(element, { css: {'diffPos': value > 0, 'diffNeg': value < 0} });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.applyBindingsToNode(element, { css: {'diffPos': value > 0, 'diffNeg': value < 0} });
    }
};

ko.bindingHandlers.diffCss = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            stat = allBindingsAccessor().diffCssStat;
        if (stat == 'attackTime' || stat == 'bat') {
            value = -value;
        }
        ko.applyBindingsToNode(element, { css: {'diffPos': value > 0, 'diffNeg': value < 0} });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            stat = allBindingsAccessor().diffCssStat;
        if (stat == 'attackTime' || stat == 'bat') {
            value = -value;
        }
        ko.applyBindingsToNode(element, { css: {'diffPos': value > 0, 'diffNeg': value < 0} });
    }
};

ko.bindingHandlers.jqAuto = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.jqAutoValue,
            source = allBindings.jqAutoSource,
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
            labelProp = allBindings.jqAutoSourceLabel || valueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
               modelValue(valueToWrite );  
            } else {  //write to non-observable
               if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                        allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite );    
            }
        }
        
        //on a selection write the proper value to the model
        options.select = function(event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
        };
            
        //on a change, make sure that it is a valid value or clear out the model value
        options.change = function(event, ui) {
            var currentValue = $(element).val();
            var matchingItem =  ko.utils.arrayFirst(unwrap(source), function(item) {
               return unwrap(item[inputValueProp]) === currentValue;  
            });
            
            if (!matchingItem) {
               writeValueToModel(null);
            }    
        }
        
        
        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable(function() {
            var mapped = ko.utils.arrayMap(unwrap(source), function(item) {
                var result = {};
                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                return result;
            });
            return mapped;                
        });
        
        //whenever the items that make up the source are updated, make sure that autocomplete knows it
        mappedSource.subscribe(function(newValue) {
           $(element).autocomplete("option", "source", newValue); 
        });
        
        options.source = mappedSource();
        
        options.minLength = 1;
        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
       //update value based on a model change
       var allBindings = allBindingsAccessor(),
           unwrap = ko.utils.unwrapObservable,
           modelValue = unwrap(allBindings.jqAutoValue) || '', 
           valueProp = allBindings.jqAutoSourceValue,
           inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;
        
       //if we are writing a different property to the input than we are writing to the model, then locate the object
       if (valueProp && inputValueProp !== valueProp) {
           var source = unwrap(allBindings.jqAutoSource) || [];
           var modelValue = ko.utils.arrayFirst(source, function(item) {
                 return unwrap(item[valueProp]) === modelValue;
           }) || {};  //probably don't need the || {}, but just protect against a bad value          
       } 

       //update the element with the value that should be shown in the input
       $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());    
    }
};

ko.bindingHandlers.jqAutoCombo = {
    init: function(element, valueAccessor) {
       var autoEl = $("#" + valueAccessor());
       
        $(element).click(function() {
           // close if already visible
            if (autoEl.autocomplete("widget").is(":visible")) {
                autoEl.autocomplete( "close" );
                return;
            }

           //autoEl.blur();
            autoEl.autocomplete("search", " ");
            autoEl.focus(); 
            
        });
        
    }  
}

module.exports = ko;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(require,module,exports){
(function (global){
'use strict';
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
//require('jquery-ui');
require('jquery-ui/ui/version');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/unique-id');
require('jquery-ui/ui/safe-active-element');
require('jquery-ui/ui/keycode');
require('jquery-ui/ui/position');
require('jquery-ui/ui/focusable');
require('jquery-ui/ui/tabbable');
require('jquery-ui/ui/plugin');
require('jquery-ui/ui/ie');
require('jquery-ui/ui/data');
require('jquery-ui/ui/scroll-parent');
require('jquery-ui/ui/disable-selection');
require('jquery-ui/ui/safe-blur');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/ui/widgets/spinner');
require('jquery-ui/ui/widgets/menu');
require('jquery-ui/ui/widgets/autocomplete');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/resizable');
require('jquery-ui/ui/widgets/dialog');

var proto = $.ui.autocomplete.prototype,
    initSource = proto._initSource;

function filter( array, term ) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
    return $.grep( array, function(value) {
        return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
    });
}

$.extend( proto, {
    _initSource: function() {
        if ( this.options.html && $.isArray(this.options.source) ) {
            this.source = function( request, response ) {
                response( filter( this.options.source, request.term ) );
            };
        } else {
            initSource.call( this );
        }
    },

    _renderItem: function( ul, item) {
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
            .appendTo( ul );
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery-ui/ui/data":46,"jquery-ui/ui/disable-selection":47,"jquery-ui/ui/focusable":48,"jquery-ui/ui/ie":49,"jquery-ui/ui/keycode":50,"jquery-ui/ui/plugin":51,"jquery-ui/ui/position":52,"jquery-ui/ui/safe-active-element":53,"jquery-ui/ui/safe-blur":54,"jquery-ui/ui/scroll-parent":55,"jquery-ui/ui/tabbable":56,"jquery-ui/ui/unique-id":57,"jquery-ui/ui/version":58,"jquery-ui/ui/widget":59,"jquery-ui/ui/widgets/autocomplete":60,"jquery-ui/ui/widgets/button":61,"jquery-ui/ui/widgets/dialog":62,"jquery-ui/ui/widgets/draggable":63,"jquery-ui/ui/widgets/menu":64,"jquery-ui/ui/widgets/mouse":65,"jquery-ui/ui/widgets/resizable":66,"jquery-ui/ui/widgets/spinner":67}],71:[function(require,module,exports){
function ViewModel(params) {
    var self = this;
    self.windowWidth = params.windowWidth;
    self.windowHeight = params.windowHeight;
    self.displayShop = params.displayShop;
    self.displayShopItemTooltip = params.displayShopItemTooltip;
    self.shopDock = params.shopDock;
    self.shopDockTrigger = params.shopDockTrigger;
    self.shopPopout = params.shopPopout;
    self.selectedItem = params.selectedItem;
    self.addItem = params.addItem;
    self.changeSelectedItem = params.changeSelectedItem;
    self.getItemTooltipData = params.getItemTooltipData;
    self.getItemInputLabel = params.getItemInputLabel;
    self.itemInputValue = params.itemInputValue;
    self.itemOptions = params.itemOptions;
}

module.exports = {
    viewModel: ViewModel,
    template: "        <div id=\"shop-container\" class=\"col-md-12 col-lg-4\" data-bind=\"shopDockStyle: shopDockTrigger, visible: displayShop() || shopPopout(), css: {'col-lg-4': !shopPopout()}, style: { 'padding-top': shopPopout() ? '5px' : '0px'}\">\n              <button id=\"shop-minimize\" class=\"btn btn-default btn-xs shop-button glyphicon glyphicon-minus pull-right\" data-bind=\"toggle: displayShop, visible: displayShop()\" title=\"Minimize shop\"></button>\n              <button id=\"shop-maximize\" class=\"btn btn-default btn-xs shop-button glyphicon glyphicon-plus pull-right\" data-bind=\"toggle: displayShop, visible: !displayShop()\" title=\"Maximize shop\"></button>\n              <button class=\"btn btn-default btn-xs shop-button glyphicon glyphicon-new-window pull-right hidden-xs\" data-bind=\"click: shopPopout, visible: !shopPopout()\" title=\"Popout shop\"></button>\n              <button class=\"btn btn-default btn-xs shop-button glyphicon glyphicon-align-right pull-right hidden-xs\" data-bind=\"toggle: shopDock, attr: { title: shopDock() ? 'Undock shop to right side of screen' : 'Dock shop to right side of screen' }\" ></button>\n            <ul id=\"shoptabs\" class=\"nav nav-tabs\" data-bind=\"visible: displayShop()\">\n              <li><a href=\"#shop_basic\" data-toggle=\"tab\">Basic</a></li>\n              <li><a href=\"#shop_upgrade\" data-toggle=\"tab\">Upgrade</a></li>\n              <li><a href=\"#shop_secret\" data-toggle=\"tab\">Secret</a></li>\n            </ul>\n            <div class=\"tab-content text-center bottom-buffer2\" data-bind=\"visible: displayShop()\">\n                <div class=\"tab-pane active\" id=\"shop_basic\">\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-consumables\" id=\"consumables\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-clarity\" id=\"clarity\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-faerie_fire\" id=\"faerie_fire\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-enchanted_mango\" id=\"enchanted_mango\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-tango\" id=\"tango\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-flask\" id=\"flask\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-smoke_of_deceit\" id=\"smoke_of_deceit\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-tpscroll\" id=\"tpscroll\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-dust\" id=\"dust\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-courier\" id=\"courier\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-flying_courier\" id=\"flying_courier\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ward_observer\" id=\"ward_observer\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ward_sentry\" id=\"ward_sentry\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-tome_of_knowledge\" id=\"tome_of_knowledge\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-bottle\" id=\"bottle\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-attributes\" id=\"attributes\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-branches\" id=\"branches\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-gauntlets\" id=\"gauntlets\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-slippers\" id=\"slippers\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mantle\" id=\"mantle\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-circlet\" id=\"circlet\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-belt_of_strength\" id=\"belt_of_strength\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-boots_of_elves\" id=\"boots_of_elves\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-robe\" id=\"robe\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ogre_axe\" id=\"ogre_axe\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-blade_of_alacrity\" id=\"blade_of_alacrity\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-staff_of_wizardry\" id=\"staff_of_wizardry\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-emptyitembg\" id=\"emptyitembg\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-emptyitembg\" id=\"emptyitembg\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-emptyitembg\" id=\"emptyitembg\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-armaments\" id=\"armaments\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ring_of_protection\" id=\"ring_of_protection\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-stout_shield\" id=\"stout_shield\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-quelling_blade\" id=\"quelling_blade\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-infused_raindrop\" id=\"infused_raindrop\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-blight_stone\" id=\"blight_stone\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-orb_of_venom\" id=\"orb_of_venom\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-blades_of_attack\" id=\"blades_of_attack\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-chainmail\" id=\"chainmail\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-quarterstaff\" id=\"quarterstaff\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-helm_of_iron_will\" id=\"helm_of_iron_will\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-broadsword\" id=\"broadsword\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-claymore\" id=\"claymore\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-javelin\" id=\"javelin\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mithril_hammer\" id=\"mithril_hammer\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-arcane\" id=\"arcane\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-wind_lace\" id=\"wind_lace\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-magic_stick\" id=\"magic_stick\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-sobi_mask\" id=\"sobi_mask\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ring_of_regen\" id=\"ring_of_regen\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-boots\" id=\"boots\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-gloves\" id=\"gloves\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-cloak\" id=\"cloak\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ring_of_health\" id=\"ring_of_health\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-void_stone\" id=\"void_stone\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-gem\" id=\"gem\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-lifesteal\" id=\"lifesteal\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-shadow_amulet\" id=\"shadow_amulet\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ghost\" id=\"ghost\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-blink\" id=\"blink\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n\n\n                </div>\n                <div class=\"tab-pane\" id=\"shop_upgrade\">\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-common\" id=\"common\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-magic_wand\" id=\"magic_wand\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-null_talisman\" id=\"null_talisman\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-wraith_band\" id=\"wraith_band\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-poor_mans_shield\" id=\"poor_mans_shield\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-bracer\" id=\"bracer\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-soul_ring\" id=\"soul_ring\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-phase_boots\" id=\"phase_boots\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-power_treads\" id=\"power_treads\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-oblivion_staff\" id=\"oblivion_staff\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-pers\" id=\"pers\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-hand_of_midas\" id=\"hand_of_midas\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-travel_boots\" id=\"travel_boots\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-moon_shard\" id=\"moon_shard\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-emptyitembg\" id=\"emptyitembg\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-support\" id=\"support\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ring_of_basilius\" id=\"ring_of_basilius\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-iron_talon\" id=\"iron_talon\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-headdress\" id=\"headdress\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-buckler\" id=\"buckler\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-urn_of_shadows\" id=\"urn_of_shadows\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-tranquil_boots\" id=\"tranquil_boots\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ring_of_aquila\" id=\"ring_of_aquila\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-medallion_of_courage\" id=\"medallion_of_courage\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-arcane_boots\" id=\"arcane_boots\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ancient_janggo\" id=\"ancient_janggo\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mekansm\" id=\"mekansm\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-vladmir\" id=\"vladmir\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-pipe\" id=\"pipe\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-guardian_greaves\" id=\"guardian_greaves\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-caster\" id=\"caster\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-glimmer_cape\" id=\"glimmer_cape\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-force_staff\" id=\"force_staff\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-veil_of_discord\" id=\"veil_of_discord\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-aether_lens\" id=\"aether_lens\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-necronomicon\" id=\"necronomicon\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-dagon\" id=\"dagon\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-cyclone\" id=\"cyclone\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-solar_crest\" id=\"solar_crest\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-rod_of_atos\" id=\"rod_of_atos\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-orchid\" id=\"orchid\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ultimate_scepter\" id=\"ultimate_scepter\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-refresher\" id=\"refresher\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-sheepstick\" id=\"sheepstick\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-octarine_core\" id=\"octarine_core\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-weapons\" id=\"weapons\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-lesser_crit\" id=\"lesser_crit\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-armlet\" id=\"armlet\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-invis_sword\" id=\"invis_sword\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-basher\" id=\"basher\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-bfury\" id=\"bfury\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ethereal_blade\" id=\"ethereal_blade\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-silver_edge\" id=\"silver_edge\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-radiance\" id=\"radiance\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-monkey_king_bar\" id=\"monkey_king_bar\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-greater_crit\" id=\"greater_crit\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-butterfly\" id=\"butterfly\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-rapier\" id=\"rapier\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-abyssal_blade\" id=\"abyssal_blade\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-bloodthorn\" id=\"bloodthorn\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-armor\" id=\"armor\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-hood_of_defiance\" id=\"hood_of_defiance\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-vanguard\" id=\"vanguard\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-blade_mail\" id=\"blade_mail\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-soul_booster\" id=\"soul_booster\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-crimson_guard\" id=\"crimson_guard\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-black_king_bar\" id=\"black_king_bar\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-lotus_orb\" id=\"lotus_orb\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-shivas_guard\" id=\"shivas_guard\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-bloodstone\" id=\"bloodstone\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-manta\" id=\"manta\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-sphere\" id=\"sphere\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-hurricane_pike\" id=\"hurricane_pike\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-assault\" id=\"assault\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-heart\" id=\"heart\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-artifacts\" id=\"artifacts\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mask_of_madness\" id=\"mask_of_madness\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-helm_of_the_dominator\" id=\"helm_of_the_dominator\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-dragon_lance\" id=\"dragon_lance\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-sange\" id=\"sange\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-yasha\" id=\"yasha\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-echo_sabre\" id=\"echo_sabre\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-maelstrom\" id=\"maelstrom\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-diffusal_blade\" id=\"diffusal_blade\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-desolator\" id=\"desolator\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-heavens_halberd\" id=\"heavens_halberd\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-sange_and_yasha\" id=\"sange_and_yasha\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-skadi\" id=\"skadi\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mjollnir\" id=\"mjollnir\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-satanic\" id=\"satanic\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n                </div>\n                <div class=\"tab-pane\" id=\"shop_secret\">\n<div class=\"shop-column\">\n  <div class=\"hc-shop hc-shop-secret\" id=\"secret\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-energy_booster\" id=\"energy_booster\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-vitality_booster\" id=\"vitality_booster\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-point_booster\" id=\"point_booster\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-platemail\" id=\"platemail\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-talisman_of_evasion\" id=\"talisman_of_evasion\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-hyperstone\" id=\"hyperstone\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-ultimate_orb\" id=\"ultimate_orb\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-demon_edge\" id=\"demon_edge\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-mystic_staff\" id=\"mystic_staff\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-eagle\" id=\"eagle\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-reaver\" id=\"reaver\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n  <div class=\"img-rounded items-sprite-50x36 items-sprite-relic\" id=\"relic\" data-bind=\"click: changeSelectedItem, event: { dblclick: addItem }\"></div>\n</div>\n                </div>\n            </div>\n\n            <div class=\"form-group\" data-bind=\"visible: displayShop()\">\n                <div class=\"input-group\">\n                    <input class=\"form-control\" id=\"auto\" data-bind=\"jqAuto: { autoFocus: true, html: true }, jqAutoSource: itemOptions, jqAutoValue: selectedItem, jqAutoSourceLabel: 'displayname', jqAutoSourceInputValue: 'name', jqAutoSourceValue: 'value'\" />\n                    <span class=\"input-group-btn\">\n                        <button class=\"btn btn-default\" data-bind=\"jqAutoCombo: 'auto'\"><span class=\"glyphicon glyphicon-search\"></span></button>\n                    </span>\n                </div>\n            </div>\n\n            <div data-bind=\"visible: selectedItem() && displayShop()\">\n                <button class=\"btn btn-default btn-xs glyphicon glyphicon-minus pull-right\" data-bind=\"toggle: displayShopItemTooltip, visible: displayShopItemTooltip()\" title=\"Hide item description\"></button>\n                <button class=\"btn btn-default btn-xs glyphicon glyphicon-plus pull-right\" data-bind=\"toggle: displayShopItemTooltip, visible: !displayShopItemTooltip()\" title=\"Show item description\"></button>\n                <div data-bind=\"html: getItemTooltipData, css: { 'hide-shop-item-details': !displayShopItemTooltip() }\"></div>\n                <div style=\"margin-top:10px;margin-bottom:10px;\" class=\"form-inline\" data-bind=\"visible: getItemInputLabel() != ''\">\n                    <div class=\"form-group\">\n                        <label for=\"iteminput\" data-bind=\"text: getItemInputLabel\"></label>\n                        <input class=\"form-control\" id=\"iteminput\" data-bind=\"value: itemInputValue\" />\n                    </div>\n                </div>\n                <div class=\"form-group text-right\">\n                    <button class=\"btn btn-default\" data-bind=\"click: addItem\">Add Item</button>\n                </div>\n            </div>\n        </div>"
};
},{}],72:[function(require,module,exports){
require('./app/jquery-ui.custom');
var ko = require('./app/herocalc_knockout');
var HeroCalc = require("dota-hero-calculator-library");
var lunr = require('lunr');

var App = function (appConfig) {
    
    HeroCalc.init(HeroCalcData.heroData, HeroCalcData.itemData, HeroCalcData.unitData, function () {
        var HeroModel = require("dota-hero-calculator-library/src/herocalc/hero/HeroModel");
        var itemData = require("dota-hero-calculator-library/src/herocalc/data/main").itemData;
        var heroData = require("dota-hero-calculator-library/src/herocalc/data/main").heroData;
        var stackableItems = require("dota-hero-calculator-library/src/herocalc/inventory/stackableItems");
        var levelItems = require("dota-hero-calculator-library/src/herocalc/inventory/levelItems");
        var itemsWithActive = require("dota-hero-calculator-library/src/herocalc/inventory/itemsWithActive");
        var BasicInventoryViewModel = require("dota-hero-calculator-library/src/herocalc/inventory/BasicInventoryViewModel");
        var getItemTooltipData = require("dota-hero-calculator-library/src/herocalc/herocalc_tooltips_item");

        ko.components.register('shop', require('./components/shop'));

        ko.bindingHandlers['class'] = {
            'update': function(element, valueAccessor) {
                if (element['__ko__previousClassValue__']) {
                    $(element).removeClass(element['__ko__previousClassValue__']);
                }
                var value = ko.utils.unwrapObservable(valueAccessor());
                $(element).addClass(value);
                element['__ko__previousClassValue__'] = value;
            }
        };

        function ViewModel() {
            var self = this;
            self.loaded = ko.observable(false);
            
            self.filterVisible = ko.observable(false);
            self.toggleFilterVisibility = function() {
                self.filterVisible(!self.filterVisible());
            }
            self.columnsVisible = ko.observable(false);
            self.toggleColumnVisibility = function() {
                self.columnsVisible(!self.columnsVisible());
            }
            self.filterTemplateToUse = function(item) {
                return item.filterType + '-filter';
            }
            
            self.sortLabelClick = function(index, data, event) {
                self.sortColumns.remove(data);
            };
            self.labelHTML = function(index, data) {
                if (self.sortDirections()[self.sortColumns()[index()]]() == -1) {
                    return "<a href=\"#\">" + data.header + "</a>"
                } else if (self.sortDirections()[self.sortColumns()[index()]]() == 1) {
                    return "<a href=\"#\">" + data.header + "</a>"
                } else {
                    return ""
                }
            }
            self.clearLabels = function() {
                self.sortColumns.removeAll();
            }
            self.clearFilters = function() {
                for (var i = 0; i < self.headers().length; i++) {
                    if (self.headers()[i].filterValue != undefined) {
                        self.headers()[i].filterValue(null);
                    }
                }
            }
            
            self.getCellClass = function (header, hero) {
                var s = 'text-' + header.align + ' td-' + header.id;
                if (header.id == 'displayname' && hero.heroData().displayname.length >= 12) {
                    s += ' long-header';
                }
                return s;
            }
            
            self.getData = function (hero, i) {
                var header = self.headers()[i];
                var prop = self.headers()[i].id;
                var val;
                switch (prop) {
                    case 'icon':
                        val = '<div class="heroes-sprite-' + hero.heroId() + ' heroes-sprite-32x18"></div>';
                    break;
                    case 'displayname':
                        val = hero.heroData()[prop];
                    break;
                    case 'attributeprimary':
                        val = hero.heroData()[prop].replace('DOTA_ATTRIBUTE_', '').slice(0, 3);
                    break;
                    case 'attacktype':
                        val = hero.heroData()[prop].replace('DOTA_UNIT_CAP_', '').replace('_ATTACK', '');
                    break;
                    case 'attributeagilitygain':
                    case 'attributeintelligencegain':
                    case 'attributestrengthgain':
                    case 'attackpoint':
                    case 'projectilespeed':
                        val = hero.heroData()[prop];
                    break;
                    case 'attackdamage':
                        val = hero.damageTotalInfo().totalRow[0]().toFixed(2);
                    break;
                    case 'dps':
                        val = hero.damageTotalInfo().totalRow[2]().toFixed(2);
                    break;
                    default:
                        val = hero[prop]();
                    break;
                }
                if (header.filterType == 'numeric') return parseFloat(val);
                return val;
            }
            
            self.headers = ko.observableArray(require('./table.headers'));
            for (var i = 0; i < self.headers().length; i++) {
                self.headers()[i].defaultDisplay = ko.observable(self.headers()[i].display());
                (function (i) {
                    self.headers()[i].display.subscribe(function(newValue) {
                        var j = i + 1;
                        var $td = $('td:nth-child(' + j + ')');
                        if (newValue) {
                            $td.show();
                        }
                        else {
                            $td.hide();
                        }
                    });
                })(i);
            }
            self.headerHTML = function(index, data) {
                return data.header;
                if (self.sortDirections()[index()]() == -1) {
                    return "<a href=\"#\">" + data.header + " <div class=\"glyphicon glyphicon-chevron-down\"></div></a>"
                } else if (self.sortDirections()[index()]() == 1) {
                    return "<a href=\"#\">" + data.header + " <div class=\"glyphicon glyphicon-chevron-up\"></div></a>"
                } else {
                    return ""
                }
            }
                
            this.selectedHeroLevel = ko.observable(1);
            this.selectedHeroLevel.subscribe(function (newValue) {
                self.heroes().forEach(function (hero) {
                   hero.selectedHeroLevel(parseInt(newValue));
                });
                self.sortTable();
            });
            
            this.heroes = ko.observableArray([]);
            for (var h in heroData) {
                var hero = new HeroModel(heroData, itemData, h.replace('npc_dota_hero_', ''));
                hero.rowVisible = ko.observable(true);
                this.heroes.push(hero);
            }

            self.shiftKey = ko.observable(false);
            self.multiSortValue = ko.observable(false);
            self.multiSort = ko.pureComputed({
                read: function () {
                    return this.multiSortValue() || this.shiftKey();
                },
                write: function (value) {
                    this.multiSortValue(value);
                },
                owner: this
            });
            self.sortDirections = ko.observableArray([]);
            self.initSortDirections = function() {
                for (var i = 0; i < self.headers().length; i++) {
                    self.sortDirections.push(new ko.observable(1));
                }
            }
            self.initSortDirections();
            self.sortColumn = ko.observable(1);
            self.columnClick = function(index, data, event) {
                self.sortDirections()[index()](-1 * self.sortDirections()[index()]());
                if (self.sortColumns.indexOf(index()) < 0) {
                    if (event.shiftKey || self.multiSort()) {
                        self.sortColumns.push(index());
                    } else {
                        self.sortColumns.removeAll();
                        self.sortColumns.push(index());
                    }
                }
                self.sortColumn(index());
                
                self.sortTable();
            };
            self.sortColumns = ko.observableArray([]);
            self.sortColumns.push(1);
            
            self.hideAllColumns = function() {
                for (var i = 0; i < self.headers().length; i++) {
                    self.headers()[i].display(false);
                }
            }
            self.resetColumns = function() {
                for (var i = 0; i < self.headers().length; i++) {
                    self.headers()[i].display(self.headers()[i].defaultDisplay());
                }
            }
            
            self.toggleColumn = function(index, data, event) {
                self.headers()[index()].display(!self.headers()[index()].display())
            };
            
            self.sortTable = function () {
                self.heroes.sort(function(a, b) {
                    var i = 0;
                    while (i < self.sortColumns().length) {
                        var headerIndex = self.sortColumns()[i];
                        var prop = self.headers()[headerIndex].id;
                        var aval = self.getData(a, headerIndex);
                        var bval = self.getData(b, headerIndex);
                        if (self.sortColumns()[i] > 2) {
                            if (aval > bval) return 1 * self.sortDirections()[self.sortColumns()[i]]();
                            if (aval < bval) return -1 * self.sortDirections()[self.sortColumns()[i]]();
                        } else {
                            if (aval > bval) return 1 * self.sortDirections()[self.sortColumns()[i]]();
                            if (aval < bval) return -1 * self.sortDirections()[self.sortColumns()[i]]();
                        }
                        i += 1;
                    }
                    return 0;
                });
            }
            
            self.doFilter = ko.computed(function () {
                self.heroes().forEach(function(hero) {
                    var values = self.headers().map(function (header, i) {
                        return self.getData(hero, i);
                    });
                    hero.rowVisible(
                        values.every(function(item, i) {
                            if (!self.headers()[i].filter) return true;
                            if (!self.headers()[i].filterValue()) return true;
                            switch (self.headers()[i].filterType) {
                                case 'numeric':
                                    switch (self.headers()[i].filterComparison()) {
                                        case 'gt':
                                            return item > parseFloat(self.headers()[i].filterValue());
                                            break;
                                        case 'lt':
                                            return item < parseFloat(self.headers()[i].filterValue());
                                            break;
                                        case 'ge':
                                            return item >= parseFloat(self.headers()[i].filterValue());
                                            break;
                                        case 'le':
                                            return item <= parseFloat(self.headers()[i].filterValue());
                                            break;
                                        case 'eq':
                                            return item == parseFloat(self.headers()[i].filterValue());
                                            break;
                                    }
                                    break;
                                case 'string':
                                    return self.headers()[i].id == 'displayname' || item.toLowerCase().indexOf(self.headers()[i].filterValue().toLowerCase()) != -1;
                                    break;
                                case 'select':
                                    return item == self.headers()[i].filterValue();
                                    break;
                            }
                            return self.headers()[i].filter;
                        })
                    );
                });
                
                var displaynameFilterValue = self.headers().filter(function (header) {
                    return header.id == 'displayname';
                })[0].filterValue();
                
                if (displaynameFilterValue) {
                    var heroIdx = lunr(function () {
                        this.field('displayname');
                        this.ref('HeroID');
                        
                        self.heroes().filter(function (hero) {
                            return hero.rowVisible();
                        }).forEach(function (hero) {
                            this.add(hero.heroData());
                        }, this);
                    });
                    
                    var matchingHeroIds = heroIdx.search(displaynameFilterValue).map(function (o) { return o.ref });
                    self.heroes().forEach(function(hero) {
                        hero.rowVisible(hero.rowVisible() && matchingHeroIds.indexOf(hero.heroData().HeroID.toString()) != -1);
                    });
                }
                
            }).extend({ deferred: true });;
            
            self.rowCount = ko.computed(function () {
                return self.heroes().filter(function (hero) {
                    return hero.rowVisible();
                }).length;           
            });
            
            this.inventory = new BasicInventoryViewModel();
            this.inventory.removeItem = (function (fn) {
                return function (item) {
                    fn(item);
                    self.heroes().forEach(function (hero) {
                        hero.inventory.removeItem(item);
                    });
                }
            })(this.inventory.removeItem);
            this.inventory.toggleItem = (function (fn) {
                return function (index, data, event) {
                    fn(index, data, event);
                    self.heroes().forEach(function (hero) {
                        if (itemsWithActive.indexOf(data.item) >= 0) {
                            if (hero.inventory.activeItems.indexOf(data) < 0) {
                                hero.inventory.activeItems.push(data);
                            }
                            else {
                                hero.inventory.activeItems.remove(data);
                            }
                        }
                    });
                }
            })(this.inventory.removeItem);
            
            
            self.exportCSV = function() {
                var d = [];
                d.push(
                    self.headers().filter(function (header) {
                        return header.display();
                    }).map(function (header) {
                        return header.title;
                    })
                );
                self.heroes().forEach(function (hero) {
                    d.push(
                        self.headers().filter(function (header) {
                            return header.display();
                        }).map(function (header, i) {
                            return self.getData(hero, i);
                        })
                    );
                });
                
                var csvContent = "data:text/csv;charset=utf-8,";
                d.forEach(function(infoArray, index){
                   dataString = infoArray.join(",");
                   csvContent += index < d.length ? dataString+ "\n" : dataString;
                }); 
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "hero_stats.csv");
                document.body.appendChild(link); // Required for FF

                link.click();
                document.body.removeChild(link); // Required for FF
            }
            

            
            self.addItem = function (data, event) {
                self.inventory.addItem(data, event);
                var item = self.inventory.items()[self.inventory.items().length-1];
                self.heroes().forEach(function (hero) {
                    hero.inventory.items.push(item);
                });
            }
            self.itemOptions = ko.computed(function () {
                return self.heroes()[0].inventory.itemOptions();
            });

            self.displayShop = ko.observable(false);
            self.displayShopItemTooltip = ko.observable(true);
            var $window = $(window);
            self.windowWidth = ko.observable($window.width());
            self.windowHeight = ko.observable($window.height());
            $window.resize(function () { 
                self.windowWidth($window.width());
                self.windowHeight($window.height());
            });
            self.shopDock = ko.observable(false);
            self.shopDock.subscribe(function (newValue) {
                if (newValue) {
                    self.shopPopout(false);
                }
                else {
                }
            });

            self.shopDockTrigger = ko.computed(function () {
                self.windowWidth();
                self.shopDock();
            });
            self.shopPopout = ko.observable(false);
            self.shopPopout.subscribe(function (newValue) {
                if (newValue) {
                    self.displayShop(true);
                    $( "#shop-dialog" ).dialog({
                        minWidth: 380,
                        minHeight: 0,
                        closeText: "",
                        open: function ( event, ui ) {
                            $(event.target.offsetParent).find('.ui-dialog-titlebar').find('button')
                                .addClass('close glyphicon glyphicon-remove shop-button btn btn-default btn-xs pull-right')
                                .removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close close')
                                .css('margin-right','0px')
                                .parent()
                                    .append($('#shop-minimize'))
                                    .append($('#shop-maximize'));
                            $(event.target.offsetParent).find('.ui-dialog-titlebar').dblclick(function () {
                                self.displayShop(!self.displayShop());
                            });
                        },
                        close: function ( event, ui ) {
                            self.shopPopout(false);
                        }
                    });
                }
                else {
                    $('#shop-container').prepend($('#shop-minimize')).prepend($('#shop-maximize'));
                    $( "#shop-dialog" ).dialog("destroy");
                }
            });
            
            self.selectedItem = ko.observable();
            
            self.changeSelectedItem = function (data, event) {
                self.itemInputValue(1);
                self.selectedItem(event.target.id);
            }
            
            self.getItemTooltipData = ko.computed(function () {
                return getItemTooltipData(itemData, self.selectedItem());
            }, this);
            self.getItemInputLabel = ko.computed(function () {
                if (stackableItems.indexOf(self.selectedItem()) != -1) {
                    return 'Stack Size'
                }
                else if (levelItems.indexOf(self.selectedItem()) != -1) {
                    return 'Upgrade Level'
                }
                else if (self.selectedItem() == 'bloodstone') {
                    return 'Charges'
                }
                else {
                    return ''
                }
            }, this);
            self.itemInputValue = ko.observable(1);
        }

        var vm = new ViewModel();

        document.body.addEventListener('keydown', function(event) {
            vm.shiftKey(!!event.shiftKey);
        }, true);

        document.body.addEventListener('keyup', function(event) {
            vm.shiftKey(!!event.shiftKey);
        }, true);

        ko.applyBindings(vm);

        $('#multiSort-tooltip').tooltip({container : 'body'});
        $('.header-tooltip').tooltip({container : 'body'});
        $('.header-row > th').tooltip({container : 'body'});

        vm.loaded(true);
        $('#spinner').hide();
    });

};

module.exports = App;
},{"./app/herocalc_knockout":69,"./app/jquery-ui.custom":70,"./components/shop":71,"./table.headers":73,"dota-hero-calculator-library":34,"dota-hero-calculator-library/src/herocalc/data/main":7,"dota-hero-calculator-library/src/herocalc/hero/HeroModel":11,"dota-hero-calculator-library/src/herocalc/herocalc_tooltips_item":22,"dota-hero-calculator-library/src/herocalc/inventory/BasicInventoryViewModel":24,"dota-hero-calculator-library/src/herocalc/inventory/itemsWithActive":30,"dota-hero-calculator-library/src/herocalc/inventory/levelItems":31,"dota-hero-calculator-library/src/herocalc/inventory/stackableItems":32,"lunr":68}],73:[function(require,module,exports){
module.exports = [
    {
        "id": "icon",
        "header": "ICON",
        "title": "Hero Icon",
        "align": "center",
        "display": ko.observable(true),
        "filter": false
    },
    {
        "id": "displayname",
        "header": "NAME",
        "title": "Hero Name (multiple search terms allowed, separated by space. * wildcards allowed, i.e. sv* matches Sven, *don matches Abaddon)",
        "align": "center",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "string",
        "filterValue": ko.observable()
    },
    {
        "id": "attributeprimary",
        "header": "PSTAT",
        "title": "Primary Stat",
        "align": "center",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "select",
        "filterValue": ko.observable(),
        "filterOptions": [
            {
                "text": 'Agility',
                "value": 'AGI'
            },
            {
                "text": 'Strength',
                "value": 'STR'
            },
            {
                "text": 'Intelligence',
                "value": 'INT'
            }
        ]
    },
    {
        "id": "totalAgi",
        "header": "AGI",
        "title": "Agility",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributeagilitygain",
        "header": "AGIG",
        "title": "Agility Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalInt",
        "header": "INT",
        "title": "Intelligence",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributeintelligencegain",
        "header": "INTG",
        "title": "Intelligence Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalStr",
        "header": "STR",
        "title": "Strength",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributestrengthgain",
        "header": "STRG",
        "title": "Strength Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "health",
        "header": "HP",
        "title": "Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "healthregen",
        "header": "HPR",
        "title": "Health Regen",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "mana",
        "header": "MP",
        "title": "Mana",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "manaregen",
        "header": "MPR",
        "title": "Mana Regen",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalArmorPhysical",
        "header": "ARMR",
        "title": "Armor",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalArmorPhysicalReduction",
        "header": "%PR",
        "title": "%Physical Damage Reduction",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalMovementSpeed",
        "header": "MS",
        "title": "Movement Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalTurnRate",
        "header": "TR",
        "title": "Turn Rate",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageAvg",
        "header": "BAVG",
        "title": "Base Damage Average",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageMin",
        "header": "BMIN",
        "title": "Base Damage Min",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageMax",
        "header": "BMAX",
        "title": "Base Damage Max",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bonusDamage",
        "header": "BD",
        "title": "Bonus Damage",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bonusDamageReduction",
        "header": "BDR",
        "title": "Bonus Damage Reduction",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageAvg",
        "header": "DAVG",
        "title": "Damage Average",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageMin",
        "header": "DMIN",
        "title": "Damage Min",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageMax",
        "header": "DMAX",
        "title": "Damage Max",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalMagicResistance",
        "header": "%MR",
        "title": "Magic Resistance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bat",
        "header": "BAT",
        "title": "Base Attack Time",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ias",
        "header": "IAS",
        "title": "Increased Attack Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attacktype",
        "header": "ATKT",
        "title": "Attack Type",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "select",
        "filterValue": ko.observable(),
        "filterOptions": [
            {
                "text": 'Ranged',
                "value": 'RANGED'
            },
            {
                "text": 'Melee',
                "value": 'MELEE'
            }
        ]
    },
    {
        "id": "attackTime",
        "header": "AT",
        "title": "Attack Time",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attacksPerSecond",
        "header": "APS",
        "title": "Attacks Per Second",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attackpoint",
        "header": "ATKP",
        "title": "Attack Point",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "projectilespeed",
        "header": "PSPD",
        "title": "Projectile Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "evasion",
        "header": "EVA",
        "title": "Evasion",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ehpPhysical",
        "header": "PEHP",
        "title": "Physical Effective Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ehpMagical",
        "header": "MEHP",
        "title": "Magical Effective Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bash",
        "header": "BASH",
        "title": "Bash Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "critChance",
        "header": "%CRT",
        "title": "Crit Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "missChance",
        "header": "MISS",
        "title": "Miss Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalattackrange",
        "header": "RNGE",
        "title": "Attack Range",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "visionrangeday",
        "header": "VISD",
        "title": "Vision Range Day",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "visionrangenight",
        "header": "VISN",
        "title": "Vision Range Night",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "lifesteal",
        "header": "LS",
        "title": "Lifesteal",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attackdamage",
        "header": "ATKD",
        "title": "Attack Damage",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "dps",
        "header": "DPS",
        "title": "Damage Per Second",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    }
]
},{}]},{},[72])(72)
});
//# sourceMappingURL=bundle.js.map
