/*!
    Brain Memory - 1.0.0
    Author: Amine Amazou
    Description: A Javascript library designed to simplify and enhance browser local and session storage management, drawing inspiration from the human brain's memory mechanism.
    Github Link: https://github.com/amine-amazou/brain-memory
    Copyright © 2024 amazou
    Licensed under the MIT license.
    https://github.com/amine-amazou/brain-memory/blob/main/LICENSE
*/

;let BrainMemory = (function(window) {

    "use strict"

    function defaultArg(arg = false) {
        return arg;
    }

    function noContent() {
        return '';
    }

    function isString(anything) {
        return typeof anything == 'string' || anything instanceof String;
    }

    function isNotString(anything) {
        return !(isString(anything));
    }

    function isArray(anything) {
        if('isArray' in Array || Array.isArray) return Array.isArray(anything)
        else return typeof anything == 'object' && anything instanceof Array;
    }

    function isNotArray(anything) {
        return !(isArray(anything))
    }

    function isBoolean(anything) {
        anything = takeInCountBooleanTrickyCases(anything);
        return anything === false && typeof anything == 'boolean' || (anything instanceof Boolean);
    }

    function isNull(anything) {
        return anything == null;
    } 

    function isNotNull(anything) {
        return !(isNull(anything));
    }

    function isBooleanOrNull(anything) {
        return isBoolean(anything) || isNull(anything);
    }

    function isObject(anything) {
        return anything instanceof Object && typeof anything == 'object';
    }

    function isInstanceOf(anything, instances = [Object]) {
        if(isNotArray(instances)) instances = [instances];
        let isInstance = true;
        instances.forEach(instance => {
            if(!(anything instanceof instance)) isInstance = false;
        })
        return isInstance;
    }

    function reformatKey(key, prefix) {
        if(key.startsWith(prefix + '-')) return key
        else {
            if(typeof prefix !== 'undefined') {
                return prefix + '-' + key;
            }
        } 
        return key
    }

    function reformatPrefix(rawPrefix) {
        if(rawPrefix.endsWith('-')) return rawPrefix;
        return rawPrefix.concat('-');
    }

    function deletePrefixFromKey(key, prefix) {
        return key.replace(reformatPrefix(prefix), noContent());
    }

    function takeInCountBooleanTrickyCases(anything) {
        if(typeof anything == 'string') anything = anything.trim();
        if(anything == 0 || anything === 'false' || anything === '0') return false;
        if(anything == 1 || anything === 'true' || anything === '1')  return true;
        return anything;
    }

    function isMemoryInstanceNotLocalOrSessionStorage(instance) {
        return !(instance === localStorage || instance === sessionStorage)
    }

    function hasKey(object, key) {
        return Object.keys(object).includes(key);
    }

    function isObjectPrototypeHasProperty(object, method) {
        if(isNotNull(object) && isObject(object)) {
            if(isNotNull(object.prototype)) {
                if(isNotNull(method) && isString(method)) {
                    return isNotNull(object.prototype[method]);
                }
            }
        }
        return false;
    }

    function isObjectHasStaticProperty(object, method) {
        if(isNotNull(object) && isObject(object)) {
            if(isNotNull(method) && isString(method)) {
                return isNotNull(object[method]);
            }
        }
        return false;
    }

    function isKeyContainsSelector(key) {
        if(isNotString(key)) throw new Error('Invalid argument type: "key" parameter must be a string.'); 
        if(String.prototype.indexOf) return !(key.indexOf('.') == -1);
        else {
            let containsSelector = false;
            for(let i = 0; i < key.length; i++) {
                if(key[i] == '.') {
                    containsSelector = true;
                    break;
                }
            }
            return containsSelector;
        }
    }


    class MemoryInterface {

        constructor(instance, prefix = defaultArg()) {
            if(isMemoryInstanceNotLocalOrSessionStorage(instance)) throw new Error('Invalid memory instance: must be localStorage or sessionStorage.');
            if(prefix !== defaultArg()) this.prefix(prefix);
            this.instance = instance;
        }

        prefix(prefix) {
            if(isString(prefix)) {
                this._prefix = prefix
                return this;
            }
            throw new Error('Invalid argument type: "prefix" parameter must be a string.');
        }

        hasPrefix() {
            return !(isBooleanOrNull(this._prefix));
        }

        hasRecord(key) {
            let has = false;
            key = reformatKey(key, this._prefix);
            if(isObjectHasStaticProperty(this.instance, 'getItem')) has = isNotNull(this.instance.getItem(key)) 
            try {
                has = key in this.instance;
            } catch {
                has = hasKey(this.instance, key);
            } finally {
                return has;
            }
        }

        record(key, value, rewrite = defaultArg(true)) {
            if(this.hasPrefix()) key = reformatKey(key, this._prefix);
            let selector;
            let loopStarter = 0;
            if(isKeyContainsSelector(key)) {
                selector = key.split('.');
                key = selector[0];
                if(Array.prototype.shift) {
                    selector.shift()
                } else {
                    loopStarter = 1;
                }
            }
            if(isNotNull(selector)) {
                if(rewrite || !(this.hasRecord(key))) {
                    let reversedSelector = selector.reverse();
                    for(let i = loopStarter; i < reversedSelector.length; i++) {
                        if(reversedSelector[i] == '') break;
                        let subKey = reversedSelector[i];
                        let object = {};
                        object[subKey] = value;
                        value = object;
                    }
                } else {
                    let record = this.recallOne(key);
                    let oldValue = record;
                    for(let i = loopStarter; i < selector.length - 1; i++) {
                        if(selector[i] == '') break;
                        let subKey = selector[i];
                        oldValue = oldValue[subKey];
                    }
                    let lastKey = selector[selector.length - 1];
                    oldValue[lastKey] = value;
                    value = record;
                }
                
            } 
            if(isObject(value)) value = JSON.stringify(value);
            if(isObjectHasStaticProperty(this.instance, 'setItem')) this.instance.setItem(key, value);
            else this.instance[key] = value;
            return this;
        } 

        update(key, newValue) {
            return this.record(key, newValue, false);
        }

        recallOne(key, defaultValue = defaultArg(), recordDefaultValue = defaultArg()) {
            recordDefaultValue = takeInCountBooleanTrickyCases(recordDefaultValue);
            if(this.hasPrefix()) key = reformatKey(key, this._prefix);
            let alreadyRecorded = this.hasRecord(key);
            let val;
            if(alreadyRecorded) {
                if(isObjectPrototypeHasProperty(this.instance, 'getItem')) val = this.instance.getItem(key);
                else val = this.instance[key];
                try {
                    val = JSON.parse(val);
                } finally {
                    return val;
                }
                
            } else {
                if(recordDefaultValue) {
                    this.record(key, defaultValue);
                }
                return defaultValue;
            }
        }
        
        recall(keys, defaultValues = defaultArg(), recordDefaultValues = defaultArg()) {
            recordDefaultValues = takeInCountBooleanTrickyCases(recordDefaultValues);
            if(isNotArray(keys)) {
                return this.recallOne(keys, defaultValues, recordDefaultValues);
            }
            let records = {};
            keys.forEach(k => {
                let defaultValue = defaultValues[k] ?? defaultArg();
                let recordDefaultValue = isArray(recordDefaultValues) ? recordDefaultValues.includes(k) : recordDefaultValues;
                records[k] = this.recallOne(k, defaultValue, recordDefaultValue);
            })
            records.get = function(key) {
                return this[key] ?? null;
            }
            if(defaultValues !== defaultArg()) {
                records.recordDefaults = function(keys = defaultArg()) {
                    if(keys == defaultArg()) keys = Object.entries(records).filter(recordEntry => typeof recordEntry[1] != 'function').map(entry => entry[0]);
                    else if(isNotArray(keys)) {
                        keys = [keys]
                        if(keys.length == 0) Object.entries(records).filter(recordEntry => typeof recordEntry[1] != 'function').map(entry => entry[0]);
                    } 
                    keys.forEach(key => this.record(key, records.get(key)))
                }.bind(this);
            } 
            return records;
        }

        recallMany = function(keys, defaultValues = defaultArg(), recordDefaultValues = defaultArg()) {
            return this.recall(keys, defaultValues, recordDefaultValues);
        };

        recallExcept = function(keys, defaultValues = defaultArg(), recordDefaultValues = defaultArg()) {
            let allTheKeys = Object.keys(this.instance);
            if(this.hasPrefix()) allTheKeys = allTheKeys.filter(key => key.startsWith(reformatPrefix(this._prefix)).map(key => deletePrefixFromKey(key, this._prefix)));
            if(isNotArray(keys)) keys = [keys];
            let keysToRemember = allTheKeys.filter(key => !(keys.includes(key)));
            return this.recall(keysToRemember, defaultValues, recordDefaultValues);
        };

        recallAll() {
            let allTheKeys = Object.keys(this.instance);
            if(this.hasPrefix()) allTheKeys = allTheKeys.filter(key => key.startsWith(this._prefix + '-')).map(key => key.replace(this._prefix + '-', ''));
            return this.recall(allTheKeys);
        }

        forget(keys = defaultArg()) {
            if(isNotArray(keys)) keys = [keys];
            keys.forEach(key => {
                if(this.hasPrefix()) key = reformatKey(key, this._prefix);
                if(key != defaultArg()) this.instance.removeItem(key);
            })
            return true;
        }

        forgetExcept(keys) {
            if(isNotArray(keys)) keys = [keys];
            let allTheKeys = Object.keys(this.instance);
            if(this.hasPrefix()) allTheKeys = allTheKeys.filter(key => key.startsWith(this._prefix + '-')).map(key => key.replace(this._prefix + '-', ''));
            let keysToForget = allTheKeys.filter(key => !(keys.includes(key)));
            return this.forget(keysToForget);
        }

        forgetAll(condition = true) {
            if(condition === true) {
                if(this.hasPrefix()) {
                    let keysToForget = Object.keys(this.instance).filter(key => key.startsWith(this._prefix + '-')).map(key => key.replace(this._prefix + '-', ''));
                    this.forget(keysToForget);
                } else {
                    this.instance.clear();
                }
                return true;
            }
            return false;
        }

    }

    

    class BrainMemory {

        static permanent = function(prefix) {
            if(!(isObjectHasStaticProperty(window, 'localStorage'))) throw Error('Your browser does not support local storage. Unfortunately, this library relies on local storage to function correctly. Please consider using a different browser or enabling local storage in your current browser')
            return new MemoryInterface(localStorage, prefix);
        }
        static temp = function(prefix) {
            if(!(isObjectHasStaticProperty(window, 'sessionStorage'))) throw Error('Your browser does not support session storage. Unfortunately, this library relies on local storage to function correctly. Please consider using a different browser or enabling session storage in your current browser')
            return new MemoryInterface(sessionStorage, prefix);
        }

        static temporary = this.temp;
        static last = this.permanent;
       
    }

    return BrainMemory
    
}(window));
