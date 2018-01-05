
angular.module('altranModule')
.filter('numberEx', ['numberFilter', '$locale',
  function(number, $locale) {

    var formats = $locale.NUMBER_FORMATS;
    return function(input, fractionSize) {
      var formattedValue = number(input, fractionSize);

      var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

      if (decimalIdx == -1) return formattedValue;

      var whole = formattedValue.substring(0, decimalIdx);
      var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

      return whole +  decimal.substring(1);
    };
  }
])
.filter('scoring', function(){
    return function(number){
      if(number==0) return 'btn btn-danger fa fa-thumbs-o-down';
      if(number>0 && number<=25) return 'btn fa fa-thumbs-o-down';
      if(number>25 && number <=50) return 'btn fa fa-thumbs-o-up';
      else return 'btn btn-success fa fa-thumbs-o-up';
    }
});


