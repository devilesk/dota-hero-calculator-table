define(["require","exports","module"],function(t,o,r){"use strict";function e(){}var n=e;n.prototype.heroData={},n.prototype.itemData={},n.prototype.unitData={},n.prototype.abilityData={},n.prototype.idCounter=0,n.prototype.uniqueId=function(t){var o=++n.prototype.idCounter+"";return t?t+o:o},n.prototype.findWhere=function(t,o){t:for(var r=0;r<t.length;r++){for(var e in o)if(t[r][e]!=o[e])continue t;return t[r]}},n.prototype.uniques=function(t){for(var o=[],r=0,e=t.length;e>r;r++)-1===o.indexOf(t[r])&&""!==t[r]&&o.push(t[r]);return o},n.prototype.union=function(t,o){var r=t.concat(o);return n.prototype.uniques(r)},o.HEROCALCULATOR=e});