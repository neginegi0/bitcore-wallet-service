var Mangacore_ = {
  btc: require('mangacore-lib'),
  bch: require('mangacore-lib-cash')
};

var _ = require('lodash');

function BCHAddressTranslator() {
};


BCHAddressTranslator.getAddressCoin = function(address) {
  try {
    new Mangacore_['btc'].Address(address);
    return 'legacy';
  } catch (e) {
    try {
      var a= new Mangacore_['bch'].Address(address);
      if (a.toString() == address) return 'copay';
      return 'cashaddr';
    } catch (e) {
      return;
    }
  }
};


// Supports 3 formats:  legacy (1xxx, mxxxx); Copay: (Cxxx, Hxxx), Cashaddr(qxxx);
BCHAddressTranslator.translate = function(addresses, to, from) {
  var wasArray = true;
  if (!_.isArray(addresses)) {
    wasArray = false;
    addresses = [addresses];
  }


  from = from || BCHAddressTranslator.getAddressCoin(addresses[0]);
  if (from == to) return addresses;
  var ret =  _.map(addresses, function(x) {

    var mangacore = Mangacore_[from == 'legacy' ? 'btc' : 'bch'];
    var orig = new mangacore.Address(x).toObject();

    if (to == 'cashaddr') {
      return Mangacore_['bch'].Address.fromObject(orig).toCashAddress(true);
    } else if (to == 'copay') {
      return Mangacore_['bch'].Address.fromObject(orig).toString();
    } else if (to == 'legacy') {
      return Mangacore_['btc'].Address.fromObject(orig).toString();
    }
  });

  if (wasArray) 
    return ret;
  else 
    return ret[0];

};


module.exports = BCHAddressTranslator;
